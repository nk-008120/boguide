---
title: "Tropisms & Nastic Movements"
weight: 8
description: "Directional growth responses to light and gravity (phototropism, the Cholodny-Went model, gravitropism and statolith-based gravity sensing), thigmotropism in climbing/twining growth, and non-directional, reversible nastic movements driven by turgor change rather than differential growth."
difficulty: "intermediate"
prerequisites: ["Plant-Hormones"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}

## Overview

Because plants cannot relocate, they redirect growth and, in a smaller number of cases, rapidly reposition existing tissue in response to directional environmental cues. This page covers both categories: **tropisms**, directional growth responses whose direction depends on the stimulus's direction (built on the auxin mechanism from [Plant Hormones](../plant-hormones/)), and **nastic movements**, non-directional and often rapid responses driven by turgor change rather than differential growth, mechanistically closer to the guard cell turgor mechanism on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/) than to anything on this page's tropism side.

## Key Concepts

### Phototropism and the Cholodny-Went Model

**Phototropism** is directional growth toward (positive) or away from (negative) a light source, most classically observed as a grass coleoptile or dicot stem bending toward unilateral light. The **Cholodny-Went model**, built directly on the auxin transport mechanism established on [Plant Hormones](../plant-hormones/), explains this as **asymmetric auxin distribution** rather than a direct light-driven growth change: blue light is detected by **phototropin** photoreceptors (the same receptor class covered driving stomatal opening on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)) concentrated at the tip, which triggers lateral auxin transport toward the shaded side of the coleoptile or stem before the auxin is transported basipetally. Because auxin promotes cell elongation, the shaded side (now carrying more auxin) elongates faster than the illuminated side, and the unequal elongation rate on the two sides is what physically bends the stem toward the light — a differential-growth mechanism, not a bending of already-formed tissue. This is the same auxin transport machinery (**polar, PIN-transporter-mediated**) established by the Darwin/Went experiments, redirected laterally rather than simply basipetally.

### Gravitropism and Statolith Sensing

**Gravitropism** (geotropism) is directional growth relative to gravity: most roots show **positive gravitropism** (grow toward gravity, downward) while most shoots show **negative gravitropism** (grow away from gravity, upward) — the same organ-specific auxin sensitivity difference explaining the opposite sign, since roots are far more sensitive to auxin and are inhibited by the same concentration that promotes elongation in a shoot. Gravity is detected via **statoliths** — dense, starch-filled amyloplasts that settle toward the gravity-ward side of specialized **statocyte** cells (concentrated in the root cap's columella cells, and in the stem's endodermis or vascular bundle sheath) under simple sedimentation. Statolith settling triggers redistribution of **PIN auxin transporters** to the lower side of the statocyte, again producing asymmetric lateral auxin transport exactly as in phototropism, but triggered by gravity sensing rather than light sensing, and with an opposite growth response in root tissue because of that tissue's heightened auxin sensitivity. A root's gravitropic response depends on an intact root cap — removing it experimentally abolishes gravity sensing (though not growth itself), directly implicating the cap's statocytes as the sensing site rather than the elongating zone behind it.

### Thigmotropism

**Thigmotropism** is directional growth in response to physical contact, most visibly in the tendrils of climbing plants (e.g. pea, grape, cucumber), which grow straight until contacting a support, then rapidly curl around it via differential, contact-side-specific growth — mechanistically an asymmetric growth response analogous to photo- and gravitropism, but triggered by mechanical touch receptors rather than light or statolith sedimentation. Twining stems (e.g. morning glory, bindweed) show a related but distinct whole-stem coiling response used to climb a support without a specialized tendril organ.

### Nastic Movements

Unlike tropisms, **nastic movements** are non-directional — the response's form is fixed regardless of the stimulus's direction, and the response is typically driven by rapid, reversible **turgor pressure change** in specialized motor cells (a **pulvinus**, a swollen joint-like structure at the base of a leaf or leaflet) rather than by differential growth, which is why nastic responses can be far faster and fully reversible, unlike a tropism's growth-based bend.

