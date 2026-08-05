---
title: "Gene Interactions: Epistasis & Complementation Analysis"
weight: 3
description: "How two different genes can interact to modify the standard 9:3:3:1 dihybrid ratio into recognizable variants (epistasis), and the complementation test geneticists use to determine whether two independently isolated mutations affecting the same trait lie in the same gene or different genes."
difficulty: "intermediate"
prerequisites: ["Extensions-of-Mendelian-Inheritance"]
syllabus_tags: ["IBO", "USABO", "genetics", "transmission-genetics"]
---

{{< topic-meta >}}

## Overview

[Extensions of Mendelian Inheritance](../extensions-of-mendelian-inheritance/) covered how a *single* gene's genotype-to-phenotype mapping can be more complex than simple dominance. This page covers what happens when **two different genes interact** to jointly control *one* trait — the allele at one locus can mask, modify, or depend on the allele at a second, unlinked locus, producing dihybrid ratios that are recognizable variants of 9:3:3:1 rather than the ratio itself. It also covers **complementation analysis**, the classical genetic technique for determining whether two independently isolated mutants with the same phenotype are broken in the *same* gene or in *different* genes — answerable without any molecular sequencing at all.

## Key Concepts

### Epistasis: one gene masking another

**Epistasis** is when the phenotypic expression of one gene (the *hypostatic* gene) depends on the genotype at a second, independently assorting gene (the *epistatic* gene) — distinct from dominance, which describes the relationship between two alleles of the *same* gene. Because epistasis modifies which phenotypic classes are actually distinguishable, it collapses some of the four standard dihybrid phenotype classes together, producing a smaller number of recognizable, non-9:3:3:1 ratios that always sum to 16 parts (reflecting the same underlying AaBb × AaBb cross).

### Recessive epistasis (9:3:4)

In **recessive epistasis**, being homozygous recessive at the epistatic locus masks the phenotype of the second gene entirely, regardless of what allele is present there. **Labrador retriever coat color** is the standard example: the *B* gene determines black (B_) vs. brown/chocolate (bb) pigment, but the *E* gene controls whether pigment is deposited in the coat at all — *ee* individuals are yellow regardless of their B genotype, since no pigment reaches the coat. A B_E_ × BbEe-type dihybrid cross yields **9 black : 3 chocolate : 4 yellow** (the 3 bbee and 1 ... wait — more precisely: 9 B_E_ black, 3 bbE_ chocolate, and the 3 B_ee + 1 bbee classes merge into 4 yellow, since *ee* masks B genotype either way).

![Mouse recessive-epistasis cross (AaCc × AaCc): the 16-box F2 grid recolors into agouti, black, and albino coats, producing a 9:3:4 ratio (agouti 9/16, black 3/16, albino 4/16).](/GENETICSPICS/mouse-coat-color-recessive-epistasis-9-3-4.jpg)
*Source: opened.cuny.edu — file originally sourced under a "lethal-allele" filename but actually depicts an unrelated recessive-epistasis cross — confirm licensing basis before public deployment. Note: this uses mice (A gene = agouti/non-agouti, C gene = pigment/albino) rather than Labrador retrievers, but is the same 9:3:4 recessive-epistasis logic the text describes (one gene masking pigment deposition entirely). No Labrador-specific image has been sourced yet.*

### Dominant epistasis (12:3:1)

In **dominant epistasis**, a single dominant allele at the epistatic locus is sufficient to mask the second gene's phenotype. Summer squash fruit color is the standard example: a dominant allele at one locus (W_) produces white fruit regardless of the second gene's genotype; only ww individuals show the second gene's colors (yellow Y_ vs. green yy). This merges the two "W_" classes (9 + 3 = 12) while leaving the ww classes distinguishable, producing **12 white : 3 yellow : 1 green**.

