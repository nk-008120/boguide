# BiOClash — compiling results after a round closes

Operational runbook, written 2026-08-11, to actually execute by hand (no
step here runs automatically — everything is manual by design, matching this
project's established "hand-graded, hand-entered" posture for BiOClash). Read
`context/bioclash-mb01-exam-mechanism.md` and `context/bioclash-season-points-plan.md`
first if you haven't — this assumes that architecture and the Z-score/extension
mechanic it describes.

Use this any time a round's open window has closed and its attempts are
`submitted`/`expired`, to go from "students took the test" to "results are in
`bioclash_results` and the leaderboards show them."

---

## Prerequisites

- Migrations 009–013 have all been run in the Supabase SQL editor (schema cache
  reloaded afterward). If a query below errors with "column does not exist," a
  migration hasn't actually run yet — see the standing caveat repeated throughout
  this repo: the migration *file* existing is not the same as it having been
  executed.
- The round's open window has actually closed (or you're intentionally grading
  early stragglers).
- You have the round's marking notes on hand for free-text grading — for MB-01,
  that's `BiOGuide-BiOClash-Problem_1_4.docx` in your Downloads folder (not in this
  repo). Auto-gradable components (mcq/true_false/numeric) don't need this — their
  correct answers live in `data/bioclash/mb-01.yaml`.

