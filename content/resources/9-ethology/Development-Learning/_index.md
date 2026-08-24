---
title: "Development & Learning"
weight: 2
description: "Innate vs. learned behavior, critical and sensitive periods, imprinting, habituation and sensitization, classical and operant conditioning, observational and insight learning, and play behavior: the acquisition side of Tinbergen's developmental question."
difficulty: "intermediate"
prerequisites: ["Mechanisms-of-Behavior"]
syllabus_tags: ["IBO", "USABO", "ethology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

Where [Mechanisms of Behavior](../mechanisms-of-behavior/) covered the innate, hard-wired end of behavior (a fixed action pattern triggered reliably by a sign stimulus in any individual of the species), this page covers the opposite and complementary end: behavior that is acquired or modified by individual experience. Almost no real behavior is purely one or the other; the useful distinction for exam purposes is which **learning mechanism** is at work in a given scenario, since IBO/USABO questions are consistently framed as "an animal does X after experience Y, name the learning type." Six mechanisms recur: habituation, sensitization, imprinting, classical conditioning, operant conditioning, and observational/insight learning, each illustrated below with the specific named experiment it's usually tested against.

## Key Concepts

### Innate vs. Learned Behavior

**Innate behavior** is performed correctly without prior experience: a fixed action pattern is the clearest case, and its universality within a species (every individual raised in isolation still performs it) is the standard evidence used to argue a behavior is innate rather than learned. **Learned behavior** is modified by individual experience and can therefore differ between individuals of the same species raised in different conditions. The clean textbook split rarely survives contact with real organisms, though: many behaviors are innate *predispositions* refined by experience (e.g., bird song is often innately constrained to a species-typical template but requires early auditory exposure to a tutor to develop normally, a white-crowned sparrow raised in acoustic isolation sings an abnormal, simplified song even though no other species' song was ever presented). Exam scenarios frequently hinge on this middle ground rather than a pure either/or.

### Critical and Sensitive Periods

A **critical period** is a developmental window outside of which a specific experience-dependent behavior cannot be acquired at all; a **sensitive period** is a window during which the behavior is most easily and strongly acquired but can still form, less readily, outside it. The two terms are frequently conflated in casual use but are testable as a distinction. **Filial imprinting** in precocial birds is the sharpest example of a true critical period: goslings and ducklings imprint on the first sufficiently large, moving object they encounter within roughly the first 13-16 hours after hatching, and imprinting largely fails to occur if this window is missed. Bird song acquisition (above) is a better example of a genuine sensitive period: later exposure can still produce partial learning, just less complete than exposure during the peak window.

![Graph of brain thyroid hormone level across developmental day in imprinted vs. dark-reared chicks, with the sensitive period and "memory priming" window bracketed and a dashed threshold line marking the level needed to cause imprinting.](/ETHOLOGYPICS/goose-imprinting-critical-period-timeline.jpg)
*Source: nature.com (Nature Communications)*

### Imprinting

**Filial imprinting** (young precocial animals forming a rapid, largely irreversible attachment to and following-response toward the first appropriately moving stimulus encountered) is the case study most associated with **Konrad Lorenz**, who famously became the imprinted "parent" of a clutch of greylag geese he raised from hatching, demonstrating the response could attach to an inappropriate object (a human, or in later experiments a moving box) if presented at the critical window instead of the biological parent. A second, distinct form, **sexual imprinting**, occurs later in development and shapes adult mate-species preference rather than following behavior; cross-fostering experiments (e.g. zebra finches raised by Bengalese finch foster parents) show the fostered bird preferentially courts the foster species as an adult, demonstrating sexual imprinting is a separate learning process from filial imprinting, not just an extension of it.

<!-- VIDEO: Lorenz's imprinted goslings following him instead of an adult goose, Anser anser, the following-response itself is the entire phenomenon and reads far more clearly in motion than in a still photo -->

### Habituation and Sensitization

**Habituation** is the simplest form of learning: a decrease in response strength to a repeated, harmless stimulus. The classic demonstration is the marine snail *Aplysia californica*'s gill-withdrawal reflex, which weakens with repeated light siphon touches (and is the model organism Eric Kandel used to work out the actual synaptic mechanism of habituation, reduced neurotransmitter release at the sensory-to-motor synapse, earning a Nobel Prize). **Sensitization** is the opposite: an *increase* in response strength to a stimulus following exposure to a strong or noxious stimulus (in the same *Aplysia* system, a shock to the tail strengthens the gill-withdrawal response to a subsequent light touch that previously produced little response). Both are non-associative forms of learning, no pairing between two stimuli is required, unlike conditioning below.

### Classical Conditioning

**Classical (Pavlovian) conditioning** is associative learning in which a neutral stimulus comes to elicit a response by being repeatedly paired with a stimulus that already elicits that response. In **Ivan Pavlov's** dogs: food (**unconditioned stimulus**, UCS) naturally elicits salivation (**unconditioned response**, UCR); a bell (**neutral stimulus**) paired repeatedly with food comes to elicit salivation on its own (now the **conditioned stimulus**, CS, eliciting a **conditioned response**, CR). Key associated phenomena worth naming precisely: **extinction** (the CR weakens if the CS is repeatedly presented without the UCS), **spontaneous recovery** (an extinguished CR can reappear after a rest period, showing extinction suppresses rather than erases the association), and **stimulus generalization** (a stimulus similar to the CS also elicits some CR).

![Four-panel diagram of Pavlov's classical conditioning: before conditioning (food/UCS naturally elicits salivation/UCR; bell alone elicits no response), during conditioning (bell paired with food), and after conditioning (bell alone/CS now elicits salivation/CR).](/ETHOLOGYPICS/pavlov-classical-conditioning-diagram.png)
*Source: ResearchGate, fig. from a classical-conditioning explainer*

### Operant Conditioning

**Operant conditioning** is associative learning in which the *consequence* of a voluntary behavior changes the future frequency of that behavior, formalized by **B.F. Skinner** using the "Skinner box," where a rat or pigeon's lever-press or key-peck behavior is shaped by what follows it.

![Labeled Skinner box schematic: response lever, food dispenser, electrified grid floor, plus loudspeakers and lights used to present auditory/visual stimuli.](/ETHOLOGYPICS/skinner-box-schematic.svg)
*Source: Wikipedia, "Operant conditioning chamber"*

Four consequence categories are commonly tested and commonly confused, since "positive/negative" refers to whether something is *added or removed*, not to whether the outcome is pleasant:

| Term | Mechanism | Effect on behavior | Example |
|---|---|---|---|
| Positive reinforcement | Add a desirable stimulus | Increases behavior | Rat gets a food pellet for pressing a lever |
| Negative reinforcement | Remove an aversive stimulus | Increases behavior | Rat's floor shock stops when it presses a lever |
| Positive punishment | Add an aversive stimulus | Decreases behavior | Rat receives a shock for pressing a lever |
| Negative punishment | Remove a desirable stimulus | Decreases behavior | Rat's food access is taken away for pressing a lever |

![Reinforcement/punishment quadrant graphic: vertical axis "increase in behaviour" vs. "decrease in behaviour," horizontal axis "remove stimulus" vs. "add stimulus," with positive reinforcement, negative reinforcement, positive punishment, and negative punishment labeled in the four resulting quadrants.](/ETHOLOGYPICS/operant-conditioning-quadrant-table-graphic.webp)
*Source: ResearchGate, fig. illustrating reinforcement/punishment categories*

**Reinforcement schedules** are also directly testable: **continuous reinforcement** (every response reinforced) produces fast learning but fast extinction; **partial/intermittent schedules** (fixed-ratio, variable-ratio, fixed-interval, variable-interval) produce slower learning but far greater resistance to extinction; variable-ratio schedules in particular produce the highest, steadiest response rates, the same principle underlying slot-machine-style unpredictable reward.

### Observational and Insight Learning

**Observational (social) learning** is acquiring a behavior by watching another individual perform it, without direct trial-and-error by the observer, the best-documented wild case is **milk-bottle-top opening in British great tits (*Parus major*)**, which spread through local populations from a small number of innovating individuals in a pattern consistent with social transmission rather than independent invention at every location. A closely related and more specific case, **social learning of a novel food-processing technique**, is the well-documented **Japanese macaque (*Macaca fuscata*) potato-washing** case on Koshima Island, where a young female's innovation of washing sand off sweet potatoes spread through her troop over subsequent years, disproportionately through younger animals and closely bonded individuals, a pattern used as evidence for cultural transmission in a non-human primate.

![Photograph of two Koshima Island Japanese macaques at the water's edge, one holding and washing a sweet potato before eating it.](/ETHOLOGYPICS/koshima-macaque-potato-washing-spread.jpg)
*Source: ResearchGate, photo credited to T. Matsuzawa*

**Insight learning** is the sudden, apparently non-trial-and-error solving of a novel problem by combining previously learned elements, **Wolfgang Köhler's** captive chimpanzee experiments are the classic case, in which a chimpanzee unable to reach a suspended banana directly abruptly stacked crates or joined two short sticks into a longer one to reach it, without an observable period of gradual trial-and-error immediately preceding the solution.

![Black-and-white photograph of a Köhler chimpanzee experiment: one chimpanzee climbing a hanging rope/pole above a stack of crates, with other chimpanzees watching from the ground near additional crate materials.](/ETHOLOGYPICS/kohler-chimpanzee-stick-joining-insight.jpg)
*Source: pigeon.psy.tufts.edu (Tufts University, Psych 26 course materials)*

<!-- VIDEO: Japanese macaque potato-washing behavior spreading through the Koshima troop, Macaca fuscata, the spread-through-social-contact pattern is the point being taught and is much clearer shown across individuals than described -->

### Play Behavior

**Play** (behavior performed with no immediate survival or reproductive payoff, often an exaggerated or out-of-context version of adult functional behavior: play-fighting, play-hunting, locomotor play) is most common in juveniles of species with extended developmental periods and larger brains (particularly mammalian carnivores and primates). Its ultimate function is debated but the leading hypotheses, both testable as exam content, are that play allows **low-stakes practice of adult motor skills** (predatory, competitive, or social) before they carry real consequences, and that it builds **social/behavioral flexibility** useful for coping with unpredictable situations later in life.

## Comparative Structures

| Learning type | Associative? | Classic example |
|---|---|---|
| Habituation | No | *Aplysia* gill-withdrawal weakening to repeated touch |
| Sensitization | No | *Aplysia* gill-withdrawal strengthening after tail shock |
| Filial imprinting | No (not stimulus-pairing based) | Lorenz's greylag goslings following him |
| Classical conditioning | Yes (stimulus-stimulus) | Pavlov's dogs, bell paired with food |
| Operant conditioning | Yes (behavior-consequence) | Skinner box lever-pressing for food |
| Observational learning | N/A (social transmission) | Great tit milk-bottle-opening spread |
| Insight learning | N/A (novel recombination) | Köhler's chimpanzees stacking crates |

## Common Exam Questions

- "A rat learns to press a lever to avoid a mild electric shock. Name this specific type of operant consequence, and explain why it is not 'punishment' despite the shock being aversive."
- "Distinguish habituation from sensitization using the same reflex (e.g. *Aplysia* gill withdrawal) responding oppositely to two different prior stimuli."
- "Explain why filial imprinting in geese is described as having a critical period rather than a sensitive period, contrasting it with bird song acquisition."
- "A chimpanzee that has never been shown how to use tools joins two sticks together to reach food after a period with no visible trial-and-error. What learning type is this, and who is most associated with demonstrating it?"
- "Explain why variable-ratio reinforcement schedules produce behavior that is unusually resistant to extinction, using a named real-world example of the same principle."
- "Distinguish filial imprinting from sexual imprinting in terms of what each shapes and when in development each occurs."

## Visual Reference

**Interactive**

- **Operant conditioning quadrant classifier (drag-and-drop, HTML/JS, no new library)**: named consequence scenarios sorted into positive/negative reinforcement/punishment, with immediate feedback, directly targeting the "positive/negative ≠ pleasant/unpleasant" confusion that drives most wrong answers on this topic.

{{< iframe src="/operant-quadrant-classifier.html" title="Operant Conditioning Quadrant Classifier" height="480px" >}}

- **Reinforcement schedule response-rate simulator (Plotly)**, lets the user select continuous, fixed-ratio, variable-ratio, fixed-interval, or variable-interval schedules and view a simulated cumulative-response curve for each, then compare extinction rate after reinforcement stops, making the abstract "resistance to extinction" claim visually concrete.

{{< iframe src="/reinforcement-schedule-simulator.html" title="Reinforcement Schedule Response-Rate Simulator" height="520px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here)*

{{< youtube PQtDTdDr8vs >}}

## Practice Problems

1. A dog salivates at the sound of a can opener even when no food follows. Identify which element of classical conditioning (CS, CR, UCS, UCR) each part of this scenario represents.
2. A gosling raised from hatching by a research team imprints on the lead researcher instead of its biological mother. Explain why this happened in terms of critical period timing, and what would likely happen if the same exposure occurred two weeks after hatching instead.
3. A pigeon's key-pecking rate stays high and steady for a long period even after food delivery stops entirely. What reinforcement schedule most likely produced this pattern, and why?
4. Explain, using the *Aplysia* gill-withdrawal reflex, how the same neural circuit can show either habituation or sensitization depending on what stimulus preceded the test touch.
5. A dolphin combines two previously trained individual behaviors into a novel behavior on its first attempt at a new task, with no apparent trial and error. Which learning type best describes this, and how would you distinguish it experimentally from operant conditioning that simply happened very quickly?
