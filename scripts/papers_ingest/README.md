# papers_ingest — lean ingestion pipeline scripts

Implements `context/papers-ingestion-lean-workflow.md`. Read that doc first
for the *why* and the division of labor (script / human / external tool);
this file is the *how* for each script. All Python, all tested
against real PDFs and real published data already on this site (see the doc
for what was verified).

**Windows/Git Bash gotcha**: prefix every command below with
`MSYS_NO_PATHCONV=1` when a `--source-pdf`/`--solutions-pdf` argument starts
with `/` (a site-root path like `/papers/ibo/2022/...`) — Git Bash's MSYS
layer otherwise silently rewrites it into a local Windows path (e.g.
`C:/Program Files/Git/papers/...`). Confirmed this bites `assemble.py`;
harmless everywhere else but cheap to always include.

## 1. `extract.py` — PDF → structured `raw.json`

```
python3 scripts/papers_ingest/extract.py EXAM.pdf START END OUT_DIR \
  [--question-regex REGEX] [--figure-mode {raster,vector,both,none}] [--dpi 200]
```

Every exam has a different layout — confirmed across the 2022 IBO papers
("Question N" headers) vs. the 2024 paper (bare page-header codes like
"Q1-1", question text starts with a lone digit) — so `--question-regex` is a
flag, not a constant. Before trusting a new exam's extraction:

1. Run with the default regex first. If it warns "no questions matched,"
   open `OUT_DIR/text/page_*.txt` for a page you know contains a question
   and look at how the header actually reads.
2. Pick a regex against that. `^Question\s+(\d+)\b` worked for both 2022
   papers; `^Q(\d+)-\d+$` worked for the 2024 paper's running header
   (matches every page belonging to a task, not just the first — that's
   fine, `owning_question()` only needs the *first* occurrence per number).
3. Re-run, sanity check `raw.json`'s question count and page range against
   what you expect, and glance at `figures/` before moving on.

Figure candidates: raster images are extracted directly (with a hash-based
logo/watermark filter — robust across exams since it's content-based, not
dimension-based). Pages with no raster candidates but a "Figure N." caption
line get an auto-cropped fallback (`--figure-mode vector`/`both`) using the
same text-anchor method documented in `papers-ingestion-workflow.md` for the
2024 paper's vector-drawn figures — these are marked `"auto_cropped": true`
in `raw.json` and are meaningfully more likely to need a manual look than a
raster candidate.

Both raster and vector-fallback figures are assigned to the correct question
by **vertical position on the page**, not just page-range overlap — needed
because two adjacent questions routinely share a page (verified: naive
page-range assignment double-counted a shared page's images across both
questions until this was fixed).

Repeating running headers/footers (exam title, "English (Official)", etc.)
are also filtered out of the extracted question text the same way (exact-text
frequency across pages), so the free-model prompt bundle isn't full of
header noise.

## 2. `render_answer_key.py` — page(s) → PNG for transcription

```
python3 scripts/papers_ingest/render_answer_key.py EXAM.pdf 80 out.png
python3 scripts/papers_ingest/render_answer_key.py EXAM.pdf 76-79 out_dir/ --dpi 250
```

Renders the official answer-key page(s) at high DPI. Hand the PNG(s) to
whoever/whatever is transcribing (you, a team member, or an external tool)
along with the CSV schema the script prints
(`question_number,letter,answer`).

## 3. `build_bundle.py` — `raw.json` + answers → free-model prompt

```
python3 scripts/papers_ingest/build_bundle.py raw.json answers.csv out.txt \
  [--id-prefix q] [--id-offset 50] [--resources-dir content/resources]
```

Auto-generates the exact prompt bundle `papers-ingestion-delegation.md`
specifies — including a **live** subject master list (reads real
`content/resources/**/_index.md` titles, not a hand-copied list that can
drift; confirmed several real titles have already drifted from that doc's
static copy). Also asks the model for a `stem` field (question prose with
the header and lettered statements trimmed) — mechanical trimming a free
model can do reliably, so `assemble.py` doesn't need to guess it later
(though it will, with a flagged fallback, if the field is missing).
`--id-offset` handles rounds whose ids restart at q1 for a later exam
question number (e.g. theoretical-2 question 81 → id q31, offset 50).

