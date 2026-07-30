---
title: "Seed Germination & Dormancy Physiology"
weight: 10
description: "Imbibition as the physical trigger initiating germination, the GA/ABA hormonal balance controlling dormancy and its release, the aleurone layer's GA-induced alpha-amylase mechanism mobilizing stored reserves, and the epigeal versus hypogeal germination patterns distinguished by which embryonic axis segment elongates first."
difficulty: "intermediate"
prerequisites: ["Plant-Hormones"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}

## Overview

[Seed & Fruit Anatomy](../../6-plant-anatomy/seed-fruit-anatomy/) covered the mature, dormant seed's structure — seed coat/testa, embryo axis (radicle, hypocotyl, plumule), cotyledon(s) or endosperm as storage tissue. This page covers what happens physiologically from that dormant, dehydrated state to an actively growing seedling: the physical trigger that starts the process, the hormonal balance that determines whether a viable, hydrated seed germinates or stays dormant, and the specific enzymatic mechanism that converts stored reserves into usable energy for the growing embryo.

## Key Concepts

### Imbibition

Germination begins with **imbibition** — the physical uptake of water by the dry seed's hydrophilic storage macromolecules (starch, protein), generating substantial imbibitional pressure as the seed swells, entirely independent of any active or osmotic transport process (a dead or non-viable seed imbibes water just as readily as a living one, since imbibition is a passive physical property of the seed's dry tissue, not a metabolic response). Water typically enters first through the **micropyle** (the pore in the seed coat persisting from the ovule, see [Seed & Fruit Anatomy](../../6-plant-anatomy/seed-fruit-anatomy/)), rehydrating the embryo and reactivating enzymatic machinery that had been essentially inactive in the dry state. Imbibition alone is necessary but not sufficient for germination to proceed — a hydrated seed can still remain dormant if its internal hormonal balance (below) does not permit further development.

### The GA/ABA Balance Controlling Dormancy

Seed dormancy and its release are controlled by the same antagonistic hormone pair introduced on [Plant Hormones](../plant-hormones/), acting here specifically:

- **Abscisic acid (ABA)**, synthesized during seed maturation on the parent plant, maintains dormancy and, in many species, must be degraded or its signaling desensitized before germination can proceed — a mechanism preventing **vivipary** (premature germination while the seed is still attached to and nourished by the parent plant, which would be developmentally and often lethally disadvantageous).
- **Gibberellin (GA)** promotes the germination program directly once ABA's inhibitory effect has been sufficiently reduced, and is both necessary and sufficient to trigger the reserve-mobilization mechanism described below.

