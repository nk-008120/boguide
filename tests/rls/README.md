# RLS test harness

Verifies the full `supabase/migrations/` set (002 through the current
highest-numbered file) against a real Postgres engine
([`@electric-sql/pglite`](https://github.com/electric-sql/pglite), a WASM
build of actual Postgres) instead of just reading the SQL and reasoning
about it. No live Supabase project or credentials are needed or used.

Files, all run by `npm test`:
- `phase0-hardening.test.mjs`: migrations 037 to 040. The
  `paper_contributions`, `content_corrections` and `community_solutions`
  self-approval bypass is closed, `profiles` column scoping blocks reading
  another user's private fields while `get_my_profile()` still returns the
  caller's own, the `doubt_reports` and `biolab_*_reports` staff policies
  work, and BiOLab feedback moderation (`is_removed` plus
  `biolab_feedback_reports`) behaves correctly end to end.
- `biolive.test.mjs`: BiOLive. Who can read the schedule and
  registrations, the 24 hour registration cutoff, the staff key gate and
  its lockout, and that deleting an account removes its registrations.
- `storage-official-hidden.test.mjs`: migration 044. Storage paths must
  sit under the user's own folder, a removed protocol's files cannot be
  re-attached, only seeded protocols are official, and hidden profiles
  are hidden from everyone except their owner.
- `write-limits.test.mjs`: migrations 045 and 049 and part of 048. Display name and
  protocol length checks, rating paths, the source link scheme check,
  the daily caps on doubts, protocols, feedback and reports, the 049
  caps on ratings, review rows and BiOLab results, the closed attempt
  view and pending-count leaks, and the
  BiOClash results replacement function (not callable by a signed-in
  user, replaces a round's rows in one step, leaves old rows in place on
  failure) and the private `bioclash-figures` bucket.

It loads and applies `supabase/schema_baseline.sql` plus every file in
`supabase/migrations/`, in order, verbatim, against a bootstrap schema that
stands in for what Supabase provides out of the box: `auth.users`, a
faithful copy of Supabase's real `auth.uid()` implementation, a minimal
`storage.buckets`/`storage.objects` pair, and the `anon`/`authenticated`
roles. It then runs statements *as* seeded users (via `SET ROLE` +
`set_config('request.jwt.claims', ...)`) to exercise RLS the way a real
client request would.

## Run it

```bash
npm install
npm test
```

To run one file on its own, use `node <file>`, for example
`node write-limits.test.mjs`.

## Bugs this already caught

1. **Migration 036's `revoke execute on function public.rls_auto_enable()`**
   referenced a function that exists only on the live database, created
   directly outside the migration history, so it does not exist on a fresh
   database at all. Applying 036 verbatim from scratch failed outright.
   Fixed by guarding the revoke in a `DO` block that checks the function
   exists first.
2. **Migration 028's original pending-count check** (carried forward
   unchanged into an early draft of 037) used a subquery against the same
   table inside that table's own `WITH CHECK` clause
   (`select count(*) from paper_contributions where ...`). Combined with
   the `own_or_staff` SELECT policy's `EXISTS` subquery against `profiles`,
   this triggers Postgres's own `infinite recursion detected in policy`
   error (42P17) on every insert, not just malicious ones, meaning
   submitting a paper contribution had likely never actually worked once a
   real `is_staff` check was in place. Fixed by moving the count into a
   `SECURITY DEFINER` function, the standard workaround for this
   documented Postgres RLS limitation.

If you touch `paper_contributions`, `content_corrections`,
`community_solutions`, `profiles`, or the report-queue tables, re-run this
first.
