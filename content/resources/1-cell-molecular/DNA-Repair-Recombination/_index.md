---
title: "DNA Repair & Recombination"
weight: 10
description: "The major DNA repair pathways — mismatch, base-excision, and nucleotide-excision repair, and double-strand break repair — plus the telomere/telomerase system and its link to aging and cancer."
difficulty: "advanced"
prerequisites: ["DNA-Structure-Replication"]
syllabus_tags: ["IBO", "USABO", "molecular-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

DNA is under constant chemical and physical assault — spontaneous hydrolysis, replication errors, UV/radiation damage, reactive chemical byproducts of metabolism — and the cell maintains a suite of dedicated repair pathways matched to specific damage types. This page covers the major repair pathways by the *kind* of lesion each is built to fix, then the telomere/telomerase system, which solves a structural problem replication itself cannot.

## Key Concepts

### Mismatch repair: catching replication errors that escape proofreading

Even with DNA polymerase's proofreading activity (see [DNA Structure & Replication](../dna-structure-replication/)), a small fraction of misincorporated bases escape detection during replication itself. **Mismatch repair (MMR)** scans newly replicated DNA for base-pairing mismatches (a mispaired base still fits the double helix geometrically well enough to be missed by proofreading, but disrupts normal hydrogen bonding subtly). The key mechanistic challenge MMR must solve: having found a mismatch, it must correctly identify *which* strand is the error-containing new strand rather than the correct template strand — in bacteria, this is solved by exploiting a brief post-replication window before the new strand is methylated, allowing repair proteins to distinguish old (methylated) template from new (unmethylated) strand. Loss of MMR function is directly linked to hereditary cancer syndromes (notably Lynch syndrome/HNPCC), since an accumulating, unrepaired mutation rate across the genome sharply raises the odds of eventually hitting a critical growth-control gene.

### Base excision repair (BER): fixing small, chemically altered bases

**BER** targets small-scale base damage — a single damaged or chemically inappropriate base (e.g. a deaminated cytosine that has become uracil, or an oxidised base) — without disturbing the surrounding intact DNA. A **DNA glycosylase** specific to the damaged base recognises and excises just that base, leaving an abasic site; downstream enzymes remove the resulting sugar-phosphate remnant, and a repair polymerase fills the single-nucleotide gap, sealed by ligase. This is the exact pathway (**uracil-DNA glycosylase**) referenced in [Nucleotide & Nucleic Acid Chemistry](../nucleotide-nucleic-acid-chemistry/) as the reason DNA uses thymine rather than uracil natively — any uracil BER encounters in DNA is unambiguously a deamination product, since genuine thymine (uracil + methyl group) is chemically distinguishable and not a glycosylase substrate.

![Base excision repair pathway: ROS-induced base lesions are recognised by damage-specific glycosylases, generating an abasic (AP) site; APE1 performs strand incision at the AP site, and DNA polymerase β fills the resulting gap, restoring normal sequence](/MCBBPICS/ber-mechanism-diagram.webp)
*Source: ResearchGate figure*

### Nucleotide excision repair (NER): fixing bulky, helix-distorting lesions

**NER** targets damage too structurally bulky for BER's single-base-swap mechanism to handle — most classically, **UV-induced thymine dimers** (covalent cross-links between adjacent thymine bases that distort the helix's normal geometry). NER excises a short single-stranded segment (roughly a dozen or more nucleotides) *surrounding* the lesion, rather than just the damaged base itself, and a repair polymerase fills the resulting gap using the intact complementary strand as template. The distinction from BER is a useful exam discriminator: **BER = one damaged base, glycosylase-initiated; NER = a bulky, helix-distorting lesion, excises a whole surrounding stretch.** Xeroderma pigmentosum, a hereditary NER deficiency, causes extreme UV sensitivity and dramatically elevated skin cancer risk — direct clinical evidence for how essential this specific pathway is.

![Nucleotide excision repair via both transcription-coupled repair (RNA polymerase stalling at the lesion recruits repair factors) and global genome repair (XPC/hHR23B scans and recognises damage anywhere in the genome): both converge on TFIIH-mediated helix unwinding, XPG/XPF-ERCC1 dual incision excising the lesion-containing segment, gap-filling DNA polymerase, and ligase sealing the nick](/MCBBPICS/ner-mechanism-diagram.png)
*Source: Wikipedia (Nucleotide Excision Repair)*

### Double-strand break repair: the highest-stakes damage type

A **double-strand break (DSB)**, severing both DNA strands at the same location, is the most dangerous lesion type — an unrepaired DSB can cause chromosome loss or large-scale rearrangement. Two repair strategies with sharply different fidelity:

- **Non-homologous end joining (NHEJ)**: directly ligates the two broken ends back together, with little or no sequence homology required — fast, available throughout the cell cycle, but **error-prone**, often introducing small insertions or deletions at the repair junction.
- **Homologous recombination (HR)**: uses the intact sister chromatid (available only after S phase — see [Cell Cycle, Mitosis & Meiosis](../cell-cycle-mitosis-meiosis/)) as a template to accurately restore the original sequence — **high-fidelity**, but restricted to S/G2 phases when a sister chromatid is actually present.

This cell-cycle restriction is the mechanistic reason NHEJ, despite being the less accurate pathway, remains the dominant DSB repair route in G1-phase cells — HR simply isn't available as an option without a sister chromatid template.

