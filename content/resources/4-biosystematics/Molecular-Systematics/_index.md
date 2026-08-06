---
title: "Molecular Systematics"
weight: 4
description: "Building phylogenies from DNA and protein sequence data: alignment, the molecular clock, distance-based (UPGMA, neighbor-joining) versus character-based (maximum parsimony, maximum likelihood, Bayesian) tree-building methods, DNA barcoding, and the artifacts — long-branch attraction, horizontal gene transfer — that can mislead a molecular tree."
difficulty: "advanced"
prerequisites: ["Phylogenetic-Trees-Cladistics"]
syllabus_tags: ["IBO", "USABO", "biosystematics"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

[Phylogenetic Trees & Cladistics](../phylogenetic-trees-cladistics/) covered tree-building logic using any character type. This page applies that logic specifically to molecular data — DNA, RNA, and protein sequences — which now dominates real systematics work over morphological characters, because sequence data is far more abundant, is comparable across organisms with wildly different body plans (bacteria and whales share alignable genes even though they share almost no comparable morphology), and accumulates change at a roughly trackable rate. The core question throughout is the same as before (which tree requires the fewest/most probable set of changes to explain the data), but the data and methods available are richer, and richer in ways that introduce their own specific failure modes.

## Key Concepts

### Sequence Alignment

Before two sequences can be compared, corresponding positions must be identified — complicated by the fact that real lineages accumulate not just substitutions (one base swapped for another) but **insertions and deletions (indels)**, which shift everything downstream out of register unless corrected for. **Sequence alignment** inserts gap characters into one or both sequences so that homologous positions (nucleotides/amino acids descended from the same ancestral position) line up in the same column. Once aligned, each column of the alignment becomes a "character" in the same sense as the morphological characters on the previous page, each aligned base/residue is that taxon's "character state," and the same synapomorphy-based logic applies — a shared derived substitution at a given aligned position is evidence for grouping the taxa that share it.

### The Molecular Clock

Neutral mutations (those with no fitness effect) accumulate in a genome at a roughly constant rate over time within a given gene, because their fixation is governed by genetic drift rather than selection — this is the **molecular clock** hypothesis. If the clock rate for a given gene is calibrated against at least one known divergence date (typically from the fossil record), the number of sequence differences between two living taxa can be used to *estimate* how long ago their lineages diverged, turning a tree's branching order (which cladistics alone provides) into a tree with actual time-calibrated branch lengths (a **chronogram**, introduced on the previous page). The clock is not perfectly constant, however — mutation rate varies by gene, by lineage (generation time and metabolic rate both affect it), and by genomic region (coding vs. non-coding, functionally constrained vs. free to vary) — so real molecular-clock analyses use **relaxed clock models** allowing rate to vary across branches, rather than assuming one fixed global rate.

### Distance-Based Tree-Building Methods

These methods first reduce the full alignment to a single **pairwise distance** (a measure of total sequence difference) between every pair of taxa, then build a tree from that distance matrix alone, discarding the individual-column character information:

- **UPGMA** (Unweighted Pair Group Method with Arithmetic Mean) — repeatedly clusters the two taxa/clusters with the smallest pairwise distance, then recalculates distances to the new cluster as an average. Simple and fast, but assumes a constant molecular clock (equal evolutionary rate on every branch) — when that assumption is violated (common in real data), UPGMA can produce a wrong topology even from otherwise-good data.
- **Neighbor-joining (NJ)** — also builds from a distance matrix, but explicitly corrects for unequal rates across lineages rather than assuming a constant clock, generally making it more reliable than UPGMA on real-world data while remaining computationally fast.

### Character-Based Tree-Building Methods

These retain the full aligned character matrix (every column) rather than collapsing it to pairwise distances first:

- **Maximum parsimony** — the same principle as the previous page, applied directly to aligned sequence columns: the tree requiring the fewest total substitutions is preferred.
- **Maximum likelihood (ML)** — evaluates, for a given tree and an explicit statistical model of how sequences evolve (a substitution model specifying the relative rate of each type of base change), the *probability* of observing the actual data if that tree were true, then searches for the tree maximizing this probability. Unlike parsimony, ML can explicitly account for the fact that some substitutions (e.g. multiple hits at the same site over long timescales) are more likely than others, making it more statistically robust on deeply diverged sequences — at significant computational cost.
- **Bayesian inference** — closely related to ML, but instead of finding the single most-likely tree, it computes a full posterior probability distribution over many possible trees (combining the likelihood with a prior probability), and reports each candidate topology's proportion of support (a **posterior probability**) rather than a single best answer — this is why Bayesian phylogenetics papers report a specific numeric confidence value per node rather than a single fixed diagram claimed as fact.

### DNA Barcoding

A specific, practical application of molecular systematics for rapid species identification (relevant to IBO practical-style questions): a short, standardized gene region — most commonly the mitochondrial **COI (cytochrome c oxidase subunit I)** gene in animals — is sequenced from an unknown sample and compared against a reference database of known-species sequences for that same region. COI works well as a barcode because it's present in essentially all animals, varies enough between species to discriminate them reliably, but is conserved enough within a species that **PCR primers** designed against it work broadly across taxa without redesign. Plants use different barcode regions (commonly *rbcL* and *matK*, both chloroplast genes) since COI evolves too slowly in plants to be discriminating.

### Artifacts That Mislead Molecular Trees

Two specific failure modes are worth knowing by name, since they explain *why* a molecular tree can confidently report a wrong topology rather than simply being noisy:

- **Long-branch attraction (LBA)** — two unrelated lineages that both evolve rapidly (long branches, many substitutions) can independently accumulate the *same* substitution by chance at a given site, purely because there are only four possible nucleotide states to converge on — parsimony and, to a lesser extent, distance methods can then mistakenly group these two fast-evolving lineages together as if closely related, when the resemblance is actually convergent noise. ML and Bayesian methods, because they explicitly model multiple-hit probability, are comparatively more resistant to LBA than parsimony.
- **Horizontal gene transfer (HGT)** — a gene physically moves between distantly related lineages (via conjugation, transformation, or transduction — common in bacteria and archaea) rather than being passed only vertically parent-to-offspring. A tree built from a horizontally-transferred gene reflects that gene's own individual transfer history, not the organism's overall lineage history — this is why robust microbial phylogenies compare results across *multiple, independent* genes rather than trusting any single gene tree, and why "the tree of life" for prokaryotes is more accurately described as a heavily reticulated network in its lower branches, not a strictly bifurcating tree.

## Comparative Structures

| Method | Uses | Handles unequal rates? | Output |
|---|---|---|---|
| UPGMA | Pairwise distance matrix | No (assumes constant clock) | Single tree |
| Neighbor-joining | Pairwise distance matrix | Yes | Single tree |
| Maximum parsimony | Full character matrix | Not explicitly | Single (most parsimonious) tree |
| Maximum likelihood | Full character matrix + substitution model | Yes (modeled explicitly) | Single (most likely) tree |
| Bayesian inference | Full character matrix + substitution model + prior | Yes | Distribution of trees + posterior probabilities |

## Common Exam Questions

- "Explain why UPGMA can produce an incorrect tree topology when lineages evolve at unequal rates, and why neighbor-joining is more robust to this problem."
- "Distinguish maximum likelihood from maximum parsimony in terms of what each method is actually optimizing."
- "Explain what a posterior probability value at a node in a Bayesian phylogenetic tree represents."
- "Explain the mechanism of long-branch attraction and why it can specifically mislead maximum parsimony analyses."
- "Explain why a gene tree built from a single horizontally-transferred gene may not reflect the true organismal phylogeny, and what a systematist should do to guard against this."
- "Explain why COI is used as a barcoding gene for animal species identification, and why plant barcoding uses different marker genes instead."

## Visual Reference

**Interactive**

- **Sequence alignment and tree-building walkthrough (interactive SVG/JS, no new library)** — the user is given 4-5 short unaligned sequences, aligns them by dragging in gap characters, then watches a distance matrix populate and a UPGMA/NJ tree assemble from it step by step, making the abstract "distance matrix → tree" pipeline into something built rather than asserted.
{{< iframe src="/sequence-alignment-tree-walkthrough.html" title="Sequence Alignment & Tree-Building Walkthrough" height="560px" >}}
- **Long-branch attraction demonstrator (Plotly or SVG/JS simulation)** — a simulated 4-taxon tree with two adjustable branch-length sliders; as the user lengthens two non-sister branches, the tool shows parsimony increasingly (and eventually incorrectly) grouping them together, visually demonstrating the LBA artifact as a direct consequence of branch length rather than a described abstraction.
{{< iframe src="/long-branch-attraction-demonstrator.html" title="Long-Branch Attraction Demonstrator" height="480px" >}}

**Static**

- Sequence alignment diagram showing an indel-induced frameshift before and after gap-character correction, aligned columns highlighted
- Molecular clock diagram: a calibrated chronogram with a fossil calibration point marked and branch lengths in millions of years
- Side-by-side diagram contrasting a UPGMA tree and a neighbor-joining tree built from the identical (rate-heterogeneous) distance matrix, showing where they diverge
- Long-branch attraction diagram: true tree vs. incorrectly-inferred tree for the same two fast-evolving lineages
- Horizontal gene transfer diagram showing a reticulated (network, not strictly bifurcating) prokaryotic phylogeny with individual HGT events marked as cross-branch arrows

## Practice Problems

1. Explain why sequence alignment is a necessary step before any of the tree-building methods on this page can be applied to raw DNA sequences.
2. A gene's substitution rate is calibrated against a fossil-dated divergence of 40 million years ago. Explain, in general terms, how this calibration allows the same gene to estimate the divergence time of a different, uncalibrated pair of taxa.
3. Two fast-evolving, distantly related lineages are grouped together in a maximum-parsimony tree but not in a maximum-likelihood tree built from the same alignment. Propose an explanation.
4. Explain why a Bayesian phylogenetic tree reports numeric support values at each node while a single maximum-parsimony tree typically does not.
5. A bacterial gene tree built from a plasmid-encoded antibiotic-resistance gene disagrees sharply with the tree built from that same bacterium's ribosomal RNA gene. Propose the most likely explanation.
