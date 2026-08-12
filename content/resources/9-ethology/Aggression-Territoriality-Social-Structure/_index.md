---
title: "Aggression, Territoriality & Social Structure"
weight: 8
description: "Game theory (hawk-dove, evolutionarily stable strategies), dominance hierarchies, territorial defense economics, and the costs/benefits of group living: how individuals organize into stable social structures."
difficulty: "advanced"
prerequisites: ["Mechanisms-of-Behavior", "Kin-Selection-Altruism-Eusociality"]
syllabus_tags: ["IBO", "USABO", "ethology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

The previous two Behavioral Ecology pages covered strategies aimed at resources ([Foraging & Anti-Predator Behavior](../Foraging-Anti-Predator-Behavior/)) and mates ([Mating Systems & Sexual Selection](../Mating-Systems-Sexual-Selection/)); this page covers how repeated interactions between the *same* individuals over resources, mates, and space settle into stable, predictable social structures rather than constant unresolved conflict. The unifying tool is **game theory**: modeling behavioral strategy as a payoff that depends on what other individuals in the population are simultaneously doing, not on the environment alone.

## Key Concepts

### Game Theory and the Hawk-Dove Model

The **hawk-dove model** (John Maynard Smith and George Price) is the standard teaching case for why animal contests over a resource (a territory, a mate) so often resolve through ritualized display rather than escalating to injurious fighting, despite an individual "hawk" strategist (always escalate to real fighting) seemingly gaining more per contest than a "dove" strategist (only display, retreat if opponent escalates). The model shows why: in a population of all doves, a single hawk mutant does gain an advantage (it wins every contest against non-escalating doves). But in a population of all hawks, the cost of injury from constant serious fighting drives average hawk fitness down substantially, to the point that a dove mutant (which never risks injury, and simply avoids fights it can't win outright) can invade. Under a broad range of realistic parameters, the population settles at a stable **mixture** of hawk and dove strategies (or, equivalently, individuals playing a mixed hawk/dove strategy probabilistically), and this stable mixture is an **evolutionarily stable strategy (ESS)**: a strategy that, once common in a population, cannot be displaced by any alternative strategy appearing at low frequency. Real contest behavior across many species (e.g. many bird and fish territorial disputes) matches this ESS prediction well: escalated, potentially injurious fighting is empirically rare relative to ritualized threat displays and quick retreats, consistent with a population near the hawk-dove ESS balance rather than one dominated by unconditional escalation.

![Hawk-dove payoff matrix table: hawk-vs-hawk (wins 50% of fights, injured 50%, payoff (V−D)/2), hawk-vs-dove (hawk always wins, payoff V; dove flees, payoff 0), dove-vs-dove (wins 50%, never injured but wastes time, payoff V/2−T), with V = value of the resource, D = cost of injury, T = cost of wasted time.](/ETHOLOGYPICS/hawk-dove-payoff-matrix.jpg)
*Source: AI-generated (Grok)*

![Four-panel evolutionary-game-theory figure: (a) hawk and dove relative fitness lines crossing at the ESS proportion of doves, (b) a "Retaliator" strategy's fitness relative to hawk, (c) a "Tit-for-Tat" (TFT) strategy's fitness relative to two hawk-invasion-rate scenarios, (d) the underlying replicator-dynamics equations.](/ETHOLOGYPICS/hawk-dove-ess-fitness-graph.png)
*Source: figure from a formal evolutionary game theory reference*

### Dominance Hierarchies

A **dominance hierarchy** is a stable, repeatedly-observed ranking of individuals within a group such that higher-ranked individuals consistently win contests over resources against lower-ranked ones, often with little or no actual fighting once the hierarchy is established — the ranking itself, once known by all members, substitutes for repeated costly contests. The clearest classic case is the **linear "pecking order" in domestic chickens** (Thorleif Schjelderup-Ebbe, the term's origin): once established, a lower-ranked hen reliably yields access to food to a higher-ranked hen without a fight, and the ranking can be read off directly from which individual yields to which in paired encounters. Hierarchies carry a direct game-theoretic logic: once an individual's relative fighting ability (**resource holding potential**) relative to a given opponent is established, escalating a contest it is predicted to lose is a poor strategy, so accepting subordinate status and avoiding the fight is often the higher-payoff choice for the lower-ranked individual — dominance hierarchies can be read as a stable, individually-recognized-opponent analog of the population-level hawk-dove ESS above.

![Illustrated cartoon of five chickens in a line from largest/most dominant (rear) to smallest (front), each pecking or chasing the one ahead of it, illustrating the "pecking order" concept as a literal chain of aggression down a ranking.](/ETHOLOGYPICS/chicken-pecking-order-diagram.webp)
*Source: illustration, specific origin not stated by submitter*

{{< youtube IuH50aTtEY0 >}}

### Territoriality and Resource Defense Economics

A **territory** is an area actively defended by an individual or group against conspecific intruders, typically because it contains a limiting resource (food, nest sites, mates). Whether defending a given area is favored is itself an economic, testable question, formalized in the concept of **economic defendability** (Jerram Brown): a resource is worth defending only when the fitness benefit of exclusive access exceeds the energetic and risk cost of defense, which depends heavily on how resources are distributed in space and time. Densely clumped, predictable resources are cheaply defendable (favoring small, intensely defended territories); sparse or unpredictable resources may cost more to defend than they're worth, favoring non-territorial or only loosely territorial behavior instead: nectar-feeding sunbirds and hummingbirds defending individual flowering shrubs, but abandoning territorial defense of the same patch once flower density drops too low to be worth the energetic cost of chasing off intruders, is a well-documented field-tested example of this exact economic threshold in action.

![Graph titled "Territoriality is a balance of costs and benefits": cost and benefit curves plotted against territory size, with the optimal territory size marked where the vertical gap between the rising cost curve and saturating benefit curve is greatest.](/ETHOLOGYPICS/optimal-group-size-cost-benefit-curve.jpg)
*Source: exam/textbook figure (specific origin not stated by submitter)*

### Costs and Benefits of Group Living

Group living is not a default — it carries real, testable costs alongside the anti-predator benefits already covered in [Foraging & Anti-Predator Behavior](../Foraging-Anti-Predator-Behavior/) (dilution effect, "many eyes" vigilance reduction), and the balance between them, not group living in the abstract, is what selection acts on:

- **Benefits**: reduced individual predation risk (dilution, vigilance; see above), cooperative foraging/hunting (e.g. lions and African wild dogs achieving higher per-capita prey capture success hunting in coordinated groups than singly for large, dangerous prey), access to help raising young (allo-parenting, cooperative breeding), and, where relatedness is high, the inclusive-fitness benefits covered in [Kin Selection, Altruism & Eusociality](../Kin-Selection-Altruism-Eusociality/).
- **Costs**: increased resource competition within the group (more mouths drawing from the same local food supply), higher risk of disease/parasite transmission between densely packed individuals, increased conspicuousness to predators at long range (even though per-individual risk once detected may fall via dilution), and reproductive competition/suppression, sometimes formalized (in cooperatively breeding species) as dominant individuals actively suppressing subordinates' reproduction.

Group size in real populations tends to track an **optimal group size** where marginal benefits and costs balance, and this optimum is often smaller than the group size that maximizes benefit alone would suggest, because dominant individuals (who benefit disproportionately) may favor larger groups than subordinates do, a source of within-group conflict over group size itself that is a directly testable prediction distinguishing group living from a purely cooperative arrangement.

## Comparative Structures

| Concept | What it stabilizes | Mechanism | Example |
|---|---|---|---|
| Hawk-dove ESS | Population-level mix of contest strategies | Frequency-dependent payoff | Ritualized display outnumbering escalated fights |
| Dominance hierarchy | Individual-level repeated contests | Recognized resource holding potential | Chicken pecking order |
| Economic defendability | Whether a territory is defended at all | Benefit of exclusivity vs. cost of defense | Sunbirds abandoning low-density flower patches |
| Optimal group size | Group size itself | Balance of predation/foraging benefit vs. competition/disease cost | Cooperative hunting group sizes in lions |

## Common Exam Questions

- "Explain, using the hawk-dove model, why a population of all-hawk strategists is not evolutionarily stable even though hawks beat doves in a direct one-on-one contest."
- "Define evolutionarily stable strategy (ESS) and explain why the hawk-dove ESS is typically a mixed strategy rather than pure hawk or pure dove."
- "Explain why a dominance hierarchy, once established, reduces the frequency of actual fighting within a group even though contests over resources continue to occur."
- "Using economic defendability, explain why a nectar-feeding bird might defend a flowering shrub when flowers are abundant but stop defending the same shrub once flower density drops."
- "List two benefits and two costs of group living, and explain why optimal group size is not simply 'as large as possible.'"
- "Explain why dominant and subordinate individuals within a cooperatively breeding group might disagree, in fitness terms, about the ideal group size."

## Visual Reference

**Interactive**

- **Hawk-dove payoff simulator (Plotly)**: user sets the cost of injury and value of the resource, and the tool computes and plots average hawk/dove fitness as the proportion of hawks in the population varies, letting the user find the ESS equilibrium point where the two strategies have equal payoff.

{{< iframe src="/hawk-dove-payoff-simulator.html" title="Hawk-Dove Payoff Simulator" height="480px" >}}

- **Economic defendability threshold explorer (SVG/JS)** — user adjusts resource density/predictability and defense cost, and the tool indicates whether territorial defense is predicted to be favored, mirroring the sunbird flower-density field result.

{{< iframe src="/economic-defendability-explorer.html" title="Economic Defendability Threshold Explorer" height="400px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. The sunbird-specific item was not sourced and remains unillustrated; the group-size cost/benefit item was replaced by a repurposed territory-economics image placed under "Territoriality" instead; see the note there.)*

<!-- VIDEO: African wild dog coordinated pack hunt showing cooperative group-living benefit in real time — Lycaon pictus — the coordination between individuals during a hunt is the actual mechanism producing the higher per-capita capture success rate cited in text -->
<!-- No video submitted for this item — comment left in place, unresolved. -->

## Practice Problems

1. In a hawk-dove model, if the value of winning a contest (V) is less than the cost of losing an escalated fight (C), explain why the ESS is predicted to be a mixed hawk/dove strategy rather than pure hawk.
2. A newly formed group of hens shows frequent fighting in its first few days, which drops sharply afterward even though the same individuals and resources are present. Explain this using dominance hierarchy formation.
3. A bird species defends flowering territories aggressively during the dry season (when flowers are sparse and clumped) but tolerates other individuals foraging freely during the wet season (when flowers are abundant and widespread). Explain this shift using economic defendability.
4. List one cost and one benefit of group living that would each become more significant as group size increases, and explain how their combined effect can produce an intermediate optimal group size rather than favoring the largest possible group.
5. Explain why resource holding potential is relevant to predicting the outcome of a contest between two individuals with an already-established dominance relationship, even without either individual escalating to a real fight.