### Telomeres and telomerase: solving the end-replication problem

DNA polymerase's requirement for a primer (see [DNA Structure & Replication](../dna-structure-replication/)) creates a structural problem specifically at chromosome ends: after the final RNA primer on the lagging strand is removed, there is no way to fill the resulting gap with DNA, because doing so would require priming even further upstream than any existing sequence — each round of replication therefore shortens the chromosome slightly. This is the **end-replication problem**.

**Telomeres** — repetitive, non-coding DNA sequences capping chromosome ends — buffer this shortening, sacrificing expendable repeat sequence rather than functional genes each division. **Telomerase**, a specialised reverse transcriptase carrying its own built-in RNA template, extends telomeric repeats using that RNA template rather than the chromosome itself — solving the end-replication problem by *not* relying on DNA-templated synthesis at all, sidestepping the primer-removal gap issue entirely.

Telomerase activity is a double-edged biological fact, worth understanding both directions: most normal somatic cells have **low/absent** telomerase activity, so telomeres progressively shorten across successive divisions, eventually triggering replicative senescence (a proposed molecular "aging clock" and tumour-suppressive mechanism, since a senescent cell can no longer divide uncontrollably). Most **cancer cells**, by contrast, reactivate telomerase, achieving effectively unlimited replicative potential — one of the hallmark features distinguishing malignant from normal cell proliferation, and an active area of anticancer drug-target research.

![Comparison of telomerase-positive vs. telomerase-negative cells' response to a stalled replication fork at the telomere: telomerase-positive cells can resolve the block via fork reversal or direct telomerase-mediated de novo telomere synthesis, while telomerase-negative cells rely on Ku- and Rad51-dependent, recombination-based (ALT-type) telomere synthesis after fork breakage](/MCBBPICS/telomere-shortening-telomerase.jpg)
*Source: ScienceDirect (research article)*

## Comparative Structures

| Pathway | Damage type targeted | Excision scope | Key recognition step |
|---|---|---|---|
| Mismatch repair (MMR) | Replication-derived base mismatches | Single mismatched region | Distinguishing new (error-containing) strand from template |
| Base excision repair (BER) | Small, single-base chemical damage | Single damaged base | Glycosylase specific to the damaged base |
| Nucleotide excision repair (NER) | Bulky, helix-distorting lesions (e.g. UV thymine dimers) | Short surrounding segment (~dozen+ nt) | Recognition of helix distortion |
| Non-homologous end joining (NHEJ) | Double-strand breaks | Direct end ligation | None (no template needed) — error-prone |
| Homologous recombination (HR) | Double-strand breaks | Template-guided, high-fidelity | Requires sister chromatid (S/G2 only) |

## Common Exam Questions

- "Distinguish BER from NER" — always give the *scope and trigger* distinction (single damaged base + glycosylase vs. bulky distortion + wider excision), not simply "they're both excision repair pathways."
- "Why is NHEJ error-prone but still frequently used?" — the correct answer connects to cell-cycle timing: HR's higher fidelity is only accessible when a sister chromatid template exists (S/G2), so NHEJ remains necessary (despite its error rate) in G1.
- "How does telomerase solve the end-replication problem without violating DNA polymerase's normal requirements?" — tests whether you understand telomerase brings its *own* RNA template, rather than somehow forcing ordinary DNA polymerase to prime beyond the chromosome end.
- Loss-of-function disease associations (MMR → Lynch syndrome/HNPCC; NER → xeroderma pigmentosum) are frequently tested as direct pathway-to-disease matching questions.

## Visual Reference

**Interactive**

- A damage-to-pathway matcher: given a description of a specific DNA lesion (mismatch, oxidised base, UV dimer, double-strand break), select the correct repair pathway and see its mechanism animate.

{{< iframe src="/damage-to-pathway-matcher.html" title="DNA Damage-to-Pathway Matcher" height="380px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. The telomere image is a content mismatch — see the inline note; a genuine progressive-shortening-across-cycles diagram is not yet sourced.)*

## Practice Problems

**1.** A patient with a hereditary NER deficiency (xeroderma pigmentosum) shows extreme sensitivity specifically to UV light exposure, but comparatively normal sensitivity to alkylating chemical mutagens that cause small, single-base damage. Explain this pattern in terms of which repair pathway handles which damage type.

<details>
<summary>Show answer</summary>

UV light characteristically produces bulky, helix-distorting lesions (thymine dimers), which are NER's specific substrate — an NER deficiency leaves this damage type essentially unrepaired, explaining the extreme UV sensitivity. Small, single-base alkylation damage is instead primarily handled by base excision repair (BER), an independent pathway unaffected by the NER deficiency — explaining why sensitivity to that damage type remains comparatively normal. The pattern directly demonstrates that different repair pathways are non-redundant and damage-type-specific, not interchangeable general-purpose repair systems.
</details>

**2.** A cell line is found to have unusually short telomeres and shows premature replicative senescence compared to normal cells of the same type. Propose a plausible molecular explanation involving telomerase.

**3.** Explain why homologous recombination cannot be used to repair a double-strand break occurring in a G1-phase cell, and identify the repair pathway available instead, along with its main drawback compared to homologous recombination.
