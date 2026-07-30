---
title: "Biological Rhythms"
weight: 9
description: "Circadian and circannual rhythms, photoperiodism, entrainment, and the suprachiasmatic nucleus as a biological clock — the timing layer underlying migration, foraging, and reproductive behavior covered elsewhere in this section."
difficulty: "intermediate"
prerequisites: ["Mechanisms-of-Behavior"]
syllabus_tags: ["IBO", "USABO", "ethology"]
---
{{< topic-meta >}}

## Overview

Nearly every behavior covered elsewhere in this section is timed against an internal or environmental clock: the sun-compass mechanism in [Orientation & Navigation](../Orientation-Navigation/) depends on an internal circadian clock to correct for time of day, and seasonal migration and breeding timing depend on a longer-period internal clock tracking time of year. This closing page covers that timing machinery directly — the different rhythm periods recognized in ethology, the environmental cues that keep an internal clock synchronized to the real world, and the specific neural structure that generates the rhythm in mammals.

## Key Concepts

### Rhythm Categories

Biological rhythms are classified by their period length, and each is independently testable as its own named category:

- **Circadian rhythms** — roughly 24-hour period (from Latin *circa diem*, "about a day"), governing sleep-wake cycles, body temperature fluctuation, and hormone release timing (e.g. cortisol) in most animals studied.
- **Circannual rhythms** — roughly 365-day period, governing annual events like migration timing, hibernation onset, and breeding-season timing, and persisting (though often drifting) even in animals held under artificially constant conditions without seasonal cues — direct evidence the rhythm is internally generated, not purely a direct response to changing day length.
- **Ultradian rhythms** — periods shorter than 24 hours, e.g. the roughly 90-minute human sleep-stage cycle (alternating REM and non-REM sleep phases within a single night's circadian sleep period).
- **Infradian rhythms** — periods longer than 24 hours but shorter than a year, e.g. the roughly 28-day human menstrual cycle, or lunar-linked spawning cycles in some marine invertebrates and fish timed to specific moon phases.

### Endogenous Rhythms and Free-Running Period

A defining, heavily tested property of these rhythms is that they are **endogenous** — generated internally by the organism, not simply a passive response to an external light/dark cycle — demonstrated experimentally by holding an animal (or human volunteer) under **constant conditions** (continuous dim light, no external time cues) and observing the rhythm persist. Under constant conditions, the rhythm's period is rarely exactly 24 hours; this **free-running period** typically drifts slightly from 24 hours (commonly a bit longer in humans, closer to 24.2-25 hours in classic isolation studies), and the fact that it drifts away from exactly 24 hours under constant conditions, while staying locked to exactly 24 hours under normal environmental cycling, is itself the evidence that an external synchronizing cue is normally required to keep the internal clock precisely aligned to the real day — covered next.

### Entrainment and Zeitgebers

**Entrainment** is the process by which an endogenous rhythm's free-running period is reset and synchronized to match the exact period of an external environmental cycle, and a **zeitgeber** ("time-giver," German) is the specific environmental cue that does the entraining. **Light** is the dominant zeitgeber for circadian rhythms in most studied animals — a light pulse delivered at different points in the circadian cycle produces a characteristic **phase response curve**: light early in the subjective night typically delays the clock, light late in the subjective night typically advances it, a pattern with direct practical relevance to jet lag and shift-work adaptation. Non-light zeitgebers also entrain rhythms in specific contexts, including scheduled feeding time (**food-entrainable oscillators**, capable of driving anticipatory activity before a predictable daily feeding time even in the near-absence of light cues) and, for circannual rhythms specifically, changing day length itself.

### Photoperiodism

**Photoperiodism** is an organism's physiological or behavioral response to the *change* in day length (photoperiod) across the year, functioning as the primary environmental cue entraining circannual rhythms and triggering seasonally appropriate behavior in advance of the season's other, less predictable cues (temperature, food availability) actually changing. Photoperiod is a more reliable seasonal predictor than temperature precisely because day length at a given date and latitude is essentially fixed year to year, while temperature is comparatively noisy — migratory birds' **Zugunruhe** (migratory restlessness, see [Orientation & Navigation](../Orientation-Navigation/)) and reproductive-readiness onset in many temperate-zone breeders are both triggered substantially by photoperiod change rather than by the arrival of warmer weather itself, which is why captive animals held under artificially manipulated light schedules can be induced to show migratory restlessness or breeding condition out of the normal wild season.

<!-- VIDEO: Time-lapse of Zugunruhe (migratory restlessness) hopping/orientation behavior in a caged bird under a shifted photoperiod — the directional, agitated activity pattern itself is the measured behavioral output of photoperiodic entrainment and reads far more clearly as footage than description -->

### The Suprachiasmatic Nucleus

In mammals, the master circadian pacemaker is the **suprachiasmatic nucleus (SCN)**, a small paired nucleus in the hypothalamus, situated directly above the optic chiasm — a location that gives it direct input from a dedicated subset of retinal ganglion cells (containing the photopigment **melanopsin**, distinct from the rod/cone photoreceptors used for vision) carrying ambient light information used for entrainment, independent of the image-forming visual pathway. SCN neurons show self-sustained ~24-hour firing-rate rhythms even when isolated in tissue culture, direct cellular-level confirmation that circadian rhythmicity is generated intrinsically rather than requiring rhythmic input from elsewhere in the brain. The SCN's output governs the timing of numerous downstream physiological rhythms, most notably driving the pineal gland's nightly release of **melatonin**, whose rise and fall is used by the rest of the body (and by researchers, as a hormonal marker) to read out circadian phase.

## Comparative Structures

| Rhythm type | Period | Example |
|---|---|---|
| Ultradian | < 24 hours | Human REM/non-REM sleep cycle (~90 min) |
| Circadian | ~24 hours | Sleep-wake cycle, cortisol release |
| Infradian | > 24 hours, < 1 year | Human menstrual cycle (~28 days), lunar-linked spawning |
| Circannual | ~1 year | Migration timing, hibernation onset |

## Common Exam Questions

- "Explain what evidence would demonstrate that a circadian rhythm is endogenous rather than a direct response to the light/dark cycle, and what result under constant conditions would support this."
- "Define zeitgeber and entrainment, and explain why the free-running period under constant conditions is rarely exactly 24 hours even though the entrained period always is."
- "Explain why photoperiod, rather than temperature, is the primary cue triggering seasonal migratory and reproductive timing in many temperate-zone species."
- "Describe the anatomical location and light-input pathway of the suprachiasmatic nucleus, and explain why its input is independent of the image-forming visual system."
- "Isolated SCN neurons in tissue culture continue to show a roughly 24-hour firing rhythm with no external input. What does this demonstrate about the origin of circadian rhythmicity?"
- "A migratory bird held under an artificially shortened photoperiod schedule shows Zugunruhe earlier than birds under the natural photoperiod. Explain this result."

## Visual Reference

**Interactive**

- **Phase response curve explorer (Plotly)** — user selects a time within the circadian cycle to deliver a simulated light pulse and views the resulting phase delay or advance, reproducing the qualitative logic behind jet lag direction and recovery time depending on travel direction.
- **Free-running vs. entrained rhythm simulator (Plotly)** — toggles between constant-condition (free-running, drifting period) and normal light/dark cycling (entrained, locked to 24h) for a simulated activity rhythm, plotted as a double-plotted actogram (the standard chronobiology visualization), making the drift-vs-lock distinction visually direct.

**Static**

- Actogram diagram (the standard double-plotted activity-rhythm chart used in chronobiology) showing free-running drift under constant conditions followed by re-entrainment once light cues resume
- SCN anatomical diagram showing its position above the optic chiasm and the melanopsin retinal ganglion cell input pathway
- Melatonin release timeline across a 24-hour cycle, day vs. night
- Photoperiod-length-across-the-year graph annotated with the migratory/breeding-onset trigger point
- Rhythm category comparison chart (ultradian/circadian/infradian/circannual periods and examples, as above)

<!-- VIDEO: Actogram data collection setup showing an animal's activity being recorded under constant dim-light conditions over successive days — the accumulating drift in activity onset time across days is the actual raw evidence for an endogenous, free-running rhythm -->

## Practice Problems

1. A human volunteer kept in an isolation chamber with no clocks or natural light shows a sleep-wake cycle that gradually drifts to start about 40 minutes later each day. Explain what this demonstrates about the nature of the underlying circadian rhythm.
2. Explain why a light pulse delivered late in the subjective night typically advances a circadian clock, while the same pulse delivered early in the subjective night typically delays it, in terms of what "advance" and "delay" mean for the timing of the next cycle.
3. A hamster's SCN is surgically lesioned (destroyed), and its circadian activity rhythm becomes arrhythmic (no longer showing a consistent daily pattern) even under normal light/dark cycling. Explain what this result demonstrates about the SCN's role.
4. Explain why photoperiod is a more reliable cue than ambient temperature for triggering the onset of bird migration, using the concept of environmental cue predictability.
5. A marine invertebrate spawns synchronously with other members of its population only during specific moon phases. Classify this rhythm by period length and explain why synchrony with a population-wide cue (rather than an independent internal cue alone) would be favored for a reproductive event specifically.
