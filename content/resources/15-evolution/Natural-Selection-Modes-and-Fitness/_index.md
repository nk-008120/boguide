---
title: "Natural Selection: Modes & Fitness"
weight: 4
description: "Fitness and relative fitness, the three modes of selection acting on continuous traits (directional, stabilizing, disruptive), adaptation vs. exaptation, and the trade-offs that keep selection from producing a single 'optimal' organism."
difficulty: "intermediate"
prerequisites: ["Population-Genetics-Hardy-Weinberg-Equilibrium"]
syllabus_tags: ["IBO", "USABO", "evolution"]
---
{{< topic-meta >}}

## Overview

[Hardy-Weinberg equilibrium](../Population-Genetics-Hardy-Weinberg-Equilibrium/) modeled a population with no natural selection acting on it; this page covers what happens once that assumption is dropped — the single evolutionary mechanism responsible for **adaptation**, the fit between an organism's traits and its environment. Exam questions on this page consistently supply a trait-distribution scenario (a population's beak-size histogram before and after a drought, a birth-weight distribution and infant survival) and require identifying which of three named modes of selection is acting and predicting the resulting shift in the trait distribution.

## Key Concepts

### Fitness and Relative Fitness

**Fitness**, in the strict evolutionary sense, is an individual's (or genotype's) reproductive contribution to the next generation relative to other individuals/genotypes in the population — not physical strength or health in the colloquial sense, and not survival alone: an organism that survives to old age but produces no offspring has zero fitness, while a short-lived organism that reproduces prolifically before dying has high fitness. **Relative fitness** ($w$) standardizes this by scaling the genotype with the highest reproductive output to $w = 1$, expressing every other genotype's fitness as a fraction of that maximum, which is the form fitness values are typically given in for calculation problems (e.g. a lethal recessive homozygote has $w = 0$). Selection acts on **heritable variation in fitness** specifically — a trait that affects survival/reproduction but has no genetic basis cannot respond to selection across generations, however strong its effect on any one individual.

### The Three Modes of Selection

For a continuously varying trait (one with a roughly normal/bell-curve distribution across a population, e.g. body size, beak depth, birth weight), selection falls into one of three named modes depending on which part of the distribution is favored:

- **Directional selection** — one extreme of the trait distribution is favored over the other, shifting the population mean toward that extreme over generations. The **Grants' long-term study of Galápagos medium ground finch (*Geospiza fortis*) beak depth** is the canonical field-documented case: a severe 1977 drought eliminated small, soft seeds, leaving mainly large, hard seeds that only deeper-beaked birds could efficiently crack, and the population's mean beak depth measurably increased in the very next generation as shallower-beaked birds disproportionately failed to survive and reproduce.
- **Stabilizing selection** — both extremes of the trait distribution are selected against, favoring the intermediate phenotype and *reducing* the population's overall variance without shifting the mean. **Human birth weight** is the standard example: both very low birth weight (associated with higher infant mortality from underdevelopment) and very high birth weight (associated with birth complications) show reduced survival relative to intermediate birth weights, so selection actively narrows the distribution around the intermediate optimum each generation.
- **Disruptive (diversifying) selection** — the intermediate phenotype is selected against while both extremes are favored, potentially splitting one population's trait distribution into two distinct peaks over time. **African seedcracker finch (*Pyrenestes ostrinus*) bill size** is a well-documented case: birds with small bills efficiently process soft seeds and birds with large bills efficiently process hard seeds, but intermediate-billed birds are relatively inefficient at both, producing a bimodal (two-peaked) bill-size distribution maintained within a single interbreeding population — disruptive selection is of particular exam interest because, given sufficient additional reproductive isolation between the two extremes (see [Speciation & Reproductive Isolation](../Speciation-and-Reproductive-Isolation/)), it is one plausible route toward sympatric speciation.

### Adaptation vs. Exaptation

An **adaptation** is a trait that increased in frequency because it was favored by selection *for the function it currently performs*. An **exaptation** (Stephen Jay Gould and Elisabeth Vrba's term) is a trait that originally evolved (or is retained) for one function, or no function at all, and is subsequently co-opted for a different function under new selective pressure — feathers are the standard textbook case, with strong comparative and fossil evidence that feathers first evolved in theropod dinosaurs for insulation and/or display (structurally and phylogenetically well before flight capability), and were only later co-opted for flight in the lineage leading to birds. Recognizing exaptation matters because it corrects a common intuitive error (assuming every trait's current function explains its evolutionary origin) — a trait's *current utility* is not evidence of what selective pressure originally produced it.

### Trade-offs and the Limits of Selection

