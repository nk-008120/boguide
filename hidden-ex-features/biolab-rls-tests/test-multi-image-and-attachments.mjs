// RLS verification for supabase/migrations/021_biolab_multi_image_and_attachments.sql.
// Applies 015-021 verbatim against real Postgres (pglite), same technique as
// test.mjs/test-archive.mjs/test-submit.mjs/test-moderation.mjs. Not
// committed to the shipped repo (matches prior sessions' precedent for this
// harness).
//
// Two things this checks against the real, shipped SQL rather than just
// reasoning about it:
//
// 1. MULTI-IMAGE RESULTS (biolab_submission_images): the 019-era single
//    image_path column is migrated into position-0 rows before being
//    dropped; a submission's owner can add/see their own images regardless
//    of publish state; a stranger can only see images through a published,
//    non-removed submission; the biolab-captures storage read policy now
//    joins through the child table and keeps excluding removed/unpublished
//    content exactly as 020 did for the single-image case, now per image.
//
// 2. PROTOCOL PDF ATTACHMENTS (biolab_protocol_attachments): only a
//    protocol's own author can attach to it (never satisfiable for
//    BiOGuide's own created_by-IS-NULL protocols, by design); uploaded_by
//    can never be spoofed (no column grant, default-only); the file_name
//    check constraint actually rejects non-.pdf names; the storage bucket
//    is private with the 10MB/PDF-only restrictions set; a removed
//    protocol's attachment row and its PDF both stop being fetchable by
//    anyone but --  per the task's literal spec for this storage policy --
//    that "anyone" is not owner-exempted, unlike the images bucket, which
//    has a separate always-available owner-read policy. That asymmetry is
//    intentional (see the migration's own comment) and is asserted below,
//    not silently assumed away.
//
// Run: node test-multi-image-and-attachments.mjs   (needs node_modules
// already installed for this directory, same as the other test-*.mjs files)

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
    -- file_size_limit/allowed_mime_types match real Supabase's
    -- storage.buckets columns, needed because 021's bucket insert sets them.
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
      ('33333333-3333-3333-3333-333333333333', 'userb@example.com');
    insert into public.profiles (id, display_name)
      select id, split_part(email, '@', 1) from auth.users;
  `, 'bootstrap');

  for (const f of [
    '015_biolab_schema.sql', '016_biolab_public_photos.sql',
    '017_biolab_open_protocols.sql', '018_biolab_feedback_feed.sql',
    '019_biolab_optional_image.sql', '020_biolab_moderation_removal.sql',
  ]) {
    await exec(loadMigration(f), f);
    console.log('Applied ' + f + ' verbatim: OK');
  }

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
  const OFFICIAL_PROTOCOL_ID = aspirin.rows[0].id;

  // ===========================================================================
  // Pre-021: seed a LEGACY single-image submission (the pre-migration shape)
  // so 021's own data migration has something real to migrate.
  // ===========================================================================
  console.log('\n--- Seeding a pre-021 legacy single-image submission ---');

  let legacySubId;
  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_submissions (practical_id, image_path, result_value, result_unit)
      values ('${OFFICIAL_PROTOCOL_ID}', '${USER_A}/legacy.jpg', 3.1, 'mmol/L')
    `);
    const r = await db.query(`select id from public.biolab_submissions where image_path = '${USER_A}/legacy.jpg'`);
    legacySubId = r.rows[0].id;
    await db.query(`update public.biolab_submissions set is_published = true where id = '${legacySubId}'`);
  });
  check('legacy single-image submission seeded pre-021', !!legacySubId);

  // ===========================================================================
  // Apply 021 verbatim.
  // ===========================================================================
  await exec(loadMigration('021_biolab_multi_image_and_attachments.sql'), '021');
  console.log('Applied 021_biolab_multi_image_and_attachments.sql verbatim: OK\n');

  // ===========================================================================
  // PART 1: MULTI-IMAGE RESULTS
  // ===========================================================================
  console.log('--- Data migration: legacy image_path became a position-0 row ---');

  const migrated = await db.query(`
    select image_path, position from public.biolab_submission_images
    where submission_id = '${legacySubId}'
  `);
  check('legacy submission has exactly one migrated image row', migrated.rows.length === 1);
  check('migrated row kept the original image_path', migrated.rows[0]?.image_path === `${USER_A}/legacy.jpg`);
  check('migrated row landed at position 0', migrated.rows[0]?.position === 0);

  let columnDropped = false;
  try {
    await db.query(`select image_path from public.biolab_submissions limit 1`);
  } catch (e) { columnDropped = true; }
  check('biolab_submissions.image_path column no longer exists', columnDropped);

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_submissions (practical_id, image_path, result_value)
        values ('${OFFICIAL_PROTOCOL_ID}', '${USER_A}/nope.jpg', 1)
      `);
    } catch (e) { blocked = true; }
    check('inserting biolab_submissions with image_path in the column list now fails outright', blocked);
  });

  const legacyView = await db.query(`select images from public.biolab_public_submissions where id = '${legacySubId}'`);
  check('biolab_public_submissions.images for the legacy row is a 1-element jsonb array with the migrated path',
    Array.isArray(legacyView.rows[0]?.images)
      && legacyView.rows[0].images.length === 1
      && legacyView.rows[0].images[0].image_path === `${USER_A}/legacy.jpg`
      && legacyView.rows[0].images[0].position === 0);

  console.log('\n--- New multi-image submission (owner inserts several images) ---');

  let multiSubId;
  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_submissions (practical_id, result_value, result_unit)
      values ('${OFFICIAL_PROTOCOL_ID}', 3.4, 'mmol/L')
    `);
    const r = await db.query(`
      select id from public.biolab_submissions
      where practical_id = '${OFFICIAL_PROTOCOL_ID}' and user_id = '${USER_A}' and id != '${legacySubId}'
    `);
    multiSubId = r.rows[0].id;
    await db.query(`
      insert into public.biolab_submission_images (submission_id, image_path, position) values
        ('${multiSubId}', '${USER_A}/shot-0.jpg', 0),
        ('${multiSubId}', '${USER_A}/shot-1.jpg', 1),
        ('${multiSubId}', '${USER_A}/shot-2.jpg', 2)
    `);
  });
  const multiRows = await asUser(USER_A, async () =>
    db.query(`select image_path, position from public.biolab_submission_images where submission_id = '${multiSubId}' order by position`));
  check('owner can insert multiple images against their own submission', multiRows.rows.length === 3);
  check('multi-image rows keep their submitted position order',
    multiRows.rows.map(r => r.position).join(',') === '0,1,2');

  await asUser(USER_B, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_submission_images (submission_id, image_path, position)
        values ('${multiSubId}', '${USER_B}/hijack.jpg', 9)
      `);
    } catch (e) { blocked = true; }
    check('a DIFFERENT user cannot insert an image against someone else\'s submission', blocked);
  });

  console.log('\n--- biolab_submission_images direct-select visibility (defense in depth) ---');

  await asUser(USER_A, async () => {
    const r = await db.query(`select id from public.biolab_submission_images where submission_id = '${multiSubId}'`);
    check('owner can see their own submission\'s images while it is still unpublished', r.rows.length === 3);
  });
  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_submission_images where submission_id = '${multiSubId}'`);
    check('a different user CANNOT see an unpublished submission\'s images via direct select', r.rows.length === 0);
  });
  await asUser(USER_A, async () => {
    await db.query(`update public.biolab_submissions set is_published = true where id = '${multiSubId}'`);
  });
  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_submission_images where submission_id = '${multiSubId}'`);
    check('a different user CAN see a published, non-removed submission\'s images via direct select', r.rows.length === 3);
  });

  console.log('\n--- Storage: biolab-captures published-read now joins through biolab_submission_images ---');

  await exec(`
    insert into storage.objects (bucket_id, name, owner) values
      ('biolab-captures', '${USER_A}/shot-0.jpg', '${USER_A}'),
      ('biolab-captures', '${USER_A}/shot-1.jpg', '${USER_A}'),
      ('biolab-captures', '${USER_A}/shot-2.jpg', '${USER_A}')
  `, 'seed storage objects for multi-image submission');

  await asUser(USER_B, async () => {
    const r = await db.query(`
      select name from storage.objects
      where bucket_id = 'biolab-captures' and name like '${USER_A}/shot-%'
      order by name
    `);
    check('a different user can read ALL THREE images of a published, non-removed submission via storage',
      r.rows.length === 3);
  });

  await db.query(`update public.biolab_submissions set is_removed = true where id = '${multiSubId}'`);

  await asUser(USER_B, async () => {
    const r = await db.query(`
      select name from storage.objects
      where bucket_id = 'biolab-captures' and name like '${USER_A}/shot-%'
    `);
    check('after staff removal, a different user can no longer read ANY of the submission\'s images via storage',
      r.rows.length === 0);
  });

  await asUser(USER_A, async () => {
    // Owner-read stays available via the untouched, path-convention-only
    // biolab_captures_select_own policy from 015, independent of publish/
    // removed state -- unaffected by 021's rewrite of the *published* policy.
    const r = await db.query(`
      select name from storage.objects
      where bucket_id = 'biolab-captures' and name like '${USER_A}/shot-%'
    `);
    check('the OWNER can still read their own images via storage after removal (untouched select_own policy)',
      r.rows.length === 3);
  });

  // ===========================================================================
  // PART 2: PROTOCOL PDF ATTACHMENTS
  // ===========================================================================
  console.log('\n--- Protocol attachments: only the protocol\'s own author may attach ---');

  let protoId;
  await asUser(USER_A, async () => {
    await db.query(`
      insert into public.biolab_practicals (slug, title, body, category, acknowledged_disclaimer)
      values ('attachment-test-protocol', 'Attachment Test Protocol', 'materials/steps', 'other', true)
    `);
    const r = await db.query(`select id from public.biolab_practicals where slug = 'attachment-test-protocol'`);
    protoId = r.rows[0].id;
  });

  await asUser(USER_A, async () => {
    let ok = false, uploadedBy;
    try {
      await db.query(`
        insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name)
        values ('${protoId}', '${protoId}/workflow.pdf', 'workflow.pdf')
      `);
      const r = await db.query(`select uploaded_by from public.biolab_protocol_attachments where protocol_id = '${protoId}'`);
      uploadedBy = r.rows[0]?.uploaded_by;
      ok = uploadedBy === USER_A;
    } catch (e) { console.log('  (error: ' + e.message + ')'); }
    check('the protocol\'s own author can attach a PDF, uploaded_by defaults to them', ok);
  });

  await asUser(USER_B, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name)
        values ('${protoId}', '${protoId}/hijack.pdf', 'hijack.pdf')
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('a DIFFERENT user cannot attach to someone else\'s protocol' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name, uploaded_by)
        values ('${protoId}', '${protoId}/spoof.pdf', 'spoof.pdf', '${USER_B}')
      `);
    } catch (e) { blocked = true; }
    check('uploaded_by cannot be set explicitly by any client (no column grant, default-only)', blocked);
  });

  await asUser(USER_A, async () => {
    let blocked = false, err;
    try {
      await db.query(`
        insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name)
        values ('${protoId}', '${protoId}/notes.txt', 'notes.txt')
      `);
    } catch (e) { blocked = true; err = e.message.split('\n')[0]; }
    check('a non-.pdf file_name is rejected by the check constraint' + (err ? ` (${err})` : ''), blocked);
  });

  await asUser(USER_A, async () => {
    let ok = false;
    try {
      await db.query(`
        insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name)
        values ('${protoId}', '${protoId}/Report.PDF', 'Report.PDF')
      `);
      ok = true;
    } catch (e) { /* ok stays false */ }
    check('an uppercase .PDF extension is accepted (case-insensitive check)', ok);
  });

  await asUser(USER_A, async () => {
    let blocked = false;
    try {
      await db.query(`
        insert into public.biolab_protocol_attachments (protocol_id, file_path, file_name)
        values ('${OFFICIAL_PROTOCOL_ID}', '${OFFICIAL_PROTOCOL_ID}/sneaky.pdf', 'sneaky.pdf')
      `);
    } catch (e) { blocked = true; }
    check('NO client (even the site owner\'s own account) can attach to a BiOGuide-official (created_by IS NULL) protocol',
      blocked);
  });

  console.log('\n--- Protocol attachments: bucket config + select visibility ---');

  const bucket = await db.query(`select public, file_size_limit, allowed_mime_types from storage.buckets where id = 'biolab-protocol-attachments'`);
  check('biolab-protocol-attachments bucket is private (public=false)', bucket.rows[0]?.public === false);
  check('bucket file_size_limit is 10MB (10485760 bytes)', Number(bucket.rows[0]?.file_size_limit) === 10485760);
  check('bucket allowed_mime_types is exactly [application/pdf]',
    JSON.stringify(bucket.rows[0]?.allowed_mime_types) === JSON.stringify(['application/pdf']));

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_protocol_attachments where protocol_id = '${protoId}'`);
    check('any authenticated user can list a non-removed protocol\'s attachments (public read)', r.rows.length === 2);
  });

  await exec(`insert into storage.objects (bucket_id, name, owner) values ('biolab-protocol-attachments', '${protoId}/workflow.pdf', '${USER_A}')`, 'seed attachment storage object');
  await asUser(USER_B, async () => {
    const r = await db.query(`select name from storage.objects where name = '${protoId}/workflow.pdf'`);
    check('any authenticated user can download the PDF via storage while the protocol is not removed', r.rows.length === 1);
  });

  await db.query(`update public.biolab_practicals set is_removed = true where id = '${protoId}'`);

  await asUser(USER_B, async () => {
    const r = await db.query(`select id from public.biolab_protocol_attachments where protocol_id = '${protoId}'`);
    check('a different user can no longer see the removed protocol\'s attachment rows', r.rows.length === 0);
  });
  await asUser(USER_A, async () => {
    const r = await db.query(`select id from public.biolab_protocol_attachments where protocol_id = '${protoId}'`);
    check('the protocol\'s OWNER can still see their own attachment rows after removal (table-level defense in depth)',
      r.rows.length === 2);
  });

  await asUser(USER_B, async () => {
    const r = await db.query(`select name from storage.objects where name = '${protoId}/workflow.pdf'`);
    check('a different user can no longer download the PDF via storage after removal', r.rows.length === 0);
  });
  await asUser(USER_A, async () => {
    // Per the task's literal spec, the storage select policy has no
    // owner-exception (unlike the images bucket, which has a SEPARATE
    // select_own policy) -- so even the author loses STORAGE read access
    // to their own PDF once the protocol is removed, even though the
    // metadata row (checked above) remains visible to them. Intentional
    // asymmetry, asserted here rather than assumed.
    const r = await db.query(`select name from storage.objects where name = '${protoId}/workflow.pdf'`);
    check('(documented asymmetry) even the OWNER loses storage read access to their own PDF once removed -- no owner-exception policy exists for this bucket, unlike biolab-captures',
      r.rows.length === 0);
  });

  console.log('\n' + (failures === 0
    ? 'ALL CHECKS PASSED against the real, shipped migration files (015-021).'
    : `${failures} CHECK(S) FAILED -- see above.`));
  if (failures > 0) process.exit(1);
}

main().catch(e => { console.error('FATAL:', e); process.exit(1); });
