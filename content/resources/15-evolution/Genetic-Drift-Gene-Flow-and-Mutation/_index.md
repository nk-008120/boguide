---
title: "Genetic Drift, Gene Flow & Mutation"
weight: 5
description: "The three non-selective mechanisms of allele frequency change: genetic drift and effective population size (including founder effects and bottlenecks), gene flow between populations, and mutation as the ultimate source of new genetic variation."
difficulty: "intermediate"
prerequisites: ["Population-Genetics-Hardy-Weinberg-Equilibrium"]
syllabus_tags: ["IBO", "USABO", "evolution"]
---
{{< topic-meta >}}

## Overview

[Natural selection](../Natural-Selection-Modes-and-Fitness/) is the only mechanism of evolutionary change that consistently produces adaptation, but it is not the only way allele frequencies change — three additional mechanisms, none of which require any fitness difference between genotypes, can shift a population away from Hardy-Weinberg equilibrium just as surely. Exam questions consistently test the ability to tell these three mechanisms apart from each other and from selection, since a described allele-frequency change is meaningless without correctly identifying *which* mechanism produced it — random chance, incoming migrants, or new mutation.

## Key Concepts

### Genetic Drift and Effective Population Size

**Genetic drift** is random change in allele frequency from one generation to the next, caused purely by chance sampling of which individuals happen to survive and reproduce — mathematically identical to the statistical noise expected from randomly sampling a finite pool, not tied to any allele's effect on survival or reproduction. Drift's strength is inversely related to population size: in a very large population, random sampling noise averages out and allele frequencies stay close to constant across generations, while in a small population, chance alone can shift frequencies substantially in a single generation, including driving a neutral (or even mildly beneficial) allele to complete loss, or a neutral allele to **fixation** (100% frequency) — outcomes selection alone would not produce. The relevant population size for drift's strength is the **effective population size ($N_e$)**, not the simple census count: $N_e$ accounts for factors like unequal sex ratio, variance in individual reproductive success, and population size fluctuation over time, and is typically smaller than the census population size, meaning drift is often stronger in a real population than a naive headcount would suggest.

