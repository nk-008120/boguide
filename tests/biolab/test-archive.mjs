// Verification harness for the Session 3 BiOLab protocol-archive browsing UI.
// This session had no live Supabase project/credentials available locally
// (same situation Session 2 documented) -- the dev server's Supabase-backed
// pages all show "not configured on this environment yet." So instead of
// eyeballing the SQL, this runs the EXACT client-side queries
// static/js/biolab-archive.js issues against a real Postgres engine
// (@electric-sql/pglite, a WASM build of actual Postgres) with the real,
// shipped migration files 015-018 applied verbatim, as different
// authenticated users, through RLS. Extends the existing test.mjs harness
// (015-017 spoofing/update tests) rather than replacing it; this file adds
// 018 and the read-path/report-path behavior the archive UI depends on.
//
// Run: npm install && node test-archive.mjs

import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../../supabase/migrations');

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

function loadMigration(filename) {
  return readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf8');
}

const USER_A = '22222222-2222-2222-2222-222222222222'; // community protocol author
const USER_B = '33333333-3333-3333-3333-333333333333'; // submits a private result
const USER_C = '44444444-4444-4444-4444-444444444444'; // reporter / bystander

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

async function asAnon(fn) {
  // Explicit '{}' (not NULL) -- a bare set_config(..., null, ...) resets a
  // placeholder GUC to '', and auth.uid() does ''::json before the nullif,
  // which throws. '{}' is valid JSON with no "sub", so auth.uid() -> NULL,
  // which is what an anonymous reader should look like.
  await db.exec(`
    set role anon;
    select set_config('request.jwt.claims', '{}', false);
  `);
  try {
    return await fn();
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claims', '{}', false);`);
  }
}

