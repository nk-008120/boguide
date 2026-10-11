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
  await exec(`insert into auth.users (email) values ('nishitkalani@gmail.com')`, 'seed-owner');
  for (const file of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()) {
    await exec(readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'), file);
  }
  console.log('Applied schema_baseline.sql and every migration: OK\n');

  const USER_A = '22222222-2222-2222-2222-222222222222';
  const USER_B = '33333333-3333-3333-3333-333333333333';
  const HIDDEN = '55555555-5555-5555-5555-555555555555';

  await exec(`
    insert into auth.users (id, email) values
      ('${USER_A}', 'usera@example.com'),
      ('${USER_B}', 'userb@example.com'),
      ('${HIDDEN}', 'hidden@example.com');
    update public.profiles set is_hidden = true where id = '${HIDDEN}';
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

  async function asAnon(fn) {
    await db.exec(`set role anon; select set_config('request.jwt.claims', '{}', false);`);
    try {
      return await fn();
    } finally {
      await db.exec(`reset role;`);
    }
  }

  const official = (await db.query(`select id, is_official from public.biolab_practicals where slug = 'aspirin-trinder'`)).rows[0];

  console.log('--- capture image paths ---');

  const victimPath = `${USER_A}/victim-private.jpg`;
  let subA, subB;
  await asUser(USER_A, async () => {
    subA = (await db.query(`insert into public.biolab_submissions (practical_id, result_value) values ('${official.id}', 1.0) returning id`)).rows[0].id;
    await db.query(`insert into storage.objects (bucket_id, name) values ('biolab-captures', '${victimPath}')`);
    const ok = !(await rejected(`insert into public.biolab_submission_images (submission_id, image_path, position) values ('${subA}', '${victimPath}', 0)`));
    check('a user can attach an image stored under their own folder', ok);
  });

  await asUser(USER_B, async () => {
    subB = (await db.query(`insert into public.biolab_submissions (practical_id, result_value) values ('${official.id}', 2.0) returning id`)).rows[0].id;
    await db.query(`update public.biolab_submissions set is_published = true where id = '${subB}'`);
    check('a user cannot attach an image path under another user\'s folder',
      await rejected(`insert into public.biolab_submission_images (submission_id, image_path, position) values ('${subB}', '${victimPath}', 0)`));
    check('a path with no folder at all is rejected',
      await rejected(`insert into public.biolab_submission_images (submission_id, image_path, position) values ('${subB}', 'loose.jpg', 0)`));
    const r = await db.query(`select name from storage.objects where bucket_id = 'biolab-captures' and name = '${victimPath}'`);
    check('the other user\'s private capture stays unreadable', r.rows.length === 0);
  });

  await asAnon(async () => {
    const r = await db.query(`select name from storage.objects where bucket_id = 'biolab-captures' and name = '${victimPath}'`);
    check('a logged-out visitor cannot read the private capture either', r.rows.length === 0);
  });

  console.log('\n--- protocol attachment paths ---');

  let protoA, protoB;
  await asUser(USER_A, async () => {
    protoA = (await db.query(`insert into public.biolab_practicals (slug, title, acknowledged_disclaimer) values ('proto-a', 'Protocol A', true) returning id`)).rows[0].id;
    const ok = !(await rejected(`insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name) values ('${protoA}', '${protoA}/sheet.pdf', 'sheet.pdf')`));
    check('an author can attach a file stored under their own protocol folder', ok);
  });
  await exec(`insert into storage.objects (bucket_id, name) values ('biolab-protocol-attachments', '${protoA}/sheet.pdf')`, 'seed-attachment-object');
  await exec(`update public.biolab_practicals set is_removed = true where id = '${protoA}'`, 'remove-proto-a');

  await asUser(USER_B, async () => {
    protoB = (await db.query(`insert into public.biolab_practicals (slug, title, acknowledged_disclaimer) values ('proto-b', 'Protocol B', true) returning id`)).rows[0].id;
    check('another author cannot re-attach a removed protocol\'s file to their own protocol',
      await rejected(`insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name) values ('${protoB}', '${protoA}/sheet.pdf', 'sheet.pdf')`));
    const r = await db.query(`select name from storage.objects where bucket_id = 'biolab-protocol-attachments' and name = '${protoA}/sheet.pdf'`);
    check('the removed protocol\'s file stays unreadable', r.rows.length === 0);
  });

  console.log('\n--- official flag ---');

  check('the seeded reference protocol is marked official', official.is_official === true);

  await asUser(USER_B, async () => {
    check('an author cannot mark their own protocol official on insert',
      await rejected(`insert into public.biolab_practicals (slug, title, acknowledged_disclaimer, is_official) values ('proto-fake', 'Fake', true, true)`));
    check('an author cannot mark their own protocol official by update',
      await rejected(`update public.biolab_practicals set is_official = true where id = '${protoB}'`));
  });

  await exec(`delete from auth.users where id = '${USER_B}'`, 'delete-user-b');

  await asAnon(async () => {
    const r = await db.query(`select is_official, author_user_id from public.biolab_public_protocols where slug = 'proto-b'`);
    check('a protocol whose author deleted their account stays listed', r.rows.length === 1);
    check('and it is not shown as official', r.rows.length === 1 && r.rows[0].is_official === false && r.rows[0].author_user_id === null);
    const o = await db.query(`select is_official from public.biolab_public_protocols where slug = 'aspirin-trinder'`);
    check('the reference protocol is still shown as official', o.rows.length === 1 && o.rows[0].is_official === true);
  });

  console.log('\n--- hidden profiles ---');

  await asAnon(async () => {
    const r = await db.query(`select id from public.profiles where id = '${HIDDEN}'`);
    check('a logged-out visitor cannot read a hidden profile', r.rows.length === 0);
    const v = await db.query(`select id from public.profiles where id = '${USER_A}'`);
    check('a logged-out visitor can still read a visible profile', v.rows.length === 1);
  });

  await asUser(USER_A, async () => {
    const r = await db.query(`select id from public.profiles where id = '${HIDDEN}'`);
    check('another member cannot read a hidden profile', r.rows.length === 0);
  });

  await asUser(HIDDEN, async () => {
    const r = await db.query(`select id from public.profiles where id = '${HIDDEN}'`);
    check('a hidden member can still read their own profile', r.rows.length === 1);
    const p = await db.query(`select * from public.get_my_profile()`);
    check('and still loads their own account page data', p.rows.length === 1);
  });

  console.log('\n' + (failures === 0 ? 'ALL STORAGE, OFFICIAL FLAG AND HIDDEN PROFILE CHECKS PASSED.' : `${failures} CHECK(S) FAILED.`));
  if (failures > 0) process.exit(1);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
