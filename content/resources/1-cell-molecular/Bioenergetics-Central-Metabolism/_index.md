---
title: "Bioenergetics & Central Metabolism Overview"
weight: 22
description: "Free energy and the logic of coupled reactions, ATP as the cell's energy currency, and the three-stage overview of glycolysis, the TCA cycle, and oxidative phosphorylation at the depth actually tested by IBO/USABO."
difficulty: "advanced"
prerequisites: ["Mitochondria-Chloroplasts-Structure-Origin", "Enzyme-Kinetics-Regulation"]
syllabus_tags: ["IBO", "USABO", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

**Scope note**: this page deliberately does *not* attempt full Lehninger-depth metabolism (a complete enzyme-by-enzyme, intermediate-by-intermediate treatment of every pathway easily runs past 200 textbook pages). It covers glycolysis, the TCA cycle, and oxidative phosphorylation at the depth actually tested on IBO/USABO papers: net inputs/outputs of each stage, the regulatory logic, and the handful of mechanistic details (substrate-level vs. oxidative phosphorylation, the chemiosmotic mechanism, the proton-motive force) that questions actually probe, rather than requiring memorisation of every intermediate's structure. Photosynthetic carbon fixation (Calvin cycle, C4/CAM) is covered separately and in full in Plant Physiology's [Calvin Cycle, Photorespiration & C4/CAM Biochemistry](/resources/5-plant-physiology/calvin-cycle-photorespiration-c4-cam/) page; this page does not duplicate it.

## Key Concepts

### Free energy and coupled reactions

Cellular reactions proceed only if net **ΔG < 0** (exergonic). Many biosynthetic reactions the cell needs are individually endergonic (ΔG > 0); the cell drives them forward by **coupling** them to a strongly exergonic reaction, almost always **ATP hydrolysis** (ΔG°′ ≈ −30.5 kJ/mol), so the *combined* reaction is exergonic overall. ATP is therefore best understood not as "energy" itself but as a **shared intermediate** that couples energy-releasing catabolic reactions to energy-requiring anabolic ones.

### Stage 1 — Glycolysis (cytoplasm, universal to nearly all life)

Net reaction: one glucose (6C) is split and oxidised to **two pyruvate** (3C each), with net production of **2 ATP** (substrate-level phosphorylation: direct enzymatic phosphate transfer to ADP, no membrane or electron transport chain involved) and **2 NADH** per glucose. Glycolysis has an energy-investment phase (2 ATP consumed, phosphorylating the sugar to trap it in the cell and destabilise it for cleavage) followed by an energy-payoff phase (4 ATP produced, net +2). It requires no oxygen and no mitochondria, which is why it is universal across nearly all known life, including strict anaerobes.

![Glycolysis pathway, all ten steps and enzymes numbered from glucose to 2 pyruvate, with the net-output boxes (2 ATP, 2 pyruvate, 2 NADH) shown at the two ATP-generating steps](/MCBBPICS/glycolysis-net-summary.jpg)
*Source: user-sourced via Instagram (biology.ocean)*

**Regulation**: the rate-limiting, committed step is catalysed by **phosphofructokinase-1 (PFK-1)**, allosterically inhibited by high ATP/citrate (signalling ample energy already available) and activated by AMP/ADP (signalling energy demand), a classic feedback-regulation point worth knowing by name even without the full kinetic mechanism.

### Fermentation: what happens without oxygen

Glycolysis alone would rapidly stall once the cell's finite NAD⁺ pool is fully reduced to NADH, since glycolysis requires NAD⁺ as an input. **Fermentation** exists purely to regenerate NAD⁺, not to extract further useful energy: yeast/plant **alcoholic fermentation** reduces pyruvate to ethanol + CO₂; animal (and some bacterial) **lactic acid fermentation** reduces pyruvate directly to lactate. Neither pathway produces additional ATP beyond glycolysis's own 2 ATP: their entire function is regenerating the NAD⁺ that lets glycolysis keep running.

### Stage 2 — Pyruvate oxidation and the TCA (citric acid/Krebs) cycle (mitochondrial matrix)

Pyruvate is first oxidatively decarboxylated to **acetyl-CoA** (releasing 1 CO₂, generating 1 NADH per pyruvate, so 2 of each per original glucose), by the multi-enzyme **pyruvate dehydrogenase complex**. Acetyl-CoA then enters the **TCA cycle**, condensing with oxaloacetate to form citrate; each full turn releases 2 CO₂, and generates (per acetyl-CoA, so ×2 per glucose) **3 NADH, 1 FADH₂, and 1 GTP/ATP** (the cycle's one substrate-level phosphorylation step), while regenerating oxaloacetate to accept the next acetyl-CoA. The TCA cycle is the convergence point for carbohydrate, fat, and (via the deamination products described in [Amino Acids & Protein Chemistry Fundamentals](../amino-acids-protein-chemistry/)) amino acid catabolism: all three fuel classes ultimately feed carbon into this one cyclic pathway.

![Full TCA (citric acid) cycle diagram: pyruvate entering via pyruvate dehydrogenase as acetyl-CoA, condensing with oxaloacetate to form citrate, then proceeding through aconitase, isocitrate dehydrogenase, α-ketoglutarate dehydrogenase, succinyl-CoA synthetase, succinate dehydrogenase, fumarase, and malate dehydrogenase back to oxaloacetate, with CO2, NADH, FADH2, and GTP outputs marked at each relevant step](/MCBBPICS/tca-cycle-diagram.svg)
*Source: Wikipedia*

**Regulation**: high NADH/ATP allosterically inhibits both pyruvate dehydrogenase and the TCA cycle's own rate-limiting enzyme (isocitrate dehydrogenase), the same "abundant energy signals slow further extraction" logic as PFK-1 regulation above.

### Stage 3 — Oxidative phosphorylation (inner mitochondrial membrane)

This is where the large majority of ATP is actually produced, via two coupled processes:

1. **Electron transport chain (ETC)**: NADH and FADH₂ donate electrons to a series of membrane protein complexes (Complexes I–IV), which pass electrons downhill in redox potential to the final acceptor, **O₂**, reducing it to H₂O. The energy released at each transfer step pumps H⁺ from the matrix into the intermembrane space, building an electrochemical gradient: the **proton-motive force**.
2. **Chemiosmosis**: protons flow back down this gradient through **ATP synthase**, a rotary molecular motor that couples proton flow to the mechanical synthesis of ATP from ADP + Pᵢ. This is **oxidative phosphorylation**, mechanistically distinct from the direct, enzyme-mediated substrate-level phosphorylation seen in glycolysis and the TCA cycle. ATP synthase makes ATP using a physical proton gradient, not a direct chemical group transfer.

![Electron transport chain and ATP synthase across the inner mitochondrial membrane: NADH and FADH2 donate electrons at Complexes I/II, electrons pass through the protein complex chain (Q, Complex III, cytochrome c, Complex IV) reducing O2 to H2O, protons are pumped into the intermembrane space at each step, and ATP synthase uses the resulting gradient to phosphorylate ADP](/MCBBPICS/etc-atp-synthase-chemiosmosis.jpg)
*Source: bio1151.nicerweb.com*

NADH and FADH₂ feed electrons in at different points of the chain (FADH₂ enters lower, at Complex II, bypassing Complex I), which is why NADH yields somewhat more ATP per molecule than FADH₂ under the chemiosmotic model: a frequent point of confusion, since older textbooks quote fixed "3 ATP per NADH, 2 ATP per FADH₂" ratios that are now understood to be approximate rather than fixed stoichiometric constants (the actual yield depends on the proton-motive force and which shuttle system moves cytoplasmic NADH equivalents into the mitochondrion). For exam purposes, know the qualitative point, NADH enters the chain earlier and yields more ATP than FADH₂, rather than memorising a single "true" numeric ratio.

**Regulation**: the entire chain is tightly coupled to ATP demand via **respiratory control**: if ADP is scarce (cell is energy-replete), the proton gradient builds up with nowhere to discharge, and electron transport itself slows, since pumping further protons against an already-steep gradient becomes thermodynamically unfavourable.

### Uncoupling: when the gradient doesn't make ATP

**Uncoupling proteins** (e.g. thermogenin/UCP1 in brown adipose tissue) provide an alternate path for protons to leak back across the inner membrane, bypassing ATP synthase entirely: the proton-motive force is dissipated as **heat** instead of ATP. This is the direct chemiosmotic mechanism behind non-shivering thermogenesis in hibernating and cold-adapted mammals, and a useful conceptual check that the proton gradient itself, not oxygen consumption per se, is the immediate energy intermediate driving ATP synthesis.

## Comparative Structures

| Stage | Location | O₂ required? | ATP mechanism | Net ATP (direct) | Net NADH/FADH₂ |
|---|---|---|---|---|---|
| Glycolysis | Cytoplasm | No | Substrate-level | 2 (net) | 2 NADH |
| Pyruvate oxidation | Mitochondrial matrix | Indirectly (feeds O₂-dependent stage) | — | 0 | 2 NADH (per glucose) |
| TCA cycle | Mitochondrial matrix | Indirectly | Substrate-level (1 step) | 2 GTP/ATP (per glucose) | 6 NADH + 2 FADH₂ (per glucose) |
| Oxidative phosphorylation | Inner mitochondrial membrane | Yes (terminal electron acceptor) | Chemiosmotic | Majority of total ATP yield | Consumes all NADH/FADH₂ produced above |

## Common Exam Questions

- "Why does fermentation not produce more ATP?": the correct framing is that fermentation's entire purpose is **NAD⁺ regeneration**, not additional energy extraction; the ATP yield stays at glycolysis's 2 ATP regardless.
- "Where does most of a cell's ATP actually come from?" — oxidative phosphorylation (chemiosmosis via ATP synthase), not glycolysis or the TCA cycle's direct substrate-level phosphorylation steps.
- Distinguishing **substrate-level phosphorylation** (direct enzymatic transfer, seen in glycolysis and one TCA step) from **oxidative phosphorylation** (indirect, via a proton gradient and ATP synthase) is one of the most frequently tested single distinctions in this entire topic.
- "What happens to ATP synthesis if a chemical uncouples the proton gradient from ATP synthase (e.g. 2,4-dinitrophenol)?": electron transport and O₂ consumption can continue or even accelerate, but ATP yield collapses because the gradient is dissipated as heat instead of driving ATP synthase, a classic mechanism-based pharmacology/toxicology question.

## Visual Reference

**Interactive**

- A three-stage metabolic flow diagram (glycolysis → pyruvate oxidation → TCA → ETC/chemiosmosis) with clickable stages that expand to show net ATP/NADH/FADH₂ tallies, designed to reinforce the "where does the ATP actually come from" question directly.

{{< iframe src="/metabolic-flow-diagram.html" title="Three-Stage Metabolic Flow Diagram" height="420px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1.** A cell is treated with a drug that completely blocks Complex IV of the electron transport chain (preventing O₂ reduction). Predict the immediate effect on (a) the proton-motive force, (b) ATP synthase activity, and (c) the TCA cycle, and explain the causal chain connecting them.

<details>
<summary>Show answer</summary>

(a) The proton-motive force initially persists briefly but cannot be replenished, since electron flow through the whole chain stalls once electrons have nowhere to go at Complex IV. It will decay as ATP synthase continues briefly discharging it. (b) ATP synthase activity falls as the gradient dissipates. (c) The TCA cycle stalls because NADH/FADH₂ can no longer be reoxidised by the now-blocked ETC, and NAD⁺/FAD availability (required as TCA cycle inputs) collapses: this is the mechanistic reason the TCA cycle, despite not using O₂ directly in any of its own steps, is still described as an "aerobic" pathway: it depends on a continuously operating, O₂-terminated electron transport chain to regenerate its oxidised cofactors.
</details>

**2.** Explain, mechanistically, why 2,4-dinitrophenol (a proton-gradient uncoupler) causes both increased O₂ consumption and dangerous body-temperature elevation, using the chemiosmotic model.

**3.** A patient's muscle biopsy shows normal glycolytic flux but severely reduced ATP yield per glucose molecule consumed, despite normal oxygen delivery. Propose which of the three metabolic stages is most likely defective, and explain what additional single measurement (NADH/FADH₂ accumulation vs. depletion) would help localise the defect further.
