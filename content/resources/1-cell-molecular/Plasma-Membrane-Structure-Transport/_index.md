---
title: "Plasma Membrane Structure & Transport"
weight: 2
description: "The fluid mosaic model, membrane protein topology, and the four mechanisms cells use to move solutes across a membrane — simple diffusion, facilitated diffusion, primary and secondary active transport, and osmosis."
difficulty: "intermediate"
prerequisites: ["Cell-Theory-Prokaryotes-Eukaryotes"]
syllabus_tags: ["IBO", "USABO", "cell-biology"]
---

{{< topic-meta >}}

## Overview

The plasma membrane is a **selectively permeable** boundary — its job is not simply to enclose the cell but to control, in a highly specific and regulatable way, exactly what crosses it and in which direction. This page covers the structural model (fluid mosaic) underlying that selectivity, and the distinct physical/energetic logic behind each of the transport mechanisms cells use. The chemistry of the phospholipids and cholesterol described here is covered in full in [Lipids & Membrane Biochemistry](../lipids-membrane-biochemistry/); this page focuses on the resulting membrane's *functional* behaviour.

## Key Concepts

### The fluid mosaic model

The **fluid mosaic model** (Singer & Nicolson, 1972) describes the membrane as a two-dimensional fluid in which phospholipids and proteins diffuse laterally, rather than a static, rigid structure. "Fluid" refers to this lateral mobility (phospholipids and many proteins move within their own leaflet); "mosaic" refers to the patchwork arrangement of diverse protein types embedded at varying depths within the lipid bilayer. Fluidity is tuned by fatty acid saturation and cholesterol content (see [Lipids & Membrane Biochemistry](../lipids-membrane-biochemistry/)) and matters functionally: a membrane that is too rigid restricts protein conformational changes (many transport and signalling proteins require this) and vesicle fusion/budding; a membrane that is too fluid compromises barrier integrity.

![Detailed fluid mosaic model illustration of the plasma membrane: phospholipid bilayer with embedded integral membrane proteins at varying depths, surface-associated peripheral proteins, and cholesterol molecules intercalated among the phospholipid tails](/MCBBPICS/fluid-mosaic-model.svg)
*Source: en.wikipedia.org (Fluid mosaic model) — confirm licensing basis before public deployment. Note: this is a densely detailed vector illustration with no embedded text labels (verified structurally — 1501 paths, 164 circles, zero text nodes) and could not be fully visually rendered in this session due to a tooling limitation; the general content (bilayer, multiple protein types, cholesterol) matches the Wikipedia source page's subject, but individual components are not labelled in the image itself and were not directly eyeballed. Recommend a visual spot-check before public deployment.*

### Membrane protein topology

Membrane proteins are classified by how they associate with the bilayer:

