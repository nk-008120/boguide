---
title: "Cell Cycle, Mitosis & Meiosis"
weight: 7
description: "The phases of the cell cycle and its checkpoint controls, the stages of mitosis and cytokinesis, and the chromosome mechanics of meiosis I and II — scoped to mechanism, not the genetic consequences (linkage, recombination frequency), which belong to Genetics."
difficulty: "intermediate"
prerequisites: ["Cytoskeleton-Motor-Proteins"]
syllabus_tags: ["IBO", "USABO", "cell-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

**Scope note**: this page covers the mechanics of how chromosomes move and divide — cell cycle regulation, mitotic stages, and the chromosome behaviour of meiosis I and II. The *genetic consequences* of meiosis — independent assortment (see [Mendel's Laws & Probability in Genetics](/resources/7-genetics/mendelian-inheritance-probability/)), crossing-over-derived recombination frequency and linkage mapping (see [Linkage, Recombination & Genetic Mapping](/resources/7-genetics/linkage-recombination-genetic-mapping/)) — are covered in Genetics, not repeated here; this page is the mechanistic foundation those topics build on.

## Key Concepts

### The cell cycle and its checkpoints

The eukaryotic cell cycle divides into **interphase** (G1, S, G2 — the cell grows and duplicates its genome) and **M phase** (mitosis and cytokinesis — the cell actually divides). **G1** is the primary growth phase; **S phase** is when DNA replication occurs (see [DNA Structure & Replication](../dna-structure-replication/)), producing sister chromatids; **G2** is a second growth/preparation phase before division.

Progression is controlled by **cyclin-dependent kinases (CDKs)**, whose activity requires binding a regulatory **cyclin** subunit — cyclin levels rise and fall across the cycle (via regulated synthesis and, critically, ubiquitin-mediated degradation, see [Protein Structure, Folding & Function](../protein-structure-folding-function/)), while CDK protein levels stay roughly constant; it is this oscillating cyclin availability, not CDK abundance, that drives the cycle's directionality. Three major **checkpoints** enforce quality control:

- **G1/S checkpoint** ("restriction point"): checks cell size, nutrient availability, and DNA integrity before committing to replicate the genome — the primary point at which a cell decides whether to proceed through the cycle at all, or exit into a non-dividing resting state (G0).
- **G2/M checkpoint**: verifies DNA replication completed correctly and checks for DNA damage before allowing entry into mitosis.
- **Spindle assembly checkpoint (metaphase checkpoint)**: verifies every chromosome's kinetochore is properly attached to spindle microtubules from both poles before allowing anaphase onset — a single unattached kinetochore is sufficient to halt the entire cell cycle, preventing catastrophic chromosome missegregation.

Loss of checkpoint function is a recurring cancer mechanism: tumour suppressor genes like *p53* function largely as checkpoint enforcers (triggering cell-cycle arrest or apoptosis in response to DNA damage), so their loss allows damaged cells to continue dividing unchecked.

![Cell cycle diagram with cyclin/CDK pairs and checkpoints marked at each transition: G1 checkpoint (chromosome-spindle attachment check position), intra-S checkpoint (DNA replication and repair), G2/M checkpoint (cell size and DNA replication), and the spindle assembly checkpoint at M](/MCBBPICS/cell-cycle-checkpoints.jpg)
*Source: ScienceDirect Topics*

### Mitosis: the stages

Mitosis divides a duplicated genome (sister chromatids) into two genetically identical daughter nuclei:

1. **Prophase**: chromatin condenses into visible chromosomes (each still consisting of two sister chromatids joined at the centromere); the mitotic spindle begins forming as centrosomes migrate toward opposite poles.
2. **Prometaphase**: the nuclear envelope breaks down (requiring depolymerisation of the nuclear lamina — see [Cytoskeleton & Motor Proteins](../cytoskeleton-motor-proteins/)); spindle microtubules invade the nuclear region and begin attaching to kinetochores via dynamic instability-driven search-and-capture (see [Cytoskeleton & Motor Proteins](../cytoskeleton-motor-proteins/)).
3. **Metaphase**: all chromosomes align at the **metaphase plate**, each properly attached to microtubules from both spindle poles (bi-orientation) — the spindle assembly checkpoint is satisfied at this point.
4. **Anaphase**: sister chromatids separate simultaneously and are pulled toward opposite poles, driven by microtubule shortening at the kinetochore and by motor-protein-driven pole separation.
5. **Telophase**: chromosomes decondense, nuclear envelopes reform around each set of chromosomes, and the spindle disassembles.
6. **Cytokinesis** (overlapping with late mitosis, mechanistically separate from it): in animal cells, an actin-myosin **contractile ring** assembles at the cell cortex and constricts, pinching the cell in two (see [Cytoskeleton & Motor Proteins](../cytoskeleton-motor-proteins/) for the actin/myosin mechanism); in plant cells, which have a rigid cell wall preventing this pinching mechanism, a **cell plate** instead forms from the inside outward via vesicle fusion, eventually forming a new cell wall.

![The six stages of mitosis (prophase through cytokinesis) shown as labelled diagrams with matching fluorescence micrographs below each stage, spindle fibers in green and chromosomes in blue, with the key events of each stage listed as bullet points](/MCBBPICS/mitotic-stages-sequence.jpg)
*Source: teachmephysiology.com*

### Meiosis: chromosome mechanics

Meiosis produces four genetically distinct haploid cells from one diploid cell, through **two** successive divisions following a single round of DNA replication:

**Meiosis I** ("reductional division," halving chromosome number): homologous chromosomes — not sister chromatids — pair up (**synapsis**) and separate. During prophase I, paired homologs form a **tetrad** (bivalent) and undergo **crossing over** at points of physical contact (**chiasmata**), physically exchanging segments between non-sister chromatids of homologous chromosomes — the mechanistic event underlying genetic recombination (its *consequences* for linkage and recombination frequency belong to Genetics — see [Linkage, Recombination & Genetic Mapping](/resources/7-genetics/linkage-recombination-genetic-mapping/); this page covers only that the physical exchange occurs). At anaphase I, whole homologous chromosomes (each still consisting of two sister chromatids) separate to opposite poles — sister chromatids stay together through this division, unlike in mitosis.

**Meiosis II** proceeds mechanistically like a mitotic division (no further DNA replication precedes it): sister chromatids separate at anaphase II, producing four haploid cells total.

![Meiosis I vs. meiosis II chromosome separation: in meiosis I, homologous chromosome pairs held together at the chiasmata (prometaphase I) are pulled apart at anaphase I with sister chromatids staying joined; in meiosis II, sister chromatids held at the centromere (prometaphase II) are pulled apart individually at anaphase II](/MCBBPICS/meiosis-i-vs-ii-chromosome-separation.jpg)
*Source: courses.lumenlearning.com*

The key mechanistic distinction from mitosis, worth stating explicitly: **meiosis I separates homologous chromosomes; meiosis II (like mitosis) separates sister chromatids.** This single distinction is the most commonly tested mechanical fact in this entire topic, since confusing which division separates which chromosome unit is the most common error.

## Comparative Structures

| Feature | Mitosis | Meiosis I | Meiosis II |
|---|---|---|---|
| Starting ploidy | Diploid (2n) | Diploid (2n) | Haploid (n) |
| What separates at anaphase | Sister chromatids | Homologous chromosomes | Sister chromatids |
| Resulting ploidy | Diploid (2n) | Haploid (n), still 2 chromatids/chromosome | Haploid (n), 1 chromatid/chromosome |
| Homolog pairing/crossing over | No | Yes (prophase I) | No |
| Genetic identity of products | Identical to parent cell | — | Genetically distinct from each other and from parent |
| Number of divisions | 1 | (1 of 2) | (2 of 2) |

## Common Exam Questions

- "At which stage/division does [event] occur?" questions consistently hinge on the sister-chromatid-vs-homologous-chromosome distinction above — always identify *which unit* is separating before naming the stage.
- "What is the spindle assembly checkpoint checking for, specifically?" — proper bi-oriented kinetochore attachment of every chromosome, not simply "spindle formation" in general terms.
- "Why does loss of *p53* function promote cancer?" — because it removes a checkpoint enforcement mechanism, allowing cells with DNA damage to continue dividing rather than arresting or undergoing apoptosis — a mechanistic answer, not simply "it's a tumour suppressor."
- Cytokinesis mechanism (contractile ring vs. cell plate) is a frequent plant-vs-animal comparison question, always traceable to the presence/absence of a rigid cell wall.

## Visual Reference

**Interactive**

- A side-by-side mitosis/meiosis chromosome tracker: step through each stage of both processes simultaneously with a small set of labelled chromosomes, highlighting at each step whether sister chromatids or homologous chromosomes are the unit currently separating.

{{< iframe src="/mitosis-meiosis-chromosome-tracker.html" title="Mitosis/Meiosis Chromosome Tracker" height="420px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A cell entering mitosis has a mutation that prevents kinetochore-microtubule attachments from being properly sensed by the spindle assembly checkpoint. Predict the most likely immediate consequence for the resulting daughter cells.

<details>
<summary>Show answer</summary>

Anaphase can proceed even with improperly or unattached kinetochores, risking unequal chromosome segregation (aneuploidy) in the resulting daughter cells — one daughter may receive an extra chromosome copy, the other may be missing one, since the checkpoint that would normally halt the cycle until every chromosome is correctly bi-oriented has been disabled.
</details>

**2.** A student states "meiosis I separates sister chromatids, and meiosis II separates homologous chromosomes." Correct this statement, and explain the consequence of this mix-up for predicting genetic outcomes.

**3.** Explain, mechanistically, why plant cells cannot use an actin-myosin contractile ring for cytokinesis the way animal cells do, and describe the structural alternative plant cells use instead.
