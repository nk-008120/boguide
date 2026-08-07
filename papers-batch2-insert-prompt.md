Insert Batch 2 (Q66–Q80 / ids q16–q30) of IBO 2022 Theoretical 2 into the
BioGuide papers archive at `C:\NK\boguide`.

First read `papers-ingestion-workflow.md` and `papers-ingestion-delegation.md`
in the repo root — they explain the schema, content-page template, and the
free-model delegation process this batch was produced under. Everything below
is the delta those docs don't already cover for this specific batch.

## What's already done for this batch

- Figures are already extracted and placed in `static/papers/ibo/2022/`:
  `q66-figure-1.png` … `q70-figure-1.png`, `q71-figure-1.png` +
  `q71-figure-2.png` (two figures), `q72-figure-1.png`, **q73 has no
  figure**, `q74-figure-1.png` … `q80-figure-1.png`.
- The question text + official answers were bundled and handed to a free AI
  model to write the per-statement explanations (see
  `papers-ingestion-delegation.md` for why/how). The user is pasting that
  model's raw output back into this conversation.

## What you need to do

1. **Take the pasted model output** (YAML blocks, one per question, ids
   q16–q30) and validate each one before inserting anything:
   - Exactly 4 statements (A–D), each with a boolean `answer`.
   - Every `answer` value matches the official key below — if the model
     changed an answer, silently fixing it to match the key takes priority
     over trusting the model.
   - Every `subjects[].name` is a real title from the master list in
     `papers-ingestion-delegation.md` — if the model wrote something not on
     that list (or the placeholder `subjects: []` because nothing fit), pick
     the closest real match yourself.
   - `explanation` text isn't just a restatement of the statement with no
     reasoning, and doesn't read like it was copied from somewhere else
     verbatim — light-touch edit if needed, don't block on this.
   - Replace any `[FIGURE-N]` reference inside an explanation with a plain
     English description if the model left the placeholder literally in the
     text (it should only have used `[FIGURE-N]` as an internal reference,
     not proposed a value for `link`/image markdown — this is authored by
     you using the real filenames above).

2. **Official answer key for this batch** (already verified against the exam
   PDF's own answer-key page — this is ground truth):
   ```
   q16 (Q66): T T T T   q17 (Q67): T F T F   q18 (Q68): F F T F
   q19 (Q69): T T T F   q20 (Q70): T F F F   q21 (Q71): T T F T
   q22 (Q72): T F T T   q23 (Q73): T F T F   q24 (Q74): F T T T
   q25 (Q75): T F T T   q26 (Q76): F F T T   q27 (Q77): T F F T
   q28 (Q78): T T T F   q29 (Q79): T F T F   q30 (Q80): T T F T
   ```

3. **Append the validated entries to `data/papers/ibo/2022.yaml`**, inside the
   `theoretical-2` round's `problems:` list, after the existing q15 entry.
   Each entry needs `id`, `number` (e.g. `"Q66"`), `name` (a short descriptive
   title — write one if the model didn't give a good one), `link`
   (`/papers/ibo/2022/theoretical-2-exam.pdf#page=N`, page numbers below),
   `subjects`, and `statements`. Use the `Edit` tool in one pass for all 15,
   not a giant heredoc (Windows `ENAMETOOLONG`/quoting issues with em dashes,
   °, ₂, etc. — see the environment-gotchas section of
   `papers-ingestion-workflow.md`).

   Exam page numbers (for the `link` anchor):
   ```
   q16=23  q17=24  q18=25  q19=27  q20=28
   q21=29  q22=31  q23=34  q24=35  q25=37
   q26=38  q27=39  q28=41  q29=42  q30=44
   ```

4. **Write the 15 content pages** at
   `content/papers/ibo/2022/theoretical-2/qN/index.md` (N = 16..30), following
   the exact template in `papers-ingestion-workflow.md`'s "Content page
   template" section — reproduce the real question stem text (pull it from
   `static/papers/ibo/2022/theoretical-2-exam.pdf` at the page numbers above
   via `pdftotext -layout -f N -l N ...`), include the real figure(s) using
   the filenames listed above (omit the
   `![...]` block entirely for q23, which has no figure), and the standard
   `{{< papers-quiz >}}` / `{{< papers-problem-nav >}}` / attribution footer
   with `round="theoretical-2"` and the matching `problem="qN"`.

5. **Validate**: confirm all 15 problems parse with `python3 -c "import
   yaml; ..."` (4 statements, boolean answers, non-empty subjects — pattern
   is in the workflow doc), and that every figure reference in the new
   content pages resolves to a real file under `static/`.

6. **One clean Hugo server restart and browser spot-check** — the dev server
   on Windows sometimes fails a rebuild with a file-lock error unrelated to
   your changes; if that happens, stop the `hugo` process and restart via
   `preview_start` rather than debugging it as a code problem (see
   "Environment gotchas" in `papers-ingestion-workflow.md`). Check the first
   new question (q16), the two-figure one (q21), the no-figure one (q23), and
   the last one (q30).

7. **Update the status section of `papers-ingestion-workflow.md`** — mark
   batch 2 done, and note batch 3 (Q81–100, ids q31–q50) is next and hasn't
   had its page mapping/text extraction/figure extraction done yet.
