---
title: "Water Transport & Transpiration"
weight: 1
description: "Water potential and its solute/pressure components, the cohesion-tension theory of transpirational pull, root pressure and guttation as its low-transpiration counterpart, and the apoplast/symplast/transmembrane pathways water takes across the root — the shared transport vocabulary the rest of this section assumes."
difficulty: "intermediate"
prerequisites: []
syllabus_tags: ["IBO", "USABO", "foundations"]
---
{{< topic-meta >}}

## Overview

Plant Anatomy described the conducting cells water moves through — the dead, lignified tracheid and vessel element tubes detailed on [Xylem, Phloem & Vascular Tissue](../../6-plant-anatomy/xylem-phloem-vascular-tissue/) — but structure alone doesn't move water upward against gravity through a column that can run tens of meters tall with no pump at the base. This page covers the physical mechanism that does: **water potential** as the universal currency water movement follows, the **cohesion-tension theory** explaining how transpiration at the leaf pulls an entire unbroken water column upward from the root, and **root pressure** as a separate, much weaker mechanism that operates specifically when transpiration is absent. Every later page in this section — stomatal control of transpiration's rate, phloem transport's very different pressure-driven mechanism, mineral uptake's dependence on the same root pathways — assumes the vocabulary developed here.

## Key Concepts

### Water Potential

Water moves passively from a region of higher **water potential (Ψ)** to lower water potential, never the reverse, regardless of the specific physical reason the potential differs — this single rule replaces the need to reason separately about osmosis, capillarity, and bulk flow as different phenomena. Water potential is the sum of two major components:

$$ \Psi = \Psi_s + \Psi_p $$

- **Solute potential (Ψₛ)**, also called osmotic potential — always negative or zero, since dissolved solutes lower a solution's free energy relative to pure water (Ψ = 0 by convention). A cell with a high solute concentration has a strongly negative Ψₛ and, all else equal, draws water in.
- **Pressure potential (Ψₚ)** — usually positive in a living, turgid cell (the protoplast pushing outward against a rigid cell wall generates **turgor pressure**), but can be strongly *negative* in the xylem under active transpiration (a tension, pulling rather than pushing) — the specific condition the cohesion-tension theory below depends on.

A cell at **full turgor** has Ψₚ exactly balancing Ψₛ, so Ψ = 0 and no further net water enters; a **flaccid** or **plasmolyzed** cell (Ψₚ near zero or negative, respectively) has Ψ driven entirely by Ψₛ. This framework is what makes it possible to predict water movement direction between any two compartments — soil, root cell, xylem, atmosphere — from their respective Ψ values alone, without needing a separate rule for each pair.

### Pathways Across the Root

Water entering at the root epidermis can travel toward the stele by three distinct routes, each with different resistance and different points of regulation:

- **Apoplast pathway** — through cell walls and intercellular spaces only, never crossing a membrane, until forced to cross one at the [Casparian strip](../../6-plant-anatomy/root-anatomy/) in the endodermis. This is the lowest-resistance route through the cortex, which is exactly why the Casparian strip's forced apoplast-to-symplast switch at that one layer matters — it is the plant's only checkpoint on this otherwise unregulated path.
- **Symplast pathway** — cell-to-cell via cytoplasm and **plasmodesmata**, without recrossing a membrane after the first entry. Because the entire symplast is cytoplasmically continuous, solutes and water move here under a single, shared regulatory environment rather than through independent cell-by-cell membrane crossings.
- **Transmembrane (transcellular) pathway** — cell to cell, crossing a plasma membrane at each cell boundary via **aquaporins** (water-channel proteins whose density and gating can be regulated, providing a fast-response control point on water flux independent of the slower symplastic route).

All three pathways converge at the endodermis, where the Casparian strip's suberin band blocks the apoplast route outright, forcing every water molecule that took that path to enter the symplast at that layer — the single mechanistic fact underlying selective mineral uptake, developed further on [Mineral Nutrition & Nutrient Uptake](../mineral-nutrition-nutrient-uptake/).

### Cohesion-Tension Theory

In an actively transpiring plant, water loss at the leaf (see [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/) for the stomatal mechanism controlling its rate) lowers the water potential of the leaf mesophyll cell walls, which draws water out of the nearest leaf xylem, which in turn lowers pressure potential throughout the entire continuous xylem water column all the way down to the root — because the column is unbroken, a pull applied at the top is transmitted as **tension** down its full length, the same way pulling one end of a taut rope moves the whole rope rather than just the end. Two properties of water make this possible without the column breaking apart under tension:

- **Cohesion** — hydrogen bonding between water molecules gives the column high tensile strength, allowing it to be pulled upward under substantial negative pressure without vaporizing or separating.
- **Adhesion** — hydrogen bonding between water molecules and the hydrophilic cellulose/lignin walls of the tracheid or vessel lumen counteracts the tendency of the water column to pull away from the vessel wall under tension, keeping the column continuous against the conduit surface.

The entire mechanism requires no metabolic energy input from the plant itself — it is a physical consequence of transpiration (itself driven by the water potential gradient between moist mesophyll air spaces and the typically much drier atmosphere) acting on a continuous, cohesive water column, which is why cohesion-tension can move water to the top of the tallest trees despite xylem being entirely composed of dead cells with no active pumping machinery.

