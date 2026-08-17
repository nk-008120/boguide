---
title: "Transcription & RNA Processing"
weight: 11
description: "Prokaryotic and eukaryotic transcription, promoter recognition, the three eukaryotic RNA polymerases, and the three co-/post-transcriptional processing steps, capping, splicing, and polyadenylation, that convert a primary transcript into mature mRNA."
difficulty: "advanced"
prerequisites: ["DNA-Structure-Replication"]
syllabus_tags: ["IBO", "USABO", "molecular-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Transcription converts DNA sequence into RNA, and, in eukaryotes specifically, the resulting primary transcript is not the final functional molecule but requires a series of processing steps before export and translation. This page covers both the transcription mechanism itself and eukaryotic RNA processing, since the two are substantially co-transcriptional (processing begins before transcription of the gene even finishes) rather than strictly sequential.

## Key Concepts

### Prokaryotic transcription: one polymerase, direct promoter recognition

Bacteria use a single **RNA polymerase** for all transcription. A dissociable **σ (sigma) factor** subunit confers promoter-sequence specificity, directing the core polymerase to bind specific promoter consensus sequences (e.g. the −10 and −35 boxes upstream of the transcription start site), the σ factor's role is specifically recognition and initiation; it dissociates once elongation begins, at which point the core polymerase continues alone. Different σ factors, recognising different promoter sequences, let bacteria redirect global transcription (e.g. toward stress-response genes) by simply swapping which σ factor is active, without requiring an entirely new polymerase.

### Eukaryotic transcription: three specialised polymerases

Eukaryotes divide transcriptional labour across **three distinct RNA polymerases**, each transcribing a different class of gene:

| Polymerase | Transcribes |
|---|---|
| RNA Pol I | Most ribosomal RNA (rRNA, the major structural/catalytic RNA of ribosomes) |
| RNA Pol II | All protein-coding genes (pre-mRNA), plus most regulatory/small RNAs |
| RNA Pol III | tRNA, 5S rRNA, and other small RNAs |

RNA Pol II, the polymerase responsible for every protein-coding gene, cannot initiate transcription alone; it requires an assembly of **general transcription factors** (e.g. TFIID, which recognises the **TATA box** promoter element in many genes) to form a **pre-initiation complex** at the promoter before Pol II itself can begin. This is a substantially more elaborate initiation requirement than bacterial σ-factor-mediated recognition, reflecting eukaryotic transcription's much more extensive combinatorial regulation (see [Gene Regulation: Eukaryotic & Epigenetics](../gene-regulation-eukaryotic-epigenetics/) for enhancers, the Mediator complex, and chromatin-level control layered on top of this basic initiation machinery).

![Prokaryotic vs. eukaryotic promoters compared: prokaryotic promoters are simple, with two short hexameric motifs at the -10 and -35 positions close to the transcription start site, don't bend, and regulate operons; eukaryotic promoters are complex structures with diverse motifs (TATA box, INR box, BRE, CCAAT-box, GC-box) located kilobases away, bend upon binding, and regulate individual genes](/MCBBPICS/prokaryotic-vs-eukaryotic-rna-polymerase.webp)
*Source: pediaa.com*

### Elongation and termination

Once initiated, RNA polymerase moves along the template strand 3′→5′, synthesising RNA 5′→3′ (the same fixed directionality constraint that governs DNA polymerase, see [DNA Structure & Replication](../dna-structure-replication/)), using ribonucleotides rather than deoxyribonucleotides and incorporating uracil in place of thymine (see [Nucleotide & Nucleic Acid Chemistry](../nucleotide-nucleic-acid-chemistry/)). Termination mechanisms differ between prokaryotes (a hairpin-forming terminator sequence, either intrinsic/Rho-independent or requiring the Rho protein) and eukaryotes (coupled to the polyadenylation signal, see below), the exact termination mechanism is less frequently tested at depth than the processing steps that follow.

### Co-/post-transcriptional processing: three steps, three purposes

Eukaryotic pre-mRNA undergoes three distinct modifications before it is a mature, translatable mRNA: the first two begin **co-transcriptionally**, while Pol II is still actively transcribing the rest of the gene:

**5′ capping**: a modified guanine nucleotide (7-methylguanosine) is added to the 5′ end almost as soon as transcription begins, linked via an unusual 5′-5′ triphosphate bond. The cap protects the transcript from 5′ exonuclease degradation and is later recognised directly by the translation initiation machinery (see [Translation & the Genetic Code](../translation-genetic-code/)).

**Splicing**: most eukaryotic genes contain **introns** (non-coding intervening sequences) interrupting the coding **exons**. The **spliceosome**, a large complex of small nuclear ribonucleoproteins (snRNPs), recognises conserved sequences at intron-exon boundaries, excises each intron as a lariat-shaped intermediate, and ligates the flanking exons together. **Alternative splicing**, including or excluding specific exons in different combinations, allows a single gene to produce multiple distinct protein products, a major (and often underemphasised) source of eukaryotic proteomic diversity beyond the raw number of protein-coding genes.

![Primary RNA transcript with alternating exons and introns, processed via RNA processing (splicing) into spliced RNA retaining only the exons, plus a 5' cap and poly-A tail added, with 5' and 3' untranslated regions marked](/MCBBPICS/pre-mrna-splicing-intron-exon.png)
*Source: opened.cuny.edu*

**3′ polyadenylation**: after a specific polyadenylation signal sequence is transcribed, the transcript is cleaved at that site and a long **poly(A) tail** (up to ~250 adenine residues) is added enzymatically, not template-directed. The poly(A) tail, like the 5′ cap, protects against degradation and is recognised by translation machinery, and its progressive shortening over the mRNA's lifetime is one mechanism regulating mRNA stability/lifespan.

Together, the cap and poly(A) tail form a structural link (bridged by cap-binding and poly(A)-binding proteins) that effectively circularises the mature mRNA, a configuration that promotes efficient, repeated rounds of translation, covered further in [Translation & the Genetic Code](../translation-genetic-code/).

![mRNA circularisation via poly(A)-binding protein (PABPC) bound along the poly(A) tail, contacting translating ribosomes at the 5' end and the Ccr4-Not deadenylase complex at the 3' end: short poly(A) tails (~30 A) are associated with fast translation elongation and slow deadenylation, while long poly(A) tails (~150 A) are associated with slow elongation, fast deadenylation, and mRNA decapping](/MCBBPICS/mature-mrna-cap-polya-circularization.png)
*Source: pmc.ncbi.nlm.nih.gov (PMC7614307)*

## Comparative Structures

| Feature | Prokaryotic transcription | Eukaryotic transcription |
|---|---|---|
| Number of RNA polymerases | 1 | 3 (Pol I, II, III, gene-class specific) |
| Promoter recognition | σ factor (dissociable subunit of the single polymerase) | General transcription factors forming a pre-initiation complex |
| RNA processing | Minimal/none (transcript often translated as made) | Extensive: capping, splicing, polyadenylation |
| Coupling to translation | Often simultaneous (no nuclear envelope to separate the processes) | Strictly separated: transcription (nucleus) precedes translation (cytoplasm) |

| Processing step | Location added | Function |
|---|---|---|
| 5′ cap | 5′ end, co-transcriptional | Stability, translation initiation recognition |
| Splicing | Throughout transcript, co-transcriptional | Intron removal, alternative protein products |
| Poly(A) tail | 3′ end, post-cleavage | Stability, translation initiation recognition, mRNA lifespan regulation |

## Common Exam Questions

- "Which RNA polymerase transcribes [gene class]?": direct recall of the Pol I/II/III table above is a frequent, high-value memorisation target.
- "Why can prokaryotic mRNA be translated while still being transcribed, but eukaryotic mRNA cannot?", the correct answer cites the physical separation of the nucleus (transcription) from the cytoplasm (translation) in eukaryotes, and the requirement for processing (particularly splicing) to complete before the sequence is translation-ready.
- "How does alternative splicing increase proteomic diversity beyond gene number?": tests whether you understand that a single gene locus, through different exon-inclusion combinations, can encode functionally distinct protein isoforms, a frequently tested explanation for why proteome complexity exceeds raw gene-count estimates.
- Distinguishing the cap (5′, co-transcriptional, protects against 5′ exonucleases) from the poly(A) tail (3′, post-cleavage, protects against 3′ exonucleases and regulates lifespan) by location and timing is a common discriminator.

## Visual Reference

**Interactive**

- A co-transcriptional processing animator: RNA Pol II moving along a gene, with the 5′ cap appearing immediately after initiation, splicing removing an intron mid-transcription, and the poly(A) tail added after cleavage at the transcript's 3′ end.

{{< iframe src="/co-transcriptional-processing-animator.html" title="Co-Transcriptional Processing Animator" height="380px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. The mature-mRNA image is a content mismatch: see the inline note; a basic mature-mRNA-structure diagram is not yet sourced.)*

## Practice Problems

**1.** A mutation disrupts the spliceosome's ability to recognise one particular intron-exon boundary in an otherwise normal gene, but transcription itself (initiation, elongation, capping, polyadenylation) proceeds normally. Predict the most likely consequence for the resulting protein product.

<details>
<summary>Show answer</summary>

The affected intron is likely retained in the mature mRNA (or an adjacent exon is skipped, depending on exactly which boundary is disrupted), altering the reading frame or inserting/removing coding sequence in the final mRNA: this typically produces a nonfunctional, truncated, or otherwise abnormal protein, since translation (see [Translation & the Genetic Code](../translation-genetic-code/)) will read straight through what should have been excised intronic sequence, very often introducing a premature stop codon downstream of the retained intron.
</details>

**2.** Explain why a drug that specifically inhibits RNA Pol II, without affecting Pol I or Pol III, would still severely disrupt overall cellular protein synthesis despite ribosomal RNA (rRNA) and tRNA transcription continuing normally.

**3.** A single gene is found to produce three structurally distinct protein isoforms in three different tissue types, despite having only one transcription start site and one promoter. Propose the most likely molecular mechanism, and name the specific processing step responsible.
