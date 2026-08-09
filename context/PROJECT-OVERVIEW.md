# BiOGuide — Project Overview

**Written:** 2026-08-08. **Updated:** 2026-08-09, after a long session that shipped: IBO 2024 Theoretical B Q31–Q50 (the round is now 50/50, complete); a BiOClash teaser/landing page at `/bioclash/` (curtain-reveal intro, countdown to a Sept 11 target, login-based "notify me") — the founder's priority (2) below, in teaser form, not the full competition; a "BiOClash Champions" section on `/papers/leaderboard/` (currently empty — no season has run yet — but wired end-to-end and ready); and a full Discussions/comments system at `/discussions/` — the founder's priority (4) below, now shipped. Vercel Analytics was also enabled this session (by the founder, not built). **Purpose:** a single orientation document for a *strategy* conversation (social media, outreach, scope expansion) — not an engineering handoff. It tells you what the site is, what's built, what's missing, and what the founder has already said they want, so that conversation can start from an accurate baseline instead of re-deriving it or guessing. For engineering-level detail on any specific system, this file points to the dedicated docs that already exist rather than repeating them.

If anything here conflicts with the live site or repo, trust the live thing — this doc is a snapshot, not a source of truth.

---

## 1. What BiOGuide is

A free, non-commercial study/practice site for Biology Olympiad prep (IBO primarily, with USABO/INBO referenced), built as a static Hugo site (Hextra theme) deployed on Vercel, plus a small Supabase-backed login/leaderboard layer added this year. Live at `boguide.vercel.app`.

**Founder's own positioning** (from `content/about/_index.md`, worth reading verbatim before writing any outreach copy — it's the founder's actual voice):
- Explicitly non-commercial / non-profit, "highly interactive," "highly modernised," "globally relevant."
- Named competitors the founder looked at and rejected as a model: **Biolympiads.com** and **Learntuitive.com** — both described as "fairly outdated, low on activity, and somewhat commercialised." A BiOGuide survey (see below) backed up that impression.
- Stated content process: founder writes/edits everything "word by word," a "specialised team" reviews and rates it (only >4/5 ships), that same team compiles past-year papers. **In practice today this is aspirational** — see Team, below.
- Founder-stated future features (their own words, in priority order they said a survey would help rank): **(1)** a paper archive — **already built, this is BiOrchive**, **(2)** an "indigenous biology competition" — **teaser stage now live, this is BiOClash** (`/bioclash/`: landing page, countdown to a September 11 "Season 1" target, login-based notify-me; a "Champions" leaderboard section exists on `/papers/leaderboard/` ready to show results once a season actually runs — nothing has been scored yet, this is explicitly not the competition system itself, see `context/bioclash-planner.md`), **(3)** an "indigenous AI agent" to guide prep — not started, **(4)** a comments/feedback/discussion section — **built, this is Discussions** (`/discussions/`: public threads, open to read by anyone, posting requires an account, closing a thread is a manual owner action via the Supabase SQL editor — no in-app moderation UI yet).
- A Google Forms survey ran **June 3 – July 21, 2026** (closed) to prioritize those features and shaped at least one real content decision already (Bioenergetics was deliberately scoped down after a "depth is unknown, people just keep reading hundreds of pages" complaint — see `handoff.md`). **Worth pulling the actual response data before any scope-expansion conversation** — it exists but this doc doesn't have it. **Known live bug, not yet fixed as of this writing**: `content/about/_index.md` and `content/resources/_index.md` both still tell visitors the survey "is live... visit soon" — the window closed weeks ago and the copy was never updated. Worth fixing before a production push; a dead/wrong CTA reads badly to a first-time visitor.

## 2. Team

**Solo right now.** The founder (a high schooler in India, per the About page) does everything — content, code (via Claude sessions like this one), and outreach. They're actively trying to assemble a small team but haven't yet. Any outreach strategy should account for this: growth that creates support/moderation load (comments, a Discord community, a leaderboard with public profiles) lands on one person until that changes.

## 3. Tech stack, in one paragraph

