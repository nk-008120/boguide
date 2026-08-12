---
title: "Lipids & Membrane Biochemistry"
weight: 20
description: "Fatty acid structure and saturation, triglycerides vs. phospholipids, the chemistry behind the fluid mosaic model, cholesterol's role in membrane fluidity, and lipid-derived signalling molecules."
difficulty: "intermediate"
prerequisites: ["Carbohydrate-Chemistry-Biology"]
syllabus_tags: ["IBO", "USABO", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Lipids are defined by a shared physical property (poor water solubility) rather than a shared chemical scaffold the way amino acids or sugars are: which is why "lipid" covers everything from triglycerides to cholesterol to signalling eicosanoids. This page covers the chemistry that matters for membrane structure specifically: fatty acid saturation, the amphipathic phospholipid, and why cholesterol has the paradoxical dual effect of both stiffening and fluidising membranes depending on temperature. [Plasma Membrane Structure & Transport](../plasma-membrane-structure-transport/) covers the resulting bilayer's transport behaviour; this page covers the chemistry underneath it.

## Key Concepts

### Fatty acid structure and saturation

A fatty acid is a long hydrocarbon chain terminating in a carboxylic acid group. **Saturated** fatty acids have no carbon-carbon double bonds, allowing the chain to lie fully extended and pack tightly against neighbouring chains via van der Waals interactions: this tight packing is why saturated fats are typically solid at room temperature. **Unsaturated** fatty acids contain one (monounsaturated) or more (polyunsaturated) C=C double bonds, almost always in the **cis** configuration in natural lipids, which introduces a rigid ~30° kink in the chain. That kink prevents tight packing, lowering the melting point — unsaturated fats are typically liquid at room temperature.

![Saturated stearic acid shown as a fully extended straight chain; unsaturated cis-oleic acid shown with a sharp kink at its single C=C double bond; unsaturated trans-oleic acid shown as a nearly straight chain despite also having one C=C double bond, illustrating that it is specifically the cis configuration, not unsaturation alone, that causes the packing-disrupting kink](/MCBBPICS/saturated-vs-unsaturated-fatty-acid.png)
*Source: tutorchase.com*

### Triglycerides: pure energy storage

A **triglyceride** (triacylglycerol) is glycerol esterified to three fatty acids. Because the molecule is almost entirely hydrocarbon by mass and carries no polar head group, triglycerides pack into anhydrous, extremely energy-dense storage droplets: roughly twice the energy density per gram of glycogen, which by contrast must be stored hydrated (each gram of glycogen holds substantial associated water), making fat the far more mass-efficient long-term reserve, at the cost of slower mobilisation kinetics than glycogen.

### Phospholipids: the amphipathic membrane building block

A **phospholipid** replaces one fatty acid of a triglyceride-like backbone with a **phosphate-linked polar head group** (e.g. choline, serine, ethanolamine, inositol), producing a molecule with a hydrophilic head and two hydrophobic tails, **amphipathic**. In water, this amphipathicity drives spontaneous self-assembly into a **bilayer**: tails face inward, away from water; heads face outward, into the aqueous environment on both sides. This is not an energetically "designed" outcome so much as the thermodynamically favoured configuration: burying the hydrophobic tails minimises the disruption to water's hydrogen-bond network (the same hydrophobic-effect logic that drives protein tertiary-structure folding, see [Protein Structure, Folding & Function](../protein-structure-folding-function/)).

**Head group identity determines membrane leaflet asymmetry and signalling function**, not just electrostatics — e.g. phosphatidylserine is normally kept on the cytoplasmic leaflet by ATP-dependent flippases, and its appearance on the *outer* leaflet is a recognised "eat me" signal for phagocytes during apoptosis (see [Cell Junctions, Extracellular Matrix & Cell Death](../cell-junctions-ecm-cell-death/)).

![Phospholipid structure: a hydrophilic head made of a variable R group, phosphate, and glycerol backbone, connected to two hydrophobic fatty acid tails, one saturated (straight) and one unsaturated (kinked)](/MCBBPICS/phospholipid-structure-diagram.jpg)
*Source: bio.libretexts.org (Boundless Biology)*

### Cholesterol and membrane fluidity

Cholesterol is a rigid, planar four-ring sterol that intercalates between phospholipid tails, with its single polar hydroxyl oriented toward the bilayer surface. Its effect on fluidity is **temperature-dependent and bidirectional**:

- **Above the phase-transition temperature** (fluid, disordered membrane): cholesterol's rigid ring system restricts the motion of adjacent fatty acid tails, *decreasing* fluidity.
- **Below the phase-transition temperature** (membrane tending toward a rigid, ordered gel state): cholesterol prevents fatty acid tails from packing into a fully ordered crystalline array, *increasing* fluidity.

Net effect: cholesterol acts as a **fluidity buffer**, narrowing the range of temperatures over which the membrane's physical state changes sharply — a frequently mis-simplified concept ("cholesterol makes membranes more fluid") that is only half correct.

![Membrane fluidity vs. temperature for a membrane with and without cholesterol: without cholesterol (magenta), fluidity rises sharply through the phase-transition temperature Tm; with cholesterol (blue), the curve is flattened, less fluid than the cholesterol-free membrane above Tm, more fluid below Tm, illustrating cholesterol's bidirectional buffering effect](/MCBBPICS/cholesterol-membrane-fluidity.jpg)
*Source: Chegg homework-help question*

![Molecular-level membrane order at two temperature regimes relative to the phospholipid melting temperature: with cholesterol present (red), phospholipid tails are held in a more uniformly ordered state at both T > melting T and T >>> melting T, compared to the more variably ordered/disordered arrangement without cholesterol, shown alongside fluorescent membrane-order probes (Laurdan, Patman) in their membrane-embedded vs. water-exposed states](/MCBBPICS/cholesterol-membrane-fluidity2.jpg)
*Source: ScienceDirect (research article)*

### Lipids as signalling molecules

Not all lipid biology is structural. **Eicosanoids** (prostaglandins, thromboxanes, leukotrienes), derived from the membrane phospholipid-released fatty acid arachidonic acid via the cyclooxygenase (COX) and lipoxygenase pathways, act as short-range paracrine signals in inflammation, pain, and clotting: the pharmacological target of aspirin and other NSAIDs (irreversible/reversible COX inhibitors, respectively, see the irreversible-inhibition mechanism in [Enzyme Kinetics & Regulation](../enzyme-kinetics-regulation/)). **Steroid hormones** (derived from cholesterol) and **phosphoinositide second messengers** (e.g. IP₃/DAG, generated by PLC cleavage of PIP₂) extend lipid signalling into gene regulation and intracellular second-messenger cascades (see [Cell Signaling & Communication](../cell-signaling-communication/)).

## Comparative Structures

| Lipid class | Polar head group? | Primary role | Packing consequence |
|---|---|---|---|
| Saturated fatty acid / triglyceride | No | Energy storage | Tight packing, solid at room temp |
| Unsaturated fatty acid / triglyceride | No | Energy storage | Kinked chain, loose packing, liquid at room temp |
| Phospholipid | Yes | Membrane structure | Amphipathic, spontaneous bilayer self-assembly |
| Cholesterol | Minimal (single -OH) | Fluidity buffering | Intercalates between tails, bidirectional fluidity effect |
| Eicosanoids/steroid hormones | Varies | Signalling | Small, diffusible, receptor- or membrane-permeable |

## Common Exam Questions

- "Why are unsaturated fats liquid at room temperature?" — always cite the *cis double bond kink preventing tight packing*, not a vague "different structure" answer.
- "Does cholesterol increase or decrease membrane fluidity?" — the trick answer depends on temperature; a well-posed question will specify above or below the transition temperature, and a well-prepared answer should note the dependency even if not explicitly asked.
- Distinguishing why fat (not glycogen) is the long-term storage molecule of choice hinges on energy density *and* the anhydrous-vs-hydrated storage argument together, not either alone.

## Visual Reference

**Interactive**

- A phospholipid bilayer self-assembly simulator: scatter phospholipid icons in a 2D "water" field and animate their spontaneous reorganisation into a bilayer, illustrating the hydrophobic-effect argument without requiring a thermodynamics derivation.

{{< iframe src="/phospholipid-bilayer-self-assembly.html" title="Phospholipid Bilayer Self-Assembly" height="420px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A membrane sample is enriched in polyunsaturated phospholipids compared to a control sample of otherwise identical composition. Predict how its fluidity at a fixed temperature compares to the control, and explain the chemical basis.

<details>
<summary>Show answer</summary>

More fluid. Each additional cis double bond adds another kink to the fatty acid tail, further disrupting tight van der Waals packing between adjacent tails — more unsaturation lowers the effective "melting point" of the membrane, keeping it in a more fluid state at a given temperature than a more saturated membrane would be.
</details>

**2.** Explain why storing the same amount of chemical energy as fat rather than glycogen requires roughly half the mass, referencing both the chemistry of the molecules and how each is stored physically in the body.

**3.** Phosphatidylserine normally resides on the inner (cytoplasmic) leaflet of the plasma membrane. During apoptosis, it appears on the outer leaflet. What class of membrane protein is most directly implicated in maintaining the normal asymmetric distribution, and what does its loss of function during apoptosis signal to the surrounding tissue?
