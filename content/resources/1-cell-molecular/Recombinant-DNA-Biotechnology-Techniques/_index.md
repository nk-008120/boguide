---
title: "Recombinant DNA & Biotechnology Techniques"
weight: 15
description: "Restriction enzymes and cloning vectors, PCR, Southern/Northern/Western blotting, Sanger and next-generation sequencing, and CRISPR-Cas9 genome editing — the core nucleic-acid manipulation toolkit."
difficulty: "advanced"
prerequisites: ["DNA-Structure-Replication", "Transcription-RNA-Processing"]
syllabus_tags: ["IBO", "USABO", "molecular-biology", "laboratory-technique"]
---

{{< topic-meta >}}

## Overview

This page covers the core nucleic-acid manipulation toolkit — how DNA fragments are cut, copied, cloned, detected, sequenced, and precisely edited. Together with [Biomolecular Analytical Techniques](../biomolecular-analytical-techniques/) (which covers the protein-focused counterparts — electrophoresis, chromatography), this is the direct answer to the most specific technique requests raised by BioGuide's own student survey: named lab methods (blotting, PCR, sequencing) tested at the level of "what does this technique actually do and why would you choose it," not just definitions.

## Key Concepts

### Restriction enzymes and cloning vectors

**Restriction endonucleases** recognise specific short palindromic DNA sequences and cleave the DNA there — bacterially derived defence enzymes (part of a bacterium's own restriction-modification system against invading phage DNA) repurposed as precision cutting tools. Many restriction enzymes produce **sticky ends** (short single-stranded overhangs) rather than blunt ends; two DNA fragments cut by the *same* enzyme have complementary sticky ends and can be joined by DNA ligase, which is the physical basis of **molecular cloning**: a gene of interest, cut with a chosen restriction enzyme, can be ligated into a **plasmid vector** cut with the same enzyme, then introduced into a host bacterium (transformation) for propagation, amplification, or expression. Vectors typically carry a selectable marker (e.g. antibiotic resistance) allowing successfully transformed cells to be identified by growth under selective conditions.

![Restriction enzyme cloning: a stabilizing/flanking DNA region containing HindIII and KpnI recognition sites is cut, producing sticky-ended fragments (5' AGCT and GGTAC overhangs); the excised insert and a digested circular vector cut with the same enzymes share complementary sticky ends, allowing ligation into a recombinant vector](/MCBBPICS/restriction-enzyme-sticky-end-cloning.jpg)
*Source: idtdna.com — confirm licensing basis before public deployment*

### PCR: exponential amplification without a living host

**Polymerase chain reaction (PCR)** amplifies a specific DNA sequence exponentially in a test tube, without requiring cloning into a living organism. Each cycle repeats three temperature-controlled steps: **denaturation** (~95°C, separating the double helix into single strands), **annealing** (~50–65°C, allowing short synthetic **primers** flanking the target sequence to bind their complementary single-stranded template), and **extension** (~72°C, a heat-stable DNA polymerase — most commonly **Taq polymerase**, originally isolated from the thermophilic bacterium *Thermus aquaticus*, whose heat tolerance is exactly what makes repeated 95°C denaturation cycles compatible with an active polymerase — extends each primer, synthesising new DNA). Because each cycle's products become templates for the next cycle, the target sequence roughly **doubles every cycle**, producing exponential (2ⁿ) amplification from a vanishingly small starting sample — the property that makes PCR so useful for amplifying trace forensic, diagnostic, or ancient DNA samples.

![PCR three-step cycle: double-stranded DNA is denatured into single strands (94-95°C), primers anneal to their complementary sequences (50-56°C), and polymerase extends each primer (72°C) to synthesise new complementary strands](/MCBBPICS/pcr-three-step-cycle.png)
*Source: praxilabs.com — confirm licensing basis before public deployment*

### Blotting techniques: three names, one shared logic, three different targets

All three blotting techniques share the same core workflow — separate biomolecules by gel electrophoresis, transfer them onto a solid membrane, then detect a specific target with a labelled probe — differing only in *what* is being detected:

- **Southern blot** (named after its inventor, Edwin Southern — the "Northern"/"Western" names are a deliberate pun extending the geographic joke) detects specific **DNA** sequences: DNA fragments are separated by agarose gel electrophoresis (see [Biomolecular Analytical Techniques](../biomolecular-analytical-techniques/)), transferred to a membrane, and probed with a labelled complementary DNA sequence that hybridises specifically to the target.
- **Northern blot** detects specific **RNA** sequences (typically mRNA), using the identical logic with an RNA sample and a complementary labelled probe — useful for directly assessing whether/how much a specific gene is being transcribed in a given sample.
- **Western blot** detects a specific **protein**: proteins are separated by SDS-PAGE (see [Biomolecular Analytical Techniques](../biomolecular-analytical-techniques/)) rather than agarose electrophoresis, transferred to a membrane, and probed with a labelled **antibody** specific to the target protein rather than a complementary nucleic acid probe — the detection chemistry is necessarily different (antibody-antigen recognition instead of nucleic acid hybridisation), since a protein has no complementary-sequence partner the way DNA/RNA do.

The naming and workflow parallel is deliberate and worth internalising as a set: **same core logic (separate → transfer → probe), different molecule and different probe chemistry** — a frequent source of confusion is forgetting that Western blot's probe is an antibody, not a nucleic acid, because it's the one technique in the set detecting a molecule without a complementary-sequence partner.

![Southern (DNA), Western (protein), and Northern (RNA) blotting compared side by side across target molecule, membrane type, separation technique, probe used, probe label, detection method, blotting technique, and typical applications](/MCBBPICS/southern-northern-western-blot-comparison.png)
*Source: excedr.com — confirm licensing basis before public deployment*

### DNA sequencing: Sanger and next-generation approaches

**Sanger (chain-termination) sequencing** uses DNA polymerase, a primer, normal deoxynucleotides (dNTPs), and a small proportion of fluorescently labelled **dideoxynucleotides (ddNTPs)** — which lack the 3′-OH group required for the next phosphodiester bond to form (see [Nucleotide & Nucleic Acid Chemistry](../nucleotide-nucleic-acid-chemistry/)), so incorporation of a ddNTP terminates that strand's extension at that exact position. Across many parallel synthesis reactions, this produces a population of fragments terminating at every possible position, each carrying a base-specific fluorescent label; separating these fragments by size (capillary electrophoresis) and reading the label at each length directly reveals the sequence, one base at a time, in order.

**Next-generation sequencing (NGS)** technologies (e.g. Illumina sequencing-by-synthesis) instead sequence millions of short DNA fragments **in parallel**, dramatically increasing throughput and lowering per-base cost relative to Sanger sequencing, at the cost of shorter individual read lengths that require computational reassembly (see the genome assembly methods covered in [Bioinformatics](/resources/10-bioinformatics/)) to reconstruct a full genome or long sequence. The core exam-relevant contrast: **Sanger = one sequence at a time, longer accurate reads, still the gold standard for confirming/validating a specific short sequence; NGS = massively parallel, shorter reads, dramatically higher throughput, suited to whole-genome-scale sequencing.**

### CRISPR-Cas9: precise, programmable genome editing

**CRISPR-Cas9** repurposes a bacterial adaptive immune system (which normally recognises and cleaves invading phage DNA using stored sequence memory) into a programmable genome-editing tool. A synthetic **guide RNA (gRNA)**, designed to be complementary to the genomic target sequence, directs the **Cas9** nuclease to that specific site via RNA-DNA base pairing, where Cas9 creates a targeted double-strand break. The cell's own DNA repair machinery then resolves the break — via **NHEJ** (error-prone, often producing small insertions/deletions that disrupt the target gene — useful for gene knockout) or, if a repair template is supplied alongside, via **homologous recombination** (precise, allowing a specific designed sequence change to be introduced — see [DNA Repair & Recombination](../dna-repair-recombination/) for both repair pathways in full). CRISPR's defining advantage over older genome-editing methods is that target specificity is programmed simply by changing the guide RNA's sequence — no need to engineer a new protein for each new target, unlike earlier programmable nucleases (zinc-finger nucleases, TALENs), which required labour-intensive custom protein engineering for every new target site.

![CRISPR-Cas9 gene editing mechanism: Cas9 bound to a single guide RNA (sgRNA) targets genomic DNA at a PAM sequence, creating a double-stranded break; the break is resolved either by non-homologous end joining (NHEJ, disrupting the gene of interest via deletion or addition) or by homology-directed repair (HDR, correcting the gene of interest via insertion from a donor DNA template by homologous recombination)](/MCBBPICS/crispr-cas9-mechanism.jpg)
*Source: pmc.ncbi.nlm.nih.gov (PMC8571677) — confirm licensing basis before public deployment*

## Comparative Structures

| Blot type | Target molecule | Separation method | Probe type |
|---|---|---|---|
| Southern | DNA | Agarose gel electrophoresis | Complementary labelled DNA |
| Northern | RNA | Agarose gel electrophoresis (denaturing) | Complementary labelled RNA/DNA |
| Western | Protein | SDS-PAGE | Labelled antibody |

| Sequencing method | Throughput | Read length | Typical use |
|---|---|---|---|
| Sanger | Low (one sequence per reaction) | Long, high per-base accuracy | Validating/confirming a specific known-region sequence |
| Next-generation (NGS) | Very high (massively parallel) | Short, requires computational assembly | Whole-genome/transcriptome-scale sequencing |

## Common Exam Questions

- "Which blotting technique would you use to detect [DNA/RNA/protein]?" — direct application of the Southern/Northern/Western-to-target mapping; a frequent trick is asking about detecting whether a gene is being *transcribed* (Northern, RNA) versus whether a *specific allele/DNA sequence is present* (Southern, DNA) — easily confused if the molecule-type distinction isn't kept explicit.
- "Why does Taq polymerase specifically enable PCR, when standard DNA polymerases do not?" — the correct answer must cite heat stability surviving repeated 95°C denaturation cycles, not simply "it's a DNA polymerase."
- "Why do ddNTPs terminate Sanger sequencing reactions specifically?" — the missing 3′-OH group, required for the next phosphodiester bond, is the precise chemical mechanism expected in a complete answer.
- "What gives CRISPR-Cas9 its main practical advantage over zinc-finger nucleases/TALENs?" — reprogrammability via simple guide RNA sequence change, rather than requiring new protein engineering per target, is the expected specific answer.

## Visual Reference

**Interactive**

- A PCR cycle simulator: step through denaturation/annealing/extension across several cycles with a copy-number counter doubling each round, visually demonstrating exponential amplification from a single starting template.

{{< iframe src="/pcr-cycle-simulator.html" title="PCR Cycle Simulator" height="380px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A researcher wants to determine whether a specific gene is being actively transcribed in a tissue sample, and separately wants to confirm the exact DNA sequence of that gene's promoter region in the same organism. Which two techniques from this page would address each question respectively, and why would the other technique not answer the first question?

<details>
<summary>Show answer</summary>

**Northern blot** addresses whether the gene is being actively transcribed — it detects and quantifies the specific mRNA transcript directly, which is present only if transcription is actually occurring. **Sanger sequencing** (or NGS) confirms the exact DNA sequence of the promoter region — it reads out nucleotide sequence directly, regardless of whether that region is currently being transcribed. A Southern blot would not answer the transcription question, since it detects DNA (which is present in the genome whether or not the gene is being transcribed) rather than RNA — Southern blot confirms a sequence/allele is *present*, not that it is currently *active*.
</details>

**2.** Explain why PCR would fail (or produce far lower yield) if a non-heat-stable DNA polymerase were used instead of Taq polymerase, referencing the specific step of the PCR cycle where the problem would occur.

**3.** A CRISPR-Cas9 experiment is performed with a guide RNA and Cas9, but no repair template is supplied alongside. Predict the most likely outcome at the target site, and explain which DNA repair pathway is responsible.