- **Integral membrane proteins** span or embed within the hydrophobic core, typically via one or more α-helical transmembrane domains built from hydrophobic residues (matching the bilayer's hydrophobic interior — see the hydrophobic-effect logic in [Protein Structure, Folding & Function](../protein-structure-folding-function/)). Removing them requires disrupting the bilayer itself (e.g. with a detergent — see [Biomolecular Analytical Techniques](../biomolecular-analytical-techniques/)).
- **Peripheral membrane proteins** associate with the membrane surface via non-covalent interactions (ionic bonds, hydrogen bonds) with lipid head groups or integral proteins, and can be released by disrupting those interactions alone (e.g. high salt) without dissolving the bilayer.

This structural distinction directly explains the practical extraction-method question addressed in [Biomolecular Analytical Techniques](../biomolecular-analytical-techniques/): integral proteins require detergent, peripheral proteins can often be released with salt alone.

### Simple diffusion

Small, nonpolar, or very small polar molecules (O₂, CO₂, and to a limited extent water itself) can cross the lipid bilayer directly, moving **down their concentration gradient** with no protein assistance and no energy input — driven purely by random thermal motion and net movement toward equilibrium (entropy increase).

### Facilitated diffusion

Larger or charged/polar solutes (glucose, ions) cannot cross the hydrophobic bilayer core directly and require a membrane transport protein, but still move **down** their concentration gradient and require **no direct energy input** — the protein simply provides a lower-energy path across the membrane. Two structural strategies:

- **Channel proteins** form a continuous aqueous pore (e.g. ion channels, aquaporins for water) — generally faster than carriers, since no conformational cycling is required per molecule transported, but less able to couple transport to any other process.
- **Carrier proteins** bind the solute, undergo a conformational change, and release it on the other side — slower per molecule than a channel, but this binding step is exactly what allows carriers to be coupled to secondary active transport (below).

### Active transport: primary and secondary

Active transport moves solutes **against** their concentration gradient, which is thermodynamically unfavourable and therefore requires an energy input.

- **Primary active transport** couples transport directly to a chemical energy source, almost always ATP hydrolysis (e.g. the Na⁺/K⁺-ATPase, which pumps 3 Na⁺ out and 2 K⁺ in per ATP hydrolysed, maintaining the steep Na⁺/K⁺ gradients essential for nerve/muscle excitability and, indirectly, for secondary active transport below).
- **Secondary active transport (cotransport)** does not use ATP directly. Instead, it harnesses the electrochemical gradient of one solute (typically Na⁺, built up by a primary active transporter like the Na⁺/K⁺-ATPase) to drive a *second* solute against its own gradient, via a shared carrier protein. Two geometries: **symport** (both solutes move in the same direction, e.g. the intestinal Na⁺/glucose symporter, SGLT) and **antiport** (solutes move in opposite directions, e.g. the Na⁺/Ca²⁺ exchanger). The energetic logic: allowing Na⁺ to run back down its steep, ATP-built gradient releases enough free energy to pull the second solute uphill against its own gradient — the ATP cost was "spent" upstream, at the primary pump, not at the cotransporter itself.

![Active vs. passive transport side by side: primary active transport (ATPase uniport/cotransport, ATP hydrolysis driving low-to-high solute movement) and secondary active transport (antiport/symport, existing gradient driving one solute up against low-to-high movement) grouped under Active Transport; facilitated diffusion and simple diffusion (both high-to-low, no energy input) grouped under Passive Transport](/MCBBPICS/four-transport-mechanisms2.jpeg)
*Source: ScienceDirect ("passive transport" topic page) — confirm licensing basis before public deployment. ScienceDirect topic pages are not a confirmed-open source by default.*

![Membrane transport protein architectures: ATPase (Na+/K+ pump using ATP), cotransporter (Na+/glucose symport), counter-transporter (H+/Na+ antiport), and a channel (passive Na+ flow), plus coupled transporters and paracellular transport proteins between adjacent cells](/MCBBPICS/four-transport-mechanisms.jpg)
*Source: mysciencesquad.weebly.com — confirm licensing basis before public deployment. Note: a complementary diagram showing specific transporter protein types/geometries (uniport, symport, antiport, channel) rather than the four-mechanism (simple/facilitated diffusion, primary/secondary active) framing used in the text — the image above this one is the more direct match.*

### Osmosis: water's special case

**Osmosis** is the diffusion of water across a selectively permeable membrane, down *water's own* concentration gradient — which, practically, means water moves toward the side with **higher solute concentration** (lower water concentration). A cell in a **hypertonic** solution (higher external solute concentration) loses water and shrinks (crenation in animal cells, plasmolysis in plant cells); in a **hypotonic** solution, it gains water and swells (potentially lysing, in animal cells lacking a cell wall — plant cells instead build up **turgor pressure** against their cell wall, which is central to structural support in [Plant Anatomy](/resources/6-plant-anatomy/) and stomatal function in [Plant Physiology](/resources/5-plant-physiology/)). Aquaporins are channel proteins that greatly accelerate osmotic water flow without altering its thermodynamic direction.

![Animal cell (red blood cell) and plant cell responses to hypotonic, isotonic, and hypertonic solutions: animal cells shown lysed, normal, and shriveled respectively; plant cells shown turgid (normal), flaccid, and plasmolyzed respectively, with water movement arrows and plasma membrane/cell wall labelled](/MCBBPICS/tonicity-plant-vs-animal-cell.png)
*Source: iitianacademy.com — confirm licensing basis before public deployment*

## Comparative Structures

| Mechanism | Direction relative to gradient | Requires protein? | Requires direct energy input? | Example |
|---|---|---|---|---|
| Simple diffusion | Down | No | No | O₂, CO₂ crossing the bilayer |
| Facilitated diffusion (channel) | Down | Yes | No | Ion channels, aquaporins |
| Facilitated diffusion (carrier) | Down | Yes | No | GLUT glucose transporters |
| Primary active transport | Up (against) | Yes | Yes (direct, e.g. ATP) | Na⁺/K⁺-ATPase |
| Secondary active transport | Up (against, for the cotransported solute) | Yes | Indirect (uses a gradient built by primary transport) | Na⁺/glucose symporter |
| Osmosis | Down (water's own gradient) | Optional (aquaporins accelerate but aren't required) | No | Water movement toward hypertonic side |

## Common Exam Questions

- "Is this process active or passive?" — the single reliable test is whether the *net* movement is with or against the solute's own concentration gradient, not whether a protein is involved (facilitated diffusion uses a protein but is still passive).
- "Why is secondary active transport considered active if it doesn't use ATP directly?" — because the *transported solute itself* still moves against its own gradient; the energy source (an existing electrochemical gradient) was built by ATP-dependent primary transport upstream, but is still ultimately ATP-derived.
- Tonicity questions (hypertonic/hypotonic/isotonic) frequently combine with plant vs. animal cell context — know that plant cells resist lysis in hypotonic solutions via the cell wall (developing turgor pressure) where an equivalent animal cell would lyse.

## Visual Reference

**Interactive**

- A membrane transport simulator: a concentration-gradient slider across a schematic membrane, with a mode toggle between simple diffusion, facilitated diffusion, and active transport (ATP-cost indicator shown for active transport only), animating solute movement direction and rate under each mode.

{{< iframe src="/membrane-transport-simulator.html" title="Membrane Transport Mode Simulator" height="400px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. Note: the fluid mosaic model image could not be fully visually verified — see the inline note.)*

## Practice Problems

**1.** A cell's Na⁺/K⁺-ATPase is pharmacologically inhibited (e.g. by ouabain). Predict the immediate effect on glucose uptake via the Na⁺/glucose symporter, even though the symporter itself is not directly targeted by the drug, and explain the causal chain.

<details>
<summary>Show answer</summary>

Glucose uptake via the symporter falls. The Na⁺/glucose symporter is a secondary active transporter — its ability to pull glucose uphill depends entirely on the steep inward Na⁺ gradient maintained by the Na⁺/K⁺-ATPase. Inhibiting the pump allows the Na⁺ gradient to run down (as Na⁺ leaks back in via other paths without being pumped back out), progressively removing the driving force the symporter depends on, even though the symporter protein itself is structurally and catalytically unaffected by the drug.
</details>

**2.** A red blood cell (no cell wall) is placed in a hypotonic solution. Predict its fate, and contrast this with what would happen to a plant cell placed in the same solution.

**3.** Explain why a channel protein generally achieves a higher transport rate (molecules/second) than a carrier protein for the same solute concentration gradient, in terms of the mechanistic difference between the two protein types.