- ***Mimosa pudica* seismonastic response (touch-me-not)** — mechanical stimulation triggers a rapid **action-potential-like electrical signal** that propagates to the pulvinus, where motor cells on one side rapidly lose K⁺ and water (turgor collapse) while the opposite side does not, causing the leaflets to fold and the petiole to droop within seconds — a defensive response thought to deter herbivores by suddenly appearing less like intact leaf tissue, or to dislodge small feeding insects directly.
- **Venus flytrap (*Dionaea*) snap-trap closure** — mechanical stimulation of trigger hairs on the trap's inner surface (requiring two touches within roughly 20 seconds, or one sustained touch, a specific threshold mechanism reducing false triggers from a single raindrop or debris) generates an action potential that triggers rapid turgor-driven closure of the trap lobes, followed by slower, growth-based tightening that seals the trap fully once prey is confirmed present by continued struggling.
- **Nyctinasty (sleep movements)** — rhythmic leaf/leaflet folding at night in many legumes, driven by circadian-timed turgor changes in a pulvinus, distinct from any external stimulus (i.e., an endogenous nastic rhythm rather than a stimulus-triggered one), conceptually related to the circadian stomatal baseline covered on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/).

## Comparative Structures

| Feature | Tropisms (photo-, gravi-, thigmotropism) | Nastic movements |
|---|---|---|
| Direction of response | Depends on stimulus direction | Fixed, independent of stimulus direction |
| Underlying mechanism | Differential growth (asymmetric auxin distribution) | Turgor pressure change in motor cells (pulvinus) |
| Speed | Slow (hours) | Fast (seconds) to slow (nyctinasty, circadian) |
| Reversible? | No (growth is permanent) | Yes (turgor can be restored) |
| Example | Coleoptile bending toward light | *Mimosa* leaf-folding on touch |

## Common Exam Questions

- "Explain the Cholodny-Went model of phototropism, tracing the signal from blue-light detection to differential stem elongation."
- "Explain why roots and shoots show opposite gravitropic responses to the same auxin redistribution mechanism."
- "Explain the role of statoliths and statocytes in gravity sensing, and predict the effect of surgically removing a root cap."
- "Distinguish a tropism from a nastic movement using two criteria: directionality and underlying mechanism (growth vs. turgor)."
- "Explain why the Venus flytrap requires two trigger-hair touches within a short window before closing, rather than responding to a single touch."

## Visual Reference

**Interactive**

- **Phototropic bending mechanism animator (SVG/JS)** — a coleoptile cross-section under unilateral light; activating the response shows phototropin detection, lateral PIN-transporter relocalization, auxin accumulating on the shaded side, and the resulting differential elongation bending the coleoptile toward the light, step by step.
- **Statolith gravity-sensing simulator (click-through, tiltable diagram)** — a root cap statocyte cell that can be "tilted" by the user; statoliths visibly resettle toward the new gravity-ward side, triggering a redrawn auxin distribution and predicted growth direction, letting the user test multiple orientations rather than only the vertical default.

**Static**

- Cholodny-Went model diagram: unilateral light, phototropin detection, PIN relocalization, auxin gradient, differential elongation, final bend
- Root gravitropism diagram: intact root cap with statocytes vs. root-cap-removed root, gravitropic response present/absent
- Thigmotropic tendril coiling sequence: straight tendril, contact, differential contact-side growth, coiled tendril around a support
- Mimosa pudica pulvinus cross-section: turgid (leaflet open) vs. flaccid (leaflet folded) motor cell states
- Venus flytrap trigger-hair/action-potential-to-closure sequence diagram

## Practice Problems

1. A coleoptile is illuminated uniformly from all sides simultaneously. Predict whether it will bend, and explain your prediction using the Cholodny-Went model.
2. A root's cap is removed but the root continues to elongate. Predict whether it will still respond gravitropically, and explain why.
3. Explain why the same lateral auxin redistribution mechanism causes a root to bend toward gravity and a shoot to bend away from it.
4. A Mimosa pudica leaf folds within two seconds of being touched, then reopens fully ten minutes later. Explain why this response is classified as nastic rather than tropic, and why it is reversible while a tropic response is not.
5. Explain the functional significance of the Venus flytrap's two-touch closure threshold in terms of avoiding a wasted response.
