---
title: "Mendel's Laws & Probability in Genetics"
weight: 1
description: "Mendel's law of segregation and law of independent assortment, monohybrid and dihybrid crosses, the test cross, and the probability tools (product rule, sum rule, chi-square goodness-of-fit) used to predict and test inheritance patterns."
difficulty: "beginner"
syllabus_tags: ["IBO", "USABO", "genetics", "transmission-genetics"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Gregor Mendel's pea-plant crosses (1856-1863) established that heritable traits are carried by discrete, particulate factors — now called **genes** — rather than blending together as 19th-century "blending inheritance" assumed. This page covers Mendel's two laws, the cross types used to demonstrate and apply them, and the probability machinery (including the statistical test used to check whether real data actually fits a predicted ratio) that every later topic in this section builds on. The molecular identity of a "gene" — what it physically is and how it is expressed — is covered in [Cell/Molecular Biology & Biochemistry](/resources/1-cell-molecular/nucleotide-nucleic-acid-chemistry/); this page treats the gene as Mendel did, as a formal unit of inheritance inferred from breeding data.

## Key Concepts

### Mendel's experimental system and why it worked

Mendel chose the garden pea (*Pisum sativum*) for practical reasons that turned out to be scientifically decisive: peas normally **self-fertilize** (letting him maintain true-breeding lines), can be **cross-pollinated by hand** (letting him control every cross), and he studied seven traits that each show **complete dominance** with **no linkage** between them (see [Linkage, Recombination & Genetic Mapping](../linkage-recombination-genetic-mapping/) for what happens when this assumption breaks down) — a fortunate combination that produced clean, interpretable ratios. Mendel started with **true-breeding (homozygous) parental (P) lines**, crossed them to produce a **first filial (F1) generation**, then self-crossed the F1 to produce an **F2 generation** — the ratio of traits in F2 is what revealed the underlying rules.

### The Law of Segregation

Mendel's **first law**: each organism carries two copies (alleles) of each gene, one inherited from each parent, and these two alleles **segregate (separate) from each other** during gamete formation, so each gamete carries only one allele per gene. This is not an abstract rule — it is a direct description of what happens physically during **meiosis I**, when homologous chromosomes (each carrying one allele) separate to opposite poles (see [Cell Cycle, Mitosis & Meiosis](/resources/1-cell-molecular/cell-cycle-mitosis-meiosis/) for the mechanistic detail). In a monohybrid cross between two heterozygotes (Aa × Aa), segregation produces gametes in a 1:1 ratio of A- and a-bearing gametes, and combining them at fertilization produces the classic F2 genotype ratio **1 AA : 2 Aa : 1 aa**, which — because A is dominant — appears phenotypically as **3 dominant : 1 recessive**.

**Genotype vs. phenotype**: the genotype is the actual allele combination (AA, Aa, aa); the phenotype is the observable trait it produces. **Dominant** does not mean "more common" or "stronger" — it means the allele's phenotype is expressed in the heterozygous state, masking the recessive allele's effect; a dominant allele can be rare in a population and a recessive allele can be common (a frequent exam trap).

![Two sequential Punnett-square crosses: Generation 1 (AA × aa) producing 100% Aa offspring, then Generation 2 (Aa × Aa) producing the classic 3:1 phenotype / 1:2:1 genotype ratio.](/GENETICSPICS/monohybrid-cross-punnett-square-aa-x-aa.png)
*Source: bio.libretexts.org*

### The Law of Independent Assortment

Mendel's **second law**: alleles of *different* genes assort into gametes independently of one another, provided the genes are on different chromosomes (or far apart on the same one — see linkage). This reflects the independent, random orientation of different homologous chromosome pairs at **metaphase I** — which pair ends up facing which pole is independent of how every other pair is oriented. A dihybrid cross between two double heterozygotes (AaBb × AaBb) therefore produces gametes in four equally likely combinations (AB, Ab, aB, ab, each 1/4), and combining them at fertilization produces the F2 phenotype ratio **9:3:3:1** (9 A_B_ : 3 A_bb : 3 aaB_ : 1 aabb, where "_" denotes "either allele").

![Dihybrid cross Punnett square: true-breeding YYRR × yyrr parents produce an F1 YyRr heterozygote, which self-crosses to a full 16-box F2 grid showing the 9:3:3:1 phenotype ratio.](/GENETICSPICS/dihybrid-cross-punnett-square-aabb-x-aabb.png)
*Source: oertx.highered.texas.gov*

![Two possible chromosome arrangements at metaphase I, each independently segregating through metaphase II into gametes, producing four distinct genetic arrangements — illustrating the random, independent orientation of homologous pairs underlying independent assortment.](/GENETICSPICS/meiosis-i-segregation-independent-assortment-homologs.jpg)
*Source: brainbrooder.com*

### Punnett squares and the test cross

A **Punnett square** is a grid method for enumerating all possible gamete combinations from a cross and their expected frequencies — mechanically reliable for any cross once the parental genotypes are known, but the actual predictive content is the segregation/assortment rules above, not the grid itself. The genuine unknown in a real cross is often the reverse problem: given a dominant phenotype, is the organism homozygous (AA) or heterozygous (Aa)? A **test cross** — crossing the unknown individual to a homozygous recessive (aa) — resolves this directly: an AA × aa cross produces **100% Aa offspring** (all dominant phenotype), while an Aa × aa cross produces **50% Aa : 50% aa** (a 1:1 phenotype split) — any recessive offspring at all proves the tested parent was heterozygous.

### Probability rules: product rule and sum rule

Two rules let you calculate the probability of a specific outcome without building a full Punnett square, essential once more than two genes are involved:

- **Product rule (AND / independent events)**: the probability of two *independent* events both occurring is the product of their individual probabilities. For a trihybrid cross AaBbCc × AaBbCc, the probability of an *aabbcc* offspring is (1/4)(1/4)(1/4) = 1/64, since each gene segregates independently.
- **Sum rule (OR / mutually exclusive events)**: the probability of *either* of two mutually exclusive outcomes is the sum of their individual probabilities. The probability that an Aa × Aa cross produces a child who is *either* AA or aa (i.e., not heterozygous) is 1/4 + 1/4 = 1/2.

These combine directly: for the probability that an AaBb × AaBb cross produces an offspring that is homozygous recessive for *at least one* of the two genes, sum the individual homozygous-recessive probabilities (1/4 each) and subtract the overlap (both recessive, 1/16, counted twice) — 1/4 + 1/4 − 1/16 = 7/16.

### The chi-square (χ²) goodness-of-fit test

Real crosses never match a predicted ratio *exactly*, because gamete combination at fertilization is a random sampling process. The **chi-square test** asks whether an observed deviation from a predicted ratio (e.g. 3:1) is small enough to be explained by chance alone, or large enough to suggest the underlying hypothesis (e.g. simple dominance, no linkage) is wrong:

{{< eqbox >}}
$$ \chi^2 = \sum \frac{(O-E)^2}{E} $$
{{< /eqbox >}}

where *O* is the observed count and *E* is the expected count in each phenotypic class. The resulting χ² value is compared against a critical value from a chi-square distribution table, using **degrees of freedom = (number of phenotypic classes − 1)** — for a monohybrid 3:1 ratio (2 classes), df = 1; for a dihybrid 9:3:3:1 ratio (4 classes), df = 3. At the conventional **p = 0.05** significance threshold, a calculated χ² *below* the critical value means the data **fail to reject** the hypothesized ratio (consistent with it); a χ² *above* the critical value means the observed data deviate significantly from the prediction, and the hypothesis (e.g. simple Mendelian inheritance with no linkage or lethality) should be reconsidered.

![Chi-square probability density curve with shaded critical-value rejection regions at α = 0.05.](/GENETICSPICS/chi-square-distribution-critical-value-worked-example.gif)
*Source: NIST Engineering Statistics Handbook*

## Comparative Structures

| Cross type | Parental genotypes | Gamete types produced | F2 phenotype ratio | Purpose |
|---|---|---|---|---|
| Monohybrid | Aa × Aa | A, a (1:1 each) | 3 dominant : 1 recessive | Demonstrates segregation |
| Dihybrid | AaBb × AaBb | AB, Ab, aB, ab (1:1:1:1) | 9:3:3:1 | Demonstrates independent assortment |
| Test cross | Aa (unknown) × aa | Reveals unknown parent's gametes directly | 1:1 (if Aa) or all dominant (if AA) | Determines an unknown genotype |

| df (phenotype classes − 1) | χ² critical value (p = 0.05) |
|---|---|
| 1 | 3.84 |
| 2 | 5.99 |
| 3 | 7.81 |
| 4 | 9.49 |

## Common Exam Questions

- "Which rule applies — product or sum?" — the discriminator is whether the question asks for two *simultaneous, independent* conditions (product) or *either of several mutually exclusive* outcomes (sum); many multi-part probability questions require both rules in sequence, not just one.
- "Dominant means more common" is a common misconception to explicitly correct — dominance is about phenotypic expression in the heterozygote, entirely independent of allele frequency in a population (which is a Hardy-Weinberg question, see [Population Genetics & Hardy-Weinberg Equilibrium](/resources/15-evolution/population-genetics-hardy-weinberg-equilibrium/)).
- Chi-square degrees-of-freedom errors are a frequent trap: df is (number of *phenotypic classes*) − 1, not the number of genes or traits involved — a dihybrid 9:3:3:1 ratio has 4 classes and therefore df = 3, not df = 1 (for "two genes") or df = 2.
- "Why does a test cross use a homozygous recessive tester, specifically?" — because aa gametes contribute only recessive alleles, so the phenotype of the offspring directly reveals which allele came from the unknown parent, with no masking possible.

## Visual Reference

**Interactive**

- A Punnett square simulator: select monohybrid, dihybrid, or test-cross mode, input parental genotypes, and see the gamete grid and resulting genotype/phenotype ratios generate automatically.

{{< iframe src="/punnett-square-simulator.html" title="Punnett square simulator" height="560px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** In pea plants, purple flowers (P) are dominant to white (p), and tall stems (T) are dominant to short (t). A plant heterozygous for both traits (PpTt) is crossed with a plant that is homozygous recessive for both (pptt). What proportion of the offspring is expected to have purple flowers and short stems?

<details>
<summary>Show answer</summary>

This is a test cross (PpTt × pptt), so each gene segregates independently into a 1:1 ratio in the offspring: 1/2 of offspring are Pp (purple) and 1/2 are pp (white); independently, 1/2 are Tt (tall) and 1/2 are tt (short). By the product rule, the proportion with purple flowers AND short stems is (1/2)(1/2) = **1/4**.
</details>

**2.** A researcher crosses two pea plants, both heterozygous for seed shape (Rr, round dominant to wrinkled), and observes 780 offspring: 610 round, 170 wrinkled. Calculate χ² and state, using the df = 1 critical value of 3.84, whether this result is consistent with the expected 3:1 ratio.

**3.** In humans, suppose a couple is each heterozygous for two independently assorting recessive conditions (Aa Bb × Aa Bb). What is the probability that their child is affected by *at least one* of the two conditions?
