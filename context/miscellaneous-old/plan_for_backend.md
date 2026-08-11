# BiOrchive login + optional leaderboard

**Status as of 2026-08-08: this is the original pre-implementation design
doc, written before any of this was built.** Everything below shipped in
spirit — Supabase, RLS-locked append-only `attempt_reports`, server-side
score recomputation, optional/anonymous-friendly login, per-round + overall
leaderboards — but the concrete implementation now differs from this plan
in several specifics, and a second phase of features (profiles, avatars,
a redesigned leaderboard, article gating) was added afterward that isn't
described here at all. **For current, accurate technical state, read
`LOGIN_ROADMAP.md` instead of this file** — it's the maintained handoff doc
and gets updated as things change; this file does not. Keeping this file
around anyway because the *reasoning* below (why Supabase, why RLS, why an
append-only table, why raw answers instead of a client-sent score) is still
accurate and worth having as a record of the original design rationale.

**Concretely, where reality diverged from this plan:**
- No `layouts/papers/account.html` / `leaderboard-round.html` /
  `leaderboard-overall.html` layout files were ever created. The account
  page is raw HTML embedded directly in `content/account/index.md`
  (originally `content/papers/account/index.md`, relocated in the later
  phase — see below); both leaderboard page types use the theme's default
  layout plus a data-emitting shortcode (`{{< papers-leaderboard >}}` /
  `{{< papers-leaderboard-overall >}}`), not a dedicated layout template.
- The account/login page was **not** kept out of the top nav as this plan
  specified. A later phase added a persistent, always-visible navbar
  icon (leftmost position, avatar when logged in) — a deliberate reversal
  of this doc's "keep the top nav uncluttered" reasoning, once login
  stopped being BiOrchive-only and articles also started gating on it.
- `profiles` grew well beyond `display_name`: avatar picker, country
  (shown as a leaderboard flag), education level, and a bio field were all
  added later, none of which this plan anticipated.
- The overall leaderboard was redesigned from a plain table into a
  "Hall of Fame" (podium for top 3) with cards linking to each test's own
  leaderboard — not in this plan.
- An entirely separate feature not mentioned here at all: login-gated
  articles (blurred body, "log in to keep reading"), built in the same
  later phase as the profile fields.
- The phased rollout at the bottom of this file (Phase 1/2/3) is complete
  — all three shipped as described, before the additional phase above.

## Context

BiOrchive's existing Timed Attempt quiz ([static/js/papers-attempt.js](static/js/papers-attempt.js)) is entirely client-side: it scores itself in the browser and keeps only the latest report per round in `localStorage`, with nothing ever leaving the device. The user wants to add a **leaderboard** people can optionally submit their results to, which means introducing a real backend for the first time — and, since that requires accounts anyway, a **login/account system built into the BiOrchive section**, explicitly designed so it can also store per-user test history and "other implications... later on," not just a leaderboard score.

Two facts from research shape everything below:
1. **The site is 100% static today** — no `api/` directory, no root `package.json`, no `.env`, no database, no auth code anywhere (confirmed by full-repo search). This is genuinely new infrastructure, not an extension of something existing.
2. **The current quiz ships real answers client-side** in the page source ([layouts/shortcodes/papers-attempt.html](layouts/shortcodes/papers-attempt.html) embeds the full answer key as JSON). A leaderboard **must never trust a client-submitted score** — anyone could open devtools and post a perfect score. The server has to independently recompute correctness from the same source-of-truth data ([data/papers/\<olympiad\>/\<year\>.yaml](data/papers)) that Hugo already treats as canonical.

Decisions already made with the user: Vercel serverless functions for backend logic; **Supabase** (Postgres + Auth in one project) as the vendor; **email + password** login; login stays **fully optional** — anonymous users keep today's experience unchanged; leaderboard is **per-round + one overall aggregate**.

## Approach

### 1. Supabase schema

Two tables, RLS-locked, plus derived views for the leaderboards (not materialized — cheap to compute live at this scale, no staleness/refresh complexity).

**`profiles`** — one row per user, auto-created by a trigger on `auth.users` insert (standard Supabase pattern). No email column (email stays in Supabase-managed `auth.users`, never exposed). `display_name` is collected at signup and passed via `supabase.auth.signUp({ options: { data: { display_name } } })`.

