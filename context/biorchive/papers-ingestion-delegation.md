# Papers Archive — Delegating Batch Explanations to a Free AI Model

**Purpose:** cut token cost on the papers ingestion workflow (see `papers-ingestion-workflow.md`) by offloading the expensive, repetitive step — writing a 2–4 sentence explanation for each of the 4 statements per question — to a free/cheaper AI model, while Claude keeps doing the parts a free model can't do anyway (PDF page mapping, figure extraction, schema validation, file placement, Hugo build + browser verification).

## Division of labor

- **Claude** extracts the question text and page numbers from the source PDF, keeps the transcribed official answer key, extracts and places the real figure PNGs, and hands you a ready-to-paste prompt bundle per batch (~15 questions). After you bring back the model's output, Claude validates it, fills in real figure filenames, assembles the YAML + content pages, and does one clean build + browser spot-check.
- **The free model** (ChatGPT, Gemini, etc. — ideally one that accepts image uploads) reads the question text (and, ideally, the actual exam page images/screenshots you attach) plus the *already-known correct answer*, and writes the "why" for each statement. It never has to guess true/false — that removes the main source of free-model unreliability on this task.
- **You** paste the bundle into the free model (optionally attaching the relevant PDF page screenshots so it can actually see the figures), then paste the raw response back to me.

## What to send back to me

Just paste the model's raw output into the chat, or save it as a `.txt`/`.md` file anywhere and tell me the path — either works. Don't bother cleaning it up; I'll validate it myself:

- Every question has exactly 4 statements with boolean answers matching the official key.
- Every subject tag resolves to a real `/resources/.../` page (from the master list below).
- A plausibility/figure-consistency spot-check on a handful of explanations.
- Real figure filenames slotted in (the model only ever sees descriptions, never real image files — that part stays with me).

If something looks off (wrong answer slipped in, a fabricated subject page, a statement copied instead of explained), I'll flag it and either fix it directly or ask the model's output to be redone for that question — I won't silently insert something wrong.

## Rules the model must follow (already written into the template below)

- Use the **exact statement text** as given — never paraphrase the statement itself, only the explanation.
- Never copy prose from an unofficial "Community Solutions" PDF verbatim, even if you hand the model one for grounding — explain in the model's own words.
- The **answer is given, not derived** — the model's job is to explain why it's true/false, not to re-decide it. If its own reasoning seems to contradict the given answer, it should still explain using the given answer and add one honest sentence flagging the tension, rather than force a fabricated-sounding justification.
- Keep each explanation to 2–4 sentences.
- Don't invent subject tags or figure filenames — pick subjects only from the provided master list, and leave figure references as `[FIGURE-N]` placeholders (Claude fills in the real filename and alt text).

## Reusable prompt template

Everything between the `======` markers is what you paste to the free model. Swap out the `[BATCH DATA]` section each time — I'll generate a filled-in version of this per batch (see the ready-made Batch 2 file for the next one).

