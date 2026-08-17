---
title: "Pedigree Analysis & Human Genetic Disorders"
weight: 5
description: "Reading standard pedigree symbols to infer an unknown inheritance pattern (autosomal vs. X-linked, dominant vs. recessive), worked examples from real human genetic disorders, and the applied clinical context, karyotyping, prenatal testing, and genetic counseling, that pedigree analysis feeds into."
difficulty: "intermediate"
prerequisites: ["Sex-Determination-Sex-Linked-Inheritance"]
syllabus_tags: ["IBO", "USABO", "genetics", "transmission-genetics"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Human geneticists cannot design controlled crosses the way Mendel could with pea plants; inheritance patterns in humans must instead be inferred from **pedigrees**, diagrams of trait transmission across a real family's generations. This page covers standard pedigree notation, the diagnostic logic for distinguishing the four classical Mendelian pedigree patterns (autosomal dominant, autosomal recessive, X-linked dominant, X-linked recessive) from each other, worked human-disorder examples of each, and the applied clinical tools, karyotyping, prenatal testing, genetic counseling, built on this analysis.

## Key Concepts

### Pedigree symbols and conventions

Standard pedigree notation: **squares** represent males, **circles** represent females, a **horizontal line** connects mates, a **vertical line** drops to their offspring, and **filled symbols** indicate an affected individual (unfilled = unaffected). A **half-filled symbol** typically denotes a known heterozygous carrier (for a recessive condition) who is not personally affected. Generations are labeled with Roman numerals (I, II, III...) from oldest to youngest, and individuals within a generation are numbered left to right, so any individual can be uniquely referenced (e.g. "III-4").

![Standard pedigree chart symbol key: male/female, proband, deceased, affected, examined, carrier, twins, and adopted individuals, plus relationship symbols for marriage, consanguineous marriage, extramarital mating, divorce, and pregnancy/miscarriage/stillbirth.](/GENETICSPICS/pedigree-symbol-key-standard-notation.jpg)
*Source: biologyreader.com*

![A consanguineous (double-line) mating between first cousins, each an unaffected carrier (Aa), producing two affected (aa) children among their offspring, illustrating how consanguinity raises the risk of a rare recessive disorder appearing.](/GENETICSPICS/consanguinity-pedigree-double-line-mating.png)
*Source: researchgate.net*

### Diagnosing autosomal recessive inheritance

Signature pattern: the trait can **skip generations**, appearing in offspring of two unaffected (carrier) parents; affected individuals are often, though not always, born to unaffected parents; the trait appears roughly equally in both sexes; and two affected parents always produce 100% affected offspring (since both must be homozygous recessive). **Cystic fibrosis** (CFTR mutation, see [Endomembrane System & Protein Trafficking](/resources/1-cell-molecular/endomembrane-system-protein-trafficking/) for the molecular basis of the common ΔF508 mutant's failure to reach the plasma membrane) and **Tay-Sachs disease** are standard human examples.

### Diagnosing autosomal dominant inheritance

Signature pattern: the trait typically appears in **every generation** (no skipping, absent reduced penetrance, see [Extensions of Mendelian Inheritance](../extensions-of-mendelian-inheritance/)); every affected individual has at least one affected parent; unaffected individuals do not transmit the trait to their offspring; and the trait appears equally in both sexes. **Huntington's disease** and **achondroplasia** (a common cause of dwarfism) are standard human examples. A frequent pedigree trap: an apparently-skipped generation in an otherwise dominant-looking pattern should raise the possibility of **reduced penetrance** rather than being immediately reclassified as recessive.

![Three side-by-side worked pedigrees: Autosomal Dominant (affected individuals in every generation), Autosomal Recessive (trait skips a generation, appearing only in the children of two unaffected carriers), and X-linked (multiple affected males across generations), with a shared symbol legend.](/GENETICSPICS/autosomal-dominant-vs-recessive-pedigree-comparison.jpg)
*Source: glowm.com*

### Diagnosing X-linked recessive inheritance

Signature pattern: affected males vastly outnumber affected females (since males are hemizygous, see [Sex Determination & Sex-Linked Inheritance](../sex-determination-sex-linked-inheritance/)); the trait never passes from an affected father to an affected son (no father-to-son transmission, since sons receive the father's Y, not X); daughters of an affected father are typically unaffected carriers; and a trait can appear to "skip" a generation via an unaffected carrier mother. **Hemophilia A** (Factor VIII deficiency, famously traced through European royal pedigrees descending from Queen Victoria) and **red-green color blindness** are standard examples. *(See the X-linked panel of the pedigree comparison image above for a general worked example; no Queen Victoria-specific pedigree was sourced; the general pattern was judged sufficient.)*

### Diagnosing X-linked dominant inheritance

Signature pattern: affected fathers pass the trait to **all** their daughters but **none** of their sons (criss-cross transmission still applies to the chromosome itself, only dominance now means every X-bearing daughter is affected); affected mothers pass the trait to roughly half of children of either sex; and, unusually among the four patterns, affected females can outnumber affected males in a pedigree (since females have two chances to inherit an X-linked dominant allele). This pattern is rarer among well-known human disorders (vitamin D-resistant rickets is a standard example) but is a common source of pedigree-diagnosis exam questions specifically because of its distinctive father-to-daughters-only transmission signature.

### Using probability with pedigrees

Once a pedigree establishes the inheritance pattern and the genotypes of known individuals, the [product and sum rules](../mendelian-inheritance-probability/) apply directly to predict outcomes for future offspring or unresolved individuals, e.g. calculating the probability that a phenotypically unaffected individual with two heterozygous parents is a carrier (2/3, since the 1/4 homozygous-recessive class is excluded by the "unaffected" condition, leaving 1 AA : 2 Aa among the remaining 3 parts).

### Karyotyping, prenatal testing, and genetic counseling

A **karyotype**, a photographed, size-and-banding-ordered display of an individual's full chromosome complement, is the direct diagnostic tool for the chromosome-*number* and chromosome-*structure* disorders covered in [Chromosomal Variation: Number & Structure](../chromosomal-variation-number-structure/) (trisomies, large deletions/translocations), complementing pedigree analysis, which infers single-gene inheritance patterns rather than visualizing chromosomes directly. **Prenatal testing** methods (amniocentesis, chorionic villus sampling) obtain fetal cells for karyotyping or targeted molecular testing; **genetic counseling** combines pedigree-derived recurrence-risk calculations with test results to inform reproductive decisions, the clinical endpoint that pedigree analysis and probability calculations together are built to support.

![A normal human karyotype: 22 autosome pairs (1-22) ordered by size and banding pattern, plus the sex chromosome pair (XY or XX).](/GENETICSPICS/human-karyotype-normal-46-chromosomes-banded.jpeg)
*Source: microbenotes.com*

## Comparative Structures

| Pattern | Generations affected | Affected × unaffected parent risk | Sex ratio | Key diagnostic signature |
|---|---|---|---|---|
| Autosomal recessive | Can skip generations | Low, unless partner is a carrier | Equal | Two affected parents → 100% affected offspring |
| Autosomal dominant | Typically every generation | ~50% per child (if het. × unaffected) | Equal | Unaffected individuals never transmit the trait |
| X-linked recessive | Can skip generations via carrier mothers | Affected father → all daughters carriers, no sons affected directly from him | Males >> females affected | No father-to-son transmission |
| X-linked dominant | Typically every generation | Affected father → all daughters affected, no sons | Females can outnumber males affected | Affected father → 100% of daughters, 0% of sons |

## Common Exam Questions

- The standard pedigree-diagnosis approach is elimination by signature: check first for father-to-son transmission (rules X-linked in/out), then check whether unaffected parents ever have affected children (distinguishes recessive from dominant); don't just pattern-match on "looks dominant" without checking the specific transmission signatures above.
- "An apparently-skipped generation in a dominant-looking pedigree" is a common trap testing whether a student considers **reduced penetrance** (see [Extensions of Mendelian Inheritance](../extensions-of-mendelian-inheritance/)) as an alternative to simply reclassifying the trait as recessive.
- Carrier-probability questions (e.g. "given this unaffected individual has two heterozygous parents, what's the probability they're a carrier?") require conditioning on the "unaffected" observation, not just reading the raw 1:2:1 genotype ratio, a frequent computational trap.
- Distinguishing a **karyotype** (visualizes whole chromosomes, detects number/large structural changes) from a **pedigree** (infers single-gene transmission pattern from phenotype data across generations, detects nothing about chromosome structure directly) is a common conceptual-matching question.

## Visual Reference

**Interactive**

- A pedigree pattern diagnostic tool: given a generated pedigree, click through the diagnostic checklist (father-to-son transmission present? generations skipped? sex ratio skewed?) to arrive at the correct inheritance-pattern classification.

{{< iframe src="/pedigree-diagnostic-tool.html" title="Pedigree pattern diagnostic tool" height="620px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. One gap remains open: a karyotype image, see the inline note above.)*

## Practice Problems

**1.** In a pedigree, two unaffected parents have an affected daughter and an affected son. The trait does not appear in either set of grandparents. What inheritance pattern is most consistent with this pedigree, and what would definitively rule out X-linked recessive inheritance in this specific case?

<details>
<summary>Show answer</summary>

**Autosomal recessive** is most consistent: both parents must be unaffected heterozygous carriers, and the trait skipping the grandparent generation while appearing in roughly equal sex ratio among the children fits this pattern. X-linked recessive can be ruled out specifically because an **affected daughter** requires her father to be affected (she must inherit a recessive allele on each of her two X chromosomes, one of which comes from her father), since the father here is unaffected, the trait cannot be X-linked recessive.
</details>

**2.** A man with vitamin D-resistant rickets (X-linked dominant) has children with an unaffected woman. Predict the phenotype ratio among his sons and among his daughters, and explain the mechanism producing this pattern.

**3.** Two phenotypically unaffected parents, each known (from a previous affected child) to be heterozygous carriers of an autosomal recessive condition, are expecting another child. A genetic counselor is asked the probability that this child will be an unaffected carrier (not the probability of being affected). Calculate this probability and show your reasoning.
