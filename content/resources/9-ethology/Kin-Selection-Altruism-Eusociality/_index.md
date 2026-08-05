---
title: "Kin Selection, Altruism & Eusociality"
weight: 7
description: "Hamilton's rule, inclusive fitness, reciprocal altruism, haplodiploidy and kin selection in Hymenoptera, eusociality criteria, and the group-selection debate — how apparently self-sacrificing behavior is explained without invoking group-level selection."
difficulty: "advanced"
prerequisites: ["Mechanisms-of-Behavior"]
syllabus_tags: ["IBO", "USABO", "ethology"]
---
{{< topic-meta >}}

## Overview

**Altruism**, in the strict behavioral-ecology sense, is behavior that reduces the actor's own direct reproductive success while increasing the reproductive success of a recipient — a Belding's ground squirrel giving an alarm call at increased personal predation risk (see [Animal Communication](../Animal-Communication/)) is the clearest example already introduced. This poses an obvious problem for natural selection acting on individuals: a gene that reduces its own carrier's reproduction should be selected against. The resolution, **kin selection theory**, is one of the most consequential ideas in 20th-century evolutionary biology and is tested heavily both as an abstract framework (Hamilton's rule) and through its most extreme real-world confirmation (insect eusociality).

## Key Concepts

### Hamilton's Rule and Inclusive Fitness

**W.D. Hamilton**'s resolution reframes the unit being maximized: selection favors a gene not by its effect on the *individual carrying it*, but by its effect on the total number of copies of itself propagated into the next generation — including copies present in relatives, weighted by the probability a given relative shares that copy. This total, **inclusive fitness**, is the sum of an individual's own direct reproductive output plus its effect on relatives' reproduction, weighted by relatedness. **Hamilton's rule** states that an altruistic gene will spread when:

$$rB > C$$

where **r** is the coefficient of relatedness between actor and recipient (the probability the two share a given gene by common descent — 0.5 for full siblings or parent-offspring in a diploid species, 0.25 for half-siblings, 0.125 for first cousins), **B** is the reproductive benefit to the recipient, and **C** is the reproductive cost to the actor. The rule predicts altruism should be more readily favored toward closer relatives (higher r) and when the benefit-to-cost ratio is large — both patterns confirmed in Belding's ground squirrel alarm-calling frequency (higher when close kin are nearby) and in **Florida scrub-jay (*Aphelocoma coerulescens*) helper-at-the-nest behavior**, where non-breeding young help raise siblings rather than breed independently, disproportionately when territory/mate scarcity make independent breeding unlikely to succeed — making the "C" term (cost of forgoing independent breeding) low relative to the "B" term (helping a full sibling, r = 0.5, succeed).

### Reciprocal Altruism

**Reciprocal altruism** (Robert Trivers) explains apparently altruistic behavior toward *non-relatives* (r ≈ 0), where kin selection cannot apply: an individual incurs a cost to help another now, in exchange for the recipient reciprocating later, so long as the arrangement is stable against cheating (an individual receiving help without ever reciprocating). **Vampire bat (*Desmodus rotundus*) blood-sharing** is the canonical field-confirmed case: bats that fail to feed on a given night risk starvation within about 60 hours, and well-fed roost-mates (not necessarily close kin) regurgitate blood to share with a hungry individual, with field data (Gerald Wilkinson) showing sharing is preferentially directed toward individuals who have previously reciprocated, and withheld from previously-observed non-reciprocators — direct evidence the system depends on tracking individual reciprocation history, not indiscriminate generosity, and is vulnerable to and defended against cheating.

### Eusociality and Haplodiploidy

