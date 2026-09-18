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
    create table storage.buckets (
      id text primary key,
      name text,
      public boolean,
      file_size_limit bigint,
      allowed_mime_types text[]
    );
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
      ('33333333-3333-3333-3333-333333333333', 'userb@example.com'),
      ('44444444-4444-4444-4444-444444444444', 'staffer@example.com'),
      ('55555555-5555-5555-5555-555555555555', 'userc@example.com');
    insert into public.profiles (id, display_name)
      select id, split_part(email, '@', 1) from auth.users;
  `, 'bootstrap');

  for (const f of [
    '015_biolab_schema.sql', '016_biolab_public_photos.sql',
    '017_biolab_open_protocols.sql', '018_biolab_feedback_feed.sql',
    '019_biolab_optional_image.sql', '020_biolab_moderation_removal.sql',
    '021_biolab_multi_image_and_attachments.sql',
    '023_staff_roles.sql',
    '040_biolab_feedback_moderation.sql'
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

  async function asAnon(fn) {
    await db.exec(`set role anon; select set_config('request.jwt.claims', '{}', false);`);
    try {
      return await fn();
    } finally {
      await db.exec(`reset role; select set_config('request.jwt.claims', '{}', false);`);
    }
  }

  const USER_A = '22222222-2222-2222-2222-222222222222';
  const USER_B = '33333333-3333-3333-3333-333333333333';
  const STAFF = '44444444-4444-4444-4444-444444444444';
  const USER_C = '55555555-5555-5555-5555-555555555555';

  const aspirin = await db.query(`select id from public.biolab_practicals where slug = 'aspirin-trinder'`);
  const PRACTICAL_ID = aspirin.rows[0].id;

  console.log('--- biolab_protocol_feedback: is_removed defaults + column-privilege lockout ---');

  let feedbackId;
  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_protocol_feedback (protocol_id, comment)
      values ('${PRACTICAL_ID}', 'Great practical, very clear steps.')
    `);
    const r = await db.query(`select id, is_removed from public.biolab_protocol_feedback where user_id = '${USER_A}'`);
    feedbackId = r.rows[0].id;
    check('a fresh feedback comment defaults is_removed = false', r.rows[0].is_removed === false);
  });

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_protocol_feedback (protocol_id, comment, is_removed)
        values ('${PRACTICAL_ID}', 'sneaky', false)
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('authenticated user cannot even insert is_removed explicitly (no column grant)' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`update public.biolab_protocol_feedback set is_removed = true where id = '${feedbackId}'`);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('authenticated user (even the author) cannot self-remove feedback (no update grant at all)' + (err ? ` (${err})` : ''), blocked);
  });

  console.log('\n--- Visibility before removal ---');

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_protocol_feedback where id = '${feedbackId}'`);
    check('a different authenticated user CAN see non-removed feedback via direct select', r.rows.length === 1);
  });

  await asAnon(async () => {
    const r = await db.query(`select id from public.biolab_protocol_feedback where id = '${feedbackId}'`);
    check('anon CAN see non-removed feedback via direct select', r.rows.length === 1);
  });

  let feedBefore = await db.query(`select id from public.biolab_protocol_feedback_feed where id = '${feedbackId}'`);
  check('non-removed feedback IS in biolab_protocol_feedback_feed', feedBefore.rows.length === 1);

  console.log('\n--- Staff removal action (simulated as service role, bypassing RLS) ---');

  await db.query(`update public.biolab_protocol_feedback set is_removed = true where id = '${feedbackId}'`);

  await asUser(USER_A, async () => {
    const r = await db.query(`select id, is_removed from public.biolab_protocol_feedback where id = '${feedbackId}'`);
    check('the OWNER can still see their own removed feedback via direct select', r.rows.length === 1 && r.rows[0].is_removed === true);
  });

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_protocol_feedback where id = '${feedbackId}'`);
    check('a DIFFERENT user can no longer see the removed feedback via direct select', r.rows.length === 0);
  });

  await asAnon(async () => {
    const r = await db.query(`select id from public.biolab_protocol_feedback where id = '${feedbackId}'`);
    check('anon can no longer see the removed feedback via direct select', r.rows.length === 0);
  });

  const feedAfter = await db.query(`select id from public.biolab_protocol_feedback_feed where id = '${feedbackId}'`);
  check('removed feedback DROPS OUT of biolab_protocol_feedback_feed for everyone, including the author (view has no owner exception)', feedAfter.rows.length === 0);

  console.log('\n--- biolab_feedback_reports: insert + reporter spoofing ---');

  let reportId;
  await asUser(USER_B, async () => {
    await db.query(`
      insert into public.biolab_feedback_reports (feedback_id, reason)
      values ('${feedbackId}', 'Off-topic and unhelpful comment')
    `);
    const r = await db.query(`select id, reporter_id, status from public.biolab_feedback_reports where feedback_id = '${feedbackId}' and reporter_id = '${USER_B}'`);
    reportId = r.rows[0].id;
    check('a fresh report defaults reporter_id to the inserting user and status to open',
      r.rows.length === 1 && r.rows[0].reporter_id === USER_B && r.rows[0].status === 'open');
  });

  await asUser(USER_C, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_feedback_reports (feedback_id, reason, reporter_id)
        values ('${feedbackId}', 'spoofed report', '${USER_B}')
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('a user cannot spoof reporter_id to someone else on insert' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_C, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_feedback_reports (feedback_id, reason, status)
        values ('${feedbackId}', 'trying to preset status', 'actioned')
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('a user cannot insert an explicit status (no column grant beyond feedback_id, reason)' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_B, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_feedback_reports (feedback_id, reason)
        values ('${feedbackId}', 'reporting the same thing again')
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('the same user cannot report the same feedback twice (unique feedback_id, reporter_id)' + (err ? ` (${err})` : ''), blocked);
  });

  console.log('\n--- biolab_feedback_reports: select visibility (reporter-only + staff-only) ---');

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_feedback_reports where id = '${reportId}'`);
    check('the REPORTER can see their own report', r.rows.length === 1);
  });

  await asUser(USER_A, async () => {
    const r = await db.query(`select id from public.biolab_feedback_reports where id = '${reportId}'`);
    check('the feedback AUTHOR (not the reporter, not staff) cannot see the report against them', r.rows.length === 0);
  });

  await asUser(USER_C, async () => {
    const r = await db.query(`select id from public.biolab_feedback_reports where id = '${reportId}'`);
    check('an unrelated, non-staff authenticated user cannot see the report', r.rows.length === 0);
  });

  await asUser(STAFF, async () => {
    const r = await db.query(`select id from public.biolab_feedback_reports where id = '${reportId}'`);
    check('a non-staff profile cannot see the report EITHER, before being promoted to staff', r.rows.length === 0);
  });

  await db.query(`update public.profiles set is_staff = true where id = '${STAFF}'`);

  await asUser(STAFF, async () => {
    const r = await db.query(`select id from public.biolab_feedback_reports where id = '${reportId}'`);
    check('AFTER promotion, staff CAN see the report even though they are not the reporter', r.rows.length === 1);
  });

  console.log('\n--- biolab_feedback_reports: update (staff-only, despite a broader column grant) ---');

  await asUser(USER_B, async () => {
    let blocked = false, err;
    try {
      await db.query(`update public.biolab_feedback_reports set status = 'actioned' where id = '${reportId}'`);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    const r = await db.query(`select status from public.biolab_feedback_reports where id = '${reportId}'`);
    const stillOpen = r.rows.length === 0 || r.rows[0].status !== 'actioned';
    check('the REPORTER themself cannot update status despite having column UPDATE grant (RLS requires staff)' + (err ? ` (${err})` : ' (silently affected 0 rows)'), stillOpen);
  });

  await asUser(STAFF, async () => {
    await db.query(`
      update public.biolab_feedback_reports
      set status = 'actioned', resolved_by = '${STAFF}', resolved_at = now()
      where id = '${reportId}'
    `);
    const r = await db.query(`select status, resolved_by from public.biolab_feedback_reports where id = '${reportId}'`);
    check('staff CAN update status/resolved_by/resolved_at', r.rows.length === 1 && r.rows[0].status === 'actioned' && r.rows[0].resolved_by === STAFF);
  });

  console.log('\n' + (failures === 0
    ? 'ALL CHECKS PASSED against the real, shipped migration files (015-021, 023, 040).'
    : `${failures} CHECK(S) FAILED -- see above.`));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
