# Architecture

BiOGuide is a Hugo static site backed by Vercel serverless functions, which
talk to a single Supabase Postgres database. There is no application
server in between: every piece of dynamic behavior is either a static page
generated at build time, a client calling Supabase directly under Row
Level Security, or a client calling one of the functions in `api/`.

```
Browser (static HTML/JS from Hugo)
  |
  |--- direct Supabase client calls, gated entirely by RLS
  |       (leaderboards, feeds, profile reads, most reads and some writes)
  |
  \--- Vercel functions (api/*.js), gated by verified auth tokens
          |
          \--- Supabase service-role client (bypasses RLS by design,
               used only for actions that must be trusted: grading,
               score computation, admin/cron actions)
```

This document exists to write down the decisions that aren't obvious from
reading any single file, the kind of thing a new contributor (or an
auditor) would otherwise have to reconstruct by reading migrations and
diffing behavior. `AGENTS.md` covers the project's AI-use policy;
`SECURITY.md` covers the security posture and how to report a problem.
This file covers how the system actually works.

## RLS is the security boundary, not a convenience

There is no backend service sitting between the browser and the database
for most operations. That means Postgres Row Level Security is not a
defense-in-depth layer on top of some other check, it is the only check,
for anything a client reads or writes directly. Every table with
user-facing data has RLS enabled, and the policies are the actual access
control, not the application code.

The corollary: a bug in an RLS policy is not a minor issue here the way it
might be in a system with an API layer in front of the database. It is
the whole security model failing for that table. `tests/rls/` exists to
catch exactly this class of bug against real Postgres before it ships,
not just by reading the SQL and reasoning about it.

Where a client cannot be trusted with something even under RLS (setting
its own final score, approving its own contribution, grading a timed
exam), that action goes through a Vercel function using the
service-role client instead, which bypasses RLS deliberately and
re-derives or re-validates the result server-side.

## BiOClash: anti-cheat and scoring

BiOClash's exam content (`data/bioclash/*.yaml`) never reaches the browser
directly. Every `api/bioclash-*.js` endpoint loads the paper server-side
and strips correct answers before sending a block to the client
(`toClientBlock()` in `api/_lib/bioclash.js`), so devtools inspection of
network responses cannot leak answers ahead of time.

A few specific mechanisms worth calling out:

- **Single active session.** Starting an attempt issues a session token
  stored on the attempt row. A 20-second heartbeat
  (`static/js/bioclash-attempt.js`) posts that token back; if a different
  tab or device starts a new session, the old one is told it has been
  superseded and locked out. This is what stops the same account running
  two tabs against the same exam.
- **Server-side score authority.** Nothing the client submits is trusted
  as a final score. `autoGrade()` recomputes correctness from the stored
  answers against the server's own copy of the paper at submit time, both
  for a normal submission and for the cleanup job that auto-grades
  attempts abandoned mid-exam.
- **Optimistic concurrency, not locks.** Actions like locking a block or
  requesting a time extension condition their update on the exact state
  they last read (`.eq('status', expectedStatus)` style checks) and treat
  a null result as "someone else already changed this." No database
  transaction or row lock is needed for this to be correct.
- **Z-score season standings.** `bioclash_season_standings`
  (`supabase/migrations/013_bioclash_season_scoring.sql`) ranks
  participants by `sum(time_normalized_z * season_weight)` across rounds,
  not raw score. Normalizing each round's result to a z-score before
  summing is what makes a season's standings comparable across rounds of
  different difficulty, a raw-score sum would let one easy round dominate
  the whole season.

The full BiOClash-specific audit (scalability and security across all 8
endpoints) is a separate document; ask if you need it, it isn't
duplicated here.

## BiOLab: open protocol archive, not a curated library

BiOLab pivoted from a single fixed assay to an open archive: any
experiment topic can be submitted, it publishes immediately, and
moderation is report-and-remove rather than pre-publish review
(`supabase/migrations/017_biolab_open_protocols.sql` onward). This is a
deliberate tradeoff, not an oversight, immediate publish means the
archive can grow without a review bottleneck, at the cost of relying on
reports catching anything wrong after the fact rather than before.

The `is_official` flag on a protocol is derived from `created_by IS
NULL`, meaning "no user owns this row, so it's BiOGuide's own seed
content." `tests/biolab/test.mjs` proves a client can never set
`created_by` to null or to another user's id, at insert or update time,
since that would let anyone spoof the official badge, and it runs those
checks against a real Postgres engine (`@electric-sql/pglite`, a WASM
build of actual Postgres, not a reimplementation) rather than just being
reasoned about from the SQL. That harness earned its keep before it even
shipped: it caught 015's own seed insert setting `created_by` to the site
owner's uuid instead of leaving it NULL, contradicting 015's own design,
and it caught an early draft of 017 that added the disclaimer check
constraint before that fix landed, which would have made the migration
fail to apply against the live aspirin row. Its coverage stops at
migration 017, though, the moderation, multi-image, and attachment work
added in 019 through 040 (below) was verified against pglite at the time
each shipped but has not been folded into this suite as a standing
regression check.