**Eusociality** is the most extreme outcome of kin-selected altruism, defined by three joint criteria: **cooperative brood care** (individuals other than the direct parents care for young), **overlapping generations** (offspring remain and contribute labor within their natal colony), and **reproductive division of labor** (a largely non-reproductive worker caste supports a smaller number of reproducing individuals). Eusociality is best documented in the insect order **Hymenoptera** (ants, bees, most wasps), and Hamilton connected its unusual concentration in this order to **haplodiploidy**: Hymenoptera males develop from unfertilized, haploid eggs while females develop from fertilized, diploid eggs, which has an important relatedness consequence — full sisters in a haplodiploid species share, on average, **0.75** of their genes (r = 0.75, higher than the standard diploid full-sibling value of 0.5), because they necessarily inherit the identical haploid genome from their father in addition to sharing on average half their mother's genes. Under Hamilton's rule, this elevated sister-sister relatedness makes it easier for a female worker to gain higher inclusive fitness by helping her mother produce more sisters than by reproducing directly herself (since a female's relatedness to her own offspring is only the standard 0.5) — a widely taught explanation for why eusociality evolved independently multiple times within Hymenoptera. It is important to note as an exam-relevant caveat that haplodiploidy is neither necessary nor sufficient for eusociality on its own: eusociality also occurs in diploid organisms (naked mole rats, *Heterocephalus glaber*, and some diploid termites), and most haplodiploid species are not eusocial — ecological factors (a defensible, valuable nest; a long breeding season; high risk of independent breeding) are also required.

<!-- VIDEO: Honeybee colony worker activity showing cooperative brood care and reproductive division of labor around the queen — Apis mellifera — the coordinated, continuous nature of colony-level care is better shown as ongoing footage than a labeled static diagram of the three eusociality criteria -->

### The Group Selection Debate

**Group selection** (selection favoring traits because they benefit the group/species as a whole, even at a cost to the individual bearing them) was an earlier, now largely rejected explanation for altruism, historically proposed for phenomena like alarm calling ("the species benefits from having some individuals warn others"). The core theoretical problem, raised forcefully by George C. Williams and others in the 1960s, is that within any group containing both altruists and non-altruists (cheaters who benefit from others' altruism without reciprocating), the non-altruists should always out-reproduce the altruists *within* that group, so group selection requires implausibly strong between-group selection to overcome this within-group disadvantage in most realistic population structures. Kin selection and reciprocal altruism largely displaced naive group selection as the accepted explanation because both operate at the level of the individual gene's transmission (via relatives or via reciprocation) without requiring group-level selection to do the work — this history is itself a common exam topic, framed as "explain why kin selection is a stronger explanation than group selection for [a given altruistic behavior]."

## Comparative Structures

| Mechanism | Applies to non-relatives? | Key variable | Example |
|---|---|---|---|
| Kin selection (Hamilton's rule) | No — requires r > 0 | Relatedness (r), benefit, cost | Belding's ground squirrel alarm calls |
| Reciprocal altruism | Yes | History of reciprocation | Vampire bat blood-sharing |
| Eusociality (kin-selection-driven) | No — occurs within colonies of relatives | Relatedness elevated by haplodiploidy (in Hymenoptera) | Honeybee/ant worker castes |
| Group selection (largely rejected as primary explanation) | N/A | Group-level, not individual-level, benefit | Historically proposed, not the current consensus explanation |

## Common Exam Questions

- "State Hamilton's rule and use it to explain why an individual is predicted to be more likely to perform a costly altruistic act for a full sibling than for a cousin."
- "Explain why haplodiploidy raises full-sister relatedness to 0.75 in Hymenoptera, and how this is used to explain the repeated evolution of eusociality in that order."
- "Vampire bats preferentially share blood with roost-mates who have previously reciprocated, and withhold it from known non-reciprocators. Explain why this is classified as reciprocal altruism rather than kin selection."
- "List the three defining criteria of eusociality, and explain why naked mole rats are eusocial despite being diploid, showing haplodiploidy is not a strict requirement."
- "Explain the core theoretical objection to group selection as an explanation for altruism, in terms of within-group competition between altruists and non-altruists."
- "A Florida scrub-jay forgoes independent breeding to help raise its parents' next brood of siblings instead. Using Hamilton's rule, explain under what territory/mate-availability conditions this is predicted to maximize the helper's inclusive fitness."

## Visual Reference

**Interactive**

- **Hamilton's rule calculator (HTML/JS, no new library)** — user sets relatedness (via a selectable relationship: full sibling, half-sibling, cousin, haplodiploid full sister), benefit, and cost values, and the tool computes rB vs. C and indicates whether the modeled altruistic act is predicted to be favored — turns the inequality into something manipulable against named relationship types.

{{< iframe src="/hamiltons-rule-calculator.html" title="Hamilton's Rule Calculator" height="480px" >}}

- **Haplodiploidy relatedness pedigree (interactive SVG/JS)** — a clickable Hymenoptera family pedigree where selecting any two individuals (e.g. two sisters, a mother and daughter) displays the computed relatedness coefficient and the reasoning (shared paternal haploid genome vs. shared maternal alleles), directly demonstrating why full sisters reach r = 0.75.

{{< iframe src="/haplodiploidy-relatedness-pedigree.html" title="Haplodiploidy Relatedness Pedigree" height="460px" >}}

**Static**

- Hamilton's rule inequality with a labeled worked example (Belding's ground squirrel alarm call, estimated r/B/C)
- Haplodiploidy diagram: haploid male development from unfertilized eggs vs. diploid female development from fertilized eggs, with the resulting sister-sister relatedness calculation shown step by step
- Vampire bat reciprocal blood-sharing network diagram, showing preferential sharing links between previously-reciprocating pairs
- Eusociality three-criteria diagram (cooperative brood care, overlapping generations, reproductive division of labor) illustrated with a labeled ant or honeybee colony cross-section
- Timeline/diagram contrasting the group-selection hypothesis with the kin-selection/reciprocal-altruism resolution

<!-- VIDEO: Vampire bat blood-sharing (regurgitation feeding) between roost-mates — Desmodus rotundus — the direct transfer behavior between specific paired individuals is the actual data Wilkinson's field studies were built on -->

## Practice Problems

1. Calculate whether an altruistic act is favored under Hamilton's rule if the actor is a haplodiploid full sister (r = 0.75) of the recipient, the act costs the actor 2 units of reproductive output, and benefits the recipient by 3 units.
2. Explain why a gene causing an individual to sacrifice its own reproduction entirely to help raise a full sibling's offspring could still increase in frequency in the population, using inclusive fitness rather than direct fitness.
3. A population of unrelated bats shares food reciprocally, but a subset of individuals accepts food without ever reciprocating. Explain what should happen to the frequency of non-reciprocators over time if other bats can identify and remember them, and why this matters for the long-term stability of reciprocal altruism.
4. Naked mole rats are eusocial despite being diploid, with normal (not elevated) sibling relatedness. Explain why this is considered evidence that haplodiploidy is not strictly necessary for eusociality to evolve.
5. Explain why "the species benefits when some individuals give alarm calls" is considered a weaker explanation than kin selection for the evolution of alarm calling, focusing on what happens to non-calling individuals within the same group under each explanation.
