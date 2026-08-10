# BiOClash MB-01 — exam delivery mechanism, context handoff

This file exists so a fresh Claude session (after `/clear`) can pick up
exactly where this one left off, without re-deriving the architecture or
re-discovering the same bugs. Read this whole file before touching any of
this system. Companion doc: `LOGIN_ROADMAP.md` (the underlying Supabase
auth/leaderboard system this builds on top of — read that too if you need
the auth/RLS patterns from first principles).

**Status as of 2026-08-10: code-complete, locally verified, NOT yet run
against production.** Migration 009 has not been executed in the Supabase
SQL editor. No endpoint has been exercised against a real Supabase project
(this dev environment has no credentials). Everything below "genuinely
unverified" needs a real pass before this goes anywhere near real students.

---

## What this is

BiOClash's first real competition paper: **Case File MB-01**, Molecular
Biology & Biochemistry, 133 marks, TVA/Loki-themed. This is a **parallel
system to BiOrchive's existing practice/timed-attempt infrastructure**
(`papers-attempt.js`, `papers-quiz.html`, `data/papers/*.yaml`) — not a
refactor of it, and BiOrchive is untouched. The reason it had to be
separate: BiOrchive's Timed Attempt embeds an entire round's question data
(including every correct answer) directly in the page's initial HTML —
an accepted tradeoff for a free practice archive, but not acceptable for a
high-stakes competition where nothing not-yet-earned may ever reach the
client.

**Currently gated to one person.** `data/bioclash/mb-01.yaml` has
`accessMode: allowlist`, checked against a `bioclash_paper_access` table
seeded (by migration 009) with `nishitkalani@gmail.com`'s account. No nav
entry points at `/bioclash/mb-01/attempt/` yet either. Both are deliberate
— see "Access control," below, before changing either.

---

## Architecture in one paragraph

Question **content** (text, options, correct answers, marks, which
questions lock/reveal what) lives in `data/bioclash/mb-01.yaml`, built with
the static site — same split as BiOrchive's `data/papers/*.yaml`. Attempt
**state** (what's locked, what's been answered, timing, anti-cheat
counters) lives in three new Supabase tables, written exclusively through
five Vercel serverless functions using the service-role key — the client
never has a Supabase write path for any of this, matching this repo's
existing house style for every sensitive table (`attempt_reports`,
`account_deletions`, `bioclash_results`). The frontend
(`static/js/bioclash-attempt.js`) is a single-page controller that fetches
question content live from the server on every load rather than having it
embedded in the page — this is the one deliberate, load-bearing divergence
from BiOrchive's pattern, and it's the whole point.

---

## Files that make up the system

**Database**
- [supabase/migrations/009_bioclash_attempts.sql](supabase/migrations/009_bioclash_attempts.sql)
  — **not yet run**. Adds three tables:
  - `bioclash_paper_access` — allowlist, `(paper_id, user_id)`. Empty by
    default; a row must exist for a user to do anything. Seeds the
    founder's own account by email lookup — **requires that account to
    already exist (real signup) or the insert silently matches nothing**;
    re-run after signing up if needed, it's idempotent.
  - `bioclash_attempts` — one row per `(user_id, paper_id)`. `status`
    (`in_progress`/`submitted`/`expired`), `end_at` (computed once at
    start from `durationMinutes`), soft anti-cheat counters
    (`fullscreen_exits`, `visibility_losses`), `auto_score_correct`/
    `auto_score_total` (partial, auto-gradable-only score, populated at
    submit).
  - `bioclash_attempt_blocks` — one row per `(attempt_id, block_id)`,
    granular lock state + stored raw answer. **A row only exists once an
    attempt has actually reached that block** — "not yet reached" means no
    row, not a hidden one.
  - RLS on all three: select-own only, **zero insert/update/delete grants**
    for `anon`/`authenticated`. This is intentional and matches every
    other sensitive table in this codebase — don't add a write policy here
    without a very good reason; the established pattern is "block all
    client writes, force every write through a service-role endpoint,"
    confirmed by direct audit of every other migration before this one was
    written.

