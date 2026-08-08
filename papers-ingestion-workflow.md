# Papers Archive — Ingestion Workflow

**Purpose:** a token-efficient runbook for adding more olympiad papers/questions to the BioGuide papers archive (`/papers/...`). Read this before starting a new batch — it exists specifically so a fresh context window doesn't have to re-derive the process, re-hit the same environment bugs, or re-explore the resource-page directory structure from scratch. Written after building IBO 2022 Theoretical 1, Q1–Q49.

If anything here conflicts with what you observe in the live code, trust the code — this doc can drift.

## Cost-saving variant: delegating explanations to a free AI model

For batches from IBO 2022 Theoretical 2 Q66 onward, the per-statement explanation
writing (the expensive, repetitive part of step 8 below) can be delegated to a
free/cheaper AI model instead of done in-session. See
`papers-ingestion-delegation.md` for the full process, the reusable prompt
template, and the subject-tag master list to hand that model. Claude still does
every other step unchanged (page mapping, official answer key, figure
extraction/placement, YAML/content assembly, validation, build).

## Current status

- **IBO 2022, Theoretical 1**: Q1–Q49 done (of 50). Q50 remains. Source PDF: `Theory 1 (Official) IBO 2022 + answer key (1)_unlocked.pdf` — 76 pages, pages 1 = license, 2–75 = questions, 76 = official answer key. Community (unofficial) solutions: `IBO2022_T1Sol.pdf`.
- **IBO 2022, Theoretical 2**: **Q51–Q100 all done (ids q1–q50, the full round) — 100% complete.** Batches 2 and 3 (Q66–100, ids q16–q50) ended up skipping the free-model delegation step at the user's request and were written directly by Claude using the same process as Q51–65.
  - Source PDF: `Theory 2 (Official) IBO 2022 + answer key (1)_unlocked.pdf` — 80 pages, page 1 = license, 2–79 = questions, 80 = official answer key. Copied into the repo at `static/papers/ibo/2022/theoretical-2-exam.pdf`. Community (unofficial) solutions: `IBO2022_T2Sol.pdf`, copied to `static/papers/ibo/2022/theoretical-2-solutions.pdf` (occasionally disagrees with the official key on a handful of sub-questions — trust the official key below when they conflict).
  - **Batch 2 (Q66–80, ids q16–q30): done.** The user opted out of the free-model delegation step for this batch and had Claude write the explanations directly (same process as Q51–65) — figures were already extracted and placed in `static/papers/ibo/2022/` (see inventory below) before this batch's session started, and several graph-heavy questions (q17/E-F-G pathways, q18/A-B-C-D cells, q19/OSCA-Piezo graphs, q20/phylogeny labels, q21/three figures, q25/q26/q27/q29/q30 graphs) were reasoned from actually viewing the figure PNGs, not just the extracted text.
    - q66 → `q66-figure-1.png` · q67 → `q67-figure-1.png` · q68 → `q68-figure-1.png` · q69 → `q69-figure-1.png` · q70 → `q70-figure-1.png`
    - q71 → `q71-figure-1.png`, `q71-figure-2.png` (two figures) · q72 → `q72-figure-1.png` · **q73 → no figure**
    - q74 → `q74-figure-1.png` · q75 → `q75-figure-1.png` · q76 → `q76-figure-1.png` · q77 → `q77-figure-1.png` · q78 → `q78-figure-1.png` · q79 → `q79-figure-1.png` · q80 → `q80-figure-1.png`
  - **Batch 3 (Q81–100, ids q31–q50): done.** Claude-authored directly (no delegation), same process as batch 2. One accuracy note: Q92's payoff-matrix table came out garbled from `pdftotext -layout` (merged/shifted-looking cells) — resolved by rendering the page at 250 DPI with `pdftoppm` and reading the table visually before writing explanations; the table in the content page and the reasoning in the YAML are both taken from that visual read, not the raw text extraction.
    - Source pages 45–79 of `theoretical-2-exam.pdf` (page 80 is the answer key, already transcribed above). Page-to-question map:
      Q81→p45-46 · Q82→p47-48 · Q83→p49-50 · Q84→p51-52 · Q85→p53 · Q86→p54-55 · Q87→p56-58 · Q88→p59 (no figure) · Q89→p60 · Q90→p61-63 · Q91→p64-65 · Q92→p66 (no figure, table only) · Q93→p67 (no figure) · Q94→p68 · Q95→p69 (no figure) · Q96→p70-72 · Q97→p73-74 · Q98→p75-76 · Q99→p77-78 · Q100→p79.
    - Figures already extracted and placed in `static/papers/ibo/2022/`:
      - q81 → `q81-figure-1.png` (melatonin levels during/after light exposure), `q81-figure-2.png` (phase shift vs. log photon dose)
      - q82 → `q82-figure-1.png` (cholesterol before/after), `q82-figure-2.png` (HDL before/after), `q82-figure-3.png` (LDL before/after) — 3 separate panel images making up the question's single "Figure 1"
      - q83 → `q83-figure-1.png` (one image, 4 sub-panels A–D: fruit-fly survival curves, axenic/non-axenic/bacteria-exposure)
      - q84 → `q84-figure-1.png` (heart-mass/body-mass ratio, panels A=WKY, B=SHR)
      - q85 → `q85-figure-1.png` (one image, 3 sub-panels: paraquat/starvation/high-temp survival, wild-type vs *mth* mutant, males/females)
      - q86 → `q86-figure-1.png` (panda-covered-in-feces photo), `q86-figure-2.png` (behavior-count histograms + temperature-by-month line graph)
      - q87 → `q87-figure-1.png` (one image, 3 sub-panels a/b/c: raven social-network graphs by season/rearing group)
      - **q88 → no figure**
      - q89 → `q89-figure-1.png` (newt amplexus photo)
      - q90 → `q90-figure-1.png` (one image, 4 sub-panels A–D: cane-toad tadpole trapping/cannibalism/pre-feeding-duration experiments)
      - q91 → `q91-figure-1.png` (one image, 2 sub-panels: finch behavioral-activity-score bar charts by geographic origin and syllable type)
      - **q92 → no figure** (payoff table only, reproduce as a markdown table)
      - **q93 → no figure**
      - q94 → `q94-figure-1.png` (canine pedigree)
      - **q95 → no figure** (Hardy-Weinberg calculation question)
      - q96 → `q96-figure-1.png` (one image, panels A/B/C: Infliximab transcriptome heatmap + spot-perturbation map + quantitative spot-expression bar charts)
      - q97 → `q97-figure-1.png` (panels C/D/E: TEL/ALT relative-activity violin plots by age group + TMM scatter plot), `q97-figure-2.png` (panels F/G: gene influence/PI scatter plots for TEL and ALT)
      - q98 → `q98-figure-1.png` (grape-cultivar genomic SNP-landscape maps, individual cultivars + overview map with migration routes)
      - q99 → `q99-figure-1.png` (*Lepus arcticus* photo), `q99-figure-2.png` (*Lepus americanus* photo), `q99-figure-3.png` (*Lynx canadensis* photo)
      - q100 → `q100-figure-1.png` (mollusc cold-exposure survival curves, 3 conditions)
    - All 20 entries inserted into `data/papers/ibo/2022.yaml`, all 20 content pages written, figure/answer-key validation passed, and a clean server restart + browser spot-check (q31, q32's 3-panel figure, q42's payoff table, q45's quiz scoring 4/4, q50 as the last problem) all confirmed working.
  - **Official answer key, Q51–100** (√=true X=false, transcribed from the exam PDF's own answer-key page, page 80 — this is the ground truth for the `answer:` field, not the community solutions PDF):
    ```
    51: T F F T   52: F F T T   53: F T T F   54: T F T T   55: F T T T
    56: T T T T   57: T F T F   58: T F T F   59: F T T F   60: T T F F
    61: T F T T   62: T F F T   63: T F F T   64: T F F T   65: T F T T
    66: T T T T   67: T F T F   68: F F T F   69: T T T F   70: T F F F
    71: T T F T   72: T F T T   73: T F T F   74: F T T T   75: T F T T
    76: F F T T   77: T F F T   78: T T T F   79: T F T F   80: T T F T
    81: T F F T   82: F T T F   83: T T F T   84: F T T F   85: F F T T
    86: F T F T   87: F F T F   88: F F T F   89: T T F F   90: F T T F
    91: T F F F   92: F T F T   93: F F F T   94: T T T F   95: T F F T
    96: T T T T   97: T T F F   98: T T T F   99: F F T F   100: T T F F
    ```
- Data lives in `data/papers/ibo/2022.yaml`. Figures in `static/papers/ibo/2022/`. Content pages in `content/papers/ibo/2022/theoretical-1/qN/index.md` and `.../theoretical-2/qN/index.md` (ids `q1`–`q50` per round, restarting from 1 each round; the `number` field carries the real exam question number, e.g. id `q1` in theoretical-2 displays as `"Q51"`).
- Other olympiad programmes (TBO — Taiwanese BO) exist as an earlier, smaller sample with placeholder (non-real) problem-level data — see `boarchive-context.md` for that history. This doc is specifically about the real-content IBO ingestion pattern.

- **IBO 2024, Theoretical A: Q1–Q50 — 100% complete (the full round).** Source PDF (109 pages): `IBO2024 Theory A.pdf`, copied to `static/papers/ibo/2024/theoretical-a-exam.pdf`. Unlike 2022, this PDF bundles its own official solutions — pages 1–75 are the 50 questions, and pages 76–109 are "Solutions and Sources for the IBO 2024 Theoretical Exams — Exam A" with a brief official TRUE/FALSE + one-paragraph rationale per statement (labeled "Task #1" … "Task #50", not "Q1" — the numbering matches question number, not id). That official-solutions section is the ground truth for the `answer:` field.
  - **q1–q20**: done in an earlier, undocumented session (this file's status section was never updated for it — a gap in this doc, now fixed). Figures for q1–q23 were already extracted before this batch's session started.
  - **q21–q50 (this session)**: a `theoretical-a-solutions.docx` ("IBO 2024 – Theoretical Exam Part A: Complete Solutions with Detailed Explanations, 50 Questions") already existed at `static/papers/ibo/2024/theoretical-a-solutions.docx` — turned out to be the exact source the q1–q20 session used (verified by exact-string diff of q1/q20's already-published explanations against the docx's tables). **This unlocked skipping the free-model delegation step entirely for q21–50**: the docx has one table per question (`python-docx`'s `doc.tables[N]` = question N, `doc.tables[0]` is a legend), each row giving Sub-Q/Answer/Explanation. Cross-checked all 30 questions' answers against the PDF's own official-solutions section programmatically — **zero mismatches** — so the docx's explanations were used directly (light-touch only, no rewriting needed).
  - **Figure extraction gotcha specific to this exam**: unlike 2022, most figures here are **vector-drawn diagrams/graphs** (schematics, line/scatter plots), not embedded raster photos — `pdfimages`/`page.images` come back empty even though the page clearly has a figure. `pdfimages` only ever caught a same-object-ID 1250×1250 logo repeated on every page (filter on that, not on `pdfimages -list` output shape). The reliable method that worked: render the *whole page* at 200 DPI (`pdftoppm`), then crop with PIL using **text-position anchors** from `pdfplumber` — top bound = bottom-y of the line right before the figure starts (the end of the intro paragraph), bottom bound = top-y of the "Figure N." caption line (excluding the caption itself, so it isn't duplicated against the separately-typed markdown caption below the image). Get both y-values via `page.extract_words()` clustered into lines, sorted by `top`, looking for the large vertical gap — output a full per-page line/gap dump once and read the boundaries off it directly rather than trying to `page.search()` multi-word phrases (search silently fails whenever the PDF's internal text has zero-width/missing spaces between two words, which happens often in this file's justified text — e.g. `itsmutations.` as one token). **Padding direction matters**: crop start should be *below* the top-bound y (top+pad), crop end *above* the bottom-bound y (bottom−pad) — get the sign backwards and a sliver of the adjacent excluded text bleeds into the image edge (happened once this session, caught by viewing the rendered crops before moving on).
  - Two questions needed two separate figure files from one page's crop math either because the exam itself labels them "Figure 1"/"Figure 2" as distinct figures (q40: locomotor-activity graph on one page, body-temperature graph on the next) or because one page contains two visually separated figures with a paragraph in between (q42: eel-tank setup diagram, then a middle paragraph, then the impulse/video-frame figure; q44: swim-up-method diagram then the sperm-velocity/sex-ratio graphs) — see `q40-figure-2.png`, `q42-figure-2.png`, `q44-figure-2.png`.
  - No-figure questions in this range: q24 (codon usage bias, pure text), plus q21's figure (heterozygosity-vs-distance scatter plot) was already done by the earlier undocumented session.
  - Subject-tag mapping for q21–50 pulled in several resource sections not touched by the 2022 batches — `4-biosystematics`, `9-ethology`'s non-"already confirmed" pages, and most of `3-animal-physiology` — all titles were re-confirmed via `grep "^title:"` against the real `_index.md` files rather than assumed from directory-name-to-title guessing.
  - All 50 problems validated (`python3 -c "import yaml; ..."` pattern below), all figure references resolve, and a clean `hugo server` restart + browser spot-check (q21 first-of-batch, q40's two-figure page, q24's no-figure page, q50 as the round's last problem, plus a live click on q21's quiz to confirm the shared `papers-quiz` JS responds correctly to the new data) all passed.

Update this section as you complete more batches.

## Architecture recap (already built, don't recreate)

- **Data**: `data/papers/<olympiad>/<year>.yaml` — one round can hold many `problems`, each with `id`, `number`, `name`, `link` (PDF + page anchor), `subjects` (list of `{name, link}` pointing at real `/resources/` pages), and `statements` (exactly 4 — `letter`, `text`, `answer` (bool), `explanation`).
- **Shortcodes** (`layouts/shortcodes/`): `papers-quiz.html` (instant-feedback practice quiz, reads one problem's `statements`), `papers-problem-nav.html` (prev/next between problems in a round), `papers-attempt.html` (dumps a whole round as JSON for the timed-attempt SPA controller).
- **Timed attempt mode**: `content/papers/<ol>/<year>/<round>/attempt/index.md` + `static/js/papers-attempt.js`. Don't touch unless the feature itself needs changing — it consumes whatever's in the YAML automatically, no per-question wiring needed.
- **Content pages**: `content/papers/<ol>/<year>/<round>/qN/index.md` — full question prose + real figures (reproduced under the exam's CC BY-NC-SA license) + `{{< papers-quiz >}}` + `{{< papers-problem-nav >}}` + attribution footer. See the template below.
- **Figures**: `static/papers/<ol>/<year>/qN-figure-M.png`.

## Workflow for a new batch of questions (same exam)

Do this in batches of ~15–20 questions, not one at a time — the whole point is amortizing fixed costs (server restarts, key lookups) across many questions.

1. **Find the page range.** `pdftotext -layout -f <start> -l <end> exam.pdf out.txt` then `grep -n "^Question" out.txt` to confirm which questions fall in that range before committing to it.

2. **Extract text once, generously.** Same `pdftotext -layout` call as step 1, but read the actual output (not just grep for headers) — this is your source for question stems, statement text, and figure captions. Don't re-extract per question.

3. **Map questions to exact page numbers**, only if you need it for image matching (you will). Quick way: a small Python/pdfplumber loop printing `question ID found on this page` for the range — see the pattern used this session (per-page `extract_text()`, write to a file if the text has non-ASCII chars that crash console printing on Windows — redirect to a file with `io.open(..., encoding='utf-8')`, don't `print()` directly).

4. **List images once for the whole range**: `pdfimages -f <start> -l <end> -list exam.pdf`, filtered to drop the repeated header-logo image (constant dimensions across the whole exam, e.g. `181x100` for this IBO file — check the first page's list output once to learn the logo's dimensions, then `awk` it out for every subsequent list call). Record `page`, `num`, `width x height` per real figure.

5. **Extract all images for the range in one `pdfimages -f X -l Y -png` call.** Files come out as `img-NNN.png` where `NNN` is the `num` column from step 4's *same* invocation (re-running `-list` with the same `-f`/`-l` gives consistent numbering).

6. **Map images to questions by page number**, not by opening every single one. Only actually `Read` (view) an image when the question's correct answer genuinely hinges on a labeled visual detail you can't get from the text — arrows, numbered curves, pedigree symbols, axis-region labels. For "here's a photo of X" or "here's a bar chart matching the text's own description" figures, trust the dimension/position match and skip viewing it. This was roughly 7 of 28 candidate images in the Q31–49 batch — that ratio is a reasonable target.
   - If a figure is genuinely ambiguous at low res (e.g. tiny arrow directions), render just that page at higher DPI (`pdftoppm -r 250`) and crop to the relevant region with PIL rather than re-reading the whole low-res page image again.

7. **Get the official answer key once per exam**, not per batch. Render the answer-key page (usually the last page) at ~200 DPI, transcribe every row in one pass, and keep it somewhere durable (a scratch file, or just paste it into this doc's status section) so later batches in the same exam don't re-render it.

8. **Write explanations honestly.** Reason out *why* each statement is true/false from the text/figure. When your own derivation contradicts the official key and you can't resolve it with more scrutiny, don't force a plausible-sounding but fabricated explanation — write the explanation as "reproducing the official key's call" and flag the tension in one sentence. This has happened a handful of times (Q7-C, Q14-C/D, Q42-A/D) and is a legitimate, expected outcome of working from a real answer key, not a failure to fix.

9. **Copy images** into `static/papers/<ol>/<year>/qN-figure-M.png` with descriptive sequential names.

10. **Write the YAML.** Use the `Edit` tool in chunks of ~5 questions, appending after the last existing entry's closing line each time. **Do not use a single giant Bash heredoc** — it will fail with `ENAMETOOLONG` on Windows once the content gets large, and heredocs are also fragile around the Unicode punctuation this content naturally contains (em dashes, °, ₂, ≡, →, ¹⁵N-style superscripts) causing quote-parsing errors. `Edit` has neither problem.

11. **Write content pages** with `Write`, batching several independent `Write` calls into one message (parallel tool calls) rather than one at a time.

12. **Validate before touching the browser.** Two cheap checks that catch most mistakes without a server round-trip:
    ```
    python3 -c "import yaml; d=yaml.safe_load(open('data/papers/ibo/2022.yaml',encoding='utf-8')); ..."
    ```
    confirming every problem has exactly 4 statements with boolean `answer` values and a non-empty `subjects` list; and a `grep`-based check that every `content/.../qN/index.md` exists and every `/papers/.../qN-figure-M.png` reference in those files resolves to a real file in `static/`.

13. **One clean server restart, one verification pass, at the end of the whole batch** — not per question. See the Hugo/Windows gotcha below for why "clean restart" matters. Verify via: filesystem dimension-check for all new images (compare `PIL.Image.open(...).size` against the `pdfimages -list` values from step 4 — no browser needed), then a small number of representative browser spot-checks (first question of the batch, one multi-figure question, one text-only question, the last question) rather than exhaustively clicking through every single one.

## Data schema (copy this shape exactly)

```yaml
      - id: q50
        number: "Q50"
        name: "Short Descriptive Title — Matches the Question's Real Topic"
        link: "/papers/ibo/2022/theoretical-1-exam.pdf#page=75"
        subjects:
          - name: "Exact Resource Page Title"
            link: "/resources/<section>/<page-slug>/"
        statements:
          - letter: "A"
            text: "The exact statement text from the exam."
            answer: true
            explanation: "Your own reasoning, in your own words — never copy prose from the non-official 'Community Solutions' PDF verbatim."
          - letter: "B"
            ...
          - letter: "C"
            ...
          - letter: "D"
            ...
```

## Content page template

```markdown
---
title: "QN — Short Title"
---

{{< problem-meta category="Theoretical 1" note="Real exam question — full text reproduced under IBO's CC BY-NC-SA 4.0 license" >}}

<div class="papers-subject-tags" style="margin-bottom:1.5rem;">
  <a class="papers-subject-tag" href="/resources/<section>/<page-slug>/">Exact Resource Page Title</a>
</div>

[Question stem prose, reproduced from the real exam.]

![Alt text describing the figure.](/papers/ibo/2022/qN-figure-1.png)
*Caption, can restate/expand on the alt text.*

Using the information and figure(s), determine whether the following statements are true or false:

{{< papers-quiz olympiad="ibo" year="2022" round="theoretical-1" problem="qN" >}}

{{< papers-problem-nav olympiad="ibo" year="2022" round="theoretical-1" problem="qN" >}}

---

Question reproduced from **IBO 2022, Theoretical Paper 1**, licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — attributed to the International Biology Olympiad. [Open the full exam PDF](/papers/ibo/2022/theoretical-1-exam.pdf#page=N) · [Community solutions (unofficial)](/papers/ibo/2022/theoretical-1-solutions.pdf)
```

If a question has no figure, just omit the `![...]` block — see Q37/Q40/Q49 for real examples.

## Resource-page subject tags — confirmed titles (don't re-grep these)

Format: `directory-slug` → exact page title (URL = `/resources/<section-number-slug>/<lowercased-directory-slug>/`, Hugo lowercases paths).

**1-cell-molecular**: Enzyme-Kinetics-Regulation → "Enzyme Kinetics & Regulation" · Carbohydrate-Chemistry-Biology → "Carbohydrate Chemistry & Biology" · DNA-Structure-Replication → "DNA Structure & Replication" · Plasma-Membrane-Structure-Transport → "Plasma Membrane Structure & Transport" · Cell-Junctions-ECM-Cell-Death → "Cell Junctions, Extracellular Matrix & Cell Death" · Nucleotide-Nucleic-Acid-Chemistry → "Nucleotide & Nucleic Acid Chemistry" · Recombinant-DNA-Biotechnology-Techniques → "Recombinant DNA & Biotechnology Techniques" · Protein-Structure-Folding-Function → "Protein Structure, Folding & Function" · Biomolecular-Analytical-Techniques → "Biomolecular Analytical Techniques"

**2-animal-anatomy**: Human-Circulatory-System → "Human Circulatory System" · Human-Integumentary-System → "Human Integumentary System" · Fish-Amphibian-Anatomy → "Fish & Amphibian Anatomy" · Mammalian-Comparative-Anatomy → "Mammalian Comparative Anatomy" · Human-Skeletal-System → "Human Skeletal System" · Human-Sensory-Organs → "Human Sensory Organs"

**3-animal-physiology**: Cardiovascular-Physiology → "Cardiovascular Physiology" · Immune-Physiology → "Immune Physiology" · Nervous-System-Physiology → "Nervous System Physiology" · Endocrine-System-Physiology → "Endocrine System Physiology" · Comparative-Thermoregulation → "Comparative Thermoregulation" · Respiratory-Physiology → "Respiratory Physiology" · Locomotion-Energetics → "Locomotion & Energetics"

**5-plant-physiology**: Water-Transport-Transpiration → "Water Transport & Transpiration" · Mineral-Nutrition-Nutrient-Uptake → "Mineral Nutrition & Nutrient Uptake"

**6-plant-anatomy**: Plant-Body-Plans-Major-Lineages → "Plant Body Plans Across Major Lineages" · Flower-Anatomy-Reproductive-Structures → "Flower Anatomy & Reproductive Structures" · Stem-Anatomy → "Stem Anatomy" · Leaf-Anatomy → "Leaf Anatomy" · Root-Anatomy → "Root Anatomy" · Secondary-Growth-Wood-Anatomy → "Secondary Growth & Wood Anatomy"

**7-genetics**: Pedigree-Analysis-Human-Genetic-Disorders → "Pedigree Analysis & Human Genetic Disorders" · Extranuclear-Non-Mendelian-Inheritance → "Extranuclear & Non-Mendelian Inheritance"

**9-ethology**: Aggression-Territoriality-Social-Structure → "Aggression, Territoriality & Social Structure" · Mating-Systems-Sexual-Selection → "Mating Systems & Sexual Selection" · Biological-Rhythms → "Biological Rhythms"

**15-evolution**: Natural-Selection-Modes-and-Fitness → "Natural Selection: Modes & Fitness" · Molecular-Evolution-and-Neutral-Theory → "Molecular Evolution & Neutral Theory" · Evolutionary-Developmental-Biology → "Evolutionary Developmental Biology (Evo-Devo)" · Coevolution-and-Species-Interactions → "Coevolution & Species Interactions"

**8-ecology**: no sub-pages exist yet (only `_index.md`) — for ecology-flavoured questions with no good specific fit, tag as `"Ecology"` linking to `/resources/8-ecology/` directly.

**Directories that exist but whose exact titles haven't been confirmed yet** (grep `content/resources/<section>/<dir>/_index.md` for `^title:` before using): 1-cell-molecular has ~13 more (Amino-Acids-Protein-Chemistry, Bioenergetics-Central-Metabolism, Cell-Cycle-Mitosis-Meiosis, Cell-Signaling-Communication, Cell-Theory-Prokaryotes-Eukaryotes, Cytoskeleton-Motor-Proteins, DNA-Repair-Recombination, Endomembrane-System-Protein-Trafficking, Gene-Regulation-Eukaryotic-Epigenetics, Gene-Regulation-Prokaryotic, Lipids-Membrane-Biochemistry, Mitochondria-Chloroplasts-Structure-Origin, Transcription-RNA-Processing, Translation-Genetic-Code); 2-animal-anatomy has Body-Plans, Human-Digestive-System, Human-Excretory-System, Human-Muscular-System, Human-Nervous-System, Human-Reproductive-System, Human-Respiratory-System, Invertebrate-Body-Plans-1/2, Reptile-Bird-Anatomy; 3-animal-physiology has Comparative-Osmoregulation-Excretion, Comparative-Respiration-Circulation, Digestive-Metabolic-Physiology, Homeostasis-Osmoregulation, Muscle-Physiology, Reproductive-Physiology; 5-plant-physiology has Calvin-Cycle-Photorespiration-C4-CAM, Light-Reactions-Photophosphorylation, Phloem-Transport-Translocation, Photoperiodism-Vernalization-Flowering, Plant-Hormones, Plant-Stress-Physiology-Defense, Seed-Germination-Dormancy-Physiology, Stomatal-Physiology-Gas-Exchange, Tropisms-Nastic-Movements; 6-plant-anatomy has Monocot-Dicot-Comparative-Anatomy, Plant-Tissue-Systems, Seed-Fruit-Anatomy, Xylem-Phloem-Vascular-Tissue; 7-genetics has Chromosomal-Variation-Number-Structure, Epistasis-Gene-Interactions-Complementation, Extensions-of-Mendelian-Inheritance, Linkage-Recombination-Genetic-Mapping, Mendelian-Inheritance-Probability, Quantitative-Genetics-Heritability-Inbreeding, Sex-Determination-Sex-Linked-Inheritance; 9-ethology has Animal-Communication, Development-Learning, Foraging-Anti-Predator-Behavior, Kin-Selection-Altruism-Eusociality, Mechanisms-of-Behavior, Orientation-Navigation; 15-evolution has Evidence-for-Evolution, Genetic-Drift-Gene-Flow-and-Mutation, History-of-Life-Origin-and-Major-Transitions, Human-Evolution-and-Hominid-Phylogeny, Macroevolutionary-Patterns-and-Mass-Extinctions, Population-Genetics-Hardy-Weinberg-Equilibrium, Speciation-and-Reproductive-Isolation.

**4-biosystematics and 10-bioinformatics**: not explored — check `ls content/resources/4-biosystematics/` etc. before assuming what's there.

## Environment gotchas (each of these cost real debugging time once — don't repeat)

- **Windows Hugo dev-server file locks.** The dev server intermittently fails a rebuild with `ERROR Rebuild failed: ... The requested operation cannot be performed on a file with a user-mapped section open.` This is a Windows file-locking quirk, not a real bug in your changes. Fix: `Stop-Process` the `hugo` process and restart via `preview_start` — don't chase it as a code problem. Always allow a real `sleep`/wait after restart (10–15s) before checking output; the server needs time to finish its first build.
- **`jsonify` inside a `<script>` tag in a shortcode double-encodes.** Go's `html/template` (which Hugo shortcodes use) contextually auto-escapes content inside `<script>` as a JS string literal unless told otherwise. Symptom: the embedded JSON is wrapped in an extra layer of quotes/backslashes and `JSON.parse` on it in the browser gives you a string, not an object. Fix: `{{ jsonify $data | safeJS }}`, always.
- **CSS specificity across light/dark mode can silently clobber tone/state classes.** A rule like `html.dark .some-card { border-color: X; }` (shorthand, all sides) has higher specificity than a single-class `.some-card-critical { border-left: 4px solid red; }` and will win regardless of source order, silently erasing the tone color in dark mode only. Fix: give the base rule only `border-top/right/bottom-color`, and let tone classes own `border-left-color` exclusively — no shorthand collision possible.
- **Bash heredocs fail on large/Unicode-heavy content on this Windows setup.** `ENAMETOOLONG` past a few hundred lines; also fragile quote-parsing around em dashes, °, ₂, ≡, superscripts. Use the `Edit` tool for large structured content instead.
- **This sandboxed browser tool has no real screenshot/fullscreen compositing**, so: `requestFullscreen()` will not visibly engage here (test the JS logic, not the visual fullscreen — that needs a real browser check); native `loading="lazy"` images never fire their load event in this tool (force-check with `img.loading='eager'; img.src=img.src;` then re-query `naturalWidth` in a *separate* tool call, not the same one — timing matters); `getComputedStyle` on a class added by live JS (not present at initial page load) can report stale values — when verifying dynamic CSS, build a tiny static throwaway HTML file with the class already in the markup and check that instead, don't trust a live-toggle read.
- **`window.confirm()` blocks the automated browser.** Stub it (`window.confirm = function(){ return true; }`) before clicking anything that triggers a native confirm dialog, or the tool call will hang.
- **PDFs from Google Drive/Downloads sometimes report password-protected to the `Read` tool even when `pypdf`/`pdfplumber` say `is_encrypted=False`.** If `Read` refuses a PDF, don't give up — try `pdftotext`/`pdfimages`/`pdfplumber` directly via Bash first; several "protected" files in this project turned out to be perfectly readable that way.
- **`pdfimages`'s object numbering restarts at 0 for every new `-f`/`-l` invocation.** The `num` column from a `-list` call only matches the `img-NNN.png` filenames from a `-png` call using the *exact same* `-f`/`-l` range. Don't mix numbers from two different range calls.
