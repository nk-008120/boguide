# Tests

Two of the suites run against a real WASM Postgres
([`@electric-sql/pglite`](https://github.com/electric-sql/pglite)) with the
actual migration files applied verbatim. Neither needs a live Supabase
project or credentials.

- `biolab/`: RLS and submission-flow checks for the BiOLab migrations
  (015 to 021, 023 and 040), plus a local algorithm check for the
  `biolab-calibrate-delta` edge function.
- `rls/`: general RLS checks applying the full migration set (`002`
  through the current highest number). Four files cover paper
  contributions, profile column scoping, report-queue staff policies,
  BiOLab feedback moderation, BiOLive, storage path ownership, the
  official-protocol flag, hidden profiles, the daily write limits, and
  the BiOClash results replacement function and private figures bucket
  (migration 048). See `rls/README.md`.

Three smaller suites need no database at all:

- `grading/`: the grading functions behind BiOClash and BiOrchive,
  including blank numeric answers, unanswered written questions and the
  answer sanitiser used by the save and lock handlers.
- `vault/`: the BiOClash paper vault and the plaintext guard.
- `api/`: the account deletion handler's file cleanup, with a fake
  Supabase client, and the account page's `next` redirect check. No
  BiOClash handler is exercised end to end yet; only the pure functions
  in `api/_lib/bioclash.js` are tested, through `grading/`.

Each has its own `package.json`; run `npm install && npm test` inside the
one you want, or `npm test` at the repository root for the three that
need no database. `npm run lint` at the root runs ESLint over `api/`,
`scripts/`, `static/js/`, `assets/` and the tests. All of it is wired
into CI (`.github/workflows/hugo-build-check.yml`), which runs on pushes
and pull requests to `main`.
