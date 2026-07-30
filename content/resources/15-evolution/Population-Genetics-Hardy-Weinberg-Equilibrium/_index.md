---
title: "Population Genetics & Hardy-Weinberg Equilibrium"
weight: 3
description: "Allele and genotype frequencies, the Hardy-Weinberg equation and its five underlying assumptions, and how deviation from Hardy-Weinberg equilibrium is used to detect that evolution is acting on a real population."
difficulty: "intermediate"
prerequisites: ["Evidence-for-Evolution"]
syllabus_tags: ["IBO", "USABO", "evolution"]
---
{{< topic-meta >}}

## Overview

Evolution, defined precisely at the population level, is a **change in allele frequencies in a population over time** — not a change in any single individual. This page introduces the mathematical baseline against which that change is measured: the **Hardy-Weinberg equilibrium**, a null model describing what allele and genotype frequencies would look like if no evolution were occurring at all. Every later mechanism page in this section — [Natural Selection](../Natural-Selection-Modes-and-Fitness/), [Genetic Drift, Gene Flow & Mutation](../Genetic-Drift-Gene-Flow-and-Mutation/) — is best understood as a specific, named way of violating one of this page's five assumptions, so the exam skill this page builds is less "memorize the equation" and more "identify which assumption a described scenario violates."

## Key Concepts

### Allele and Genotype Frequencies

For a single gene locus with two alleles (conventionally **A** dominant and **a** recessive), the **allele frequency** of A is denoted **p** and of a is denoted **q**, and because these are the only two alleles at the locus, $p + q = 1$. **Genotype frequencies** describe the proportion of each genotype (AA, Aa, aa) in the population, and are distinct from allele frequencies — a common source of exam error is treating the two as interchangeable. Allele frequencies are calculated by counting alleles, not individuals: in a population of $N$ individuals, there are $2N$ total alleles at the locus (each individual is diploid), and $p$ is the count of A alleles divided by $2N$.

### The Hardy-Weinberg Equation

If a population is **not evolving** at a given locus, genotype frequencies are predicted directly from allele frequencies by simple probability (the chance of independently drawing two given alleles), giving the **Hardy-Weinberg equation**:

$$p^2 + 2pq + q^2 = 1$$

where $p^2$ is the predicted frequency of homozygous dominant (AA) individuals, $2pq$ is the predicted frequency of heterozygous (Aa) individuals (counting both the A-from-mother/a-from-father and a-from-mother/A-from-father combinations), and $q^2$ is the predicted frequency of homozygous recessive (aa) individuals. A population satisfying this equation, with allele and genotype frequencies remaining constant across generations, is said to be in **Hardy-Weinberg equilibrium (HWE)**. Critically, HWE is reached in a *single generation* of random mating given the assumptions below, regardless of the starting genotype frequencies — HWE describes an equilibrium *ratio*, not a claim that frequencies never change from an arbitrary starting point over multiple generations.

### The Five Assumptions

The Hardy-Weinberg equation only holds, and equilibrium is only maintained across generations, if all five of the following are true simultaneously — and each one being violated corresponds to a specific real evolutionary mechanism covered elsewhere in this section:

| Assumption | If violated, corresponds to |
|---|---|
| No mutation | New alleles/allele conversion — see [Genetic Drift, Gene Flow & Mutation](../Genetic-Drift-Gene-Flow-and-Mutation/) |
| No gene flow (migration) | Allele frequency change via migration — same page as above |
| Infinitely large population (no genetic drift) | Genetic drift — same page as above |
| Random mating | Non-random mating (assortative mating, inbreeding) — changes genotype frequencies without changing allele frequencies |
| No natural selection | Differential survival/reproduction — see [Natural Selection: Modes & Fitness](../Natural-Selection-Modes-and-Fitness/) |

This table is the single most exam-relevant structure on this page: a question describing a specific real-world scenario (a new mutation appears; a dam blocks fish migration between two populations; a population crashes to a handful of survivors; individuals preferentially mate with similar-looking partners; a pesticide kills susceptible insects disproportionately) is almost always testing whether the assumption being violated can be correctly named.

### Using Hardy-Weinberg to Detect Evolution