![Dominant epistasis cross (AaBb × AaBb): the 16-box F2 grid shows the two "A_" classes merging into 12 white, with the aa classes splitting into 3 yellow (aaB_) and 1 green (aabb).](/GENETICSPICS/summer-squash-dominant-epistasis-12-3-1.jpg)
*Source: study.com — confirm licensing basis before public deployment. Note: uses generic A/B gene labels and gourd icons rather than being explicitly labeled "summer squash," but the 12:3:1 dominant-epistasis logic matches the text exactly.*

### Duplicate recessive epistasis (9:7) and duplicate genes (15:1)

- **Duplicate recessive epistasis (9:7)**: two genes act in the *same* biochemical pathway such that a dominant allele at *both* loci is required to produce the phenotype (e.g. pigment synthesis requiring two sequential enzymatic steps, each encoded by a different gene) — only the 9 A_B_ class shows the phenotype; all three recessive-containing classes (3+3+1 = 7) look alike. Sweet pea flower color (purple only when both C and P genes have a dominant allele) is the classic example.

![Sweet pea "complementary genes" cross: two different white varieties (CCpp × ccPP) cross to an all-purple F1 (CcPp), which self-fertilizes into a 16-box F2 grid summarized as 9 C_P_ purple : 7 white (3 C_pp + 3 ccP_ + 1 ccpp).](/GENETICSPICS/sweet-pea-duplicate-recessive-epistasis-9-7.png)
*Source: majordifferences.com — file originally sourced under a "Labrador coat color" filename but actually depicts this sweet-pea cross — confirm licensing basis before public deployment. This is the exact classic example the text names.*

![A second duplicate-recessive-epistasis example: albino aaBB × AAbb parents cross to a pigmented F1 (AaBb), which intercrosses into F2 classes of 9/16 pigmented (A_B_) and 7/16 albino (3/16 aaB_ + 3/16 A_bb + 1/16 aabb).](/GENETICSPICS/duplicate-recessive-epistasis-pigment-pathway-9-7.png)
*Source: triyambak.org — confirm licensing basis before public deployment. Note: a generic two-step pigment-pathway example (different letters, same 9:7 logic as the sweet-pea diagram above) rather than the sweet pea itself; included alongside it as a second worked example of the same pattern.*
- **Duplicate gene action (15:1)**: two genes each independently and redundantly produce the *same* phenotype, such that a dominant allele at *either* locus is sufficient — only the fully double-recessive class (aabb) shows the alternate phenotype, giving 15:1.

Recognizing which non-standard ratio a dataset matches — and reconstructing the underlying pathway logic that would produce it — is the core applied skill this section builds toward.

### Complementation analysis: same gene or different genes?

Given two independently isolated recessive mutants with the *same* phenotype (e.g. two different white-eyed fly mutant strains), a geneticist cannot tell from phenotype alone whether the mutations are in the same gene or in different genes. The **complementation test** resolves this directly: cross the two mutant strains and examine the F1.

- If the F1 phenotype is **wild-type (complementation occurs)**: the two mutations are most likely in **different genes** — each parental chromosome supplies a functional copy of the gene the other parent's chromosome is broken in, so the F1 is functionally heterozygous at both loci and wild-type at each.
- If the F1 phenotype is **still mutant (no complementation, failure to complement)**: the two mutations are most likely **allelic** — in the **same gene** — since no chromosome in the F1 carries a fully functional copy of that gene.

This logic assumes both mutations are recessive to wild-type and that the genes involved are not themselves interacting epistatically in a way that could produce a false result — a caveat worth stating explicitly on an exam. Mutations that fail to complement each other define a **complementation group**, which is operationally equivalent to "one gene" — this is precisely how many genes were first identified and counted, long before any DNA sequencing was possible.

