---
title: "DNA Structure & Replication"
weight: 9
description: "The Watson-Crick double helix, why replication must be semiconservative, and the full replication fork machinery — helicase, primase, DNA polymerase, and the leading/lagging strand asymmetry that follows directly from strand polarity."
difficulty: "intermediate"
prerequisites: ["Nucleotide-Nucleic-Acid-Chemistry", "Cell-Cycle-Mitosis-Meiosis"]
syllabus_tags: ["IBO", "USABO", "molecular-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

This page opens the Molecular Biology tier by covering how DNA is physically organised into a double helix, and the enzymatic machinery that copies it during S phase (see [Cell Cycle, Mitosis & Meiosis](../cell-cycle-mitosis-meiosis/)). The chemistry of the nucleotides and phosphodiester backbone this page assumes is covered in [Nucleotide & Nucleic Acid Chemistry](../nucleotide-nucleic-acid-chemistry/); this page focuses on the higher-order double-helix structure and the replication process itself.

## Key Concepts

### The Watson-Crick double helix

DNA's two strands run **antiparallel** (one 5′→3′, the other 3′→5′, running in opposite directions relative to each other) and wind around a common axis into a right-handed double helix, held together by two forces: **hydrogen bonding** between complementary base pairs (A–T, G–C — see [Nucleotide & Nucleic Acid Chemistry](../nucleotide-nucleic-acid-chemistry/) for why only these pairings work chemically) running perpendicular to the helix axis, and **base stacking** (van der Waals/hydrophobic interactions between adjacent stacked bases) running parallel to it — base stacking actually contributes more to overall helix stability than hydrogen bonding alone, a frequently underappreciated point. The antiparallel arrangement is not incidental — it is a direct structural requirement for complementary base pairing to work geometrically at all, and it is the root cause of the leading/lagging strand asymmetry described below.

![The B-DNA double helix (left) alongside a flattened base-pairing diagram showing antiparallel 5'→3' / 3'→5' strand orientation, A-T and G-C hydrogen bonding, and the sugar-phosphate backbone](/MCBBPICS/watson-crick-double-helix.jpg)
*Source: biology.stackexchange.com (originally fastbleep.com)*

### Why replication must be semiconservative

DNA replication produces two daughter molecules, each consisting of **one original (template) strand and one newly synthesised strand** — the **semiconservative** model, directly confirmed by the classic Meselson-Stahl density-gradient experiment (¹⁵N/¹⁴N isotope labelling), which distinguished it from two rival hypotheses: **conservative** replication (the original double helix stays fully intact, and an entirely new double helix is synthesised alongside it) and **dispersive** replication (both daughter molecules are a patchwork mixture of old and new DNA). Semiconservative replication is a direct mechanistic consequence of the fact that each template strand is individually read and directly base-paired against as the new strand is built — there is no step in the actual polymerisation mechanism that would produce either of the two rival patterns.

![Meselson-Stahl density-gradient results across four hypothetical scenarios: both strands light, both strands heavy, a light/light + heavy/heavy mixture, and a light/heavy hybrid — the single intermediate band (light/heavy) is the actual observed result supporting semiconservative replication](/MCBBPICS/meselson-stahl-density-gradient.png)
*Source: biology.arizona.edu*

### Origins of replication and the replication fork

Replication begins at specific **origin of replication** sequences, where initiator proteins recruit **helicase**, which unwinds the double helix, separating the two strands and creating a **replication fork** — the physical Y-shaped junction where unreplicated double-stranded DNA opens into two single-stranded templates. **Single-strand binding proteins (SSBs)** coat the exposed single strands, preventing them from re-annealing or forming secondary structures before replication machinery reaches them. Ahead of the fork, unwinding introduces mechanical torsional strain (supercoiling) into the still-double-stranded DNA, relieved by **topoisomerases**, which transiently cut and reseal the DNA backbone to release this strain.

### DNA polymerase: capabilities and constraints

**DNA polymerase** synthesises new DNA by adding nucleotides complementary to the template strand, but is constrained by two fixed properties that shape everything downstream:

1. It synthesises **only in the 5′→3′ direction**, reading the template 3′→5′.
2. It **cannot initiate a new strand from scratch** — it can only extend an existing 3′-OH end, meaning every new strand (or fragment) requires a short pre-existing primer to begin from.

**Primase**, an RNA polymerase, solves the second constraint by synthesising a short **RNA primer** complementary to the template, providing the free 3′-OH end DNA polymerase requires to begin extension. This primer is later removed and replaced with DNA (see below).

### Leading and lagging strands: the direct consequence of antiparallel geometry

Because the two template strands run in opposite directions, but DNA polymerase can only synthesise 5′→3′, the two new strands **cannot both be synthesised continuously in the same direction the fork is opening**:

- The **leading strand** is synthesised continuously, in the same direction the replication fork is moving, needing only a single primer at the origin.
- The **lagging strand** must be synthesised discontinuously, in short **Okazaki fragments**, each primed separately (new primer, new fragment) and each synthesised 5′→3′ but in the direction *opposite* to overall fork movement — because the template strand it's copying runs the "wrong way" relative to the fork.

This asymmetry is entirely a geometric consequence of DNA polymerase's fixed directionality meeting the antiparallel structure of the double helix — it is not an arbitrary or separately-evolved mechanism. On the lagging strand, RNA primers are subsequently removed and replaced with DNA (by a polymerase with 5′→3′ exonuclease activity, e.g. DNA polymerase I in bacteria) and the resulting nicks between adjacent Okazaki fragments are sealed by **DNA ligase**, forming a continuous strand.

![Full replication fork: helicase and topoisomerase/gyrase unwind parental DNA ahead of the fork, single-stranded binding protein coats exposed template, primase lays RNA primers, DNA polymerase III synthesises the leading strand continuously and the lagging strand as discrete Okazaki fragments (each on its own sliding clamp), DNA polymerase I replaces RNA primers with DNA, and ligase seals the remaining nicks — with an inset showing the overall bidirectional fork geometry from a single origin](/MCBBPICS/replication-fork-diagram.png)
*Source: wou.edu (Chemistry/Biochemistry course materials)*

### Proofreading and fidelity

DNA polymerase's overall low error rate comes from two layered mechanisms: **selective nucleotide binding** (correct Watson-Crick geometry is strongly preferred in the polymerase active site) and, when an incorrect nucleotide is nonetheless incorporated, **3′→5′ exonuclease proofreading activity**, which detects the resulting geometric distortion, excises the mismatched nucleotide, and allows the polymerase to try again — a real-time editing function distinct from the post-replication mismatch repair covered in [DNA Repair & Recombination](../dna-repair-recombination/), which catches errors that slip past proofreading entirely.

## Comparative Structures

| Feature | Leading strand | Lagging strand |
|---|---|---|
| Synthesis pattern | Continuous | Discontinuous (Okazaki fragments) |
| Number of primers needed | One (at the origin) | Many (one per fragment) |
| Direction relative to fork movement | Same direction | Opposite direction (net) |
| Enzymes uniquely required | — | DNA ligase (fragment joining), 5′→3′ exonuclease (primer removal) |

| Replication model | Prediction | Outcome of Meselson-Stahl experiment |
|---|---|---|
| Conservative | One fully old + one fully new daughter molecule | Not observed |
| Semiconservative | Both daughters are old/new hybrids | **Observed — confirmed model** |
| Dispersive | Both daughters are patchworks of old/new DNA within each strand | Not observed |

## Common Exam Questions

- "Why does the lagging strand require Okazaki fragments at all?" — the complete answer traces directly back to DNA polymerase's fixed 5′→3′-only synthesis direction meeting the antiparallel template — a question asking "why" here wants the mechanistic chain, not just the definition of an Okazaki fragment.
- "What would you predict for the Meselson-Stahl experiment's outcome under each replication model, and how did the observed result distinguish semiconservative from the alternatives?" — a frequently reconstructed classic-experiment reasoning question.
- Distinguishing polymerase **proofreading** (real-time, during synthesis, 3′→5′ exonuclease) from **mismatch repair** (post-synthesis, a separate pathway covered in [DNA Repair & Recombination](../dna-repair-recombination/)) is a common source of confusion worth explicitly separating.

## Visual Reference

**Interactive**

- A replication fork step-through animation: helicase unwinding, SSB coating, primase laying a primer, and leading/lagging strand synthesis proceeding in real time, with Okazaki fragment formation and ligation visibly distinct from continuous leading-strand synthesis.

{{< iframe src="/replication-fork-stepper.html" title="Replication Fork Step-Through" height="420px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Note: the double-helix image has some visible annotation artifacts — see the inline note.)*

## Practice Problems

**1.** A researcher performs the Meselson-Stahl experiment but observes, after one generation of replication in ¹⁴N medium following growth in ¹⁵N medium, a single intermediate-density band rather than two separate bands (one fully heavy, one fully light). Which replication model does this result support, and which two models does it rule out?

<details>
<summary>Show answer</summary>

This result supports the **semiconservative** model. A single intermediate-density band after one generation means every daughter molecule is a hybrid of one heavy (¹⁵N, old) and one light (¹⁴N, new) strand — exactly the semiconservative prediction. It rules out the conservative model (which predicts two distinct bands: one fully heavy, one fully light) and is also inconsistent with dispersive replication only once a *second* round of replication is examined (dispersive replication also gives one intermediate band after one generation, but predicts a shifting single band of decreasing density over further generations rather than two distinct bands — the true experiment required a second generation's data to fully rule out dispersive replication, worth noting if a question specifically asks how conservative vs. dispersive were distinguished).
</details>

**2.** A mutant DNA polymerase completely lacks 3′→5′ exonuclease proofreading activity but is otherwise fully functional. Predict the effect on replication fidelity, and explain why this defect would not be expected to abolish replication entirely.

**3.** Explain why a primer — rather than DNA polymerase initiating synthesis directly — is required at the start of every Okazaki fragment, using DNA polymerase's specific catalytic limitation.
