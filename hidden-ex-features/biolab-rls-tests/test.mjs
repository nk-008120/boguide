// RLS verification harness for the BiOLab Supabase migrations
// (supabase/migrations/015_biolab_schema.sql, 016_biolab_public_photos.sql,
// 017_biolab_open_protocols.sql). Loads and applies those files verbatim
// against a real Postgres engine -- @electric-sql/pglite is a WASM build
// of actual Postgres, not a reimplementation -- with a faithful stand-in
// for Supabase's auth.uid()/auth.users/storage schema, so RLS policies
// are genuinely exercised rather than just read and reasoned about.
//
// No live Supabase project or credentials are used or required.
//
// Run: npm install && node test.mjs
//
// This caught two real bugs before they shipped (see the migration
// history / AI_INVOLVEMENT_LOG.csv for the full story):
//   1. 015's own seed insert set biolab_practicals.created_by to the
//      site-owner's uuid instead of leaving it NULL, contradicting 015's
//      own "null means BiOGuide-authored/official" design comment.
//   2. An early draft of 017 added the disclaimer check constraint
//      before the corrective fix for (1), which would have made the
//      migration fail to apply against the live aspirin row.
//
// The load-bearing thing this suite exists to keep proving: an
// authenticated client can NEVER get created_by set to NULL (spoofing
// the "official" badge) or to another user's id (impersonation), on
// biolab_practicals, at insert OR update time -- regardless of how the
// grants happen to be configured. See the "ISOLATING THE RLS WITH-CHECK
// CLAUSE ITSELF" section below, which proves the RLS policy blocks this
// independently of the column-privilege grants (rather than the grants
// being the only thing standing in the way).

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

