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

| Category | Period | Example |
|---|---|---|
| Ultradian | < 24 hours | Human REM/non-REM sleep cycle (~90 min) |
| Circadian | ~24 hours | Sleep-wake cycle, cortisol release |
| Infradian | > 24 hours, < 1 year | Human menstrual cycle (~28 days), lunar-linked spawning |
| Circannual | ~1 year | Migration timing, hibernation onset |

### Endogenous Rhythms and Free-Running Period

A defining, heavily tested property of these rhythms is that they are **endogenous** — generated internally by the organism, not simply a passive response to an external light/dark cycle — demonstrated experimentally by holding an animal (or human volunteer) under **constant conditions** (continuous dim light, no external time cues) and observing the rhythm persist. Under constant conditions, the rhythm's period is rarely exactly 24 hours; this **free-running period** typically drifts slightly from 24 hours (commonly a bit longer in humans, closer to 24.2-25 hours in classic isolation studies), and the fact that it drifts away from exactly 24 hours under constant conditions, while staying locked to exactly 24 hours under normal environmental cycling, is itself the evidence that an external synchronizing cue is normally required to keep the internal clock precisely aligned to the real day — covered next.

![Panel A: single-plotted actogram over ~23 days under constant conditions, activity onset drifting steadily later each day (marked by red guide lines). Panel B: a periodogram (signal amplitude Qp vs. period in hours) showing a clear peak free-running period of 23.58 hours.](/ETHOLOGYPICS/circadian-actogram-free-running-reentrainment.webp)
*Source: ResearchGate*

### Entrainment and Zeitgebers

**Entrainment** is the process by which an endogenous rhythm's free-running period is reset and synchronized to match the exact period of an external environmental cycle, and a **zeitgeber** ("time-giver," German) is the specific environmental cue that does the entraining. **Light** is the dominant zeitgeber for circadian rhythms in most studied animals — a light pulse delivered at different points in the circadian cycle produces a characteristic **phase response curve**: light early in the subjective night typically delays the clock, light late in the subjective night typically advances it, a pattern with direct practical relevance to jet lag and shift-work adaptation. Non-light zeitgebers also entrain rhythms in specific contexts, including scheduled feeding time (**food-entrainable oscillators**, capable of driving anticipatory activity before a predictable daily feeding time even in the near-absence of light cues) and, for circannual rhythms specifically, changing day length itself.

**Reading a zeitgeber entrainment plot.** Chronobiology data on non-light zeitgebers is usually presented as a multi-panel figure built around the same double-plotted actogram convention introduced above, worth being able to read directly rather than only in the abstract: a raster of activity (dark tick marks) plotted day-by-day down the page against time-of-day across the width, with the light/dark cycle and the zeitgeber's own schedule (e.g. a scheduled feeding window) shaded as background bands. When the zeitgeber and the light/dark cycle are put into conflict — a food-access window scheduled to drift relative to the light cycle, for instance — activity onset can be seen shifting to track whichever cue the animal is actually entraining to, visible directly as the activity raster bending to follow one shaded band rather than the other across successive days. Companion panels typically report the **distribution of free-running periods** measured across individual animals (often as a histogram or pie chart, since not every individual entrains identically), and a **phase-shift-vs-phase-angle plot**: the size and direction of the entrained rhythm's shift relative to the zeitgeber, plotted against how far out of phase the zeitgeber schedule was moved — a food-entrainable-oscillator analog of the light-pulse phase response curve above, showing the same general logic (shifts of opposite sign on either side of a central reference point) applied to a non-light cue.

![Seven-panel chronobiology figure on food-entrainable circadian rhythms: (a,d) double-plotted actograms of activity relative to dark phase and scheduled food access across ~35 days, (b) pie chart of measured free-running periods (53 animals &lt;28h vs. 8 animals =28h), (c) histogram of period length across animals, (e) periodogram amplitude vs. period with several individual peaks labeled, (f,g) phase shift (ΔTime relative to food access) plotted across successive days and against light-dark/feeding phase angle, respectively.](/ETHOLOGYPICS/zeitgeber.png)
*Source: user-provided*

### Photoperiodism

**Photoperiodism** is an organism's physiological or behavioral response to the *change* in day length (photoperiod) across the year, functioning as the primary environmental cue entraining circannual rhythms and triggering seasonally appropriate behavior in advance of the season's other, less predictable cues (temperature, food availability) actually changing. Photoperiod is a more reliable seasonal predictor than temperature precisely because day length at a given date and latitude is essentially fixed year to year, while temperature is comparatively noisy — migratory birds' **Zugunruhe** (migratory restlessness, see [Orientation & Navigation](../Orientation-Navigation/)) and reproductive-readiness onset in many temperate-zone breeders are both triggered substantially by photoperiod change rather than by the arrival of warmer weather itself, which is why captive animals held under artificially manipulated light schedules can be induced to show migratory restlessness or breeding condition out of the normal wild season.