**Content**
- [data/bioclash/mb-01.yaml](data/bioclash/mb-01.yaml) — the full 133-mark
  paper, all 6 parts, all question types. Schema:
  ```
  paper: {id, title, season, accessMode, durationMinutes, totalMarks, parts[], appendix}
  part: {id, name, marks, intro (narrative flavor text, optional), blocks[]}
  block: {id, locksAfterSubmit, reveals (block id), lockWarning, label,
          table/tables[], images[], components[], type: "reveal_content" (+ content)}
  component: {key, type, marks, prompt, options[] (mcq), correctKey (mcq),
              correctValue (true_false), expected/tolerance (numeric),
              refersTo/marksEach/promptTemplate (free_text_for_others)}
  ```
  Question types actually in use: `mcq`, `true_false`, `free_text`,
  `numeric`, `free_text_for_others` (see "Bugs fixed," #2), `reveal_content`
  (not a question — pure gated content). `fill_blank` is defined in the
  renderer but not currently used by any real question.
  `durationMinutes: 240` **is a placeholder** — confirm the real number
  before this goes live even in debug.
- `static/BIOCLASHPICS/` — `mb01-fig1..4-*.png` are the **real** figures,
  extracted directly from the source `.docx`'s embedded media (not
  regenerated). `mb01-bg-loki-wide.png` / `mb01-bg-loki-tall.png` are the
  founder-supplied Loki/TVA background art (see "Theming," below).
  **Figures 5, 6, 7 don't exist as art** (Q8b's CRISPR panels, Q10.4D(ii)'s
  Hill-coefficient curves, Q10.5(c)'s Lineweaver-Burk plot) — those three
  questions describe the figure in the prompt text instead, so they're
  fully functional; swap in a real `imageRef`/`images` entry later, no
  schema change needed.

**Backend (`api/`)**
- [api/_lib/bioclash.js](api/_lib/bioclash.js) — shared helpers, analogous
  to `api/_lib/supabaseAdmin.js` but for paper content: `loadPaper`,
  `allBlocks`, `findBlock`, `initialBlocks` (see "Bugs fixed," #1 — this
  function's correctness is the whole security model, read its comment
  before changing it), `seededShuffle` (deterministic per-user MCQ
  shuffle), `toClientBlock` (**the one function every endpoint must route
  content through** — strips every answer-key field), `componentIsCorrect`,
  `watermarkCode`.
- `api/bioclash-start-attempt.js` — `POST {paperId}`. Checks allowlist,
  creates or resumes the attempt row, creates `bioclash_attempt_blocks`
  rows for `initialBlocks()`, returns client-safe content.
- `api/bioclash-attempt-state.js` — `GET ?paperId=`. Same shape as
  start-attempt but read-only, used for refresh/resume — client state is
  always rebuilt from the server, never trusted from `sessionStorage`.
- `api/bioclash-save-draft.js` — `POST {paperId, blockId, componentAnswers}`.
  Recoverable blocks only, no correctness computation, pure autosave.
- `api/bioclash-lock-block.js` — `POST {paperId, blockId, componentAnswers}`.
  **The core mechanic.** Conditional `UPDATE ... WHERE status='active'` is
  the atomicity guarantee — a concurrent/replayed request can only ever
  match zero rows the second time. Hard cutoff at `end_at`, no grace
  window. On success, creates the revealed block's row (idempotent) and
  returns its client-safe content.
