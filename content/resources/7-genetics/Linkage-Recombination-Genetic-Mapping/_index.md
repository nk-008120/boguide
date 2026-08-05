---
title: "Linkage, Recombination & Genetic Mapping"
weight: 6
description: "The genetic consequences of crossing over — how linked genes deviate from independent assortment, how recombination frequency is calculated from testcross data and converted into a genetic map, and the three-point testcross method used to order three linked genes and detect double crossovers."
difficulty: "advanced"
prerequisites: ["Sex-Determination-Sex-Linked-Inheritance"]
syllabus_tags: ["IBO", "USABO", "genetics", "chromosomal-genetics"]
---

{{< topic-meta >}}

## Overview

[Mendel's Laws & Probability in Genetics](../mendelian-inheritance-probability/) introduced independent assortment as a consequence of different gene pairs sitting on different homologous chromosome pairs. Genes that sit on the **same** chromosome do not assort independently — they are **linked**, and tend to be inherited together, except when **crossing over** during meiosis I physically exchanges segments between homologous chromosomes (see [Cell Cycle, Mitosis & Meiosis](/resources/1-cell-molecular/cell-cycle-mitosis-meiosis/) for the mechanistic event itself — the chiasma formed during prophase I). This page covers the *genetic consequences* of that mechanism: how linkage is detected from cross data, how the frequency of recombination is used to measure genetic distance, and how three linked genes can be ordered along a chromosome from a single testcross.

## Key Concepts

### Recognizing linkage: deviation from the 1:1:1:1 testcross expectation

For two genes assorting independently, a **dihybrid testcross** (AaBb × aabb) produces four gamete-derived offspring classes in an equal 1:1:1:1 ratio: parental-type combinations (AB, ab) and recombinant-type combinations (Ab, aB) appear equally often, because independent assortment gives no combination any advantage. When two genes are **linked** (physically close together on the same chromosome), the parental combinations are inherited together far more often than chance predicts — the testcross instead produces a strong excess of the two **parental** (non-recombinant) classes and a deficit of the two **recombinant** classes, with the size of the deficit reflecting how physically close the two genes are.

![Two linked-gene crosses (AAbb × aaBB and aabb × AABB) each producing an AaBb F1, whose gametes split into parental-type (blue: Ab/aB or ab/AB) and recombinant/crossover-type (red) classes.](/GENETICSPICS/linked-genes-parental-vs-recombinant-gametes.png)
*Source: opengenetics.pressbooks.tru.ca — confirm licensing basis before public deployment. Note: shows two linked-cross examples (different starting phase arrangements) rather than a direct side-by-side contrast against the unlinked 1:1:1:1 pattern.*

![Crossing over between homologous chromosomes at a chiasma during prophase I, producing two recombinant chromosomes (each part red, part green) alongside the two original parental chromosomes.](/GENETICSPICS/crossing-over-chiasma-prophase-i-diagram.png)
*Source: Wikipedia (Chiasma (genetics)) — confirm licensing basis before public deployment. Note: supplementary mechanistic diagram illustrating the chiasma/single-crossover event referenced in this page's Overview; not one of the four originally specified Static items.*

### Recombination frequency

**Recombination frequency (RF)** is calculated directly from testcross data:

$$ \text{RF} = \frac{\text{number of recombinant offspring}}{\text{total offspring}} \times 100\% $$

RF ranges from 0% (genes so close together that crossing over between them is never observed) to a **maximum of 50%**, at which point two genes are said to show **independent assortment** — indistinguishable from being on different chromosomes entirely, even if they are in fact on the same chromosome but very far apart. This 50% ceiling is a frequent conceptual trap: RF alone cannot distinguish "unlinked" from "linked but very far apart," since both produce the same 1:1:1:1 testcross pattern.

### Map units and the genetic map

**Recombination frequency is used directly as a measure of genetic distance**: 1% recombination frequency is defined as **1 map unit (m.u.)**, also called **1 centimorgan (cM)**. This relationship is empirical, not derived from first principles — it reflects the observation that crossover probability between two loci scales roughly with the physical distance separating them (for RF values well below the 50% ceiling; the relationship becomes non-linear and underestimates true distance at higher RF values, since multiple crossovers between distant loci can cancel out and go undetected — see below). A **genetic (linkage) map** orders genes along a chromosome and reports the map-unit distances between them, built up by summing pairwise recombination frequencies between adjacent markers.

![A real genetic linkage map of wheat chromosome 2A, with molecular markers positioned along the chromosome at their calculated centimorgan (cM) distances from 0.0 to 160.3.](/GENETICSPICS/genetic-map-linkage-group-centimorgans.png)
*Source: researchgate.net — confirm licensing basis before public deployment. Note: a real, research-grade linkage map with many molecular markers (wheat chromosome 2A), rather than a simplified textbook diagram of just three genes — the map-unit/centimorgan concept it illustrates is exactly as described in the text, but it's denser than the original request.*

### The three-point testcross

Mapping three linked genes simultaneously (rather than pairwise) is both more efficient and more informative, because it can detect **double crossovers** — two crossover events between the outer genes that individually cancel out at the middle gene, making it appear falsely close to a flanking gene if only pairwise RF were used. The method: cross a triple heterozygote (e.g. AaBbCc, with the parental linkage phase known) to a triple homozygous recessive, then classify all resulting offspring into eight phenotype classes:

1. **Two parental classes** (most frequent) — no crossover between any of the three genes.
2. **Two single-crossover classes between genes 1-2** and **two single-crossover classes between genes 2-3** (intermediate frequency).
3. **Two double-crossover classes** (least frequent) — crossovers occurred in *both* intervals simultaneously.

The **gene order** is determined by comparing the double-crossover class phenotypes to the parental class phenotypes: whichever gene's allele arrangement is *reversed* relative to the parental classes in the double-crossover offspring is the **middle gene** — since only the middle gene's position experiences two independent crossover events landing on either side of it.

{{< youtube V39s7iqhexU >}}
*Source: YouTube, "Three-point cross Gene Mapping || 4K Animation" — embedded in place of the originally requested static worked-example table, per user direction.*

### Interference and the coefficient of coincidence

If crossovers occurred completely independently of one another, the *expected* double-crossover frequency would simply be the product of the two single-interval recombination frequencies. In practice, a crossover in one interval typically **reduces** the likelihood of a second crossover nearby — a phenomenon called **interference**. This is quantified by the **coefficient of coincidence (c.o.c.)**:

$$ \text{c.o.c.} = \frac{\text{observed double-crossover frequency}}{\text{expected double-crossover frequency}} $$

$$ \text{Interference} = 1 - \text{c.o.c.} $$

A coefficient of coincidence of 1 means no interference (crossovers occur independently); a value less than 1 (the typical case) means **positive interference** — observed double crossovers are rarer than the independence assumption predicts, consistent with a physical/structural constraint on how closely together two chiasmata can form.

![Five crossover configurations between two linked genes (A/a, B/b) and their resulting recombination frequencies: no crossover (RF=0%), single crossover (RF=50%), two-strand double crossover (RF=0%, parental combination fully restored), three-strand double crossover (RF=50%), and four-strand double crossover (RF=100%).](/GENETICSPICS/double-crossover-parental-combination-restored-diagram.jpg)
*Source: kvmwai.edu.in (PDF course material) — confirm licensing basis before public deployment. Direct match — the "two-strand double cross over" panel is exactly the parental-combination-restored case the text describes.*

## Comparative Structures

| Recombination frequency | Interpretation |
|---|---|
| 0% | Genes effectively never separated by crossing over — extremely tightly linked |
| 1-49% | Linked; RF (%) = map distance in centimorgans |
| 50% | Independent assortment — either on different chromosomes, or linked but far enough apart that multiple crossovers obscure the true distance |

| Three-point testcross offspring class | Relative frequency | Crossover events |
|---|---|---|
| Parental (2 classes) | Highest | None |
| Single crossover, interval 1 (2 classes) | Intermediate | One, between genes 1 and 2 |
| Single crossover, interval 2 (2 classes) | Intermediate | One, between genes 2 and 3 |
| Double crossover (2 classes) | Lowest | One in each interval |

## Common Exam Questions

- "RF = 50% means the genes are unlinked" is an overstatement worth correcting precisely — it means the genes show independent assortment *in this dataset*, which is also consistent with linkage so distant that essentially every meiosis includes a crossover between them; only a three-point cross (or molecular data) can distinguish the two cases.
- The three-point testcross gene-ordering logic — identify the middle gene as the one whose allele arrangement flips between the parental and double-crossover classes — is a frequently tested applied-reasoning skill; students who instead try to order genes purely from pairwise RF values will get an answer, but miss double crossovers and underestimate the true map distance across the full interval.
- "Why is observed map distance always an underestimate of true physical distance at larger separations?" — because multiple crossovers between the same two loci can restore the parental allele combination, making that meiotic event indistinguishable from no crossover at all — RF measures the *net* result, not the true number of crossover events.
- Interference/coefficient-of-coincidence calculations are a common numeric exam question — always compute expected double-crossover frequency as the *product* of the two single-interval RFs, not their sum.

## Visual Reference

**Interactive**

- A three-point testcross builder: input parental phenotype/genotype classes and their offspring counts, and the tool computes recombination frequencies for each interval, identifies the middle gene, and calculates the coefficient of coincidence.

{{< iframe src="/three-point-testcross-builder.html" title="Three-point testcross builder" height="640px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. The three-point testcross item was fulfilled with an embedded video instead of a static image, per user direction.)*

## Practice Problems

**1.** A testcross between a fly heterozygous for two linked genes (AaBb, in coupling/cis arrangement AB/ab) and a doubly homozygous recessive fly produces 1000 offspring: 420 AaBb, 430 aabb, 74 Aabb, 76 aaBb. Calculate the recombination frequency and the map distance between the two genes.

<details>
<summary>Show answer</summary>

The parental classes are AaBb and aabb (420 + 430 = 850); the recombinant classes are Aabb and aaBb (74 + 76 = 150). RF = 150/1000 × 100% = **15%**, so the two genes are **15 map units (15 cM) apart**.
</details>

**2.** In a three-point testcross of genes A, B, and C, the parental phenotype classes are ABC and abc, while the rarest (double-crossover) classes are AbC and aBc. Based on this information, which gene lies in the middle, and how can you tell?

**3.** Two genes have an individually measured recombination frequency of 10% and 8% across two adjacent intervals (A-B and B-C respectively). If the observed double-crossover frequency between A and C is 0.5% rather than the expected 0.8%, calculate the coefficient of coincidence and the interference value, and state what this indicates about crossover independence in this region.