Hugo (static site generator) + Hextra theme, deployed on Vercel. Zero backend until this year; now there's a Supabase project (Postgres + Auth) for the optional login/leaderboard feature, plus a couple of Vercel serverless functions under `api/` for the one thing that can't be trusted to the client (scoring a timed test attempt). No database for content — all study content is Markdown files in `content/resources/`, olympiad papers are YAML in `data/papers/`. No paid infrastructure currently in use beyond free tiers (Vercel, Supabase free tier — **note: Supabase free tier auto-pauses after 7 days with no API traffic**, a real operational risk if the site goes quiet, e.g. over a school holiday).

## 4. Content inventory — study notes (`content/resources/`)

15 numbered subject sections. Each section's own `title:` front matter carries a ✅ once it's considered content-complete (images + interactive widgets included, not just text) — this is the founder's own tracking convention, already accurate as of this writing:

| # | Section | Status |
|---|---|---|
| 1 | Cell/Molecular Biology & Biochemistry | ✅ Complete (23 topic pages — the largest section) |
| 2 | Genetics | ✅ Complete (9 topic pages) |
| 3 | Bioinformatics | ✅ Complete (single long-form page, 839 lines) |
| 4 | Plant Computational Biology (Practical 4) | ✅ Complete |
| 5 | Plant Physiology | ✅ Complete (11 topic pages) |
| 6 | Evolution | ✅ Complete (11 topic pages) |
| 7 | Animal Physiology | ✅ Complete (13 topic pages) |
| 8 | Animal Anatomy | ✅ Complete (16 topic pages — the original reference section) |
| 9 | Plant Anatomy | ✅ Complete (10 topic pages) |
| 10 | Ecology | ✅ Complete (single long-form page, 1,609 lines) |
| 11 | Ethology | ✅ Complete (9 topic pages) |
| 12 | Biosystematics | **Content + widgets done (7 pages), images not yet sourced** — the one section without a ✅ |
| — | Practical 1 (Molecular Bio/Biochem) | **Stub only** — "coming soon as IBO 2027 approaches" |
| — | Practical 2 (Wildlife Ethology) | **Stub only** — same |
| — | Practical 3 (Plant Biology) | **Stub only** — same |

Total: 303 content pages sitewide, 136 standalone interactive widget files (Plotly/SVG/JS, no build step), ~600 sourced images across 11 `static/<SECTION>PICS/` folders. Depth target throughout is "roughly first-year-university," calibrated and re-confirmed page by page — not GCSE-level survey and not full graduate-textbook depth.

**Real unresolved gap: image licensing.** `image-sources.md` (repo root) logs every sourced image. Current tally: **420 rows marked `CHECK`** (license unconfirmed — sourced from ResearchGate, textbooks, blogs, etc.), only 3 fully `OK` and 31 `OK (likely)` (Frontiers/MDPI open-access journals), and **2 rows marked `CONFIRMED COPYRIGHT`** (an explicit "© Merriam-Webster, Inc." watermark and a "© W.P. Armstrong" watermark, both still live on the site). The site's standing internal policy has been "source anything, flag clearly, don't block" — meaning **licensing was deliberately deferred, not overlooked**, but a real pass is needed before this site is promoted hard to a wider audience. This is the single largest legal exposure on the site today.

## 5. Content inventory — BiOrchive (`content/papers/`)

