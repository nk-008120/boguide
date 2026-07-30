---
title: "Calvin Cycle, Photorespiration & C4/CAM Biochemistry"
weight: 6
description: "The three-phase Calvin cycle fixing CO2 into sugar using the ATP/NADPH from the light reactions, Rubisco's oxygenase side-reaction and the photorespiration/glycolate pathway it triggers, and the C4 and CAM biochemical strategies that concentrate CO2 around Rubisco to suppress that side-reaction, paired with the Kranz and CAM anatomy already covered in Plant Anatomy."
difficulty: "advanced"
prerequisites: ["Light-Reactions-Photophosphorylation"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}

## Overview

The light reactions (see [Light Reactions & Photophosphorylation](../light-reactions-photophosphorylation/)) produce ATP and NADPH but no sugar; carbon fixation uses those carriers to actually build carbohydrate from atmospheric CO₂. This page covers the **Calvin cycle** itself, the costly side-reaction (**photorespiration**) that its central enzyme is prone to under hot, dry, high-light conditions, and the two independent biochemical fixes — **C4** and **CAM** metabolism — that most severely affected lineages evolved to suppress it. [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/) already covered the anatomical arrangement enabling each fix (Kranz anatomy's bundle sheath ring, CAM's succulent water-storing mesophyll); this page covers the biochemistry that arrangement exists to support.

## Key Concepts

### The Calvin Cycle

The Calvin cycle runs in the chloroplast stroma in three phases, using 3 CO₂ molecules (fixed one at a time) as a convenient unit to track the stoichiometry through a full turn:

1. **Carbon fixation** — **Rubisco** (ribulose-1,5-bisphosphate carboxylase/oxygenase, the most abundant enzyme on Earth by mass, a reflection of how slow and inefficient its carboxylase reaction is per active site) catalyzes the addition of CO₂ to the 5-carbon sugar **RuBP**, producing an unstable 6-carbon intermediate that immediately splits into two molecules of the 3-carbon compound **3-phosphoglycerate (3-PGA)**.
2. **Reduction** — each 3-PGA is phosphorylated by ATP and then reduced by NADPH (both supplied by the light reactions) to **glyceraldehyde-3-phosphate (G3P)**. This is the cycle's only redox step and the point where light-reaction energy is actually invested into a carbon skeleton. Of every 6 G3P produced per 3 CO₂ fixed, 1 exits the cycle as net carbohydrate output (used for sucrose or starch synthesis); the remaining 5 continue to phase 3.
3. **Regeneration** — the remaining 5 G3P (15 carbons total) are rearranged through a series of enzymatic steps back into 3 molecules of RuBP (15 carbons), consuming additional ATP, so the cycle can continue fixing new CO₂.

Net cost per 3 CO₂ fixed: 9 ATP and 6 NADPH consumed for 1 net G3P produced — a stoichiometry worth knowing because it is exactly what makes the ATP:NADPH ratio delivered by the light reactions matter, and exactly why cyclic electron flow (see [Light Reactions & Photophosphorylation](../light-reactions-photophosphorylation/)) exists to supplement ATP output when this ratio runs short.

### Photorespiration: Rubisco's Oxygenase Side-Reaction

Rubisco's active site cannot perfectly discriminate between CO₂ and O₂, and under conditions that lower the local CO₂:O₂ ratio at the active site — high temperature (which lowers CO₂ solubility relative to O₂ and increases Rubisco's relative affinity for O₂), and stomatal closure under water stress (which restricts fresh CO₂ entry while O₂ from ongoing photosynthesis accumulates, see [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)) — Rubisco increasingly catalyzes **oxygenation** of RuBP instead of carboxylation. This produces one molecule of 3-PGA (usable) and one of **2-phosphoglycolate**, a toxic 2-carbon compound that is not part of the Calvin cycle and must be salvaged through the **photorespiration (glycolate) pathway**, a costly process spanning three organelles (chloroplast, peroxisome, mitochondrion) that recovers only 3 of every 4 carbons entering it as usable product, consumes additional ATP, and releases the fourth carbon as CO₂ — a net loss of both fixed carbon and previously invested energy, and the direct biochemical reason C3 photosynthesis becomes inefficient under hot, dry, high-light conditions.

### C4 Biochemistry: Spatial CO2 Concentration

C4 plants suppress photorespiration by physically separating initial CO₂ capture from the Calvin cycle, using the **Kranz anatomy** already described structurally on [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/) (mesophyll cells surrounding an enlarged, chloroplast-rich bundle sheath):

1. In **mesophyll cells**, atmospheric CO₂ (as HCO₃⁻) is fixed by **PEP carboxylase** onto the 3-carbon compound **PEP (phosphoenolpyruvate)**, producing the 4-carbon compound **oxaloacetate** — the reaction giving C4 photosynthesis its name. Critically, PEP carboxylase has no oxygenase activity at all and a much higher affinity for its substrate than Rubisco, so this initial fixation step is essentially immune to the O₂ competition that plagues Rubisco directly.
2. Oxaloacetate is converted to **malate** (or in some species aspartate) and shuttled through plasmodesmata into the adjacent bundle sheath cell — the anatomical adjacency and abundant plasmodesmatal connections Kranz anatomy specifically provides.
3. Inside the bundle sheath, malate is decarboxylated, releasing CO₂ at a locally very high concentration directly around Rubisco, which now runs the ordinary Calvin cycle (identical biochemistry to C3, just physically relocated) under conditions where the oxygenase side-reaction is strongly suppressed by the elevated local CO₂:O₂ ratio.
4. The resulting 3-carbon compound (pyruvate) is shuttled back to the mesophyll cell and converted back to PEP (consuming additional ATP), regenerating the initial CO₂ acceptor for another cycle.