async function main() {
  await exec(`
    create extension if not exists pgcrypto;

    create schema if not exists auth;
    create table auth.users (
      id uuid primary key default gen_random_uuid(),
      email text unique
    );
    create or replace function auth.uid() returns uuid
    language sql stable as $$
      select nullif(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid
    $$;

    create role anon;
    create role authenticated;

    create schema if not exists storage;
    create table storage.buckets (id text primary key, name text, public boolean);
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

    create table public.profiles (
      id uuid primary key references auth.users(id) on delete cascade,
      display_name text not null default 'Anonymous',
      avatar_url text,
      is_hidden boolean not null default false,
      country text,
      created_at timestamptz not null default now()
    );
    grant select on public.profiles to anon, authenticated;

    insert into auth.users (id, email) values
      ('11111111-1111-1111-1111-111111111111', 'nishitkalani@gmail.com'),
      ('${USER_A}', 'usera@example.com'),
      ('${USER_B}', 'userb@example.com'),
      ('${USER_C}', 'userc@example.com');
    insert into public.profiles (id, display_name)
      select id, split_part(email, '@', 1) from auth.users;
  `, 'bootstrap');

  await exec(loadMigration('015_biolab_schema.sql'), '015');
  await exec(loadMigration('016_biolab_public_photos.sql'), '016');
  await exec(loadMigration('017_biolab_open_protocols.sql'), '017');
  await exec(loadMigration('018_biolab_feedback_feed.sql'), '018');
  console.log('Applied 015-018 verbatim: OK\n');

  // --- Seed a community-submitted protocol, exactly the way the (future)
  //     submit form would: created_by defaults to auth.uid(), never passed
  //     explicitly by the client. ---
  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_practicals (slug, title, description, body, category, source_attribution, acknowledged_disclaimer)
      values ('yeast-fermentation', 'Yeast Fermentation Rate', 'CO2 production vs sugar concentration.', 'Step 1... Step 2...', 'biochemistry', 'My own design', true)
    `);
  });

  console.log('\n--- 1. is_official / badge distinction (what the card + detail badge render from) ---');
  const officialRow = await db.query(`select is_official, author_display_name from public.biolab_public_protocols where slug = 'aspirin-trinder'`);
  check('BiOGuide protocol: is_official = true', officialRow.rows[0].is_official === true);

  const communityRow = await db.query(`select is_official, author_display_name from public.biolab_public_protocols where slug = 'yeast-fermentation'`);
  check('Community protocol: is_official = false', communityRow.rows[0].is_official === false);
  check('Community protocol: author_display_name is populated (drives the attribution line)', communityRow.rows[0].author_display_name === 'usera');

  console.log('\n--- 2. protocol feedback feed (018) -- what biolab-archive.js renders under "Feedback" ---');
  const protocolIdRes = await db.query(`select id from public.biolab_practicals where slug = 'yeast-fermentation'`);
  const protocolId = protocolIdRes.rows[0].id;

  await asUser(USER_B, async () => {
    await db.query(`insert into public.biolab_protocol_feedback (protocol_id, comment) values ('${protocolId}', 'Worked well for me, clear steps.')`);
  });
  await asUser(USER_C, async () => {
    await db.query(`insert into public.biolab_protocol_feedback (protocol_id, comment) values ('${protocolId}', 'CO2 readings were noisy at low sugar %.')`);
  });

  const feedRes = await asAnon(() => db.query(`select comment, display_name, created_at from public.biolab_protocol_feedback_feed where protocol_id = '${protocolId}' order by created_at asc`));
  check('anon can read the feedback feed (matches select grant)', feedRes.rows.length === 2);
  check('feedback feed joins display_name (not just a bare user_id)', feedRes.rows.every(r => !!r.display_name));
  check('feedback feed is ordered oldest-first (matches renderFeedbackComment expectation)',
    feedRes.rows[0].comment.indexOf('clear steps') !== -1);

  await db.query(`update public.profiles set is_hidden = true where id = '${USER_C}'`);
  const feedResAfterHide = await asAnon(() => db.query(`select comment from public.biolab_protocol_feedback_feed where protocol_id = '${protocolId}'`));
  check('feedback from a hidden/banned profile drops out of the feed (mirrors discussion_comments_feed)',
    feedResAfterHide.rows.length === 1);
  await db.query(`update public.profiles set is_hidden = false where id = '${USER_C}'`);

  console.log('\n--- 3. results privacy: own vs. public, exactly as biolab-archive.js\'s loadResults() queries it ---');
  await asUser(USER_B, async () => {
    await db.query(`insert into public.biolab_submissions (practical_id, image_path, result_value, result_unit) values ('${protocolId}', '${USER_B}/b1.jpg', 4.2, 'mL CO2/min')`); // private by default
  });
  await asUser(USER_C, async () => {
    await db.query(`insert into public.biolab_submissions (practical_id, image_path, result_value, result_unit) values ('${protocolId}', '${USER_C}/c1.jpg', 5.1, 'mL CO2/min')`);
    await db.query(`update public.biolab_submissions set is_published = true where practical_id = '${protocolId}' and user_id = '${USER_C}'`);
  });

  // The archive's "own" query: eq('practical_id', id).eq('user_id', session.user.id)
  const ownAsB = await asUser(USER_B, () => db.query(`select result_value, is_published from public.biolab_submissions where practical_id = '${protocolId}' and user_id = '${USER_B}'`));
  check('viewer B sees exactly their own submission via the "own" query', ownAsB.rows.length === 1 && Number(ownAsB.rows[0].result_value) === 4.2);

  // The archive's "public" query: biolab_public_submissions.eq('practical_id', id)
  const publicView = await asAnon(() => db.query(`select result_value from public.biolab_public_submissions where practical_id = '${protocolId}'`));
  check('the public view returns ONLY the published (C) submission, never B\'s private one',
    publicView.rows.length === 1 && Number(publicView.rows[0].result_value) === 5.1);

  // Directly probe: can C (a different, non-owner user) read B's private row via ANY query path?
  const crossUserProbe = await asUser(USER_C, () => db.query(`select count(*)::int as n from public.biolab_submissions where practical_id = '${protocolId}' and user_id = '${USER_B}'`));
  check('a different authenticated user (C) gets ZERO rows querying B\'s private submission directly -- RLS, not client filtering, is what protects it',
    crossUserProbe.rows[0].n === 0);

  const anonProbe = await asAnon(() => db.query(`select count(*)::int as n from public.biolab_submissions where practical_id = '${protocolId}' and user_id = '${USER_B}'`));
  check('an anonymous (logged-out) reader also gets ZERO rows for B\'s private submission',
    anonProbe.rows[0].n === 0);

  console.log('\n--- 4. report controls (the one write action this session ships) ---');
  await asUser(USER_C, async () => {
    let ok = false;
    try {
      await db.query(`insert into public.biolab_protocol_reports (protocol_id, reason) values ('${protocolId}', 'Missing a safety note about heat.')`);
      ok = true;
    } catch (e) { /* stays false */ }
    check('a logged-in user can report a protocol', ok);
  });

  await asUser(USER_C, async () => {
    let blocked = false;
    try {
      await db.query(`insert into public.biolab_protocol_reports (protocol_id, reason) values ('${protocolId}', 'Reporting again.')`);
    } catch (e) { blocked = true; }
    check('a second report on the same protocol by the same user is rejected (unique constraint -- matches the "already reported" UI branch)', blocked);
  });

  const publishedSubId = (await db.query(`select id from public.biolab_submissions where practical_id = '${protocolId}' and is_published = true`)).rows[0].id;
  const privateSubId = (await db.query(`select id from public.biolab_submissions where practical_id = '${protocolId}' and is_published = false`)).rows[0].id;

  await asUser(USER_C, async () => {
    let ok = false;
    try {
      await db.query(`insert into public.biolab_submission_reports (submission_id, reason) values ('${publishedSubId}', 'Looks miscalibrated.')`);
      ok = true;
    } catch (e) { /* stays false */ }
    check('a logged-in user can report a PUBLISHED submission', ok);
  });

  await asUser(USER_C, async () => {
    let blocked = false;
    try {
      await db.query(`insert into public.biolab_submission_reports (submission_id, reason) values ('${privateSubId}', 'Trying to report a private one.')`);
    } catch (e) { blocked = true; }
    check('reporting a PRIVATE (unpublished) submission is rejected by RLS -- matches the UI only attaching the report button to public results',
      blocked);
  });

  console.log('\n' + (failures === 0
    ? `ALL CHECKS PASSED -- the archive UI's read/report queries behave correctly against the real, shipped migrations.`
    : `${failures} CHECK(S) FAILED -- see above.`));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
