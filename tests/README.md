# Tests

Two independent suites, both run against a real WASM Postgres
([`@electric-sql/pglite`](https://github.com/electric-sql/pglite)) with the
actual migration files applied verbatim. Neither needs a live Supabase
project or credentials.

- `biolab/` -- RLS and submission-flow verification for
  `supabase/migrations/015` through `021` (BiOLab), plus a local algorithm
  check for the `biolab-calibrate-delta` edge function.
- `rls/` -- general-purpose RLS verification applying the full migration
  set (`002` through the current highest number), covering everything else:
  paper contributions, profile column scoping, report-queue staff policies,
  and BiOLab feedback moderation.

Each has its own `package.json`; run `npm install && npm test` inside the
one you want. Both are wired into CI (`.github/workflows/ci.yml`).
