---
title: "Chromosomal Variation: Number & Structure"
weight: 7
description: "Variation in chromosome number (aneuploidy from nondisjunction, polyploidy) and chromosome structure (deletions, duplications, inversions, translocations), and the genetic consequences each type of variation produces."
difficulty: "intermediate"
prerequisites: ["Linkage-Recombination-Genetic-Mapping"]
syllabus_tags: ["IBO", "USABO", "genetics", "chromosomal-genetics"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

The previous page covered how genes are inherited *along* a normal chromosome complement. This page covers what happens when the chromosome complement itself is abnormal, either in **number** (too many or too few whole chromosomes or chromosome sets) or in **structure** (a chromosome missing, duplicating, or rearranging part of its own sequence). Both categories of variation are visualized directly by karyotyping (see [Pedigree Analysis & Human Genetic Disorders](../pedigree-analysis-human-genetic-disorders/)) and both trace back mechanistically to errors during meiosis or mitosis (see [Cell Cycle, Mitosis & Meiosis](/resources/1-cell-molecular/cell-cycle-mitosis-meiosis/)); this page covers the genetic classification and consequences of each error type, not the cell-cycle machinery itself.

## Key Concepts

### Nondisjunction and aneuploidy

**Nondisjunction** is the failure of homologous chromosomes (at meiosis I) or sister chromatids (at meiosis II, or in mitosis) to separate properly, producing gametes (or daughter cells) with one extra or one missing chromosome. When such a gamete is fertilized by a normal gamete, the result is **aneuploidy**: a chromosome number that is not an exact multiple of the haploid set:

- **Trisomy** (2n+1): three copies of one chromosome. **Trisomy 21 (Down syndrome)** is the most common human survivable autosomal trisomy; trisomies of most other autosomes are lethal prenatally, reflecting the severe dosage imbalance of having 50% more product from an entire chromosome's worth of genes.
- **Monosomy** (2n−1): one copy of a chromosome instead of two. Autosomal monosomies are uniformly lethal in humans; **Turner syndrome (45, X)**, a monosomy of the X chromosome, is the only human monosomy compatible with survival, reflecting the relatively small number of X-linked genes without a Y counterpart (and X-inactivation already buffering normal XX cells against a full second X-dose).

![Human karyotype (47, XY, +21): all 22 autosome pairs plus X and Y, with three copies of chromosome 21 instead of two, confirming trisomy 21 / Down syndrome.](/GENETICSPICS/trisomy-21-down-syndrome-karyotype.jpg)
*Source: wellcomecollection.org*

![Normal spermatogenesis and oogenesis: a spermatogonium/oogonium progresses through growth, meiosis I, and meiosis II to produce four normal spermatozoa or one normal ovum plus polar bodies.](/GENETICSPICS/nondisjunction-meiosis-i-vs-meiosis-ii-comparison.webp)
*Source: researchgate.net ("Normal disjunction in meiosis I and meiosis II")*

Nondisjunction at meiosis I affects an entire chromosome pair (producing gametes with two copies or zero copies of both homologs); nondisjunction at meiosis II (or mitosis) affects only sister chromatids, so it can produce a gamete with two copies of the *same* chromatid, distinguishable in principle by which specific alleles show up as duplicated in the resulting aneuploid individual.

### Polyploidy

**Polyploidy** is possessing more than two complete haploid chromosome sets (3n, 4n, etc.), distinct from aneuploidy (an abnormal count of just *one* chromosome type). Polyploidy is common and often non-lethal (even agriculturally desirable) in plants, but is essentially always lethal in animals:

- **Autopolyploidy**: extra chromosome sets derived from a *single* species, typically via nondisjunction of an entire chromosome set (all chromosomes fail to separate at once) rather than a single pair.
- **Allopolyploidy**: chromosome sets derived from **hybridization between two different species**, followed by chromosome doubling; this restores fertility to an otherwise sterile interspecific hybrid, since doubling gives every chromosome a homologous partner to pair with at meiosis. Bread wheat (*Triticum aestivum*, hexaploid, derived from three ancestral species) is a standard example.

### Chromosomal structural aberrations

Four categories of structural rearrangement, each with distinct genetic consequences:

- **Deletion**: a chromosome segment is lost. Consequences scale with size: a large deletion is typically lethal (loss of many essential genes); a smaller deletion can **unmask a recessive allele** on the homologous chromosome by removing its only functional counterpart, a phenomenon called **pseudodominance**.
- **Duplication**: a chromosome segment is present in extra copy. Beyond direct dosage effects, duplications are evolutionarily significant as a source of raw material for new gene function: a duplicated gene copy is free to accumulate mutations and potentially evolve a new function while the original copy continues performing the ancestral role.
- **Inversion**: a chromosome segment is excised, flipped 180°, and reinserted in the same location. Inversions do not change gene *content*, only gene *order and orientation*, but they severely suppress observed recombination in heterozygotes (an inversion heterozygote's homologs must form an **inversion loop** to pair during meiosis I, and any crossover within the loop produces unbalanced, typically inviable gametes). This is a distinct, structural mechanism for suppressing recombination, separate from the physical-distance-based mechanism covered in [Linkage, Recombination & Genetic Mapping](../linkage-recombination-genetic-mapping/).
- **Translocation**: a segment moves from one chromosome to a different, non-homologous chromosome. A **reciprocal translocation** (segments swapped between two chromosomes) can be genetically **balanced** (no net gene loss, carrier is phenotypically normal) but still produces a high rate of unbalanced, often inviable gametes at meiosis, since the translocated chromosomes must pair in a cross-shaped quadrivalent configuration that frequently segregates unevenly — a common cause of recurrent miscarriage in otherwise healthy carrier couples.

![The five structural chromosome changes compared against a normal reference sequence (A-H): deletion (a segment lost), duplication (a segment repeated), inversion (a segment reversed in place), translocation (a segment moved to a different chromosome), and insertion (a segment gained from elsewhere).](/GENETICSPICS/chromosomal-deletion-duplication-diagram.webp)
*Source: shutterstock.com*

![Two side-by-side diagrams: (a) Inversion, showing a chromosome segment excised, flipped, and reinserted; (b) Reciprocal Translocation, showing segments exchanged between two non-homologous chromosomes with no net gain or loss of genetic material.](/GENETICSPICS/translocation-inversion-chromosome-structure-diagram.jpg)
*Source: biol1113temp.pressbooks.tru.ca (OpenStax-derived)*

![Pericentric inversion pairing at meiosis: a normal chromosome and its pericentric-inversion homolog form a loop to pair; a crossover within the loop produces duplicate/deletion (unbalanced) products, distinct from the balanced, simply-rearranged products of a crossover outside the loop.](/GENETICSPICS/inversion-loop-meiotic-pairing-diagram.png)
*Source: bio.libretexts.org*

## Comparative Structures

| Variation type | What changes | Typical consequence | Example |
|---|---|---|---|
| Trisomy (2n+1) | One extra chromosome | Often lethal; Down syndrome survivable | Trisomy 21 |
| Monosomy (2n−1) | One missing chromosome | Usually lethal; Turner syndrome (X) survivable | 45, X |
| Autopolyploidy | Extra whole set(s), one species | Common/viable in plants, lethal in animals | Triploid seedless watermelon |
| Allopolyploidy | Extra whole set(s), hybrid origin | Restores hybrid fertility | Bread wheat |
| Deletion | Segment lost | Pseudodominance; often lethal if large | Cri-du-chat syndrome |
| Duplication | Segment doubled | Raw material for new gene function | Globin gene family |
| Inversion | Segment reversed in place | Suppresses recombination in heterozygotes | *Drosophila* balancer chromosomes |
| Translocation | Segment moved to non-homolog | Balanced carriers, unbalanced gametes | Some recurrent-miscarriage cases |

## Common Exam Questions

- "Why is Down syndrome survivable but most other autosomal trisomies are not?" The expected answer references chromosome 21's comparatively small gene content, minimizing the total dosage imbalance relative to a trisomy of a much larger, gene-dense chromosome.
- Distinguishing **aneuploidy** (abnormal count of *one* chromosome type, from nondisjunction of a single pair) from **polyploidy** (extra *complete sets*, from failure of an entire division) is a frequent classification question — check whether the abnormality affects one chromosome or all of them proportionally.
- "A phenotypically normal individual has recurrent miscarriages" is a classic clinical-genetics scenario pointing toward a **balanced translocation carrier**: the carrier's own chromosome complement has no net gene loss, but a large fraction of their gametes are chromosomally unbalanced.
- Pseudodominance (a recessive phenotype appearing in a heterozygote) should prompt consideration of a **deletion** on the other homolog unmasking the recessive allele, not a spontaneous new dominant mutation.

## Visual Reference

**Interactive**

- A nondisjunction simulator: toggle nondisjunction at meiosis I vs. meiosis II and watch which resulting gametes carry two, one, or zero copies of the affected chromosome, and whether the extra/missing copy is of two different homologs or two identical sister chromatids.

{{< iframe src="/nondisjunction-simulator.html" title="Nondisjunction simulator" height="380px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. One gap remains open: a diagram specifically showing the abnormal gamete chromosome counts produced by nondisjunction at MI vs. MII — see the inline note above.)*

## Practice Problems

**1.** A couple experiences three consecutive first-trimester miscarriages despite both partners being phenotypically normal. Karyotyping reveals that one partner carries a balanced reciprocal translocation between chromosomes 5 and 14. Explain how a "balanced" chromosomal rearrangement in a phenotypically normal parent can cause recurrent pregnancy loss.

<details>
<summary>Show answer</summary>

A balanced translocation carrier has no net loss or gain of genetic material (all the necessary genes are present, just rearranged between chromosome 5 and chromosome 14), so the carrier is phenotypically normal. However, at meiosis, the translocated chromosomes and their normal homologs must pair in a four-way (quadrivalent) configuration, and depending on how this configuration segregates at anaphase I, a large proportion of the resulting gametes receive an **unbalanced** combination (extra copies of some segments, missing copies of others). Fertilization by an unbalanced gamete produces an embryo with a genuine dosage imbalance, which is frequently lethal early in development, producing the pattern of recurrent miscarriage despite both parents being individually healthy.
</details>

**2.** A plant breeder crosses two different diploid species to produce a sterile interspecific hybrid, then treats the hybrid with a chemical that induces chromosome doubling. Explain why the resulting polyploid is fertile when the original hybrid was not, and name this type of polyploidy.

**3.** A geneticist observes a recessive phenotype in an individual who, based on both parents' genotypes, should be heterozygous (and therefore phenotypically unaffected) for that gene. Karyotyping reveals a small deletion on one homolog spanning the gene in question. Explain this result using the concept of pseudodominance.
