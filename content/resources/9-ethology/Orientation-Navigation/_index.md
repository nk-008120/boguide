---
title: "Orientation & Navigation"
weight: 4
description: "Kinesis vs. taxis, piloting/compass/map navigation senses, celestial and magnetic cues, and migration patterns and costs — how animals orient and move through space, completing the Communication & Orientation tier."
difficulty: "intermediate"
prerequisites: ["Mechanisms-of-Behavior"]
syllabus_tags: ["IBO", "USABO", "ethology"]
---
{{< topic-meta >}}

## Overview

Where [Animal Communication](../Animal-Communication/) covers signals passed between individuals, this page covers an animal's relationship to physical space itself — the simple stimulus-response movements that keep an animal in a favorable environment, and the far more sophisticated sensory systems that let some species navigate across thousands of kilometers back to a specific natal site. IBO/USABO questions on this topic are heavily example-driven and frequently ask for the specific named sensory mechanism (magnetite-based magnetoreception, sun-compass, star-compass) behind a described navigational feat, so precision about *which* mechanism is being tested in a given scenario matters more than a general "instinct" answer.

## Key Concepts

### Kinesis vs. Taxis

Both are simple, largely innate orientation responses to an environmental gradient, but differ in whether movement direction is tied to the stimulus direction:

- **Kinesis** is a change in movement *rate* or *turning frequency* in response to stimulus intensity, without the movement being directed toward or away from the stimulus source — the standard example is a woodlouse (*Porcellio*), which increases its turning rate in dry conditions and decreases it in humid conditions, a purely rate-based response that statistically keeps the animal in humid microhabitats without ever "steering" toward humidity as such.
- **Taxis** is movement *directed* toward or away from a stimulus source, named by modality and direction: **phototaxis** (light), **chemotaxis** (chemical gradient), **geotaxis** (gravity), **rheotaxis** (water current), each further labeled positive (toward) or negative (away) — e.g. positive rheotaxis in stream fish that orient and swim against the current to avoid being swept downstream.

### Piloting, Compass, and Map Senses

Navigation ability is conventionally split into three mechanisms of increasing sophistication, and exam scenarios often hinge on identifying which one a described experiment is isolating:

- **Piloting** — navigating using familiar landmarks already learned from direct prior experience of a route; fails entirely in unfamiliar territory.
- **Compass sense** — maintaining a constant, learned or innate compass bearing (e.g. "fly southwest") without reference to landmarks; sufficient to hold a direction but not to correct for being displaced off-course.
- **True navigation (map sense)** — determining one's position relative to a goal from an unfamiliar location and computing the correct heading to reach it, requiring some internal "map" of position beyond a simple compass bearing. The strongest evidence for true navigation comes from **clock-shift and displacement experiments**: homing pigeons transported in covered crates to a release site far outside their prior experience, and released with their internal circadian clock experimentally shifted by several hours, show a systematic, predictable *error* in initial heading consistent with using a time-compensated sun compass to compute direction — the predictable error itself is what demonstrates the mechanism, since a purely landmark-piloting bird would show no such systematic deflection.

### Celestial and Magnetic Cues

Two sensory systems underlie compass and map navigation in the best-studied species:

- **Sun compass** — using the sun's azimuth position, corrected for time of day via an internal circadian clock (an animal with an artificially shifted internal clock computes the wrong compass bearing by a predictable angle — the basis of the clock-shift experiments above), demonstrated in homing pigeons and in monarch butterfly migration.
- **Star compass** — used by nocturnally migrating birds; **Stephen Emlen's** planetarium experiments with indigo buntings showed that hand-raised birds exposed only to a planetarium sky rotating around an artificial "north" star oriented their migratory restlessness (**Zugunruhe**) relative to that artificial rotational center rather than to real celestial north, demonstrating the birds learn the star compass from the *pattern of rotation* of the night sky during development rather than being born with fixed knowledge of specific star positions.
- **Magnetoreception** — sensitivity to the Earth's magnetic field, well documented in migratory birds, sea turtles, and some fish, with **magnetite-based** (iron-oxide crystals proposed in or near the beak/head in birds) and **radical-pair/cryptochrome-based** (a light-dependent chemical mechanism in the eye, proposed as the basis of an "inclination compass" sensitive to field angle rather than polarity) mechanisms both under active study as complementary or alternative pathways.
- **Loggerhead sea turtle (*Caretta caretta*) natal homing** combines several of the above: hatchlings imprint on the magnetic signature of their natal beach and, after years at sea, adult females use magnetic map cues to return to nest at the same coastline — a heavily tested case because it demonstrates true map-like navigation (not just a compass bearing) over an ocean-basin scale with no landmarks available.

<!-- VIDEO: Homing pigeon clock-shift experiment showing the predictable heading error after a 6-hour internal clock shift — Columba livia — the deflection angle relative to true home direction is the entire evidentiary point and is far clearer as an animated vector diagram than a static one -->