Submission photos and protocol attachments are both optional file
uploads, and their Storage RLS is deliberately asymmetric between insert
and select, an asymmetry that is easy to get backwards. At insert time
the parent row (a submission, a protocol) does not exist yet, since the
app has to upload the file first and get a path back before it can write
a row that references it, so the insert policy can only check the
object's path prefix against the uploader's own id (or, for attachments,
the protocol's id). At select time the parent row does exist, so that
policy instead joins through it to check live `is_published`/`is_removed`
state. A draft of `021_biolab_multi_image_and_attachments.sql` applied
that same join to the insert policy too, which would have made it
impossible to ever create the `biolab_submission_images` row the upload
was for, since nothing to join against exists at that point in the flow.

That same migration also surfaced a real stored XSS, caught in a later
security-review pass: `biolab_protocol_attachments.file_name` is only
constrained to end in `.pdf`, and `static/js/biolab-archive.js`'s
`escapeHTML()` used the `textContent` to `innerHTML` round-trip trick,
which escapes `&`/`<`/`>` in text-node serialization but not quote
characters, since quotes only matter inside attribute-value delimiters.
A crafted filename could break out of the `download="..."` attribute on
the public protocol page and inject an event handler that fires on any
visitor who interacts with the link. The fix hardens `escapeHTML()`
itself to also encode `"` and `'`, closing every call site the function
has at once, including the ones whose values happened not to be
attacker-controlled, rather than special-casing only the one attribute
context that was actually exploitable.

Moderation is a two-tier design, not a single flag. `is_removed` (added
in `020_biolab_moderation_removal.sql`, extended to feedback comments in
`040_biolab_feedback_moderation.sql`) has no `grant insert`/`grant
update` to the `authenticated` role on any of the three tables it lives
on, staff included, so flipping it requires the Supabase dashboard's
service-role access, the same way `is_verified` already worked. What
staff can do from inside the app, once `profiles.is_staff` existed
site-wide (`023_staff_roles.sql`) and was extended to BiOLab's report
tables (`039_report_queue_staff_policies.sql`), is triage: mark a report
`actioned` or `dismissed` and record who resolved it, without that action
ever touching the underlying content's visibility. No page under
`static/js/` calls that grant yet, staff still resolve BiOLab reports
through the dashboard in practice, but the RLS already permits an in-app
report queue if one gets built later, it does not need another schema
change to exist.

## Doubts: staff-answered, student-asked

Doubts (`supabase/migrations/024_doubts_conversion.sql` onward) intentionally
inverts BiOLab's openness: anyone can ask, only staff (`profiles.is_staff`)
can answer. This is enforced at the RLS layer on `doubt_replies`, not just
hidden in the UI, a non-staff user's insert is rejected by policy
regardless of what the client sends.

## BiOrchive: ingestion is a pipeline, not manual entry

Past-paper ingestion (`scripts/papers_ingest/`) exists because every
source PDF is a slightly different shape: some have clean, extractable
text and reliable question numbering, others are OCR-quality and
letter-spaced, others have no question numbers at all and only topic
headers, others mark answers with a bare mark in a column with no
adjacent letter. The pipeline's job is figure extraction, answer-key
cross-verification against the source's own worked explanations, and
YAML assembly, each of these steps has had to be adapted per paper, and
the `.claude/skills/ibo-paper-ingestion` skill file documents the specific
gotchas found so far so the next ingestion doesn't rediscover them from
scratch. Every ingested round is independently re-verified: numeric
answers are re-derived from first principles where possible, not just
copied from the source's own answer key, since the source's answer key
has itself contained real errors more than once.

`.claude/skills/ibo-paper-ingestion` is IBO-specific by design, its
content is a set of real findings from actual IBO papers (a figures-only
exam PDF whose real content lived in the solutions document instead,
answer marks distinguished only by column position with no adjacent
letter, and so on), not a generic template. Extending the pipeline to a
different olympiad does not mean editing that file to be more generic,
since doing so would delete the specificity that makes it useful for
IBO. Instead, `.claude/skills/paper-ingestion-skill-creator` is a
meta-skill: given a new olympiad's source PDFs, it runs the same
category of structural checks `ibo-paper-ingestion` had to work out for
itself (does the exam PDF actually contain the questions, what does a
header look like, is there more than one official answer source, and
critically, what the source's own license or rights statement actually
says, never assumed to be the same permissive terms IBO's papers carry)
and writes a brand new sibling skill,
`.claude/skills/<olympiad>-paper-ingestion`, containing only what was
actually confirmed against that olympiad's real documents. `CONTRIBUTING_PAPERS.md`
is the human-facing counterpart: it documents this same pipeline for an
external contributor working in their own clone with their own Claude
session, as a second, git-and-PR-based intake path alongside the
in-app, staff-reviewed `/papers/contribute/` form
(`supabase/migrations/028_paper_contributions.sql`), rather than a
replacement for it.

## Dashboard: client-side spaced repetition

The study dashboard's mastery tracking and "weak areas first"
recommendations (`static/js/papers-knowledge.js`) run entirely
client-side against a user's own attempt history, no server-side
scoring job computes this. Mastery itself is confidence-deflated by
sample size (a subject tested on 2 statements with 100% accuracy is not
treated the same as one tested on 20, via `sampleConfidence`).

The "Revisit Soon" recommendation bucket used to be a fixed 30/90-day
since-last-attempt heuristic. It's now backed by a real per-subject SM-2
schedule (`subject_review_state`,
`supabase/migrations/029_subject_review_state.sql`, one row per
`(user_id, subject_link)` with `ease_factor`, `interval_days`,
`repetitions`, `due_at`). `computeSm2Update()` implements the standard
algorithm unchanged: a quality below 3 resets `interval_days` to 1 and
`repetitions` to 0, a quality of 3 or above grows the interval (1, then
6, then `round(interval * ease_factor)`), and `ease_factor` is nudged by
the same `0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)` formula
Wozniak's original SM-2 uses, floored at 1.3 so a string of poor results
can't collapse the interval growth rate to nothing. This tracks subjects
rather than individual questions deliberately: the per-question quiz UI
(`layouts/shortcodes/papers-quiz.html`) grades entirely client-side and
never writes to Supabase, so subject-level reuses mastery data that
already exists instead of standing up a whole new per-question review
pipeline.

Two different things feed a quality score into `computeSm2Update()`.
`syncReviewSchedule()` runs once per dashboard load, and for every
subject whose most recent attempt is newer than that subject's own
stored `last_attempt_at`, derives quality automatically from that
attempt's accuracy (`qualityFromAccuracy()`: 90%+ is a 5, down to
0-19% being a 0) so a subject's due date moves without the user doing
anything beyond taking a paper. `recordManualReview()` is the other
path, wired to four Again/Hard/Good/Easy buttons rendered directly on
each Revisit Soon card, for reviewing outside a full timed paper, since
requiring an entire paper just to push one subject's due date out would
make "review" far heavier than it needs to be. Both paths write through
the same upsert, keyed on `(user_id, subject_link)`, so whichever one
last ran wins.

A separate, previously-broken piece of the same recommendation engine:
`suggestNextPaper()`'s "Suggested Next Paper" card used to always return
null, because it built its list of candidate rounds from the user's own
`attempts` array and then filtered out every round already in that same
array, which is every round in it by construction. The fix is
`layouts/shortcodes/papers-rounds-data.html`, a Hugo shortcode embedded
on the dashboard page that walks `hugo.Data.papers` at build time and
emits a JSON catalog of every round that actually has an `attempt/`
page (checked via `site.GetPage`, since practice-only rounds never
produce an `attempt_reports` row to compare against) along with the
subject links its questions cover. `suggestNextPaper()` now scores that
external catalog against the user's weak subjects instead of scoring
its own attempt history against itself, and keys "already attempted" by
`olympiad|year|roundId` rather than bare `roundId`, since round ids like
`theoretical-1` repeat across years and a bare-id match was silently
treating every year's Theoretical 1 as the same round.

## BiOLudo: a client-only game with two trust models for one board

BiOLudo (`static/js/bio-ludo.js`, `layouts/shortcodes/bio-ludo-game.html`,
`content/games/bio-ludo/`) is the first entry under `/games/`, and unlike
every other interactive feature on the site it has no Supabase table, no
login, and no `api/` endpoint at all. The entire game, board state, dice,
combat, the pre-game safe-team quiz, is one closure inside an IIFE, held in
memory for the length of the page visit. This was a deliberate scope cut for
a first version, not an oversight, a party game with no persisted state
doesn't need an account system to be playable.

The board itself is generated, not hand-placed per cell. A single 52-cell
`RING` array (one team's 13-cell approach lane) plus a `teamOffset =
teamIndex * 13` formula derives every other team's path, home column, and
yard by rotation, so `globalRingIndex(team, localStep)` is one line instead
of four near-duplicate per-team tables. That rotation guarantees the board
is 4-fold rotationally symmetric, but it does not guarantee reflective
symmetry from an arbitrary point, and this matters concretely for the
Unsafe Zone: its two flagbearers move an identical number of ring-index
steps in opposite directions from the same starting square
(`unsafeZoneFlagbearerGlobals()`), but because a team's start square is not
generally equidistant from the two different-shaped stretches of track on
either side of it, equal step counts don't always land at visually
equidistant pixels. The underlying game state (dead-zone size, which round
a lateral corner is reached) stays exactly symmetric regardless; only the
raw on-screen distance from the start point can differ turn to turn. The
flagbearers' whole schedule is computed fresh from `game.turnCounter` each
round via `computeUnsafeZoneProgress()` rather than incrementally mutated,
specifically to avoid drift across the roughly 30+ rounds a full sweep
takes.

The more structurally interesting decision is that BiOLudo draws its quiz
questions from two different banks under two different trust models, and
picks between them per duel rather than per match. `data/challenges/*.yaml`
(the existing Notes@BiOGuide Practice Challenge bank, freeform
question/solution markdown with no stored correct answer) is used whenever
every side of a duel is human-controlled; the result is self-reported,
the same honor-system trust already accepted for BiOClash Season 1. The
moment either side of a duel is a bot, though, self-report is meaningless,
there is no human on the other end to catch a dishonest click, so those
duels switch to `data/bio-ludo/*.yaml` instead: real multiple-choice
questions with a stored `answer` key, checked client-side the moment an
option is clicked, the same `given === answer` comparison
`layouts/shortcodes/papers-quiz.html` already uses for BiOrchive's
attempt-and-mark quizzes. A bot's own side of any duel, or its own
revival attempts, is never shown a question at all; it's resolved
instantly by a per-question accuracy roll from `BOT_ACCURACY` (easy 0.35,
medium 0.6, hard 0.85), and a defender's cross-class kill odds scale with
the attacker's correct count out of three via `CROSS_CLASS_KILL_CHANCE`
(0.25 / 0.5 / 0.75 / 0.95).

Bot automation is not a separate simulation, it drives the same functions
a human's click handlers call. `botPlayToken()` and `botAttemptRevive()`
call `selectCharacter()`, `moveCharacterTo()`, and `startCombatCheck()`
directly, the same functions wired to the board's click listeners, just
invoked from a `setTimeout`-paced loop (`botTakeAction()` /
`maybeContinueBot()`) instead of a DOM event. This was a deliberate choice
to avoid maintaining two parallel implementations of movement and combat
that could drift apart; a bot's "click" is functionally identical to a
human's, it just originates from a timer instead of a pointer.

## Analytics: three tools, three different jobs

The site runs three separate analytics tools, deliberately not
overlapping in what they're for:

- **Umami** (self-hosted) handles page views, Core Web Vitals, and feeds
  the country-stats pipeline: `api/daily-cron.js` syncs Umami's own data
  into `country_stats_cache` once a day, which `static/js/country-counter.js`
  reads to render the homepage hero counter and the About page's
  "Community Reach" section. Community Reach in particular is entirely
  live-rendered from this pipeline, there's no static country list or
  visitor count anywhere in `content/about/_index.md` to hand-edit; the
  numbers and the "sourced live... from Umami Analytics" attribution line
  both come from `country-counter.js` itself.
- **PostHog** (EU-hosted) is product-analytics only: a small, explicit set
  of named funnel events (`static/js/posthog-events.js`), autocapture,
  session recording, and default pageview capture all explicitly disabled
  in `layouts/partials/scripts/posthog.html`. It identifies a user only
  after a real login (`posthog.identify()` on sign-in via
  `PapersAuth.onChange()`), never for anonymous visitors.
- **Google Analytics 4** (`layouts/partials/scripts/ga4.html`) is the
  standard gtag.js snippet, loaded directly from Google's CDN rather than
  through the fingerprinted-with-SRI pattern the other two third-party
  scripts use. This is deliberate, not an inconsistency: gtag.js is an
  unversioned, frequently-changing script Google doesn't support pinning
  or self-hosting for, unlike Mermaid's pinned npm version or PostHog's
  stable per-region asset, so Subresource Integrity doesn't apply here the
  way it does to those two.

All three are optional and read their configuration from `HUGO_*` env
vars at build time (`HUGO_POSTHOG_KEY`, `HUGO_GA4_MEASUREMENT_ID`); any of
them can be disabled entirely just by leaving the corresponding variable
unset, no code change needed.

## Error tracking on the API layer

The three analytics tools above cover the Hugo frontend. The Vercel
serverless functions in `api/` are separate: every handler's existing
catch block also reports through `api/_lib/sentry.js`, which lazily
initializes Sentry only if `SENTRY_DSN` is set and no-ops otherwise, so
error tracking is opt-in and never blocks a response if Sentry itself is
unreachable. It only captures failures that already result in a 5xx
response, not expected 4xx cases like an expired session or a bad
request, to keep signal-to-noise reasonable. This is scoped to the API
layer only; the Hugo site itself has no error tracking, since a static
site has nothing server-side to fail.
