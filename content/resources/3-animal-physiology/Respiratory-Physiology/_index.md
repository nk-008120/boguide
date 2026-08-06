---
title: "Respiratory Physiology"
weight: 6
description: "The oxygen-hemoglobin dissociation curve and cooperative binding, the Bohr and Haldane effects, CO2 transport mechanisms, central/peripheral chemoreceptor control of ventilation, and the bicarbonate buffer system's role in acid-base balance — the functional complement to the alveolar/airway structure on the Human Respiratory System page."
difficulty: "advanced"
prerequisites: ["Cardiovascular-Physiology"]
syllabus_tags: ["IBO", "USABO", "respiratory-physiology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

The [Human Respiratory System](../../2-animal-anatomy/human-respiratory-system/) anatomy page covers the bronchial tree and alveolar histology that make gas exchange structurally possible. This page covers what happens to the gases once exchanged: how hemoglobin binds and releases oxygen, how carbon dioxide is transported back to the lungs, how breathing rate itself is regulated, and how the respiratory system participates directly in blood pH control.

## Key Concepts

### The Oxygen-Hemoglobin Dissociation Curve

Hemoglobin's oxygen-binding curve (percent saturation vs. partial pressure of O₂, PO₂) is **sigmoidal**, not linear or hyperbolic, because hemoglobin's four subunits bind O₂ **cooperatively**: binding of the first O₂ molecule causes a conformational shift (T-state to R-state) that increases the remaining subunits' affinity for O₂, so each successive binding event becomes progressively easier. This sigmoidal shape has a direct functional payoff: across the steep middle portion of the curve, a relatively small drop in PO₂ (as blood moves from the lung capillaries to metabolically active peripheral tissue) causes a large drop in hemoglobin saturation — i.e., a large amount of O₂ is unloaded precisely where it's needed, rather than hemoglobin releasing O₂ only gradually and non-specifically everywhere.

![Sigmoidal oxygen-hemoglobin dissociation curve (% saturation of hemoglobin vs. PO2), with the resting physiological range marked between tissues at rest (PO2 40 mmHg) and alveoli (PO2 100 mmHg), P50 = 28 mmHg labeled, and a separate near-flat trace showing the small O2 fraction dissolved directly in plasma](/ANIMALPHYSIOPICS/oxygen-hemoglobin-dissociation-curve.jpg)
*Source: © PhysiologyWeb (physiologyweb.com)*

### The Bohr Effect

The dissociation curve **shifts right** (hemoglobin's O₂ affinity decreases at any given PO₂) in the presence of increased CO₂, increased H⁺ (lower pH), or increased temperature — all conditions characteristic of actively metabolizing tissue. This is the **Bohr effect**, and it is directly adaptive: in metabolically active tissue (producing CO₂, lactate/H⁺, and heat), the rightward shift causes hemoglobin to release *more* O₂ than it would at the same PO₂ under resting conditions — the curve's position itself responds to local metabolic demand, on top of the PO₂ gradient alone. Mechanistically, H⁺ and CO₂ both bind hemoglobin at sites distinct from the O₂-binding heme groups, stabilizing the lower-affinity T-state conformation.

![Oxyhemoglobin dissociation curve shown at three positions: a left shift (decreased temperature, decreased 2,3-DPG, decreased H+, or CO exposure — increased affinity), the resting/normal curve, and a right shift (increased temperature, increased 2,3-DPG, increased H+ — the Bohr effect, reduced affinity)](/ANIMALPHYSIOPICS/bohr-effect-curve-shift.jpg)
*Source: HMP Global Learning Network (EMS World)*

```mermaid
graph LR;
    A["Active tissue: CO2 up, H+ up, temp up"] --> B["Curve shifts right (Bohr effect)"];
    B --> C["Hemoglobin O2 affinity decreases"];
    C --> D["More O2 unloaded to tissue at the same PO2"];
```

### CO₂ Transport and the Haldane Effect

CO₂ produced by peripheral tissue is carried back to the lungs in three forms: dissolved directly in plasma (~7%), bound to hemoglobin as **carbaminohemoglobin** (~23%, binding the globin protein directly, not the heme O₂-binding site, so this does not compete with O₂ binding), and — the dominant form (~70%) — converted to **bicarbonate (HCO₃⁻)** inside the red blood cell by **carbonic anhydrase** (CO₂ + H₂O → H₂CO₃ → H⁺ + HCO₃⁻), with the bicarbonate then transported out into the plasma in exchange for chloride (the **chloride shift**, maintaining electrical neutrality across the red blood cell membrane).

![Two-panel diagram of the bicarbonate/chloride-shift pathway at the systemic capillary (CO2 produced by tissue metabolism enters the red blood cell, is converted by carbonic anhydrase to H2CO3 then HCO3- + H+, HCO3- exits in exchange for Cl-) and its reverse at the pulmonary capillary (HCO3- re-enters exchanging for Cl-, recombines with H+, converted back to CO2 and H2O, CO2 diffuses into the alveolus)](/ANIMALPHYSIOPICS/co2-transport-pathways.png)
*Source: GeeksforGeeks*

The **Haldane effect** is the CO₂-transport mirror of the Bohr effect: **deoxygenated** hemoglobin has a *higher* affinity for CO₂ and H⁺ than oxygenated hemoglobin does. This means that at the tissue level, as hemoglobin releases O₂ (per the Bohr effect above), the same molecule simultaneously becomes better able to pick up the CO₂ and H⁺ being produced by that same metabolically active tissue — and at the lung, as hemoglobin binds fresh O₂, it correspondingly releases its bound CO₂/H⁺ more readily, promoting CO₂ diffusion out into the alveolus. The Bohr and Haldane effects are two faces of the same underlying allosteric property (O₂ and CO₂/H⁺ binding are mutually antagonistic on the hemoglobin molecule), each maximizing gas exchange in the direction relevant at that location — unloading O₂ and loading CO₂ in tissue, loading O₂ and unloading CO₂ in the lung.

### Control of Ventilation

Breathing rate and depth are set by rhythmic neurons in the medulla oblongata (the pre-Bötzinger complex) but continuously adjusted by chemoreceptor feedback from two distinct sites:

- **Central chemoreceptors** (in the medulla, bathed in cerebrospinal fluid) — do not directly sense blood CO₂, but respond to the **pH of the CSF**, which falls as blood CO₂ diffuses across the blood-brain barrier (CO₂ crosses far more readily than H⁺ itself) and is hydrated to carbonic acid/H⁺ by carbonic anhydrase locally. This makes central chemoreceptors, despite the common shorthand "CO₂ sensors," physiologically pH sensors responding to a CO₂-derived proton — they provide the dominant, moment-to-moment drive for ventilation under normal conditions.
- **Peripheral chemoreceptors** (carotid and aortic bodies) — respond directly to *significant* drops in arterial PO₂ (only becomes a major ventilatory drive at low O₂ levels, e.g. high altitude, since central chemoreceptors' CO₂/pH response dominates under normal conditions), as well as to arterial pH and CO₂ directly (faster-responding but a smaller overall contribution than the central chemoreceptors under normal resting conditions).

![Chemoreceptor control circuit: the carotid body (CB, peripheral, stimulated by hypoxia/hypercapnia/blood flow/temperature) and the retrotrapezoid nucleus (RTN, a central chemosensitive site, stimulated by hypercapnia) both project to a brainstem network (NTS, central pattern generator, RVLM) that drives cardiac and respiratory (lung) output, shown alongside pathological outputs (cardiac arrhythmias, periodic breathing) when this control is disrupted](/ANIMALPHYSIOPICS/central-peripheral-chemoreceptor-control.webp)
*Source: ResearchGate / The Journal of Physiology, fig. 2*

<span class="badge-custom">Exam tip</span> A classic exam trap: assuming blood O₂ level is the primary moment-to-moment drive of ventilation. Under normal physiological conditions it is CO₂ (via the central chemoreceptors' pH response) that dominates; peripheral O₂-sensing only becomes the dominant drive once arterial PO₂ falls substantially (e.g., at altitude or in chronic lung disease where CO₂ sensitivity is blunted).

### Acid-Base Balance

Blood pH is buffered primarily by the **bicarbonate buffer system** (CO₂ + H₂O ⇌ H₂CO₃ ⇌ H⁺ + HCO₃⁻), and the respiratory system directly controls one side of this equilibrium by adjusting how fast CO₂ is exhaled — a mechanism distinct from, and much faster than, renal bicarbonate regulation (see [Homeostasis & Osmoregulation](../homeostasis-osmoregulation/) for kidney function). Because ventilation rate directly sets blood CO₂, and CO₂ directly sets this equilibrium's position, hyperventilation (CO₂ washed out faster than produced) drives the equilibrium toward consuming H⁺, raising pH (**respiratory alkalosis**), while hypoventilation (CO₂ accumulates) drives the equilibrium toward producing more H⁺, lowering pH (**respiratory acidosis**) — a direct, testable link between a purely mechanical/behavioral variable (breathing rate) and blood chemistry.

![The Davenport diagram (plasma HCO3- vs. pH, at a given PaCO2 isopleth): uncompensated respiratory/metabolic acidosis and alkalosis plotted as displacement along or across the PaCO2=40mmHg isopleth from the normal point, with further panels showing partially compensated, perfectly compensated, and compound acid-base disturbances as compensatory movement toward or away from pH 7.4](/ANIMALPHYSIOPICS/bicarbonate-buffer-equilibrium.png)
*Source: ditki.com (Davenport diagram teaching module)*

## Comparative Structures

| Effect | Trigger | Result | Physiological benefit |
|---|---|---|---|
| Bohr effect | ↑ CO₂ / ↑ H⁺ / ↑ temperature in tissue | Hemoglobin O₂ affinity decreases | More O₂ unloaded where metabolically needed |
| Haldane effect | Hemoglobin deoxygenation in tissue | Hemoglobin CO₂/H⁺ affinity increases | More CO₂ picked up where it's being produced |

## Common Exam Questions

- "Explain why the oxygen-hemoglobin dissociation curve is sigmoidal rather than hyperbolic, referencing cooperative binding."
- "Explain the Bohr effect and why a rightward curve shift in metabolically active tissue is functionally adaptive."
- "Name the three forms of CO₂ transport in blood and state which is quantitatively dominant."
- "Explain the Haldane effect and how it complements the Bohr effect at both the tissue and lung level."
- "Explain why central chemoreceptors are described as pH sensors rather than direct CO₂ sensors, and trace the mechanism linking blood CO₂ to CSF pH."
- "A patient hyperventilates. Predict the effect on blood pH and explain the mechanism via the bicarbonate buffer equilibrium."

## Visual Reference

**Interactive**

- **O₂-hemoglobin dissociation curve explorer (Plotly)** — the sigmoidal curve plotted with adjustable CO₂/pH/temperature sliders that shift the curve left or right in real time (Bohr effect), plus a draggable PO₂ marker reading off percent saturation at lung vs. tissue PO₂ values — turns the Bohr effect from a stated rule into a directly manipulable relationship.

{{< iframe src="/o2-hemoglobin-dissociation-curve-explorer.html" title="O2-hemoglobin dissociation curve explorer" height="620px" >}}

- **Chemoreceptor control loop diagram (click-through, extends the Mermaid above)** — clicking "central" or "peripheral" highlights that chemoreceptor's location, its actual sensed variable, and its relative contribution to ventilatory drive under normal vs. low-O₂ conditions, directly correcting the common "chemoreceptors sense O₂" misconception.

{{< iframe src="/chemoreceptor-control-loop-diagram.html" title="Chemoreceptor control loop diagram" height="420px" >}}

**Static** *(placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here)*

## Practice Problems

1. Explain why hemoglobin's oxygen affinity increases progressively as each of its four subunits binds O₂.
2. A blood sample from actively exercising muscle shows lower hemoglobin O₂ saturation than a resting-tissue sample at the same PO₂. Explain this using the Bohr effect.
3. Name the three CO₂ transport mechanisms in blood, ranked by relative contribution, and explain the chloride shift's role in the dominant one.
4. Explain why an increase in blood CO₂, not a decrease in blood O₂, is normally the primary driver of increased ventilation.
5. A patient hyperventilates for several minutes. Using the bicarbonate buffer equilibrium, predict whether their blood pH rises or falls, and explain the mechanism.
