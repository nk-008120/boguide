---
title: "Extensions of Mendelian Inheritance"
weight: 2
description: "Inheritance patterns that modify but don't violate Mendel's rules: incomplete dominance, codominance, multiple alleles, pleiotropy, lethal alleles, and the penetrance/expressivity distinction that explains why genotype doesn't always predict phenotype perfectly."
difficulty: "beginner"
prerequisites: ["Mendelian-Inheritance-Probability"]
syllabus_tags: ["IBO", "USABO", "genetics", "transmission-genetics"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Mendel's seven pea traits were fortunate in showing simple, complete dominance with one gene controlling one trait — but this is a special case, not the general rule. This page covers the inheritance patterns that **extend** Mendelian analysis without breaking segregation or independent assortment underneath: dominance relationships that aren't complete, genes with more than two alleles, one gene affecting multiple traits, alleles whose homozygous state is lethal, and the gap between having a genotype and actually expressing its associated phenotype. Every pattern here still obeys segregation at the chromosomal level (see [Mendel's Laws & Probability in Genetics](../mendelian-inheritance-probability/)); what changes is only how genotype maps onto phenotype.

## Key Concepts

### Incomplete dominance

In **incomplete dominance**, the heterozygote's phenotype is an intermediate blend between the two homozygous phenotypes, rather than matching one of them exactly: e.g. a cross between red-flowered (R¹R¹) and white-flowered (R²R²) snapdragons produces pink-flowered (R¹R²) heterozygotes. Critically, this is **not** a return to pre-Mendelian blending inheritance: the alleles themselves remain discrete and segregate normally (an R¹R² × R¹R² cross still produces a 1:2:1 **genotype** ratio), only the *phenotype* ratio changes to match the genotype ratio directly (1 red : 2 pink : 1 white), because there is no dominant allele to mask the other.

![Red (RR) × white (ww) snapdragon cross producing pink F1 heterozygotes; the Punnett square below shows the F2 1:2:1 ratio (RR red : Rw pink : Rw pink : ww white).](/GENETICSPICS/incomplete-dominance-snapdragon-cross.png)
*Source: ask.learncbse.in*

### Codominance

In **codominance**, both alleles are *fully and simultaneously* expressed in the heterozygote, rather than blending — the classic example is the **MN blood group** in humans, where M/N heterozygotes express both M and N antigens on red blood cells simultaneously, distinguishable from either homozygote by direct antigen testing. The distinction from incomplete dominance is precise and frequently tested: incomplete dominance produces a *new, intermediate* phenotype; codominance produces *both parental phenotypes simultaneously and distinguishably*.

*(No image showing the MN blood group specifically has been sourced yet — the file originally sourced for this slot turned out to depict the ABO system instead, see the note below the ABO table. Flagged HOLD; a genuine MN antigen diagram is still needed here.)*

### Multiple alleles: the ABO blood group system

A gene can have more than two alleles circulating in a population, even though any single diploid individual still carries only two. The human **ABO blood group** is the standard teaching example, with three alleles at one locus: **I^A** and **I^B** (codominant with each other) and **i** (recessive to both). This produces four phenotypes from six genotypes:

| Genotype(s) | Phenotype |
|---|---|
| I^A I^A, I^A i | Type A |
| I^B I^B, I^B i | Type B |
| I^A I^B | Type AB (codominance) |
| ii | Type O |

This system combines two extensions at once, multiple alleles *and* codominance between two of them (I^A/I^B) alongside simple dominance of each over the third (i), and is a frequent source of pedigree/parentage-exclusion exam questions (e.g. two type-A parents, each heterozygous I^A i, can have a type-O child).

![ABO blood group reference table: for each blood type (A, B, AB, O), the genotype, the red blood cell surface antigens present, and the plasma antibodies present.](/GENETICSPICS/abo-blood-group-antigen-phenotype-table.jpg)
*Source: jaypeedigital.com*

### Pleiotropy

**Pleiotropy** is when a single gene affects multiple, seemingly unrelated phenotypic traits — the opposite direction of complexity from multiple alleles (one gene, many effects, rather than one trait, many alleles). Human **sickle-cell disease** (a single amino-acid substitution in β-globin, Glu6Val — see [Protein Structure, Folding & Function](/resources/1-cell-molecular/protein-structure-folding-function/) for the molecular mechanism) is a classic pleiotropic example: the same mutation causes anemia, joint pain, organ damage, and increased malaria resistance in heterozygotes, a wide phenotypic footprint traceable to one underlying molecular lesion.

### Lethal alleles

Some alleles are **lethal** in the homozygous state, which distorts the expected phenotypic ratios in a cross. The classic example is coat color in mice: the **yellow (A^Y)** allele is dominant for coat color but **recessive lethal**: A^Y A^Y embryos die before birth. A cross between two yellow (heterozygous A^Y A) mice therefore produces a phenotype ratio of **2 yellow : 1 agouti** among live births, not the naively expected 3:1, because the A^Y A^Y class is missing entirely. Recognizing a skewed ratio (2:1 instead of 3:1, or a total litter size smaller than expected) as a signature of embryonic lethality, rather than assuming a counting or dominance error, is the key exam skill here.

![Four live mice showing real yellow (A^Y/+) and agouti (a/a) coat-color phenotypes, with genotypes labeled for each animal.](/GENETICSPICS/lethal-allele-yellow-mouse-coat-color-cross.jpg)
*Source: researchgate.net ("Coat colors: C57BL/6J A^y/a and C57BL/6J a/a mice have yellow and black pelage")*

### Penetrance and expressivity

Even a fully accounted-for genotype does not always guarantee a predictable phenotype:

- **Penetrance** is the *proportion of individuals with a given genotype who show the phenotype at all*: a condition is **incompletely (reduced) penetrant** if some genotypically affected individuals show no phenotype whatsoever (e.g. certain dominant conditions "skip" an apparently unaffected carrier generation in a pedigree).
- **Expressivity** is the *degree or severity* of the phenotype among individuals who do express it — **variable expressivity** means affected individuals can range from mildly to severely affected despite carrying the identical genotype.

![Pedigree showing an apparently skipped generation: an affected woman's children (a son and daughter, both apparently unaffected) go on to have an affected grandchild, consistent with reduced penetrance in the middle generation rather than non-paternity or a pedigree error.](/GENETICSPICS/penetrance-expressivity-pedigree-skipped-generation.png)
*Source: ResearchGate*

Both are frequently modulated by genetic background (modifier genes) and environment, and both matter directly for reading real pedigrees: reduced penetrance can make a dominant pedigree pattern look recessive by producing an apparently-skipped generation (see [Pedigree Analysis & Human Genetic Disorders](../pedigree-analysis-human-genetic-disorders/)).

### Norm of reaction

The **norm of reaction** is the full range of phenotypes a single genotype can produce across different environments, formalizing the point that genotype sets a *range* of possible outcomes, not a fixed single phenotype. Himalayan rabbits' coat-color pattern (dark extremities, pale body) is a standard example: the underlying temperature-sensitive pigment enzyme produces different local phenotypes depending on local skin temperature, all from one genotype.

## Comparative Structures

| Pattern | Heterozygote phenotype | Genotype:phenotype ratio relationship | Example |
|---|---|---|---|
| Complete dominance | Matches one homozygote | Phenotype ratio simpler than genotype ratio (3:1 from 1:2:1) | Pea seed shape |
| Incomplete dominance | Intermediate/blended | Phenotype ratio matches genotype ratio (1:2:1) | Snapdragon flower color |
| Codominance | Both parental phenotypes shown simultaneously | Phenotype ratio matches genotype ratio (1:2:1) | MN blood groups |

## Common Exam Questions

- "Is this incomplete dominance or codominance?": always check whether the heterozygote shows a *new blended* phenotype (incomplete dominance) or *both original phenotypes simultaneously and distinguishably* (codominance); a pink flower is blended, an AB blood type is both A and B markers present at once.
- A skewed ratio that's consistently missing one class (2:1 instead of 3:1, or a reduced total litter/brood size) should immediately suggest a **recessive lethal allele**, not a counting error or an exception to dominance.
- "Why did an obviously affected parent have an apparently unaffected child who later has affected children of their own?" This tests recognition of **reduced penetrance**, not a mistaken pedigree or non-paternity.
- ABO parentage-exclusion logic (a type-AB parent cannot have a type-O child; a type-O parent cannot have a type-AB child) is a frequent applied-genetics question; always reason from the *i* allele's strict recessiveness to both I^A and I^B.

## Visual Reference

**Interactive**

- An incomplete-dominance-vs-codominance-vs-complete-dominance comparator: pick a dominance mode and a cross, and see the resulting phenotype ratio and a visual representation of the heterozygote's actual appearance.

{{< iframe src="/dominance-comparator.html" title="Dominance relationship comparator" height="480px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Two gaps remain open: a genuine MN blood group codominance image, and a genuine A^Y lethal-allele cross/Punnett-square diagram — see the notes inline above.)*

## Practice Problems

**1.** A type-A woman and a type-B man have a child who is type O. Using the ABO genotype table, determine the genotypes of both parents and explain how a type-O child is possible.

<details>
<summary>Show answer</summary>

Both parents must be heterozygous: the mother is I^A i (type A) and the father is I^B i (type B). Since *i* is recessive to both I^A and I^B, each parent can pass either their dominant allele or their hidden *i* allele. A child who inherits *i* from both parents (i i) is type O, even though neither parent is phenotypically type O; the *i* allele was masked in each heterozygous parent.
</details>

**2.** In a cross between two curly-tailed cats (a trait caused by a dominant allele that is homozygous lethal), 90 kittens are born: 60 curly-tailed, 30 straight-tailed. Explain why this ratio is not 3:1, and predict how many kittens would be expected to have died as embryos if the litter size had not been reduced by lethality.

**3.** A patient has a genotype associated with a dominant, incompletely penetrant disorder (penetrance = 70%), but shows no symptoms. Explain how this is possible, and predict what proportion of this patient's children (assuming the other parent is unaffected and non-carrier) who inherit the disease allele would be expected to show symptoms.
