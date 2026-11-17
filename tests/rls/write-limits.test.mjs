import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '../..');
const MIGRATIONS_DIR = path.join(REPO_ROOT, 'supabase', 'migrations');

const db = new PGlite({ extensions: { pgcrypto } });

let failures = 0;
function check(name, cond) {
  console.log((cond ? 'PASS' : 'FAIL') + ' -- ' + name);
  if (!cond) failures++;
}

async function exec(sql, label) {
  try {
    await db.exec(sql);
  } catch (e) {
    throw new Error(`[${label}] ${e.message}`);
  }
}

async function rejected(sql) {
  try {
    await db.query(sql);
    return false;
  } catch (e) {
    return true;
  }
}

async function main() {
  await exec(`
    create extension if not exists pgcrypto;
    create schema if not exists auth;
    create table auth.users (
      id uuid primary key default gen_random_uuid(),
      email text unique,
      raw_user_meta_data jsonb
    );
    create or replace function auth.uid() returns uuid
    language sql stable as $$
      select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid
    $$;
    create role anon;
    create role authenticated;
    create schema if not exists storage;
    create table storage.buckets (id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects (
      id uuid primary key default gen_random_uuid(),
      bucket_id text,
      name text,
      owner uuid
    );
    alter table storage.objects enable row level security;
    create or replace function storage.foldername(name text) returns text[]
      language sql immutable as $$ select string_to_array(name, '/') $$;
    grant select, insert on storage.objects to anon, authenticated;
    grant select on storage.buckets to anon, authenticated;
    grant usage on schema storage to anon, authenticated;
  `, 'bootstrap');

  await exec(readFileSync(path.join(REPO_ROOT, 'supabase', 'schema_baseline.sql'), 'utf8'), 'schema_baseline');
  for (const file of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()) {
    await exec(readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'), file);
  }
  console.log('Applied schema_baseline.sql and every migration: OK\n');

  const USER_A = '22222222-2222-2222-2222-222222222222';
  const USER_B = '33333333-3333-3333-3333-333333333333';
  const USER_C = '44444444-4444-4444-4444-444444444444';
  const LONG_LOCAL = 'a'.repeat(60);

  await exec(`
    insert into auth.users (id, email) values
      ('${USER_A}', 'usera@example.com'),
      ('${USER_B}', 'userb@example.com'),
      ('${USER_C}', 'userc@example.com');
    insert into auth.users (email) values ('${LONG_LOCAL}@example.com');
    insert into auth.users (email, raw_user_meta_data) values ('blank@example.com', '{"display_name":"   "}');
  `, 'seed-users');

  async function asUser(uuid, fn) {
    await db.exec(`
      set role authenticated;
      select set_config('request.jwt.claims', json_build_object('sub', '${uuid}')::text, false);
    `);
    try {
      return await fn();
    } finally {
      await db.exec(`reset role; select set_config('request.jwt.claims', '{}', false);`);
    }
  }

  console.log('--- display names ---');

  {
    const r = await db.query(`select p.display_name from public.profiles p join auth.users u on u.id = p.id where u.email = '${LONG_LOCAL}@example.com'`);
    check('signing up with a very long email still works and the name is cut to 40 characters', r.rows.length === 1 && r.rows[0].display_name.length === 40);
    const b = await db.query(`select p.display_name from public.profiles p join auth.users u on u.id = p.id where u.email = 'blank@example.com'`);
    check('a blank chosen name falls back to the email name', b.rows.length === 1 && b.rows[0].display_name === 'blank');
  }

  await asUser(USER_A, async () => {
    check('a display name over 40 characters is rejected',
      await rejected(`update public.profiles set display_name = '${'x'.repeat(41)}' where id = '${USER_A}'`));
    check('an empty display name is rejected',
      await rejected(`update public.profiles set display_name = '   ' where id = '${USER_A}'`));
    check('a normal display name is accepted',
      !(await rejected(`update public.profiles set display_name = 'Ada Lovelace' where id = '${USER_A}'`)));
  });

  console.log('\n--- text lengths ---');

  await asUser(USER_A, async () => {
    check('a protocol with a 201 character title is rejected',
      await rejected(`insert into public.biolab_practicals (slug, title, acknowledged_disclaimer) values ('long-title', '${'t'.repeat(201)}', true)`));
    check('a protocol with a 50001 character body is rejected',
      await rejected(`insert into public.biolab_practicals (slug, title, body, acknowledged_disclaimer) values ('long-body', 'Fine', '${'b'.repeat(50001)}', true)`));
    check('a rating for a path that is not a site path is rejected',
      await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ('${USER_A}', 'https://elsewhere.example/', 8)`));
    check('a rating for an over-long path is rejected',
      await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ('${USER_A}', '/${'p'.repeat(300)}', 8)`));
    check('a normal rating is accepted',
      !(await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ('${USER_A}', '/resources/7-genetics/', 8)`)));
  });

  console.log('\n--- contribution source link ---');

  await asUser(USER_A, async () => {
    check('a javascript: source link is rejected',
      await rejected(`insert into public.paper_contributions (olympiad, year, round_label, license_note, source_url) values ('IBO', '2020', 'R1', 'note', 'javascript:alert(1)')`));
    check('a data: source link is rejected',
      await rejected(`insert into public.paper_contributions (olympiad, year, round_label, license_note, source_url) values ('IBO', '2020', 'R1', 'note', 'data:text/html,x')`));
    check('an https source link is accepted',
      !(await rejected(`insert into public.paper_contributions (olympiad, year, round_label, license_note, source_url) values ('IBO', '2020', 'R1', 'note', 'https://www.ibo-info.org/')`)));
    check('no source link at all is accepted',
      !(await rejected(`insert into public.paper_contributions (olympiad, year, round_label, license_note) values ('IBO', '2020', 'R2', 'note')`)));
  });

  console.log('\n--- daily caps ---');

  await asUser(USER_A, async () => {
    let ok = true;
    for (let i = 0; i < 10; i++) {
      if (await rejected(`insert into public.doubts (title, body, subject) values ('Doubt number ${i}', 'body', 'general')`)) ok = false;
    }
    check('ten doubts in a day are accepted', ok);
    check('the eleventh doubt in a day is rejected',
      await rejected(`insert into public.doubts (title, body, subject) values ('Doubt number 11', 'body', 'general')`));
  });

  await asUser(USER_B, async () => {
    check('another member is not affected by someone else\'s cap',
      !(await rejected(`insert into public.doubts (title, body, subject) values ('My own doubt', 'body', 'general')`)));
  });

  await exec(`update public.doubts set created_at = now() - interval '25 hours' where user_id = '${USER_A}'`, 'age-doubts');

  await asUser(USER_A, async () => {
    check('the cap lifts once the earlier doubts are more than a day old',
      !(await rejected(`insert into public.doubts (title, body, subject) values ('Next day doubt', 'body', 'general')`)));
  });

  let protoId;
  await asUser(USER_A, async () => {
    let ok = true;
    for (let i = 0; i < 5; i++) {
      if (await rejected(`insert into public.biolab_practicals (slug, title, acknowledged_disclaimer) values ('cap-proto-${i}', 'Protocol ${i}', true)`)) ok = false;
    }
    check('five protocols in a day are accepted', ok);
    check('the sixth protocol in a day is rejected',
      await rejected(`insert into public.biolab_practicals (slug, title, acknowledged_disclaimer) values ('cap-proto-6', 'Protocol 6', true)`));
    protoId = (await db.query(`select id from public.biolab_practicals where slug = 'cap-proto-0'`)).rows[0].id;
  });

  await asUser(USER_B, async () => {
    let ok = true;
    for (let i = 0; i < 30; i++) {
      if (await rejected(`insert into public.biolab_protocol_feedback (protocol_id, comment) values ('${protoId}', 'comment ${i}')`)) ok = false;
    }
    check('thirty feedback comments in a day are accepted', ok);
    check('the thirty-first feedback comment in a day is rejected',
      await rejected(`insert into public.biolab_protocol_feedback (protocol_id, comment) values ('${protoId}', 'one too many')`));
  });

  const doubtIds = (await db.query(`select id from public.doubts where user_id = '${USER_A}' order by created_at limit 11`)).rows.map((r) => r.id);
  const feedbackIds = (await db.query(`select id from public.biolab_protocol_feedback order by created_at limit 9`)).rows.map((r) => r.id);

  await asUser(USER_B, async () => {
    let ok = true;
    for (const id of doubtIds) {
      if (await rejected(`insert into public.doubt_reports (doubt_id, reason) values ('${id}', 'spam')`)) ok = false;
    }
    for (const id of feedbackIds) {
      if (await rejected(`insert into public.biolab_feedback_reports (feedback_id, reason) values ('${id}', 'spam')`)) ok = false;
    }
    check('twenty reports in a day, across report types, are accepted', ok && doubtIds.length + feedbackIds.length === 20);
    check('the twenty-first report in a day is rejected, whatever its type',
      await rejected(`insert into public.biolab_protocol_reports (protocol_id, reason) values ('${protoId}', 'spam')`));
  });

  await asUser(USER_A, async () => {
    check('a signed-in user cannot call the BiOClash results replacement',
      await rejected(`select public.bioclash_replace_round_results('2026:mb-01', '[]'::jsonb)`));
  });

  const replaced = await db.query(`select public.bioclash_replace_round_results('test:round', $1::jsonb) as n`,
    [JSON.stringify([{ user_id: USER_A, placement: 1, score_label: '5 / 10' }, { user_id: USER_B, placement: 2, score_label: '4 / 10' }])]);
  const again = await db.query(`select public.bioclash_replace_round_results('test:round', $1::jsonb) as n`,
    [JSON.stringify([{ user_id: USER_B, placement: 1, score_label: '6 / 10' }])]);
  const rows = (await db.query(`select user_id, placement from public.bioclash_results where season = 'test:round'`)).rows;
  check('replacing a round writes its rows and a second run replaces them',
    replaced.rows[0].n === 2 && again.rows[0].n === 1 && rows.length === 1 && rows[0].user_id === USER_B);
  check('a failed replacement leaves the previous results in place',
    await rejected(`select public.bioclash_replace_round_results('test:round', '[{"user_id":"${USER_A}","placement":0}]'::jsonb)`) &&
    (await db.query(`select count(*)::int as n from public.bioclash_results where season = 'test:round'`)).rows[0].n === 1);
  check('the BiOClash figures bucket exists and is private',
    (await db.query(`select public from storage.buckets where id = 'bioclash-figures'`)).rows[0].public === false);

  console.log('\n--- remaining limits ---');

  await asUser(USER_A, async () => {
    const paths = Array.from({ length: 199 }, (_, i) => `('${USER_A}', '/cap/page-${i}/', 8)`).join(',');
    check('two hundred page ratings in a day are accepted',
      !(await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ${paths}`)));
    check('the two hundred and first page rating in a day is rejected',
      await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ('${USER_A}', '/cap/one-more/', 8)`));
  });

  await asUser(USER_B, async () => {
    const flood = Array.from({ length: 300 }, (_, i) => `('${USER_B}', '/flood/page-${i}/', 8)`).join(',');
    check('three hundred page ratings sent in one request are rejected',
      await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ${flood}`));
    const rows = Array.from({ length: 1001 }, (_, i) => `('/resources/s-${i}/', 'Subject ${i}')`).join(',');
    check('more than a thousand review rows sent in one request are rejected',
      await rejected(`insert into public.subject_review_state (subject_link, subject_name) values ${rows}`));
    const fine = Array.from({ length: 1000 }, (_, i) => `('/resources/s-${i}/', 'Subject ${i}')`).join(',');
    check('a thousand review rows are accepted',
      !(await rejected(`insert into public.subject_review_state (subject_link, subject_name) values ${fine}`)));
    check('the thousand and first review row is rejected',
      await rejected(`insert into public.subject_review_state (subject_link, subject_name) values ('/resources/extra/', 'Extra')`));
    check('an existing review row can still be updated at the cap',
      !(await rejected(`update public.subject_review_state set repetitions = 1 where subject_link = '/resources/s-0/'`)));
  });

  await asUser(USER_B, async () => {
    check('a result with normal calibration inputs is accepted',
      !(await rejected(`insert into public.biolab_submissions (practical_id, calibration_inputs) values ('${protoId}', '{"blank": 0.1}'::jsonb)`)));
    await db.exec(`reset role; delete from public.biolab_submissions; set role authenticated;`);
    check('a result with oversized calibration inputs is rejected',
      await rejected(`insert into public.biolab_submissions (practical_id, calibration_inputs) values ('${protoId}', jsonb_build_object('pad', repeat(md5(random()::text), 1000)))`));
    let ok = true;
    for (let i = 0; i < 20; i++) {
      if (await rejected(`insert into public.biolab_submissions (practical_id) values ('${protoId}')`)) ok = false;
    }
    check('twenty BiOLab results in a day are accepted', ok);
    check('the twenty-first BiOLab result in a day is rejected',
      await rejected(`insert into public.biolab_submissions (practical_id) values ('${protoId}')`));
  });

  await asUser(USER_A, async () => {
    check('a correction whose current value is over 5,000 characters is rejected',
      await rejected(`insert into public.content_corrections (olympiad, year, round_id, problem_id, field, current_value, proposed_value, reason) values ('IBO', '2020', 'r1', 'q1', 'answer', '${'c'.repeat(5001)}', 'new', 'why')`));
    check('a normal correction is accepted',
      !(await rejected(`insert into public.content_corrections (olympiad, year, round_id, problem_id, field, current_value, proposed_value, reason) values ('IBO', '2020', 'r1', 'q1', 'answer', 'old', 'new', 'why')`)));
  });

  await asUser(USER_C, async () => {
    let accepted = 0;
    for (let i = 0; i < 300; i++) {
      const madeUp = '/' + String(i).padStart(3, '0') + 'x'.repeat(286);
      if (!(await rejected(`insert into public.page_ratings (user_id, page_path, rating) values ('${USER_C}', '${madeUp}', 8)`))) accepted++;
    }
    check('the S-8 rating flood, 300 single inserts of made-up 290 character paths, stops at 200', accepted === 200);
  });

  await asUser(USER_C, async () => {
    const megabyte = `jsonb_build_object('pad', repeat('x', 1048576))`;
    check('the S-8 BiOLab flood: a result carrying 1 MB of calibration inputs is rejected',
      await rejected(`insert into public.biolab_submissions (practical_id, calibration_inputs) values ('${protoId}', ${megabyte})`));
    let accepted = 0;
    for (let i = 0; i < 100; i++) {
      if (!(await rejected(`insert into public.biolab_submissions (practical_id) values ('${protoId}')`))) accepted++;
    }
    check('the S-8 BiOLab flood, 100 results in a day, stops at 20', accepted === 20);
    check('the S-8 correction flood: a 2 MB current value is rejected',
      await rejected(`insert into public.content_corrections (olympiad, year, round_id, problem_id, field, current_value, proposed_value, reason) values ('IBO', '2020', 'r1', 'q1', 'answer', repeat('c', 2097152), 'new', 'why')`));
  });

  {
    const buckets = (await db.query(`select id, file_size_limit, allowed_mime_types from storage.buckets where id in ('biolab-captures', 'paper-contributions') order by id`)).rows;
    check('result photos are limited to 10 MB images',
      buckets[0].id === 'biolab-captures' && Number(buckets[0].file_size_limit) === 10485760 && buckets[0].allowed_mime_types.join(',') === 'image/jpeg,image/png,image/webp');
    check('contributed papers are limited to 50 MB PDFs',
      buckets[1].id === 'paper-contributions' && Number(buckets[1].file_size_limit) === 52428800 && buckets[1].allowed_mime_types.join(',') === 'application/pdf');
  }

  console.log('\n--- leaks ---');

  await exec(`insert into public.attempt_reports (user_id, olympiad, year, round_id, round_name, total_correct, total_statements, duration_sec) values ('${USER_B}', 'ibo', '2020', 'r1', 'Round 1', 5, 10, 600)`, 'seed-attempt');
  await db.exec(`set role anon; select set_config('request.jwt.claims', '{}', false);`);
  try {
    const visible = await db.query(`select user_id from public.leaderboard_per_round`);
    check('before hiding, the leaderboard lists the member\'s attempt', visible.rows.some((r) => r.user_id === USER_B));
  } finally {
    await db.exec(`reset role;`);
  }
  await db.exec(`update public.profiles set is_hidden = true where id = '${USER_B}'`);
  check('the hidden member has an attempt the base view would list, so the leak checks are not empty',
    (await db.query(`select count(*)::int as n from public.best_attempt_per_round where user_id = '${USER_B}'`)).rows[0].n > 0);

  await db.exec(`set role anon; select set_config('request.jwt.claims', '{}', false);`);
  try {
    check('a logged-out visitor cannot read the per-round base view',
      await rejected(`select * from public.best_attempt_per_round`));
    check('a logged-out visitor can still read the leaderboard',
      !(await rejected(`select * from public.leaderboard_per_round`)));
    const anonLb = await db.query(`select user_id from public.leaderboard_per_round`);
    check('the leaderboard hides a hidden member from a logged-out visitor', !anonLb.rows.some((r) => r.user_id === USER_B));
    check('a logged-out visitor cannot call the pending-count functions',
      await rejected(`select public.count_pending_paper_contributions()`) &&
      await rejected(`select public.count_pending_content_corrections()`) &&
      await rejected(`select public.count_pending_community_solutions()`));
  } finally {
    await db.exec(`reset role;`);
  }

  await asUser(USER_A, async () => {
    check('a member cannot read the per-round base view',
      await rejected(`select * from public.best_attempt_per_round`));
    const lb = await db.query(`select user_id from public.leaderboard_per_round`);
    check('the leaderboard still hides a hidden member', !lb.rows.some((r) => r.user_id === USER_B));
    check('a member cannot ask how many pending items another member has',
      await rejected(`select public.count_pending_content_corrections('${USER_B}'::uuid)`));
    check('a member cannot ask how many pending paper contributions another member has',
      await rejected(`select public.count_pending_paper_contributions('${USER_B}'::uuid)`));
    check('a member cannot ask how many pending community solutions another member has',
      await rejected(`select public.count_pending_community_solutions('${USER_B}'::uuid)`));
    const own = await db.query(`select public.count_pending_content_corrections() as n`);
    check('a member can still count their own pending items', own.rows[0].n === 1);
    const ownPapers = await db.query(`select public.count_pending_paper_contributions() as n`);
    const ownSolutions = await db.query(`select public.count_pending_community_solutions() as n`);
    check('the no-argument counts return only the caller\'s own pending items',
      ownPapers.rows[0].n === 2 && ownSolutions.rows[0].n === 0);
  });

  console.log('\n' + (failures === 0 ? 'ALL WRITE LIMIT CHECKS PASSED.' : `${failures} CHECK(S) FAILED.`));
  if (failures > 0) process.exit(1);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
