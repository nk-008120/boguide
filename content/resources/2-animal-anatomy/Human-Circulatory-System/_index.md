---
title: "Human Circulatory System"
weight: 7
description: "Heart wall histology, the cardiac conduction system and cardiac cycle, coronary circulation, blood composition and formed elements, vessel histology, and the lymphatic system's structural relationship to circulation — split from the combined Circulatory/Respiratory page for full IBO depth."
difficulty: "intermediate"
prerequisites: ["Body-Plans"]
syllabus_tags: ["IBO", "USABO", "human-anatomy"]
---
{{< topic-meta >}}

## Overview

This page covers the structural anatomy of the heart, blood vessels, blood itself, and the lymphatic system that structurally parallels and drains into it. Gas exchange at the lung is covered on the [Human Respiratory System](../human-respiratory-system/) page; here the focus is the pump, the plumbing, and what's being pumped.

## Key Concepts

### Heart Wall Structure

The heart wall has three layers, outer to inner: **epicardium** (the heart's own visceral serous membrane, continuous with the outer **parietal pericardium** that encloses the heart — the potential space between the two, the pericardial cavity, contains a thin film of serous fluid reducing friction as the heart beats), **myocardium** (cardiac muscle — see [Human Muscular System](../human-muscular-system/) for intercalated disc structure — by far the thickest layer, responsible for contractile force), and **endocardium** (a thin endothelial lining continuous with the endothelium of attached blood vessels, minimizing turbulence and clot formation over the chamber surfaces).

![Heart wall cross-section labeled with endocardium, myocardium, epicardium (visceral layer of serous pericardium), pericardial cavity, parietal layer of serous pericardium, and fibrous pericardium.](/ANATOMYPICS/heart-wall-layers-cross-section.jpg)
*Source: user-sourced (originally via microbenotes.com). Exact match, and exceeds spec by breaking the pericardium into its fibrous/parietal/visceral sublayers.*

### Chambers and Valves

Two thin-walled atria (receiving chambers) sit above two thick-walled ventricles (pumping chambers), separated left/right by the **interatrial** and **interventricular septa**, keeping oxygenated and deoxygenated blood from mixing in a healthy heart. Four one-way valves enforce unidirectional flow:

| Valve | Location | Between | Type |
|---|---|---|---|
| Tricuspid | Right side | Right atrium → right ventricle | Atrioventricular (AV) |
| Mitral (bicuspid) | Left side | Left atrium → left ventricle | Atrioventricular (AV) |
| Pulmonary | Right side | Right ventricle → pulmonary artery | Semilunar |
| Aortic | Left side | Left ventricle → aorta | Semilunar |

The AV valves are anchored by **chordae tendineae** (fibrous cords) to **papillary muscles** projecting from the ventricular wall — this structural anchoring prevents the AV valve cusps from inverting (prolapsing) back into the atrium under the high pressure generated during ventricular contraction, a direct structure-function point worth stating explicitly. The **left ventricle wall is markedly thicker than the right**: the right ventricle only pumps blood to the nearby lungs (pulmonary circuit, low pressure/resistance), while the left ventricle pumps blood through the entire systemic circuit (high pressure/resistance) — myocardial thickness scales directly with the pressure each chamber must generate.

![Four-chambered heart cross-section labeled with all four valves (tricuspid, mitral, and both semilunar valves), chordae tendineae, the septum, and the great vessels (aorta, pulmonary arteries/veins, venae cavae).](/ANATOMYPICS/four-chambered-heart-valves-labeled.webp)
*Source: user-sourced (originally via Wikipedia "Chordae tendineae"). Left/right ventricle wall-thickness contrast is visible at a glance via the septum; chordae tendineae are labeled but papillary muscles themselves are not separately called out in this particular figure.*

### Cardiac Conduction System

Cardiac muscle is **autorhythmic** — it generates its own rhythmic electrical signal without external nervous input (the autonomic nervous system, see the [Human Nervous System](../human-nervous-system/) page, modulates rate/force but does not initiate each beat) — via a specialized conduction pathway of modified cardiac muscle cells:

```mermaid
graph LR;
    SA["SA node<br/>(right atrium wall)<br/>the primary pacemaker"] --> ATRIA["Spreads across<br/>both atria"];
    ATRIA --> AV["AV node<br/>(atrioventricular septum)<br/>brief delay"];
    AV --> BUNDLE["Bundle of His<br/>(interventricular septum)"];
    BUNDLE --> PURKINJE["Purkinje fibers<br/>(ventricular walls, apex to base)"];
```

The **sinoatrial (SA) node** (right atrial wall, near the superior vena cava) depolarizes spontaneously at the fastest intrinsic rate of any cardiac tissue, making it the heart's primary pacemaker; the signal spreads cell-to-cell across both atria via gap junctions (intercalated discs, see [Human Muscular System](../human-muscular-system/)), reaching the **atrioventricular (AV) node** (in the atrioventricular septum), which conducts more slowly, introducing a brief delay that allows the atria to finish contracting and fully empty into the ventricles before ventricular contraction begins. The signal then passes rapidly down the **bundle of His** and its branches within the interventricular septum, into the **Purkinje fibers**, which distribute it through the ventricular walls from apex to base — this apex-to-base activation sequence is structurally why ventricular contraction pushes blood upward toward the outflow valves, rather than the ventricles simply squeezing in place.

### The Cardiac Cycle

One full heartbeat comprises **systole** (contraction) and **diastole** (relaxation) for both atria and ventricles, though "systole"/"diastole" used alone conventionally refer to the ventricles: **atrial systole** (atria contract, topping off ventricular filling) is immediately followed by **ventricular systole**, itself divided into an **isovolumetric contraction** phase (all four valves closed, ventricular pressure rising with no volume change, until it exceeds arterial pressure) and an **ejection** phase (semilunar valves open, blood ejected); **ventricular diastole** similarly begins with **isovolumetric relaxation** (all valves closed, pressure falling) before the AV valves open and passive/then atrial-systole-assisted filling occurs. The two audible **heart sounds** ("lub-dub") are generated by valve closure, not opening: **S1** ("lub") is AV valve closure at the start of ventricular systole; **S2** ("dub") is semilunar valve closure at the start of ventricular diastole — a direct structural/mechanical, not muscular, origin for both sounds.

### Coronary Circulation

The myocardium, despite being bathed in blood on its inner (endocardial) surface, is too thick to be nourished by diffusion from the chambers alone and has its own dedicated blood supply: the **left and right coronary arteries**, the first branches off the ascending aorta (arising just above the aortic semilunar valve), which is why coronary filling is greatest during diastole, when the aortic valve is closed and the coronary ostia are not being intermittently covered by open valve cusps. Venous drainage largely returns via the **coronary sinus** into the right atrium.

![Coronary circulation in anterior and posterior view: right and left coronary arteries branching from the aortic root, their circumflex/anterior and posterior interventricular branches, and the cardiac veins (great, middle, small, anterior) draining into the coronary sinus.](/ANATOMYPICS/coronary-artery-distribution.jpg)
*Source: user-sourced (originally via Wikipedia "Coronary circulation"). Exceeds spec — both anterior and posterior views, arteries and veins both fully labeled.*

### Blood Composition

Blood is connective tissue (see [Body Plans](../body-plans/)): cells suspended in a fluid extracellular matrix.

- **Plasma** (~55% of blood volume) — mostly water, plus plasma proteins (albumin, for oncotic pressure; globulins, including antibodies; fibrinogen, for clotting), electrolytes, nutrients, wastes, and hormones in transit.
- **Erythrocytes (red blood cells)** (~45% of blood volume, the **hematocrit**) — biconcave discs (a shape maximizing surface-area-to-volume ratio for gas diffusion, and allowing flexible deformation through narrow capillaries), lacking a nucleus and mitochondria in the mature circulating form (freeing internal volume for hemoglobin, and meaning erythrocytes cannot divide or perform aerobic respiration themselves), packed with **hemoglobin** for O₂/CO₂ transport.
- **Leukocytes (white blood cells)** (<1% of volume) — five types, structurally divided into granulocytes (visible cytoplasmic granules) and agranulocytes: **neutrophils** (granulocyte, most abundant, first responders, phagocytic), **eosinophils** (granulocyte, parasite defense, allergic response), **basophils** (granulocyte, least abundant, release histamine), **lymphocytes** (agranulocyte — B cells, T cells, the basis of adaptive immunity), **monocytes** (agranulocyte, largest, differentiate into macrophages in tissue).

![All five leukocyte types shown as real blood-smear micrographs (whole field, nucleus close-up, cytoplasm close-up, whole-cell close-up) for neutrophil, eosinophil, basophil, lymphocyte, and monocyte.](/ANATOMYPICS/blood-smear-erythrocytes-leukocytes.webp)
*Source: user-sourced (originally via a ResearchGate figure). Excellent match for the five leukocyte types and their distinguishing nuclear/cytoplasmic morphology; erythrocytes are visible in the background of each smear field but aren't separately labeled or the focus of the image.*

- **Platelets (thrombocytes)** — not whole cells but small membrane-bound fragments budded off large bone-marrow cells (megakaryocytes), functioning in clot formation.

### Blood Vessel Histology

Three vessel types, differentiated by the proportion of their wall dedicated to each of three structural layers (**tunica intima** — innermost, a single layer of endothelium plus a thin connective tissue layer; **tunica media** — smooth muscle and elastic fibers; **tunica externa (adventitia)** — outer connective tissue, anchoring the vessel to surrounding tissue):

- **Arteries** — thick tunica media (smooth muscle + elastic fibers), withstands high pulsatile pressure; the elastic recoil of large elastic arteries (e.g. the aorta) helps maintain pressure between heartbeats, smoothing pulsatile flow into a steadier downstream pressure. Smaller **arterioles** have proportionally more smooth muscle relative to lumen size, making them the primary site of resistance regulation (vasoconstriction/dilation) controlling blood flow distribution and, in aggregate, systemic blood pressure.
- **Veins** — thinner walls overall, larger lumen, lower pressure; limb veins contain internal one-way **valves** (endothelial folds) preventing backflow, since venous pressure alone is too low to overcome gravity — venous return relies partly on the **skeletal muscle pump** (contracting muscle compresses adjacent veins) and the pressure gradient created by breathing.
- **Capillaries** — wall is a single layer of simple squamous endothelium (see [Body Plans](../body-plans/)) and a basement membrane, nothing else — the only vessel type where diffusion exchange with surrounding tissue actually happens; three structural subtypes exist (continuous — tightest, most common; fenestrated — pores, found where filtration is high, e.g. the kidney glomerulus, see [Human Excretory System](../human-excretory-system/); sinusoidal — largest gaps, found in the liver/bone marrow, permitting exchange of cells and large proteins).

![Tunica intima/media/externa compared across a large vein, a medium-sized vein (with closed valves shown, plus a valve-open/closed longitudinal inset), and a venule.](/ANATOMYPICS/artery-vein-capillary-wall-comparison.jpg)
*Source: user-sourced (originally via Lumen Learning, SUNY A&P2). **Mismatch from spec**: this compares three calibers of vein (large vein / medium vein / venule), not the artery-vs-vein-vs-capillary comparison described in the text — still useful for showing the three tunic layers and venous valve structure, but doesn't show an artery or a capillary at all.*

### Lymphatic System

Structurally paired with the circulatory system: capillary filtration pushes slightly more fluid out of blood capillaries than is reabsorbed, and this excess interstitial fluid is collected by blind-ended **lymphatic capillaries** (even more permeable than blood capillaries, with overlapping endothelial flaps acting as one-way mini-valves), which converge into larger lymphatic vessels (also valved, like veins, and similarly reliant on skeletal muscle compression for flow, since lymph has no dedicated pump).

![A lymphatic capillary showing overlapping endothelial cells forming one-way mini-valves (open/closed), anchoring fibers, interstitial fluid entering, and the direction of lymph flow.](/ANATOMYPICS/lymphatic-capillary-lymph-node-structure1.jpg)
*Source: user-sourced (originally via basicmedicalkey.com). Exact match for the blind-ended, valved lymphatic capillary structure.*

Lymph passes through **lymph nodes** (encapsulated tissue packed with lymphocytes and macrophages, filtering the fluid and mounting immune responses against anything collected from the tissues) before the largest lymphatic vessels return the fluid to the venous circulation near the heart (via the thoracic duct into the left subclavian vein, for most of the body).

![Lymph node cross-section showing the capsule, trabeculae, cortical/medullary sinuses, afferent lymph vessels entering and an efferent lymph vessel leaving at the hilum (alongside the blood vessel), with a zoomed inset showing lymphocytes in the slow-flowing lymph among reticular fibers.](/ANATOMYPICS/lymphatic-capillary-lymph-node-structure2.png)
*Source: user-sourced (originally via Wikipedia "Lymph node"). Exact match for the filtering architecture described in the text.*

The **spleen** (filters blood directly, rather than lymph — removes aged erythrocytes, houses immune cells) is structurally part of this same lymphoid tissue system.

## Comparative Structures

The four-chambered heart with fully separated left/right circuits is a mammalian and avian feature; the [Fish & Amphibian](../fish-amphibian-anatomy/) and [Reptile & Bird](../reptile-bird-anatomy/) pages trace the two-chambered, three-chambered, and partially-divided intermediate heart structures, and the single vs. double circuit distinction, in detail.

## Common Exam Questions

- "Explain why coronary artery filling is greatest during diastole rather than systole."
- "Trace an electrical signal from the SA node to ventricular contraction, naming every structure it passes through and explaining the functional significance of the AV node delay."
- "Explain the structural origin of heart sounds S1 and S2, identifying what event causes each."
- "A blood sample shows biconcave, non-nucleated cells packed with hemoglobin. Identify the cell type and explain two structural features that suit it to its function."
- "Distinguish arteries, veins, and capillaries by the relative thickness of each tunic, and connect each structural difference to the vessel's specific function."
- "Explain, structurally, why lymphatic capillaries but not blood capillaries are described as blind-ended, and trace the path of collected interstitial fluid back to the venous circulation."

## Visual Reference

**Interactive**

- **Cardiac cycle explorer (Plotly)** — a synced multi-trace chart (a "Wiggers diagram": atrial pressure, ventricular pressure, aortic pressure, and ventricular volume across one full cardiac cycle) with a draggable time marker. Dragging it highlights which of the four valves are open/closed at that instant and flags the exact moment S1/S2 occur — turns "isovolumetric contraction/relaxation" from a memorized phrase into something a student scrubs through and sees.
- **Conduction pathway walkthrough (click-through SVG/JS, no new library)** — a heart diagram where clicking SA node → AV node → bundle of His → Purkinje fibers in sequence lights up each structure and displays its conduction delay/speed, visually demonstrating *why* the AV node delay exists (atria finish emptying before ventricular contraction begins) instead of just stating it.

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. Name the four heart valves, their locations, and their type (AV vs. semilunar).
2. Explain why the AV node conducts more slowly than surrounding cardiac tissue, and why this delay is functionally necessary.
3. A blood sample shows an elevated proportion of granulocytes with visible cytoplasmic granules and no nucleus lobation typical of neutrophils. Considering the five leukocyte types, what further structural feature would distinguish an eosinophil from a basophil under a microscope?
4. Explain why capillary walls are only one cell layer thick while arteries have a thick muscular layer, in terms of each vessel type's function.
5. Trace a molecule of excess interstitial fluid from a capillary bed back into the venous blood circulation, naming every lymphatic structure it passes through.