**`attempt_reports`** — **append-only**, one row per submission (not an overwrite like today's localStorage). This is the future-proofing centerpiece: because it's a full history table with a `report_type` discriminator column, a later "my attempt history" page, progress tracking, or a new non-quiz report type can all build on it with zero schema rework. Columns mirror `computeReport()`'s existing shape exactly — `total_correct`, `total_statements`, `score_pct` (generated column), `avg_time_sec`, `duration_sec`, `fullscreen_exits`, plus `subject_stats`/`per_question` as `jsonb` in the same shape `papers-attempt.js` already produces, so future UI can reuse today's rendering code. Indexed on `(olympiad, year, round_id, score_pct desc, duration_sec asc)` for per-round ranking and `(user_id, submitted_at desc)` for personal history.

**RLS — the critical safety property**: `attempt_reports` gets a `select using (auth.uid() = user_id)` policy (users read only their own rows) and **no insert/update/delete policy at all** for `anon`/`authenticated`. The only write path is the serverless function using the `service_role` key, which bypasses RLS by design — a logged-in client can never `INSERT` a score directly, even with a valid session.

**Leaderboard views**, granted `select` to `anon`/`authenticated`:
- `best_attempt_per_round` — `distinct on (user_id, olympiad, year, round_id)`, best score/time.
- `leaderboard_per_round` — the above joined to `profiles`, ranked via `rank() over (partition by round order by score_pct desc, duration_sec asc)`.
- `leaderboard_overall` — per-user aggregate (`sum`/`count` across their best-per-round rows), similarly ranked.

Views run with the view-owner's privileges, so they can safely aggregate across all of `attempt_reports` while only ever exposing ranked/aggregated columns — never one user's raw `per_question` detail to another user.

### 2. Score-validation serverless function

New root-level Node project (none exists today): `package.json` (deps: `@supabase/supabase-js`, `js-yaml`), `api/submit-attempt.js`, `api/_lib/supabaseAdmin.js` (shared service-role client helper, reusable by future endpoints).

**`POST /api/submit-attempt`** — request carries **raw answers**, never a score:
```json
{ "olympiad": "ibo", "year": "2022", "roundId": "theoretical-1",
  "answers": { "q1": { "A": true, "B": false } }, "timeSpent": { "q1": 87 }, "fullscreenExits": 1 }
```
with `Authorization: Bearer <supabase access_token>`. The function:
1. Verifies the token via `supabase.auth.getUser(token)` (anon-key client) → resolves `user_id` server-side; `401` if invalid.
2. Validates `olympiad`/`year`/`roundId` against `^[a-z0-9-]+$` (path-traversal defense).
3. Reads `data/papers/<olympiad>/<year>.yaml` from the function's own bundle, parses with `js-yaml`, finds the round — this is the same file Hugo already builds from, so there's exactly one source of truth for answers, not a second copy to keep in sync. (May need an explicit `vercel.json` `functions.includeFiles` entry for `data/papers/**` if default bundling misses non-imported data files — verify during Phase 1's smoke test.)
4. **Recomputes** `total_correct`/`subject_stats`/`per_question` independently against the client's `answers`, mirroring `computeReport()`'s logic exactly. `duration_sec` is summed from client `timeSpent` and clamped to the round's `durationMinutes * 60` as a sanity bound (full timing integrity would need a server-tracked start time — an accepted limitation, same spirit as the already-accepted "answers ship in page source" tradeoff).
5. Inserts one row via the service-role client; queries `leaderboard_per_round` for the fresh rank; returns `{ totalCorrect, totalStatements, scorePct, rank, roundName, submittedAt }` — the server's numbers, which is what the UI displays as confirmation.

Env vars (Vercel-only, server-side): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### 3. Auth wiring

`@supabase/supabase-js` loaded via CDN UMD build — matches the theme's own existing pattern of CDN-loaded third-party scripts (KaTeX, Mermaid, medium-zoom all work this way already) and the site's zero-bundler `static/js/*.js` convention, so no new build step is introduced.

- **New** `layouts/partials/custom/head-end.html` — this is a real, confirmed extension hook (`themes/hextra/layouts/_partials/head.html:80` calls `partial "custom/head-end.html"`, and `layouts/partials/custom/footer.html` already overrides its sibling hook the same way). Emits the Supabase SDK tag, the public URL/anon key via Hugo's `getenv "HUGO_SUPABASE_URL"` (Hugo's default security policy allowlists exactly the `^HUGO_` prefix, no config change needed), and loads `static/js/papers-auth.js` site-wide.
- **`static/js/papers-auth.js`** (site-wide) — singleton `supabase.createClient(...)` with `persistSession: true`; exposes `PapersAuth.getSession()` / `.onChange(cb)` / `.signOut()` for other scripts to use. The anon key is meant to be public — Supabase's security model is RLS, not key secrecy; only the service-role key is secret.
- **`static/js/papers-account.js`** (page-scoped, loaded only on the account page) — drives signup/login/forgot-password/set-new-password forms via `signInWithPassword`/`signUp`/`resetPasswordForEmail`/`updateUser`.

### 4. Hugo/content integration

Direct front-matter `layout:` on each new page (no cascade needed — a handful of pages, not the 100+ that justified the cascade used for question pages in [content/papers/_index.md](content/papers/_index.md)):

| Path | Purpose | Layout |
|---|---|---|
| `content/papers/account/index.md` | Login / signup / forgot-password / logged-in state | `layouts/papers/account.html` |
| `content/papers/ibo/2022/theoretical-1/leaderboard/index.md` (+ one per existing round, same pattern) | Per-round leaderboard, sibling to that round's existing `attempt/index.md` | `layouts/papers/leaderboard-round.html` |
| `content/papers/leaderboard/index.md` | Overall aggregate leaderboard | `layouts/papers/leaderboard-overall.html` |

A small `layouts/shortcodes/papers-leaderboard.html` shortcode (mirroring [layouts/shortcodes/papers-attempt.html](layouts/shortcodes/papers-attempt.html)'s data-plumbing pattern) emits just the `olympiad`/`year`/`roundId`/`roundName` a round's leaderboard page needs — no answer data required here, so nothing sensitive ships. `static/js/papers-leaderboard.js` queries `leaderboard_per_round`/`leaderboard_overall` directly via the Supabase client.

**Nav menu** (`hugo.toml`): one new top-level entry pointing at the overall leaderboard, renumbering existing weights to make room. The account/login page is **not** a top-level nav item — reached contextually from the attempt report's "Submit to Leaderboard" prompt and from a link on leaderboard pages ("Log in to appear here"), keeping the top nav uncluttered.

**The only existing file touched**: [static/js/papers-attempt.js](static/js/papers-attempt.js)'s `renderReport()` gets an *additive* branch — anonymous users see exactly today's screen (at most one unobtrusive "log in to save this" link, never blocking); logged-in users additionally get a "Submit to Leaderboard" button that posts raw answers to `/api/submit-attempt` and shows the server's authoritative rank/score. Local `saveReport`/`loadReport`/recommendations/retake flow are untouched.

### 5. What the user must do outside the repo (I can't perform these)

1. Create the Supabase project; note the Project URL, `anon` key, `service_role` key.
2. Decide email delivery (Supabase's default sender is fine to start; custom SMTP later) and turn on "Confirm email" in Auth settings (recommended, to keep the leaderboard free of throwaway-email spam) — plus set Site URL/Redirect URLs to `https://boguide.vercel.app` and `http://localhost:1313`.
3. Run the schema SQL (I'll hand over the exact script) in the Supabase SQL editor.
4. In Vercel project settings, add env vars: `HUGO_SUPABASE_URL`/`HUGO_SUPABASE_ANON_KEY` (build-time, public) and `SUPABASE_URL`/`SUPABASE_ANON_KEY`/`SUPABASE_SERVICE_ROLE_KEY` (function-only, mark sensitive) — then redeploy.
5. Confirm after the `package.json` is added that the Vercel project's Framework Preset is still detected as Hugo and that `api/*.js` is picked up as serverless functions (standard Vercel behavior, independent of framework preset, but worth eyeballing on the first deploy).

Everything else — all schema SQL, the serverless function, all new JS/layouts/content/shortcode/nav changes — I implement directly.

### 6. Phased rollout

- **Phase 1 — Foundation**: schema + RLS + views (views unused but harmless to create now), `papers-auth.js` + `head-end.html`, the account page with working signup/login/logout/password-reset, and a trivial `api/hello.js` smoke test to de-risk "does `api/` coexist with the Hugo build on this Vercel project" before building real logic on top. Nothing about the quiz changes — fully reversible, low risk.
- **Phase 2 — Submission + per-round leaderboards**: `api/submit-attempt.js`, the `papers-attempt.js` report-screen branch, `leaderboard-round.html` wired to `leaderboard_per_round`, starting with the existing IBO 2022 rounds.
- **Phase 3 — Overall leaderboard + polish**: `leaderboard-overall.html` wired to `leaderboard_overall`, nav entry finalized, remaining rounds get their `leaderboard/index.md` (mechanical repeat of Phase 2's pattern), empty-state copy, rank styling. Stretch (schema already supports it, no rework needed): a "my attempt history" page.

## Verification

1. **Phase 1**: sign up with a real email, confirm the verification email arrives and confirming logs the account in; log out/in; trigger password reset and confirm the flow completes; hit `/api/hello` directly and confirm Vercel is serving it alongside the static Hugo build.
2. **Phase 2**: complete a Timed Attempt, submit while logged in, confirm the row lands in `attempt_reports` in the Supabase table editor with server-recomputed (not client-sent) numbers; attempt a raw `fetch('/api/submit-attempt', ...)` with a doctored score/answers from devtools and confirm the server's recomputed score — not the tampered one — is what gets stored; confirm the per-round leaderboard page shows the new entry ranked correctly; confirm an anonymous user's report screen is pixel-identical to before this feature existed.
3. **Phase 3**: submit attempts across 2+ rounds as one user and confirm the overall leaderboard aggregates correctly; confirm RLS by attempting a direct client-side `supabase.from('attempt_reports').insert(...)` call from the browser console while logged in and confirming it's rejected.