// Verification harness for the Phase 0 hardening migrations
// (supabase/migrations/037 through 040), the same real-Postgres approach
// as tests/biolab: @electric-sql/pglite is a WASM build of actual
// Postgres, not a mock, and every migration file is loaded and applied
// verbatim from supabase/migrations/. No live Supabase project needed.
//
// Unlike tests/biolab (which hand-bootstraps a minimal profiles table),
// this suite applies supabase/schema_baseline.sql plus the full numbered
// migration set 002-040 in order, since these fixes depend on tables and
// columns spread across many earlier migrations (paper_contributions from
// 028, is_staff from 023, doubts from 024/025, etc).
//
// Run: npm install && node phase0-hardening.test.mjs

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
  `, 'bootstrap');

  await exec(readFileSync(path.join(REPO_ROOT, 'supabase', 'schema_baseline.sql'), 'utf8'), 'schema_baseline');
  console.log('Applied schema_baseline.sql: OK');

  const migrationFiles = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
  for (const file of migrationFiles) {
    await exec(readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'), file);
  }
  console.log(`Applied all ${migrationFiles.length} migrations (002-${migrationFiles[migrationFiles.length - 1].slice(0, 3)}) verbatim: OK\n`);

  const USER_A = '22222222-2222-2222-2222-222222222222';
  const USER_B = '33333333-3333-3333-3333-333333333333';
  const STAFF = '44444444-4444-4444-4444-444444444444';

  await exec(`
    insert into auth.users (id, email) values
      ('${USER_A}', 'usera@example.com'),
      ('${USER_B}', 'userb@example.com'),
      ('${STAFF}', 'staff@example.com');
    update public.profiles set is_staff = true where id = '${STAFF}';
  `, 'seed-users');

  async function asUser(uuid, fn) {
    await db.exec(`
      set role authenticated;
      select set_config('request.jwt.claims', json_build_object('sub', '${uuid}')::text, false);
    `);
    try {
      return await fn();
    } finally {
      await db.exec(`reset role; select set_config('request.jwt.claims', null, false);`);
    }
  }

  console.log('--- 037: paper_contributions self-approval bypass ---');

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.paper_contributions
          (olympiad, year, round_label, license_note, status, reviewed_by, reviewed_at)
        values ('IBO', '2026', 'Round 1', 'own work', 'approved', '${USER_A}', now())
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('self-approving insert (status/reviewed_by/reviewed_at supplied) is rejected' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let ok = false;
    try {
      await db.query(`
        insert into public.paper_contributions (olympiad, year, round_label, license_note)
        values ('IBO', '2026', 'Round 1', 'own work')
      `);
      const r = await db.query(`select status, reviewed_by from public.paper_contributions where round_label = 'Round 1'`);
      ok = r.rows[0].status === 'pending' && r.rows[0].reviewed_by === null;
    } catch (e) { /* ok stays false */ }
    check('legit insert (no status/reviewed_by supplied) succeeds and defaults to pending', ok);
  });

  await asUser(USER_A, async () => {
    for (let i = 0; i < 4; i++) {
      await db.query(`
        insert into public.paper_contributions (olympiad, year, round_label, license_note)
        values ('IBO', '2026', 'Round pad ${i}', 'own work')
      `);
    }
    let blocked = false;
    try {
      await db.query(`
        insert into public.paper_contributions (olympiad, year, round_label, license_note)
        values ('IBO', '2026', 'Round over cap', 'own work')
      `);
    } catch (e) { blocked = true; }
    check('a 6th pending contribution from the same user is rejected (5-pending cap still enforced)', blocked);
  });

  console.log('\n--- 038: profiles column scoping ---');

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`select about from public.profiles where id = '${USER_B}'`);
    } catch (e) { blocked = true; }
    check('reading another user\'s "about" column directly is rejected', blocked);
  });

  await asUser(USER_A, async () => {
    let ok = false;
    try {
      const r = await db.query(`select display_name from public.profiles where id = '${USER_B}'`);
      ok = r.rows.length === 1;
    } catch (e) { /* ok stays false */ }
    check('reading another user\'s "display_name" (public column) still works', ok);
  });

  await exec(`update public.profiles set about = 'A private bio only I should read' where id = '${USER_A}'`, 'seed-about');

  await asUser(USER_A, async () => {
    let ok = false;
    try {
      const r = await db.query(`select about from public.get_my_profile()`);
      ok = r.rows[0] && r.rows[0].about === 'A private bio only I should read';
    } catch (e) { /* ok stays false */ }
    check('get_my_profile() RPC returns the caller\'s own private fields', ok);
  });

  console.log('\n--- 039: report-queue staff policies ---');

  await asUser(USER_B, async () => {
    await db.query(`
      insert into public.doubts (title, body) values ('Report target doubt', 'body text here')
    `);
  });
  const doubtRow = await db.query(`select id from public.doubts where title = 'Report target doubt'`);
  const doubtId = doubtRow.rows[0].id;

  await asUser(USER_A, async () => {
    await db.query(`insert into public.doubt_reports (doubt_id, reason) values ('${doubtId}', 'spam')`);
  });

  await asUser(USER_B, async () => {
    const r = await db.query(`select * from public.doubt_reports`);
    check('a non-staff user cannot see reports filed by someone else', r.rows.length === 0);
  });

  await asUser(STAFF, async () => {
    const r = await db.query(`select * from public.doubt_reports where doubt_id = '${doubtId}'`);
    check('a staff user can see reports filed by other users', r.rows.length === 1);
  });

  await asUser(STAFF, async () => {
    await db.query(`update public.doubt_reports set status = 'dismissed', resolved_by = '${STAFF}', resolved_at = now() where doubt_id = '${doubtId}'`);
    const r = await db.query(`select status from public.doubt_reports where doubt_id = '${doubtId}'`);
    check('a staff user can resolve a report', r.rows[0].status === 'dismissed');
  });

  console.log('\n--- 040: biolab feedback moderation ---');

  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer)
      values ('phase0-test-protocol', 'Phase 0 Test Protocol', 'steps here', 'ecology', true)
    `);
    await db.query(`
      insert into public.biolab_protocol_feedback (protocol_id, comment)
      select id, 'This protocol has a mistake in step 2' from public.biolab_practicals where slug = 'phase0-test-protocol'
    `);
  });

  const feedbackRow = await db.query(`select id from public.biolab_protocol_feedback where comment like 'This protocol has a mistake%'`);
  const feedbackId = feedbackRow.rows[0].id;

  await asUser(USER_B, async () => {
    const r = await db.query(`select * from public.biolab_protocol_feedback_feed where id = '${feedbackId}'`);
    check('a non-removed feedback comment is visible in the public feed', r.rows.length === 1);

    await db.query(`insert into public.biolab_feedback_reports (feedback_id, reason) values ('${feedbackId}', 'inaccurate')`);
  });

  await asUser(USER_A, async () => {
    const r = await db.query(`select * from public.biolab_feedback_reports where feedback_id = '${feedbackId}'`);
    check('the feedback author cannot see a report filed against their own comment', r.rows.length === 0);
  });

  await asUser(STAFF, async () => {
    const r = await db.query(`select * from public.biolab_feedback_reports where feedback_id = '${feedbackId}'`);
    check('a staff user can see the feedback report', r.rows.length === 1);
  });

  await exec(`update public.biolab_protocol_feedback set is_removed = true where id = '${feedbackId}'`, 'staff-remove-feedback');

  await asUser(USER_B, async () => {
    const r = await db.query(`select * from public.biolab_protocol_feedback_feed where id = '${feedbackId}'`);
    check('after removal, the feedback comment drops out of the public feed for other users', r.rows.length === 0);
  });

  await asUser(USER_A, async () => {
    const r = await db.query(`select * from public.biolab_protocol_feedback where id = '${feedbackId}'`);
    check('after removal, the comment\'s own author can still see it directly (tagged is_removed)', r.rows.length === 1 && r.rows[0].is_removed === true);
  });

  console.log('\n' + (failures === 0
    ? `ALL CHECKS PASSED against the real, shipped migration files.`
    : `${failures} CHECK(S) FAILED -- see above.`));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
