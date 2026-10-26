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

## BiOClash: results pipeline and registration

Turning a submitted attempt into a leaderboard placement is one server-side
pipeline, not scattered logic. `api/bioclash-admin.js` consolidates
`export-grades`, `finalize-round`, and `cleanup` into a single file
dispatched by an `action` field, a direct consequence of the Vercel Hobby
plan's 12-function cap, three previously separate admin endpoints had to
become one. `runExportGrades()` walks every component in the paper and
classifies it as auto-graded or not via `componentIsCorrect()` (mcq,
true_false, and numeric return a boolean, everything else returns `null`);
the operator fills in `marksAwarded` for the manual ones and posts that
back as `manualGrades` to `runFinalizeRound()`, which recomputes
`autoMarks` and `manualMarks` from the same stored answers server-side
rather than trusting anything in the request beyond the manual grade
values themselves.

A component's mark ceiling is not always its literal `marks` field.
`componentMaxMarks()` (`api/_lib/bioclash.js`) exists because
`free_text_for_others` components, where a student explains why every
other option on a referenced question is wrong, are scored per option via
`marksEach` rather than a flat `marks` value, so the real ceiling is
`marksEach * (the referenced question's option count minus one)`. Both
`runExportGrades()` and `runFinalizeRound()` call this instead of the
older `comp.marks || 1` fallback, which used to treat any
`marksEach`-only component as worth exactly 1 mark: that undercounted the
ceiling shown to the grader, and worse, made `runFinalizeRound()`'s own
bound check (`awarded <= marks`) reject any manually-awarded grade above 1
as invalid, silently dropping legitimate high marks on exactly that
component type. `scripts/validate-bioclash-paper.js` already computed a
paper's total marks this same way at authoring time, so the fix brought
the runtime scoring logic in line with what the validator had been
checking all along.

Placement uses `penalizedScore = rawScore * (1 - extensionPenalty)`, where
`extensionPenalty()` sums the paper's `extensionCostSchedule` up to the
blocks an attempt actually used. mb-01's schedule, `[0.10, 0.20, 0.35]`
over a maximum of 3 blocks of `extensionBlockMinutes: 30` each, costs 10%
for one block used and a cumulative 65% for all three, not a flat
per-block rate. That penalized figure is z-scored across the round's
field before ranking. A season's row key is the composite string
`seasonYear + ':' + paperId` (for example `2026:mb-01`), stored in
`bioclash_results.season`; re-running finalize for the same season key
deletes and re-inserts rather than accumulating duplicates, which is what
makes correcting a grading mistake after the fact safe to just re-run.

That composite key format is also why the round-specific leaderboard page
silently showed no results for a while.
`layouts/shortcodes/bioclash-champions.html` sets `data-round` to the bare
paper id (`round="mb-01"`), and `static/js/bioclash-champions.js`
originally matched that against `bioclash_leaderboard.season` with strict
equality, which never matches a value like `"2026:mb-01"`. The cumulative
Season Champions page (`content/papers/leaderboard/`, no `round` param)
was unaffected, since with no filter it just takes the most recent row's
season directly, which is why the bug went unnoticed there first. The fix
widens the match to also accept a season ending in `":" + roundFilter`,
so a round-specific page keeps working across every season year without
its content file needing to hardcode one.

Registration for Season 1 is passwordless by design, not by omission.
A prospective competitor fills in only an email and display name on an
external Google Form; an Apps Script bound to that form's submission
event calls Supabase's public `/auth/v1/otp` endpoint directly with
`create_user: true`, using the same anon key already shipped in the
site's own client bundle, no new Vercel endpoint and no admin or
service-role key ever leaves Supabase. That call sends a magic link
rather than creating a password, since the alternative, collecting a
password on the form itself, would mean a real account credential sitting
in the form's response data at rest, a risk not worth taking for a
registration flow. The one code change this required was in
`static/js/papers-account.js`: the account page's "set your password"
screen used to appear only for `type=recovery` links, the forgot-password
flow; the check now also matches `magiclink` and `invite`, since a
brand-new magic-link arrival lands the user in an authenticated session
with no password set at all, and needs the same "choose a password now"
screen a password reset does, just without calling it a reset.

Grading itself does not have to mean hand-editing the export JSON.
`tools/bioclash-admin-grade.html` is a self-contained grading console
that never calls the admin API itself; it only builds the same
curl/PowerShell commands `bioclash-admin.js` expects, which the grader
copies and runs in their own terminal. It reads back whatever JSON that
command produced, from a file drop or a paste, renders a per-participant
grading UI with progress tracking, and autosaves marks to the browser's
own `localStorage` as the grader works. Nothing in this tool touches
`CRON_SECRET`, since a page reachable by URL should never be the thing
holding an admin credential; the actual privileged call always happens in
the grader's own terminal, never in the browser.

## BiOClash: keeping papers out of the public repository

A BiOClash paper file holds its answer keys, so it cannot sit in a public
repository as plaintext, and `.gitignore` alone is not a fix. `vercel.json`
ships `data/bioclash/**` into each BiOClash function from the Git checkout,
so a paper that leaves Git is a paper production cannot find. mb-01 learned
this the hard way: it was tracked from the first commit, which left its
keys readable through the raw GitHub URL until the repository was made
private for the round. The vault exists so a paper can stay in the
repository, publicly, without being readable there.

`api/_lib/paperVault.js` encrypts a paper into a small JSON envelope with
AES-256-GCM from Node's built-in `crypto` module, with no new dependency
and no home-made cipher. Each file gets its own key, derived with HKDF-SHA256
from a master key plus a random salt and the paper id, so a leaked
per-file key opens nothing else. The envelope's version, algorithm, key id,
and paper id are authenticated as associated data, so renaming a file, or
swapping one paper's ciphertext in for another, fails authentication
instead of silently serving the wrong exam. Keys come from
`BIOCLASH_PAPER_KEYS`, a comma separated list of `id:base64` entries: the
first entry encrypts, every entry can decrypt, and `rotate` re-encrypts a
file under the first key, which makes key rotation a two step change
rather than a flag day.

Loading is a fallback, not a replacement. `readPaperSource()` in
`api/_lib/bioclash.js` reads `<id>.yaml` if it exists, which covers local
authoring and the public sample paper, and otherwise opens
`<id>.yaml.enc`. A missing or wrong key logs a short error code, returns
`null`, and is not cached, so setting the variable and retrying recovers
without a redeploy. `scripts/bioclash-paper-vault.js` is the operator
interface (`keygen`, `encrypt`, `decrypt`, `rotate`, `verify`, `guard`), and
`scripts/validate-bioclash-paper.js` validates encrypted papers too when
the key is present.

