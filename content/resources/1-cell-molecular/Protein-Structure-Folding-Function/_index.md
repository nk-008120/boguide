---
title: "Protein Structure, Folding & Function"
weight: 17
description: "The four levels of protein structure, secondary-structure propensities, hemoglobin cooperativity and allostery, chaperone-mediated folding, misfolding diseases, and the ubiquitin-proteasome system."
difficulty: "intermediate"
prerequisites: ["Amino-Acids-Protein-Chemistry"]
syllabus_tags: ["IBO", "USABO", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

A protein's function is inseparable from its shape, and its shape is built in four hierarchical levels: primary, secondary, tertiary, and quaternary structure, each stabilised by a different balance of covalent and non-covalent forces. This page covers that hierarchy, the model system for allosteric regulation (hemoglobin), how cells prevent and correct misfolding, and how they destroy proteins deliberately. Notably, protein *fold* is more evolutionarily conserved than amino acid *sequence*. Distantly related proteins with very different sequences often adopt near-identical folds, because the geometric and energetic constraints on a stable fold are stricter than the constraints on any single residue.

## Key Concepts

### The four levels of structure

**Primary structure** is simply the linear amino acid sequence, held together by peptide bonds (and, for cross-chain or cross-loop connections, disulfide bonds between cysteines).

**Secondary structure** is a local, repeating backbone conformation stabilised almost entirely by hydrogen bonds between the carbonyl oxygen and amide hydrogen of the polypeptide backbone, side chains are not directly involved. Two dominant motifs:

- **α-helix** (one turn = 3.6 residues). High-propensity residues: **Ala, Glu, Leu, Met, Lys** ("MALEK"), small enough to pack tightly, or able to form stabilising salt bridges (Glu, Lys), with no steric interference with the coil. **Helix breakers**: Proline (its side chain cyclises onto the backbone nitrogen, removing the amide hydrogen the helix needs and imposing a rigid kink) and Glycine (too flexible, entropically costly to lock into one rigid helical conformation).
- **β-sheet** (≈180° turn per 4 residues). High-propensity residues: bulky aromatics (Trp, Tyr, Phe) and β-branched residues (Val, Ile, Thr). Their bulk disfavours the tight coiling of a helix and favours the more open, extended sheet geometry. **Sheet breakers**: Proline (same rigidity argument) and bulky charged residues (Glu, Lys) that clash sterically/electrostatically in the tightly packed strand.
- **β-turn**: a third, shorter motif connecting two antiparallel β-strands.

![α-helix (coiled ribbon) and pleated β-sheet secondary structures, with the four non-covalent/covalent interaction types that stabilise folded protein structure labelled: ionic bonds, hydrogen bonds, hydrophobic interactions, and van der Waals forces](/MCBBPICS/secondary.png)
*Source: unattributed pre-existing site asset*

![Amino acid propensities for secondary structure: residues branched at Cβ (Val, Ile) destabilise the α-helix but suit β-sheet; residues whose R group can hydrogen-bond (Ser, Asp, Asn) also destabilise the α-helix by competing with backbone H-bonds; Gly (too flexible) and Pro (too rigid, no amide H) are exceptions unsuited to either](/MCBBPICS/structuralaas.png)
*Source: unattributed pre-existing site asset*

A useful rule of thumb: secondary-structure hydrogen bonding is local, roughly *n* to *n*+3/*n*+4 — only nearby residues interact directly.

**Supersecondary structure** (motifs) combine a small number of secondary elements in a recognisable pattern — α-α-α, α-β-α, β-β-β — without yet forming a full folded domain.

![Eight example supersecondary motifs from solved PDB structures, combining helices (H) and extended strands (E) in patterns such as helix-loop-helix and sheet-loop-sheet, each labelled with its PDB source code](/MCBBPICS/sss.png)
*Source: unattributed pre-existing site asset*

**Tertiary structure** is the overall 3D fold of a single polypeptide, formed by packing secondary elements into compact domains. It is stabilised by, in rough order of contribution:

1. **Hydrophobic interactions**: the dominant driving force; nonpolar side chains bury in the interior to avoid water, polar side chains stay solvent-exposed.
2. **Hydrogen bonds** between polar side chains, or side chain–backbone, individually weak but numerous and directional.
3. **Ionic bonds (salt bridges)** between oppositely charged side chains (e.g. Lys⁺···Asp⁻).
4. **Disulfide bonds** — the only *covalent* tertiary-level bond, cross-linking two cysteine sulfurs.
5. **Van der Waals forces**: weak, short-range, but numerous in a densely packed hydrophobic core.

![A folded polypeptide backbone with the tertiary stabilising interactions labelled at their respective sites: an ionic bond between charged side chains, a hydrogen bond, hydrophobic interactions clustering nonpolar side chains together, and a covalent disulfide linkage between two cysteines](/MCBBPICS/tss.png)
*Source: unattributed pre-existing site asset*

Because most of these forces are non-covalent, tertiary structure is fragile: heat, extreme pH, or heavy metals disrupt them, causing **denaturation** — loss of function without necessarily breaking the primary sequence.

**Quaternary structure** arises when multiple independently folded (tertiary) subunits associate, often via the same non-covalent forces listed above, into one functional multimeric complex.

![Quaternary protein structure examples: dimers (homodimer vs. heterodimer), a trimer (collagen's triple helix), and a tetramer (hemoglobin's α2β2 assembly)](/MCBBPICS/qss.png)
*Source: unattributed pre-existing site asset*

### Hemoglobin: the model system for allostery and cooperativity

**Allostery** is regulation of a protein's activity by a ligand binding somewhere *other* than the active/functional site, via an induced conformational change. Hemoglobin (Hb), a tetramer of two α- and two β-globin chains, is the canonical teaching example.

**T (tense) vs. R (relaxed) state**: deoxy-Hb sits in the T state, held by 8 inter-subunit salt bridges, with *low* O₂ affinity. When O₂ binds one heme iron, the iron (previously pulled slightly out of the porphyrin plane by the proximal histidine) moves into the plane, tugging the attached helix and breaking salt bridges — a conformational change that propagates cooperatively across all four subunits, flipping the whole tetramer to the R state with *high* O₂ affinity.

![O2 saturation (Y) vs. pO2 for basal Hb compared with locked T-state and locked R-state polymerised hemoglobin (fitted curves plus experimental data points): the T-state curve sits far right (low affinity), the R-state curve sits far left (high affinity), and basal Hb's sigmoidal curve falls between them](/MCBBPICS/tr.png)
*Source: unattributed pre-existing site asset*

**Cooperativity** means O₂ binding at one subunit raises affinity at the others, producing a **sigmoidal** binding curve (vs. the hyperbolic curve of monomeric myoglobin, which has no cooperativity):

{{< eqbox >}}
$$ \theta = \frac{[O_2]^{n_H}}{K_d^{n_H} + [O_2]^{n_H}} $$
{{< /eqbox >}}

For Hb, the Hill coefficient n_H ≈ 2.8 (out of a theoretical maximum of 4 for perfect cooperativity); for myoglobin, n_H = 1. You do not need to derive this equation for most olympiad purposes — understand what n_H *means* (degree of cooperativity) and its bounds.

![Generic fraction-bound vs. free-ligand-concentration curves for Hill coefficients of 4, 2, 1, 0.5, and 0.2: higher coefficients produce steeper, more sigmoidal curves (stronger positive cooperativity), a coefficient of 1 gives a hyperbolic curve (no cooperativity), and coefficients below 1 indicate negative cooperativity](/MCBBPICS/hillgraph.png)
*Source: unattributed pre-existing site asset*

**Heterotropic effectors**: ligands other than O₂ that shift Hb's affinity:

| Effector | Effect on O₂ affinity | Mechanism |
|---|---|---|
| 2,3-bisphosphoglycerate (2,3-BPG) | Decreases | Binds the central cavity of the T state, stabilising it |
| CO₂ | Decreases | Forms carbamino-Hb; also lowers pH |
| H⁺ (low pH, the **Bohr effect**) | Decreases | Protonates β-chain His HC3, stabilising T state |
| CO | Increases (pathologically) | Binds the same site as O₂ with >200× affinity; shifts remaining subunits toward R, reducing effective cooperativity and causing hypoxia despite normal Hb saturation |

At the pO₂ found in respiring tissue (~40 mmHg), myoglobin (with its hyperbolic, high-affinity curve) retains far more bound O₂ than hemoglobin, which is exactly the point of the two proteins having different curve shapes: Hb is built to *release* O₂ readily in tissue, Mb to *hold onto* it as an intracellular O₂ store.

![Oxygen saturation vs. pO2 for hemoglobin (blue, sigmoidal) and myoglobin (red, hyperbolic), with venous-tissue and lung pO2 ranges shaded and the ~40 mmHg tissue point marked: myoglobin sits at ~93% saturation there vs. hemoglobin's ~76%](/MCBBPICS/mbhbgraph.png)
*Source: unattributed pre-existing site asset*

### Chaperones and protein folding

**Anfinsen's dogma**: a protein's final fold is fully encoded in its primary sequence — chaperones do not dictate the fold. What they *do* is prevent **off-pathway aggregation**, by transiently shielding exposed hydrophobic patches during and after translation, before folding completes.

**GroEL/GroES (Hsp60 family)** cycle: (1) the unfolded protein enters the GroEL barrel, whose inner surface is initially hydrophobic; (2) ATP binding flips the inner surface hydrophilic, creating a protected folding chamber; (3) the GroES cap closes over the chamber; (4) ATP hydrolysis (~10 s later) releases the protein, correctly or incorrectly folded; (5) incorrectly folded protein re-enters the cycle.

**Hsp70 (DnaK in bacteria)** binds extended peptide co-translationally, assisted by co-chaperones DnaJ (Hsp40) and the nucleotide-exchange factor GrpE.

### Misfolding diseases

| Disease | Protein | Misfolding event |
|---|---|---|
| Sickle cell anaemia | β-globin (HbS, Glu6Val) | The substituted valine creates a hydrophobic surface patch; deoxy-HbS polymerises into rigid fibres |
| Cystic fibrosis | CFTR (most commonly ΔF508) | Misfolded CFTR is retained in the ER and degraded by ERAD before ever reaching the plasma membrane |
| Prion disease (CJD, scrapie) | PrP | Native α-helix-rich PrPᶜ converts to β-sheet-rich PrPˢᶜ; PrPˢᶜ *templates* the same conversion in native PrPᶜ molecules it contacts, a self-propagating misfold requiring no nucleic acid |
| Alzheimer's disease | Amyloid-β / Tau | Aβ aggregates into cross-β amyloid plaques; Tau forms intracellular neurofibrillary tangles |
| Parkinson's disease | α-synuclein | Aggregates into Lewy bodies |

Prion disease is a favourite exam topic precisely because it breaks the central dogma's usual information flow: heritable, infectious biological information is propagated by *protein conformation alone*, with no nucleic acid template. This is also why prions resist UV/nuclease treatment (which target nucleic acids) and require harsh treatment (autoclaving with NaOH) for inactivation.

### The ubiquitin-proteasome system

Beyond phosphorylation and glycosylation, the **ubiquitin-proteasome system (UPS)** is the cell's primary route for regulated, targeted protein destruction. **Ubiquitin (Ub)**, a 76-residue protein, is attached to a target lysine via an isopeptide bond in a three-enzyme cascade:

$$ \text{E1 (Ub-activating)} \rightarrow \text{E2 (Ub-conjugating)} \rightarrow \text{E3 (Ub-ligase — provides substrate specificity)} $$

The *linkage type* determines the outcome:

- **Lys48-linked polyubiquitination** → targets the protein for **proteasomal degradation**
- **Lys63-linked polyubiquitination** → non-degradative signal (DNA repair, endosomal sorting)
- **Monoubiquitination** → histone regulation, membrane protein trafficking

The **26S proteasome** is a 20S catalytic barrel (with chymotrypsin-like, trypsin-like, and caspase-like protease activities) capped by two ATP-dependent 19S regulatory particles, which recognise polyubiquitin chains, unfold the substrate, and thread it into the barrel. This system is the drug target of **bortezomib**, a proteasome inhibitor used in multiple myeloma.

### Fibrous vs. globular proteins

Structural role correlates strongly with secondary-structure composition: **α-keratin** is helix-rich with disulfide cross-links, giving toughness; **silk fibroin** is β-sheet-rich, giving flexibility over tensile toughness; **collagen** forms a unique triple helix (distinct from the α-helix), giving very high tensile strength. **Globular proteins** (e.g. hemoglobin) fold compactly with a hydrophobic core, favouring solubility and functional flexibility (conformational switching, as in the T↔R transition above) over mechanical strength.

## Comparative Structures

| Feature | α-Helix | β-Sheet |
|---|---|---|
| H-bond pattern | Intrachain, local (i to i+4) | Interchain or distant intrachain, extended |
| Residues per turn/repeat | 3.6 residues/turn | ~2 residues per repeat unit, sheet is a zig-zag |
| High-propensity residues | Ala, Glu, Leu, Met, Lys | Trp, Tyr, Phe, Val, Ile, Thr |
| Breakers | Pro, Gly | Pro, bulky charged residues (Glu, Lys) |
| Typical role | Membrane-spanning segments, structural coils (keratin) | Structural sheets (fibroin), extended binding surfaces |

## Common Exam Questions

- "Explain why proline and glycine disrupt α-helices": always give the *chemical* reason (cyclic side chain / no amide H for Pro; excess backbone flexibility for Gly), not just "they're different."
- "At tissue pO₂, which protein (hemoglobin or myoglobin) holds more oxygen, and why does this matter physiologically?" This tests whether you understand *why* the two curve shapes exist, not just that they differ.
- Distinguishing whether a stabilising interaction is covalent (disulfide bond only) vs. non-covalent (everything else in tertiary structure) is a common trap in "which bond breaks first on denaturation" questions.
- Prion disease questions often test the "no nucleic acid required" concept specifically — watch for answer choices that assume all heritable/infectious agents must involve DNA or RNA.

## Visual Reference

**Interactive**

- A clickable hemoglobin T-state/R-state toggle: view the tetramer, click to trigger the conformational shift, watch the salt bridges break and reform.

{{< iframe src="/hemoglobin-t-r-state-toggle.html" title="Hemoglobin T-State/R-State Toggle" height="400px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. One item (a primary-structure diagram showing a peptide bond chain with a disulfide cross-link) has no sourced image yet: the original candidate, `MCBBPICS/secondary.png`, turned out to depict secondary structure instead and was placed there. Still needs sourcing.)*

## Practice Problems

**1.** Plot (conceptually) the O₂-binding curves of hemoglobin and myoglobin on the same axes. At pO₂ = 40 mmHg (venous tissue), which protein retains more O₂, and why is this the physiologically correct behaviour for each protein's role?

<details>
<summary>Show answer</summary>

Myoglobin's hyperbolic curve sits to the left of (higher affinity than) hemoglobin's sigmoidal curve across the whole range, so at pO₂ = 40 mmHg myoglobin is still highly saturated while hemoglobin has released a substantial fraction of its bound O₂. This is functionally correct: myoglobin's job is to store O₂ inside muscle cells and only release it under extreme local hypoxia (heavy exertion); hemoglobin's job is to *transport* O₂ and unload a large, tunable fraction of it in respiring tissue: the sigmoidal curve, shifted further right by 2,3-BPG, CO₂, and low pH exactly where those signals of active metabolism are highest, makes this unloading responsive to local tissue demand.
</details>

**2.** A missense mutation converts a helix-interior alanine to proline in an otherwise stable α-helical domain. Predict the structural consequence, and explain the mechanism.

<details>
<summary>Show answer</summary>

Inserting proline mid-helix introduces a rigid kink and removes an amide hydrogen the helix's hydrogen-bonding pattern requires at that position, locally disrupting or terminating the helix. The mutation is likely destabilising unless the position happens to sit at a natural turn/kink already present in the native structure.
</details>

**3.** Two proteins have identical Lys48-linked polyubiquitin chains but different fates: one is degraded within minutes, the other persists for hours despite similar chain length. Propose two non-ubiquitin-related explanations.

**4.** Explain, in mechanistic terms, why CO poisoning causes tissue hypoxia even when overall Hb-bound oxygen content may not be far below normal.
