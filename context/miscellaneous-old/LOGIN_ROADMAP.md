# BiOGuide login/account system — context + roadmap

This file exists so a fresh Claude session (after `/clear`) can pick up exactly
where this one left off, without re-deriving the architecture from scratch.
Read this whole file before touching any of this system.

**Status as of 2026-08-08: the login + leaderboard system is live in
production and confirmed working** (signup, login, password reset, timed
attempt → submit to leaderboard → per-round and overall leaderboard display).
Everything below "Part 1" is what exists today.

**Update, same day: all four Part 2 features below have now been built**
(code-complete, not yet deployed/verified in production — see "Part 2
implementation notes" at the end of this file for what changed, what's
still manual, and what a fresh session should check first). The Part 2
sections below are kept as-written (the original plan) since they're still
an accurate description of *why* things are built the way they are; treat
them as background, not a to-do list.

**Update, 2026-08-09: three more migrations extended this same system** —
not documented in detail here, since `SETUP.md` is now the single place
that lists every migration in run order with what each does; don't let this
file drift out of sync with it again. Briefly: `005_bioclash_notify.sql`
adds `profiles.notify_bioclash` (a login-based opt-in for the BiOClash
landing page's "get notified" widget); `006_bioclash_results.sql` adds a
`bioclash_results` table + `bioclash_leaderboard` view (manually populated
by the founder once a real BiOClash season concludes — no scoring engine
exists yet, so this starts empty); `007_discussions.sql` adds
`discussion_threads`/`discussion_comments` + their feed views (public
comment/feedback threads at `/discussions/`, posting requires login,
closing a thread is a manual owner action enforced at the RLS level, same
posture as the existing `profiles.is_hidden` moderation flag below — which
these two new features both reuse for filtering, not a new moderation
mechanism). All three follow this file's existing patterns exactly: RLS
public-read where appropriate, no client insert/update path for anything
requiring owner judgment, manual SQL-editor action instead of an admin UI.

---

## Part 1 — Current state (what's already built and live)

### Architecture in one paragraph

Hugo static site, deployed on Vercel. Zero backend before this feature;
now there's a **Supabase** project (Postgres + Auth) for accounts/data, and a
small set of **Vercel serverless functions** under `api/` for the one
operation that can't be trusted to the client: scoring a Timed Attempt.
Everything else (login, signup, reading leaderboards) talks to Supabase
**directly from the browser** using the public anon key — that's safe by
design, Supabase's security model is Row Level Security, not key secrecy.

### Files that make up the system

**Backend (Supabase)**
- [supabase/schema.sql](supabase/schema.sql) — single source of truth for the DB.
  Run manually in the Supabase SQL editor; not auto-migrated. Tables:
  - `profiles` (id → auth.users, `display_name`, `avatar_url`, `created_at`).
    Auto-created via a trigger (`handle_new_user`) on signup.
  - `attempt_reports` — **append-only**, one row per "Submit to Leaderboard"
    click (not an overwrite). Columns mirror `computeReport()`'s shape in
    `papers-attempt.js`: `total_correct`, `total_statements`, `score_pct`
    (generated column), `duration_sec`, `avg_time_sec`, `fullscreen_exits`,
    `subject_stats`/`per_question` (jsonb, same shape the report screen
    already renders). `report_type` column exists so a future non-quiz
    report kind can reuse this table without a migration.
  - Views: `best_attempt_per_round` (dedup to each user's best try),
    `leaderboard_per_round`, `leaderboard_overall` (aggregated, ranked).
  - **RLS is the safety boundary that matters most here**: `attempt_reports`
    has a `select using (auth.uid() = user_id)` policy and **no insert
    policy at all** — the only way a row gets written is the serverless
    function using the `service_role` key, which bypasses RLS. A logged-in
    client can never `INSERT` a fake score directly, even from devtools.

**API (`api/`, Vercel Node serverless functions)**
- [api/_lib/supabaseAdmin.js](api/_lib/supabaseAdmin.js) — `getAdminClient()`
  (service_role, bypasses RLS, only for trusted server-side writes) and
  `getAnonClient()` (anon key, used only to verify a caller's JWT via
  `auth.getUser(token)`).
- [api/submit-attempt.js](api/submit-attempt.js) — `POST /api/submit-attempt`.
  Client sends **raw per-statement answers**, never a score. This function
  independently re-derives correctness from `data/papers/<ol>/<year>.yaml`
  (the same file Hugo builds the site from — one source of truth, not a
  copy), inserts the row, returns the server-computed score + rank. Has a
  top-level try/catch wrapping everything and `console.error` at every
  failure point — **don't remove this logging**, it's how we diagnosed both
  production bugs below.
- [api/hello.js](api/hello.js) — trivial smoke-test endpoint, confirms `api/`
  coexists with the Hugo static build on Vercel.
- [vercel.json](vercel.json) — has a `functions.api/submit-attempt.js.includeFiles`
  entry so `data/papers/**` gets bundled into that function (it reads those
  YAML files via `fs` at request time).

**Auth wiring (site-wide)**
- [layouts/partials/custom/head-end.html](layouts/partials/custom/head-end.html) —
  real theme extension hook (`themes/hextra/layouts/_partials/head.html`
  calls `partial "custom/head-end.html"` unconditionally on every page).
  Loads the Supabase JS SDK via CDN (matches the theme's own pattern for
  KaTeX/Mermaid/etc — no bundler on this site, don't introduce one just for
  this), sets `window.__SUPABASE_URL`/`__SUPABASE_ANON_KEY` from Hugo's
  `getenv "HUGO_SUPABASE_URL"` etc, then loads `papers-auth.js`.
  **Gotcha**: `getenv ... | jsonify` MUST be piped through `| safeJS` too, or
  Hugo's html/template auto-escaper double-encodes it inside the `<script>`
  block (turns `""` into the literal string `"\"\""`, breaks `createClient`).
  Already fixed here — just don't regress it if this file gets touched.
- [static/js/papers-auth.js](static/js/papers-auth.js) — site-wide singleton.
  Exposes `window.PapersAuth`: `.isConfigured()`, `.getClient()` (raw
  supabase-js client), `.getSession()` (Promise), `.onChange(cb)` (wraps
  `auth.onAuthStateChange`), `.signOut()`. Every other script in this system
  goes through this instead of touching `supabase.createClient` directly.
  Session persists via Supabase's own `localStorage` handling
  (`persistSession: true`, `autoRefreshToken: true`) — this is *why*
  logged-in state already survives page loads/navigation across BiOrchive
  today, even though there's no visible indicator of it yet (that's Part 2,
  feature 2 below).

**Login/signup page**
- [content/papers/account/index.md](content/papers/account/index.md) +
  [static/js/papers-account.js](static/js/papers-account.js) — currently
  lives under `/papers/account/`, screens: unconfigured (no env vars) /
  loading / logged-out (tabs: login, signup, forgot-password) / recovery
  (set new password, detected via `type=recovery` in the URL hash) /
  logged-in (shows display name from `profiles`, logout button). Deliberately
  **no custom Hugo layout** — uses the theme's default page layout with raw
  HTML in the markdown content, same pattern as the pre-existing
  `attempt/index.md`. **Part 2 plans to redesign and probably relocate this
  page** — see feature 1 below.

**Leaderboard submission (the one existing file this session modified)**
- [static/js/papers-attempt.js](static/js/papers-attempt.js) — `renderReport(report, canSubmit)`
  gained a second param. When `canSubmit` (only true right after a live
  submit, not when viewing a cached past report), it renders an
  `#attempt-leaderboard-block` that's empty/hidden for anonymous or
  unconfigured visitors (CSS `:empty { display:none }`), shows a "Log in to
  save this" link if logged out, or a "Submit to Leaderboard" button if
  logged in — which POSTs `{olympiad, year, roundId, answers, timeSpent,
  fullscreenExits}` (raw data, not a score) to `/api/submit-attempt` with
  `Authorization: Bearer <access_token>`. Everything else in this file
  (local scoring/report/recommendations) is untouched — this was purely
  additive.

**Leaderboard display**
- [layouts/shortcodes/papers-leaderboard.html](layouts/shortcodes/papers-leaderboard.html) +
  [static/js/papers-leaderboard.js](static/js/papers-leaderboard.js) —
  per-round table, queries the `leaderboard_per_round` view directly from
  the browser (read-only, RLS-safe).
- [layouts/shortcodes/papers-leaderboard-overall.html](layouts/shortcodes/papers-leaderboard-overall.html) +
  [static/js/papers-leaderboard-overall.js](static/js/papers-leaderboard-overall.js) —
  same idea against `leaderboard_overall`.
- Pages: `content/papers/leaderboard/index.md` (overall),
  `content/papers/ibo/2022/theoretical-1/leaderboard/index.md`,
  `.../theoretical-2/leaderboard/`, `content/papers/ibo/2024/theoretical-a/leaderboard/`
  (per-round — one per round that has a Timed Attempt; add more the same way
  as new rounds get attempt mode). Round `_index.md` files link to their
  leaderboard with a "🏆 Leaderboard" button next to "Start Timed Attempt".
  `hugo.toml` has a top-level "Leaderboard" nav entry pointing at the overall
  page.

**Ops**
- [SETUP.md](SETUP.md) — step-by-step for the human (Supabase project
  creation, running schema.sql, Auth config, Vercel env vars). Already done
  and confirmed working in production. Keep this file up to date as Part 2
  adds new setup steps (e.g. avatar assets, new env vars if any).
- [.gitignore](.gitignore) — excludes `node_modules/`, `.env`, `.env.local`,
  `.vercel/`. **No real secrets are anywhere in the repo** — verified by
  grep for JWT-shaped strings and Supabase URLs before the last push.
- Root `package.json` — `engines.node` is `"22.x"`. **Do not downgrade
  this** — `@supabase/supabase-js` v2's `createClient()` unconditionally
  initializes a Realtime client that requires a native `WebSocket` global,
  which Node 20 doesn't have. This caused a real production 500 (fixed).

### Bugs hit and fixed this session (don't reintroduce these)

1. **Hugo `jsonify` in a `<script>` block needs `| safeJS`** or it
   double-encodes (see head-end.html gotcha above).
2. **Theme's global `menu.js` needs `.hextra-sidebar-container` to exist**
   even on pages using a custom layout that skips the real sidebar partial —
   add a `<aside class="hextra-sidebar-container" hidden></aside>` stand-in
   (see `layouts/papers/question.html` from the earlier fullscreen-question
   feature for the exact pattern).
3. **`document.getElementsByTagName('script')`-based self-location breaks**
   when a script gets re-executed dynamically (e.g. SPA content swap) —
   use `document.currentScript` instead. Already fixed in
   `layouts/shortcodes/papers-quiz.html`.
4. **`display:flex` with default row-direction on a single-child wrapper**
   triggers `align-items:stretch`, forcing the child to fill the container's
   height regardless of its real content size — silently breaks any
   "measure natural height to detect overflow" JS logic. Watch for this if
   adding more flex wrappers around dynamically-sized content.
5. **Supabase-js v2 needs Node 22+ on Vercel** (see package.json gotcha
   above) — this bit us in production after the URL-misconfiguration bug was
   fixed; the *symptom* ("auth check failed") was identical for both bugs,
   which is exactly why the `console.error` logging in `submit-attempt.js`
   matters — without it we'd have kept guessing blind.
6. Two Vercel env vars look similar but are **not the same variable**:
   `HUGO_SUPABASE_URL` (build-time, used by Hugo/the browser) and
   `SUPABASE_URL` (runtime, used only inside `api/`). Same for the anon key
   pair. Fixing one and not the other produces confusing "half-working"
   states (e.g. login works, leaderboard submission doesn't). Always check
   *both* when debugging anything URL/key-related.

### What a fresh session should do first

Read this file, then skim `static/js/papers-auth.js`, `papers-attempt.js`'s
leaderboard section, and `supabase/schema.sql` to confirm nothing has drifted
since this was written. Don't re-explore the whole repo from scratch —
this document plus those three files is the fast path back to full context.

---

## Part 2 — Planned features (not yet built)

Requested by the user, 2026-08-08, with clarifying answers already collected
(don't re-ask these — they're settled):

| Open question asked | Answer |
|---|---|
| Profile pictures: curated set or upload? | **Curated set** — user picks from images the site provides, no upload pipeline. |
| Education level scale? | **Single dropdown**: Grade 8, 9, 10, 11, 12, Undergraduate, Graduate, Other. |
| Which new profile fields show on the leaderboard? | **Country only**, as a flag icon next to the name. "About" and education level are profile-page-only. |
| Articles gating: how hard, which articles? | **All articles gated**, teaser-and-blur (not a hard redirect) — logged-out visitors see the title/intro, body is hidden behind a "log in to keep reading" prompt. |

### Feature 1 — Prominent login icon + redesigned login page

**Requirement**: a login icon in the top-left of the navbar, always visible,
linking to a better-designed login page than the current one.

**Recommended approach**:
- Extend [layouts/partials/navbar-title.html](layouts/partials/navbar-title.html)
  (already a site override of the theme's version, already renders first —
  literally the top-left of the navbar) to also render a small account
  icon/link immediately after the logo+title. This avoids needing to fork
  the whole `navbar.html` partial.
- Logged-out state: a generic person/login icon linking to the login page.
- Logged-in state: **this is feature 2** — same icon slot becomes the
  user's avatar. Build these two together; they're one UI element with two
  states, not two separate features.
- The icon's state needs to update reactively without a page reload when
  auth state changes (e.g. user logs in on the account page, then clicks
  a nav link) — wire it via `PapersAuth.onChange(cb)`, already built for
  exactly this.
- **Open decision, confirm with user before building**: the login page
  currently lives at `/papers/account/`, scoped under BiOrchive per the
  original request. Feature 4 (gating Articles) means login is no longer a
  BiOrchive-only concern. Recommend relocating to a top-level `/account/`
  (with a Hugo alias/redirect from the old `/papers/account/` URL so
  existing links don't 404) — but confirm this with the user first since it
  wasn't part of the original scoping.
- "Better designed" is subjective and wasn't specified further — when this
  is picked up, either ask the user for a design direction/reference, or
  propose 2-3 concrete visual directions before building rather than
  guessing.

### Feature 2 — Persistent logged-in state + avatar picker

**Requirement**: logged-in users see their profile picture where the login
icon was; login state persists across all of BiOrchive without re-logging-in.

**Already true today**: session persistence itself (the "don't have to log
in again" part) already works — `papers-auth.js` uses Supabase's
`persistSession: true` + `autoRefreshToken: true`, backed by `localStorage`.
**What's actually missing** is just a UI element that *reflects* that state
sitewide — there's currently zero visual indicator of login state outside
the account page and the attempt-report leaderboard prompt.

**Technical plan**:
- Avatar storage: add a curated set of images to a new `static/avatars/`
  directory (naming convention e.g. `avatar-01.png` … `avatar-NN.png`) —
  **the user needs to supply these image files**, same category of
  external dependency as the Supabase account creation was in Part 1.
  Claude can generate simple placeholder icons if asked, but final art is
  the user's call.
- `profiles.avatar_url` column **already exists** in the schema (added in
  Part 1, unused until now) — store the relative path (e.g.
  `/avatars/avatar-03.png`).
- Avatar picker UI: add to the account page's logged-in section (or the new
  profile section from feature 3 — likely the same place) — a grid of the
  available images, click to select, writes to `profiles.avatar_url` via
  `client.from('profiles').update({avatar_url: ...}).eq('id', session.user.id)`
  (already permitted by the existing `profiles_update_own` RLS policy + the
  existing column-level `update (..., avatar_url, ...)` grant).
- Navbar icon (feature 1's slot) reads `profiles.avatar_url` for the
  current user once logged in and renders it as the icon instead of the
  generic login glyph.
- Consider a light validation (client-side, maybe a DB check constraint)
  that `avatar_url` matches the expected `/avatars/...` pattern, since
  nothing currently stops a user from writing an arbitrary URL into that
  column via the client (low severity — it only ever gets used as an
  `<img src>` — but cheap to close off).

### Feature 3 — Extended profile (country, about, education level)

**Requirement**: logged-in users can fill in country of nationality, a short
"about" (max 50 words), and highest education level. Country shows on the
leaderboard as a flag.

**Schema change** (append to `supabase/schema.sql`'s history, or add as a
new migration file — don't edit the original file retroactively once it's
been run against production; write a new `supabase/migrations/002_profile_fields.sql`
or similar):
```sql
alter table public.profiles
  add column if not exists country text,
  add column if not exists about text,
  add column if not exists education_level text
    check (education_level in (
      'grade-8','grade-9','grade-10','grade-11','grade-12',
      'undergraduate','graduate','other'
    ));

-- Column-level grants are additive in Postgres — this adds to the existing
-- (display_name, avatar_url) grant from schema.sql, doesn't replace it.
grant update (country, about, education_level) on public.profiles to authenticated;
```
- `country`: recommend storing as an ISO 3166-1 alpha-2 code (e.g. `"IN"`,
  `"US"`) rather than free text — makes the flag rendering trivial (Unicode
  regional-indicator emoji flags can be derived directly from the 2-letter
  code with no image assets/library needed: `code.toUpperCase().split('').map(c => String.fromCodePoint(127397 + c.charCodeAt())).join('')`)
  and avoids messy free-text country names. UI should be a `<select>`
  populated from a standard country list, not a free-text input.
- `about`: free text, enforce "max 50 words" **client-side** (simple word
  count on the textarea, block submit or show a counter) — this isn't
  security-sensitive data, a DB-level constraint isn't necessary, though a
  generous `char_length` CHECK (e.g. under ~400 chars) as a defensive
  backstop against abuse is cheap to add if desired.
- `education_level`: `<select>` with the 7 options from the clarified scale
  above; the CHECK constraint above already enforces valid values server-side.
- UI: extend the account page's logged-in section into a proper editable
  profile form (this is likely the same UI surface as the feature 2 avatar
  picker — build them together as one "Edit Profile" section).
- Leaderboard change: `leaderboard_per_round` and `leaderboard_overall`
  views need `country` added to their `select`/join (they already join
  `profiles` for `display_name`, so this is a one-line addition per view,
  via `create or replace view`). `papers-leaderboard.js` and
  `papers-leaderboard-overall.js` need a small render change to show the
  flag next to the name.

### Feature 4 — Gate Articles behind login

**Requirement**: all articles require signup/login. Logged-out visitors see
a teaser (title/intro) with the body blurred/hidden and a "log in to keep
reading" prompt — not a hard redirect.

**Before building**: a fresh session needs to actually look at
`content/articles/` and whatever layout currently renders it (not explored
in this session — likely the theme's `layouts/blog/single.html` or a
`layouts/_default/single.html` fallback, needs confirming) before deciding
the exact mechanism.

**Likely approach** (confirm against real structure first):
- A cascade in `content/articles/_index.md` (same pattern as
  `content/papers/_index.md`'s `layout: "question"` cascade) setting a
  `layout: "gated-article"` on every descendant page, resolving to a new
  `layouts/articles/gated-article.html`.
- That layout renders the article's title + a short excerpt (Hugo has
  `.Summary`/`.Truncate` built in) always, then wraps the full `.Content`
  in a container that's hidden/blurred by default via CSS.
- A small JS file (`static/js/papers-article-gate.js` or similar, loaded
  only on article pages) checks `PapersAuth.getSession()` on load: if
  logged in, un-hides the body (remove the blur class); if not, leaves it
  blurred and shows a "Log in to keep reading" CTA linking to the login
  page — pass a return-URL (e.g. `?next=` query param or store the intended
  URL in `sessionStorage` before redirecting) so the user lands back on the
  same article after logging in, rather than on a generic account page.
- This is a **presentation-layer gate, not a real access-control
  boundary** — like the existing quiz answers, the full article HTML still
  ships in the page source (just visually hidden via CSS) unless a further
  requirement emerges to actually withhold the content server-side. Worth
  stating explicitly to the user when this is built, in case that
  distinction matters to them (it didn't seem to be the intent here, but
  confirm rather than assume).

### Suggested build order

1. **Features 1+2 together** (navbar icon, login-state UI, avatar picker) —
   most visible, and 2 is really "finish what 1 started."
2. **Feature 3** (extended profile + leaderboard flag) — natural follow-on,
   shares the same "Edit Profile" UI surface as the avatar picker.
3. **Feature 4** (articles gating) — independent of the other three, can
   slot in anytime once the login page (feature 1) is in its improved,
   likely-relocated form, since the gate's CTA needs a stable place to send
   people.

Before starting any of these, re-confirm the plan above still matches user
intent — this was written from a single conversation, not iterated on with
mockups/review.

---

## Part 3 — Suggestions & risks to consider (not requested features, but worth raising)

Flagged 2026-08-08, after the system went live. None of these block shipping
Part 2's features, but they should inform *how* they get built, and some
should probably happen before the profile/leaderboard system is promoted
much more heavily.

**Operational gotcha — Supabase free-tier auto-pause.** Free Supabase
projects pause automatically after **7 days of no API activity**. If traffic
ever goes quiet for a week (school holidays, off-season for an Olympiad
site), login and the leaderboard go dark until someone manually resumes the
project from the Supabase dashboard. Either keep an eye on this or set up a
trivial periodic ping (e.g. a scheduled request to any Supabase endpoint) to
keep the project warm.

**Trust & safety — this is becoming a real public profile system for a
likely-student audience, with no moderation path today.** Specifically:
- `display_name` has no uniqueness constraint or content filtering (called
  out as an intentional MVP simplification when the schema was designed,
  worth revisiting now that profiles are more prominent).
- Feature 3's "about" field is free text with no moderation.
- There's currently no way to remove a bad leaderboard entry, ban a user, or
  act on a report — the only lever today is going into the raw Supabase
  Table Editor by hand.

Before the profile/leaderboard system is advertised more heavily, consider
at minimum: a lightweight report mechanism, and/or a manual `is_banned` /
`is_hidden` flag on `profiles` that the leaderboard views filter out.

**Privacy.** The system now collects email, display name, avatar, country,
and education level for what's likely a lot of minors. Worth having:
- A real privacy policy page (none currently exists on the site).
- A self-serve "delete my account" flow. The DB side is already fine —
  `profiles`/`attempt_reports` cascade cleanly from `auth.users` on delete —
  there's just no UI for a user to trigger it themselves today, only
  Supabase-dashboard-level deletion.
- Given the audience skews toward minors, double-check whether COPPA
  (US, under-13) or GDPR-minor provisions (EU) impose any specific
  obligations before collecting country/education-level data at scale —
  worth at least a deliberate look rather than assuming it's fine.

**Smaller technical ones:**
- Local/staging testing currently points at the *same* production Supabase
  project (per `SETUP.md`'s `vercel dev` instructions) — worth spinning up a
  separate dev/staging Supabase project so local testing doesn't pollute the
  real leaderboard data.
- `papers-auth.js` is sitewide now but still named as if it's BiOrchive-only
  — a rename (e.g. to `site-auth.js`) would reduce future-maintainer
  confusion. Natural to fold into feature 1's navbar work, since that work
  already touches this file's call sites.
- No rate limiting on `/api/submit-attempt`. Not exploitable for cheating —
  score is always server-recomputed, and the leaderboard only ever shows
  each user's *best* attempt — but worth keeping in mind as a nuisance/cost
  vector (extra DB rows, extra function invocations) as traffic grows.
- No error-tracking/observability beyond manually reading Vercel function
  logs when something's reported broken. Fine at current scale; worth a
  lightweight solution (even just consistent `console.error` conventions,
  already started in `submit-attempt.js`) if the API surface grows.

---

## Part 2 implementation notes (added same session, after the plan above)

All four features were built together rather than in the suggested 1+2 → 3 →
4 order, per explicit user confirmation. Three open decisions from the table
above were also resolved with the user before building:
- Login page relocated to **`/account/`** (not kept at `/papers/account/`).
- Login page redesign direction: **split-screen** (branded panel + form).
- Avatar images: **user-supplied**, not Claude-generated placeholders — the
  picker UI/DB wiring is fully built and functional, but `static/avatars/`
  has no actual image files yet (see below).

### What changed, by file

- **`content/account/index.md`** (new) — replaces
  `content/papers/account/index.md` (deleted). `aliases: [/papers/account/]`
  in front matter makes the old URL redirect here automatically. Split-
  screen via `layout: "wide"` + a new `.account-split` CSS layout (assets/
  css/custom.css section 19). The logged-in section is now a full profile
  editor (avatar grid + country/education/about form), not just a "logged in
  as X, log out" message.
- **`static/js/papers-account.js`** (rewritten) — same login/signup/reset/
  recovery logic as before, plus: `AVATAR_FILES` (12-item list, must match
  whatever ends up in `static/avatars/`), `COUNTRIES` (ISO alpha-2 list for
  the country `<select>`), avatar-grid click-to-save, profile form save
  (country/education_level/about with a client-side 50-word cap), and
  `?next=` redirect support (used by the article gate's login CTA).
- **`static/js/papers-auth.js`** — added `PapersAuth.getProfile(userId)`,
  a small wrapper around `profiles` select, so the navbar icon and the
  account page don't each duplicate that query.
- **`layouts/partials/navbar-title.html`** — added the always-visible
  account icon markup right after the logo (an inline SVG person glyph +
  a hidden `<img>` for the avatar), per feature 1's plan.
- **`static/js/papers-nav-account.js`** (new, site-wide, loaded from
  `layouts/partials/custom/head-end.html` right after `papers-auth.js`) —
  swaps the navbar icon between the generic glyph and the user's
  `profiles.avatar_url`, reactively via `PapersAuth.onChange`.
- **`supabase/migrations/002_profile_fields.sql`** (new) — adds
  `country`/`about`/`education_level` to `profiles` (with CHECK constraints
  — education_level enum, country must be 2 uppercase letters, about capped
  at 400 chars as a defensive backstop behind the real 50-word client-side
  limit), **plus a CHECK constraint on the pre-existing `avatar_url` column**
  restricting it to the `/avatars/...` pattern (the "cheap to close off"
  suggestion from feature 2's plan — done). Also re-`create or replace`s
  `leaderboard_per_round` and `leaderboard_overall` to expose `country`.
  **Not yet run against production** — this is a manual step, same as
  `schema.sql` was in Part 1. See updated `SETUP.md` step 2.
- **`static/js/papers-leaderboard.js`** / **`papers-leaderboard-overall.js`**
  — added a `countryFlag(code)` helper (derives the flag emoji from the
  ISO code with no image assets, as planned) and render it next to
  `display_name`. No shortcode/HTML changes needed since both already
  `select('*')` from their views.
- **`content/articles/_index.md`** — added a `cascade` targeting
  `/articles/**` with `layout: "gated-article"` (same pattern as `content/
  papers/_index.md`'s existing cascade for question pages). **Important**:
  the two existing article stub pages
  (`content/articles/{neuroscience,lab-recommendations}/_index.md`) had
  their own `layout: "wide"` front matter removed — an explicit front-matter
  value on a page always wins over a cascaded one from its parent, so the
  cascade would have silently done nothing if these hadn't been touched.
  Any *new* article added later must not set its own `layout` for the same
  reason.
- **`layouts/gated-article.html`** (new) — same visual shell as
  `themes/hextra/layouts/wide.html` (full-width, no doc sidebar), but wraps
  `.Content` in a blur container and always shows `.Description` as an
  unblurred teaser above it.
- **`static/js/papers-article-gate.js`** (new, loaded only on gated-article
  pages) — checks `PapersAuth.getSession()`; unlocks (removes blur class) if
  logged in, otherwise shows a CTA linking to `/account/?next=<article
  path>` so `papers-account.js` can redirect back here post-login. **Fails
  closed**: the blur is the CSS default on `.article-gate-body` itself, not
  something JS adds — if this script fails to load, the content stays
  blurred rather than leaking. As noted in the original plan, this is a
  presentation-layer gate only (the HTML still ships in page source); worth
  restating to the user if that distinction matters more than it seemed to
  when this was scoped.
- **CSS** — assets/css/custom.css sections 19 (rewritten for split-screen),
  21 (avatar grid + profile form, new), 22 (navbar icon, new), and 23
  (article gating blur, new), plus one line added to section 20
  (`.papers-leaderboard-flag`).
- **`SETUP.md`** — added the migration step, a new "add avatar images" step
  with the exact expected paths, and Part-2-specific checklist items.

### What was verified this session (via the local `hugo-dev` preview server)

- Clean full `hugo server` build: 422 pages, 1 alias, **zero template/render
  errors** after a from-scratch restart. (Mid-session, before the restart,
  the dev server intermittently failed whole-site rebuilds with `open
  ...pdf: The requested operation cannot be performed on a file with a
  user-mapped section open` — a pre-existing Windows file-locking issue on
  one of the Taiwanese-BO PDF resources, unrelated to anything in this
  session. It also left `.hugo_build.lock` behind. Both looked at first like
  they might be caused by Part 2's changes — they weren't; a server restart
  with the stale lock file removed made the errors disappear entirely. If a
  future session sees the same `user-mapped section open` errors, that's
  this same pre-existing issue, not a regression — a plain restart clears
  it.)
- `/account/` renders the split-screen layout (`.account-split` computes to
  `display:flex`, ~42/58 panel split at desktop width) and correctly shows
  the "unconfigured" screen locally (no `HUGO_SUPABASE_*` env vars set in
  this dev environment, same as Part 1's local setup).
- The old `/papers/account/` URL redirects to `/account/` via the Hugo
  alias, landing on the same rendered page.
- The navbar account icon (`#nav-account-link`) is present in the rendered
  HTML on every page checked, pointing at `/account/`.
- `/articles/neuroscience/` resolves to `gated-article.html` (confirmed via
  `#article-gate-root` in the DOM, not a template-not-found fallback), shows
  the title + description teaser, and the blur/CTA mechanism itself was
  spot-checked directly (forcing the locked state computed `filter:
  blur(6px)` on `#article-gate-body`; the shipped JS unlocks automatically
  when `PapersAuth.isConfigured()` is false, which is why it isn't blurred
  by default in this local, unconfigured environment).
- `/papers/leaderboard/` still renders, its "Create an account" link now
  points at `/account/`.

**False alarm worth recording**: partway through, `navbar-title.html`
appeared to not be picking up edits at all (a canary comment/marker added
to the project's override never showed up in output), which looked exactly
like a Hugo project-vs-theme override precedence bug — the theme ships its
own `_partials/navbar-title.html` (new-style dir) alongside the project's
`partials/navbar-title.html` (old-style dir) at the same logical name. That
theory turned out to be wrong: `theme-toggle.html` has the identical
old-style/new-style collision and its project override (an extra
"Favourite" theme option) rendered fine throughout. The real cause was the
dev server's build state getting wedged by the PDF file-lock issue above; a
clean restart fixed `navbar-title.html` too, no directory changes needed.
Leaving this here so a future session doesn't waste time re-chasing the
same red herring.

### What's still genuinely unverified (needs a real Supabase project)

Everything above was checked against a **local, unconfigured** environment
(no `HUGO_SUPABASE_URL`/`HUGO_SUPABASE_ANON_KEY`), so anything that only
happens once a real session/profile exists is still unverified:

1. Run `supabase/migrations/002_profile_fields.sql` against the real
   Supabase project (it hasn't been run anywhere yet).
2. Add real files to `static/avatars/avatar-01.png` … `avatar-12.png` (or
   change `AVATAR_FILES` in `papers-account.js` to match whatever's
   actually supplied) — the picker UI works but has nothing to pick yet.
3. With real credentials configured, walk the new SETUP.md Part-2 checklist
   items end-to-end: navbar icon swapping to the chosen avatar without a
   reload, the leaderboard flag actually appearing for a saved country, the
   50-word cap blocking a real save, and the article gate's `?next=` round
   trip actually returning to the article post-login.
