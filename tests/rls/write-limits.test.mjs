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
  const LONG_LOCAL = 'a'.repeat(60);

  await exec(`
    insert into auth.users (id, email) values
      ('${USER_A}', 'usera@example.com'),
      ('${USER_B}', 'userb@example.com');
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

  console.log('\n' + (failures === 0 ? 'ALL WRITE LIMIT CHECKS PASSED.' : `${failures} CHECK(S) FAILED.`));
  if (failures > 0) process.exit(1);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