- `api/bioclash-submit-attempt.js` — `POST {paperId}`. Final submit,
  computes the **partial** auto-gradable score (mcq/true_false/numeric
  only — free_text is always offline-graded, which is the majority of this
  paper's marks). Does **not** write to `bioclash_results` — that stays a
  manually-populated final-placements table, untouched by this feature.

**Frontend**
- [static/js/bioclash-attempt.js](static/js/bioclash-attempt.js) — the SPA
  controller. Modeled on `papers-attempt.js` (wall-clock timer, DOM-swap
  nav, fullscreen tracking) but diverges where it must (see architecture
  above). Also owns: forced dark theme + theme-toggle lockout (see "Bugs
  fixed," #4/#5), the `free_text_for_others` dynamic renderer, table/image
  rendering, the per-user watermark overlay.
- [content/bioclash/mb-01/attempt/index.md](content/bioclash/mb-01/attempt/index.md)
  — the page. No embedded YAML/answers — everything comes from the API at
  runtime. **`content/bioclash/index.md` had to be renamed to
  `content/bioclash/_index.md`** to allow this nested child page to exist
  at all (Hugo leaf bundles can't have children) — if the landing page
  ever seems to have "lost" content or behaves oddly, check it's still
  `_index.md`, not reverted to `index.md`.
- `assets/css/custom.css`, section 24 ("BIOCLASH ATTEMPT DELIVERY") — all
  attempt-page-specific styles. Reuses `.bioclash-page`'s `--bc-*`
  variables (section 15) rather than redefining the palette.

---

## Bugs hit and fixed this session (don't reintroduce these)

1. **`initialBlocks()` leaking a reveal, then blocking all progress.**
   Original version scoped to "part 1's blocks only" — this meant
   `part-a-reveal` was visible from the very start (before Part A was ever
   locked — a real answer leak), and *separately*, once that was naively
   fixed by excluding reveal targets, nothing beyond Part A could ever
   become reachable at all (Part B isn't the `reveals` target of anything,
   so the attempt just dead-ended). Current, correct version: **every
   block in the entire paper is visible from the start except blocks that
   are literally the `reveals` target of another block.** Recoverable
   questions carry no secret-dependent info, so there's no reason to gate
   them — only genuinely secret-dependent content (`part-a-reveal`,
   `q10-4-rest`) stays behind a lock.
2. **Static "flaws for the remaining four" hardcoded 4 of 5 workflow
   letters** (I, II, IV, V) — since only 4 boxes existed for 5 options, the
   one letter never asked about (III) was trivially the correct answer by
   elimination, before the student even picked. Fixed with a new component
   type, `free_text_for_others`: renders one box per option **not
   currently selected** in a sibling MCQ (`refersTo`), recomputed live if
   the student changes their pick. Never a fixed subset. If you add another
   "explain why each wrong option is wrong" question anywhere in this
   paper, use this pattern, not a hardcoded list.
3. **Q10.4B's own prompt text names the answer to the still-locked
   Q10.4A** (it states the codon in question translates to methionine —
   exactly what Q10.4A's lock exists to protect). This is why `q10-4-rest`
   stays gated even though almost everything else in the paper doesn't
   need to be — don't "fix" this by making it visible upfront, that
   reopens the exact leak Q10.4A's lock is for.
4. **Forcing dark mode with a single class swap doesn't stick.**
   `assets/js/core/theme.js` (a project override, bundled/loaded near the
   end of `<body>`) unconditionally re-reads `localStorage` and re-applies
   the stored theme on every page load — and because that script tag loads
   *after* `bioclash-attempt.js` in document order, it clobbers a one-time
   forced class change. Fixed with a `MutationObserver` that reasserts
   `dark` for as long as the attempt page is mounted, regardless of what
   else touches the class or when.
5. **The sitewide theme-toggle button was still clickable on the attempt
   page.** Using it would call `localStorage.setItem('color-theme', ...)`
   — the MutationObserver would still force *this* page back to dark, but
   the visitor's sitewide preference (e.g. "favourite," the default
   everywhere else) would be silently overwritten for every other page
   too. Fixed two ways, both required: (a) CSS hides the toggle entirely
   (`body.bioclash-attempt-active .hextra-theme-toggle { display: none
   !important }`), and (b) a capturing-phase `click` listener on
   `document` intercepts and stops any click reaching the toggle **even if
   fired programmatically** (a hidden element still receives a
   JS-dispatched `.click()`, which a real mouse click never could) —
   verified by deliberately firing one and confirming `localStorage` was
   untouched.
6. **The glow background was too large/bright and drowned out text; the
   report/start screens had no solid panel at all.** Text readability must
   never depend on tuning a background image's exact opacity correctly —
   fixed by giving `#bioclash-attempt-start`/`-live`/`-report` an
   explicitly opaque panel (`#1c1814` in dark mode) with `color:
   var(--bc-ink) !important`, fully decoupled from whatever the background
   layer is doing. The background itself was later swapped from a
   synthesized gradient+filter to the founder's real Loki/TVA art (wide
   crop ≥701px, tall crop ≤700px, `static/BIOCLASHPICS/mb01-bg-loki-*.png`).

**Local-dev-only gotcha, not a real bug**: the Hugo dev server sends no
`Cache-Control` header on `custom.css`, so the browser heuristically
caches it hard — a CSS edit can appear to do nothing on reload. Confirmed
by comparing a cache-busted `fetch()` (fresh content) against the live
page's actual `document.styleSheets` (stale). Doesn't affect the real
Vercel deploy. If a CSS change ever seems not to apply locally, hard
cache-bust (append `?v=<timestamp>` to a manually-injected `<link>`, or
just trust the code and move on) before assuming the code is wrong.

---

## Theming — Loki/Mobius narrative

Light touch, by explicit design ("just enough to engage, not immerse," per
the founder). Each part has a 2–4 sentence `intro` field (narrative flavor
at the transition only) — the actual question prompts stay serious/
academic, matching the founder's own calibration in
`BiOClash-Loki-Narrative_1.md` (Downloads — covers Part A only; Parts B–F's
intros were extended in the same voice this session, not separately
reviewed by the founder yet). Background art came from `bioclashmb/loki1.png`
/`loki2.png` at the repo root (**not** under `static/` — that's a local
staging folder the founder drops reference/draft images in, not part of
the built site). That folder also has a pile of Loki-show reference images
(`hewhoremains.jpg`, `tvahq.jpeg`/`.webp`, `sacredtimeline.avif`,
`temploom.jpg`, `thetimedoor.jpg`, `judgesroom.webp`, `missminutes.webp`,
`timelinebranching.jpg`, `lockedup.jpg`, `lokifinale.jpg`) and an
`Improvements.md` with the founder's original design brief for this paper
— worth a look if more theming work happens later, none of it wired in yet
beyond the two background crops.

---

## What a fresh session should do first

Read this file, then skim `api/_lib/bioclash.js` and
`static/js/bioclash-attempt.js` to confirm nothing has drifted since this
was written. Don't re-explore BiOrchive's own attempt system from scratch
for context — the "Architecture" section above plus `LOGIN_ROADMAP.md` is
the fast path back to full context.

## Genuinely unverified — needs a real Supabase project

Everything in this session was checked against local logic (Node scripts
directly exercising `api/_lib/bioclash.js`'s leak-safety and gating
behavior) and a local, unconfigured Hugo build — never against a live
attempt with real credentials, since this dev environment has none of
those. Before this goes anywhere near a real student:

1. Run migration 009 in the Supabase SQL editor. Confirm
   `nishitkalani@gmail.com` already has an account, or sign up first and
   re-run the seed block.
2. With `vercel dev` + real env vars (see `SETUP.md` for the local-dev
   pattern this whole system already uses): log in as the allowlisted
   account, call `start-attempt`, confirm only Part A-equivalent content
   comes back with no `correctKey` anywhere in the raw response — inspect
   network payloads directly, not just the rendered UI.
3. Log in as a **different**, non-allowlisted account and confirm every
   endpoint 403s.
4. Walk the full adversarial test plan from the original design doc (still
   not executed against a real backend): replay a captured `lock-block`
   request, refresh mid-lock, two tabs on the same attempt, let time expire
   exactly at a lock click, view-source at every screen.
5. Set a real `durationMinutes`.
6. Decide when Layer 1 (linking the attempt page from `/bioclash/`) and
   Layer 2 (widening `bioclash_paper_access` beyond one account) actually
   flip — neither is part of what's built; both are separate, deliberate
   go-live decisions.
