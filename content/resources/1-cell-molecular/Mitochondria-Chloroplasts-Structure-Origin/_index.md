---
title: "Mitochondria & Chloroplasts: Structure & Endosymbiotic Origin"
weight: 4
description: "The double-membrane structure of mitochondria and chloroplasts, the evidence for endosymbiotic origin, and why these two organelles are structural exceptions to the rest of the endomembrane system."
difficulty: "intermediate"
prerequisites: ["Endomembrane-System-Protein-Trafficking"]
syllabus_tags: ["IBO", "USABO", "cell-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

**Scope note**: this page covers mitochondrial and chloroplast *structure* and their shared evolutionary origin. The biochemistry each organelle actually performs is covered elsewhere and not duplicated here: oxidative phosphorylation's mechanism is in [Bioenergetics & Central Metabolism Overview](../bioenergetics-central-metabolism/), and photosynthetic light reactions/Calvin cycle biochemistry is fully covered in Plant Physiology's [Light Reactions & Photophosphorylation](/resources/5-plant-physiology/light-reactions-photophosphorylation/) and [Calvin Cycle, Photorespiration & C4/CAM Biochemistry](/resources/5-plant-physiology/calvin-cycle-photorespiration-c4-cam/) pages.

## Key Concepts

### Why these two organelles are structural exceptions

Every other organelle covered in [Endomembrane System & Protein Trafficking](../endomembrane-system-protein-trafficking/) is either single-membrane or arose via vesicular budding from the ER/Golgi pathway. Mitochondria and chloroplasts break this pattern entirely: both are bound by **two** membranes (not one), both contain their **own circular DNA genome** distinct from the nuclear genome, both retain their **own 70S ribosomes** (matching bacterial, not cytoplasmic 80S, ribosomes, see [Cell Theory, Prokaryotes & Eukaryotes](../cell-theory-prokaryotes-eukaryotes/)), and both replicate by **binary fission**, independently of the cell cycle that governs nuclear division. None of this fits the ER/Golgi-derived vesicular model: because these two organelles did not arise that way.

### The endosymbiotic theory

The **endosymbiotic theory** (most associated with Lynn Margulis) proposes that mitochondria and chloroplasts originated as free-living prokaryotes engulfed by a host cell in an ancient endocytic event, which, rather than being digested, survived as a stable intracellular symbiont and was retained across subsequent generations, eventually losing its independence and becoming an obligate organelle.

Evidence supporting this theory, and why each piece of evidence specifically supports an *endosymbiotic* rather than an internally-evolved origin:

- **Double membrane**: the inner membrane is interpreted as the original bacterial plasma membrane; the outer membrane as derived from the host's engulfing endocytic membrane: exactly the two-membrane signature expected from an engulfment event, and not easily explained by internal budding from a single-membrane precursor.
- **Own circular genome**: bacterial-style circular DNA, distinct from and much smaller than the nuclear genome, consistent with a once-independent bacterial chromosome, most of whose genes have since been lost or transferred to the nuclear genome over evolutionary time (endosymbiotic gene transfer).
- **Own 70S ribosomes**: matching bacterial ribosome size, not the 80S cytoplasmic ribosome of the host eukaryotic lineage: a strong molecular fingerprint of bacterial ancestry, since ribosome size is a deeply conserved trait not easily convergent.
- **Binary fission, independent of the cell cycle**: mitochondria and chloroplasts divide by a bacterial-style fission mechanism (involving an FtsZ-related protein, homologous to the bacterial division protein) on their own schedule, rather than being newly synthesised each cell cycle the way other organelles are — behaviour expected of a formerly independent organism, not an internally derived compartment.
- **Sequence homology**: mitochondrial and chloroplast genes/rRNA sequences show closer phylogenetic relationship to specific bacterial lineages (α-proteobacteria for mitochondria, cyanobacteria for chloroplasts) than to the eukaryotic nuclear genome — direct molecular phylogenetic evidence, and the single strongest line of evidence overall.

![Primary vs. secondary endosymbiosis: primary endosymbiosis shows an ancestral host cell engulfing a mitochondrion-precursor, then a cyanobacterium, producing a photosynthetic eukaryote with a double-membrane chloroplast; secondary endosymbiosis shows a different ancestral host cell engulfing that entire photosynthetic eukaryote (alga), producing a chloroplast with four membranes and a residual nucleomorph](/MCBBPICS/endosymbiotic-engulfment-comparison.jpg)
*Source: ScienceDirect Topics ("endosymbiosis")*

### Mitochondria: structure

The mitochondrial **outer membrane** is smooth and relatively permeable (contains porins allowing free passage of small molecules); the **inner membrane** is highly folded into **cristae**, dramatically increasing surface area for the electron transport chain complexes and ATP synthase embedded within it (see [Bioenergetics & Central Metabolism Overview](../bioenergetics-central-metabolism/) for the chemistry these structures perform). The **intermembrane space** (between the two membranes) is where the proton gradient driving ATP synthase is built; the **matrix** (enclosed by the inner membrane) contains the mitochondrial genome, ribosomes, and the enzymes of the TCA cycle.

![Mitochondrion cutaway: outer membrane with porins, folded inner membrane (cristae, further split into inner boundary membrane and cristal membrane), intermembrane space (intracristal and peripheral space), matrix, matrix granules, mitochondrial DNA, and ribosomes all labelled](/MCBBPICS/mitochondrion-cutaway-diagram.jpg)
*Source: en.wikipedia.org (Mitochondrial matrix)*

### Chloroplasts: structure

Chloroplasts share the double-membrane, own-genome, own-ribosome pattern, but add a third internal membrane system: **thylakoids**, flattened membrane sacs (often stacked into **grana**) suspended in the **stroma** (the chloroplast's matrix-equivalent compartment). The thylakoid membrane houses the light-reaction machinery (photosystems, electron transport chain, ATP synthase): directly analogous in mechanism to the mitochondrial inner membrane's ETC/ATP synthase, but running in the reverse net direction (building reducing power and ATP from light energy, rather than from stored chemical bond energy). The stroma houses the Calvin cycle enzymes. Both the thylakoid-vs-cristae membrane elaboration and the parallel “membrane houses electron transport chain, matrix/stroma houses the cycle” organisation are a direct structural echo of each other, consistent with both organelles having converged on the same chemiosmotic strategy independently from their respective free-living bacterial ancestors.

![Chloroplast cutaway: outer and inner chloroplast envelope membranes, stroma, granal and stromal thylakoids (lamellae/frets) forming a granum stack, thylakoid membrane and thylakoid space (lumen), nucleoid (DNA rings), ribosomes, plastoglobuli, and a starch granule all labelled](/MCBBPICS/chloroplast-cutaway-diagram.svg)
*Source: en.wikipedia.org (Thylakoid)*

### Semi-autonomy, not full independence

Despite retaining their own genome, neither organelle is genetically self-sufficient: the large majority of proteins actually functioning inside mitochondria and chloroplasts today are encoded by the **nuclear** genome, synthesised on cytoplasmic 80S ribosomes, and imported post-translationally via dedicated protein-import machinery (translocase complexes in the outer and inner membranes) — a consequence of **endosymbiotic gene transfer**, the gradual evolutionary migration of genes from the original bacterial genome into the host nuclear genome over the (roughly) 1.5–2 billion years since the original endosymbiotic events. This is why both organelles are described as **semi-autonomous**: genetically active but no longer independent, dependent on nuclear-encoded, cytoplasmically-synthesised, imported proteins to build most of their own machinery.

## Comparative Structures

| Feature | Mitochondria | Chloroplasts |
|---|---|---|
| Membranes | 2 (outer, inner) | 2 (outer, inner) + internal thylakoid system |
| Inner membrane folding | Cristae | Thylakoids (often stacked as grana) |
| Matrix-equivalent compartment | Matrix (TCA cycle) | Stroma (Calvin cycle) |
| Genome | Circular, bacterial-style | Circular, bacterial-style |
| Ribosome | 70S | 70S |
| Proposed bacterial ancestor | α-proteobacteria | Cyanobacteria |
| Net energy conversion | Chemical (organic fuel) → ATP | Light → chemical (ATP, NADPH, then sugar) |

## Common Exam Questions

- "List the evidence for endosymbiotic origin": a complete answer names *multiple independent lines* of evidence (double membrane, own genome, own ribosomes, independent binary fission, sequence phylogeny), not just one; partial-credit answers that name only "they have their own DNA" miss most of the available evidence.
- "Why do mitochondria/chloroplasts have a double membrane specifically?" — the inner membrane is the original bacterial plasma membrane; the outer is derived from the host's engulfing membrane during the original endocytic event.
- "Are mitochondria/chloroplasts fully autonomous?" — no; the correct nuanced answer (semi-autonomous) requires knowing that most organellar proteins are actually nuclear-encoded and imported, despite the organelle retaining its own genome and translation machinery.

## Visual Reference

**Interactive**

- An endosymbiosis evidence checklist: click each line of evidence (double membrane, own genome, 70S ribosomes, binary fission, sequence homology) to reveal why it specifically supports endosymbiotic rather than internal origin, reinforcing that this is a multi-line argument, not a single fact.

{{< iframe src="/endosymbiosis-evidence-checklist.html" title="Endosymbiosis Evidence Checklist" height="480px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A researcher sequences the genome of a newly discovered intracellular structure in a protist and finds it to be circular, bacterial-style DNA with strong sequence similarity to a specific cyanobacterial lineage. What is the most likely identity and evolutionary origin of this structure?

<details>
<summary>Show answer</summary>

Most likely a chloroplast (or chloroplast-derived plastid), of endosymbiotic origin from a cyanobacterial ancestor. Circular bacterial-style DNA with cyanobacterial sequence similarity is the direct molecular phylogenetic signature expected of a chloroplast, distinguishing it from a mitochondrion (which would instead show α-proteobacterial similarity) or a non-endosymbiotic organelle (which would show no bacterial sequence relationship at all).
</details>

**2.** Explain why the statement "mitochondria are fully independent, self-sufficient organisms living inside the cell" is inaccurate, using the concept of endosymbiotic gene transfer.

**3.** Both mitochondrial cristae and chloroplast thylakoids dramatically increase internal membrane surface area relative to a smooth, unfolded membrane. Explain why this structural strategy is functionally important for both organelles, referencing what is embedded in each membrane.
