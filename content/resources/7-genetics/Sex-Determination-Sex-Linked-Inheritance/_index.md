---
title: "Sex Determination & Sex-Linked Inheritance"
weight: 4
description: "The major chromosomal sex-determination systems (XY, ZW, XO, haplodiploidy), how dosage compensation equalizes X-linked gene expression between sexes, and the distinctive inheritance patterns — sex-linked, sex-limited, and sex-influenced — that follow from a gene's location on a sex chromosome."
difficulty: "intermediate"
prerequisites: ["Extensions-of-Mendelian-Inheritance"]
syllabus_tags: ["IBO", "USABO", "genetics", "transmission-genetics"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Most of the crosses in the previous two pages implicitly assumed every gene is on an **autosome** (a chromosome present in the same number in both sexes), where Mendel's rules apply without modification. Genes carried on a **sex chromosome** — present in different copy numbers in the two sexes — follow distinctive inheritance patterns that are among the most heavily tested topics in transmission genetics. This page covers how sex itself is chromosomally determined across different lineages, how cells compensate for the resulting dosage imbalance, and the three related-but-distinct inheritance patterns (sex-linked, sex-limited, sex-influenced) that a gene's relationship to sex can produce.

## Key Concepts

### Chromosomal sex-determination systems

Different lineages determine sex using entirely different chromosomal logic, and confusing them is a common exam trap:

- **XY system** (mammals, including humans, and *Drosophila*): females are the homogametic sex (XX), males are heterogametic (XY). In mammals, the Y chromosome carries the *SRY* gene, whose presence actively triggers male development, so sex is determined by *presence of Y*, not by the number of X chromosomes.
- **ZW system** (birds, butterflies, some reptiles): the pattern is reversed, males are homogametic (ZZ), **females are heterogametic (ZW)**.
- **XO system** (some insects, e.g. grasshoppers): there is no second sex chromosome at all, males are X0 (one X, no Y), females are XX; sex is determined by the ratio of X chromosomes to autosome sets.
- **Haplodiploidy** (Hymenoptera — bees, ants, wasps): sex is determined by ploidy itself, not by a sex chromosome: fertilized (diploid) eggs develop as females, unfertilized (haploid) eggs develop as males. This has direct consequences for relatedness calculations covered in Ethology's [Kin Selection, Altruism & Eusociality](/resources/9-ethology/kin-selection-altruism-eusociality/).

![XY sex determination in humans and Drosophila (female XX homogametic, male XY heterogametic) compared to ZW sex determination in birds (male ZZ homogametic, female ZW heterogametic).](/GENETICSPICS/xy-zw-sex-determination-systems-comparison.jpg)
*Source: pmfias.com*

### Dosage compensation

Because the heterogametic sex has only one copy of most sex-chromosome genes while the homogametic sex has two, cells must compensate to avoid a two-fold difference in gene product between the sexes:

- **X-inactivation (mammals)**: in each XX cell, one X chromosome is transcriptionally silenced early in development, forming a condensed **Barr body**, chosen independently and (in most tissues) randomly per cell, and this produces **mosaicism**, most visibly in calico cats, where patches of orange and black fur reflect which X (carrying which coat-color allele) was inactivated in the founding cell of each patch. The chromatin-silencing mechanism itself (heterochromatin formation, DNA methylation) is covered in [Gene Regulation: Eukaryotic & Epigenetics](/resources/1-cell-molecular/gene-regulation-eukaryotic-epigenetics/); this page covers only the genetic consequence: that XX individuals are functional mosaics for X-linked genes, not the chromatin mechanism producing it.

![XX genotype with two differently colored X chromosomes; after random X-inactivation, each cell lineage silences one or the other, producing solid orange, solid black, or (when both inactivation outcomes occur in different cell lineages of the same animal) mosaic calico fur.](/GENETICSPICS/x-inactivation-barr-body-calico-cat-mosaicism2.jpg)
*Source: thisisepigenetics.ca*
- **Dosage compensation in *Drosophila*** works oppositely: rather than silencing one female X, males **up-regulate transcription roughly two-fold from their single X** to match female output.

### Sex-linked inheritance

A **sex-linked** (in practice, almost always **X-linked**, since the Y carries relatively few genes) trait shows a characteristic inheritance pattern because males are **hemizygous** for X-linked genes — carrying only one allele, with no second copy to mask a recessive one. Consequences:

- X-linked recessive traits (e.g. human red-green color blindness, hemophilia A) appear far more often in males than females, since a male needs only one copy of the recessive allele to be affected, while a female needs two.
- **Criss-cross inheritance**: a male's X chromosome (and any X-linked alleles on it) always comes from his mother, never his father (who contributes the Y) — so an affected father cannot pass an X-linked trait directly to a son, but every daughter of an affected father is an obligate carrier (or affected, if recessive and mother also contributes the allele).
- Reciprocal crosses (A female × a male vs. a female × A male) give **different** results for X-linked genes, unlike autosomal genes where reciprocal crosses are equivalent, this asymmetry is itself a diagnostic clue that a gene is X-linked.

![X-linked recessive cross: an unaffected father and a carrier mother (one normal, one recessive-allele X) produce, among their children, an unaffected son, an unaffected (carrier) daughter, a carrier daughter, and an affected son — illustrating that only sons can be directly affected by the mother's carried allele.](/GENETICSPICS/x-linked-recessive-cross-carrier-mother-affected-son.jpg)
*Source: U.S. National Library of Medicine (via UNSW embryology)*

![Three-generation X-linked recessive pedigree, labeled individuals I-1 through III-15, showing the pattern recurring across generations with more affected males than affected females overall.](/GENETICSPICS/sex-linked-pedigree-criss-cross-inheritance-pattern.png)
*Source: migrc.org*

### Sex-limited and sex-influenced traits

Two related but distinct patterns are frequently confused with sex-linkage despite being **autosomal**:

- **Sex-limited traits**: the gene is autosomal (present in both sexes equally), but the trait is expressed in only one sex due to hormonal or anatomical context, e.g. milk yield genes in cattle, expressed only in females, or hen-feathering/cock-feathering plumage genes in fowl.
- **Sex-influenced traits**: the gene is autosomal, and *both* sexes can express the phenotype, but the dominance relationship between the two alleles differs by sex — human pattern baldness is the standard example, where the baldness allele behaves as dominant in males (heterozygotes go bald) but recessive in females (heterozygotes do not), because of differing hormonal environments.

![Sex-influenced pattern baldness: genotype-to-phenotype table (bb = normal hair in both sexes; Bb = bald in males, normal in females; BB = bald in both sexes), illustrated with male vs. female head diagrams for each genotype, plus the distinct male ("horseshoe") vs. female (diffuse thinning) baldness pattern shapes.](/GENETICSPICS/pattern-baldness-genotype-phenotype-table-by-sex.webp)
*Source: dreamstime.com*

The diagnostic distinction from true sex-linkage: sex-limited and sex-influenced genes are inherited from **either parent to either sex equally** (normal autosomal 50/50 transmission), only their *expression* is sex-dependent, whereas true X-linkage produces the asymmetric transmission pattern (criss-cross inheritance, reciprocal-cross differences) described above.

## Comparative Structures

| System | Homogametic sex | Heterogametic sex | Example taxa |
|---|---|---|---|
| XY | Female (XX) | Male (XY) | Mammals, *Drosophila* |
| ZW | Male (ZZ) | Female (ZW) | Birds, butterflies |
| XO | Female (XX) | Male (X0) | Grasshoppers |
| Haplodiploidy | Female (diploid) | Male (haploid) | Bees, ants, wasps |

| Pattern | Gene location | Transmission | Example |
|---|---|---|---|
| Sex-linked | Sex chromosome (usually X) | Asymmetric — criss-cross, reciprocal crosses differ | Red-green color blindness |
| Sex-limited | Autosome | Symmetric — expressed only in one sex | Milk yield in cattle |
| Sex-influenced | Autosome | Symmetric — dominance differs by sex | Human pattern baldness |

## Common Exam Questions

- "Is this sex-linked, sex-limited, or sex-influenced?": check transmission first: if inheritance is asymmetric (reciprocal crosses differ, criss-cross pattern present), it's sex-linked; if transmission is normal 50/50 from either parent but expression differs by sex, it's sex-limited (one sex only) or sex-influenced (both sexes, different dominance).
- "Why can't an affected father pass an X-linked trait to his son?": because the father contributes a Y chromosome, not an X, to every son; this is the single most commonly tested consequence of X-linked inheritance.
- Reciprocal-cross questions (does it matter which parent carries the trait?) are a direct test of whether a student recognizes X-linkage, since for autosomal genes reciprocal crosses are always equivalent, so any asymmetry is diagnostic.
- Calico/tortoiseshell cat coloring is a frequent applied X-inactivation question: the expected answer connects the patchy phenotype to random, independent X-inactivation choice in different embryonic cell lineages, and correctly notes that (with rare exceptions) only females can display the calico pattern, since it requires two different X-linked coat-color alleles to inactivate mosaically.

## Visual Reference

**Interactive**

- A sex-determination system comparator: select XY, ZW, XO, or haplodiploidy, and see the resulting sex-chromosome combinations and which parent contributes which chromosome to offspring of each sex.

{{< iframe src="/sex-determination-comparator.html" title="Sex-determination system comparator" height="440px" >}}

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A color-blind man (X-linked recessive trait) has children with a woman who is homozygous normal-visioned. Predict the vision phenotype of all sons and all daughters, and explain why the pattern differs between the two.

<details>
<summary>Show answer</summary>

All sons will have normal vision (they receive their only X from their mother, who carries only the normal allele, and their Y from their father). All daughters will have normal vision but will be obligate carriers (X^c X, heterozygous); they receive the recessive allele on the X from their color-blind father and a normal allele from their mother, and since color blindness is recessive, one normal allele is sufficient for normal vision. The asymmetry (sons unaffected and non-carriers, daughters unaffected but all carriers) is the criss-cross inheritance signature of X-linked recessive traits.
</details>

**2.** A poultry breeder notices that a feathering pattern appears in both male and female birds when homozygous recessive, but the same genotype produces different plumage depending on sex. Is this trait more likely sex-linked, sex-limited, or sex-influenced? Justify your answer using the transmission pattern you would test for.

**3.** In *Drosophila*, a cross between a red-eyed female and a white-eyed male (white eye is X-linked recessive) produces all red-eyed offspring in the F1. The reciprocal cross (white-eyed female × red-eyed male) produces red-eyed daughters but white-eyed sons in the F1. Explain this discrepancy using X-linked inheritance.
