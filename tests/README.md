# Tests

Two of the suites run against a real WASM Postgres
([`@electric-sql/pglite`](https://github.com/electric-sql/pglite)) with the
actual migration files applied verbatim. Neither needs a live Supabase
project or credentials.

- `biolab/` -- RLS and submission-flow verification for
  `supabase/migrations/015` through `021` (BiOLab), plus a local algorithm
  check for the `biolab-calibrate-delta` edge function.
- `rls/` -- general-purpose RLS verification applying the full migration
  set (`002` through the current highest number), covering everything else:
  paper contributions, profile column scoping, report-queue staff policies,
  BiOLab feedback moderation, BiOLive, and (from migration 044) storage
  path ownership, the official-protocol flag and hidden profiles.

Three smaller suites need no database at all:

- `grading/` -- the grading functions behind BiOClash and BiOrchive.
- `vault/` -- the BiOClash paper vault and the plaintext guard.
- `api/` -- the account deletion handler's file cleanup, with a fake
  Supabase client, and the account page's `next` redirect check.

Each has its own `package.json`; run `npm install && npm test` inside the
one you want, or `npm test` at the repository root for the three that
need no database. `npm run lint` at the root runs ESLint over `api/`,
`scripts/`, `static/js/`, `assets/` and the tests. All of it is wired
into CI (`.github/workflows/hugo-build-check.yml`), which runs on pushes
and pull requests to `main`.
