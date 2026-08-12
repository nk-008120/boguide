# BiOClash — year-round season structure + points system

Status as of 2026-08-11: **evaluation + proposal, nothing implemented. Round-1
decisions incorporated below (time structure, points formula, identity-risk stance) —
see each section for what's now DECIDED vs. still open.** Written in response to a
new idea (subject-wise rounds spread across the year, culminating
in a pre-IBO Full Syllabus round, with a cross-round points system deciding an annual
champion) and asking for an evaluation of (1) current anti-cheat measures, (2) MB-01's
time allotment, and (3) a completed plan for the year-round structure. Companion docs:
`context/bioclash-mb01-exam-mechanism.md` (the delivery engine this all runs on),
`context/anti-cheating-measures.md` (full anti-cheat write-up, referenced/extended
here), `context/bioclash-planner.md` (the ORIGINAL landing-page brief — its
"spring/fall + Dec/June invitational" frequency line is now superseded by this doc and
needs a copy update once this plan is approved, see "Landing page" below).

---

## 1. Anti-cheat evaluation

Everything in `context/anti-cheating-measures.md` still holds, plus what was added in
the 2026-08-11 debugging pass (session-refetch fix, server-enforced page-11 submit
gate, honor-code screenshot/recording rule, front-camera + Drive-upload policy). Given
**real stakes are about to enter the picture** (a year-long points race, not a single
debug-phase attempt by one allowlisted account), the calculus on several of these
changes:

**Solid, real enforcement — no change needed:**
- Content never sent before earned; `toClientBlock` strips every answer-key field.
- Non-recoverable locks with server-side atomic locking.
- Server-authoritative timer.
- Single-active-session (blocks two *concurrent* clients on the same account).
- Page-11 submit gate (new).

**Real gaps, ranked by how much they matter once points are actually on the line:**

