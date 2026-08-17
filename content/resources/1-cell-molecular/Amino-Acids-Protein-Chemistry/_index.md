---
title: "Amino Acids & Protein Chemistry Fundamentals"
weight: 16
description: "The 20 standard amino acids, their side-chain chemistry and ionization behaviour, pI calculation and titration curves, essential/non-essential classification, transamination and deamination, and the Ramachandran plot, the chemical vocabulary the rest of Biochemistry builds on."
difficulty: "beginner"
prerequisites: ["Cell-Theory-Prokaryotes-Eukaryotes"]
syllabus_tags: ["IBO", "USABO", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

## Overview

Amino acids are the monomer units of proteins: a central (α) carbon bonded to an amino group, a carboxyl group, a hydrogen, and a variable **R group** (side chain) that gives each of the 20 standard amino acids its distinct chemical identity: polarity, charge, size, and reactivity. Nearly everything a protein can do, fold into a stable shape, bind a ligand, catalyse a reaction, insert into a membrane, traces back to the specific combination of R groups along its chain. This page covers the chemical vocabulary (classification, ionization, metabolism) that every later Biochemistry and Molecular Biology page assumes.

## Key Concepts

### Classification by side chain

The 20 R groups sort into four broad chemical classes:

![General structure of an amino acid: a central α-carbon bonded to an amino group, a carboxyl group, a hydrogen, and the variable R group that distinguishes each of the 20 standard amino acids](/MCBBPICS/Amino_Acid.png)
Source: Unknown

- **Nonpolar/aliphatic (9)**: Gly, Ala, Val, Leu, Ile, Pro, Phe, Trp, Met, hydrocarbon chains or aromatic rings that cluster away from water.
- **Polar neutral**: contain a hydroxyl (Ser, Thr, Tyr), sulfhydryl (Cys), or amide (Asn, Gln) group in the R group.
- **Polar acidic (2)**: Asp, Glu, carrying a second carboxylic acid/carboxylate group beyond the backbone one; negatively charged at physiological pH.
- **Polar basic (3)**: Lys, Arg, His, carry an additional amine group; positively charged (Lys, Arg fully; His only partially, pKₐ ≈ 6) at physiological pH.

![All 20 standard amino acids' chemical structures grouped by class (aliphatic, aromatic, acidic, basic, hydroxylic, sulfur-containing, amidic), each circle color-coded by class and marked solid/dashed for non-essential/essential](/MCBBPICS/Amino_Acid2.png)
Source: Unknown

Two exceptions to memorize: **tyrosine** has an aromatic ring *and* a polar –OH, and is conventionally grouped as polar neutral rather than nonpolar; **methionine** contains sulfur, but because sulfur and carbon have almost identical electronegativity, its thioether side chain behaves as nonpolar.

Aromaticity ranking (relevant for UV absorbance at 280 nm, used to quantify protein concentration): **Phe > Trp > Tyr > His**. Trp and Tyr dominate real A₂₈₀ readings because Phe absorbs weakly.

### Isoelectric point (pI) and titration behaviour

The **isoelectric point** is the pH at which an amino acid carries zero net charge (it exists as a **zwitterion**, simultaneously protonated at the amino group and deprotonated at the carboxyl group). For an amino acid with no ionizable side chain:

{{< eqbox >}}
$$ pI = \frac{pK_{a1} + pK_{a2}}{2} $$
{{< /eqbox >}}

For an amino acid with an ionizable side chain, average the **two pKₐ values that flank the neutral species**, not simply the first two. Lysine has pKₐ values 2.2 (α-COOH), 9.0 (α-NH₃⁺), and 10.5 (side-chain NH₃⁺); its zwitterion exists between pH 9.0 and 10.5, so pI = (9.0 + 10.5)/2 = 9.75, *not* the average of the first two.

**Reading a titration curve**: each inflection point marks a pKₐ; the flat **buffering plateaus** (±1 pH unit around each pKₐ) are where the amino acid best resists pH change, because protonated and deprotonated forms coexist near 1:1. A polyprotic amino acid like lysine shows three inflection points and three buffering plateaus.

![Titration curve of a Lys-Lys-Lys tripeptide (not free lysine): net charge steps from +4.0 down to −1.0 across four inflection points, α-COOH pKₐ ≈2.2, α-NH₃⁺ pKₐ ≈8.0, the three ε-NH₃⁺ side-chain groups clustering near pKₐ ≈10.5, with pI ≈10.8 marked where net charge crosses zero](/MCBBPICS/LYSINECURVE.png)
Source: Unknown

$$ \text{pH} = pK_a + \log\frac{[\text{A}^-]}{[\text{HA}]} \quad \text{(Henderson–Hasselbalch)} $$

- pH < pKₐ → protonated form dominates
- pH = pKₐ → half-equivalence point, equal concentrations of both forms
- pH > pKₐ → deprotonated form dominates

### Essential and conditionally essential amino acids

Nine amino acids cannot be synthesised by humans and must come from diet: **His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val** (mnemonic: *PVT TIM HaLL*). A further group is **conditionally essential**, required only under specific physiological load:

| Amino acid | Becomes essential when… |
|---|---|
| Arg | During growth (children); adult synthesis via the urea cycle is often insufficient |
| Cys | Met supply is inadequate (Cys is made from Met) |
| Tyr | Phe → Tyr conversion fails (e.g. phenylketonuria) |
| Gln, Pro, Gly | Severe illness or very low protein intake |

**Phenylketonuria (PKU)** is the classic exam context: loss-of-function of phenylalanine hydroxylase blocks Phe → Tyr conversion. Phe accumulates and is diverted to phenylpyruvate, causing neurological damage; Tyr becomes conditionally essential in affected individuals.

### Amino acid catabolism: transamination and deamination

Amino acids aren't stored. Excess is broken down via two linked reactions.

**Transamination** (PLP-dependent aminotransferases, e.g. AST, ALT; elevated serum AST/ALT is a clinical marker of hepatocyte damage) transfers the α-amino group onto α-ketoglutarate:

$$ \text{Amino acid} + \alpha\text{-ketoglutarate} \xrightarrow{\text{aminotransferase (PLP)}} \alpha\text{-keto acid} + \text{glutamate} $$

**Oxidative deamination** then strips the amino group from glutamate as toxic NH₄⁺, channelled into the urea cycle for excretion:

$$ \text{Glutamate} + \text{NAD}^+ + \text{H}_2\text{O} \xrightarrow{\text{glutamate dehydrogenase}} \alpha\text{-ketoglutarate} + \text{NH}_4^+ + \text{NADH} $$

The remaining carbon skeleton is **glucogenic** (feeds gluconeogenesis) or **ketogenic** (feeds ketone body synthesis):

| Exclusively glucogenic | Exclusively ketogenic | Both |
|---|---|---|
| Ala, Asp, Glu, Gly, Ser, Val, His, Arg, Pro, Thr, Met, Cys | **Leu, Lys** | Ile, Phe, Tyr, Trp |

Leu and Lys are the *only* exclusively ketogenic amino acids, a frequent exam discriminator.

### Post-translational chemistry: phosphorylation and glycosylation

Two reversible modifications regulate protein function, stability, and localisation:

- **Phosphorylation** targets Ser, Thr, Tyr (and His in bacteria), their nucleophilic –OH (or, for His, imidazole N) groups let kinases attach a phosphate, acting as a reversible on/off switch.
- **Glycosylation** attaches sugars at two consensus contexts: **N-glycosylation** at Asn in the sequence Asn–X–Ser/Thr (X ≠ Pro), recognised co-translationally by oligosaccharyltransferase; **O-glycosylation** at Ser/Thr in proline-rich regions, added one sugar at a time in the Golgi. Glycans stabilise folding, form protective mucin barriers, and constitute the cell-surface glycocalyx used for self/non-self recognition (including blood-group antigens).

Neither modification has one universal purpose: the functional outcome depends on the specific site, the sugar/phosphate added, and the resulting conformational change.

### The Ramachandran plot

Not every combination of the backbone dihedral angles φ (phi) and ψ (psi) around the α-carbon is sterically permitted. Plotting φ against ψ for every residue in a solved structure produces the **Ramachandran plot**, with favoured, allowed, and forbidden regions:

- **α-helix**: φ ≈ −57°, ψ ≈ −47°
- **Antiparallel β-sheet**: φ ≈ −139°, ψ ≈ +135°
- **Parallel β-sheet**: φ ≈ −119°, ψ ≈ +113°
- **Collagen triple helix**: φ ≈ −51°, ψ ≈ +153°

![Ramachandran plot (φ vs. ψ) for solved structure PDB 1AXC, with favoured (red), allowed (orange), and generously allowed (yellow) regions shaded and the α-helix and β-sheet regions labelled; blue diamonds mark the structure's actual residue angles clustering in the favoured regions](/MCBBPICS/ramchandran.png)
Source: Unknown

**Glycine** (no side chain, minimal steric restriction) is the only residue that populates all four quadrants, which is why it appears at tight turns and buried positions. **Proline** (side chain cyclised back onto the backbone nitrogen, fixing φ ≈ −60°, and lacking an amide hydrogen to donate) is confined to a narrow region and cannot participate in α-helix hydrogen bonding. This is the chemical basis for both residues acting as "helix breakers" (see [Protein Structure, Folding & Function](../protein-structure-folding-function/)).

## Comparative Structures

Ionizable-group comparison across the three charged/polar-basic amino acid classes, since exam questions frequently hinge on distinguishing these:

| Property | Aspartate/Glutamate (acidic) | Lysine/Arginine (basic) | Histidine |
|---|---|---|---|
| Side-chain pKₐ | ~3.9–4.1 | ~10.5–12.5 | ~6.0 |
| Charge at pH 7 | Negative | Positive | Mostly neutral (~10% protonated) |
| Buffering range | Poor at pH 7 (far from pKₐ) | Poor at pH 7 (far from pKₐ) | **Best of the 20**: pKₐ near physiological pH, the basis for histidine's role in enzyme active sites and hemoglobin's Bohr effect |

## Common Exam Questions

- "Calculate the pI of [amino acid/peptide] given these pKₐ values": always average the *two pKₐ flanking the zwitterion*, not the first two numerically.
- "Which amino acids are exclusively ketogenic?": Leu and Lys, no exceptions.
- "Why is glycine/proline structurally special?": steric argument (no side chain / cyclic side chain), not a vague "flexibility" answer.
- Identifying whether a modification is functionally significant requires knowing site + attached group + resulting conformational change: a question that names only "glycosylation occurred" without further detail cannot alone imply a specific function.

## Visual Reference

**Interactive**

- A titratable-amino-acid pH slider: drag a pH slider across 0–14 and watch a lysine molecule's protonation state change at each ionizable group, with the running net charge displayed.

{{< iframe src="/titratable-amino-acid-ph-slider.html" title="Titratable Amino Acid pH Slider" height="480px" >}}

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

**1. Isoelectric point of a tripeptide.** A tripeptide Glu–Arg–Gly has pKₐ values: α-COOH (2.1), α-NH₃⁺ (9.5), Glu side chain (4.1), Arg side chain (12.5). What is its approximate pI?

<details>
<summary>Show answer</summary>

At low pH all groups are protonated (net charge +2: Arg⁺, N-terminus⁺, plus neutral C-terminus and Glu side chain). Raising pH, the C-terminus deprotonates first (pKₐ 2.1, charge +1), then the Glu side chain (pKₐ 4.1, charge 0), net charge zero is reached between these two flanking pKₐ values on one side and the still-protonated N-terminus/Arg side chain on the other. The pI lies between the Glu side-chain pKₐ (4.1) and the N-terminus pKₐ (9.5): pI = (4.1 + 9.5)/2 ≈ **6.8**.
</details>

**2. Cofactor mechanism.** Pyridoxal phosphate (PLP, active vitamin B₆) is essential for transaminases. What unique chemical feature lets it fill this role?

<details>
<summary>Show answer</summary>

PLP's aldehyde group forms a Schiff base (aldimine) with a lysine ε-amino group in the enzyme's active site; on substrate binding, the substrate's amino group displaces the lysine, forming a new Schiff base. PLP's pyridinium ring then acts as an electron sink, stabilising the carbanion intermediate formed as the amino group is transferred. This stabilisation is what makes transamination kinetically feasible.
</details>

**3.** Rank Phe, Trp, Tyr, His by relative contribution to a protein's UV absorbance at 280 nm, and explain why His is excluded from the usual A₂₈₀ approximation despite being aromatic.

**4.** A mutation replaces a surface lysine with glutamate. Predict the qualitative effect on the protein's pI, and state whether this residue is more likely glucogenic or ketogenic after catabolism.
