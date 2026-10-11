import { PGlite } from '@electric-sql/pglite';
import { pgcrypto } from '@electric-sql/pglite/contrib/pgcrypto';
import { createHash } from 'node:crypto';
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

async function blocked(sql) {
  try {
    const r = await db.query(sql);
    return r.affectedRows === 0 && r.rows.length === 0;
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
  `, 'bootstrap');

  await exec(readFileSync(path.join(REPO_ROOT, 'supabase', 'schema_baseline.sql'), 'utf8'), 'schema_baseline');
  for (const file of readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith('.sql')).sort()) {
    await exec(readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'), file);
  }
  console.log('Applied schema_baseline.sql and every migration: OK\n');

  const USER_A = '22222222-2222-2222-2222-222222222222';
  const USER_B = '33333333-3333-3333-3333-333333333333';
  const STAFF = '44444444-4444-4444-4444-444444444444';
  const KEY = 'correct-horse-battery-staple-32ch';
  const OLD_KEY = 'a-key-that-has-been-revoked-0000';
  const sha = (s) => createHash('sha256').update(s, 'utf8').digest('hex');

  await exec(`
    insert into auth.users (id, email) values
      ('${USER_A}', 'usera@example.com'),
      ('${USER_B}', 'userb@example.com'),
      ('${STAFF}', 'staff@example.com');
    update public.profiles set is_staff = true where id = '${STAFF}';
    insert into public.live_staff_keys (key_hash, label) values ('${sha(KEY)}', 'test');
    insert into public.live_staff_keys (key_hash, label, revoked_at) values ('${sha(OLD_KEY)}', 'old', now());
    insert into public.live_sessions (id, starts_at, duration_min, topic, host_name, status) values
      ('aaaaaaaa-0000-0000-0000-000000000001', now() + interval '5 days', 90, 'IBO 2017 Theoretical A', 'Host One', 'scheduled'),
      ('aaaaaaaa-0000-0000-0000-000000000002', now() + interval '10 hours', 90, 'Inside the cutoff', 'Host One', 'scheduled'),
      ('aaaaaaaa-0000-0000-0000-000000000003', now() + interval '6 days', 90, 'Cancelled one', 'Host One', 'cancelled'),
      ('aaaaaaaa-0000-0000-0000-000000000004', now() - interval '2 days', 90, 'Already over', 'Host One', 'scheduled');
    insert into public.live_registrations (session_id, user_id, real_name) values
      ('aaaaaaaa-0000-0000-0000-000000000002', '${USER_A}', 'User A'),
      ('aaaaaaaa-0000-0000-0000-000000000004', '${USER_A}', 'User A');
  `, 'seed');

  const OPEN = 'aaaaaaaa-0000-0000-0000-000000000001';
  const SOON = 'aaaaaaaa-0000-0000-0000-000000000002';
  const CANCELLED = 'aaaaaaaa-0000-0000-0000-000000000003';
  const PAST = 'aaaaaaaa-0000-0000-0000-000000000004';

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
      await db.exec(`reset role; select set_config('request.jwt.claims', null, false);`);
    }
  }

  const rpc = async (sql) => (await db.query(sql)).rows[0].r;

  console.log('--- schedule is public, sessions are not client-writable ---');

  await asAnon(async () => {
    const r = await db.query(`select id from public.live_sessions`);
    check('anon can read the schedule', r.rows.length === 4);
    check('anon cannot read any registration', await blocked(`select id from public.live_registrations`));
    check('anon cannot read the staff key table', await blocked(`select key_hash from public.live_staff_keys`));
    check('anon cannot call the staff overview', await blocked(`select public.live_staff_overview('${KEY}') as r`));
    const c = await db.query(`select registered from public.live_session_counts() where session_id = '${SOON}'`);
    check('anon can read registration counts only', Number(c.rows[0].registered) === 1);
  });

  await asUser(USER_A, async () => {
    check('a student cannot insert a session', await blocked(
      `insert into public.live_sessions (starts_at, duration_min, topic, host_name) values (now() + interval '9 days', 60, 'Rogue session', 'Me')`));
    check('a student cannot cancel a session', await blocked(
      `update public.live_sessions set status = 'cancelled' where id = '${OPEN}'`));
    check('a student cannot read the staff key table', await blocked(`select key_hash from public.live_staff_keys`));
    check('a student cannot call the gate helper directly', await blocked(`select public.live_staff_gate('${KEY}') as r`));
  });

  console.log('\n--- registering and pulling out ---');

  await asUser(USER_A, async () => {
    await db.query(`insert into public.live_registrations (session_id, real_name, question, target_olympiad)
      values ('${OPEN}', 'User A', 'How do I read a Lineweaver-Burk plot?', 'ibo')`);
    const r = await db.query(`select user_id, attended from public.live_registrations where session_id = '${OPEN}'`);
    check('a student can register and user_id defaults to themselves', r.rows.length === 1 && r.rows[0].user_id === USER_A && r.rows[0].attended === null);
    check('registering twice for the same session is rejected', await blocked(
      `insert into public.live_registrations (session_id, real_name) values ('${OPEN}', 'User A')`));
    check('a student cannot set attended on insert', await blocked(
      `insert into public.live_registrations (session_id, real_name, attended) values ('${CANCELLED}', 'User A', true)`));
    check('a student cannot mark themselves attended', await blocked(
      `update public.live_registrations set attended = true where session_id = '${OPEN}'`));
  });

  await asUser(USER_B, async () => {
    check('a student cannot register on behalf of someone else', await blocked(
      `insert into public.live_registrations (session_id, real_name, user_id) values ('${OPEN}', 'Spoof', '${USER_A}')`));
    check('registration inside the 24h cutoff is rejected', await blocked(
      `insert into public.live_registrations (session_id, real_name) values ('${SOON}', 'User B')`));
    check('registration for a cancelled session is rejected', await blocked(
      `insert into public.live_registrations (session_id, real_name) values ('${CANCELLED}', 'User B')`));
    check('registration for a past session is rejected', await blocked(
      `insert into public.live_registrations (session_id, real_name) values ('${PAST}', 'User B')`));
    const r = await db.query(`select id from public.live_registrations`);
    check('a student sees no one else\'s registrations', r.rows.length === 0);
    check('a student cannot delete someone else\'s registration', await blocked(
      `delete from public.live_registrations where session_id = '${OPEN}' returning id`));
  });

  await asUser(USER_A, async () => {
    const soon = await db.query(`delete from public.live_registrations where session_id = '${SOON}' returning id`);
    check('a student can still pull out inside the 24h cutoff', soon.rows.length === 1);
    check('a student cannot pull out of a session that has started', await blocked(
      `delete from public.live_registrations where session_id = '${PAST}' returning id`));
  });

  console.log('\n--- staff gate: login and key are both required ---');

  await asUser(USER_A, async () => {
    const r = await rpc(`select public.live_staff_overview('${KEY}') as r`);
    check('a non-staff account with the correct key gets not_staff and no data', r.ok === false && r.error === 'not_staff' && !r.sessions);
    const s = await rpc(`select public.live_staff_save_session('${KEY}', null, now() + interval '8 days', 60, 'Rogue', null, 'Me', null) as r`);
    check('a non-staff account cannot create a session through the RPC', s.ok === false);
  });

  await asUser(STAFF, async () => {
    const bad = await rpc(`select public.live_staff_overview('wrong-key') as r`);
    check('a staff account with a wrong key gets bad_key and no data', bad.ok === false && bad.error === 'bad_key' && !bad.sessions);
    const old = await rpc(`select public.live_staff_overview('${OLD_KEY}') as r`);
    check('a revoked key is rejected', old.ok === false && old.error === 'bad_key');

    const good = await rpc(`select public.live_staff_overview('${KEY}') as r`);
    const open = good.ok && good.sessions.find((s) => s.id === OPEN);
    check('staff with the correct key get the roster with name and email',
      !!open && open.registrations.length === 1 && open.registrations[0].email === 'usera@example.com' && open.registrations[0].real_name === 'User A');

    const made = await rpc(`select public.live_staff_save_session('${KEY}', null, now() + interval '12 days', 120, '  USABO Semifinal 2019  ', '/papers/usabo/', 'Host Two', '') as r`);
    const row = await db.query(`select topic, note, created_by from public.live_sessions where id = '${made.id}'`);
    check('staff can create a session, trimmed and attributed', made.ok && row.rows[0].topic === 'USABO Semifinal 2019' && row.rows[0].note === null && row.rows[0].created_by === STAFF);

    const edited = await rpc(`select public.live_staff_save_session('${KEY}', '${made.id}', now() + interval '13 days', 90, 'USABO Semifinal 2020', null, 'Host Two', 'Attempt it first') as r`);
    const row2 = await db.query(`select topic, duration_min, paper_url from public.live_sessions where id = '${made.id}'`);
    check('staff can edit a session', edited.ok && row2.rows[0].topic === 'USABO Semifinal 2020' && row2.rows[0].duration_min === 90 && row2.rows[0].paper_url === null);

    check('a javascript: paper link is rejected by the table constraint', await blocked(
      `select public.live_staff_save_session('${KEY}', null, now() + interval '12 days', 60, 'Bad link', 'javascript:alert(1)', 'Host', null) as r`));

    const cancelled = await rpc(`select public.live_staff_set_status('${KEY}', '${made.id}', 'cancelled') as r`);
    const row3 = await db.query(`select status from public.live_sessions where id = '${made.id}'`);
    check('staff can cancel a session', cancelled.ok && row3.rows[0].status === 'cancelled');

    const reg = open.registrations[0].id;
    const att = await rpc(`select public.live_staff_set_attendance('${KEY}', '${reg}', true) as r`);
    const after = await rpc(`select public.live_staff_overview('${KEY}') as r`);
    const marked = after.sessions.find((s) => s.id === OPEN).registrations[0];
    check('staff can mark attendance', att.ok && marked.attended === true);
  });

  console.log('\n--- lockout after repeated wrong keys ---');

  await asUser(STAFF, async () => {
    for (let i = 0; i < 12; i++) {
      await rpc(`select public.live_staff_overview('guess-${i}') as r`);
    }
    const r = await rpc(`select public.live_staff_overview('${KEY}') as r`);
    check('ten wrong keys lock that staff account out, even with the right key', r.ok === false && r.error === 'locked');
  });

  await exec(`update public.rate_limits set window_start = now() - interval '16 minutes' where key like 'live_staff_key:%'`, 'expire-lock');

  await asUser(STAFF, async () => {
    const r = await rpc(`select public.live_staff_overview('${KEY}') as r`);
    check('the lockout lifts after 15 minutes', r.ok === true);
  });

  console.log('\n--- account deletion ---');

  await exec(`delete from auth.users where id = '${USER_A}'`, 'delete-user');
  const left = await db.query(`select id from public.live_registrations where user_id = '${USER_A}'`);
  check('deleting an account removes its registrations', left.rows.length === 0);

  console.log('\n' + (failures === 0 ? 'ALL BIOLIVE CHECKS PASSED.' : `${failures} CHECK(S) FAILED, see above.`));
  if (failures > 0) process.exit(1);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
