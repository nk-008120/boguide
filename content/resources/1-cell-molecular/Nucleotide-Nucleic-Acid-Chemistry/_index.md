---
title: "Nucleotide & Nucleic Acid Chemistry"
weight: 21
description: "Nucleotide structure and nomenclature, purine vs. pyrimidine chemistry, phosphodiester bond formation and strand directionality, and the chemical differences between DNA and RNA that explain their different biological roles."
difficulty: "intermediate"
prerequisites: ["Amino-Acids-Protein-Chemistry"]
syllabus_tags: ["IBO", "USABO", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

This page covers nucleotide and nucleic acid chemistry from the biochemist's angle: the bonds, functional groups, and chemical differences between DNA and RNA. [DNA Structure & Replication](../dna-structure-replication/) builds directly on this to cover the double helix and replication machinery; that division mirrors how [Lipids & Membrane Biochemistry](../lipids-membrane-biochemistry/) covers phospholipid chemistry while [Plasma Membrane Structure & Transport](../plasma-membrane-structure-transport/) covers the resulting membrane's behaviour.

## Key Concepts

### Nucleotide structure

A **nucleotide** has three components: a nitrogenous base, a five-carbon (pentose) sugar, and one or more phosphate groups. A **nucleoside** is the base-sugar unit alone, without phosphate. Naming convention: base + sugar + phosphate count determines the name (e.g. deoxyadenosine triphosphate, dATP: adenine + deoxyribose + 3 phosphates).

### Purines and pyrimidines

Nitrogenous bases fall into two structural classes:

- **Purines**, double-ring structures (fused six- and five-membered rings): **adenine (A)** and **guanine (G)**.
- **Pyrimidines**, single six-membered ring: **cytosine (C)**, **thymine (T)**, and **uracil (U)**.

Each purine pairs specifically with one pyrimidine via hydrogen bonding, **A with T (or U in RNA), G with C**, a pairing rule that is chemically, not arbitrarily, determined: the hydrogen bond donor/acceptor pattern only matches correctly in the A–T/A–U and G–C combinations, and pairing two purines together would sterically clash (too wide) while pairing two pyrimidines would leave them too far apart to hydrogen-bond. G–C pairs form **three** hydrogen bonds, A–T pairs form **two**: which is why GC-rich DNA regions have a measurably higher melting temperature ($T_m$) than AT-rich regions of the same length.

![Purine (fused six/five-membered ring) and pyrimidine (single six-membered ring) parent structures, with all five nitrogenous bases shown: adenine and guanine (purines), cytosine, uracil, and thymine (pyrimidines), amino/carbonyl substituents highlighted](/MCBBPICS/purine-vs-pyrimidine-bases.jpg)
*Source: pratclif.com*

### The sugar: ribose vs. deoxyribose

**RNA** uses **ribose**; **DNA** uses **2′-deoxyribose**: the single chemical difference is the absence of a hydroxyl group at the 2′ carbon in DNA. This is not a cosmetic difference: the 2′-OH in RNA makes the sugar-phosphate backbone chemically more reactive and prone to alkaline/enzymatic hydrolysis, meaning **RNA is intrinsically less chemically stable than DNA**, a major reason DNA, not RNA, is the long-term hereditary information store in cellular life, while RNA's greater reactivity is co-opted functionally in ribozymes (catalytic RNA, whose 2′-OH groups can participate directly in phosphodiester bond chemistry).

![Ribose (RNA sugar) vs. deoxyribose (DNA sugar) furanose rings, numbered 1'-5', with the 2' position highlighted: an -OH group in ribose vs. an -H in deoxyribose](/MCBBPICS/ribose-vs-deoxyribose.png)
*Source: tutorchase.com*

### Phosphodiester bonds and strand directionality

Nucleotides are joined by **phosphodiester bonds**: the 5′-phosphate of one nucleotide's sugar links to the 3′-hydroxyl of the next, forming a sugar-phosphate backbone with a defined chemical **direction**: one end terminates in a free 5′-phosphate, the other in a free 3′-hydroxyl. This directionality (**5′ → 3′**) is not a labelling convention; it dictates the direction every polymerase can synthesise in (see [DNA Structure & Replication](../dna-structure-replication/) and [Transcription & RNA Processing](../transcription-rna-processing/) for why this constraint shapes the replication fork and creates leading/lagging strand asymmetry).

### DNA vs. RNA: the chemistry behind the functional divergence

| Feature | DNA | RNA | Functional consequence |
|---|---|---|---|
| Sugar | 2′-deoxyribose | Ribose | RNA more reactive/unstable, suited to transient messages, not long-term storage |
| Pyrimidine | Thymine (5-methyluracil) | Uracil | The extra methyl group in thymine is a repair signal (see below) |
| Strandedness | Almost always double-stranded | Usually single-stranded (can fold intramolecularly) | Single-strandedness lets RNA adopt complex catalytic/structural folds (tRNA cloverleaf, ribozymes) that duplex DNA cannot |
| Stability | High | Low | Matches DNA's role as permanent archive vs. RNA's role as disposable working copy |

**Why thymine, not uracil, in DNA**: cytosine spontaneously deaminates to uracil at a low but non-negligible rate. If DNA used uracil natively, the cell's repair machinery could not distinguish "a uracil that belongs here" from "a uracil produced by cytosine deamination damage." Using thymine (uracil + a methyl group) as DNA's normal pyrimidine means *any* uracil found in DNA is unambiguously a deamination product, which base-excision repair (uracil-DNA glycosylase) can recognise and excise specifically, see [DNA Repair & Recombination](../dna-repair-recombination/). This is one of the clearest examples in all of biochemistry of a chemical detail existing specifically to support an error-correction mechanism.

## Comparative Structures

| Comparison axis | Purine (A, G) | Pyrimidine (C, T, U) |
|---|---|---|
| Ring structure | Fused 6+5 membered, two rings | Single 6-membered ring |
| Relative size | Larger | Smaller |
| H-bonds in canonical pairing | 2 (with T/U) or 3 (G with C) | Same, pairing-dependent |
| Pairs exclusively with | One specific pyrimidine | One specific purine |

## Common Exam Questions

- "Why does GC content affect DNA melting temperature?": always cite the *hydrogen bond count difference* (3 vs. 2), not simply "GC pairs are stronger" without the mechanistic reason.
- "Why does DNA use thymine instead of uracil?", the repair-signal argument (distinguishing genuine thymine from deaminated-cytosine-derived uracil) is the complete, examinable answer; "thymine is more stable" alone is an incomplete answer.
- Questions describing an unfamiliar nucleic-acid-derived molecule (e.g. a modified nucleotide analog used as a drug) often hinge on identifying which chemical group (2′-OH presence/absence, base identity) has been altered and predicting the functional consequence by analogy to the DNA/RNA comparison above.

## Visual Reference

**Interactive**

- A base-pairing hydrogen-bond viewer: click any two bases and see whether/how many hydrogen bonds form, reinforcing why only A–T/U and G–C pairings are chemically valid.

{{< iframe src="/base-pairing-hydrogen-bond-viewer.html" title="Base-Pairing Hydrogen Bond Viewer" height="380px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Two items are not yet illustrated: a nucleotide structure diagram, the sourced candidate for this slot, `nucleotide-structure-diagram.jpg`, turned out to duplicate the ribose-vs-deoxyribose comparison already placed above rather than showing a full base+sugar+phosphate nucleotide, so it was not inserted (see `image-sources.md`), and a phosphodiester backbone/5′→3′ directionality diagram, for which no image was sourced yet.)*

## Practice Problems

**1.** Two double-stranded DNA fragments of equal length have different GC content: Fragment A is 70% GC, Fragment B is 30% GC. Which has the higher melting temperature, and why?

<details>
<summary>Show answer</summary>

Fragment A (70% GC). G–C base pairs form three hydrogen bonds versus two for A–T pairs, so a GC-rich fragment requires more thermal energy to separate the strands: melting temperature increases with GC content.
</details>

**2.** A researcher finds an unusual uracil base incorporated into a sample of genomic DNA. Explain, mechanistically, how the cell's repair machinery can recognise this as an error requiring correction, using the DNA/RNA base-composition rule.

**3.** Explain why RNA's 2′-OH group, often described simply as making RNA "less stable" than DNA, is also the chemical basis for RNA's ability to act as an enzyme (a ribozyme), i.e. why is the same feature both a stability liability and a functional asset?
