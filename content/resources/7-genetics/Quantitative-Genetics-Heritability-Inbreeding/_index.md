---
title: "Quantitative Genetics, Heritability & Inbreeding"
weight: 9
description: "How many genes acting together produce continuously varying (polygenic) traits, how heritability partitions phenotypic variance into genetic and environmental components, and how non-random mating — specifically inbreeding — changes genotype frequencies at a locus without any change in allele frequency at all."
difficulty: "advanced"
prerequisites: ["Extranuclear-Non-Mendelian-Inheritance"]
syllabus_tags: ["IBO", "USABO", "genetics", "quantitative-genetics"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Every trait covered so far has been **discrete** — round or wrinkled, purple or white, affected or unaffected. Many real traits (height, skin color, crop yield, milk production) instead vary **continuously** across a population, because they are controlled by many genes of small individual effect rather than one or two genes of large effect. This page covers how such **polygenic** traits are analyzed genetically, how **heritability** partitions observed phenotypic variation into genetic and environmental sources, and — a related but distinct topic — how **non-random mating**, specifically inbreeding, changes the *distribution* of genotypes in a population without changing allele frequencies at all. This last topic deliberately does not re-derive the Hardy-Weinberg framework itself, covered fully in Evolution's [Population Genetics & Hardy-Weinberg Equilibrium](/resources/15-evolution/population-genetics-hardy-weinberg-equilibrium/) — this page covers only the one HWE assumption (random mating) that classical population genetics treats as a simplifying assumption rather than analyzing in depth.

## Key Concepts

### Polygenic inheritance and continuous variation

A **polygenic trait** is controlled by multiple genes, each typically contributing a small, roughly additive effect to the phenotype — as the number of contributing genes increases, the number of possible genotypic classes increases, and their phenotypic distribution increasingly approximates a continuous **normal (bell-curve) distribution** rather than the small number of discrete classes seen in simple Mendelian crosses. A classic illustrative model: for a trait controlled by *n* additive gene pairs, a cross between two individuals heterozygous at all *n* loci produces 2n+1 phenotypic classes in a binomially-distributed ratio — with even a modest number of genes (3-4), the extreme classes become rare enough, and the intermediate classes numerous enough, that the population looks continuously distributed rather than showing distinct classes.

![A three-gene (AaBbCc) cross between pure white (aabbcc) and pure red (AABBCC) corn lines self-fertilizes from the medium-red F1, producing seven phenotypic classes (0 through 6 red-pigment alleles) whose frequencies approximate a bell-curve distribution.](/GENETICSPICS/polygenic-trait-normal-distribution-bell-curve.jpeg)
*Source: mysciencesquad.weebly.com*

### Heritability: partitioning phenotypic variance

**Heritability** asks what fraction of the observed *variation* in a trait across a population is attributable to genetic differences, as opposed to environmental differences — a population-level statistic, not a property of any individual's phenotype. Total phenotypic variance (V_P) is partitioned as:

$$ V_P = V_G + V_E $$

where V_G is genetic variance and V_E is environmental variance (interaction terms are set aside at this level of treatment). **Broad-sense heritability (H²)** is the proportion of phenotypic variance attributable to *all* genetic variance:

$$ H^2 = \frac{V_G}{V_P} $$

**Narrow-sense heritability (h²)**, more useful for predicting a trait's response to selective breeding, further partitions genetic variance into **additive** genetic variance (V_A — the component that breeds true and predicts offspring resemblance to parents) versus dominance and epistatic interaction variance (which do not transmit as reliably to offspring):

{{< eqbox >}}
$$ h^2 = \frac{V_A}{V_P} $$
{{< /eqbox >}}

**Twin studies** are the standard method for estimating heritability in humans, comparing trait concordance between monozygotic twins (identical genotype) and dizygotic twins (share on average 50% of segregating alleles, like ordinary siblings) raised in comparably shared environments — a substantially higher concordance in monozygotic pairs is taken as evidence of a genetic contribution to the trait.

![Components of variance flowchart: phenotypic variance (V_P) splits into genotypic variance (V_G) and environmental variance (V_E); V_G further splits into additive variance (V_A) and non-additive genetic variance, which itself splits into dominance variance (V_D) and interaction/epistatic variance.](/GENETICSPICS/heritability-variance-partitioning-diagram.jpg)
*Source: slideshare.net*

### A critical caveat: heritability is population- and environment-specific

A heritability estimate is **not** a fixed biological constant for a trait — it depends entirely on the specific population and environmental range in which it was measured. In a population raised in a highly uniform environment, V_E shrinks toward zero and heritability rises toward 1, even for a trait that is substantially environmentally malleable in a more variable environment — heritability describes the *current* balance of variance sources in a *specific* study population, not an intrinsic, universal "how genetic is this trait" number. This is among the most commonly misapplied statistics in genetics and is worth stating explicitly as a caveat on any heritability claim.

### QTL mapping

**Quantitative trait locus (QTL) mapping** identifies the approximate chromosomal locations of the individual genes contributing to a polygenic trait, by statistically associating trait values with genetic marker genotypes across a segregating population (e.g. an F2 population from a cross between two strains differing in the trait) — conceptually, this extends the linkage-mapping logic from [Linkage, Recombination & Genetic Mapping](../linkage-recombination-genetic-mapping/) to a continuously varying trait rather than a discrete phenotype, by looking for markers whose genotype correlates statistically with trait value rather than co-segregating with a single discrete phenotype class.

### Non-random mating: inbreeding

The Hardy-Weinberg model assumes **random mating**; **inbreeding** — mating between relatives more often than random-mating expectation predicts — is the most genetically consequential violation of this assumption. Critically, inbreeding by itself **does not change allele frequencies** in a population; it changes the **distribution of genotypes**, systematically increasing the proportion of homozygotes and decreasing the proportion of heterozygotes relative to Hardy-Weinberg expectation, at every locus simultaneously (not just loci under selection).

The **inbreeding coefficient (F)** quantifies the probability that an individual's two alleles at a given locus are **identical by descent** — both copies of the same specific ancestral allele, inherited via two different paths through a pedigree that eventually converge on a common ancestor. F is calculated from a pedigree by summing, over every path connecting the two parents through each common ancestor:

$$ F = \sum \left(\frac{1}{2}\right)^{n} (1 + F_A) $$

where *n* is the number of individuals in each specific path linking the two parents through one common ancestor (inclusive of both parents and the ancestor), and F_A is the inbreeding coefficient of that common ancestor itself (often approximated as 0 if the ancestor's own ancestry is not inbred). For a full-sibling mating, F = 1/4; for a first-cousin mating, F = 1/16.

![Worked pedigree and path diagram: individuals E and F, related through two common ancestors A and B, each connected by a 4-generation path (E-C-A-D-F and E-C-B-D-F); summing (1/2)⁴ for each path gives a_EF = 1/8, and the inbreeding coefficient of their offspring X is F_x = a_EF / 2 = 1/16 — matching the first-cousin-mating value stated in the text.](/GENETICSPICS/inbreeding-coefficient-pedigree-path-diagram.png)
*Source: ihh.kvl.dk*

Inbreeding's genotype-frequency consequence at a single locus: starting from allele frequencies p and q, the expected genotype frequencies become **p² + Fpq** (homozygote AA), **2pq(1−F)** (heterozygote Aa), and **q² + Fpq** (homozygote aa) — visibly reducing to the standard Hardy-Weinberg p²:2pq:q² when F = 0.

![Hardy-Weinberg worked calculation: for allele frequencies p=0.7 and q=0.3, the Punnett-square-style grid gives predicted genotype frequencies YY=p²=0.49, Yy=2pq=0.42, yy=q²=0.09, summing to 1.](/GENETICSPICS/hardy-weinberg-vs-inbred-genotype-frequencies.png)
*Source: bioprinciples.biosci.gatech.edu*

### Inbreeding depression

**Inbreeding depression** is the reduced fitness (survival, fertility, growth) commonly observed in inbred offspring, arising because increased homozygosity raises the chance that **rare, deleterious recessive alleles** — normally masked in the heterozygous state in an outbred population — are exposed in the homozygous state. This is the practical, fitness-level consequence of the purely statistical genotype-frequency shift described above, and the reason natural and captive-breeding-program management alike actively work to avoid close inbreeding in small populations.

### Assortative mating

**Positive assortative mating** (mating between phenotypically similar individuals more often than random) and **negative (disassortative) mating** (mating between dissimilar individuals) are non-random mating patterns based on **phenotype similarity** rather than **relatedness** — a distinct mechanism from inbreeding, worth not conflating on an exam. Positive assortative mating for a specific trait increases homozygosity at the loci controlling *that trait specifically* (similar to inbreeding's effect, but locus-specific rather than genome-wide), without necessarily affecting other, unrelated loci the way true inbreeding (relatedness-based) does across the entire genome simultaneously.

## Comparative Structures

| Concept | What it measures | Key formula/relationship |
|---|---|---|
| Broad-sense heritability (H²) | Fraction of phenotypic variance from all genetic sources | H² = V_G / V_P |
| Narrow-sense heritability (h²) | Fraction of phenotypic variance from additive genetic sources | h² = V_A / V_P |
| Inbreeding coefficient (F) | Probability of identity by descent at a locus | Genotypes: p²+Fpq : 2pq(1−F) : q²+Fpq |

| Non-random mating type | Basis | Genome-wide or locus-specific? |
|---|---|---|
| Inbreeding | Relatedness (identity by descent) | Genome-wide, every locus simultaneously |
| Positive assortative mating | Phenotypic similarity | Locus-specific, only loci controlling the matched trait |

## Common Exam Questions

- "Inbreeding changes allele frequencies" is a frequent misstatement to correct explicitly — inbreeding changes **genotype** frequencies (more homozygotes, fewer heterozygotes) while leaving **allele** frequencies exactly unchanged; only processes like selection, drift, mutation, and gene flow change allele frequencies (see [Genetic Drift, Gene Flow & Mutation](/resources/15-evolution/genetic-drift-gene-flow-and-mutation/)).
- "A heritability of 0.8 means the trait is 80% genetically determined in every individual" is a near-universal misinterpretation to correct directly — heritability is a population-level statistic about the *proportion of variance* explained by genetic differences in one specific population/environment, not a per-individual "percent genetic" figure, and it can differ substantially between populations or environments for the identical trait.
- Distinguishing broad-sense (H², all genetic variance) from narrow-sense (h², additive variance only) heritability is a common conceptual question, particularly in the context of predicting a trait's response to artificial selection, which depends specifically on the **additive** component.
- Calculating F from a simple pedigree (full-sib = 1/4, half-sib = 1/8, first-cousin = 1/16) is a frequent numeric question — always count every distinct path through every common ancestor, since a pedigree with more than one common ancestor requires summing multiple path contributions.

## Visual Reference

**Interactive**

- A polygenic trait distribution simulator: adjust the number of contributing gene pairs and watch the F2 phenotype distribution shift from a few discrete classes toward a smooth, continuous bell curve.

{{< iframe src="/polygenic-distribution-simulator.html" title="Polygenic trait distribution simulator" height="500px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. One item is only partially fulfilled: the Hardy-Weinberg-vs-inbred genotype-frequency comparison shows the HWE baseline only, not the inbred-population contrast — see the inline note above.)*

## Practice Problems

**1.** Two individuals are the offspring of a mating between full siblings. Using the inbreeding coefficient formula, confirm that F = 1/4 for full-sibling mating, and explain in words what this coefficient represents.

<details>
<summary>Show answer</summary>

Full siblings share two common ancestors (both parents). For each common ancestor, the path connecting the two full-sib parents through that ancestor includes 3 individuals (parent 1 → common ancestor → parent 2), so each path contributes (1/2)³ = 1/8 (assuming the common ancestors are themselves non-inbred, F_A = 0). Summing over both common ancestors: 1/8 + 1/8 = **1/4**. This F = 1/4 represents the probability that, at any given locus, the offspring of this sibling mating inherited two alleles that are identical by descent — i.e., both literal copies of the same single allele carried by one of the shared grandparents, rather than two independently-inherited alleles that merely happen to look alike.
</details>

**2.** A dog breeder measures shoulder height in two different kennel populations of the same breed. In Population 1 (raised under highly standardized diet and exercise conditions), the estimated heritability of shoulder height is 0.85. In Population 2 (raised under widely varying diet and exercise conditions), the estimated heritability for the same trait is 0.40. Explain how the same trait, in the same breed, can show such different heritability estimates.

**3.** A conservation program managing a small captive population of an endangered species notices declining litter sizes and increased juvenile mortality across several generations, despite no new mutations or disease outbreaks being detected. Propose the most likely explanation, and describe one breeding-program strategy that would directly address it.