The papers/practice-test archive. Structure: olympiad → year → round → question, each question a real reproduced exam problem (CC BY-NC-SA licensed, IBO's own license) with a 4-statement true/false quiz, a timed "attempt" mode per round, and now an optional leaderboard.

- **IBO 2022 Theoretical 1**: 49/50 questions (Q50 still outstanding — not touched in the 2026-08-09 session either)
- **IBO 2022 Theoretical 2**: 50/50 — complete
- **IBO 2024 Theoretical A**: 50/50 — complete
- **IBO 2024 Theoretical B**: 50/50 — complete (finished 2026-08-09; Q31–Q50 added, including new `attempt/`/`leaderboard/` subpages now that the round is full)
- **TBO (Taiwanese BO)**: an early, small placeholder sample with non-real problem data — not a real content offering yet

Ingestion is a well-documented, repeatable process (`papers-ingestion-workflow.md`) — page mapping, figure extraction, answer-key transcription, YAML/content assembly, validation, are all a known recipe now. Adding more years/olympiads is a content-sourcing problem (finding a real exam PDF + its answer key/solutions), not an engineering one.

## 6. Login + leaderboard system (built in phases; extended again 2026-08-09)

Previously a 100% static, backend-free site. Now: optional email/password accounts (Supabase Auth), fully optional — every practice question and timed attempt still works with zero account. What exists as of this writing:

- Signup/login/password-reset, at `/account/` (split-screen page; old `/papers/account/` URL still redirects there).
- A profile: avatar picker, country (shown as a flag on the leaderboard), education level, a short bio.
- **Moderation exists** (contradicts an earlier version of this doc): `profiles.is_hidden`, a manual owner-only flag set via the Supabase SQL editor (no in-app UI), filters a user out of every leaderboard/Discussions view sitewide. See `SETUP.md`'s "Moderation" section for the exact command.
- **A privacy policy page exists** at `/privacy/` (an earlier version of this doc said it didn't — that was wrong even before this session).
- **Self-serve account deletion exists** — a "Delete my account" button on `/account/`, backed by `api/delete-account.js` (another earlier-version inaccuracy in this doc).
- Timed-attempt submission is **server-validated** — the client never sends a score, only raw answers; a serverless function independently recomputes correctness against the same YAML the site is built from. A logged-in user cannot fake a leaderboard score via devtools.
- Leaderboard page (`/papers/leaderboard/`) was restructured 2026-08-09: **"BiOClash Champions"** now sits at the top (heavily re-themed in BiOClash's own crimson/gold identity, deliberately distinct from the rest of the site — currently shows an honest "no champions crowned yet" empty state, since no BiOClash season has run), then the pre-existing "Practice Leaderboard — Overall" Hall of Fame (podium for top 3, ranked list below), then one leaderboard per test round (now 4: IBO 2022 T1, T2, IBO 2024 TA, **and TB**, added this session).
- **Discussions** (new, `/discussions/`): public comment/feedback threads. Anyone can read; posting (new thread or reply) requires login, same as every other write path in this system. Closing a thread is an owner-only action via the SQL editor (`update discussion_threads set is_closed = true ...` — enforced at the RLS level, not just hidden in the UI), same manual-action pattern as moderation above. Reuses `profiles.is_hidden` — a moderated user's threads/comments disappear from Discussions the same way their leaderboard entries do.
- **BiOClash notify-me** (new): visiting `/bioclash/` while logged in auto-opts the visitor into `profiles.notify_bioclash` — the mechanism the founder will use to email people when Season 1 actually opens. No automated emailing exists; the founder queries Supabase by hand for the recipient list when they want to send something (see `SETUP.md`).
- Articles (`content/articles/`) have a login-gate mechanism built (blur + "log in to keep reading," CSS-based fail-closed) — **but there are only 2 article stub pages on the whole site, both with zero body content.** The gating infrastructure is ready; there's no actual gated content behind it yet. This is very likely the single fastest way to make "Articles" in the top nav feel real, if that's ever prioritized.

**Known loose ends, not yet resolved:**
- `static/avatars/` currently has only 3 files (`avatar-01.jpg`, `avatar-02.jpg`, `avatar-03.jpg`), but the avatar-picker code expects 12 files named `avatar-01.png` … `avatar-12.png`. Right now the picker mostly shows broken/empty slots. Either more avatars need adding (matching the code's expected names) or the code needs updating to match what's actually on disk — a quick fix either way, just not done yet. (Not touched in the 2026-08-09 session — unverified whether this is still exactly the state, but nothing this session did would have changed it.)
- COPPA (US, under-13)/GDPR-minor provisions still haven't been specifically reviewed, and the site now collects even more (BiOClash notify opt-in, Discussions posts) from what's likely a lot of minors. More load-bearing now than when this doc last flagged it, given Discussions is public-facing free-text content from potentially-minor users with no moderation UI beyond a manual hide flag.
- Local dev and production currently point at the same live Supabase project — no separate staging database.
- Supabase free-tier auto-pause (7 days no API activity) is still an unaddressed operational risk — more consequential now that BiOClash/Discussions/leaderboards all depend on the same project staying warm.

Full technical detail on the original system (schema, RLS design, exact file list, every bug already hit and fixed) lives in `LOGIN_ROADMAP.md`; the three tables added this session (`profiles.notify_bioclash`, `bioclash_results`/`bioclash_leaderboard`, `discussion_threads`/`discussion_comments`) are documented in `SETUP.md` — read both before any engineering session touches this system again, don't re-derive it.

## 7. Design/visual identity

The site has a deliberate identity, not stock Hextra: lilac (`#8965c4`) + sage (`#5c7a58`) palette, Fraunces (serif, headings) + Inter (body) typography, a 4th custom "Favourite" theme option (gradient background) that is now the **site-wide default**. Fully documented in `aesthetics-context.md`. A CSS design-token pass (border-radius/shadow scale) happened this session; spacing tokens exist but haven't been retrofitted sitewide yet.

## 8. Social / outreach — current state

Per the founder directly, as of this writing:
- **Channels**: Discord, GitHub, Instagram (`@bioguideofficial`) — all linked in the navbar, all small/early. No other channels currently exist (no TikTok/X/YouTube/Reddit/newsletter). Discussions (`/discussions/`, new) is arguably a new "channel" too — open community threads, hosted on-site rather than on Discord.
- **Vercel Analytics is now enabled** (turned on by the founder, 2026-08-09 — not built by an engineering session, just flagged so the next conversation doesn't assume zero visibility). No custom event tracking beyond whatever Vercel Analytics captures by default — still worth clarifying what's actually being measured (pageviews only vs. signup/retention funnels) before treating this as a solved problem.
- **A community-contribution banner** appears sitewide ("we are still a growing community... mail us at r6394175@gmail.com") asking for help — this is the only active recruiting mechanism today.
- The founder's own three self-identified next priorities (their words, this session): **growing audience/socials**, **expanding content scope** (more olympiads, more paper years, more depth), and **trust & safety / legal cleanup** (the image-licensing backlog and the minors-data gaps above) — roughly equally weighted, not one clearly first. Monetization/sustainability was explicitly *not* flagged as a current priority.

## 9. Suggested starting questions for the next conversation

Not a plan — just what this doc's author would ask first, given the above:

- Analytics is on now (see above) — worth checking what it actually captures before trusting it to inform a growth push.
- The leaderboard/profile system is genuinely public-facing (flags, avatars, display names) and now Discussions adds public free-text posts on top of that. A hide/ban flag (`is_hidden`) exists, but there's still no report mechanism and no in-app moderation UI — does *outreach* timing need to wait on more than the manual-SQL-only lever that exists today, or is that an acceptable ship-now-fix-later risk for a small early audience?
- The image-licensing backlog (420 unconfirmed rows) is a legal exposure that scales with traffic — worth sequencing before or alongside a real growth push, not after.
- Articles-with-gating is built but empty — is writing 2-3 real articles a cheap way to make the login system feel worth having, ahead of promoting it?
- The founder's own stated differentiators (interactive, modern, non-commercial, globally relevant) are a real positioning angle against the two named competitors — worth building outreach messaging directly around that contrast rather than generic "study site" framing.

## 10. Where to look for more detail

Don't re-derive these — read them directly:

| Topic | File |
|---|---|
| Login/leaderboard architecture, every file, every bug fixed | `LOGIN_ROADMAP.md` |
| BiOClash notify/Champions tables, Discussions tables, migration run order | `SETUP.md` |
| BiOClash original requirements/tone (now implemented — see the doc's own status header) | `bioclash-planner.md` |
| Papers/BiOrchive ingestion process, current exam completion status | `papers-ingestion-workflow.md` |
| Content-writing pattern/depth calibration for study pages | `handoff.md` |
| Image sourcing process + full licensing ledger | `visual-reference-workflow.md`, `image-sources.md` |
| Visual/design system | `aesthetics-context.md` |
| Supabase/Vercel setup steps (for a human, not Claude) | `SETUP.md` |
| Original login system design rationale | `plan_for_backend.md` |
| Early BiOrchive research (aoXiv comparison) | `boarchive-context.md` |
