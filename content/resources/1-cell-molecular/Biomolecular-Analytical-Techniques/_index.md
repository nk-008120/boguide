---
title: "Biomolecular Analytical Techniques"
weight: 23
description: "Gel electrophoresis (SDS-PAGE, native PAGE, agarose), chromatography (size-exclusion, ion-exchange, affinity), spectrophotometric quantification, and detergent-based membrane protein extraction — the wet-lab techniques used to separate, purify, and quantify proteins."
difficulty: "intermediate"
prerequisites: ["Protein-Structure-Folding-Function"]
syllabus_tags: ["IBO", "USABO", "biochemistry", "laboratory-technique"]
---

{{< topic-meta >}}

## Overview

Olympiad practical exams routinely test technique *choice* — given a purification or analysis goal, pick and justify the right method — more than technique trivia. This page covers the core protein-analysis toolkit: electrophoresis (how it separates, and what "native" vs. "denaturing" actually changes), the three major chromatography modes and what property each separates on, spectrophotometric quantification, and how detergent choice determines whether a membrane protein extraction preserves native function. For nucleic-acid-specific techniques (blotting, PCR, sequencing), see [Recombinant DNA & Biotechnology Techniques](../recombinant-dna-biotechnology-techniques/) — this page is protein-focused.

## Key Concepts

### SDS-PAGE: denaturing electrophoresis by size alone

**SDS-PAGE** (sodium dodecyl sulfate–polyacrylamide gel electrophoresis) separates proteins almost purely by **molecular size**, not native charge or shape. SDS is an anionic detergent that (1) denatures proteins, unfolding tertiary/quaternary structure, and (2) coats the unfolded polypeptide with a uniform negative charge roughly proportional to its length — this second effect is what makes size, not intrinsic charge, the dominant determinant of migration rate. Samples are typically also treated with a reducing agent (e.g. β-mercaptoethanol or DTT) to break disulfide bonds, fully separating multi-chain or disulfide-linked proteins into their individual polypeptides. Smaller polypeptides migrate faster through the polyacrylamide mesh toward the anode; comparing migration distance to a ladder of known-size marker proteins gives an estimated molecular weight.

![SDS-PAGE infographic: SDS denatures and uniformly negatively charges proteins, samples are loaded into wells above a stacking gel and resolving gel, current drives migration toward the anode with smaller proteins moving farther, and band position is compared against a protein ladder to estimate molecular weight](/MCBBPICS/sds-page-gel-diagram.jpg)
*Source: AI-generated (Grok)*

### Native PAGE: preserving structure and function

**Native PAGE** omits SDS and reducing agent, so proteins retain their folded, native conformation, native charge, and any quaternary assemblies (e.g. a tetramer runs as one band, not four). Separation now depends on a combination of size, shape, *and* intrinsic charge — messier to interpret for pure size determination, but essential when the goal is preserving activity (e.g. a subsequent in-gel enzyme activity assay, which requires the enzyme to still be folded and catalytically competent).

### Agarose gel electrophoresis: the nucleic acid analogue

For nucleic acids, **agarose gel electrophoresis** plays a directly analogous role to SDS-PAGE: DNA/RNA's sugar-phosphate backbone already carries a uniform negative charge (see [Nucleotide & Nucleic Acid Chemistry](../nucleotide-nucleic-acid-chemistry/)), so no denaturing detergent is needed for size-based separation — fragments separate by size through the agarose mesh directly, visualised with an intercalating dye (e.g. ethidium bromide) under UV light.

### Chromatography: three modes, three different separating properties

Unlike electrophoresis (always separating by migration through a matrix under an electric field), chromatography techniques separate based on differential interaction between a mobile phase (the sample in solution) and a stationary phase (the column matrix) — and different chromatography types exploit entirely different molecular properties:

- **Size-exclusion (gel filtration) chromatography**: the stationary phase is a porous bead matrix. Smaller molecules enter the pores and take a longer, indirect path through the column; larger molecules are excluded from the pores and pass through faster. Counterintuitively, **larger molecules elute first**.

![Size-exclusion chromatography schematic: a mixed sample of large, medium, and small molecules enters a column packed with porous beads; large molecules bypass the pores and elute first, medium molecules partially enter pores and elute next, small molecules enter the most pores and elute last](/MCBBPICS/size-exclusion-chromatography.webp)
*Source: astorscientific.us*

- **Ion-exchange chromatography**: the stationary phase carries a fixed charge (positive = anion exchange, binds negatively charged proteins; negative = cation exchange, binds positively charged proteins). Bound proteins are eluted by a rising salt gradient, which progressively out-competes the protein-matrix ionic interaction — proteins elute roughly in order of increasing net charge magnitude.

![Ion-exchange chromatography principle: a protein mixture loaded onto a column of charged polymer beads; positively charged protein binds a negatively charged bead while negatively charged protein flows through unbound, with proteins eluting at different rates depending on net charge](/MCBBPICS/ion-exchange-chromatography.jpg)
*Source: biochemden.com*