> **Flagged — not usable:** the sourced image (`photoperiod-length-annual-graph.png`) is a *plant* physiology figure (New Phytologist) about carbon partitioning, sucrose/starch metabolism, and gene expression under short vs. long photoperiod in plants — a completely different domain from the animal migratory/breeding photoperiodism this section covers, sharing only the word "photoperiod." Not inserted; flagging in case a genuine day-length-across-the-year graph should be re-sourced.

<!-- VIDEO: Time-lapse of Zugunruhe (migratory restlessness) hopping/orientation behavior in a caged bird under a shifted photoperiod — the directional, agitated activity pattern itself is the measured behavioral output of photoperiodic entrainment and reads far more clearly as footage than description -->
<!-- Submitted source (americanart.si.edu) is (a) hosted on the Smithsonian's own player, not YouTube — this site has no embed shortcode for it — and (b) titled as a contemporary-art installation piece ("Zugunruhe" Installation Time-lapse, part of "The Singing and the Silence: Birds in Contemporary Art"), not raw behavioral footage. Not embedded; send a YouTube link of real Zugunruhe/Emlen-funnel footage instead. -->

### The Suprachiasmatic Nucleus

In mammals, the master circadian pacemaker is the **suprachiasmatic nucleus (SCN)**, a small paired nucleus in the hypothalamus, situated directly above the optic chiasm — a location that gives it direct input from a dedicated subset of retinal ganglion cells (containing the photopigment **melanopsin**, distinct from the rod/cone photoreceptors used for vision) carrying ambient light information used for entrainment, independent of the image-forming visual pathway. SCN neurons show self-sustained ~24-hour firing-rate rhythms even when isolated in tissue culture, direct cellular-level confirmation that circadian rhythmicity is generated intrinsically rather than requiring rhythmic input from elsewhere in the brain. The SCN's output governs the timing of numerous downstream physiological rhythms, most notably driving the pineal gland's nightly release of **melatonin**, whose rise and fall is used by the rest of the body (and by researchers, as a hormonal marker) to read out circadian phase.

![Sagittal brain diagram labeled with cerebral cortex, suprachiasmatic nucleus, optic chiasm, hypothalamus, pineal gland, and cerebellum, showing the SCN's position directly above the optic chiasm.](/ETHOLOGYPICS/scn-anatomical-diagram.jpg)
*Source: exam/textbook figure, specific origin not stated by submitter*

![Graph of melatonin levels in the bloodstream across roughly 48 hours, low and flat during two "awake" daytime periods and rising to a sharp peak during each intervening "asleep" nighttime period.](/ETHOLOGYPICS/melatonin-release-24h-timeline.jpg)
*Source: exam/textbook figure, specific origin not stated by submitter*

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

{{< iframe src="/phase-response-curve-explorer.html" title="Phase Response Curve Explorer" height="480px" >}}

- **Free-running vs. entrained rhythm simulator (Plotly)** — toggles between constant-condition (free-running, drifting period) and normal light/dark cycling (entrained, locked to 24h) for a simulated activity rhythm, plotted as a double-plotted actogram (the standard chronobiology visualization), making the drift-vs-lock distinction visually direct.

{{< iframe src="/free-running-entrained-actogram.html" title="Free-Running vs. Entrained Rhythm Simulator" height="560px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. The photoperiod graph was sourced but flagged as unusable — see the note under "Photoperiodism" above. The rhythm-category item was replaced with a plain markdown table, per explicit instruction, rather than a sourced graphic — see "Rhythm Categories" above.)*

<!-- VIDEO: Actogram data collection setup showing an animal's activity being recorded under constant dim-light conditions over successive days — the accumulating drift in activity onset time across days is the actual raw evidence for an endogenous, free-running rhythm -->
<!-- Submitted source (jove.com/v/2157) is hosted on JoVE's own player, not YouTube — this site has no embed shortcode for it. Content sounds like a strong match (JoVE publishes video methods papers, and "Assaying Locomotor Activity to Study Circadian Rhythms" is very likely real actogram data-collection methodology), but it can't be embedded without new plumbing. Not embedded; send a YouTube link if one covers the same methodology, or confirm adding a JoVE-embed shortcode is wanted. -->

## Practice Problems

1. A human volunteer kept in an isolation chamber with no clocks or natural light shows a sleep-wake cycle that gradually drifts to start about 40 minutes later each day. Explain what this demonstrates about the nature of the underlying circadian rhythm.
2. Explain why a light pulse delivered late in the subjective night typically advances a circadian clock, while the same pulse delivered early in the subjective night typically delays it, in terms of what "advance" and "delay" mean for the timing of the next cycle.
3. A hamster's SCN is surgically lesioned (destroyed), and its circadian activity rhythm becomes arrhythmic (no longer showing a consistent daily pattern) even under normal light/dark cycling. Explain what this result demonstrates about the SCN's role.
4. Explain why photoperiod is a more reliable cue than ambient temperature for triggering the onset of bird migration, using the concept of environmental cue predictability.
5. A marine invertebrate spawns synchronously with other members of its population only during specific moon phases. Classify this rhythm by period length and explain why synchrony with a population-wide cue (rather than an independent internal cue alone) would be favored for a reproductive event specifically.