Paste `out.txt` into whatever tool is writing the explanations, save its
raw response to a file — no cleanup needed, `assemble.py` parses it
defensively.

## 4. `assemble.py` — merges everything into the real YAML + content pages

```
python3 scripts/papers_ingest/assemble.py \
  --raw raw.json --answers answers.csv --explanations explanations.txt \
  --figures figures_map.json \
  --olympiad ibo --year 2022 --round theoretical-2 --id-prefix q --id-offset 50 \
  --category "Theoretical 2" --exam-label "IBO 2022, Theoretical Paper 2" \
  --source-pdf /papers/ibo/2022/theoretical-2-exam.pdf \
  --solutions-pdf /papers/ibo/2022/theoretical-2-solutions.pdf \
  --figures-static-dir static/papers/ibo/2022 \
  --data-yaml data/papers/ibo/2022.yaml \
  --content-dir content/papers/ibo/2022/theoretical-2 \
  --resources-dir content/resources \
  [--dry-run]
```

The highest-leverage script — replaces hand-writing every YAML block and
every content page. Always run `--dry-run` first.

`figures_map.json`: `{"q31": ["path/to/candidate.png", "..."], ...}`, one
entry per question, filenames/paths in `[FIGURE-N]` order. A bare filename
that already exists under `--figures-static-dir` is used as-is; anything
else is treated as a source path and copied+renamed to
`<id>-figure-<n>.png` automatically (so you can point straight at
`extract.py`'s `figures/` candidates without manually renaming first).

**Cross-checks, not blind assembly** — a question is only written if:
- its explanation block parsed cleanly (malformed blocks are isolated, not
  fatal to the batch — confirmed via a deliberately malformed test block);
- every statement's `answer` matches the transcribed official answer
  (confirmed this catches a real mismatch — a deliberately wrong test
  answer was correctly rejected, not silently trusted);
- every subject tag resolves to a real, current resource page;
- every figure resolves to a real file.

Anything that fails is printed in the summary and **excluded** — nothing
partially-wrong gets written. A missing `stem` field is a warning, not a
blocker (the heuristic fallback still produces usable text — flagged for a
spot-check, not excluded).

Figure captions are pulled directly from the source PDF's own "Figure N."
caption line(s) when present (multi-line, bounded lookahead — confirmed
against a real two-sentence caption). Multiple images sharing one caption
(e.g. a 3-panel figure captioned once) fall back to a generic
"Figure N." placeholder for panels 2+ — worth a manual caption pass for
those specifically, same as the original manual workflow already required.

## 5. `validate.py` — final check before build

```
python3 scripts/papers_ingest/validate.py \
  --data-yaml data/papers/ibo/2022.yaml \
  --content-dir content/papers/ibo/2022/theoretical-2 \
  --static-dir static/papers/ibo/2022 \
  --resources-dir content/resources \
  [--round-id theoretical-2]
```

Formalizes the old runbook's ad hoc validation into a real script: schema
(4 statements, boolean answers, non-empty explanations), subject tags
(resolve to a real *and current* page — catches drift, not just typos),
content pages exist, figure files exist on disk. Prints a short pass/fail
summary per category, not a raw dump — **exit code 1 on any failure**, so it
composes with a shell `&&` if wanted. Verified clean (exit 0, zero issues)
against all 50 already-published, real `theoretical-2` questions — this is
the tool's own ground-truth check, not just a unit test.

## What's still a manual judgment call, on purpose

This pipeline does not try to fully automate: deciding whether an
auto-cropped vector figure is actually correct (eyeball it — that's the
whole point of the `auto_cropped` flag), writing real distinguishing
captions for multi-panel figures sharing one source caption, or resolving a
genuine tension between a model's own reasoning and the official answer key
(write it honestly, per `papers-ingestion-workflow.md` step 8 — unchanged).