Nothing here relies on remembering to run the right command. `.gitignore`
excludes every plaintext paper except the public sample, `.githooks/pre-commit`
runs `guard` (enabled once per clone with `git config core.hooksPath
.githooks`), and the same guard runs in CI. The two allowlists at the top of
the script name the papers that may stay plaintext; mb-01 is on the second
one because it is already in the history and is intended to be public once
its round closes.

The honest limits: the vault protects papers that were never committed in
plaintext, not ones that already were, and anyone with the Vercel
environment variables holds the key. The decrypted paper lives in function
memory, as it always has. Losing every copy of the key makes an encrypted
paper unrecoverable, so the key belongs in a password manager as well as in
Vercel. `tests/vault/test.mjs` covers round trips, tampering with every
envelope field, wrong keys, cross-paper swaps, rotation, and the loader's
fallback and recovery behavior.

### What went wrong with MB-01, and what we decided

This was a genuine mistake, and it is written down here so nobody has to
discover it. Two things were exposed before the MB-01 round opened on
2026-10-10:

- `data/bioclash/mb-01.yaml`, the full paper with its auto-graded answer
  keys, was tracked in plaintext from 2026-08-10 and readable on the public
  GitHub repository until the repository was made private around
  2026-10-09. It is still in the Git history.
- The paper's figures (`static/MB-01PICS/` and the `mb01-fig*` files in
  `static/BIOCLASHPICS/`) are ordinary static files. Anyone who knows or
  guesses a file name can fetch them from the live site without being on
  the allowlist and without starting an attempt.

We found this shortly before the round and chose to run MB-01 unchanged.
The reasoning, which is the founder's decision and is recorded as such:
the repository had 3 stars and 1 watcher, so the number of people who could
plausibly have taken a copy is very small, and most of the paper's marks
come from free-text answers that are graded by hand against no pre-filled
key, so a copied auto-graded answer does not carry a participant far and an
answer set that does not fit the written reasoning stands out to a grader.
That is a judgement about likelihood, not a guarantee. Copies made while the
repository was public cannot be recalled, and MB-01's results should be read
with that in mind.
Since 2026-10-11 the tree holds only the encrypted `mb-01.yaml.enc`, and
the commit guard no longer exempts this paper.
What changes from the next round onward:

- No paper is committed in plaintext. Only the `.enc` envelope is tracked,
  and the guard in the pre-commit hook and in CI refuses anything else.
- A paper goes on the "public after close" allowlist only after its round
  has closed, never before.
- Figures do not go under `static/`. They are to be served only to a
  participant who has started an attempt and reached the block that uses
  them. This is not built yet; it has to be in place before the next paper
  is authored.
- Each paper sets `closesAt`, so the server enforces the end of the window
  instead of someone editing the allowlist by hand.

The figures for MB-01 stay where they are for the rest of this round,
because moving them mid-round would break attempts in progress.

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
fail to apply against the live aspirin row. `test.mjs` itself only
carries the schema through 017; the moderation work in 020, the
multi-image and attachment work in 021, and the feedback-reporting and
removal work in 040 each have their own dedicated file
(`test-moderation.mjs`, `test-multi-image-and-attachments.mjs`,
`test-feedback-moderation.mjs`), all run in the same `npm test` pass.
Between them, every biolab-specific migration is now exercised as a
standing regression check, not just verified once at ship time.

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


## BiOLive: a public schedule, private registrations and a two-factor staff gate

BiOLive (`/live/`) is the weekend programme of live paper solving on Zoom.
Staff create sessions, account holders register for the weekends that suit
them, and the host emails the Zoom link by hand. The link is never stored
on the site, so there is nothing to leak from page source or from the
database. Everything is in `supabase/migrations/043_biolive.sql`.

The three tables have three different postures. `live_sessions` is
readable by anyone, signed in or not, and writable by no client role: the
schedule is public on purpose, because it is a reason to create an
account. `live_registrations` is the opposite: a student can read, insert
and delete only their own rows, and has no update grant at all, so the
`attended` column can only be set by staff. The 24 hour registration
cutoff lives in the insert policy, not in the page script, so a student
who calls the API directly is refused as well. Pulling out stays allowed
until the session starts, which is why the delete policy checks a
different time from the insert policy. `live_staff_keys` has row level
security enabled, no policies and no grants; it holds only SHA-256 hashes.

The staff page (`/live/staff/`) needs two things at once: an account with
`profiles.is_staff` and a 32 character key the owner hands out. Neither
is enough alone. A leaked key shows nothing to a non-staff account, and a
staff account without the key cannot read a single email address. The
check is `live_staff_gate()`, a `security definer` function no client
role may call directly; the four staff functions (`live_staff_overview`,
`live_staff_save_session`, `live_staff_set_status`,
`live_staff_set_attendance`) call it first. They return
`{ok: false, error: ...}` and do not raise, for a specific reason: a
raised exception would roll back the failed-attempt counter written
through `rate_limit_hit()` in the same call. Ten wrong keys inside
fifteen minutes lock that account out of the staff functions.

These are database functions and not a file under `api/` because the
project is at the Vercel Hobby limit of twelve functions. Registrant
emails exist only in `auth.users`, which no client can read, so the
roster has to come from a definer function either way.

`scripts/biolive-staff-key.js` generates a key, prints it once and prints
the `insert` statement for its hash. The key itself is never written to
the repository or the database. Running the script again and revoking the
old row rotates it. In the browser the key is kept in `sessionStorage`
and is cleared when the tab closes or the host presses "Lock this page".

The pages follow the v2.1.0 tier system: `/live/` and `/live/staff/` are
tier 3, styled by `assets/css/live-fx.css`, which reads only the shared
`--fx-*` values. `static/js/live.js` draws the month grid and the session
panel (an agenda list replaces the grid below 640px),
`static/js/live-staff.js` is the staff console, and
`static/js/live-mine.js` fills the small "your next live sessions" block
on the dashboard and the account page, styled by
`assets/css/live-mine.css`. The staff page's HTML shell is public and
contains no data; every name and email arrives from the functions above.
`tests/rls/biolive.test.mjs` runs the real migration against pglite and
covers the cutoff, cross-user access, the `attended` lockout, both halves
of the staff gate, key revocation, the lockout and account deletion.

## BiOBytes: three content types under one section, one of them gated

