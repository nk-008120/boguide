---
title: "Foraging & Anti-Predator Behavior"
weight: 5
description: "Optimal foraging theory, the marginal value theorem, the predator-prey behavioral arms race, vigilance and the dilution effect, and anti-predator strategies — the first of three Behavioral Ecology pages analyzing behavior in cost/benefit terms."
difficulty: "advanced"
prerequisites: ["Mechanisms-of-Behavior"]
syllabus_tags: ["IBO", "USABO", "ethology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

This page opens the **Behavioral Ecology** tier, where behavior is analyzed not just mechanistically (how it happens) but as an evolved *strategy* — a decision rule shaped by selection to maximize net fitness payoff given the costs and benefits available. Foraging and anti-predator behavior are treated together because they are directly linked by a single, heavily tested trade-off: time and attention spent foraging is time and attention *not* spent watching for predators, and nearly every concept below (optimal foraging, vigilance, group formation) is ultimately an answer to how animals balance the two.

## Key Concepts

### Optimal Foraging Theory

**Optimal foraging theory** models foraging as an economic decision problem: natural selection favors foraging rules that maximize net energy intake per unit time (or, in some formulations, minimize time spent exposed to predation risk while meeting energy needs), given real constraints on what an animal can perceive, handle, and digest. A directly testable prediction is **prey choice models**: when profitable prey (high energy return per handling-time cost) is abundant, foragers should become more selective and ignore lower-profitability prey even when it's encountered, since pursuing it costs search time that could instead find another high-profitability item — **oystercatchers (*Haematopus ostralegus*) foraging on mussels** is a well-studied case, where birds preferentially select intermediate-sized mussels: large mussels have a high energy payoff but a disproportionately high handling cost (harder to open), so realized net rate of energy gain is actually maximized at an intermediate size rather than at the largest available prey.

> **Flagged — not usable:** the sourced image (`oystercatcher-mussel-prey-choice-diagram.jpg`) turned out to be a generic microeconomics textbook figure (total/fixed/variable/marginal cost curves vs. quantity, from a profit-maximization blog post) — no oystercatchers, mussels, or biological content of any kind. It shares the same *mathematical* marginal-cost/benefit logic optimal foraging theory borrows from economics, but inserting it here would show a business-cost graph under a heading about shorebird foraging with no visual link to the actual claim. Not inserted; flagging instead of silently dropping in case a real oystercatcher/mussel profitability curve should be re-sourced.

### The Marginal Value Theorem

The **marginal value theorem** (Eric Charnov) addresses a specific sub-problem: when food occurs in discrete, depleting **patches** (a flower cluster, a fruiting tree, a shoal of prey) separated by non-foraging travel time, how long should a forager stay in a given patch before moving to the next one? As a forager depletes a patch, its intake rate within that patch declines; the marginal value theorem predicts the optimal **giving-up time** is reached when the current patch's declining intake rate falls to match the *average* intake rate achievable across the whole habitat (including travel time to the next patch) — not when the patch is fully depleted. A direct, testable consequence: foragers should stay *longer* in each patch as travel time between patches increases (since abandoning a patch early is more costly when the next one is far away), a pattern confirmed experimentally in bumblebees foraging on artificial flower patches with manipulated inter-patch distances.

![Charnov's marginal value theorem graphical solution: cumulative resource intake vs. time foraging in a patch, a diminishing-returns curve, with a tangent line drawn from the negative x-axis (expected transit time) touching the curve at the optimal time in patch.](/ETHOLOGYPICS/marginal-value-theorem-tangent-diagram.jpg)
*Source: Wikipedia, "Marginal value theorem"*

### The Predator-Prey Behavioral Arms Race

Foraging decisions and anti-predator decisions co-evolve in a continuing **behavioral arms race**: predator hunting strategies select for prey counter-strategies, which in turn select for refined predator strategies. Unlike the structural/physiological adaptations covered elsewhere in this guide, the arms race here is specifically in *decision rules and behavior*, e.g. cheetah pursuit strategy vs. Thomson's gazelle stotting/evasive zig-zagging, or bat echolocation call structure vs. moth ultrasound-detecting evasive flight and (in tiger moths) active jamming clicks produced in response to an approaching bat's call.

### Vigilance and the Dilution Effect

Two of the clearest predictions from the foraging/safety trade-off concern group size:

- **Vigilance trade-off** — each individual in a foraging group faces a direct trade-off between head-down foraging time and head-up scanning-for-predators time; as **group size increases**, each individual can typically reduce its own vigilance time (since more eyes are collectively watching, an effect termed the "many eyes" hypothesis) while the group's *overall* probability of detecting an approaching predator stays high or even increases — a pattern confirmed across many bird and ungulate species by direct field observation of per-individual scanning rate declining with flock/herd size.
- **Dilution effect** — for a predator that can only capture one (or a limited number of) prey per attack, an individual's probability of being the one captured decreases as group size increases, purely as a statistical consequence of there being more potential targets — this is a distinct mechanism from vigilance (it works even if no individual increases its watchfulness at all) and is the leading explanation for the fitness benefit of synchronized mass emergence events, e.g. the near-simultaneous mass hatching of sea turtle nests, which overwhelms local predators relative to what any one hatchling would face emerging alone.

> **Flagged — not usable:** the sourced image (`dilution-vs-selfish-herd-diagram.png`) is an epidemiology figure about disease-transmission dynamics in a predator-prey/intraguild-predation system, using "dilution effect" in its *disease-ecology* sense (host diversity reducing pathogen transmission) — a false cognate that happens to share the exact term with the anti-predator "safety in numbers" concept taught here, but means something unrelated. Not inserted, since it would actively teach the wrong definition under this heading; flagging rather than dropping silently in case a genuine dilution-vs-selfish-herd comparison diagram should be re-sourced.

### Anti-Predator Strategies

Several named strategies recur across taxa and are tested individually:

- **Alarm signaling** — covered in depth in [Animal Communication](../Animal-Communication/) (Belding's ground squirrel, vervet monkey calls).
- **Selfish herd effect** (W.D. Hamilton) — individuals within a group actively maneuver to position themselves centrally, pushing others toward the group's edge, reducing their own individual predation risk at others' expense — a distinct mechanism from the dilution effect above, since it's about *position within* the group rather than group size itself.
- **Predator swamping/satiation** — the same mass-synchrony logic as the dilution effect, extended to the case where predator population size cannot track sudden prey abundance (periodical cicada mass emergences are the standard example: a 13- or 17-year emergence cycle produces prey numbers far exceeding what the local predator community can consume in a single season, so a fixed fraction survives regardless of predator numbers).

![Two-panel timeline: predator response/availability curves over time (top) alongside cicada phenology (bottom), showing underground final-instar nymphs giving way to a sharp spike in adult cicada availability at T2, timed against predator response curves.](/ETHOLOGYPICS/periodical-cicada-emergence-timeline.jpg)
*Source: exam/textbook figure (specific origin not stated by submitter)*

- **Startle and deimatic displays** — sudden exposure of conspicuous markings (e.g. peacock butterfly eyespots flashed open in response to an approaching predator) intended to startle a predator or mimic the appearance of a larger animal's eyes, buying an escape window.

![Peacock butterfly with wings open, its two large wing eyespots circled/highlighted.](/ETHOLOGYPICS/peacock-butterfly-eyespot-display.jpg)
*Source: Yorkshire Museum (Facebook)*
- **Mobbing** — coordinated group harassment of a predator by potential prey (small birds mobbing a perched hawk or owl) to drive it away from the immediate area, at some risk to the mobbing individuals; often triggered specifically by an alarm-call type distinct from a fleeing-response alarm call.

<!-- VIDEO: Starling flock "murmuration" showing predator-evasion dynamics and the selfish-herd effect in real time — Sturnus vulgaris — the constantly shifting central-vs-peripheral positioning that drives the selfish herd effect is essentially invisible in a still frame -->
<!-- Submitted source (facebook.com/cornellbirds) is a Facebook video — this site has no Facebook-embed shortcode set up (only the youtube shortcode is wired in), so it can't be embedded the same way without adding new plumbing. Left unresolved; send a YouTube link instead, or confirm adding a Facebook embed is wanted. -->

## Comparative Structures

| Concept | Mechanism | Group-size dependent? | Example |
|---|---|---|---|
| Vigilance trade-off | Reduced per-individual scanning need | Yes (decreases per individual) | Reduced scanning rate in larger bird flocks |
| Dilution effect | Lower per-individual capture probability | Yes (decreases per individual) | Synchronized sea turtle hatchling emergence |
| Selfish herd effect | Repositioning toward group center | Not directly — positional | Individuals jostling toward herd center |
| Predator swamping | Predator population can't scale with prey surge | Yes (population-level) | Periodical cicada mass emergence |

## Common Exam Questions

- "Oystercatchers preferentially select intermediate-sized mussels rather than the largest available. Explain this using optimal foraging theory and the concept of handling time."
- "State the prediction of the marginal value theorem regarding patch residence time as inter-patch travel time increases, and explain the underlying logic."
- "Distinguish the dilution effect from the selfish herd effect, and explain why the two can be confused despite operating through different mechanisms."
- "Explain why periodical cicadas emerging on a synchronized 13- or 17-year cycle in extremely large numbers is an anti-predator strategy, even though no individual cicada actively evades predators more effectively than another."
- "Explain the 'many eyes' hypothesis and describe what field-observable measurement (per individual) would support it."
- "A tiger moth produces ultrasonic clicks in response to an approaching echolocating bat. Explain how this fits into a predator-prey behavioral arms race framework."

## Visual Reference

**Interactive**

- **Marginal value theorem patch-departure simulator (Plotly)** — user sets inter-patch travel time and views a graphical solution (tangent-line construction) showing the optimal giving-up point on a declining within-patch intake curve, with the optimal residence time recalculating live as travel time changes.

{{< iframe src="/marginal-value-theorem-simulator.html" title="Marginal Value Theorem Patch-Departure Simulator" height="480px" >}}

- **Group-size vigilance/dilution simulator (SVG/JS)** — a simulated group of foraging animals where the user adjusts group size and sees per-individual scanning time decrease (vigilance) alongside a separately computed per-individual capture-probability decrease (dilution), demonstrating the two effects are related but mechanistically distinct.

{{< iframe src="/group-size-vigilance-dilution-simulator.html" title="Group-Size Vigilance/Dilution Simulator" height="420px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Two exceptions flagged as unusable rather than embedded — see the notes under "Optimal Foraging Theory" and "Vigilance and the Dilution Effect" above.)*

{{< youtube cZJOtBi1yV0 >}}

## Practice Problems

1. A shorebird forages on two prey types: one with high energy content but very long handling time, and one with lower energy content but almost no handling time. Explain, using optimal foraging theory, under what circumstances the bird should ignore the high-energy prey type entirely.
2. Using the marginal value theorem, predict and explain what happens to average patch residence time in a habitat where patches are moved closer together (reducing travel time), all else equal.
3. Explain why a solitary sea turtle hatchling emerging alone faces a higher individual predation risk than one emerging as part of a mass, synchronized hatching event, using the dilution effect specifically (not vigilance).
4. A herd of prey animals under threat shows individuals actively pushing toward the center of the group rather than merely staying close together. Name this phenomenon and explain whose fitness it improves at whose expense.
5. Explain why periodical cicadas' 13- and 17-year emergence cycles (both prime numbers) are hypothesized to further reduce predation risk beyond the swamping effect of sheer numbers alone.