```
======
You are helping populate a Biology Olympiad practice-question archive. For each
question below, the CORRECT ANSWER for each of the 4 statements (A–D) is already
given — your job is only to explain WHY each statement is true or false, in 2–4
sentences, grounded in the question's own text/figures. Do not re-derive or
second-guess the given answer; if your own reasoning seems to conflict with it,
still explain using the given answer and add one sentence noting the tension.

Use the exact statement text given — never rephrase the statement itself.
Never copy sentences verbatim from any "community solutions" material you might
also have — write explanations in your own words.
Pick exactly one or two subject tags per question from the MASTER SUBJECT LIST
below — do not invent new ones or guess a link that isn't listed.
If a question's figure matters to a statement's truth, describe what the figure
shows in your explanation, but reference it only as [FIGURE-N] (N = 1, 2, ...)
— do not invent a filename.

=== OUTPUT FORMAT (follow exactly, one block per question) ===
For each question, output a YAML block in this exact shape:

- id: qN
  number: "QXX"
  name: "Short Descriptive Title Matching the Question's Real Topic"
  subjects:
    - name: "Exact Resource Page Title From The Master List"
  statements:
    - letter: "A"
      text: "<exact statement text from the question>"
      answer: true/false   # as given below, do not change
      explanation: "<your 2-4 sentence explanation>"
    - letter: "B"
      ...
    - letter: "C"
      ...
    - letter: "D"
      ...

=== MASTER SUBJECT LIST (pick only from these; "name" must match exactly) ===
1-cell-molecular: Enzyme Kinetics & Regulation | Carbohydrate Chemistry & Biology |
DNA Structure & Replication | Plasma Membrane Structure & Transport | Cell
Junctions, Extracellular Matrix & Cell Death | Nucleotide & Nucleic Acid
Chemistry | Recombinant DNA & Biotechnology Techniques | Protein Structure,
Folding & Function | Biomolecular Analytical Techniques | Bioenergetics &
Central Metabolism Overview | Cell Signaling & Communication | Endomembrane
System & Protein Trafficking | Mitochondria & Chloroplasts: Structure &
Endosymbiotic Origin | Amino Acids & Protein Chemistry | Cell Cycle, Mitosis &
Meiosis | Cell Theory: Prokaryotes & Eukaryotes | Cytoskeleton & Motor Proteins
| DNA Repair & Recombination | Gene Regulation: Eukaryotic & Epigenetics | Gene
Regulation: Prokaryotic | Lipids & Membrane Biochemistry | Transcription & RNA
Processing | Translation & The Genetic Code

2-animal-anatomy: Human Circulatory System | Human Integumentary System | Fish
& Amphibian Anatomy | Mammalian Comparative Anatomy | Human Skeletal System |
Human Sensory Organs | Body Plans | Human Digestive System | Human Excretory
System | Human Muscular System | Human Nervous System | Human Reproductive
System | Human Respiratory System | Invertebrate Body Plans 1 & 2 | Reptile &
Bird Anatomy

3-animal-physiology: Cardiovascular Physiology | Immune Physiology | Nervous
System Physiology | Endocrine System Physiology | Comparative Thermoregulation
| Respiratory Physiology | Locomotion & Energetics | Comparative
Osmoregulation & Excretion | Comparative Respiration & Circulation | Digestive
& Metabolic Physiology | Homeostasis & Osmoregulation | Muscle Physiology |
Reproductive Physiology

5-plant-physiology: Water Transport & Transpiration | Mineral Nutrition &
Nutrient Uptake | Calvin Cycle, Photorespiration & C4/CAM Biochemistry | Light
Reactions & Photophosphorylation | Phloem Transport & Translocation |
Photoperiodism, Vernalization & Flowering | Plant Hormones | Plant Stress
Physiology & Defense | Seed Germination & Dormancy Physiology | Stomatal
Physiology & Gas Exchange | Tropisms & Nastic Movements

6-plant-anatomy: Plant Body Plans Across Major Lineages | Flower Anatomy &
Reproductive Structures | Stem Anatomy | Leaf Anatomy | Root Anatomy |
Secondary Growth & Wood Anatomy | Monocot-Dicot Comparative Anatomy | Plant
Tissue Systems | Seed & Fruit Anatomy | Xylem, Phloem & Vascular Tissue

7-genetics: Pedigree Analysis & Human Genetic Disorders | Extranuclear &
Non-Mendelian Inheritance | Chromosomal Variation: Number & Structure |
Epistasis, Gene Interactions & Complementation | Extensions of Mendelian
Inheritance | Linkage, Recombination & Genetic Mapping | Mendelian Inheritance
& Probability | Quantitative Genetics: Heritability & Inbreeding | Sex
Determination & Sex-Linked Inheritance

9-ethology: Aggression, Territoriality & Social Structure | Mating Systems &
Sexual Selection | Biological Rhythms | Animal Communication | Development &
Learning | Foraging & Anti-Predator Behavior | Kin Selection, Altruism &
Eusociality | Mechanisms of Behavior | Orientation & Navigation

15-evolution: Natural Selection: Modes & Fitness | Molecular Evolution &
Neutral Theory | Evolutionary Developmental Biology (Evo-Devo) | Coevolution &
Species Interactions | Evidence for Evolution | Genetic Drift, Gene Flow and
Mutation | History of Life: Origin and Major Transitions | Human Evolution and
Hominid Phylogeny | Macroevolutionary Patterns and Mass Extinctions |
Population Genetics: Hardy-Weinberg Equilibrium | Speciation and Reproductive
Isolation

8-ecology: no sub-pages yet — for ecology-flavoured questions with no better
fit, use "Ecology" as the name.

If none of these genuinely fit, say so explicitly instead of forcing a bad
match — leave a note like `subjects: []  # none of the given list fits` and
I'll pick a real one myself.

[BATCH DATA — question text, official answers, and page numbers go here]
======
```

## Master resource-page directory (for reference — Claude's copy, don't need to send this part)

directory-slug → exact page title, `/resources/<section>/<lowercased-slug>/`. See `papers-ingestion-workflow.md` for the full confirmed/unconfirmed list and the content-page markdown template — that part of the process (figures, YAML insertion, content-page assembly, validation, build) doesn't change with this delegation workflow.

## Current status

- IBO 2022 Theoretical 1: Q1–Q49 done (Q50 remains).
- IBO 2022 Theoretical 2: **Q51–Q100 all done (the full round)** — Q51–65 pre-dates this delegation workflow; Q66–100 ended up being written directly by Claude at explicit request rather than through this delegation process (see `papers-ingestion-workflow.md`'s status section for details). This delegation workflow remains available/documented for future exams or rounds where offloading explanation-writing is worth it.