Because HWE gives an exact quantitative prediction, it functions as a **null hypothesis**: real genotype frequencies are measured in a sampled population, compared against the HWE-predicted frequencies calculated from the same sample's observed allele frequencies, and a statistically significant deviation is evidence that one or more of the five assumptions is being violated — i.e., that evolution (or non-random mating) is actively occurring at that locus. This is a widely used real research technique, e.g. in medical genetics to screen for genotyping errors or selection at disease-associated loci, and a standard IBO/USABO calculation: given an observed count of each genotype, calculate $p$ and $q$ from the data, generate the HWE-predicted genotype counts, and compare.

### A Worked Numerical Example

A sample of 100 individuals is genotyped at a locus: 64 AA, 32 Aa, 4 aa. Allele frequency $p$ (for A) is calculated from total allele counts: $p = \frac{(64 \times 2) + 32}{200} = \frac{160}{200} = 0.8$, and $q = 1 - p = 0.2$. The HWE-predicted genotype frequencies are then $p^2 = 0.64$ (64 AA), $2pq = 2(0.8)(0.2) = 0.32$ (32 Aa), and $q^2 = 0.04$ (4 aa) — matching the observed counts exactly, so this particular sample is consistent with HWE at this locus. If the observed counts instead diverged substantially from these predicted values, that divergence itself would be the evidence that evolution (or non-random mating) is occurring.

## Comparative Structures

| Quantity | Symbol | What it measures |
|---|---|---|
| Dominant allele frequency | $p$ | Proportion of A alleles in the gene pool |
| Recessive allele frequency | $q$ | Proportion of a alleles in the gene pool |
| Homozygous dominant genotype frequency | $p^2$ | Predicted proportion of AA individuals under HWE |
| Heterozygous genotype frequency | $2pq$ | Predicted proportion of Aa individuals under HWE |
| Homozygous recessive genotype frequency | $q^2$ | Predicted proportion of aa individuals under HWE |

## Common Exam Questions

- "Given genotype counts for a sample population, calculate the allele frequencies p and q."
- "Given allele frequencies p and q, calculate the predicted genotype frequencies under Hardy-Weinberg equilibrium."
- "List the five assumptions required for a population to remain in Hardy-Weinberg equilibrium."
- "A population experiences a sudden, drastic reduction in size due to a natural disaster. Which Hardy-Weinberg assumption is violated, and what evolutionary mechanism does this correspond to?"
- "Explain why observed genotype frequencies significantly deviating from Hardy-Weinberg-predicted frequencies is used as evidence that a population is evolving at that locus."
- "Explain why non-random mating (e.g. inbreeding) can change genotype frequencies without necessarily changing allele frequencies."

## Visual Reference

**Interactive**

- **Hardy-Weinberg calculator (HTML/JS, no new library)** — the user inputs either genotype counts (to compute p, q, and compare observed vs. predicted frequencies) or a value of p directly (to compute predicted p², 2pq, q²), with a live bar chart comparing observed and HWE-predicted genotype proportions.
- **Assumption-violation scenario matcher (click-through quiz, HTML/JS)** — a series of short scenario descriptions (a new mutation, a flood isolating two subpopulations, a population bottleneck, assortative mating, a selective pesticide) are matched by the user to the specific Hardy-Weinberg assumption each violates, with the corresponding evolutionary mechanism page linked on a correct answer.

**Static**

- Hardy-Weinberg equation with each term ($p^2$, $2pq$, $q^2$) labeled against a Punnett-square-style diagram showing where each combination comes from
- Worked numerical example (as in the text) shown as a step-by-step calculation graphic
- Five-assumptions table (as above) rendered as a standalone reference graphic
- Bar chart comparing observed vs. HWE-predicted genotype frequencies for both an equilibrium and a non-equilibrium example population

## Practice Problems

1. In a population of 1,000 individuals, 810 are homozygous dominant (AA), 180 are heterozygous (Aa), and 10 are homozygous recessive (aa) for a given locus. Calculate p and q.
2. A recessive genetic disorder occurs in 1 in 10,000 individuals in a population assumed to be in Hardy-Weinberg equilibrium. Calculate the frequency of carriers (heterozygotes) in the population.
3. A population's observed heterozygote frequency is substantially lower than the Hardy-Weinberg-predicted 2pq value calculated from the same population's allele frequencies. Propose a specific, named non-random-mating explanation for this pattern.
4. A biologist wants to test whether a beetle population is evolving at a coat-color locus. Describe the specific comparison they would need to make, and what result would indicate evolution is occurring.
5. Explain, step by step, why Hardy-Weinberg equilibrium is reached after a single generation of random mating starting from any arbitrary initial genotype frequencies, as long as all five assumptions hold.