- **Affinity chromatography**: the stationary phase carries a ligand that binds one specific target with high specificity (e.g. a Ni²⁺ resin for a His-tagged recombinant protein, or an antibody for its antigen). This is the most selective single-step purification method, isolating one protein from a complex mixture in one pass, provided the target carries (or has been engineered to carry) the appropriate tag/epitope.

### Spectrophotometric quantification

Protein or nucleic acid concentration is routinely estimated from **UV absorbance**: nucleic acids absorb strongly at 260 nm (from the aromatic bases), proteins at 280 nm (predominantly from Trp and Tyr residues — see the aromaticity ranking Phe > Trp > Tyr > His in [Amino Acids & Protein Chemistry Fundamentals](../amino-acids-protein-chemistry/), which is exactly why A₂₈₀ correlates with Trp/Tyr content rather than total protein mass alone). The **A₂₆₀/A₂₈₀ ratio** is a standard nucleic acid purity check: pure DNA gives ≈1.8, pure RNA ≈2.0; a lower ratio signals protein contamination, since protein absorbs relatively more at 280 nm than 260 nm.

### Choosing an extraction method for membrane proteins

Extracting an **integral membrane protein** while preserving native structure (for a subsequent functional assay) requires disrupting the lipid bilayer around it without denaturing the protein itself. **Non-ionic detergents** (e.g. Triton X-100) insert into the membrane and solubilise the surrounding lipid without denaturing the protein — the correct first choice for a native functional extraction. By contrast, **SDS** is a strong ionic denaturant (the same reagent used deliberately to unfold proteins in SDS-PAGE above) and **urea** is a chaotropic denaturant — both destroy native structure, making them unsuitable when function must be preserved, even though both would technically extract the protein from the membrane. High salt concentration disrupts only ionic (electrostatic) interactions and does not solubilise a lipid-embedded integral membrane protein at all — it is the correct choice for eluting *peripheral* membrane proteins that are ionically associated with the membrane surface, not integral ones.

## Comparative Structures

| Technique | Separates by | Native or denaturing? | Typical use |
|---|---|---|---|
| SDS-PAGE | Size only | Denaturing | Estimating polypeptide molecular weight, checking sample purity/composition |
| Native PAGE | Size + shape + native charge | Native | Preserving quaternary structure/activity for downstream assay |
| Agarose gel electrophoresis | Size (nucleic acids) | N/A (already uniformly charged) | Sizing/visualising DNA or RNA fragments |
| Size-exclusion chromatography | Molecular size (inverse — large elutes first) | Native (typically) | Buffer exchange, estimating native molecular weight, removing aggregates |
| Ion-exchange chromatography | Net surface charge | Native (typically) | Purifying by charge difference from contaminants |
| Affinity chromatography | Specific binding interaction | Native (typically) | High-specificity single-step purification (e.g. tagged recombinant protein) |

## Common Exam Questions

- "A protein runs at a different apparent size on native PAGE vs. SDS-PAGE — explain why." — tests whether you understand that SDS-PAGE reports subunit size while native PAGE can report the full oligomeric assembly (or a shape/charge-distorted apparent size), not that one method is simply "wrong."
- "Which chromatography mode would best purify a His-tagged recombinant protein from a crude bacterial lysate in one step?" — affinity chromatography (Ni²⁺ resin), because it directly exploits the engineered tag rather than a native, potentially non-unique physical property.
- Extraction/solubilisation questions (as in Practice Problem 1 below) consistently test the *native vs. denaturing* distinction across techniques — recognise that SDS, urea, and high heat are denaturants regardless of which specific technique they appear in.

## Visual Reference

**Interactive**

- A chromatography mode selector: given a purification goal (e.g. "isolate a His-tagged protein from a lysate," "estimate native molecular weight," "separate proteins differing mainly in surface charge"), choose the correct technique and see the separation animated.

{{< iframe src="/chromatography-mode-selector.html" title="Chromatography Mode Selector" height="440px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1. Membrane protein extraction.** A researcher wants to extract an integral membrane protein while preserving its native folded structure for a functional assay. Which of the following is the most appropriate first choice: 1% SDS, 8 M urea, 1% Triton X-100 (a non-ionic detergent), or high salt concentration (2 M NaCl)?

<details>
<summary>Show answer</summary>

**1% Triton X-100.** Non-ionic detergents disrupt the lipid bilayer by inserting into it, releasing integral membrane proteins without denaturing them. SDS and urea are both strong denaturants (ionic and chaotropic, respectively) that would destroy native structure. High salt disrupts only ionic interactions and would not solubilise an integral (lipid-embedded) membrane protein at all — it releases peripheral membrane proteins instead.
</details>

**2.** A protein sample gives an A₂₆₀/A₂₈₀ ratio of 1.3, well below the ~1.8 expected for pure DNA. Propose the most likely explanation, and describe one purification step that would improve this ratio.

**3.** You need to purify a native (fully folded, active) tetrameric enzyme away from a mixture also containing free monomeric subunits of the same protein and several unrelated contaminant proteins of similar size. Which single technique from this page separates the intact tetramer from its own free monomers most directly, and why would SDS-PAGE alone fail to answer this specific question?