This spatial separation costs extra ATP per CO₂ fixed compared to C3 (for the PEP regeneration step), but that cost is repaid, under hot and high-light conditions specifically, by nearly eliminating the carbon and energy losses photorespiration would otherwise impose — which is why C4 is an advantage in exactly the environments where C3 struggles, not universally.

### CAM Biochemistry: Temporal CO2 Concentration

CAM plants achieve a related benefit through *time* rather than *space*, using the same cell for both steps rather than two anatomically distinct cell types (consistent with CAM leaf anatomy lacking Kranz anatomy, see [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/)):

- **At night**, stomata open (evaporative water loss is minimized in the cooler, more humid nighttime air, see [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)) and CO₂ is fixed by the same **PEP carboxylase** reaction C4 uses, producing oxaloacetate, then malate — but here malate is stored overnight as **malic acid** in the cell's large vacuole (the structural feature CAM leaf anatomy is specifically built around).
- **During the day**, stomata close (limiting water loss during the hottest, driest, highest-evaporative-demand period), and the stored malic acid is decarboxylated, releasing CO₂ internally at high concentration directly to Rubisco and the Calvin cycle, run using ATP/NADPH from the light reactions occurring in the same illuminated cell at the same time.

Because CO₂ uptake (night) and CO₂ fixation via the Calvin cycle (day) are separated in time rather than location, a single mesophyll cell type suffices, at the cost of requiring large-volume malic acid storage between the two phases — directly explaining the enlarged vacuoles CAM leaf anatomy shows structurally.

## Comparative Structures

| Feature | C3 | C4 | CAM |
|---|---|---|---|
| Initial CO2 fixation enzyme | Rubisco directly | PEP carboxylase (mesophyll) | PEP carboxylase (night) |
| Calvin cycle location/time | Mesophyll, continuous with fixation | Bundle sheath, separated spatially | Same cell, separated temporally (day) |
| Photorespiration | Significant under heat/drought | Strongly suppressed | Strongly suppressed |
| Extra ATP cost vs. C3 | None | Yes (PEP regeneration) | Yes (PEP regeneration) |
| Stomata open | Day | Day | Night |
| Anatomical basis (see Leaf Anatomy) | Ordinary mesophyll | Kranz anatomy | Large-vacuole succulent mesophyll |

## Common Exam Questions

- "Trace one carbon atom through a full turn of the Calvin cycle, from CO2 fixation through reduction to either net output or RuBP regeneration."
- "Explain why Rubisco's oxygenase reaction becomes more frequent under hot, dry conditions, and why this reaction represents a net loss of carbon and energy for the plant."
- "Explain how Kranz anatomy enables the spatial separation of initial CO2 fixation from the Calvin cycle in C4 plants, referencing the specific enzyme used at each location."
- "Explain why CAM plants store malic acid in a large vacuole overnight, and why this makes Kranz anatomy unnecessary for them."
- "Explain why C4 photosynthesis costs more ATP than C3 per CO2 fixed, and why this cost is nonetheless favorable under hot, high-light conditions."

## Visual Reference

**Interactive**

- **Calvin cycle carbon tracer (click-through SVG/JS, no new library)** — a schematic cycle where clicking "step" moves a highlighted carbon atom through fixation, reduction, and regeneration, with a running tally of ATP/NADPH consumed and net G3P produced after each full turn.
- **C3 vs. C4 vs. CAM CO2 pathway toggle** — a single diagram frame toggles between the three modes, visually showing where (C3: one cell; C4: two adjacent cell types) or when (CAM: night vs. day, same cell) each fixation step occurs, paired with the Kranz/CAM anatomy diagrams already specified on Leaf Anatomy.

**Static**

- Full Calvin cycle diagram: fixation, reduction, and regeneration phases labeled, with the 3 CO2 in / 1 net G3P out stoichiometry shown
- Rubisco carboxylase vs. oxygenase side-reaction diagram, showing 3-PGA (usable) vs. 2-phosphoglycolate (photorespiration substrate) as the two possible products
- Photorespiration (glycolate pathway) diagram spanning chloroplast, peroxisome, and mitochondrion, net carbon loss indicated
- C4 biochemical pathway diagram: PEP carboxylase in mesophyll, malate shuttle to bundle sheath, decarboxylation, Calvin cycle, pyruvate shuttle back
- CAM diurnal cycle diagram: nighttime CO2 fixation/malic acid storage vs. daytime decarboxylation/Calvin cycle, on a 24-hour axis

## Practice Problems

1. Starting from 3 CO2 molecules, trace the Calvin cycle's stoichiometry to confirm that exactly 1 net G3P is produced per turn, and state the total ATP and NADPH consumed.
2. A plant is moved from a cool, humid greenhouse to a hot, dry field. Predict the effect on its rate of photorespiration and explain the mechanism responsible.
3. Explain why a C4 plant's mesophyll cells lack functional Rubisco-driven Calvin cycle activity even though Rubisco is present in the leaf.
4. A succulent plant's stomata are found to be open at night and closed during the day. Identify its photosynthetic pathway and explain the biochemical reason for this stomatal timing.
5. Explain why both C4 and CAM plants pay an ATP cost that C3 plants do not, and identify the specific reaction responsible for that extra cost in both pathways.