async function main() {
  // --- Bootstrap: minimal, faithful stand-ins for what Supabase provides
  //     out of the box, so the real migration files can be applied
  //     unmodified. auth.uid() is copied verbatim from Supabase's actual
  //     implementation (reads the jwt "sub" claim off a session GUC). ---
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

    -- Storage stand-in so 015/016's storage.* statements have somewhere
    -- real (if minimal) to land, instead of needing to be stripped out.
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
      ('22222222-2222-2222-2222-222222222222', 'usera@example.com'),
      ('33333333-3333-3333-3333-333333333333', 'userb@example.com');
    insert into public.profiles (id, display_name)
      select id, split_part(email, '@', 1) from auth.users;
  `, 'bootstrap');

  // --- Apply the real, shipped migration files, verbatim -------------------
  await exec(loadMigration('015_biolab_schema.sql'), '015');
  console.log('Applied 015_biolab_schema.sql verbatim: OK');
  await exec(loadMigration('016_biolab_public_photos.sql'), '016');
  console.log('Applied 016_biolab_public_photos.sql verbatim: OK');

  const preFix = await db.query(`select created_by from public.biolab_practicals where slug = 'aspirin-trinder'`);
  check('sanity: pre-017 aspirin row still shows the 015 seed bug (created_by NOT NULL)',
    preFix.rows[0].created_by !== null);

  await exec(loadMigration('017_biolab_open_protocols.sql'), '017');
  console.log('Applied 017_biolab_open_protocols.sql verbatim: OK\n');

  // --- Post-017 sanity: the seed bug fix + view -----------------------------
  const postFix = await db.query(`
    select created_by, category, source_attribution, acknowledged_disclaimer
    from public.biolab_practicals where slug = 'aspirin-trinder'
  `);
  check('017 fixed the aspirin row: created_by is now NULL', postFix.rows[0].created_by === null);
  check('017 backfilled category', postFix.rows[0].category === 'physiology');
  check('017 backfilled source_attribution', !!postFix.rows[0].source_attribution);

  const view = await db.query(`select is_official from public.biolab_public_protocols where slug = 'aspirin-trinder'`);
  check('biolab_public_protocols correctly reports is_official = true for the aspirin row (LEFT JOIN, not INNER)',
    view.rows[0].is_official === true);

  // --- Helper to run a statement as a given authenticated user -------------
  // Session-level (is_local = false) so it survives across separate
  // exec()/query() calls -- SET LOCAL / set_config(..., true) only last
  // for a single implicit transaction and silently stop applying across
  // calls, which produced misleading false negatives during development.
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

  const USER_A = '22222222-2222-2222-2222-222222222222';
  const USER_B = '33333333-3333-3333-3333-333333333333';

  console.log('\n--- SPOOFING TESTS (as USER_A, authenticated, against the shipped grants) ---');

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer, created_by)
        values ('spoof-null', 'Spoof Null', 'x', 'other', true, null)
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('insert with created_by=NULL is rejected' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer, created_by)
        values ('spoof-userb', 'Spoof UserB', 'x', 'other', true, '${USER_B}')
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('insert with created_by=<another user> is rejected' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let ok = false, createdBy;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer)
        values ('legit-protocol', 'Legit Protocol', 'materials/steps here', 'ecology', true)
      `);
      const r = await db.query(`select created_by from public.biolab_practicals where slug = 'legit-protocol'`);
      createdBy = r.rows[0].created_by;
      ok = createdBy === USER_A;
    } catch (e) { /* ok stays false */ }
    check('legit insert (created_by omitted, relies on default) sets created_by = the inserting user', ok);
  });

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category)
        values ('no-disclaimer', 'No Disclaimer', 'x', 'other')
      `);
    } catch (e) { blocked = true; }
    check('insert without acknowledged_disclaimer is rejected by the check constraint', blocked);
  });

  console.log('\n--- UPDATE TESTS ---');

  await asUser(USER_A, async () => {
    const before = await db.query(`select title from public.biolab_practicals where slug = 'aspirin-trinder'`);
    await db.query(`update public.biolab_practicals set title = 'HIJACKED' where slug = 'aspirin-trinder'`);
    const after = await db.query(`select title from public.biolab_practicals where slug = 'aspirin-trinder'`);
    check('an authenticated user cannot update the official (created_by IS NULL) row',
      after.rows[0].title === before.rows[0].title);
  });

  await asUser(USER_B, async () => {
    const before = await db.query(`select title from public.biolab_practicals where slug = 'legit-protocol'`);
    await db.query(`update public.biolab_practicals set title = 'STOLEN' where slug = 'legit-protocol'`);
    const after = await db.query(`select title from public.biolab_practicals where slug = 'legit-protocol'`);
    check('a different authenticated user cannot update someone else\'s protocol',
      after.rows[0].title === before.rows[0].title);
  });

  await asUser(USER_A, async () => {
    await db.query(`update public.biolab_practicals set title = 'Legit Protocol (edited)' where slug = 'legit-protocol'`);
    const after = await db.query(`select title from public.biolab_practicals where slug = 'legit-protocol'`);
    check('the owner CAN update their own protocol', after.rows[0].title === 'Legit Protocol (edited)');
  });

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`update public.biolab_practicals set created_by = null where slug = 'legit-protocol'`);
    } catch (e) { blocked = true; }
    check('the owner cannot smuggle created_by=NULL into their own row via update', blocked);
  });

  console.log('\n--- ISOLATING THE RLS WITH-CHECK CLAUSE ITSELF ---');
  console.log('(the inserts above were blocked by column-privilege exclusion before RLS');
  console.log(' ever ran; temporarily widen the grant to prove the with-check is not dead code)');

  await db.exec(`grant insert (slug, title, body, category, acknowledged_disclaimer, created_by) on public.biolab_practicals to authenticated;`);

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer, created_by)
        values ('spoof-null-2', 'Spoof Null 2', 'x', 'other', true, null)
      `);
    } catch (e) { blocked = true; }
    check('with created_by GRANTED: RLS alone still rejects created_by=NULL', blocked);
  });

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer, created_by)
        values ('spoof-userb-2', 'Spoof UserB 2', 'x', 'other', true, '${USER_B}')
      `);
    } catch (e) { blocked = true; }
    check('with created_by GRANTED: RLS alone still rejects created_by=<another user>', blocked);
  });

  console.log('\n' + (failures === 0
    ? `ALL CHECKS PASSED against the real, shipped migration files.`
    : `${failures} CHECK(S) FAILED -- see above.`));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
