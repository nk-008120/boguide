---
title: "Mineral Nutrition & Nutrient Uptake"
weight: 4
description: "Essential macro- and micronutrients and their deficiency symptoms, active/selective ion uptake mechanisms at the root, and the nitrogen-fixing Rhizobium and mycorrhizal symbioses that extend a plant's nutrient-acquisition capacity beyond what its own roots can achieve alone."
difficulty: "intermediate"
prerequisites: ["Water-Transport-Transpiration"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}

## Overview

Water movement into the root, covered on [Water Transport & Transpiration](../water-transport-transpiration/), is not selective — it moves down a water potential gradient regardless of what's dissolved in it. Mineral uptake is a separate problem: the plant needs specific ions in specific amounts, often against their own concentration gradient, and it solves this both with its own root machinery and by outsourcing part of the task to microbial partners. This page covers what nutrients a plant actually needs, how its roots take them up selectively, and the two major symbioses — nitrogen-fixing bacteria and mycorrhizal fungi — that extend a plant's effective root system far beyond its own tissue.

## Key Concepts

### Essential Elements

An element is **essential** only if a plant cannot complete its life cycle without it, the deficiency is specifically correctable by supplying that element and no other, and the element is directly involved in the plant's metabolism (not merely beneficial indirectly). Essential elements are grouped by the quantity required:

