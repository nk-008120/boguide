---
title: "Molecular Evolution & Neutral Theory"
weight: 6
description: "Kimura's neutral theory of molecular evolution, purifying vs. positive selection detected via dN/dS ratios, gene duplication and divergence, and horizontal gene transfer as a mechanism of molecular change outside vertical inheritance."
difficulty: "advanced"
prerequisites: ["Genetic-Drift-Gene-Flow-and-Mutation"]
syllabus_tags: ["IBO", "USABO", "evolution"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

[Genetic drift, gene flow, and mutation](../genetic-drift-gene-flow-and-mutation/) introduced mutation as the ultimate source of variation and drift as a non-selective mechanism of frequency change; this page combines the two into one of the most influential ideas in 20th-century evolutionary biology: that most molecular-level change is driven by drift acting on neutral mutations, not by natural selection at all. This is a different question from the one Biosystematics' [Molecular Systematics](../../4-biosystematics/molecular-systematics/) page addresses: that page applies the molecular clock as a *tool* for dating divergences and building trees; this page covers the underlying evolutionary theory of *why* molecular change accumulates at a roughly clock-like rate in the first place, and what that implies about how much of a genome's evolution is actually adaptive.

## Key Concepts

### The Neutral Theory of Molecular Evolution

**Motoo Kimura's neutral theory** (1968) proposes that the overwhelming majority of molecular-level changes fixed within a species over evolutionary time are **neutral or nearly neutral mutations** (no significant effect on fitness) fixed by **genetic drift**, rather than beneficial mutations fixed by natural selection. This was a genuinely radical claim relative to the pre-1968 assumption that most observed genetic differences between species must be adaptive, and Kimura's argument rested substantially on population-genetic theory: the vast majority of mutations affecting protein-coding sequence are either strongly deleterious (rapidly removed by **purifying selection**, also called negative selection) or effectively neutral, with truly beneficial mutations comprising only a small minority of all mutations that occur; so even though selection remains the dominant force shaping which mutations survive at all, *among mutations that do reach fixation*, neutral drift-driven fixation is proposed to dominate numerically. This directly explains why the [molecular clock](../../4-biosystematics/molecular-systematics/) works reasonably well as a dating tool: neutral mutations fix at a rate depending only on the mutation rate itself (not on population size or selection strength, a mathematical result derivable from drift theory), giving a roughly constant, clock-like rate of accumulation.

![Distribution of the fitness effect (s) of new mutations across several hypothetical models: a lethal class at s = -1, a broad deleterious range, a neutral peak concentrated at s = 0 (dashed line), and a small beneficial tail at s > 0, illustrating that neutral/nearly-neutral mutations occupy a real, substantial share of the overall distribution rather than being a negligible edge case](/EVOLUTIONPICS/neutral-theory-mutation-fitness-distribution.webp)
*Source: ResearchGate, fig. 2, "Hypothetical whole distributions of fitness effects"*

### Purifying vs. Positive Selection: the dN/dS Ratio

A widely used molecular test distinguishes which type of selection has acted on a protein-coding gene by comparing two categories of DNA substitution within codons:

- **Synonymous (silent) substitutions ($d_S$)**, a nucleotide change that does not alter the encoded amino acid (due to the redundancy of the genetic code), and is therefore invisible to selection acting on protein sequence, accumulating at a rate reflecting the neutral mutation rate alone.
- **Nonsynonymous substitutions ($d_N$)**: a nucleotide change that does alter the encoded amino acid, and is therefore directly visible to selection on the resulting protein.

Comparing the **$d_N/d_S$ ratio** for a gene reveals which selective regime has predominated: $d_N/d_S \ll 1$ indicates **purifying selection** (most amino-acid-changing mutations are being removed because they harm protein function, the typical pattern for essential, highly conserved genes, e.g. histone genes, among the most slowly evolving in the genome); $d_N/d_S \approx 1$ is consistent with the neutral theory's prediction for a gene under no significant selective constraint on its protein sequence; $d_N/d_S > 1$ indicates **positive (diversifying) selection** actively favoring amino-acid change (documented, for example, in genes involved in host-pathogen molecular arms races, such as some immune-recognition genes, and in reproductive proteins subject to sexual selection).

![Five worked codon-substitution examples (A-E) classifying different outcomes: a nonsense/termination substitution (UCG→UAG, serine to stop); a missense/nonsynonymous substitution changing the encoded amino acid (UGG→UUG, tryptophan to leucine); a multi-substitution example; a synonymous (silent) substitution preserving the encoded amino acid (ACC→ACU, both threonine); and a substitution changing one amino acid while others stay fixed.](/EVOLUTIONPICS/dn-ds-worked-example.jpg)
*Source: ScienceDirect Topics page, "Nonsynonymous Substitution"*

### Gene Duplication and Divergence

**Gene duplication** (an entire gene copied within the genome, via unequal crossing-over or whole-genome duplication events) is a major source of genuinely new genetic material, since a duplicated gene copy is temporarily redundant and therefore free from the purifying selection that would normally constrain any change to a single-copy essential gene. Following duplication, the two paralogous copies typically follow one of several fates: one copy retains the ancestral function while the other accumulates disabling mutations and becomes a **pseudogene** (see the *GULOP* example in [Evidence for Evolution](../../15-evolution/Evidence-for-Evolution/)); one copy retains the ancestral function while the other, freed from constraint, accumulates changes that happen to confer a new function (**neofunctionalization**, the vertebrate globin gene family, with distinct duplicated genes now specialized for oxygen transport at different developmental stages and tissue oxygen conditions, e.g. fetal vs. adult hemoglobin, is a well-documented case); or both copies degrade partially and jointly retain, between them, the full set of ancestral sub-functions that a single ancestral gene previously performed alone (**subfunctionalization**). Gene duplication is a primary mechanism by which genomes acquire new genes without any single mutation event having to invent a new function from scratch in one step.

![Five possible fates of a duplicated gene: (a) nonfunctionalization: one paralog accumulates disabling mutations and is lost (pseudogenization); (b) neofunctionalization, one paralog acquires a new function while the other retains the ancestral one; (c) subfunctionalization: both paralogs partially diverge, jointly retaining the ancestral function between them; (d) no functional divergence (genetic robustness), both paralogs remain redundant; (e) duplication of entire gene families, which can undergo concerted evolution and gene conversion across multiple copies](/EVOLUTIONPICS/gene-duplication-fates.webp)
*Source: ResearchGate, fig. 2, "Evolutionary fate of duplicated genes"*

![Evolutionary tree of the vertebrate globin gene family across eutherian, marsupial, monotreme, sauropsid, and amphibian lineages, showing gene duplication events (filled circles) and speciation events (diamonds) that produced the epsilon, gamma, delta, beta, and omega globin paralogs, with approximate dates (~170-370 mya). Note: this diagram documents the gene family's duplication and cross-species diversification history, it does not itself label which paralog is expressed at which developmental stage (embryonic/fetal/adult), the specific claim in the text above](/EVOLUTIONPICS/vertebrate-globin-gene-family.webp)
*Source: ResearchGate, fig. 3, "An evolutionary hypothesis regarding the evolution of the globin gene family"*

### Horizontal Gene Transfer

**Horizontal (lateral) gene transfer (HGT)** is the movement of genetic material between organisms other than by ordinary parent-to-offspring (vertical) inheritance, occurring via **conjugation** (direct cell-to-cell DNA transfer, often plasmid-mediated), **transformation** (uptake of free DNA from the environment), or **transduction** (bacteriophage-mediated transfer). HGT is common and evolutionarily significant primarily in **bacteria and archaea**, and is of major applied importance as the principal mechanism by which **antibiotic resistance genes** spread rapidly between bacterial lineages, including across different species, far faster than resistance could spread by mutation and vertical inheritance alone. As covered in [Molecular Systematics](../../4-biosystematics/molecular-systematics/), HGT is also a specific confound for tree-building: a gene tree built from a horizontally-transferred gene reflects that gene's individual transfer history rather than the organismal lineage history, which is why prokaryotic phylogeny at shallow depth is more accurately modeled as a reticulated network than a strictly bifurcating tree.

![Four mechanisms of horizontal gene transfer between bacterial cells: (A) conjugation: direct plasmid transfer from a donor to a recipient cell; (B) transformation, a recipient cell takes up free DNA from its environment; (C) transduction: bacteriophage particles carry bacterial DNA from a donor to a recipient cell; (D) vesiduction, donor-cell-derived extracellular vesicles (EVs) carrying DNA are taken up by a recipient cell, a fourth mechanism beyond the three described in the text](/EVOLUTIONPICS/horizontal-gene-transfer-mechanisms.webp)
*Source: ResearchGate, fig. 1, "Conjugation, transformation, transduction and vesiduction"*

## Comparative Structures

| Concept | What it measures/predicts | Selective regime implied |
|---|---|---|
| $d_N/d_S \ll 1$ | Amino-acid-changing substitutions rare relative to silent ones | Purifying (negative) selection |
| $d_N/d_S \approx 1$ | Amino-acid-changing and silent substitutions accumulate at similar rates | Neutral (no significant selective constraint) |
| $d_N/d_S > 1$ | Amino-acid-changing substitutions more common than silent ones | Positive (diversifying) selection |
| Gene duplication → pseudogenization | One paralog disabled, one retains function | Relaxed selection on the disabled copy |
| Gene duplication → neofunctionalization | One paralog gains a new function | Selection acting on the freed copy's new role |

## Common Exam Questions

- "Explain Kimura's central claim in the neutral theory of molecular evolution, and how it differs from assuming most fixed genetic differences between species are adaptive."
- "Explain why synonymous substitutions are considered a good baseline for the 'neutral' mutation rate when calculating dN/dS."
- "A gene has a dN/dS ratio of 4.5. Interpret this result in terms of the type of selection acting on the gene."
- "Distinguish neofunctionalization from subfunctionalization as possible outcomes following gene duplication."
- "Explain why horizontal gene transfer is a major concern in the spread of antibiotic resistance, and name one specific mechanism by which it occurs."
- "Explain why the neutral theory predicts a roughly constant molecular clock rate for a given gene, in terms of mutation rate and drift."

## Visual Reference

**Interactive**

- **dN/dS calculator and interpreter (HTML/JS, no new library)**, the user is given a short aligned codon sequence pair (ancestral vs. derived) and classifies each substitution as synonymous or nonsynonymous, then the tool computes the resulting dN/dS ratio and states the implied selective regime, turning the abstract ratio into a hands-on classification exercise.

{{< iframe src="/dnds-calculator.html" title="dN/dS calculator and interpreter" height="560px" >}}

- **Gene duplication fate simulator (SVG/JS)**, starting from one ancestral gene, the user selects a fate for each of two post-duplication paralogs (retain function, pseudogenize, neofunctionalize) across simulated generations, visualizing how the two copies' sequences diverge differently depending on the selective pressure (or lack of it) applied to each.

{{< iframe src="/gene-duplication-fate-simulator.html" title="Gene duplication fate simulator" height="480px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here)*

## Practice Problems

1. A gene shows a dN/dS ratio of 0.05. Explain what this implies about the strength and type of selection acting on the protein this gene encodes.
2. Explain why Kimura's neutral theory does not claim that natural selection is unimportant in evolution, despite proposing that most fixed molecular differences are due to drift.
3. Following a gene duplication event, one copy accumulates a premature stop codon early in the coding sequence. Predict the most likely fate of this copy and name it.
4. A bacterial strain rapidly acquires resistance to a new antibiotic within a single generation-equivalent timeframe, faster than would be expected from mutation and vertical inheritance alone. Propose the most likely mechanism and name one specific process by which it could occur.
5. Explain why comparing dN and dS separately, rather than just counting total substitutions, allows a researcher to distinguish positive selection from a simple increase in overall mutation rate.