<span class="badge-challenge">Failure mode</span> If the tension becomes too great (severe drought) or an air bubble enters the column (e.g. through injury, or via freeze-thaw cycles that nucleate bubbles from dissolved gas), the water column can break — an event called **cavitation**, producing an air-filled embolism that blocks that conduit permanently unless bypassed. This is precisely why the torus-margo pit membrane mechanism in gymnosperm tracheids (see [Xylem, Phloem & Vascular Tissue](../../6-plant-anatomy/xylem-phloem-vascular-tissue/)) exists structurally — to seal off a cavitated tracheid before the embolism spreads to its neighbors.

### Root Pressure and Guttation

When transpiration is low or absent (high humidity, at night, in young seedlings before a full canopy develops), the cohesion-tension mechanism above has little or no pull to contribute. Root cells continue to actively accumulate mineral ions in the stele via active transport, however, which lowers the stele's solute potential and draws water in osmotically — because the endodermis's Casparian strip prevents this water and the ions with it from simply leaking back out apoplastically, pressure builds up in the enclosed xylem and pushes water upward as a positive **root pressure**, mechanistically the opposite of cohesion-tension's pull. Root pressure is far weaker than transpirational pull and can raise water only a limited height (at most a few meters, not enough to explain water transport in tall trees), but under the right low-transpiration conditions it forces liquid water out of specialized leaf-margin pores called **hydathodes** as visible droplets — **guttation**, distinguishable from dew because it consists of xylem sap (containing trace solutes) exuded from a living structural pore, not condensed atmospheric water.

## Comparative Structures

| Feature | Cohesion-tension (transpirational pull) | Root pressure |
|---|---|---|
| Driving force | Negative pressure (tension) from leaf transpiration | Positive pressure from active ion accumulation in stele |
| Energy source | Passive (physical consequence of transpiration) | Active (ATP-driven ion transport into stele) |
| Magnitude | Sufficient to move water 100+ m | Limited to a few meters at most |
| When dominant | Actively transpiring plant (daytime, low humidity) | Low/no transpiration (night, high humidity, before leaf-out) |
| Visible sign | None directly (internal tension) | Guttation at hydathodes |
| Requires unbroken water column? | Yes — cavitation abolishes it | No |

## Common Exam Questions

- "Define water potential and its two major components, and predict the direction of water movement between two compartments given their Ψ values."
- "Explain why the xylem water column can be pulled upward under tension without breaking, referencing the two specific properties of water responsible."
- "Distinguish the apoplast, symplast, and transmembrane pathways of water movement across the root, and explain why only the apoplast pathway is blocked at the endodermis."
- "Explain why root pressure cannot account for water transport to the top of a tall tree, and identify the conditions under which it is the dominant mechanism instead."
- "Distinguish guttation from dew, referencing both the source of the liquid and the structure it exits through."
- "Explain what cavitation is and why it represents a failure of the cohesion-tension mechanism specifically, not of root pressure."

## Visual Reference

**Interactive**

- **Water potential gradient tracer (click-through SVG/JS, no new library)** — a chain of compartments (soil → root cortex → xylem → mesophyll → atmosphere) each showing a numeric Ψ value; clicking "release" animates a water droplet moving stepwise from highest to lowest Ψ, making the "always downhill in Ψ" rule visible as a single continuous path rather than a memorized ordering.
- **Cohesion-tension column simulator (SVG/JS)** — a vertical xylem column with a transpiration-rate slider; increasing transpiration visibly raises the pull (shown as a tension/negative-pressure readout at the base) and raises the water column height, while an injected air-bubble button demonstrates cavitation breaking the column and halting flow above that point.

**Static**

- Root cross-section with apoplast, symplast, and transmembrane pathways traced in three different colors from epidermis to stele, Casparian strip marked as the point the apoplast route is blocked
- Cohesion-tension mechanism diagram: transpiring leaf mesophyll cell wall → leaf xylem → stem xylem → root xylem → root hair, tension arrows shown continuous top to bottom
- Cavitation/embolism diagram: an air bubble blocking one xylem conduit, water rerouted through an adjacent conduit via a bordered pit
- Root pressure/guttation diagram: active ion accumulation in the stele, water drawn in osmotically, exuded at a leaf-margin hydathode as a droplet
- Water potential component diagram: a plant cell at full turgor, flaccid, and plasmolyzed, with Ψₛ/Ψₚ/Ψ values labeled at each state

## Practice Problems

1. A root cortex cell has Ψₛ = −0.8 MPa and Ψₚ = 0.3 MPa. Calculate its total water potential, and state whether it will gain or lose water if placed in contact with a solution of Ψ = −0.2 MPa.
2. Explain why blocking aquaporins with a chemical inhibitor would slow water uptake via the transmembrane pathway specifically, without directly affecting the apoplast pathway.
3. A well-watered seedling growing in high humidity at night shows droplets of liquid at its leaf margins. Identify the mechanism responsible and explain why it is not simply condensed dew.
4. Explain, in terms of water potential, why transpiration at the leaf surface is what initiates water movement all the way from the root, rather than the root "pushing" water up on its own during the day.
5. A xylem conduit undergoes cavitation after a severe frost. Explain what physically happened to the water column, and identify the structural feature (from Plant Anatomy) that limits the spread of this event to neighboring conduits in gymnosperms.
