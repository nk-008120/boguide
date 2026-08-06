# Papers Archive — Ingestion Workflow

**Purpose:** a token-efficient runbook for adding more olympiad papers/questions to the BioGuide papers archive (`/papers/...`). Read this before starting a new batch — it exists specifically so a fresh context window doesn't have to re-derive the process, re-hit the same environment bugs, or re-explore the resource-page directory structure from scratch. Written after building IBO 2022 Theoretical 1, Q1–Q49.

If anything here conflicts with what you observe in the live code, trust the code — this doc can drift.

## Current status

- **IBO 2022, Theoretical 1**: Q1–Q49 done (of 50). Q50 remains.
- Data lives in `data/papers/ibo/2022.yaml`. Figures in `static/papers/ibo/2022/`. Content pages in `content/papers/ibo/2022/theoretical-1/qN/index.md`.
- Source PDF: `Theory 1 (Official) IBO 2022 + answer key (1)_unlocked.pdf` (in the user's Downloads at time of writing) — 76 pages, unencrypted, pages 1 = license notice, 2–75 = questions, 76 = official answer key (grid of √/X per question A–D). A second file (`IBO2022_T1Sol.pdf`) has detailed community-written explanations — it is **not official** (its own header says so) and should never be labeled as the answer key.
- Other olympiad programmes (TBO — Taiwanese BO) exist as an earlier, smaller sample with placeholder (non-real) problem-level data — see `boarchive-context.md` for that history. This doc is specifically about the real-content IBO ingestion pattern.

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
