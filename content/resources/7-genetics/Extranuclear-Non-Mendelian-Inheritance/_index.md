---
title: "Extranuclear & Non-Mendelian Inheritance"
weight: 8
description: "Inheritance patterns that don't follow Mendelian segregation at all because the responsible DNA isn't in the nucleus (organelle inheritance) or because the phenotype depends on the parental genotype or parent-of-origin rather than the offspring's own genotype (maternal effect, genomic imprinting)."
difficulty: "intermediate"
prerequisites: ["Extensions-of-Mendelian-Inheritance"]
syllabus_tags: ["IBO", "USABO", "genetics", "quantitative-genetics"]
---

{{< topic-meta >}}

## Overview

Every pattern covered so far — however extended or complicated — still ultimately rests on Mendelian segregation of nuclear chromosomes. This page covers inheritance patterns that break that assumption in one of two distinct ways: **extranuclear inheritance**, where the relevant DNA is not on a nuclear chromosome at all, and **parent-of-origin effects**, where an offspring's own genotype is Mendelian but its *phenotype* depends on which parent a given allele came from, or even on the parent's genotype rather than the offspring's own.

## Key Concepts

### Organelle (cytoplasmic) inheritance

Mitochondria and chloroplasts carry their own small circular genomes, independent of the nuclear genome (see [Mitochondria & Chloroplasts: Structure & Endosymbiotic Origin](/resources/1-cell-molecular/mitochondria-chloroplasts-structure-origin/) for why — their bacterial endosymbiotic ancestry). Because a zygote's cytoplasm — and essentially all of its organelles — comes overwhelmingly from the much larger egg cell rather than the sperm, organelle genes show **strict maternal (uniparental) inheritance**: **all** offspring of an affected mother inherit the organellar genotype, regardless of the father's genotype, and a father never transmits his mitochondrial or chloroplast genome to any offspring at all. This produces a reciprocal-cross asymmetry that looks superficially like X-linkage but has a completely different mechanistic basis (cytoplasm inheritance, not a sex chromosome) — the diagnostic test is that organelle-inherited traits show **no Mendelian segregation ratio at all**: every offspring of an affected mother is affected, not a fraction. Human mitochondrial diseases (e.g. Leber's hereditary optic neuropathy) and variegated leaf patterns in some plants (from chloroplast genotype) are standard examples.

### Maternal effect

**Maternal effect** genes produce a phenotype in the offspring that is determined by the **mother's genotype**, not the offspring's own — because the mother deposits gene products (mRNA or protein) into the egg cytoplasm *before* fertilization, and these maternally supplied products control an early developmental process before the zygote's own genome is transcriptionally active. The classic example is snail shell coiling direction (dextral/sinistral), controlled by a nuclear gene: an offspring's shell-coiling phenotype matches its **mother's genotype**, one generation delayed, regardless of the offspring's own genotype — a cross between a dextral mother and sinistral father produces all-dextral offspring (matching mother), and the *offspring's own* genotype only becomes phenotypically visible one generation later, in *their* offspring. This is diagnostically distinct from organelle inheritance: maternal effect involves a **nuclear** gene, delayed by one generation and expressed via cytoplasmic deposition, not a cytoplasmic organelle genome transmitted directly.

### Genomic imprinting

**Genomic imprinting** is a parent-of-origin-specific silencing of one copy of a gene, via DNA methylation established differently in the maternal and paternal germlines (the chromatin/methylation mechanism itself is covered in [Gene Regulation: Eukaryotic & Epigenetics](/resources/1-cell-molecular/gene-regulation-eukaryotic-epigenetics/); this page covers only the resulting inheritance-pattern consequence). An imprinted gene is expressed from only one parental allele — either always the maternal copy or always the paternal copy, depending on the specific gene — so a mutation's phenotypic effect depends on **which parent transmitted it**, not simply on standard dominant/recessive logic. Human **Prader-Willi syndrome** and **Angelman syndrome** are the classic teaching pair: both can result from the identical deletion on chromosome 15, but the phenotype differs sharply depending on whether the deletion is inherited from the father (Prader-Willi, since the normally-silent maternal copy in that region cannot compensate) or the mother (Angelman, for the reciprocal reason) — a direct demonstration that imprinting, not the DNA sequence change itself, determines the outcome.

### Cytoplasmic male sterility

**Cytoplasmic male sterility (CMS)** in plants is a mitochondrially-encoded trait that disrupts pollen (male gamete) production while leaving female fertility intact — inherited maternally, like other mitochondrial traits. CMS is agriculturally significant: because it prevents self-pollination without requiring manual emasculation, it is widely exploited by plant breeders to guarantee cross-pollination when producing commercial hybrid seed (e.g. in hybrid corn/maize production).

## Comparative Structures

| Pattern | Responsible DNA | Offspring phenotype determined by | Reciprocal cross | Example |
|---|---|---|---|---|
| Organelle (cytoplasmic) inheritance | Mitochondrial/chloroplast genome | Mother's organelle genotype, 100% of offspring | Strictly asymmetric — always matches mother | Leber's hereditary optic neuropathy |
| Maternal effect | Nuclear gene, cytoplasmically deposited product | Mother's *nuclear* genotype, one generation delayed | Asymmetric, but resolves to normal Mendelian segregation one generation later | Snail shell coiling direction |
| Genomic imprinting | Nuclear gene, parent-of-origin-silenced | Which parent transmitted the allele | Asymmetric, depends on specific imprinted locus | Prader-Willi vs. Angelman syndrome |

## Common Exam Questions

- "Organelle inheritance vs. maternal effect" is one of the most commonly confused pairs in this topic — both show maternal-biased transmission, but organelle inheritance never resolves to Mendelian ratios in any generation (it's the organelle DNA itself being inherited), while maternal effect *does* resolve to normal Mendelian segregation, just delayed by one generation (since it's a nuclear gene, only its cytoplasmic-deposition-based expression is delayed).
- "How can the same deletion cause two different syndromes?" (Prader-Willi vs. Angelman) directly tests understanding that imprinting silences a *specific parental copy* regardless of sequence — the phenotype depends on which parent's copy was already silent before the deletion occurred on the other one.
- A reciprocal cross producing offspring that all resemble the mother regardless of the father's phenotype should prompt consideration of organelle inheritance or maternal effect — the distinguishing test is whether the *offspring's own* genotype (checked in the following generation) predicts their own eventual phenotype (maternal effect) or not (organelle inheritance).
- Cytoplasmic male sterility is a frequent applied-genetics/agriculture question, testing whether a student connects the maternal-inheritance logic of mitochondrial traits to a practical hybrid-seed-production strategy.

## Visual Reference

**Interactive**

- *(built later — see project workflow)* A cross-pattern classifier: given a described reciprocal-cross result, the user selects whether it best fits Mendelian, organelle/cytoplasmic, maternal-effect, or imprinted inheritance, with feedback explaining the diagnostic signature.

**Static**

- Organelle inheritance diagram showing strict maternal transmission across a pedigree, contrasted with a standard Mendelian autosomal pedigree
- Snail shell-coiling maternal-effect diagram showing the one-generation delay between offspring genotype and offspring phenotype
- Prader-Willi/Angelman syndrome diagram showing the same chromosome 15 deletion producing different syndromes depending on parent of origin
- Cytoplasmic male sterility diagram illustrating its use in commercial hybrid seed production

## Practice Problems

**1.** A snail with a dextral (right-coiling) shell, known from crosses to be genotypically sinistral (ss, homozygous recessive at the coiling gene, with dextral D dominant), is crossed with a genotypically dextral male (DD). Predict the shell-coiling phenotype of the F1 offspring, and explain why it does not simply follow standard dominance.

<details>
<summary>Show answer</summary>

All F1 offspring will be **sinistral**, matching the mother's *phenotype* even though her genotype (ss) would normally be expected to produce sinistral offspring only if paired with another *s* allele in standard Mendelian logic — actually, since coiling is a maternal-effect trait, the offspring's shell phenotype is set by the gene products already deposited in the egg cytoplasm by the mother **before** fertilization, based on the mother's own genotype (ss, sinistral), regardless of the father's genotype (DD) or the offspring's own resulting genotype (all Ds, heterozygous). The offspring's own Dd genotype will only become phenotypically visible in the *next* generation, when these F1 snails' own eggs are provisioned according to their own (heterozygous, dextral-phenotype-determining) genotype.
</details>

**2.** A geneticist finds that a mitochondrial disease is present in all the children of an affected mother, but never appears in the children of an affected father (with an unaffected mother). Explain this pattern mechanistically, and state why it cannot be explained by X-linked inheritance despite the superficial similarity.

**3.** Two individuals each carry an identical deletion on the same region of chromosome 15, but one inherited it from their mother and shows Angelman syndrome, while the other inherited it from their father and shows Prader-Willi syndrome. Explain how identical DNA changes can produce different phenotypes depending on parental origin.
