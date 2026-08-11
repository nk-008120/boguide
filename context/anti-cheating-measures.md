# BiOClash MB-01 — anti-cheating measures

Reference doc, written 2026-08-11. Covers every layer currently in place
(pre-existing + this session's additions), why each one exists, its actual
strength (deterrent vs. real enforcement), and what's deliberately been
left for later. Read `context/bioclash-mb01-exam-mechanism.md` first if
you haven't — this doc assumes that architecture.


## The core design principle

Everything below sorts into exactly two categories, and mixing them up is
the classic mistake:

- **Real enforcement** — implemented server-side, cannot be bypassed by
  anything the client does or doesn't do, because the server never trusts
  the client. This is the only category that actually stops a determined,
  technical cheater.
- **Deterrents** — raise the effort/risk of casual cheating, catch it
  after the fact, or create an explicit paper trail — but a sufficiently
  motivated technical user can route around them. Still worth having
  (most cheating isn't technically sophisticated), but never treat one of
  these as if it were the first category.

---

## Already in place before this session (real enforcement)

- **Content is never sent before it's earned.** The whole reveal-gating
  system (`initialBlocks`/`blocksRevealedByLock` in `api/_lib/bioclash.js`)
  means there is no API response, ever, that contains a question the
  student hasn't reached yet — not hidden by the UI, actually absent from
  the payload. This is the foundation everything else sits on.
- **`toClientBlock` strips every answer-key field** (`correctKey`,
  `correctValue`, `expected`, `tolerance`) before anything reaches the
  client, for every block, always. Verified this session with a script
  that scans all 23 blocks' client-safe output for those field names.
- **Non-recoverable locks.** Once a block with `locksAfterSubmit: true` is
  locked, the conditional `UPDATE ... WHERE status = 'active'` guarantees
  it can never be re-locked or re-answered — closes the door on
  "answer, see what's ahead, go back and fix it" and on late collusion
  after peers compare notes.
- **Per-user deterministic MCQ shuffle** (`seededShuffle`, seeded off
  `userId:blockId:componentKey`). The same correct concept sits at a
  different displayed key for every student, so "the answer is C" shared
  between two students is worthless without knowing whose shuffle you're
  reading.
- **Server-authoritative timer.** `end_at` is computed once, server-side,
  at attempt creation; every write checks it against the server's own
  clock with no grace window. Can't be extended by client clock tampering.
- **Allowlist gate** (`bioclash_paper_access`) — nobody can even start an
  attempt without a row here.
- **Per-user/per-paper watermark** (`watermarkCode`) — faint overlay,
  deters and attributes leaked screenshots.
- **Fullscreen-exit / tab-visibility counters** — soft signals only,
  logged for founder review, never auto-penalizing.

## Added this session

### 1. Honor-code affirmation (deterrent, policy)
`content/bioclash/mb-01/attempt/index.md` — the Start button ships
`disabled` in the HTML itself and stays that way until the checkbox is
ticked (`bioclash-attempt.js`'s `change` listener + a redundant check
inside the click handler). Wording affirms independent work and flags
that a screen recording or other verification may be requested — see the
"screen/video recording" section below for why this is a clause, not a
capability, for now.

This is explicitly **not** a technical control — a checkbox proves
nothing by itself. Its value is the explicit, timestamped commitment
(standard academic-integrity practice) and the fact that "you agreed to
this" is now on record if a case ever needs to be raised with a student.

### 2. Copy/select/right-click blocking on question content (deterrent)
CSS: `.bioclash-block { user-select: none }`, reversed for `input`/
`textarea` so answer-editing is completely unaffected. JS: capturing-phase
listeners for `copy`/`cut`/`contextmenu`/`selectstart`/`dragstart`, scoped
to the live screen and explicitly skipped whenever the event target is
inside a form field.

**Bypassed in seconds by anyone who opens devtools** — this was never the
point. It stops the casual case: screenshotting a question into a group
chat, right-click-copying a prompt into ChatGPT, dragging a figure out to
reverse-image-search it. The actual reason none of that matters much
either way is layer one above (content isn't leaked ahead of time to
begin with) — this is purely about friction for in-the-moment sharing
during a live attempt.

### 3. Single-active-session enforcement (real enforcement)
The one genuinely new security boundary this session. Full design note is
in `supabase/migrations/010_bioclash_anticheat.sql` and split across
`api/_lib/bioclash.js` (`newSessionToken`), `bioclash-start-attempt.js`,
`bioclash-attempt-state.js`, `bioclash-heartbeat.js` (new),
`bioclash-save-draft.js`, and `bioclash-lock-block.js`. Mechanism:

1. `bioclash_attempts` gains `active_session_token` /
   `active_session_claimed_at`.
2. Every fresh page load — `start-attempt` (new attempt) or
   `attempt-state` (boot/resume/refresh) — mints a brand-new random token
   and unconditionally overwrites the DB column with it. Opening the same
   attempt in a second tab or on a second device therefore always "wins"
   the claim.
3. The frontend polls `bioclash-heartbeat` every 20s with the token it was
   handed. Heartbeat only ever **verifies** — it never reclaims. If the
   token doesn't match what's currently in the DB (because something else
   claimed it since), it 409s.
4. On a 409, `handleSessionSuperseded()` disables every input/button in
   the live screen and shows a fixed banner. This is UX signaling only.
5. The actual gate is that **`save-draft` and `lock-block` both require
   and check the same token before writing anything.** A superseded tab
   cannot save a draft or commit a lock even if it never gets word from
   the heartbeat (network partition, tab suspended, whatever) — the write
   itself is refused server-side. This is what makes it "real enforcement"
   rather than a UI trick: the property holds even with JavaScript fully
   disabled or a hand-crafted request replaying an old token.

What this catches: a student's own second device, or someone else logged
into the same account concurrently (shared credentials) — anything where
two independent clients try to hold the same attempt open and answering
at once. What it does **not** catch: someone else looking over the
student's shoulder, or a single client relaying questions out to a friend
verbally/via a second unrelated device — no session mechanism stops that,
only a live proctor would.

**Known false-positive shape, and why it's fine:** a student who
genuinely opens a second tab of their own exam (bookmark double-click,
accidental duplicate-tab shortcut) will see tab 1 lock. This is intended,
not a bug — refreshing tab 1 reclaims it immediately (its own boot call
re-mints the token), so there's no real harm, just a nudge back to
single-tab use. Not yet tested against real mobile-browser tab suspension
behavior (e.g. iOS Safari discarding a backgrounded tab and silently
reloading it later) — reasoned through in the migration's own comment,
but flagged here as something to actually watch for once this runs live.

### 4. Block-timing analytics (deterrent / post-hoc review, not enforcement)
`bioclash_attempt_blocks` gains `created_at` (row insertion — the moment a
block becomes reachable) and `updated_at` (bumped explicitly by both
`save-draft` and `lock-block` on every write). Combined with the
already-existing `locked_at` (previously written but never read for
anything), this gives real dwell-time data for every non-recoverable
block after the fact.

This only has to be run manually, from the Supabase SQL editor, by the
founder — there's no dashboard for it and none is planned unless it turns
out to be needed regularly:

```sql
-- Dwell time on every non-recoverable (locksAfterSubmit) block, fastest
-- first. Cross-reference block_id against data/bioclash/mb-01.yaml to see
-- its actual mark value and lock warning — a 45-mark Part E block locked
-- in under a minute is a very different signal than a 2-mark MCQ.
select
  a.user_id,
  b.block_id,
  b.created_at,
  b.locked_at,
  extract(epoch from (b.locked_at - b.created_at)) as dwell_seconds
from public.bioclash_attempt_blocks b
join public.bioclash_attempts a on a.id = b.attempt_id
where b.locked_at is not null
order by dwell_seconds asc;
```

Recoverable blocks don't get a clean equivalent (they have no single
"locked" moment — a student can legitimately leave one half-answered for
hours while working elsewhere), so this query is scoped to the
non-recoverable ones on purpose, where "how long did they actually think
about this before committing" is a meaningful question.

---

## Explored, not built: screen/video recording

Asked to explore this explicitly. Conclusion: **add the honor-code clause
now (done, see above), don't build capture infrastructure yet.**

What real screen/webcam recording would actually require:
- Browser permission prompts via `getDisplayMedia()`/`getUserMedia()` —
  cannot be silently forced; the student sees and must approve a native
  "share your screen" dialog every time, which itself needs UX handling
  for "what if they decline."
- Somewhere to store potentially hours of video per student — Supabase
  Storage or equivalent, with real cost that scales with attempt count and
  duration, not a one-time build cost.
- A consent/privacy policy update — recording someone's screen (and
  especially their webcam) is meaningfully more sensitive than anything
  else this system currently touches, and for a webcam feed specifically
  touches the same territory as biometric data in a lot of jurisdictions.
  This needs real privacy-policy language, not just a checkbox.
