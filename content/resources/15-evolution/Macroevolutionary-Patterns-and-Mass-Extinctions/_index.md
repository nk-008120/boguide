---
title: "Macroevolutionary Patterns & Mass Extinctions"
weight: 8
description: "Adaptive radiation, punctuated equilibrium vs. phyletic gradualism as competing models of the pace of evolutionary change, long-term evolutionary trends, and the 'big five' mass extinctions and their role in reshaping subsequent diversification."
difficulty: "intermediate"
prerequisites: ["Speciation-and-Reproductive-Isolation"]
syllabus_tags: ["IBO", "USABO", "evolution"]
---
{{< topic-meta >}}

## Overview

[Speciation](../Speciation-and-Reproductive-Isolation/) covered how one lineage splits into two; this page zooms out to **macroevolution** — patterns visible only at the scale of many lineages and long timescales, generally studied through the fossil record rather than through direct observation of a single population. Two questions dominate this level of analysis and are both heavily tested: how fast does evolutionary change actually proceed once speciation has occurred (steadily, or in rapid bursts), and what role do the occasional, geologically abrupt mass extinction events play in resetting and redirecting the diversity that later diversification builds on.

## Key Concepts

### Adaptive Radiation

**Adaptive radiation** is the relatively rapid diversification of a single ancestral lineage into many descendant species, each adapted to a different ecological niche, typically triggered by access to a wide range of underexploited resources — following colonization of a new, competitor-free environment (island or lake systems), the extinction of previously dominant competitor/predator groups, or the evolution of a genuinely new functional trait that opens previously inaccessible niches (a **key innovation**). **Darwin's Galápagos finches** (originating from a single mainland ancestor, diversifying into species with beak forms specialized for seeds, insects, cactus flowers, and even blood-feeding) and the post-Cretaceous-extinction radiation of placental mammals (discussed further below) are standard cases. The diagnostic pattern is a comparatively short branching interval on a time-calibrated phylogeny (a [chronogram](../../4-biosystematics/molecular-systematics/)) giving rise to a disproportionately large number of descendant lineages relative to the surrounding branches, each occupying a distinct niche.

### Punctuated Equilibrium vs. Phyletic Gradualism

These are two competing models of the **tempo** (rate) at which morphological change accumulates within a lineage over geologic time, and a common exam task is correctly matching a described fossil pattern to the model it supports:

- **Phyletic gradualism** (the traditional Darwinian default expectation) predicts morphological change accumulates **slowly and continuously** across a lineage's entire duration, so a well-sampled fossil series should show a smooth, gradual sequence of intermediate forms connecting ancestor and descendant with no sharp discontinuities.
- **Punctuated equilibrium** (Niles Eldredge and Stephen Jay Gould, 1972) instead proposes that most lineages spend the great majority of their duration in **morphological stasis** (little to no visible change, often for millions of years), with most morphological change concentrated in relatively brief bursts, typically associated with speciation events (particularly small, peripatric populations — see [Speciation & Reproductive Isolation](../Speciation-and-Reproductive-Isolation/) — where drift and strong local selection can drive rapid divergence). Under this model, the frequent absence of smooth transitional sequences in the fossil record is explained as a real biological pattern of rapid-change-then-stasis, not merely as a gap or failure of fossil preservation.

Both patterns are documented in different fossil lineages — the two models are not mutually exclusive as general descriptions of evolutionary tempo across all of life, and a given well-sampled lineage can be examined on its own fossil evidence to determine which pattern it actually shows.

### Long-Term Evolutionary Trends