### Migration

**Migration** is a regular, often seasonal, round-trip movement between two or more habitats, distinguished from simple dispersal by its regularity and directionality. The **ultimate (survival-value) explanation**, per Tinbergen's framework (see [Mechanisms of Behavior](../Mechanisms-of-Behavior/)), is usually resource seasonality and/or breeding-site quality trade-offs — the **Arctic tern (*Sterna paradisaea*)**'s roughly pole-to-pole annual migration (the longest of any animal) lets it exploit summer daylight and food abundance in both hemispheres in turn. Migration carries substantial costs directly testable in a cost-benefit framing: high energetic expenditure (fat reserves built up before departure and depleted en route), significant mortality risk during transit (storms, exhaustion, predation at unfamiliar stopover sites), and time lost that cannot be spent on reproduction or feeding — costs that must be outweighed by the resource/breeding benefit at the destination for migration to be evolutionarily stable, and the reason **partial migration** (only some individuals of a population migrate in a given year, often condition- or age-dependent) is common and itself an active research topic.

## Comparative Structures

| Mechanism | What it requires | What it cannot do | Example |
|---|---|---|---|
| Kinesis | Sensing stimulus intensity only | Directed movement | Woodlouse turning-rate response to humidity |
| Taxis | Sensing stimulus direction | Navigate without the stimulus present | Positive rheotaxis in stream fish |
| Piloting | Prior familiarity with landmarks | Work in unfamiliar territory | Pigeon navigating near its home loft |
| Compass sense | A fixed reference direction | Correct for displacement | Migratory Zugunruhe oriented to a set bearing |
| True navigation (map sense) | Positional information + compass | — (the most complete mechanism) | Loggerhead turtle natal homing via magnetic map |

## Common Exam Questions

- "A woodlouse increases its turning rate in dry air and decreases it in humid air, without moving directly toward humid patches. Is this kinesis or taxis, and why?"
- "Explain how a clock-shift experiment on homing pigeons demonstrates use of a time-compensated sun compass, including what result would be expected if pigeons instead relied purely on landmark piloting."
- "Describe Emlen's planetarium experiment with indigo buntings and explain what it shows about how the star compass is acquired."
- "Distinguish a compass sense from true navigation (map sense), and explain why only the latter allows an animal to correct course after being experimentally displaced."
- "Explain two distinct proposed mechanisms of magnetoreception and one migratory species each is associated with."
- "Using the Arctic tern, explain the ultimate (survival-value) benefit of migrating between hemispheres rather than remaining in one location year-round."

## Visual Reference

**Interactive**

- **Kinesis vs. taxis simulator (SVG/JS)** — a simulated organism moving on a 2D stimulus gradient, toggled between a kinesis rule (turning rate scales with stimulus intensity, direction random) and a taxis rule (movement directed along the gradient), letting the user see the same starting distribution produce clustering in humid patches under kinesis alone, without any directed steering.
- **Sun-compass clock-shift predictor (SVG/JS)** — user sets a true home direction and a clock-shift amount (hours), and the tool computes and displays the predicted heading error angle, mirroring the logic of the actual pigeon experiments.

**Static**

- Woodlouse humidity-kinesis diagram showing turning rate vs. humidity and resulting aggregation pattern
- Homing pigeon clock-shift experiment diagram: true home direction vs. clock-shifted predicted heading, with the angular error labeled
- Emlen funnel diagram (the actual apparatus used to record Zugunruhe orientation) with planetarium star-rotation setup
- World map of loggerhead sea turtle natal homing migration routes
- Arctic tern pole-to-pole migration route map with approximate annual distance labeled
- Comparison diagram of magnetite-based vs. cryptochrome/radical-pair magnetoreception proposed mechanisms

<!-- VIDEO: Emlen funnel recording indigo bunting Zugunruhe orientation under a rotating planetarium sky — Passerina cyanea — the directional scratching/hopping pattern the funnel captures is the actual data being interpreted and is easier to understand shown in motion -->

## Practice Problems

1. A fish in a stream consistently orients and swims against the current. Name this behavior precisely (modality and direction) and classify it as kinesis or taxis.
2. Pigeons with their internal clocks shifted 6 hours ahead, released at an unfamiliar site, initially fly in a direction offset by roughly 90° from the true home direction, then gradually correct over subsequent days. Explain what this reveals about the navigation mechanism in use, and why the initial error itself is the key evidence.
3. Indigo buntings raised in a planetarium under a sky that rotates around a star other than Polaris orient their migratory restlessness relative to that artificial star. What does this demonstrate about how the star compass develops, and who conducted this experiment?
4. Explain why loggerhead sea turtle natal homing is considered evidence of true navigation (map sense) rather than compass-sense-only navigation.
5. A migratory population shows some individuals migrating south each winter and others remaining resident year-round. Name this phenomenon and describe one factor known to influence which strategy an individual adopts.