- Someone to actually review it. A proctoring vendor's whole product is
  the review pipeline (flagging, fast-forwarding to flagged moments,
  human review queues) — without that, "we have the recordings" doesn't
  do anything unless a human is willing to scrub through raw footage,
  which doesn't scale past a handful of suspected cases.

None of that is a reason to never do it — it's a reason it's a separate,
much larger project with its own scoping, not something to fold into this
session's changes. The honor-code clause ("BiOGuide may request a screen
recording... if irregularities are flagged") captures most of the
deterrent value cheaply: it puts students on notice that verification can
be requested, without committing to build and store recordings for
everyone by default. If a specific case ever comes up, asking that one
student to record their screen while re-solving a flagged question live
is a completely manual, zero-infrastructure way to use this clause
without ever building the pipeline.

---

## Still open (discussed, not implemented — no go-ahead yet)

- **Free-text cross-submission similarity scan.** Parts C–F are mostly
  `free_text`, offline-graded, and currently have zero plagiarism
  tooling. An n-gram/cosine-similarity pass across all submissions for the
  same component, run once a season closes, would flag suspiciously
  close pairs for manual review — never auto-penalize. Medium effort
  (an offline Node script over `bioclash_attempt_blocks`, no schema
  change needed), good value for how text-heavy this paper is.
- **Per-user numeric parameter perturbation.** The strongest structural
  defense against "the answer is 0.13" being shared outright — nudge each
  numeric question's underlying parameter (Q8c's `p=0.6`, Q10.4D(i)'s
  K₀.₅, Q10.5's Km/Vmax, etc.) per-user, seeded the same way the MCQ
  shuffle already is, so the correct final number differs per student
  while the difficulty stays identical. Real feature: new YAML schema
  fields, per-user computation server-side in `toClientBlock` (parameter
  injected into the rendered prompt text) and in `componentIsCorrect`
  (expected value computed from the same per-user parameter, not a fixed
  constant). Not started.