Some lineages show a clear long-term directional trend in a trait across many millions of years (e.g. the documented reduction in digit number and increase in body size across the horse (Equidae) fossil lineage from the small, multi-toed *Eohippus* to modern single-toed *Equus*). Such trends require care in interpretation, since an apparent directional trend at the level of a whole clade can arise from two very different underlying processes: **anagenesis** (directional change accumulating within a single continuous lineage over time) versus **differential species selection/sorting** (many separate lineages within a clade vary in a trait, and lineages with one trait value simply speciate faster or go extinct less often than lineages with another value, producing a clade-level trend even if no single lineage's trait value ever "improves" gradually within itself) — the horse fossil record, on closer examination, shows substantial trait diversity and several non-size-increasing side-branches rather than one single, smoothly transforming lineage, making it a commonly cited caution against assuming any observed clade-level trend must reflect gradual within-lineage anagenesis.

### The "Big Five" Mass Extinctions

A **mass extinction** is a geologically rapid, global loss of a large proportion of Earth's species diversity, distinguished from the continuous, low "background" extinction rate that occurs at all times. Five events, identified from a sharp, globally correlated drop in fossil diversity, are conventionally named the "big five":

| Extinction event | Approximate date | Estimated species loss | Notable proposed cause |
|---|---|---|---|
| End-Ordovician | ~444 mya | ~85% | Glaciation and sea-level drop |
| Late Devonian | ~375 mya | ~75% | Possible ocean anoxia, climate change |
| End-Permian ("the Great Dying") | ~252 mya | ~96% (marine species) | Massive Siberian Traps volcanism, ocean acidification/anoxia |
| End-Triassic | ~201 mya | ~80% | Central Atlantic Magmatic Province volcanism |
| End-Cretaceous (K-Pg) | ~66 mya | ~76% (including non-avian dinosaurs) | Chicxulub asteroid impact, evidenced by a global iridium-enriched sediment layer |

Mass extinctions are macroevolutionarily significant beyond the immediate loss itself because they characteristically clear ecological space, releasing surviving lineages from competitive and predatory pressure that had previously constrained their diversification — the K-Pg extinction's removal of non-avian dinosaurs is the standard example, widely credited with permitting the subsequent adaptive radiation of placental mammals into the large-bodied, diurnal, and specialized ecological niches dinosaurs had previously occupied, a pattern only fully visible by comparing fossil mammal diversity and body size immediately before versus after the event.

## Comparative Structures

| Model/pattern | Predicted fossil signature | What it explains |
|---|---|---|
| Phyletic gradualism | Smooth, continuous intermediate sequence | Slow, constant background morphological change |
| Punctuated equilibrium | Long stasis, brief rapid-change intervals at speciation | Frequent absence of smooth transitional series |
| Anagenesis | Single lineage's trait value shifts gradually over time | A true within-lineage directional trend |
| Species selection/sorting | Trait-associated differences in speciation/extinction rate across many lineages | A clade-level trend without any single lineage transforming |

## Common Exam Questions

- "Explain why an adaptive radiation is typically associated with access to previously unexploited ecological niches, using Galápagos finches or post-K-Pg mammals as an example."
- "Distinguish punctuated equilibrium from phyletic gradualism as predictions about the pace of morphological change, and state what fossil pattern would support each."
- "Explain why the frequent absence of smooth transitional fossil sequences is not, by itself, evidence against evolution, referencing punctuated equilibrium specifically."
- "Distinguish anagenesis from species selection as two different explanations for an observed clade-level evolutionary trend."
- "List the five mass extinction events and their approximate dates, and explain what evidence identifies the End-Cretaceous extinction's proposed cause specifically."
- "Explain why the K-Pg mass extinction is causally linked to the subsequent adaptive radiation of placental mammals."

## Visual Reference

**Interactive**

- **Punctuated equilibrium vs. gradualism fossil-series builder (SVG/JS, no new library)** — the user is given a set of fossil specimens at different stratigraphic depths for one lineage and arranges/interprets the morphological change pattern, with the tool revealing whether the underlying simulated data was generated under a gradualist or punctuated model, testing pattern recognition rather than definition recall.
- **Mass extinction timeline explorer (Plotly)** — a species-diversity-over-time curve across the Phanerozoic with the five mass extinctions marked as sharp diversity drops, clickable for cause evidence and post-extinction recovery/radiation data for each event.

**Static**

- Adaptive radiation diagram: Galápagos finch phylogeny with beak-shape/diet specialization labeled at each tip
- Punctuated equilibrium vs. phyletic gradualism side-by-side diagram: stratigraphic morphology plots showing stasis-then-jump vs. smooth continuous change
- Horse (Equidae) fossil lineage diagram showing multiple side-branches and trait diversity, not a single linear size-increase sequence
- Big five mass extinctions diversity-loss bar chart with dates and estimated percentage species loss labeled
- K-Pg boundary iridium layer diagram alongside a before/after mammalian body-size and diversity comparison

## Practice Problems

1. A newly colonized volcanic archipelago is found to host a single insect lineage that has diversified into a dozen species, each specialized on a different host plant. Explain why this is classified as an adaptive radiation and what ecological condition typically triggers this pattern.
2. A fossil lineage shows almost no morphological change for 4 million years, followed by an abrupt shift coinciding with evidence of rapid speciation, then renewed stasis. Which model does this pattern support, and what does it imply about where most morphological change is concentrated?
3. Explain why the horse fossil lineage's history is considered a cautionary example against assuming that a clade-level size-increase trend reflects one single, gradually transforming lineage.
4. Explain what specific geological evidence supports an asteroid impact as the primary cause of the End-Cretaceous mass extinction, distinguishing it from the Siberian-Traps-volcanism evidence associated with the End-Permian event.
5. Explain, mechanistically, why removing a dominant competitor or predator group via mass extinction can trigger an adaptive radiation in a previously ecologically constrained surviving lineage.
