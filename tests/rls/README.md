# RLS test harness

Verifies the full `supabase/migrations/` set (002 through the current
highest-numbered file) against a real Postgres engine
([`@electric-sql/pglite`](https://github.com/electric-sql/pglite), a WASM
build of actual Postgres) instead of just reading the SQL and reasoning
about it. No live Supabase project or credentials are needed or used.

Files:
- `phase0-hardening.test.mjs` -- proves migrations 037-040 do what they
  claim: the `paper_contributions`/`content_corrections`/`community_solutions`
  self-approval bypass is closed, `profiles` column scoping blocks reading
  another user's private fields while `get_my_profile()` still returns the
  caller's own, the `doubt_reports`/`biolab_*_reports` staff policies work,
  and BiOLab feedback moderation (`is_removed` + `biolab_feedback_reports`)
  behaves correctly end to end.

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
node phase0-hardening.test.mjs
```

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