![Simulated allele-frequency trajectories over 50 generations at three population sizes (n=20, n=200, n=2000), all starting near 0.5: at n=20 trajectories are highly erratic, several alleles reach fixation (1.0) or loss (0.0) within 10-40 generations; at n=200 trajectories wander more moderately without reaching fixation; at n=2000 trajectories stay tightly clustered near the starting frequency — directly illustrating drift's strength decreasing as population size increases](/EVOLUTIONPICS/genetic-drift-trajectories-small-vs-large.png)
*Source: not specified by user*

### Founder Effects and Bottlenecks

Two specific, named scenarios describe drift acting through a sudden reduction to a small effective population size:

- **Founder effect** — a new population is established by a small number of individuals sampled (by chance) from a larger source population, so the new population's allele frequencies reflect whatever alleles the founders happened to carry, which may differ substantially from the source population's frequencies purely by sampling chance, independent of any selective advantage. The elevated frequency of certain heritable conditions in some island or isolated founder populations (e.g. elevated Ellis-van Creveld syndrome frequency among the Old Order Amish of Lancaster County, traceable to a single founding couple) is a well-documented human case.

![Founder effect diagram: a large source population containing two allele variants (shown as two colors) in roughly even proportion produces a small founding subpopulation with a different, chance-determined color proportion, which then diverges further as it grows into its own isolated population — a qualitative color/proportion representation rather than one with explicit numeric allele-frequency labels](/EVOLUTIONPICS/founder-effect-diagram.svg)
*Source: Wikipedia*

- **Bottleneck effect** — an existing population undergoes a sudden, drastic reduction in size (disease, natural disaster, overhunting), and the surviving individuals' allele frequencies reflect whichever alleles happened to be carried by survivors, again independent of selective advantage, with the population's overall genetic diversity typically reduced even if the population later recovers in size. **Northern elephant seals (*Mirounga angustirostris*)**, reduced to an estimated fewer than 100 individuals by 19th-century hunting before legal protection allowed recovery to over 100,000, show dramatically reduced genetic diversity across the modern population relative to the more heavily hunted (but not as severely bottlenecked) southern elephant seal — a documented case where a population-genetic prediction (post-bottleneck diversity loss) is directly confirmed by molecular data.

{{< youtube AVHbLKSv-Jc >}}
*Source: "Mr Phillips A Level Biology 4.4: Genetic Diversity" (YouTube)*

Both founder effects and bottlenecks are specific applications of the same underlying principle (drift is stronger at small $N_e$) rather than mechanistically distinct phenomena — the difference is only whether the small population arose by a subset founding a new colony or by a large population being reduced in place.

### Gene Flow

**Gene flow (migration)** is the movement of alleles between populations via the movement of individuals (or, in plants, pollen/seeds) that then interbreed with the recipient population, directly violating the Hardy-Weinberg "no migration" assumption. Gene flow's characteristic evolutionary effect is **homogenizing** — it tends to reduce genetic differences between populations by mixing their allele pools, acting as a counterforce against local adaptation (selection favoring different alleles in different environments) and against drift/founder-effect-driven divergence between isolated populations alike. The rate of gene flow is a central variable in [speciation](../Speciation-and-Reproductive-Isolation/), since sufficient ongoing gene flow between two populations can prevent them from diverging into separate species even under different local selective pressures, while a barrier to gene flow (geographic or otherwise) is often the first step toward speciation.

![Gene flow between two bird populations that selection has driven to opposite homozygous states (Population A fixed HH, Population B fixed hh): migrant individuals crossing between the populations produce heterozygous (Hh) offspring in the recipient population, introducing the allele that selection had otherwise eliminated there — an illustration of gene flow's homogenizing effect working directly against local selection](/EVOLUTIONPICS/gene-flow-migration-diagram.png)
*Source: Expii*

### Mutation

**Mutation** is a change in an organism's DNA sequence, and is the **ultimate source of all new genetic variation** — every allele available to selection, drift, or gene flow first arose as a mutation in some ancestor. Considered purely as an evolutionary mechanism (its direct effect on allele frequency each generation, separate from what happens to a mutant allele afterward under selection or drift), mutation typically has a very small direct quantitative effect on allele frequency per generation, since mutation rates per locus per generation are low; its outsized importance is not as a fast *driver* of frequency change on its own, but as the mechanism that continuously replenishes the raw variation that the other three mechanisms then act on — without ongoing mutation, both selection and drift would eventually exhaust the genetic variation available and further evolutionary change at a locus would stop. Mutations are further classified by their fitness effect (beneficial, neutral, deleterious) — see [Molecular Evolution & Neutral Theory](../Molecular-Evolution-and-Neutral-Theory/) for how the proportion of mutations in each category, and specifically the prevalence of neutral mutation, is itself a major evolutionary theory in its own right.

![An eco-evolutionary feedback diagram: genetic variation (fed by mutation rate/bias, migration rate, demography, and recombination rate) shapes phenotype (also affected by epigenetics, environment, and somatic mutations), which combines with the biotic/abiotic environment to determine fitness, which feeds back to genetic variation via selection, genetic drift, and hitchhiking.](/EVOLUTIONPICS/four-mechanisms-allele-frequency-summary.png)
*Source: University of Chicago Press Journals (doi 10.1086/726012)*

## Comparative Structures

| Mechanism | Requires fitness difference? | Direction of effect | Effect on genetic diversity | Named example |
|---|---|---|---|---|
| Genetic drift | No | Random | Decreases (especially at small $N_e$) | Northern elephant seal bottleneck |
| Founder effect | No | Random (reflects founders' alleles) | Decreases in new population | Amish Ellis-van Creveld frequency |
| Gene flow | No | Homogenizing between populations | Increases within, decreases between populations | Any two interbreeding populations |
| Mutation | No | Introduces new variation | Increases (source of all variation) | Any new heritable DNA change |
| (Natural selection, for contrast) | Yes | Non-random, fitness-directed | Can increase or decrease depending on mode | See [Natural Selection](../Natural-Selection-Modes-and-Fitness/) |

## Common Exam Questions

- "Explain why genetic drift has a stronger effect on allele frequency in a small population than in a large one."
- "Distinguish a founder effect from a bottleneck effect, and explain what the two scenarios have in common mechanistically."
- "Explain why northern elephant seals show reduced genetic diversity today despite the population having recovered to over 100,000 individuals."
- "Explain why gene flow between two populations tends to counteract the effects of local selection and genetic drift."
- "Explain why mutation is described as the 'ultimate source' of genetic variation even though it typically produces only small allele-frequency changes per generation on its own."
- "A population undergoes a disease outbreak that kills 95% of individuals at random with respect to a particular neutral marker gene. Explain what is expected to happen to that gene's allele frequency in survivors, and why this is not natural selection."

## Visual Reference

**Interactive**

- **Genetic drift population-size simulator (Plotly)** — the user sets a starting allele frequency and population size, then runs repeated stochastic simulation trials, watching allele frequency trajectories diverge and occasionally hit fixation/loss — with small population size visibly producing much more erratic, divergent trajectories than large population size run side by side.

{{< iframe src="/genetic-drift-simulator.html" title="Genetic drift population-size simulator" height="500px" >}}

- **Founder effect / bottleneck sampler (interactive SVG/JS)** — a large population of colored dots (representing two allele colors in known proportion) where the user "samples" a small founding group or a random bottleneck-surviving subset, and the tool displays the new, chance-determined allele proportions in the resulting small population, repeatable to show how much the outcome varies by chance alone.

{{< iframe src="/founder-bottleneck-sampler.html" title="Founder effect / bottleneck sampler" height="440px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here — the elephant seal bottleneck item is a YouTube video embed instead of a static image)*

## Practice Problems

1. A population of 20 beetles and a population of 20,000 beetles both start with an allele frequency of 0.5 at a neutral locus. Predict, and explain, which population is more likely to show a large allele-frequency change purely by chance after one generation.
2. A small group of birds blown off course colonizes a remote island and founds a new population. Explain why the new population's allele frequencies might differ substantially from the mainland source population's frequencies, even with no selective advantage to any allele involved.
3. Two neighboring plant populations have different local allele frequencies at a locus under different selective pressures in each location, but pollinators regularly move pollen between them. Explain what effect this ongoing gene flow is expected to have on the difference between the two populations' allele frequencies over time.
4. Explain why a species with an extremely low mutation rate at all loci would eventually run out of new material for natural selection to act on, even if selection itself remained fully active.
5. A population's census size is 10,000, but due to a highly skewed mating system only 200 males ever successfully reproduce each generation. Explain why the effective population size relevant to genetic drift is much lower than 10,000.