![Differential complementation diagram: wild-type and mutant tester strains crossed against wild-type and mutant experimental strains, showing which F1 hybrid combinations complement (functionally restore wild-type) versus fail to complement (≠), the diagnostic for whether two mutations lie in the same gene.](/GENETICSPICS/complementation-test-diagram-wild-type-vs-mutant-f1.webp)
*Source: researchgate.net ("Quantitative hybrid complementation test") — confirm licensing basis before public deployment.*

## Comparative Structures

| Interaction type | Underlying logic | Resulting F2 ratio | Classic example |
|---|---|---|---|
| No epistasis (independent genes) | Two genes act on separate traits | 9:3:3:1 | Pea shape × color |
| Recessive epistasis | Homozygous recessive at gene 1 masks gene 2 | 9:3:4 | Labrador coat color |
| Dominant epistasis | One dominant allele at gene 1 masks gene 2 | 12:3:1 | Summer squash color |
| Duplicate recessive epistasis | Both genes need a dominant allele for the phenotype | 9:7 | Sweet pea flower color |
| Duplicate gene action | Either gene's dominant allele alone is sufficient | 15:1 | Redundant pigment genes |

| Complementation test outcome | Interpretation |
|---|---|
| F1 is wild-type | Mutations complement — likely different genes |
| F1 is mutant | Mutations fail to complement — likely the same gene |

## Common Exam Questions

- Given an unfamiliar F2 ratio that sums to 16, the expected approach is to identify which of the five patterns above it matches, then reconstruct the underlying pathway logic (how many gene products are needed, and in what combination) — not to memorize the ratio as an isolated fact.
- "Distinguish epistasis from dominance" — dominance describes the relationship between two *alleles of the same gene*; epistasis describes the relationship between two *different genes* affecting the same trait. This distinction is one of the most frequently confused pairs in transmission genetics.
- "Two recessive mutants fail to complement — does this prove they're the same gene?" — the expected nuanced answer is that failure to complement is *strong evidence for*, not absolute proof of, allelism; intragenic complementation (rare, in multimeric proteins) and true epistasis between very tightly linked genes can occasionally produce misleading results, worth mentioning for a complete answer.
- Questions describing a coat-color, flower-color, or similar pigment-pathway cross with a non-9:3:3:1 ratio are testing pattern recognition against the five ratios above — always confirm the ratio sums to 16 before matching it to a pattern.

## Visual Reference

**Interactive**

- An epistasis ratio explorer: choose an interaction type (recessive/dominant/duplicate epistasis, duplicate genes) and see the 16-box dihybrid grid recolor to show which classes merge and the resulting simplified ratio.

{{< iframe src="/epistasis-ratio-explorer.html" title="Epistasis ratio explorer" height="560px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Note: the recessive-epistasis image uses mice rather than Labrador retrievers specifically — see the inline note above.)*

## Practice Problems

**1.** A cross between two purple-flowered sweet pea plants (each heterozygous CcPp) produces 320 offspring: 180 purple, 140 white. Identify the type of gene interaction at work and confirm the ratio is consistent with it.

<details>
<summary>Show answer</summary>

180:140 simplifies to approximately 9:7 (180/320 = 0.5625 ≈ 9/16; 140/320 = 0.4375 ≈ 7/16), which matches **duplicate recessive epistasis**: both the C and P genes must have at least one dominant allele for pigment to be produced (a two-step biosynthetic pathway), so the 9 C_P_ class is purple and the remaining 7 parts (3 ccP_ + 3 C_pp + 1 ccpp) are all white, since a defect at either step blocks the pathway.
</details>

**2.** Two independently isolated recessive petite (small-colony) yeast mutants are crossed. The resulting diploid is phenotypically wild-type (normal colony size). What does this result indicate about the two mutations, and what experiment would you have expected if the diploid had instead been petite?

**3.** A cross between two black-coated Labrador retrievers (each BbEe) produces a litter with the following phenotypes: 9 black, 3 chocolate, 4 yellow. A researcher claims this result is inconsistent with recessive epistasis because it doesn't match "9:3:3:1." Evaluate this claim.