`content/biobytes/` holds three different kinds of content behind one set
of tabs (`{{< tabs >}}` in `content/biobytes/_index.md`, in this order:
BiOHorizon, Testimonials, From Social, Articles), and only one of the
three is access-gated. The first tab in the file is the one visitors land
on (the theme selects the first tab when none is marked selected), which
is why BiOHorizon leads and Articles sits last. The `/articles/` and
`/bioinsights/` aliases in the same frontmatter redirect to `/biobytes/`,
so they now open on the BiOHorizon tab, because tabs have no deep-link
hash. The
cascade at the top of that file targets `path: "/biobytes/articles/**"`
specifically, so long-form Articles pieces get `layout: "gated-article"`
while everything under `/biobytes/testimonials/` stays fully public. This
is deliberate: testimonials are real students' own accounts, gating them
behind a login wall would undercut the point of publishing them for
other students to find.

`layouts/gated-article.html` is a presentation-layer gate, not a real
access-control boundary, and says so in its own header comment: the full
article HTML still ships in the page source,
`static/js/papers-article-gate.js` only toggles an
`article-gate-unlocked` class once it confirms a session exists. The frontmatter `description` renders as an
always-visible teaser above the gate (`.article-gate-teaser`), while the
body (`.article-gate-body`) gets `filter: blur(6px)`, a `max-height` of
`14rem`, and `pointer-events: none` until unlocked, at which point the CTA
card (`#article-gate-cta`) hides and the blur lifts. If `PapersAuth` isn't
configured at all, `unlock()` runs unconditionally rather than defaulting
to locked, so a local dev environment without Supabase env vars simply
never shows a gate; this fails open by design, the same posture BiOClash
takes toward showing answers in devtools network responses versus this
page's visual gate.

Only one of the three Articles-tab entries has real content right now.
`content/biobytes/articles/gic-2026/_index.md` is a full conference diary
(three days of lecture notes from the Genomics India Conference 2026);
`neuroscience/` and `lab-recommendations/` are both two-line stub pages
(`title` plus a `description: "Coming Soon!"`) that exist so the tab's
card grid previews what BiOBytes will eventually cover rather than
showing only one card. Both stubs still inherit the gated layout the
moment real content lands in them, since the cascade matches on path, not
on whether a page currently has a body worth gating.

Direct-quote, where a subject's own
sentences go verbatim into `.testimonial-quote-block` elements and the
surrounding prose only bridges between them, or paraphrased narrative,
third-person storytelling built from source material with at most a
short pull-quote. Five of the six published testimonials
(`belgium-ibo-bronze`, `azerbaijan-huseyn`, `slovakia-daniel-bronze`,
`hungary-botond-silver`, `kyrgyzstan-ulukbek-bronze`) use direct-quote
style; `turkmenistan-ibo-team` is the narrative exception, since that
piece was built from a conversation rather than a subject's own written
words. Getting the style wrong in either direction has a real cost, not
just a stylistic one: direct-quote style edited too freely risks putting
words in someone's mouth they did not say, narrative style written too
stiffly loses the personal account it exists to tell.