- **Macronutrients** (needed in large quantity) — carbon, hydrogen, oxygen (from air and water, not soil-derived and rarely limiting), then the soil-derived macronutrients nitrogen (amino acids, nucleic acids, chlorophyll), potassium (osmotic/turgor regulation, enzyme activation, the guard cell ion covered on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)), calcium (cell wall middle lamella, signaling), magnesium (chlorophyll's central atom), phosphorus (ATP, nucleic acids, phospholipids), and sulfur (some amino acids, coenzymes).
- **Micronutrients** (needed in trace quantity, but still strictly essential) — iron (chlorophyll synthesis, electron transport chain components, see [Light Reactions & Photophosphorylation](../light-reactions-photophosphorylation/)), manganese, zinc, copper, boron, molybdenum (a cofactor of nitrogenase, see below), chlorine, and nickel.

Deficiency symptoms are diagnostic and depend heavily on whether the element is **phloem-mobile** — mobile elements (N, P, K, Mg) can be resorbed from older leaves and relocated to actively growing tissue when supply is short, so their deficiency symptoms (commonly chlorosis, yellowing from lost chlorophyll) appear first in **older leaves**; immobile elements (Ca, B, Fe in most species) cannot be relocated once incorporated, so their deficiency symptoms appear first in **younger, actively growing tissue** instead — a single mobility fact that converts "which leaves show symptoms first" into a diagnostic clue for which nutrient is deficient.

### Root Uptake Mechanisms

Soil mineral ions are typically far more dilute than the concentration a root cell needs internally, so uptake is predominantly **active transport** rather than passive diffusion:

- **Active transport via membrane proteins** — H⁺-ATPases pump protons out of root epidermal/cortical cells, generating both a membrane potential and a pH gradient (a **proton motive force**) that is then used to drive selective ion uptake through specific channels and **secondary active transporters** (symporters and antiporters that move a mineral ion against its gradient by coupling it to H⁺ moving down its gradient) — mechanistically the same proton-gradient-coupled strategy phloem loading uses (see [Phloem Transport & Translocation](../phloem-transport-translocation/)), applied here to mineral uptake instead of sucrose.
- **Root hairs** (see [Root Anatomy](../../6-plant-anatomy/root-anatomy/)) dramatically increase the absorptive surface area available for this uptake machinery per unit root length, without requiring the root system itself to grow proportionally larger.
- Once inside the epidermis/cortex, ions can travel toward the stele apoplastically or symplastically exactly as water does (see [Water Transport & Transpiration](../water-transport-transpiration/)), and are likewise forced from the apoplast into the symplast at the endodermal Casparian strip — giving the plant the same single regulatory checkpoint over mineral entry into the vascular cylinder that it has over water entry.

### Nitrogen Fixation and the *Rhizobium* Symbiosis

Atmospheric N₂ is abundant but chemically inert (a strong triple bond) and unusable by plants directly; **nitrogen fixation** — reducing N₂ to biologically usable NH₃/NH₄⁺ — is performed only by certain prokaryotes, using the enzyme **nitrogenase** (with a molybdenum-iron cofactor, the reason molybdenum is an essential plant micronutrient despite the plant not fixing nitrogen itself). Legumes form a specific symbiosis with **Rhizobium** bacteria: the bacteria infect root hairs and induce the plant to form specialized **root nodules**, inside which Rhizobium differentiate into nitrogen-fixing **bacteroids**. The relationship is mutualistic and tightly regulated on both sides — the plant supplies the bacteroids with carbohydrate (photosynthate delivered via phloem) and synthesizes **leghemoglobin** inside the nodule specifically to bind free O₂ and keep the nodule's internal oxygen concentration low (nitrogenase is irreversibly inactivated by O₂), while the bacteroids supply the plant with fixed nitrogen it could not otherwise access from most soils at a comparable energetic cost. This is the physiological mechanism underlying the "nitrogen fixation" entry in the ecosystem-level nitrogen cycle covered in [Ecology](../../8-ecology/) — that page treats nitrogen fixation as one flux among many in a whole-ecosystem nutrient budget, while this page covers the specific plant-microbe mechanism producing that flux.

### Mycorrhizal Symbiosis

Independent of nitrogen fixation, most land plant species (a large majority, across nearly every major lineage) form **mycorrhizae** — symbioses with soil fungi that extend nutrient absorption well beyond the physical reach and surface area of the root system itself:

- **Arbuscular mycorrhizae** — fungal hyphae penetrate root cortical cell walls (but not the plasma membrane) and form highly branched **arbuscules** within the cell, a large-surface-area interface for nutrient exchange; the dominant mycorrhizal type across most plant lineages, especially effective at improving phosphorus uptake (an ion that diffuses very slowly through soil and is easily depleted in the immediate vicinity of a root).
- **Ectomycorrhizae** — fungal hyphae form a dense sheath around the root surface and penetrate between (not into) cortical cells, forming a **Hartig net**; characteristic of many temperate forest trees (pines, oaks, beeches).

In both types the fungus receives photosynthate from the plant in exchange for extending the effective absorptive surface area for water and, especially, poorly mobile mineral ions like phosphorus — a division of labor directly analogous to the Rhizobium symbiosis above, but for general mineral/water uptake rather than nitrogen specifically, and via a fungal rather than bacterial partner.

## Comparative Structures

| Feature | *Rhizobium* symbiosis | Mycorrhizal symbiosis |
|---|---|---|
| Partner organism | Nitrogen-fixing bacteria | Soil fungi |
| Host range | Mostly legumes | Most land plant lineages |
| Structure formed | Root nodule (bacteroids inside) | Arbuscules (within cells) or Hartig net (around/between cells) |
| Nutrient supplied to plant | Fixed nitrogen (NH3/NH4+) | Primarily phosphorus and water; some nitrogen |
| Plant cost | Photosynthate + leghemoglobin synthesis (O2 exclusion) | Photosynthate |
| Key limiting factor addressed | Inert atmospheric N2 unusable directly | Slow ion diffusion / limited root surface area/reach |

## Common Exam Questions

- "Define the criteria for an element to be classified as essential, and distinguish macronutrients from micronutrients by the underlying reason for the classification (quantity needed, not degree of essentiality)."
- "Explain why a nitrogen deficiency produces chlorosis first in older leaves, while a calcium deficiency affects new growth first, referencing nutrient mobility."
- "Explain why root mineral uptake is predominantly active rather than passive, and describe the proton motive force mechanism driving it."
- "Explain why the Rhizobium-legume symbiosis requires the plant to synthesize leghemoglobin, referencing nitrogenase's specific vulnerability."
- "Distinguish arbuscular mycorrhizae from ectomycorrhizae by their structural interface with the root, and identify which is more effective at improving phosphorus uptake specifically."

## Visual Reference

**Interactive**

- **Nutrient deficiency diagnostic tool (click-through)** — a diagram of a plant showing older and younger leaves separately; clicking a nutrient (N, Ca, Fe, etc.) highlights which leaves show the deficiency symptom first, reinforcing the mobile/immobile distinction as a diagnostic rule rather than a memorized list.
- **Proton motive force ion uptake animator (SVG/JS)** — a root epidermal cell membrane with an H+-ATPase; activating it shows the resulting pH/voltage gradient, then a coupled secondary transporter using that gradient to pull a mineral ion in against its own concentration gradient.

**Static**

- Essential element table diagram grouped by macro/micronutrient, each with its primary metabolic role
- Root nodule cross-section showing bacteroids, leghemoglobin distribution, and the vascular connection supplying photosynthate
- Arbuscular mycorrhiza cross-section: hyphae penetrating a cortical cell wall, arbuscule branching structure within the cell
- Ectomycorrhiza cross-section: fungal sheath around the root, Hartig net between cortical cells
- Proton motive force diagram: H+-ATPase, resulting pH/voltage gradient, coupled ion transporter

## Practice Problems

1. A crop shows yellowing (chlorosis) beginning in its oldest leaves. Identify whether the deficient nutrient is more likely to be nitrogen or calcium, and explain your reasoning using nutrient mobility.
2. Explain why a mutation that inactivates a root cell's H+-ATPase would impair mineral ion uptake generally, not just uptake of one specific ion.
3. A legume grown in nitrogen-poor, sterile (microbe-free) soil grows poorly compared to the same species grown in soil containing Rhizobium. Explain the mechanism responsible for the difference.
4. Explain why molybdenum is an essential micronutrient for a plant that does not itself perform nitrogen fixation.
5. A plant grown with intact mycorrhizal associations shows better growth in phosphorus-poor soil than a mycorrhiza-free control of the same species. Explain the mechanism responsible.
