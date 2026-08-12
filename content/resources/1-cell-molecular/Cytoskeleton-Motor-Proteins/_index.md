---
title: "Cytoskeleton & Motor Proteins"
weight: 5
description: "The three cytoskeletal filament systems — microfilaments, microtubules, and intermediate filaments — their structural and dynamic properties, and the three motor protein families that move cargo and cells along them."
difficulty: "intermediate"
prerequisites: ["Cell-Theory-Prokaryotes-Eukaryotes"]
syllabus_tags: ["IBO", "USABO", "cell-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

The cytoskeleton is not a static scaffold but a dynamic, constantly remodelling system of protein filaments providing mechanical support, intracellular transport tracks, and the machinery for cell shape change, motility, and division. Three distinct filament systems — differing in subunit protein, diameter, and mechanical properties — each specialise in a different structural role, and are read by three families of motor proteins that convert ATP hydrolysis into directed movement.

## Key Concepts

### Microfilaments (actin filaments)

The thinnest cytoskeletal filament (~7 nm diameter), built from polymerised globular **actin** subunits into a twisted double-helical filament. Actin filaments are **polar**: one end (the **barbed/plus end**) grows faster than the other (the **pointed/minus end**), and this polarity is functionally essential, both for directional motor movement (below) and for the treadmilling dynamics (net addition at the plus end, net loss at the minus end, giving apparent filament movement without net length change) that drive processes like the leading edge of a crawling cell. Microfilaments concentrate just under the plasma membrane (the cell cortex), providing mechanical support for cell shape, forming the core of microvilli, and, assembled with myosin, generating the contractile force of the cleavage furrow during cytokinesis and of muscle sarcomeres (see [Cell Cycle, Mitosis & Meiosis](../cell-cycle-mitosis-meiosis/) for cytokinesis).

![Microtubules (25 nm, columns of tubulin dimers), microfilaments (7 nm, twisted actin subunit chain), and intermediate filaments (8-12 nm, coiled fibrous keratin subunits) shown at consistent relative scale with matching fluorescence micrographs of each filament type in cultured cells](/MCBBPICS/three-filament-types-diameter-comparison.png)
*Source: pressbooks.lib.vt.edu*

### Microtubules

The thickest cytoskeletal filament (~25 nm diameter), built from **α/β-tubulin dimers** polymerising into a hollow tube of (typically) 13 protofilaments. Like actin, microtubules are polar (plus and minus ends), and undergo **dynamic instability** — individual microtubules stochastically switch between growth and rapid shrinkage phases, a property directly exploited during mitosis to search-and-capture chromosomes (see [Cell Cycle, Mitosis & Meiosis](../cell-cycle-mitosis-meiosis/)). Microtubules radiate from a **microtubule-organising centre (MTOC)** — the centrosome in most animal cells — with their minus ends typically anchored there and plus ends extending outward. Beyond mitotic spindle formation, microtubules form the structural core of **cilia and flagella** (the 9+2 axoneme arrangement) and serve as the principal long-distance intracellular transport highway.

![Microtubule dynamic instability cycle: a GTP-tubulin cap (red) at the plus end supports continued growth; loss of the cap triggers catastrophe and rapid shrinkage (GDP-tubulin peeling away, blue); a new GTP cap can form again, triggering rescue back into a growth phase](/MCBBPICS/microtubule-dynamic-instability.webp)
*Source: bio.libretexts.org*

### Intermediate filaments

A structurally and functionally distinct third category (diameter ~10 nm, intermediate between the other two, hence the name), built from a diverse, tissue-specific family of fibrous proteins (keratins in epithelial cells, vimentin in mesenchymal cells, neurofilaments in neurons, lamins forming the nuclear lamina). Unlike actin and microtubules, intermediate filaments are **non-polar** (both ends structurally equivalent), are not tracks for motor proteins, and are considerably more mechanically stable/less dynamic: their role is purely structural, providing tensile strength and resisting mechanical stress, rather than participating in active transport or rapid remodelling. **Lamins**, an intermediate filament type unique to the nuclear interior, form a meshwork underlying the inner nuclear membrane that structurally supports the nucleus and must be depolymerised for nuclear envelope breakdown during mitosis.

### Motor proteins: converting ATP hydrolysis into directed movement

Three motor protein families, each specific to one filament type and each moving unidirectionally along it:

- **Myosin** moves along actin filaments, generally toward the plus (barbed) end. Beyond its famous role in muscle contraction (myosin II thick filaments sliding past actin thin filaments: sarcomere shortening), myosin motors also transport vesicles and organelles along cortical actin.
- **Kinesin** moves along microtubules, generally toward the plus end (i.e., typically outward from the MTOC, toward the cell periphery): the principal motor for **anterograde** transport (e.g. moving vesicles/organelles from a neuron's cell body out along the axon).
- **Dynein** moves along microtubules toward the minus end — **retrograde** transport (back toward the cell body/MTOC), and also the motor responsible for the coordinated beating of cilia and flagella, sliding adjacent microtubule doublets in the axoneme past each other.

![Dynein and kinesin bound to the same microtubule, oriented toward opposite ends: dynein's head and tail domains face the minus end, kinesin's head and tail domains face the plus end](/MCBBPICS/kinesin-dynein-directionality.png)
*Source: user-sourced (unspecified)*

All three convert the chemical energy of ATP hydrolysis into a cycle of conformational changes (a "power stroke") that walks the motor along its filament track, and all three can carry cargo (vesicles, organelles, chromosomes via kinetochore-associated dynein) attached via adaptor proteins — the specific *direction* of net cargo movement in a cell is therefore determined by which motor is attached, not by the track alone.

## Comparative Structures

| Filament type | Subunit protein | Diameter | Polarity | Motor protein(s) | Primary role |
|---|---|---|---|---|---|
| Microfilament | Actin | ~7 nm | Polar | Myosin | Cell cortex, contraction, cytokinesis |
| Microtubule | α/β-tubulin | ~25 nm | Polar | Kinesin (plus-end), dynein (minus-end) | Spindle, cilia/flagella, long-range transport |
| Intermediate filament | Tissue-specific (keratin, vimentin, lamin, etc.) | ~10 nm | Non-polar | None | Mechanical/tensile strength, nuclear lamina |

## Common Exam Questions

- "Which cytoskeletal element is responsible for [structure/process]?" questions hinge on matching the *specific* filament to its role — cilia/flagella and the mitotic spindle are always microtubule-based; muscle contraction and the cell cortex are always actin-based; mechanical/tensile resistance and the nuclear lamina are always intermediate-filament-based.
- "A drug depolymerises microtubules — predict the effect on axonal transport and on mitosis" — tests whether you can trace a specific structural perturbation to *both* of a shared filament type's downstream functions.
- Distinguishing kinesin (generally anterograde/outward) from dynein (generally retrograde/inward) direction is a frequent discriminator; note this is a generalisation about typical transport roles, not an absolute rule for every kinesin/dynein family member.

## Visual Reference

**Interactive**

- A motor protein "walk" animator: select a motor (myosin/kinesin/dynein) and watch it step along its corresponding filament toward its characteristic end, carrying a cargo vesicle — makes the plus-end/minus-end direction rule visually concrete.

{{< iframe src="/motor-protein-walk-animator.html" title="Motor Protein Walk Animator" height="360px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A cell is treated with a drug that specifically stabilises microtubules, preventing the dynamic instability (growth/shrinkage cycling) they normally undergo, without depolymerising them. Predict the effect on mitotic spindle function, and explain the mechanism.

<details>
<summary>Show answer</summary>

Mitosis is disrupted, likely arresting the cell at the point of chromosome capture/alignment. The mitotic spindle relies on dynamic instability for microtubules to "search" the cytoplasm by repeated growth and catastrophe until a plus end happens to encounter and stably attach to a kinetochore; artificially stabilising microtubules (preventing the shrinkage phase) removes this search-and-capture mechanism, so chromosomes fail to be efficiently captured and properly aligned at the metaphase plate.
</details>

**2.** A neuron's axon shows normal outward (cell-body-to-synapse) vesicle transport but severely impaired return transport of used synaptic vesicle components back to the cell body. Which motor protein is most likely nonfunctional, and along which filament type does it operate?

**3.** Explain why intermediate filaments, despite providing critical mechanical support, are not used by the cell as tracks for directed cargo transport the way microtubules and microfilaments are — what structural property of intermediate filaments makes them unsuitable for this role?