Selection does not produce a single, unconstrained "optimal" organism, because favorable alleles/traits routinely come bundled with costs, limiting how far any one trait can be pushed by selection alone:

- **Antagonistic pleiotropy** — a single gene affects multiple traits in opposite fitness directions (e.g. a variant increasing early-life reproduction while accelerating late-life senescence); selection favoring the early-life benefit can fix the allele even though it carries a later cost, because early reproductive success has a larger effect on lifetime fitness.
- **Resource allocation trade-offs** — energy/resources devoted to one trait (larger antlers, brighter plumage, faster growth) are unavailable for another (immune function, predator vigilance, longevity), so selection on one trait routinely comes at a measurable cost to another.
- **Genetic constraints** — a trait combination that would be locally advantageous may simply not be reachable by available mutation and existing genetic architecture (e.g. pleiotropic linkage preventing two traits from varying independently), meaning selection can only act on the variation that actually exists in a population, not on a theoretical ideal.

Sexually selected traits (see [Mating Systems & Sexual Selection](../../9-ethology/Mating-Systems-Sexual-Selection/) for the full treatment of intersexual/intrasexual selection and parental investment theory) are a well-documented case of this kind of trade-off in action: a peacock's train measurably reduces flight performance and increases predation conspicuousness (a natural-selection cost) while increasing mating success (a sexual-selection benefit), with the trait's actual size in the population reflecting a balance between the two opposing pressures rather than either pressure acting unopposed.

## Comparative Structures

| Mode | Effect on trait distribution | Effect on mean | Effect on variance | Example |
|---|---|---|---|---|
| Directional | Shifts toward one extreme | Changes | Little change | Galápagos finch beak depth after drought |
| Stabilizing | Favors intermediate | No change | Decreases | Human birth weight |
| Disruptive | Favors both extremes | No change (or splits) | Increases (can become bimodal) | Seedcracker finch bill size |

## Common Exam Questions

- "A population's trait distribution narrows around the mean over several generations with no change in the mean itself. Identify the mode of selection acting."
- "Explain, using the 1977 Galápagos drought data, why Geospiza fortis beak depth increased in a single generation, and identify the mode of selection responsible."
- "Distinguish an adaptation from an exaptation, using the evolutionary history of feathers as an example."
- "Explain why relative fitness is expressed relative to the highest-fitness genotype rather than as an absolute reproductive count."
- "Explain how antagonistic pleiotropy can allow a genetically costly late-life trait to persist in a population despite reducing lifetime fitness in isolation."
- "Explain why disruptive selection acting on seedcracker finch bill size does not, by itself, guarantee that the population will split into two separate species."

## Visual Reference

**Interactive**

- **Selection mode simulator (Plotly)** — a normal-distribution trait histogram with an adjustable fitness function overlay (directional, stabilizing, or disruptive), animating how the population's trait distribution shifts across simulated generations under the user's chosen mode, making the abstract mean/variance predictions directly observable.
- **Fitness trade-off slider (HTML/JS, no new library)** — user adjusts a trait's investment level (e.g. ornament size) on a slider and sees two independently plotted curves — mating-success benefit and survival-cost — with the population's expected equilibrium trait value marked where marginal benefit equals marginal cost, demonstrating why trade-offs cap trait exaggeration rather than selection running away unconstrained.

**Static**

- Galápagos finch beak-depth histogram, before vs. after the 1977 drought, with directional shift labeled
- Human birth-weight vs. infant-mortality curve (U-shaped), with the stabilizing-selection optimum marked
- Seedcracker finch bimodal bill-size histogram with small- and large-billed peaks labeled and intermediate trough marked
- Three-panel diagram of directional/stabilizing/disruptive selection, same starting distribution, showing each mode's distinct resulting shape
- Feather exaptation timeline: insulation/display function in non-flying theropods preceding flight function in birds

## Practice Problems

1. A population of insects shows a trait distribution that becomes bimodal (two peaks) over several generations, with a growing gap in the middle of the distribution. Identify the mode of selection most consistent with this pattern.
2. A lethal recessive allele has a relative fitness of 0. Explain what "relative fitness" means in this context and why it differs from saying the allele has "zero effect."
3. Explain why the observation that peacock trains reduce flight efficiency and increase predation risk does not, by itself, contradict natural selection theory.
4. A gene variant increases fertility in early adulthood but is linked to a higher rate of a late-onset disease. Explain, using antagonistic pleiotropy, why this variant could still increase in frequency under selection.
5. Explain why a structure's current functional benefit is not sufficient evidence, on its own, that the structure originally evolved for that function, using feathers as a worked example.
