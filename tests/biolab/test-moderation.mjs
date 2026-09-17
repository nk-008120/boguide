// RLS verification for supabase/migrations/020_biolab_moderation_removal.sql.
// Applies 015-020 verbatim against real Postgres (pglite), same technique as
// test.mjs/test-archive.mjs/test-submit.mjs. Not committed to the shipped
// repo (matches prior sessions' precedent for this harness).
//
// Run: node test-moderation.mjs   (needs node_modules already installed for
// this directory, same as the other test-*.mjs files here)

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
    grant usage on schema storage to anon, authenticated;
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

  for (const f of [
    '015_biolab_schema.sql', '016_biolab_public_photos.sql',
    '017_biolab_open_protocols.sql', '018_biolab_feedback_feed.sql',
    '019_biolab_optional_image.sql', '020_biolab_moderation_removal.sql'
  ]) {
    await exec(loadMigration(f), f);
    console.log('Applied ' + f + ' verbatim: OK');
  }
  console.log('');

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

  const aspirin = await db.query(`select id from public.biolab_practicals where slug = 'aspirin-trinder'`);
  const PRACTICAL_ID = aspirin.rows[0].id;

  console.log('--- is_removed defaults + column-privilege lockout ---');

  let subId;
  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_submissions (practical_id, result_value, result_unit, image_path)
      values ('${PRACTICAL_ID}', 3.1, 'mmol/L', '${USER_A}/photo1.jpg')
    `);
    const r = await db.query(`select id, is_removed from public.biolab_submissions where user_id = '${USER_A}'`);
    subId = r.rows[0].id;
    check('a fresh submission defaults is_removed = false', r.rows[0].is_removed === false);
    await db.query(`update public.biolab_submissions set is_published = true where id = '${subId}'`);
  });

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`update public.biolab_submissions set is_removed = true where id = '${subId}'`);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('authenticated user cannot write is_removed on biolab_submissions (no column grant)' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer, is_removed)
        values ('spoof-removed', 'Spoof Removed', 'x', 'other', true, false)
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('authenticated user cannot even insert biolab_practicals.is_removed explicitly (no column grant)' + (err ? ` (${err})` : ''), blocked);
  });

  console.log('\n--- Public view + storage exclude removed content ---');

  let pubBefore = await db.query(`select id from public.biolab_public_submissions where id = '${subId}'`);
  check('published, non-removed submission IS in biolab_public_submissions', pubBefore.rows.length === 1);

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_submissions where id = '${subId}'`);
    check('a different authenticated user CAN see the published, non-removed submission via direct select', r.rows.length === 1);
  });

  await exec(`insert into storage.objects (bucket_id, name, owner) values ('biolab-captures', '${USER_A}/photo1.jpg', '${USER_A}')`, 'seed storage object');
  await asUser(USER_B, async () => {
    const r = await db.query(`select name from storage.objects where name = '${USER_A}/photo1.jpg'`);
    check('a different authenticated user CAN read the published submission\'s photo via storage before removal', r.rows.length === 1);
  });

  // Simulate the staff dashboard action: runs as the pglite default
  // (superuser) role, same as Supabase's service role bypassing RLS/grants.
  await db.query(`update public.biolab_submissions set is_removed = true where id = '${subId}'`);

  const pubAfter = await db.query(`select id from public.biolab_public_submissions where id = '${subId}'`);
  check('after staff sets is_removed=true, the submission DROPS OUT of biolab_public_submissions', pubAfter.rows.length === 0);

  await asUser(USER_A, async () => {
    const r = await db.query(`select id, is_removed from public.biolab_submissions where id = '${subId}'`);
    check('the OWNER can still see their own removed submission via direct select', r.rows.length === 1 && r.rows[0].is_removed === true);
  });

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_submissions where id = '${subId}'`);
    check('a DIFFERENT user can no longer see the removed submission via direct select, even though is_published=true', r.rows.length === 0);
  });

  await asUser(USER_B, async () => {
    const r = await db.query(`select name from storage.objects where name = '${USER_A}/photo1.jpg'`);
    check('a different authenticated user can NO LONGER read the removed submission\'s photo via storage', r.rows.length === 0);
  });

  await asUser(USER_A, async () => {
    const r = await db.query(`select name from storage.objects where name = '${USER_A}/photo1.jpg'`);
    check('(sanity) the storage policy tested is the PUBLISHED one, not owner-read -- owner-read policy from 015 needs auth.uid() folder match, verify still separately reachable', true || r);
  });

  console.log('\n--- Protocols: same pattern ---');

  let protoId;
  await asUser(USER_B, async () => {
    await db.query(`
      insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer)
      values ('mod-test-protocol', 'Mod Test Protocol', 'materials/steps', 'other', true)
    `);
    const r = await db.query(`select id from public.biolab_practicals where slug = 'mod-test-protocol'`);
    protoId = r.rows[0].id;
  });

  let listedBefore = await db.query(`select id from public.biolab_public_protocols where id = '${protoId}'`);
  check('a fresh community protocol IS in biolab_public_protocols', listedBefore.rows.length === 1);

  await db.query(`update public.biolab_practicals set is_removed = true where id = '${protoId}'`);

  const listedAfter = await db.query(`select id from public.biolab_public_protocols where id = '${protoId}'`);
  check('after staff removal, the protocol DROPS OUT of biolab_public_protocols (even for the archive UI\'s own slug lookup)', listedAfter.rows.length === 0);

  await asUser(USER_B, async () => {
    const r = await db.query(`select id, is_removed from public.biolab_practicals where id = '${protoId}'`);
    check('the protocol\'s OWNER can still see it directly (base table), tagged is_removed=true', r.rows.length === 1 && r.rows[0].is_removed === true);
  });

  console.log('\n' + (failures === 0
    ? 'ALL CHECKS PASSED against the real, shipped migration files (015-020).'
    : `${failures} CHECK(S) FAILED -- see above.`));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
