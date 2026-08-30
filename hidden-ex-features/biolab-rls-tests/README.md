# BiOLab RLS test harness

Verifies `supabase/migrations/015_biolab_schema.sql` through
`021_biolab_multi_image_and_attachments.sql` against a real Postgres engine
([`@electric-sql/pglite`](https://github.com/electric-sql/pglite), a WASM
build of actual Postgres) instead of just reading the SQL and reasoning
about it. No live Supabase project or credentials are needed or used.

Files:
- `test.mjs` -- 015/016/017 schema/RLS/spoofing tests (see below).
- `test-archive.mjs` -- Session 3 protocol-archive browsing UI: runs the exact
  read queries `static/js/biolab-archive.js` issues (badge/`is_official`,
  the new `018` feedback feed, own-vs-public results visibility, report
  inserts) as different authenticated/anon users, through RLS. Written
  because this session had no live Supabase credentials locally, so the dev
  server's Supabase-backed pages (including the new archive) show
  "not configured on this environment yet" -- this is the substitute for
  manually clicking through real data. Run: `node test-archive.mjs`.
- `test-submit.mjs` -- Session 4 submission forms (015-019): the exact
  insert payload shapes the protocol/result/feedback forms send. Run:
  `node test-submit.mjs`.
- `test-moderation.mjs` -- 020's `is_removed` staff takedown lever (015-020):
  column-privilege lockout, public-view/storage exclusion, owner-still-sees-
  own-removed. Run: `node test-moderation.mjs`.
- `test-multi-image-and-attachments.mjs` -- 021's `biolab_submission_images`
  child table (multi-image results, replacing the single `image_path`
  column) and `biolab_protocol_attachments` (protocol PDF attachments):
  data migration of pre-021 single-image rows, owner-scoped inserts on both
  new tables, the storage read policy rewrite that now joins through
  `biolab_submission_images`, the PDF-only/10MB bucket restrictions, and the
  documented asymmetry where a removed protocol's attachment PDF has no
  owner-exception storage policy (unlike `biolab-captures`). Run:
  `node test-multi-image-and-attachments.mjs`.

It loads the three migration files verbatim from `../../supabase/migrations/`
and applies them against a bootstrap schema that stands in for what Supabase
provides out of the box: `auth.users`, a faithful copy of Supabase's real
`auth.uid()` implementation, minimal `storage.buckets`/`storage.objects`
tables, and the `anon`/`authenticated` roles. It then runs INSERT/UPDATE
statements *as* those roles (via `SET ROLE` + `set_config('request.jwt.claims', ...)`)
to exercise RLS the way a real client request would.

## Run it

```bash
npm install
node test.mjs
```

## What it's protecting

The load-bearing rule introduced in 017: `biolab_practicals.created_by IS NULL`
is what marks a protocol as BiOGuide-verified/official. A client must never be
able to set it to `NULL` (spoofing the official badge) or to another user's
uuid (impersonation) — at insert *or* update time. The suite checks this at
two independent layers (column-privilege exclusion, and the RLS `with check`
clause in isolation), plus runs the general insert/update/disclaimer-gate
cases.

## Bugs this already caught

1. **015's own seed insert** set the aspirin practical's `created_by` to the
   site-owner's uuid instead of leaving it `NULL`, contradicting 015's own
   "null means official" design comment. Fixed via a corrective `UPDATE` in
   017.
2. **An early draft of 017** added the disclaimer check constraint *before*
   that corrective fix, which would have made the migration fail to apply
   against the live aspirin row (`ADD CONSTRAINT` rejects on a pre-existing
   violating row).

If you touch `biolab_practicals`, its RLS policies, or the disclaimer/category
constraints in a future session, re-run this first — it's cheap (a few
seconds, no network) and it has already paid for itself twice.
