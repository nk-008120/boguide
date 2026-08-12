# Papers Archive — Lean Ingestion Workflow (cost-reduction redesign)

**Purpose:** cut the token cost of adding papers to BiOrchive by moving every
*mechanical* step off Claude entirely (free, deterministic scripts) and every
*reasoning-but-not-trust-critical* step onto a free AI model or a person,
leaving Claude to do only what actually requires judging correctness against
ground truth. Written 2026-08-08, after `papers-ingestion-workflow.md` and
`papers-ingestion-delegation.md` had already shipped ~199 real questions —
this doc doesn't replace either of those (the schema, templates, and subject
list they document are unchanged), it replaces *how much of the process runs
through an LLM at all*.

## Where the cost actually comes from today

Re-reading `papers-ingestion-workflow.md`'s own 13-step runbook, the
expensive parts aren't the hard reasoning (deciding whether a statement is
true, reconciling a contradiction with the official key) — that's a small
fraction of the work. The token cost is dominated by things that have no
reasoning in them at all:

1. **Re-deriving the same extraction code every session.** The "Environment
   gotchas" section lists real bugs (pdfimages numbering, text-anchor
   cropping, Windows heredoc limits) that cost real debugging time *because
   the extraction logic gets rewritten ad hoc in Bash/Python each batch*
   instead of existing as a tested, reusable script. Every rewrite is paid
   for at LLM output rates.
2. **Reading full `pdftotext`/`pdfplumber` output into context** for every
   batch, when only a structured subset (question text, statement text, page
   number) is actually needed downstream.
3. **Viewing images with the `Read` tool** (vision tokens) more often than
   the workflow doc's own stated target — it says roughly 1 in 4 images
   actually needs a real look; worth enforcing that ratio with a cheaper
   first pass instead of Claude's judgment call each time.
4. **Hand-writing ~15–20 near-identical YAML blocks and content Markdown
   pages per batch.** This step is pure templating — every content page has
   the same 8 lines of boilerplate around different data — but today it's
   billed as LLM generation, once per question, every batch.
5. **Explanation writing** — already identified as the single most expensive
   repetitive step in `papers-ingestion-delegation.md`, and already
   partially solved there. This doc extends that same delegation idea to the
   other four items above.

## The fix in one sentence

Turn (1)-(4) into a one-time script that costs nothing to re-run, delegate
the "why is this true" writing and any genuinely ambiguous figure to a free
AI model or a person, and keep Claude strictly as the orchestrator + final
QA layer — the thing that runs the scripts, reads a validation summary, and
fixes whatever gets flagged.

## New pipeline

| Stage | What happens | Who/what does it | Costs Claude tokens? |
|---|---|---|---|
| 0. Source | Find the exam PDF + official answer key/solutions | You (unchanged) | No |
| 1. Extract | Page-to-question map, statement text, image candidates + positions → one structured `raw.json` per batch | **New script** (`extract.py`) | No — one command |
| 2. Answer key | Transcribe the official T/F key into a plain CSV | **You, a team member, or a free vision model** (not Claude) | No |
| 3. Explanations + subject tags | Given the text + the answer (already decided), write the "why," pick subject tags | **Free AI model** (existing delegation prompt, now auto-built by script from `raw.json` — no Claude time spent composing the batch bundle by hand) | No |
| 4. Ambiguous figures only (~1 in 4) | Describe a labeled visual detail the text alone doesn't give | **You, a team member, or a free vision model** | No (only escalates to Claude if the result still looks wrong) |
| 5. Assemble | Merge `raw.json` + answers CSV + explanations + figure notes into the final YAML entries **and** generate every content Markdown page from a template | **New script** (`assemble.py`) | No — one command |
| 6. Validate + review | Schema checks (4 statements, valid subject tags, figure files resolve), then Claude reads the *summary*, not the raw data, and fixes only what's flagged | **Script does the checking; Claude does the fixing** | **Yes — this is now the only real cost, and it scales with problems found, not questions ingested** |
| 7. Build + spot-check | One clean `hugo server` restart, a handful of representative pages clicked | Claude (unchanged, already cheap) | Small, unchanged |

The schema, the content-page template, the subject-tag master list, and the
free-model delegation prompt itself are all **unchanged** from the existing
docs — this pipeline just removes Claude from the steps that don't need it
and formalizes the handoffs between them.

## What this changes about Claude's role

Today: Claude reads raw PDF text, writes every YAML block, writes every
content page, and often eyeballs every figure — cost scales roughly linearly
with question count.

After this: Claude runs two scripts and reads one validation report per
batch. Cost scales with *how many things the validator or the browser
spot-check actually flags*, which should be small and roughly constant
regardless of batch size (10 questions or 50 questions cost about the same
amount of Claude time to assemble and review).

## Status: built and tested, 2026-08-08