All SQL below runs in **Supabase Dashboard → SQL Editor** — the same place you run
migrations. It runs with full access, so joining in `auth.users` for email is safe
there specifically (never expose email through a public-readable view/grant — the
leaderboard views deliberately don't).

---

## Step 1 — See who actually has something to grade

```sql
select
  p.display_name,
  au.email,
  ba.id as attempt_id,
  ba.user_id,
  ba.status,
  ba.extension_blocks_used,
  ba.reached_final_page,
  ba.fullscreen_exits,
  ba.visibility_losses,
  ba.tab_close_events
from public.bioclash_attempts ba
join public.profiles p on p.id = ba.user_id
join auth.users au on au.id = ba.user_id
where ba.paper_id = 'mb-01'
order by p.display_name;
```

This is also your first anti-cheat glance — the `fullscreen_exits`/`visibility_losses`/
`tab_close_events` columns are the soft signals from `context/anti-cheating-measures.md`
and the season-points plan. Nothing here auto-penalizes; a high count is a "maybe
look at this one more closely" flag, not a verdict. Note each `user_id` (uuid) — you'll
need it in Step 4.

## Step 2 — Pull every submitted answer

```sql
select
  p.display_name,
  au.email,
  bab.block_id,
  bab.answer
from public.bioclash_attempt_blocks bab
join public.bioclash_attempts ba on ba.id = bab.attempt_id
join public.profiles p on p.id = ba.user_id
join auth.users au on au.id = ba.user_id
where ba.paper_id = 'mb-01'
order by p.display_name, bab.block_id;
```

Export this (SQL Editor's "Download CSV" button) — this is your actual grading
worksheet.

**Known gap worth knowing about**: nothing currently stops a student from clicking
"Lock & Continue" on a block with zero components filled in — `answer` will just be
`{}` for that block, same shape as a genuinely blank/skipped question. If you see a
row that's entirely `{}` across every component, that student either deliberately
skipped it or misclicked past it — there's no way to tell which from the data alone.

## Step 3 — Grade each answer, compute a marks-weighted raw score

For every block/component, cross-reference against `data/bioclash/mb-01.yaml`:

- **Auto-gradable (mcq/true_false/numeric)**: compare the submitted value against
  that component's `correctKey`/`correctValue`/`expected`+`tolerance` in the YAML.
  **Do not use `bioclash_attempts.auto_score_correct`/`auto_score_total` as the
  final score** — it's a rough count of how many auto-gradable *components* were
  correct, not weighted by each component's `marks` value. It's a decent sanity
  check, not the source of truth.
- **Free-text**: grade by hand against the marking notes docx.
- For every component you mark correct, add its `marks` value (from the YAML) to
  that student's running total. The sum across every component is their
  **raw_score**.

There's no tool that does this arithmetic for you today — it's the one genuinely
manual, error-prone step in this whole pipeline. (If this becomes painful once
real multi-student rounds are common, a small helper script that takes your
correct/incorrect judgments and sums the YAML's `marks` values for you would be a
reasonable thing to build — not built yet, ask if you want it.)

## Step 4 — Compile the scoring input file

One JSON file, one entry per student who completed the round:

```json
[
  { "userId": "<uuid from Step 1>", "displayName": "Alice", "rawScore": 140, "blocksUsed": 0 },
  { "userId": "<uuid from Step 1>", "displayName": "Bob",   "rawScore": 110, "blocksUsed": 2 }
]
```

`blocksUsed` is `extension_blocks_used` from Step 1's query — how many +30-minute
extensions that student actually requested during their attempt.

## Step 5 — Run the scoring script

```bash
node scripts/bioclash-score-round.js mb-01 path/to/your-file.json 2026-27 0.20
```

(`2026-27` = season year, `0.20` = MB-01's season weight — see the weights table in
`context/bioclash-season-points-plan.md` for every other round's weight once they
exist.)

This prints a readable table (rank, raw, blocks, z, cost, bonus, time-normalized Z)
**and** a ready-to-paste CSV at the bottom. Nothing is written to the database by
this step — it only computes and prints.

## Step 6 — Sanity-check before you commit anything

Look at the printed `mean`/`stdev`/spread line before pasting anything into
Supabase. If the Z-scores look wildly compressed or wildly spread relative to what
you'd expect, that's worth a second look before finalizing — small `n` makes Z
estimates noisy (see the "normal range of Z-scores" discussion earlier this
session: with `n` students, no single Z can mathematically exceed `sqrt(n-1)`, and
one outlier can distort everyone else's number). If you decide the extension
cost/bonus schedule in `data/bioclash/mb-01.yaml` needs adjusting before this
round's numbers are final, edit it and re-run Step 5 — nothing is committed until
Step 8.

## Step 7 — Decide placement

Placement is separate from the season-index math — it's just this round's rank,
already given by the script's sort order (1st = highest time-normalized Z). Ties are
your call to break or leave tied.

## Step 8 — Insert into `bioclash_results`

The script's CSV gives you `season_year, round_id, user_id, raw_score, z_score,
time_normalized_z, season_weight`. You still need to add `season` (the round's
display label, e.g. `'MB-01'`), `placement`, and optionally `score_label` (e.g.
`'140/165'`) by hand. One insert per student:

```sql
insert into public.bioclash_results
  (user_id, season, placement, score_label, season_year, round_id, raw_score, z_score, time_normalized_z, season_weight)
values
  ('<uuid>', 'MB-01', 1, '140/165', '2026-27', 'mb-01', 140, 1.2839, 1.3964, 0.20);
```

Repeat for every student, or build one multi-row `insert` from the whole CSV — either
works, Supabase doesn't care.

## Step 9 — Verify

```sql
select * from public.bioclash_leaderboard where season = 'MB-01' order by placement;
select * from public.bioclash_season_standings where season_year = '2026-27' order by season_index desc;
```

Both should now show real rows. The live site's Champions section and Season
Champions section read these same views — nothing to redeploy, they'll reflect this
the moment you refresh the page.

## Step 10 — Plagiarism review (once real multi-student data exists — not built yet)

Confirmed out of scope until you hand over real data — see the n-gram/cosine-
similarity design explained earlier this session and `context/anti-cheating-
measures.md`'s "still open" section. Not part of this runbook until that's built.

---

## Known gotchas to remember

- **One `bioclash_attempts` row per `(user, paper)`, ever, no reset path.** If an
  account has a `submitted`/`expired` row for a paper already, `bioclash-start-
  attempt.js` will never let it start a fresh attempt. If you need to reset a test/
  debug attempt (e.g. your own account after a debugging session):
  ```sql
  delete from public.bioclash_attempt_blocks
  where attempt_id in (
    select id from public.bioclash_attempts
    where paper_id = 'mb-01' and user_id = (select id from auth.users where email = '<email>')
  );
  delete from public.bioclash_attempts
  where paper_id = 'mb-01' and user_id = (select id from auth.users where email = '<email>');
  ```
  Irreversible — only run it on attempts you're sure are disposable.
- **An attempt full of `{}` answers isn't gradable** — it's a mechanical/navigation
  test, not a real attempt. Don't feed it into Step 4.
- **`auto_score_correct`/`auto_score_total` are counts, not marks.** Repeated from
  Step 3 because it's the easiest mistake to make here.