1. **No identity verification — the single biggest hole.** Anything gated by
   `bioclash_paper_access` only proves *an account* attempted it, never *the person*.
   The honor code's front-camera-recording requirement is the only counter, and it's
   unenforced by anything technical (no upload infra was built — see
   `anti-cheating-measures.md`'s "explored, not built" section) — it only becomes
   real if a human actually reviews a flagged recording after the fact.
   **DECIDED (2026-08-11): accepted as a bounded honor-system risk for Year
   1.** Keep the honor code + after-the-fact recording review as the only defense;
   revisit only if a real case comes up. No build work follows from this item for
   now — noted here so a future session doesn't rediscover the gap and assume it's
   unaddressed.
2. **Sequential handoff ("tag-teaming") isn't caught by anything.** Single-active-
   session stops two *simultaneous* clients on one account; it does nothing if
   Student A does Part A, hands off, and Student B finishes the rest. No mechanism
   detects this today (not writing-style analysis, not timing-pattern analysis,
   nothing). Same honor-code-only status as identity verification — genuinely the
   same root gap wearing a different hat.
3. **Free-text collusion / plagiarism across submissions.** Still "discussed, not
   implemented" per the existing doc — an n-gram/cosine-similarity pass across
   `bioclash_attempt_blocks` for the same component, run once a round closes, is
   still the right medium-effort fix and gets more valuable as participant count
   grows. Worth doing before AS-01, not urgent for a single-person MB-01 debug pass.
4. **Multi-day open windows are a new leakage vector this plan introduces.** The
   framing ("a week where you can attempt") is good for accessibility
   (timezones, one bad day doesn't cost you the round) but means early test-takers
   can leak *structure* — topics covered, difficulty, what a free-text question
   actually asks — to later ones, even though per-user MCQ shuffling
   (`seededShuffle`) keeps individual *answers* from being directly shareable. This
   is a real, structural tradeoff of the rolling-window format, not a bug to patch —
   flagging it so it's a conscious choice, not a blind spot. If this ever needs
   tightening, the lever is shortening the window (e.g. 48–72h instead of a full
   week) or drawing from a larger item bank so late-week takers see materially
   different questions — both are real, separate pieces of work, not something to
   half-build now.
5. **Numeric answers aren't per-user perturbed.** 5 numeric components today, fixed
   expected values — "the answer is 52.27%" is fully shareable. Per-user parameter
   perturbation was scoped in `anti-cheating-measures.md` and never built. Low
   urgency at 5 questions; revisit if a future round leans harder on numeric/
   calculation questions.
6. **Screenshot/recording "prohibition"** — correctly framed in the honor code as a
   stated rule, not a technical claim (per explicit instruction given during the
   MB-01 debugging pass). Internally, for planning purposes: this **cannot** be
   enforced from a browser, full stop — no future engineering effort changes that.
   Don't let a future session's roadmap quietly assume otherwise.
7. **`bioclash_paper_access` is currently a hand-seeded allowlist of one account.**
   Scaling to real multi-round competitions needs an actual open-registration path
   (or at least a manually-run bulk-allowlist process) — this is a real prerequisite
   piece of work the points-system plan below depends on, not something either this
   doc or the MB-01 debugging session touched.

**Bottom line:** the *mechanical* anti-cheat layer (content gating, locks, timer,
session enforcement) is solid and doesn't need rework for this plan. The *human*
layer (is this really the enrolled student, working alone) is where all the real risk
sits, and nothing currently built closes it — that's an intentional, documented
tradeoff (see "explored, not built" in `anti-cheating-measures.md`), but it's worth
naming explicitly now that a full season's ranking will ride on it.

---

## 2. Time allotment — evaluation, and the decision

**Original evaluation (for context):** the raw pacing of MB-01's 240-minute
placeholder wasn't actually unreasonable in isolation — 165 marks / 240 min ≈ 0.69
marks/min, slightly *more* generous per mark than a real IBO paper (~100–120 marks /
180 min ≈ 0.61 marks/min). The real problem was structural: 4 continuous hours in one
solo, unproctored sitting (real IBO splits its theory component across two separate
papers on two separate days), no scheduled break anywhere in the delivery system
(`end_at` is a hard wall-clock cutoff with no grace window —
`api/bioclash-lock-block.js`), and subject rounds being scoped the same size as what
the Full Syllabus capstone should be, which flattens the capstone's marquee status.

**DECIDED (2026-08-11), superseding the above:**
- Subject rounds: **90 minutes base**, with an optional **+30 minute extension**
  available at a competitive-ranking cost (see the extension mechanic below) — not
  a flat time increase, a genuine trade-off.
- Full Syllabus (FST): **150 minutes base + the same 30-minute extension option**, at
  the same relative cost.

This solves the "4 continuous hours, no break" problem directly rather than by
trimming to ~180–200 min as this doc originally suggested — a hard 90/150-minute base
is short enough that fatigue and bathroom-break fairness stop being live concerns for
most students, and the people who genuinely need more time get an explicit, opt-in
path to it instead of everyone defaulting to a long sitting.

**Flag this doc must raise rather than silently resolve: MB-01 as built does not fit
90 minutes.** 165 marks / 82 gradable components (including 5 pages of image-heavy
Data Analysis interpretation, Hill-equation and percentage calculations, and 19
free-text components) at 90 minutes is ≈1.83 marks/min — more than double real IBO
pacing, and MB-01's content specifically leans toward the slower question types
(multi-part reasoning, calculation, extended free-text), not toward fast MCQ/TF
churn. Read literally, the 90-minute decision cannot apply to MB-01's
*current* content without either:
- (a) **Trimming MB-01 substantially** before it's ever run for real — cutting marks/
  components down to something that actually fits 90(+30) minutes, most likely by
  cutting free-text depth or splitting Data Analysis down, or
- (b) **Treating MB-01 as a one-off, already-built pilot** outside the new standard
  scale, with the 90-minute base applying to every *future* subject round (which
  would then need to be written to that budget from the start, not retrofitted), or
- (c) Deciding MB-01's per-mark pacing is fine as an *exception* precisely because
  it's the season's first/pilot round, and future subject rounds should hit 90
  minutes some other way (fewer marks) rather than matching MB-01's mark count.

**This needs a decision before MB-01 is scheduled for real students** — it's not
something to guess at, since it changes how much of the already-written content
survives. See "Open decisions" at the end.

---

## 3. Year-round season structure + points system (completed plan)

### Terminology (new — today's schema doesn't distinguish these)

Today, `data/bioclash/mb-01.yaml`'s `season: mb-01` field and `bioclash_results.season
= 'Season 1 — Fall 2026'` both use "season" to mean *one round*. That collides head-on
with the new idea, where "season" means *the whole year*. Proposing clean
separation:
- **Season** = the annual cycle, e.g. `"2026–27"`. One champion crowned per season.
- **Round** = one timed competition within a season — MB-01, AS-01, etc. Each round
  has its own paper, its own open week, its own podium.

### DECIDED: the season's 8 rounds and their weights

7 named subject rounds plus the Full Syllabus Test were specified, each
carrying an explicit weight toward the season total (total denominator 200% — the 7
subject weights sum to 100%, FST alone is worth another 100%):

| Round | Subject scope (resource categories) | Season weight |
|---|---|---|
| MB-01 *(built — see the 90-min flag above)* | Cell Biology (Cell & Molecular) | 20% |
| — | Animal Anatomy and Physiology | 25% |
| — | Genetics and Evolution | 20% |
| — | Plant Anatomy and Physiology | 15% |
| — | Ecology | 10% |
| — | Ethology | 5% |
| — | Biosystematics | 5% |
| **FST** | **Full Syllabus** | **100%** |

This maps cleanly onto BiOGuide's own `content/resources/` taxonomy (Animal
Anatomy+Physiology, Plant Anatomy+Physiology, and Genetics+Evolution each combine two
existing resource categories into one round) — reinforcing the same synergy noted
before: a student who underperforms a round has an obvious matching resource category
to review. Two resource categories are deliberately NOT rounds: Bioinformatics
(category 10) and the four Practical categories (11–14) — practicals don't map to a
written timed-attempt format at all, and Bioinformatics isn't in the weight
table; worth a quick confirm that the omission is intentional rather than an oversight
(see "Open decisions").

**Operational-load flag, sharper now than in the original draft**: this is **8 timed
rounds a year**, not 5–6 as this doc first proposed — each needs a paper written,
delivered, offline-graded (mostly by hand, per the existing free-text-heavy pattern),
and its results entered. Two of the seven subject weights (Ethology, Biosystematics —
5% each) are low enough that combining them into one round is worth considering purely
to reduce grading workload, without changing how the weights themselves are scored
(a combined round could still report two separate sub-percentages feeding the two
weighted terms). Not assuming this — flagging it as a real lever.

Suggested spacing (8 rounds from September through the FST window, IBO-date-anchored
for FST specifically, not fixed to a calendar month): September (MB-01, shipped),
October, November, December/January, February, March, April, then FST 3 weeks before
IBO. Exact month assignment to each named round is still to be decided — the table
above intentionally doesn't prescribe it.

### DECIDED: time structure per round, and the extension mechanic

Base times (see Section 2): **90 min for subject rounds, 150 min for FST**, each with
an optional **+30 min extension** taken at a *competitive-ranking cost*, not a flat
time grant. This mechanism needed to be designed — here's the concrete
version:

**Core idea**: the penalty for taking extra time, and the bonus for not needing it,
both scale with how *unusual* your choice was relative to the rest of that round's
field — a pari-mutuel-style, self-balancing adjustment, not a fixed cost. This
directly matches the described intent ("if a lot of students opt for
extensions... you get a relatively scaled bonus too").

1. **The choice is made at attempt start**, alongside the honor-code checkbox — a new
   toggle: *"Standard time (90 min)"* vs *"Extended time (120 min) — affects this
   round's ranking, see rules."* Stored on the attempt (new `bioclash_attempts` column
   `used_extension boolean`); `end_at` is computed from
   `durationMinutes + (used_extension ? extensionMinutes : 0)` (`extensionMinutes` is
   a new per-round YAML field, e.g. `30`). This part is a small, concrete, additive
   change — no different in shape from the honor-code checkbox already built.
2. **Raw score stays pure.** The number of marks a student actually earned is never
   touched by this mechanic — what a student *knows* shouldn't be edited by a ranking
   incentive. The adjustment only ever touches the *effective score used to compute
   that round's placement* (and, through placement, the season weight contribution) —
   computed once the round's window closes and every attempt in it is graded, fitting
   the existing "results are finalized by hand after grading" workflow with no new
   live infrastructure needed.
3. **The formula.** Let `p` = the fraction of that round's participants who used the
   extension (0 to 1), and `M` = a per-round "adjustment ceiling," e.g. 5% of that
   round's total marks (tune per round; FST, being longer and higher-stakes, might
   reasonably use a smaller `M` — the extension matters proportionally less on a
   150-minute base than a 90-minute one):
   - Extension-takers: `effective_score = raw_score − M × (1 − p)`
   - Non-extension-takers: `effective_score = raw_score + M × p`
   - Intuition check: if almost nobody needed the extension (`p` near 0), taking it is
     a bigger outlier and costs close to the full `M`; skipping it isn't special
     (bonus near 0) since almost everyone skipped it too. If almost everyone needed it
     (`p` near 1`), taking it costs almost nothing (it was clearly a fair/shared need,
     not an individual shortfall) — and the rare student who *didn't* need it gets
     close to the full bonus `M`, since finishing without help when nearly the whole
     field couldn't is a genuinely strong signal.
   - Optional refinement, not required for launch: a small floor on the penalty even
     at `p = 1` (e.g. `M × 0.1` minimum), so using extra time is never fully free —
     flagged as a tuning knob, not a launch blocker.
4. **This `effective_score` is what determines round placement** (and therefore the
   round's own podium/Champions display, and its weighted contribution to the season
   total below) — not the raw score shown on the student's own report screen, which
   stays factual/unadjusted for transparency.

### DECIDED: season points — weighted score-percentage, not placement-based

This **replaces** the F1-style placement-points table this doc originally proposed —
the actual answer is a different, and arguably more robust, model: each
round contributes to the season total in proportion to **how well a student actually
performed in it** (score percentage), not their rank relative to whoever else showed
up that round. This sidesteps the "small field makes 1st place too easy" fairness
problem the original proposal explicitly worried about, without needing any
participation-size data this project doesn't have yet.

```
season_score (out of 200%) =
    0.20 × Cell Biology effective-score%
  + 0.25 × Animal Anatomy & Physiology effective-score%
  + 0.20 × Genetics & Evolution effective-score%
  + 0.15 × Plant Anatomy & Physiology effective-score%
  + 0.10 × Ecology effective-score%
  + 0.05 × Ethology effective-score%
  + 0.05 × Biosystematics effective-score%
  + 1.00 × Full Syllabus Test effective-score%
```

Where each `effective-score%` = `effective_score / round_total_marks × 100`, using the
extension-adjusted `effective_score` from the mechanic above (round placement and
season contribution both flow from the same adjusted number — one adjustment, two
uses, no double-counting).

**Per-round podiums (the existing `bioclash-champions.js`/`{{< bioclash-champions >}}`
display) still make sense and don't need to change** — they're a separate, per-round
recognition, driven by `effective_score` placement within that one round. The season
championship is a new, second thing: the weighted sum above, aggregated across all 8
rounds a student attempted (a round not attempted simply contributes 0 to its term —
no separate "missed round" penalty beyond the lost weight itself; no dropped-round
forgiveness was requested and none is assumed here, but the lever from the original
draft still stands if wanted later).

**Tie-break order for the final season ranking:**
1. Total season score (out of 200%).
2. Better FST effective-score%.
3. More 1st-place round finishes, then more top-3 finishes.
4. Declare a tie. (Academic competition, not a scarce-trophy sport — a shared
   placement is a legitimate outcome.)

### Schema changes needed (when this moves to implementation)

- `bioclash_attempts` gains `used_extension boolean not null default false`.
- Each round's paper YAML gains `extensionMinutes` (e.g. `30`) and an
  `adjustmentCeilingPct` (the `M` above, e.g. `5`), plus `opensAt`/`closesAt` dates
  gating when `start-attempt` will even accept a fresh start for that round —
  `bioclash-start-attempt.js` has no "not open yet" concept today and needs one.
- `bioclash_results` gains `season_year` (e.g. `"2026-27"`, distinguishing the annual
  cycle from the existing `season` column, which today already means "round label" —
  keep both rather than renaming, avoiding a breaking change to any row that may
  already exist for MB-01), `effective_score_pct numeric` (the per-round adjusted
  percentage from the mechanic above), and `season_weight_pct numeric` (that round's
  fixed weight from the table above, stored per-row so the standings view doesn't need
  a lookup table baked into SQL — also lets a future season's weights change without
  rewriting history).
- New view `bioclash_season_standings`: for each `(user_id, season_year)`, sum
  `effective_score_pct × season_weight_pct / 100` across all that user's rows, same
  `profiles` join / `is_hidden` filter as the existing `bioclash_leaderboard` view,
  ordered by total descending.
- `bioclash_paper_access`'s single-account allowlist needs a real path to real
  registration before Round 2 — out of scope for this doc, flagged as a hard
  prerequisite.

### UI changes needed

- Start screen: new time-choice toggle (standard vs. extended), styled like the
  existing honor-code checkbox, with plain-language rules text (not hidden fine
  print — the whole mechanic only works as an incentive if students understand it
  before choosing).
- The existing `{{< bioclash-champions >}}` shortcode/`bioclash-champions.js` stay as
  they are — still correct for "this round's podium," now driven by `effective_score`
  instead of raw score once the extension mechanic ships.
- **New**, separate: a season standings view (`bioclash_season_standings`),
  structurally similar to `bioclash-champions.js` but showing the weighted season
  total rather than one round's placements — could live as a second block on
  `/papers/leaderboard/` or its own `/bioclash/standings/` page. Probably worth
  showing each round's individual contribution too (a small per-subject breakdown),
  not just the final 200%-scale number, so students can see where their season score
  is actually coming from.
- **Landing page copy** (`content/bioclash/_index.md`) currently says: *"Frequency:
  Open seasons planned for spring and fall, with invitational rounds aimed at
  December and June."* — directly contradicts this plan and needs a rewrite once
  approved, in the same future-tense/non-overcommitting voice the rest of that page
  already uses (per `context/bioclash-planner.md`'s original calibration).

### Operational load (the real bottleneck, not a technical one)

Every round still ends in **manual, offline grading of free-text answers** (the
majority of marks in MB-01, and presumably every future round), **then** computing
that round's `p` (extension-uptake fraction) and each participant's
`effective_score_pct`, **then** hand-entering the result rows — this was already a
real workload for one round; the confirmed 8-round calendar multiplies it, and the
extension mechanic adds a small but real extra computation step per round (still
just arithmetic per participant, not a new subsystem). Worth an honest gut-check
on whether that's sustainable once real students — not a single debug
account — are attempting each of 8 rounds a year.

---

## Open decisions before implementation starts

1. **MB-01's 165 marks vs. the 90-minute base decision** — trim MB-01's content,
   treat it as a pilot exception, or something else? (Section 2 — needs resolving
   before MB-01 is ever scheduled for real students.)
2. Is Bioinformatics deliberately left out of the 7 named subject rounds, or should it
   be folded in somewhere (an 8th subject round, or merged into an existing one)?
3. Combine the two 5%-weight rounds (Ethology, Biosystematics) into one round to ease
   grading load, while still scoring them as two separate weighted terms — yes
   or keep them fully separate?
4. `adjustmentCeilingPct` (`M`) starting values per round — the doc didn't propose a
   number beyond "e.g. 5% for subject rounds, maybe smaller for FST" — confirm or set
   real values.
5. One-week rolling open window per round, accepted as-is (with its structural
   content-leakage tradeoff noted in Section 1, item 4), or shorten it?
6. Month-by-month assignment of the 7 subject rounds across the year (this doc
   deliberately left this unassigned beyond MB-01 = September).