Each testimonial's account of its country's national olympiad is
deliberately cross-checked against an independent source (the IBO country
profile pages at `ibo-info.org`, or the relevant ministry or olympiad
body's own site) rather than simply repeating what the subject said, and
closes with a `*Sources:*` citation line naming exactly what was checked.
This matters because a testimonial is not just a personal story here, it
is also the entry that feeds a country's card on the preparation hub's
directory below, so a factual claim about how a selection process works
is doing double duty as both narrative color and reference material.

## BiOHorizon Reports: a layout, a sidebar and one page per field

BiOHorizon Reports are the third BiOBytes content type: long, sourced
briefings on recent research in one field, written for a student who is
preparing for an Olympiad. They live under `content/biobytes/horizon/`,
outside the `/biobytes/articles/**` cascade, so they are fully public. A
report is a single `_index.md` with `layout: "horizon"`, which resolves to
`layouts/horizon.html`, a copy of the theme's `wide` layout with one
addition: an "On this page" column. That column is
`layouts/partials/custom/horizon-toc.html`, which prints Hugo's own
`.TableOfContents` (so it always matches the page's `##` headings) inside
a `<details>` element. On screens at least 1180px wide it is a sticky
right-hand sidebar; below that it becomes a collapsible bar above the
article. `static/js/horizon-toc.js` adds the behaviour: it highlights the
section being read, draws a reading-progress bar, numbers the story
entries, and nests a link to any `.fr-lab[id]` widget under its story. It
updates on scroll through `requestAnimationFrame`, so it does nothing
while a tab is hidden.

The report's styling is `assets/css/horizon.css`, loaded by
`layouts/partials/custom/head-end.html` only when the page path starts
with `/biobytes/horizon/`, the same per-section pattern the BiOClash and
BiOLab stylesheets use. Interactive widgets are separate scripts in
`static/js/` that return immediately when their container element is
missing, and are loaded from the same `hasPrefix` block, so one report's
simulator costs other reports nothing. A page of equations needs the
`{{< mathjax >}}` shortcode, the same one the notes pages use, and
Goldmark treats some backslash sequences in math as escapes, so
equations avoid `\,` and `\;`.

Motion and interactive figures are layered on top of that, all as
progressive enhancement. `assets/css/horizon-motion.css` is loaded next
to `horizon.css` and uses CSS scroll-driven animations (`animation-timeline`
with `view()` and `scroll()`), all inside an `@supports` block, so browsers
without them (stable Firefox, at the time of writing) simply show the static
page: blocks fade in as they enter the viewport, rating bars fill in
sequence, and the hero drifts away. The owner asked for these effects to play
regardless of the reduced-motion preference, so there is no
`prefers-reduced-motion` guard. Two
interactive figures use vendored libraries rather than CDN links: D3 7.9.0
(ISC licence) in `static/vendor/d3/` drives the animated transit light curve
in `static/js/horizon-transit.js`, and 3Dmol.js 2.5.5 (BSD-3-Clause) in
`static/vendor/3dmol/` drives the protein viewer in
`static/js/horizon-mol.js`, which reads a trimmed PDB file stored beside
the report's images. Each script looks for its own container element, does
nothing if it is absent, and injects its library only when the figure is
within a screenful of the viewport, so a visitor who never scrolls to a
figure never downloads the library. BiOHorizon report images are WebP files
with the same base name as the original, matching the rest of the site.

Two reading aids are shortcodes rather than hand-written HTML. `term`
(`layouts/shortcodes/term.html`) wraps a specialist word and looks its
definition up by key in `data/horizon_terms.yaml`, one hand-written entry
per term with an optional Wikipedia article title and an optional Notes page.
The shortcode renders only a focusable `<span>` carrying the card's text in
`data-*` attributes (with the definition as a `title` fallback), and fails the
build if the key or the Notes page does not exist. `static/js/horizon-terms.js`
builds a single floating card in `<body>` on demand and positions it from the
word's bounding box, rather than nesting a card inside the paragraph, because a
card inside a wrapped inline element has no stable containing block and would
be clipped by the scrolling table and maths wrappers. Hover opens it on a
mouse, a tap or Enter opens it on touch and keyboard, and Escape or a click
elsewhere closes it. `notebtn` (`layouts/shortcodes/notebtn.html`) renders the
pill-shaped "Connect to your notes" buttons and also fails the build on a
missing page; it replaces the plain hyperlinks the first reports used. Both are
styled in `assets/css/horizon-terms.css`. The data file is shared by every
report, so entries are only ever appended.

The BiOHorizon tab on the landing page is a separate piece of design. Its
markup is one block of raw HTML with no blank lines, because the theme
passes each tab's content through `markdownify`; a blank line would let
Markdown wrap the cards in paragraphs and break the grid. Its classes
(`fp-*`) live in their own file, `assets/css/biobytes-horizon.css`, which
`head-end.html` loads only for the exact path `/biobytes/`, so the landing
page does not pay for the report stylesheet and the report stylesheet is
not edited when the landing tab changes. The report cards in that tab are
hand-written, like the Testimonials cards, so a newly published report
needs a card added in `content/biobytes/_index.md` and one in the hub page
`content/biobytes/horizon/_index.md`.

Reports are produced with the `frontier-report` skill (kept in the shared
skills folder outside the repository). Its `scripts/check_frontier.py`
enforces the structural rules mechanically: layout and date (a date later
than today in UTC makes Hugo silently skip the page), no em or en dashes,
balanced tags, every citation matched to a numbered source, sequential
figure numbers, alt text and credit links on every figure, at least one
maths or computation story, and the AI-assistance disclosure in the footer.
It also enforces the readability conventions: term keys that exist and are
marked only once per section, no term cards in headings or captions, notes
pages that exist, no plain `/resources/` hyperlinks, and no inline (1)(2)
enumerations. With `--wiki` it checks every Wikipedia title against the live
API.

## The preparation hub: one country dataset feeding three surfaces

(The home page globe is a fourth reader of the same dataset; see "Home
page and site motion" below.)

`content/biology-olympiad-preparation/_index.md`
(`/biology-olympiad-preparation/`) is a single overview page, not one of
the three olympiad-specific deep guides it routes into (`/ibo-preparation/`,
`/usabo-preparation/`, `/inbo-preparation/`, each its own 180 to 265 line
page). Its own job is the syllabus learning order (a four-tier accordion
built from `faq-item` shortcodes), the textbook progression, study
technique advice, a depth-comparison table across School, USABO Open,
USABO Semifinal, INBO, and IBO, study-plan routing by timeline, and a
"Find your path" two-question picker. That picker (`#prep-picker`, an
inline `<script>` in the content file itself rather than a separate
static asset) is a pure lookup table: two button groups write into a
`state` object, and `render()` just concatenates static link lists from
two hardcoded objects (`OLYMPIAD_LINKS`, `START_LINKS`) keyed by the two
answers. Nothing about it is personalized from a user's actual attempt
history the way the real Dashboard is; it is a decision tree, not a
recommendation engine.

The page's country-guide UI has been through more than one shape, and the
current one exists specifically to fix a scaling problem the earlier
shape had. It used to be two separate hand-authored
`.olympiad-compact-cards` rows sitting below the interactive world map,
one for the dedicated INBO/USABO guides and one for testimonial
countries, and every new testimonial country meant hand-editing three
separate places: the map's own data, that compact-card row, and the
BiOBytes Testimonials tab card. `{{< olympiad-directory >}}`
(`layouts/shortcodes/olympiad-directory.html`,
`static/js/olympiad-directory.js`) replaced both rows with one
searchable, filterable grid (a text search plus All / Guide available /
Coming soon chips) that
fetches the same `/data/olympiad-programmes.json` the map already reads,
so a country now only has to be added in one place to show up correctly
in both surfaces.

`static/data/olympiad-programmes.json` is that single source of truth:
48 country entries as of this writing, 8 with `status: "published"` (a
real `guideUrl`, highlighted purple and clickable on the map, rendered as
an active card in the directory) and 40 `"coming-soon"` (`guideUrl:
null`, shown muted with a "Soon" badge, not clickable). The 40 unpublished
entries each still name a real national olympiad body rather than sitting
in as a placeholder, so the roadmap communicates actual scope rather than
a vague "more countries later." Two of the eight published entries (`IN`,
`US`) point at the site's own dedicated preparation guides rather than a
BiOBytes testimonial; the schema has no field distinguishing "official
guide" from "community testimonial," `guideUrl` is just a URL and both
surfaces render either kind identically.

The schema now does distinguish two kinds of guide. `status` has three
values: `published` (a firsthand guide written by someone from that
country, purple), `outline` (an Official Outline written by BiOGuide from
official and trusted sources, with an "author wanted" banner, green) and
`coming-soon` (yellow on both maps). The file also carries a top-level
`labels` object (`firsthand`, `outline`, `soon`) so the display names live
in one place; the home shortcode, the 2D map tooltip and the directory
count read it, while the two legend and filter strings in
`layouts/shortcodes/olympiad-map.html` and
`layouts/shortcodes/olympiad-directory.html` are still literal text.
Every reader treats an unknown status as "no guide", so a new status
degrades to a muted country instead of a broken link. Outlines live at
`/olympiad-programmes/<country>/`, open with `{{< outline-banner >}}`
(`layouts/shortcodes/outline-banner.html`, the only place the wording and
the contribute email are written), are styled by
`assets/css/outline-guide.css` loaded only under that path, and are
checked by `scripts/check_outline_guide.py`. Every outline collects what
is uncertain in one "Points for an Author" box (the `outline-unknown`
div), split into "Where the sources disagree" and "Gaps a firsthand
author could fill", so disagreements are stated once instead of being
scattered through the stage sections. The checker rejects a guide without
that box, fails on any internal link or dataset `guideUrl` that has no
page in `content/`, and with `--links` requests every external address: a
404 or 410 is an error, while a link it cannot confirm (blocked, timed
out, certificate problem) is only a warning to follow up by hand. The
section landing page `/olympiad-programmes/` lists the guides through
`layouts/shortcodes/programme-guide-list.html`, which reads the dataset at
build time and prints plain links for one `status` (`published` or
`outline`), reusing the directory card classes. It exists so that page
links to every guide with no script at all. The globe file
`static/data/globe-110m.json` tags only programme countries with an ISO
code, so a country that is not yet in the dataset must be tagged with
`scripts/tag_globe_country.py` before it can appear on the globe. The
rollout plan, the rules for writing an outline and the per-session prompts
are in `plans/official-outline-guides-plan.md` and
`plans/outline-session-prompts/`.

`static/images/world-map.svg` already ships a `<path id="country-XX">`
for essentially every country, so `static/js/olympiad-map.js`'s job is
coloring existing paths from the JSON's `status` field, not drawing new
geography; adding a country almost never touches the SVG. The one
per-country override that does exist is `FORCE_MARKER_CODES` (currently
`{ HU: true }`): a country's path normally only gets an auto-added
centroid dot, which is what actually makes a tiny country reliably
clickable, when its bounding box falls under `SMALL_COUNTRY_MAX_DIMENSION`
(20 map units). Hungary's shape is not small by that measure but is thin
and squeezed between neighbors on this particular projection, so it
needed the marker forced on regardless of bbox size.

The map and the directory each fetch `/data/olympiad-programmes.json`
independently rather than sharing one cached load, since each shortcode
is meant to be self-contained and droppable onto a page on its own. The
one page that currently uses both pays for that with a duplicate network
request, accepted deliberately given the file is a few kilobytes.

Staleness is handled on purpose, because a stale reader shows up as a
country that looks right but does not link. `olympiad-map.js`,
`olympiad-directory.js` and `contribute-guide.js` live in `static/` and
are not fingerprinted by Hugo Pipes, so `head-end.html` appends
`?v=` plus the first ten characters of the file's MD5 to each script
address; a browser can no longer keep a copy that predates a new
`status` value. All four readers (those three and the globe) fetch the
dataset with `cache: "no-cache"`, which makes the browser revalidate it on
every load, so a status change in the JSON is visible after a normal
reload.

This page's CSS and JS are also where the site's per-section loading
pattern applies: `layouts/partials/custom/head-end.html` includes
`css/prep-guide.css`, `js/prep-guide-tour.js`, and
`js/olympiad-directory.js` only when the request path starts with
`/biology-olympiad-preparation/`, the same pattern already used to scope
BiOClash, BiOLab, the Dashboard, and the account pages' CSS out of the
global bundle. That split is not fully clean here yet though: the
`.olympiad-*` classes for the map, hero card, and directory grid still
live in the global `assets/css/custom.css` rather than `prep-guide.css`,
since they predate that split and were never migrated over, worth
knowing before assuming every olympiad-related rule lives in the
page-scoped file.

The page also runs its own scoped five-step walkthrough
(`static/js/prep-guide-tour.js`, triggered by the "Take a 10-second tour"
button), reusing the same `.site-tutorial-*` spotlight and tooltip CSS
classes as the sitewide onboarding tour rather than inventing new ones.
It explicitly checks the sitewide tour's own `bioguide_tutorial_active`
sessionStorage flag before showing its trigger button, so a visitor
already mid-way through the global tour never sees two competing overlays
offering to walk them through the page at once.

The way a new country gets onto this dataset is documented publicly on
`content/contribute-a-guide/_index.md` (`/contribute-a-guide/`), so
prospective authors can self-serve rather than being messaged one by one.
It is a static content page with its own scoped stylesheet
(`assets/css/contribute.css`) and script (`static/js/contribute-guide.js`),
both loaded only for that path by the same `hasPrefix` checks in
`layouts/partials/custom/head-end.html` that scope the other section
files. Its "Is your country covered?" finder and its two counters fetch
`/data/olympiad-programmes.json`, the same file the map and directory
read, so a country flipped to `published` there moves from the "open for an
author" group to the "guide available" group with no edit to the page.
Open countries link to a `mailto:` with the country name prefilled in the
subject. If the fetch fails the counters stay hidden and the finder shows a
fallback line pointing at the contact email.

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

## Home page and site motion: five tiers decided by URL

The visual layer added in v2.1.0 (pointer-following fluid, smooth
scrolling, scroll reveals, buttons that fill from the point the cursor
enters) is not applied evenly. One partial,
`layouts/partials/custom/fx-tier.html`, takes the page's `.RelPermalink`
and returns a number, and everything else keys off that number:

| Tier | Pages | Body class | What loads |
|------|-------|------------|------------|
| 0 | anything under `/bioclash/` | none | nothing new |
| 1 | anything under `/papers/` | `fx-t fx-s` | `fx-core.css` and `fx-static.css`, inlined in a `<style>` tag |
| 2 | every other page | `fx-t fx` | `fx-core.css` + `fx.css` as one file, and an inlined `assets/home/fx.js` |
| 3 | exactly `/resources/`, `/biobytes/`, `/biolab/`, `/about/`, `/biology-olympiad-preparation/`, `/games/`, `/games/bio-ludo/`, `/doubts/`, `/dashboard/`, `/account/`, `/live/`, `/live/staff/` | `fx-t fx fx-2` | tier 2 plus `fx2.css` in the same file, and `/bundles/fx2.<hash>.js` |
| 4 | `/` | `fx-t home-v2` | `fx-core.css` + `home.css` as one file, and `/bundles/home.<hash>.js` |

Tier 0 is BiOClash, left untouched as a matter of policy (see
`AGENTS.md`). Tier 1 is BiOrchive, where a timed attempt or a table of results must
not compete with decoration for frame time. It gets the shared look and
nothing that moves: no script, no transitions, no reveals. The dashboard
and the account page started in tier 1 and were later moved to tier 3 at
the owner's request. Tier 3 matches exact URLs, not prefixes, so a section's landing
page gets the heavier treatment and the hundreds of pages beneath it
stay on tier 2. To move a page between tiers, edit the lists in
`fx-tier.html`; nothing else needs to change.

`layouts/_default/baseof.html` calls the partial once and sets the body
classes from it. `layouts/partials/custom/head-end.html` calls it again
to choose the stylesheets and scripts. Every rule is scoped under those
body classes, so a tier 0 page cannot pick one up by accident.

**One set of design values.** `assets/css/fx-core.css` defines the
`--fx-*` custom properties (ink, muted text, lines, surfaces, the two
accents, shadow, radii, easing, the mono and serif stacks, and the
ambient layer strengths) on `body.fx-t`, with overrides for `html.dark`
and `html.favourite`. Every tier reads from it. The only page-specific
values in that file are a short block that turns the ambient layers up
slightly on the home page. Component values that belong to one page,
such as the globe's colours, stay next to that component but use the
same `--fx-` prefix. Change a colour, radius or timing here and it
changes everywhere; do not redefine one of these in a tier stylesheet.

Each tier's stylesheets are joined with `resources.Concat` into a single
file (`css/fx-tier-N.css`), placed after the per-section stylesheets so
it wins ties in the cascade. Tier 1 is small enough to inline, which
matters on question pages: they already inline critical CSS and load the
main stylesheet without blocking, and a separate blocking request would
have undone part of that.

**Tier 1 is values, not rules.** BiOrchive already draws its cards, rows
and buttons from its own `--papers-*` properties, so most of
`fx-static.css` is a remapping of those onto the shared set
(`--papers-card` to the shared surface, `--papers-radius` to the shared
small radius, and so on) under `body.fx-s`. A handful of explicit rules
give the main buttons the pill shape and replace the coloured left edge
on attempt recommendation cards with a tinted border. Controls inside a
quiz or an attempt (answer toggles, the question palette, the timer) are
left as they were.

**Tier 2 is CSS first.** `fx.css` restyles the shared components (cards,
buttons, callouts, quote blocks, the BiOLab and BiOHorizon panels) by
overriding the older rules in `assets/css/custom.css`.
Section-specific buttons are sorted into three groups (solid, outline,
chip) so about twenty-five class names share three sets of rules. The
fill-from-pointer effect is a radial gradient whose radius is a
registered custom property (`@property --fx-r`), which is what lets a
plain CSS transition animate it. The only script is `fx.js`, about 3 KB
before minification and inlined into the page: it writes the pointer
position into `--fx-x` and `--fx-y` on the hovered element and reveals
below-the-fold cards through one `IntersectionObserver`. It has no
dependencies, so tier 2 pages download no animation library.

**Tier 3 adds the ambient layers.** `assets/home/fx2-motion.js` injects
the gradient blobs, the fluid canvas and the grain overlay into `<body>`
at run time, so the landing pages needed no template changes. It
also starts smooth scrolling, splits `h2` headings into characters for a
reveal, and makes the main buttons magnetic. `fx2.css` gives the page
title on these pages the home hero's type treatment (large serif,
tight tracking, a short two-colour rule beneath), so they read as
siblings of the home page.

Two tier 3 pages carry an extra stylesheet joined into the same file.
`/biology-olympiad-preparation/` adds `prep-fx.css`, which restyles that
page's own components (the path picker, the jump links, the country
directory cards, the accordions and the tables) and numbers its section
headings with a CSS counter. Those headings are children of
`.prep-guide-wrapper`, not of `.content`, which is why the rules target
the wrapper. `/games/` adds `games-landing.css` for the BiOLudo feature
card, whose board graphic is built from nine empty spans and CSS alone.
Four more tier 3 pages do the same: `/games/bio-ludo/` adds
`bio-ludo-fx.css`, `/doubts/` adds `doubts-fx.css`, `/dashboard/` adds
`dashboard-fx.css` and `/account/` adds `account-fx.css`. The last two
also carry the `--papers-*` remapping themselves, because leaving tier 1
means `fx-static.css` no longer supplies it; the dashboard and account
rules that remain in `fx-static.css` are now unused. The BiOLudo sheet restyles the
frame around the game (title, setup panels, legend, HUD, the board's
surround, the duel dialog, the rulebook headings) and remaps the
`--papers-*` values the game's own stylesheet reads; it does not touch
board squares, pieces or team colours, which carry game state. The
Doubts sheet restyles the `discussions-*` classes that
`static/js/doubts.js` renders into the page.
Because the joined file's contents now vary by page, its name includes a
short hash of the list of parts, so two pages in the same tier never
share a file name with different contents.

**Tier 4 is the home page.** `content/_index.md` is front matter plus one
shortcode call. All of the markup is in
`layouts/shortcodes/home-v2.html`, styled by `home.css`. The earlier
home shortcodes (`hero`, `interactive-showcase`, `recent-updates`) and
the `.homepage-bg` rules have been removed.

**The BiOClash landing page is the one exception inside tier 0.** The
exact path `/bioclash/` (no other BiOClash page) loads
`assets/css/bioclash-landing.css` after `bioclash.css`, and
`/bundles/bioclash-landing.<hash>.js`, which is `home-fluid.js` joined
with `assets/home/bioclash-landing.js`. Neither reads `fx-core.css`: the
page keeps BiOClash's own palette (`--bc-*`), its forced dark theme and
its green timeline background, and adds a small `--bcl-*` set for the
ember glow. The script draws two feathered wings as SVG, computed from a
leading-edge curve in five rows of feathers, so there is no image file,
and places them in a fixed layer behind the content where the swaying
DNA strands used to be. Each wing is drawn twice: a sharp copy and a
blurred copy behind it. One shared duration (`--beat`) drives three
animations: the wrapper's flap, the blurred copy's opacity and the sharp
copy's opacity, which is why the glow peaks exactly at the top of each
beat. All three animate only transform or opacity on elements whose
filters do not change, so the browser moves cached layers and does not
redraw the feathers each frame. The same fluid simulation the home page
uses runs here in ember and gold over the background with a `screen`
blend, under the same conditions (fine pointer, not on data saver, not
under reduced motion). The script also reveals panels on scroll and
tracks the pointer for the panel spotlight.
`content/bioclash/_index.md` was not edited: every change is an override
scoped to `#bioclash-root`, so removing the `/bioclash/` lines in
`head-end.html` restores the previous page exactly.

**The leaderboards follow the same pattern.** Two kinds of page share
`assets/css/hall-of-fame.css` and `/bundles/hall-of-fame.<hash>.js`
(`home-fluid.js` joined with `assets/home/hall-of-fame.js`): the Hall of
Fame at the exact path `/papers/leaderboard/`, and each BiOClash round
leaderboard, matched in `head-end.html` by the pattern
`/bioclash/<round>/leaderboard/`. Every rule is scoped to
`#bioclash-leaderboard-root` or `#bioclash-round-leaderboard-root`,
which matters because the classes being restyled
(`.bioclash-case-header`, `.bioclash-champions-frame`,
`.bioclash-panel`) are used across BiOClash, and no other page may
change. Each page keeps its own background image and the
gold-and-crimson palette; the Hall of Fame adds a violet accent and
runs the fluid in violet and gold, the round leaderboards use ember and
gold to match the BiOClash landing page. The Season Champions frame
keeps its existing pulsing ring and chasing light. A new round's
leaderboard picks this up automatically from its URL.

The per-test leaderboards under `/papers/` (any path that ends in
`/leaderboard/`, except the Hall of Fame) are ordinary tier 1 pages and
load one extra stylesheet, `assets/css/papers-leaderboard.css`, with no
script. It reads the shared `--fx-*` values, so these pages follow the
visitor's theme. Rows are drawn as separate bands, the first three carry
gold, silver and bronze tones by position, and the signed-in visitor's
own row (`.papers-leaderboard-self`) is outlined in the accent colour.

**A loader for switches to the home page.** `assets/home/fx-nav.js`
and `assets/css/fx-nav.css` are inlined on tiers 2, 3 and 4. A click on
a same-site link to `/` from any other page shows a loading card at once
and records the time of the click in `sessionStorage`. The old page
keeps the card up until it is replaced. The home page reads the time of
the click, shows the card again before its first paint and removes it
once one second has passed since the click, so the card lasts at least a
second and always clears over the home page, never over the old one. A
switch slower than a second keeps the card until the home page arrives,
then fades it after a quarter of a second. The home page also skips the
site's cross-document view transition for that navigation
(`pagereveal`), so the slide does not play underneath the card. If a
navigation is cancelled the old page drops the card after twenty
seconds. The card is appended to `<html>`, not `<body>`, because the
home page runs the script in the head before the body exists; for the
same reason the stylesheet carries its own small `--n-*` palette and
cannot read `fx-core.css`. No other destination shows the card, and
BiOClash and BiOrchive pages do not carry the script, so a link to the
home page clicked there shows no card.

**Outside the tiers.** `layouts/404.html` is a standalone document that
does not pass through `baseof.html`. It carries its own copy of the
palette, loads the two self-hosted fonts directly, and follows the
operating system's light or dark preference because the site's theme
class is not available to it. Page-to-page transitions are also not part
of the tier system: they are cross-document view transitions defined in
`custom.css` and apply site-wide.

### Scripts are bundled at build time

The home page would otherwise request eight script files. `head-end.html`
runs them through Hugo Pipes instead: the vendored libraries in
`assets/home/vendor/` and the site's own minified scripts are joined with
`resources.Concat` into `bundles/home.js` and fingerprinted, so the page
makes one request and the file name changes whenever any part changes.
`bundles/fx2.js` is built the same way from a smaller set. Because the
names are content-hashed, `vercel.json` serves `/bundles/` with a one
year immutable cache; `/vendor/` and `/data/globe-110m.json` are not
hashed and get thirty days with `stale-while-revalidate`.

The libraries are vendored, not loaded from a CDN, matching the rest of
the site: GSAP 3.15 with ScrollTrigger, SplitText and ScrambleTextPlugin
(GSAP's standard no-charge licence), Lenis 1.3 (MIT), and d3-geo with
d3-array (ISC). The fluid simulation in `assets/home/home-fluid.js`
follows the approach of Pavel Dobryakov's WebGL-Fluid-Simulation (MIT).
Licence texts and notices are kept under `static/vendor/`.

### Loading order is built around first paint

The hero's entrance is CSS keyframes, not script, so the headline (the
largest paint on the page) does not wait for the bundle. An inline script
in the head adds `hv-js` to `<html>`, which is what hides
scroll-revealed elements until the bundle animates them in; if the bundle
has not run within four seconds the class is removed, so a failed script
can never leave content invisible.

Two things are deferred until they are needed. The fluid simulation
compiles its shaders at start-up but runs no frames until the pointer
first moves. The globe's libraries and its 110m country outlines are
fetched when the browser is idle, and the home bundle does not include
them.

The thin line at the top of tier 3 and tier 4 pages is a progress
indicator, not a gate. `baseof.html` advances it at fixed milestones
(parse, `DOMContentLoaded`, fonts ready, `load`) and removes it after
twelve seconds regardless. The page is readable and usable throughout;
nothing waits for the line to finish.

### Scroll work is kept off the scroll event

An early version created one ScrollTrigger per revealed element, about
seventy-five of them, and measurably slowed the page. Reveals now go
through a single `IntersectionObserver` helper. ScrollTrigger is kept
only for effects that are tied to scroll position: the hero and blob
drift, and the reel section, where a brush stroke is drawn by animating
`stroke-dashoffset` on an SVG path and the frame opens through an
animated `clip-path` circle. That path is built in script from the
section's measured geometry and rebuilt on resize, because its start and
end points depend on where the heading and the frame land at the current
width.

### The fluid canvas looks after itself

`home-fluid.js` exposes `window.HVFluid.create(canvas)` and is shared by
tiers 3 and 4. It stores dye as two channels and maps them to two theme
colours in the display shader, so a theme switch is a uniform change and
not a restart; the motion scripts watch the class on `<html>` and call
`setColors`. It refuses to start on a software renderer, lowers its
resolution when frames run slow, shuts itself down if they stay slow, and
stops drawing after seven seconds without input.

### The globe is a fourth reader of the country dataset

The globe in the hero is drawn by `assets/home/home-globe.js` on a 2D
canvas with an orthographic projection. It reads
`static/data/olympiad-programmes.json`, the same file behind the map,
directory and counters described under the preparation hub, so a newly
published country guide becomes clickable on the globe with no extra
step. Outlines come from `static/data/globe-110m.json` (Natural Earth
through world-atlas), with each programme country tagged by ISO code.
Singapore is too small to appear at that resolution and is drawn as a
marker.

The shortcode also prints the published guides as an ordinary list of
links inside the globe's container. That list is the accessible and
no-script route: focusing a link rotates the globe to that country, and
if the canvas cannot start, the container gets `is-fallback` and the
list is shown in its place.

Drawing cost is controlled in three ways. Each set of countries (land,
programme countries, hovered country) is collected into one `Path2D` and
filled in a single pass. Adaptive resampling is turned off
(`precision(0)`), which was the largest single cost. The frame interval
is derived from the measured cost of the previous frame, between 33 and
200 ms, so a slow device gets a slower globe and not a blocked main
thread.

### When motion is switched off or scaled back

- **Reduced motion.** Under `prefers-reduced-motion: reduce` the motion
  scripts return before doing anything and the pages render in their
  final state. The tier 2 hover styling still applies. Appending
  `?motion=on` to a URL overrides the preference for that page load;
  it exists for testing on machines whose operating system reports
  reduced motion, which Windows does when "Show animations" is off.
- **Data saver and slow connections.** When `navigator.connection`
  reports `saveData` or a 2g connection, the fluid, smooth scrolling and
  the globe are skipped.
- **Touch and coarse pointers.** The fluid, magnetic buttons and smooth
  scrolling require a fine pointer with hover. Phones get the layout,
  the reveals and native scrolling.

### Things to know before changing it

- `.content h1`, `h2` and `h3` in `custom.css` set font family, weight
  and (for `h1`) size with `!important`. Heading overrides in `home.css`
  need `!important` as well or they silently lose.
- After editing `layouts/_default/baseof.html`, a running `hugo server`
  can start serving the theme's own `baseof.html` instead; the sign is a
  home page whose body class is `homepage-bg`. Stop and restart the
  server. Production builds are not affected.
- The reading-progress line under the navbar is drawn by
  `body:not(.home-v2)::before` in `custom.css`; the home page opts out
  through its body class.
- The coloured left-edge rules for difficulty cards, quote blocks and
  callouts were removed from `custom.css`. None of them was in use on a
  tier 0 page.
- Headings in the stylesheets use Cormorant Garamond; small labels that
  used Fraunces now inherit the body font. The Fraunces `@font-face`
  stays in `fonts.css` because the IBO results analysis pages under
  `content/papers/ibo/results/` still name it in their own inline
  styles.
- The standalone simulator pages under `static/` do not pass through
  `baseof.html` and are outside the tier system. The 143 that share the
  common widget template link one stylesheet, `static/sim/sim-fx.css`,
  placed after their own inline styles so it overrides them: it sets
  the panel border and shadow, the serif title, a transparent page
  background so an embedded widget sits on the host page, and removes
  the left-edge rule on the subtitle. It has its own small `--sim-*`
  palette because these pages cannot read `fx-core.css` or the host
  page's theme class, and it has no dark variant: the widgets' internal
  colours are fixed and light. Button and slider colours inside each
  file read `var(--sim-accent, ...)`. Colours used inside diagrams were
  left alone because many carry meaning. A new widget should copy the
  `<link>` line from an existing one. `ibo2022-sim.html`,
  `rotating-grid-game.html` and `bioclash-admin-grade.html` do not use
  the template and were not changed.
- Measure with a production build, not the dev server. On a desktop
  Lighthouse preset, median of three runs, the previous home page scored
  79 with 315 ms of total blocking time; the first version of the new
  one scored 60 with over 18 s, almost all of it the globe; after the
  changes described above it scored 58 with 992 ms. Features added after
  that measurement (the progress line, the reel stroke) have not been
  re-measured, and phone figures should come from a deployed preview,
  not from local emulation.

## Analytics: three tools, three different jobs

The site runs three separate analytics tools, deliberately not
overlapping in what they're for:

- **Umami** (self-hosted) handles page views, Core Web Vitals, and feeds
  the country-stats pipeline: `api/daily-cron.js` syncs Umami's own data
  into `country_stats_cache` once a day, which `static/js/country-counter.js`
  reads to render the homepage hero counter and the About page's
  "Community Reach" section. Two different Umami endpoints feed that row,
  deliberately: the headline figure is the site-level all-time **visits**
  count from `/api/websites/:id/stats`, stored in `total_visits`, so that
  the number on the page is the same number the Umami dashboard shows
  rather than a sum this codebase computed; the per-country breakdown is
  the `visits` column of `/metrics/expanded?type=country`. Both are visits
  (sessions), not page views and not unique visitors, and the labels say
  "student visits" for that reason. The front end falls back to summing
  the per-country rows only when `total_visits` is missing, which happens
  between a deploy and the next cron run. Community Reach in particular is entirely
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

## Critical CSS: question pages only, and why not the rest

Question pages (`content/papers/**/q*/index.md`, the largest URL bucket) inline a
pre-extracted critical stylesheet and load the full compiled stylesheet without
blocking render. The switch lives in `layouts/_partials/head.html`, production
branch only, and is keyed on a `/papers/` URL whose cascaded layout is `question`.
Every other page keeps the normal render-blocking stylesheet.

This is a project-level override of the theme's `_partials/head.html`. It is the
only one: an earlier, separate override at `layouts/partials/head.html` (old-style
path, no underscore) was found to have been silently shadowing this file, since
Hugo's project-level `_partials` takes precedence over project-level `partials`.
That file has been removed and its logic merged into this one. Do not recreate a
`layouts/partials/head.html`.

The same file also appends the olympiad and year to a question page's `<title>`
tag (for example "Q1 - Poiseuille's Law ... – IBO 2015 – BiOGuide ..." rather
than just "Q1 - Poiseuille's Law ... – BiOGuide ..."), detected by matching the
page's own filename against `^q[0-9]+$` and reading the year from
`.Parent.Parent.Title`. Every other page's title is unaffected.

Measured under Slow 4G plus 4x CPU throttling, median of 7 runs: question page
first paint went from about 2.7 s to about 1.5 s and layout shift fell slightly
(0.309 to 0.262). The same approach was tried on the home page, resources,
the papers hub and about, and made layout shift worse there (for example
resources 0.16 to 0.32, papers hub 0.16 to 0.38, home 0.32 to over 1.0):
those templates have mid-fold content that stays unstyled until the full
stylesheet arrives. Do not extend this to another template without re-measuring
layout shift without CPU throttling, because throttling hid the home page problem.
The home figures in this paragraph are for the home page as it was before
v2.1.0; the current one has not been tried with critical CSS.

`assets/css/critical-question.css` is generated, not hand-written. It keeps
Tailwind's `@layer` order (the extractor prepends the layer order statement and
keeps rules inside their layer blocks) and includes rules for above-the-fold
elements, elements that are not rendered, and fixed or sticky elements, across
mobile and desktop widths and light and dark. Regenerate it after meaningful
changes to `assets/css/custom.css` or the question template:

```
npm i --no-save puppeteer-core postcss
HUGO_ENVIRONMENT=production hugo server --environment production --renderToMemory --port 1399 --disableLiveReload
BASE_URL=http://localhost:1399 PAGES=/papers/ibo/2015/theoretical-a/q1/,/papers/ibo/2017/theoretical-b/q1/ \
  node scripts/build-critical-css.mjs assets/css/critical-question.css
```

Give `PAGES` a spread of question pages across years, rounds and question types.
A stale file does not break anything: it only means unstyled flashes for rules
added since. Without JavaScript the full stylesheet still loads through a
`<noscript>` link.