All five scripts below exist under `scripts/papers_ingest/` (see that
directory's `README.md` for exact usage) and were verified — not just
written — against real PDFs and real, already-published site data before
being called done:

- `extract.py` tested against a known slice of the 2022 T2 exam; its
  per-question figure counts matched the documented ground truth exactly
  (1/2/3 figures for Q80/81/82) after fixing a real bug the test surfaced
  (page-range-based figure assignment double-counted images on a page
  shared by two adjacent questions — fixed with position-based assignment).
  Also tested against the 2024 exam's genuinely different layout (bare
  numeral headers instead of "Question N") to confirm the `--question-regex`
  flag actually handles cross-exam layout variance, per your note that every
  IBO paper is laid out differently.
- `build_bundle.py` tested end-to-end against `extract.py`'s real output.
- `assemble.py` tested with a mock free-model response built from real,
  already-published Q80-82 content (so the comparison had real ground
  truth): correctly caught a deliberately-wrong test answer instead of
  trusting it, correctly rejected a malformed YAML block without losing the
  other questions in the batch, produced content pages structurally
  matching the real live `q31/index.md`, and correctly extracted a real
  multi-line figure caption from the source PDF text. One real Windows/Git
  Bash gotcha found and documented: a `/`-leading path argument gets
  silently mangled by MSYS path conversion unless the command is prefixed
  with `MSYS_NO_PATHCONV=1`.
- `validate.py` run against all 50 real, already-published `theoretical-2`
  questions — passed clean (0 issues), confirming its checks aren't
  producing false positives against known-good production data.

Resolved open questions from the first draft of this doc: answer-key
transcription will go through a **free vision model** (not you/a team
member) — `render_answer_key.py`'s job is exactly that hand-off point.

## What was built (reference — see README.md for usage)

All Python — `pdfplumber`, `pymupdf` (fitz), and `pillow` are already
installed in this environment; no new dependencies needed.

- **`scripts/papers_ingest/extract.py <pdf> <start_page> <end_page> <out_dir>`**
  — runs the existing `pdftotext -layout` / `pdfplumber` / `pdfimages`
  recipe from `papers-ingestion-workflow.md` steps 1–6 once, programmatically
  (not re-derived by Claude in Bash each time), and writes one `raw.json`:
  `{questions: [{id, number, page, text, statements: [{letter, text}],
  images: [{page, candidate_path, width, height}]}]}`. Encodes the known
  gotchas (logo-image filtering by dimension, pdfimages numbering resets per
  range, Windows file-lock retry) once, permanently.
- **`scripts/papers_ingest/render_answer_key.py <pdf> <page> <out_png>`** —
  renders the answer-key page at high DPI to a PNG for a human or a free
  vision model to transcribe, instead of Claude spending vision tokens on it.
- **`scripts/papers_ingest/build_bundle.py <raw.json> <answers.csv> <out.txt>`**
  — auto-generates the exact prompt bundle `papers-ingestion-delegation.md`
  already specifies (question text + given answers + subject master list),
  so composing it is no longer a Claude task at all — you paste the script's
  output straight into the free model.
- **`scripts/papers_ingest/assemble.py <raw.json> <answers.csv>
  <explanations.yaml> <figure_notes.json> <out.yaml> <out_content_dir>`** —
  merges everything, appends to `data/papers/<ol>/<year>.yaml`, and
  generates every `content/.../qN/index.md` from the existing template
  (string-substitution, no LLM). This is the highest-leverage script — it's
  what currently costs the most in step 10–11 of the old runbook.
- **`scripts/papers_ingest/validate.py`** — formalizes the ad hoc
  `python3 -c "import yaml; ..."` checks from step 12 into a real script that
  also checks figure-file existence and subject-tag validity against the
  master list, and prints a **short summary**, not a dump (so Claude's
  review reads one paragraph, not the whole file).

## Division-of-labor cheat sheet

- **Scripts (free, build once):** PDF text/image extraction, page-to-question
  mapping, prompt-bundle generation, YAML + Markdown assembly, schema
  validation.
- **You / a team member (reasonable, bounded effort, no AI needed):**
  transcribing one answer-key page per exam (~10–20 min), describing the
  ~25% of figures that are genuinely ambiguous, a final read-through of a
  finished batch before it ships (this is the same review role the
  "specialised team" process on the About page already describes — this
  pipeline just plugs that team in earlier, at the cheap stages, instead of
  only at the end).
- **Free AI model (Gemini via AI Studio's free tier, ChatGPT's free tier,
  etc.):** explanation writing (given the answer) and, optionally, a
  first-pass answer-key transcription or figure description for a human to
  just confirm rather than produce from scratch.
- **Claude:** builds/maintains the scripts, runs the pipeline, reads the
  validator's summary, fixes anything flagged, does the final build +
  browser spot-check. Never touches raw PDF text or writes a content page by
  hand once this is in place.

## Still genuinely open

- Which free AI model you'll actually paste `build_bundle.py`'s output into
  (Gemini/AI Studio, ChatGPT, other) — the bundle format doesn't need to
  change per-model, just worth deciding before the next real batch.
- The first real batch run through this full pipeline end-to-end (everything
  above was verified with mock/replayed data against real ground truth, but
  a live batch — a genuinely new, not-yet-published question range — hasn't
  gone through it yet).