Dormancy release is often gated by an additional environmental requirement layered on top of this hormonal balance — cold stratification (a period of moist chilling, mechanistically parallel to vernalization's cold requirement for flowering, see [Photoperiodism, Vernalization & Flowering](../photoperiodism-vernalization-flowering/)), a period of after-ripening in dry storage, exposure to light (in some small seeds, via the same phytochrome system covered on that page), or scarification (physical or chemical abrasion of an unusually impermeable seed coat, common in many legumes) — each of these environmental gates ultimately acts by shifting the internal GA/ABA balance rather than by a separate independent mechanism.

### Reserve Mobilization: The Aleurone-GA-Amylase Mechanism

In cereal grains (a monocot seed structure, see [Seed & Fruit Anatomy](../../6-plant-anatomy/seed-fruit-anatomy/) for endosperm/scutellum anatomy), GA released once dormancy lifts diffuses from the embryo to the **aleurone layer** (a specialized, protein-rich outer layer of the endosperm), where it induces transcription of the enzyme **α-amylase**. Secreted α-amylase then hydrolyzes the endosperm's stored starch into soluble sugars, which the **scutellum** absorbs and transports to the growing embryo axis to fuel early growth before the seedling's own photosynthetic tissue is functional. This pathway is a classic, directly testable example of hormone-induced gene expression (GA as the inducing signal, α-amylase as the induced gene product, starch mobilization as the measurable downstream effect), and is why exogenous GA application to isolated aleurone layers is a standard experimental assay for GA activity.

### Epigeal versus Hypogeal Germination

Once growth resumes, species differ systematically in which embryonic axis segment (see [Seed & Fruit Anatomy](../../6-plant-anatomy/seed-fruit-anatomy/) for radicle/hypocotyl/plumule terminology) elongates to bring the seedling above ground:

- **Epigeal germination** — the **hypocotyl** elongates and forms a hook that straightens as it breaches the soil surface, lifting the cotyledons above ground where they typically expand and green briefly, contributing photosynthetically before senescing (common bean, castor bean).
- **Hypogeal germination** — the **epicotyl** (the plumule and the stem segment immediately above the cotyledon attachment) elongates instead, while the cotyledons remain below ground, never photosynthesizing and serving only as a stationary nutrient reserve depleted in place (pea, most monocot grains, where the cotyledon/scutellum stays embedded in the seed structure entirely).

This distinction is a direct, mechanistic consequence of which axis segment's cells are competent to elongate first in a given species, not merely a cosmetic difference in seedling appearance, and is a frequently tested practical-identification feature distinguishing seedlings of common crop species.

## Comparative Structures

| Feature | Epigeal germination | Hypogeal germination |
|---|---|---|
| Elongating segment | Hypocotyl | Epicotyl |
| Cotyledon fate | Raised above ground, often greens temporarily | Remains below ground, never photosynthesizes |
| Example | Common bean, castor bean | Pea, most cereal grains |

| Signal | Effect on dormancy |
|---|---|
| ABA | Maintains dormancy |
| GA | Releases dormancy, induces alpha-amylase |
| Cold stratification | Shifts balance toward GA (parallels vernalization) |
| Scarification | Removes physical/chemical barrier to imbibition or gas exchange |

## Common Exam Questions

- "Explain why imbibition occurs in both viable and non-viable seeds, and why it is therefore necessary but not sufficient for germination."
- "Explain the role of the GA/ABA balance in seed dormancy, and describe two environmental mechanisms that shift this balance toward germination."
- "Trace the aleurone-GA-amylase pathway from GA release to sugar delivery to the embryo, naming each tissue involved."
- "Distinguish epigeal from hypogeal germination by which embryonic axis segment elongates, and give an example species of each."
- "Explain why vivipary is normally prevented, and identify the hormone principally responsible for that prevention."

## Visual Reference

**Interactive**

- **GA/ABA dormancy balance slider (SVG/JS)** — a slider representing the relative GA:ABA ratio; moving it past a threshold visibly triggers the germination program (radicle emergence) in a schematic seed diagram, letting the user test how cold stratification or scarification (represented as balance-shifting buttons) push a dormant seed past that threshold.
- **Epigeal vs. hypogeal germination sequence toggle** — a seedling emergence animation that toggles between the two patterns, highlighting whichever axis segment (hypocotyl or epicotyl) is elongating and tracking cotyledon position throughout.

**Static**

- Imbibition diagram: dry seed, water entering via the micropyle, swelling and rehydration of embryo tissue
- Aleurone-GA-amylase pathway diagram: embryo releasing GA, diffusion to aleurone layer, alpha-amylase secretion, starch hydrolysis in the endosperm, sugar transport via the scutellum to the embryo
- GA/ABA dormancy balance diagram, showing the antagonistic relationship and the environmental factors shifting it
- Epigeal germination sequence (bean): hypocotyl hook, cotyledons raised and greening
- Hypogeal germination sequence (pea): epicotyl elongating, cotyledons remaining below ground

## Practice Problems

1. A batch of seeds is soaked in water but fails to germinate even after several days. Propose two distinct physiological explanations (one hormonal, one involving a specific environmental gate) for the failure.
2. Explain why applying exogenous GA to an isolated aleurone layer, in the absence of the rest of the seed, is sufficient to trigger alpha-amylase secretion.
3. A seedling emerges with its cotyledons remaining buried below the soil surface while its epicotyl elongates upward. Identify the germination pattern and name a typical example species.
4. Explain why ABA produced during seed maturation must be degraded or desensitized before germination, referencing the specific developmental outcome this prevents.
5. Explain, in terms of the GA/ABA balance, why cold stratification and vernalization (from Photoperiodism) can be described as mechanistically parallel processes despite triggering different downstream developmental outcomes (germination vs. flowering).
