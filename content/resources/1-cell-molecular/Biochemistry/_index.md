---
title: "Biochemistry"
weight: 1
description: "."
type: "docs"
---


## General Discussion:

General resources of this topic has been pretty well covered in our about and resources sections, recommended books are in their directories. If you are a complete beginner, i recommend reading this <a href="/Abs_basics.pdf" target="_blank">pdf</a> pefore starting off 
<br>
You might see less practice for Enzyme Kinetics, as we shall cover a lot of practice in the practical section for biochemistry.

{{< tabs >}} 
{{< tab name="Amino Acids" >}}
Amino acids are the monomers, or building blocks, of proteins. They are the smallest subunits
of a polypeptide chain, substituted methanes, which eventually folds to become a protein. Amino acids are made of
two chemical groups, namely a carboxyl group, an amine group, and a variable R group, also
known as a side chain. These chemical groups are all attached to a carbon, which also has an
extra hydrogen atom bound to it. <br> ![Alt text](/MCBBPICS/Amino_Acid.png) <br>
The R groups, also known as side chains, are what determine an amino acid’s properties: buffering capabilities, hydrophobic properties, polarity, compressibility, and more. There are
twenty unique R groups, and thus twenty unique amino acids, each with their own properties.
It is recommended to study and memorize the properties of these amino acids before moving <br>
![Alt Text](/MCBBPICS/Amino_Acid2.png) <br>
### A few notable points about their behaviour:<br>
1: Order of aromaticity: Phe>Trp>Tyr>His <br>

2: Nonpolar amino acids (there are 9) contain aliphatic (hydrocarbon) chains or aromatic rings.<br>

3: Polar acidic amino acids (2) contain a carboxylic acid (or carboxylate) group in the side chain (R group). This is in addition to the one in the backbone of the amino acid. <br>

4: Polar basic amino acids (3) contain an amine (may be neutral or charged) group in the side chain (R group). This is in addition to the one in the backbone of the amino acid.<br>

5: Polar neutral amino acids <br>

6: Contain a hydroxyl (-OH), sulfur, or amide in the R group.
<br>
There are two important exceptions to the above rules.
 A) Tyrosine has an aromatic group and an -OH group and is considered polar neutral.<br>
B) Methionine contains a sulfur but as a part of carbon chain. Sulfur has the same electronegativity as carbon, so it is considered nonpolar.
<br> <br>
7: <span style="font-weight: bold;">*Calculation of pI of amino acids*:</span>
The isoelectric point **pI** of an amino acid is the specific pH at which it has a net electrical charge of zero (existing mostly as a zwitterion). To find it, you average the two pK<sub>a</sub> values that border the electrically neutral state
<br>
The isoelectric point is calculated as : $$ pI = \frac{pKa_1 + pKa_2}{2} $$ 
For example, pI of lysine is supposed to be (9+10.5/)2 = 9.75, but its pK<sub>a</sub> values are 2.2, 9, 10.5 respectively. this is as the <a href="#" onclick="switchToTabAndScroll(3, 'zwitterion-definition'); return false;">zwitterion</a> exists between these pH.
<a href="https://www.youtube.com/watch?v=Gkb4it5nOuc&t=522s"> Watch Organic Chemistry Tutor's video on this </a> 
<br><br><a href="#" onclick="switchToTabAndScroll(3, 'glyco-phospho'); return false;">Glycosylation and Phosphorylation*</a> <br>
8: <span style="font-size: 1.2rem;">Phosphorylation targets: Ser, Thr, Tyr, His</span> <br>Because their side chains contain nucleophilic hydroxyl (\(-OH\)) or nitrogen-containing functional groups. These groups allow kinases to attach a phosphate group, creating a reversible switch that regulates protein function, stability, and cellular signaling
<br><br>
9: <span style="font-size: 1.2rem;">N-Glycosylation and O-Glycosylation sites: Asn and Ser, Thr respectively</span><br>
   N-Glycosylation:<br>Consensus Sequence: Asn - X - Ser / Thr (where X is any amino acid except Proline)<br>Why: The enzyme oligosaccharyltransferase (OST) scans the unfolded protein during synthesis for this specific tri-peptide pattern. The side chain of asparagine contains a reactive nitrogen group where an entire, pre-assembled 14-sugar carbohydrate block is attached<br>
   O-Glycosylation: Consensus Sequence: None strictly defined<br> These attach to flexible, proline-rich regions.Why: Serine and threonine both contain exposed hydroxyl side chains. Enzymes in the Golgi apparatus (such as polypeptide N-acetylgalactosaminyltransferases) use this group as a nucleophile to add sugars one by one<br><br>
<span class="badge-custom">Important</span> <br>
10: A basic trick is that phosphorylation or glycosylation do not always serve some specific purpose, everything depends on the combination of the site of addition, the final product added, and the conformational/chemical change.
<br><br>

---
<!-- ═══════════════════════════════════════════════════════════
     ADDITIONAL IBO-RELEVANT CONTENT — AMINO ACIDS
     ═══════════════════════════════════════════════════════════ -->

<span class="badge-custom">BiO Essential</span>

### 11: Henderson-Hasselbalch & Amino Acid Titration Curves {#henderson-hasselbalch}

At any given pH, the ratio of protonated to deprotonated form of an ionisable group is given by:

$$ \text{pH} = pK_a + \log\frac{[\text{A}^-]}{[\text{HA}]} $$

This means:
- When **pH < pKₐ**: the protonated (charged for amines, neutral for carboxyl) form predominates
- When **pH = pKₐ**: both forms exist in equal concentration — this is the **half-equivalence point** on a titration curve
- When **pH > pKₐ**: the deprotonated form predominates

**Reading a titration curve:** The titration curve of a polyprotic amino acid (e.g., lysine with pKₐ values 2.2, 9.0, 10.5) shows three inflection points. The pI lies between the two pKₐ values that flank the neutral (zwitterionic) species. The **plateau regions** (buffering zones) occur ±1 pH unit around each pKₐ — the amino acid resists pH change most effectively here.

<a href="https://www.khanacademy.org/science/ap-chemistry-beta/x2eef969c74e0d802:acids-and-bases/x2eef969c74e0d802:acid-base-titration-curves/v/amino-acid-titration" target="_blank">Khan Academy — Amino Acid Titration Curves (video)</a><br>
*Please switch to light mode*
![Titration curve schematic — lysine showing three pKa inflection points and pI](/MCBBPICS/LYSINECURVE.png)
*Titration curves for glycine (monoprotic backbone) and lysine (with basic side chain). Note the third inflection point and the position of pI between the two pKₐ values flanking the zwitterion. (Source: Wikimedia Commons, CC BY-SA)*

---
<span class="badge-custom">BiO Essential</span>
### 12: Essential vs. Non-Essential Amino Acids

Of the 20 standard amino acids, **9 are essential** — humans cannot synthesise them and must obtain them from diet:

> **His, Ile, Leu, Lys, Met, Phe, Thr, Trp, Val**
> Mnemonic: **"PVT TIM HaLL"** (Phe, Val, Thr, Trp, Ile, Met, His, Leu, Lys)

**Conditionally essential** amino acids become dietary requirements under specific physiological conditions (growth, illness, pregnancy):
- **Arg** — essential during growth; adults can synthesise it via the urea cycle but often inadequately
- **Cys** — can be synthesised from Met (requires adequate Met supply)
- **Tyr** — synthesised from Phe (absent in phenylketonuria/PKU)
- **Gln, Pro, Gly** — conditionally essential in severe illness or very low intake

<span class="badge-exploration">Explore!</span> Phenylketonuria (PKU) is a classic disease context: loss-of-function of **phenylalanine hydroxylase (PAH)** prevents conversion of Phe → Tyr. Phe accumulates, is transaminated to phenylpyruvate, causing neurological damage. Tyr becomes conditionally essential. <a href="https://omim.org/entry/261600" target="_blank">OMIM entry for PKU</a>

---
<span class="badge-custom">BiO Essential</span>
### 13: Amino Acid Metabolism — Transamination and Deamination

Amino acids are not stored — excess is catabolised. Two central reactions:

**Transamination** transfers the α-amino group to α-ketoglutarate (via PLP-dependent aminotransferases), producing glutamate and a new α-keto acid:

$$ \text{Amino acid} + \alpha\text{-ketoglutarate} \xrightarrow{\text{aminotransferase (PLP)}} \alpha\text{-keto acid} + \text{Glutamate} $$

Key examples: **AST** (aspartate aminotransferase) and **ALT** (alanine aminotransferase) — clinically important liver enzymes; elevated serum AST/ALT indicates hepatocyte damage.

**Oxidative deamination** then removes the amino group from glutamate as NH₄⁺:

$$ \text{Glutamate} + \text{NAD}^+ + \text{H}_2\text{O} \xrightarrow{\text{Glutamate dehydrogenase}} \alpha\text{-ketoglutarate} + \text{NH}_4^+ + \text{NADH} $$

NH₄⁺ is toxic and is channelled into the **urea cycle** for excretion as urea.

The carbon skeletons remaining after deamination are either **glucogenic** (enter gluconeogenesis) or **ketogenic** (enter ketogenesis). Some amino acids are both.

| Exclusively glucogenic | Exclusively ketogenic | Both |
|---|---|---|
| Ala, Asp, Glu, Gly, Ser, Val, His, Arg, Pro, Thr, Met, Cys | Leu, Lys | Ile, Phe, Tyr, Trp |

<span class="badge-custom">Important</span> **Leu and Lys are the only exclusively ketogenic amino acids** — a common question target.

---
<span class="badge-custom">Extraaa!!</span>
### 14: The Ramachandran Plot — Allowed Backbone Conformations

Not all φ (phi) and ψ (psi) dihedral angle combinations around the α-carbon backbone are sterically allowed. The **Ramachandran plot** maps φ against ψ and shows which combinations are favoured (core regions), allowed (additional regions), and forbidden (steric clashes).

Key regions to know:
- **α-helix**: φ ≈ −57°, ψ ≈ −47° (upper-left cluster)
- **Antiparallel β-sheet**: φ ≈ −139°, ψ ≈ +135° (lower-left cluster)
- **Parallel β-sheet**: φ ≈ −119°, ψ ≈ +113°
- **Collagen triple helix**: φ ≈ −51°, ψ ≈ +153°

**Glycine** is the only amino acid that populates all four quadrants — its lack of a side chain removes steric restriction entirely. This is why Gly appears at tight turns and buried positions in α-helices.

**Proline** is confined to a narrow region (φ ≈ −63°, ψ ≈ −15° to +145°) because its cyclic side chain fixes φ near −60°. It cannot donate an NH hydrogen bond in helices.

<a href="https://www.youtube.com/watch?v=4AHXU4wMH24" target="_blank">Watch: Ramachandran plot explained (Shomu's Biology)</a>

![Ramachandran plot](/MCBBPICS/ramchandran.png)
*A general Ramachandran plot for non-Gly, non-Pro residues. Favoured regions are darkest. The α-helix and β-sheet regions are clearly separated. (Source: Wikimedia Commons, CC BY-SA)*
{{< /tab >}}
{{< tab name="Proteins" >}}
<span style="text-align: center">*"It seems that the structure of protein folds is conserved more in evolutionary relations than the amino acid sequences"*</span> <br><br>
Proteins are large, essential macromolecules made of amino acids. They serve as the foundational building blocks of the body, driving nearly all biological processes including cell repair, muscle growth, enzyme function, and immune defense and pretty much everything else.<br>
L-Amino Acid <a href="#" onclick="switchToTabAndScroll(3, 'stereo'); return false;">stereoisomers</a> are found in the vast majority of living residues. Because enzymes, receptors, and DNA are chiral, proteins require precise "left-handed" building blocks to fold correctly and function. Using mixed D- and L-isomers would cause enzymes to misfold and fail
<br><br>
## Protein Structure

The structure of a protein, conformational and sequence-based, decide the fate, function, and form of the protein. Some polyubiquitination motif could cause the whole protein to self destruct, A signal <a href="#" onclick="switchToTabAndScroll(3, 'motif'); return false;"> motif</a> could cause the protein to migrate (mitochondrial targeting sequence (MTS)), and the world renowned insulin's C peptide sulfide bond could decide a lot.
<br><br>
There are 4 well established levels to the structure of a protein:
<br>
### Primary structure
The primary structure of a protein is simply the linear sequence of amino acids in its polypeptide chain. It contains primarily peptide and disulfide bonds.<br><br>
  ![Alt text](/MCBBPICS/secondary.png)
### Secondary structure
Protein secondary structure is maintained almost entirely by hydrogen bonds formed between atoms in the polypeptide backbone, specifically between the carbonyl oxygen and amide hydrogen. Unlike tertiary or quaternary structures, the side chains (R-groups) are not involved in these bonds
  There are two motifs which define secondary structures:<br><br>
  *Please switch to light mode*
  ![Alt text](/MCBBPICS/structuralaas.png)<br><br>
  A) $\alpha$-Helix:  - 1 Turn = 3.6 amino acids
  - **High Propensity: Alanine, Glutamate, Leucine, Methionine, and Lysine** (often abbreviated by their single-letter codes as MALEK).<br>Why: These amino acids provide an ideal balance of bulk and flexibility, and their side chains lack steric interference. Glutamate and Lysine also form stabilizing salt bridges, while Alanine has the highest intrinsic capacity to pack tightly into a standard helical coil<br><br>
  - **Helix Breakers: Proline and Glycine.**<br>Why: Proline's side chain loops back and covalently binds to the main nitrogen backbone, creating a rigid ring. This entirely lacks the amide hydrogen required to participate in the helix's core hydrogen bonding and introduces a strict structural kink.<br>Glycine: It has a hydrogen atom as its only side chain, making it incredibly flexible. This high flexibility makes it "entropically expensive" (costly in terms of energy) for the protein to force it into a rigid, constrained helix<br><br>
                      - Alpha helices are known for their ability to introgress in cell membranes. Their primary functions include providing fundamental structural support (as in hair and nails), creating binding sites for molecular recognition, and facilitating the transport of molecules across cell membranes. <br><br>
  B) $\beta$-Sheets:  - 180 deg turn in 4 AA residues <br><br>
                      - High Propensity: Large aromatic residues like Tryptophan, Tyrosine, and Phenylalanine, and branched amino acids like Valine, Isoleucine, and Threonine.<br>Why: Beta sheets (and beta strands) form extended, zig-zag polypeptide conformations. Bulky aromatic and branched side chains physically block the tight coiling seen in helices, naturally favoring the more open and spacious geometry of beta sheets.    <br><br>              
                      - Sheet Breakers: Proline, along with bulky charged residues that cause steric and electrostatic clashes, such as Glutamate and Lysine.<br>Why: The conformational rigidity and built-in "kink" of Proline disrupt the extended, flat strands required to form a pleated beta sheet
                      - They are well known for their imparted flexibility.<br><br>
  C) $\beta$-Turn:    - Third and lesser known secondary structure, used to connect two adjacent anti parallel beta sheet strands                <br><br>
  <span class="badge-custom">Important</span> <br>
  As a rule of thumb in secondary structure , use n=n+3 , implying that only 3 adjacent amino acid interactions are significant.       <br><br>
### Supersecondary structure
The less known but question-relevant structure, consists of simple motifs like $\alpha$-$\alpha$-$\alpha$, $\alpha$-$\beta$-$\alpha$ , $\beta$-$\beta$-$\beta$.
<br>
<img src="/MCBBPICS/sss.png">
<br><br>
### Tertiary structure
The tertiary structure of a protein is its overall 3D shape, formed by the folding and packing of secondary structures (like $\alpha$-helices and $\beta$-sheets) into compact functional units called domains. It is driven and stabilized by interactions between the amino acid side chains (R-groups) and the surrounding environment
                      - 1. Bonds and Interactions Stabilizing the StructureThe intricate 3D shape is held together by four main types of interactions:<br>
                        - Hydrophobic Interactions: The primary driving force of protein folding. Nonpolar (hydrophobic) amino acid side chains cluster in the interior of the protein to avoid water, while polar side chains stay on the outside.<br>
                        - Hydrogen Bonds: Formed between polar side chains (e.g., hydroxyl, amino, or carboxyl groups) or between the peptide backbone and side chains. They are weaker individually but abundant and highly directional.<br>
                        - Ionic Bonds (Salt Bridges): Electrostatic attractions between oppositely charged amino acid side chains (e.g., a positively charged lysine and a negatively charged aspartate).<br>
                        - Disulfide Bonds (Bridges): The only covalent bond in tertiary structure. They form strong cross-links between the sulfur-containing side chains of two cysteine amino acids.<br><br>
                      - 2. Other Crucial Factors<br>
                        - Van der Waals Forces: Weak, short-range attractions between closely packed atoms in the protein's dense core.<br>
                        - Chaperone Proteins: Cellular helper proteins (like chaperonins) that bind to newly forming proteins, preventing them from tangling or aggregating incorrectly before the folding process is complete.<br>
                        - Denaturation: Because most tertiary bonds are noncovalent, they are fragile. Changes in pH, heavy metals, or high temperatures can disrupt these bonds, causing the protein to unfold and lose its biological function 
<img src="/MCBBPICS/tss.png">
<br><br>
### Quaternary structure
Quaternary structures are formed by the interactions between Tertiary ones. These make the final protein unit, often just hydrogen bonded multimers.
<img src="/MCBBPICS/qss.png">
<br><br>
<!-- ═══════════════════════════════════════════════════════════
     ADDITIONAL IBO-RELEVANT CONTENT — PROTEINS
     ═══════════════════════════════════════════════════════════ -->

<span class="badge-custom">BiO Essential</span>
### Allosteric Proteins and Cooperativity — Hemoglobin as the Model

Hemoglobin (Hb) is the definitive example of **allostery** — the regulation of protein function through conformational change induced by a ligand binding at a site other than the active site.
<br>
<img src="/MCBBPICS/tr.png">
<br>
**T state vs. R state:**
Deoxy-hemoglobin adopts the **T (tense) state**: the four subunits are held in a constrained conformation by 8 salt bridges between the subunits, giving *low* O₂ affinity. When O₂ binds one heme iron, the iron moves into the porphyrin plane (it is slightly out-of-plane when deoxygenated, pulled by the proximal His F8). This movement tugs the α-helix carrying His F8, breaking salt bridges and transitioning cooperatively to the **R (relaxed) state** with *high* O₂ affinity.

**Cooperativity:** Because binding at one subunit allosterically increases affinity at the others, the O₂-binding curve is **sigmoidal**, not hyperbolic. The Hill coefficient (n_H) quantifies this:

$$ \theta = \frac{[O_2]^{n_H}}{K_d^{n_H} + [O_2]^{n_H}} $$

For Hb, n_H ≈ 2.8 (max 4 for perfect cooperativity). Myoglobin (monomeric, no cooperativity) gives a hyperbolic curve with n_H = 1.
<br>
<img src="/MCBBPICS/hillgraph.png">
<br>
<span class="badge-custom">BiO Essential</span>
You do not need to necessarily understand the complete equation. but you should  understand the role of hills coefficient and its limits.<br>

**Heterotropic effectors:**

| Effector | Effect on Hb | Mechanism |
|---|---|---|
| 2,3-bisphosphoglycerate (2,3-BPG) | Decreases O₂ affinity (right-shifts curve) | Binds central cavity of T state, stabilising it |
| CO₂ | Decreases O₂ affinity | Forms carbaminoHb; also lowers pH (Bohr effect) |
| H⁺ (low pH) | Decreases O₂ affinity (Bohr effect) | Protonates His HC3 of β-chain, stabilising T state |
| CO | >200× higher affinity than O₂; causes hypoxia | Binds same site; shifts remaining subunits to R — reduces cooperativity |

<a href="https://www.youtube.com/watch?v=LWtXthfG9_M" target="_blank">Watch: Hemoglobin cooperativity and the Bohr effect (Armando Hasudungan)</a>

<span class="badge-challenge">CHALLENGE!!</span> Plot the O₂-binding curve of Hb vs. Mb on the same axes. At pO₂ = 40 mmHg (venous tissue), which protein retains more O₂? Why is this physiologically important?
<details>
<summary>Click for reveal of graph</summary>
<img src="/MCBBPICS/mbhbgraph.png"/>
</details>
<br><br>
---
<span class="badge-custom">BiO Essential</span>

### Protein Folding — Chaperones and Misfolding Diseases

**Chaperones** don't determine the final fold (which is encoded in the primary sequence, Anfinsen's dogma) — they prevent *off-pathway* aggregation by transiently binding exposed hydrophobic patches during translation and shielding them until folding completes.<br>
{{< youtube ESC3CSApNnk >}}
<br>

**GroEL/GroES (Hsp60 family) mechanism:**
1. Unfolded protein enters the GroEL barrel (hydrophobic inner surface)
2. ATP binding causes conformational change — inner surface becomes hydrophilic, providing a protected folding chamber
3. GroES cap closes
4. ATP hydrolysis releases the (correctly or incorrectly folded) protein after ~10 s
5. Incorrectly folded proteins re-enter the cycle

**Hsp70 (DnaK in bacteria):** Binds extended peptides co-translationally; works with co-chaperones DnaJ (Hsp40) and GrpE (nucleotide exchange factor).

**Protein misfolding diseases — context:**

| Disease | Protein | Misfolding event |
|---|---|---|
| Sickle cell anaemia | β-globin (HbS: Glu6Val) | Valine creates hydrophobic patch; deoxy-HbS polymerises into fibres |
| Cystic fibrosis | CFTR (ΔF508 most common) | Misfolded CFTR retained in ER, degraded by ERAD before reaching plasma membrane |
| Prion disease (CJD, scrapie) | PrP | PrPᶜ (α-helix-rich) → PrPˢᶜ (β-sheet-rich); misfolded form catalyses conversion of native PrPᶜ — self-templating |
| Alzheimer's disease | Amyloid-β (Aβ) / Tau | Aβ aggregates into amyloid plaques (cross-β fibril structure); Tau forms neurofibrillary tangles |
| Parkinson's disease | α-synuclein | Aggregates into Lewy bodies |

<span class="badge-custom">Important</span> **Prion diseases** are uniquely tested at olympiad exams because they challenge the central dogma — information can be propagated by protein conformation alone, with no nucleic acid template. PrPˢᶜ is infectious, hereditary, and sporadic. Key: it is not destroyed by UV radiation or nucleases (which destroy nucleic acids), only by autoclaving with NaOH.

<a href="https://www.youtube.com/watch?v=Mxl7RGSSmLo" target="_blank">Watch: Protein folding and chaperones (iBiology — Judith Frydman)</a>

---
<span class="badge-custom">BiO Essential</span>
### Post-Translational Modifications — Ubiquitin-Proteasome System

Beyond phosphorylation and glycosylation (covered in the Amino Acids tab), the **ubiquitin-proteasome system (UPS)** is a central topic:

**Ubiquitin (Ub)** is a 76-residue protein attached to target proteins via an isopeptide bond (between Ub's C-terminal Gly and a Lys ε-amino group on the target) by a three-enzyme cascade:

$$ \text{E1 (Ub-activating)} \rightarrow \text{E2 (Ub-conjugating)} \rightarrow \text{E3 (Ub-ligase, provides substrate specificity)} $$

**Polyubiquitination via Lys48 linkage** → signals proteasomal degradation (26S proteasome)
**Polyubiquitination via Lys63 linkage** → signals DNA repair, endosomal sorting (non-degradative)
**Monoubiquitination** → histone regulation, membrane protein trafficking

The **26S proteasome** consists of a 20S catalytic barrel (three types of protease activity: chymotrypsin-like, trypsin-like, caspase-like) capped by two 19S regulatory particles that recognise polyUb chains, unfold the target (ATP-dependent), and thread it in for degradation.

This system is the target of **bortezomib** (proteasome inhibitor used in multiple myeloma).
<br><br>
<span class="badge-exploration">Explore!</span> <br>
Give a visit to <a href="https://www.rcsb.org/3d-view/jsmol/4HHB/1" target="blank">RCSB Protein visualizer</a> and look at some amazing structures of the very molecules which define us. <br><br>
<span class="badge-curiosity">Proceed if you have the time!</span> <br>
### Fibrous and globular proteins
Now, let us look at some common protein structures and find differnces:<br>
1. Fibrous Proteins <a href="https://www.rcsb.org/3d-view/AF_AFQ9BYR0F1" target="blank">$\alpha$ Keratin</a> Keratin has helices with disulfide bonds, imparting toughness.  
<a href="https://www.rcsb.org/3d-view/3UA0" target="blank">Silk Fibronin</a>  $\beta$ sheets of fibronin make it soft and flexible.
   <br>
<a href="https://www.rcsb.org/3d-view/1BKV" target="blank">Collagen</a> High tensile strength due to signature triple helix
<br><br>
<span class="badge-challenge">CHALLENGE!!</span>
2. Globular Proteins: <a href="https://www.rcsb.org/3d-view/1JY7" target="blank">Methemoglobin</a>, <a href="https://www.rcsb.org/structure/1hgb" target="blank">T state</a> and <a href="https://www.rcsb.org/structure/3oo5" target="blank"> R state Hemoglobin</a> 
Do a similar analysis and write down your results for these 3.
{{< /tab >}}
{{< tab name="Enzyme Kinetics" >}}
## Enzyme Kinetics

Most people start enzyme kinetics and end it at just about one equation. But here, we shall try to explore the concept in more detail. If you are in a hurry, look at the parts marked important or the equations. The kinetics constants have been used in the same order.
<br><br>
<img src="/MCBBPICS/kinetics_phases.png" alt="kinetics_phases" style="max-width:100%; height:auto;">
<br>Our reactions are : 
$$
\text{E+S} \rightleftharpoons \text{ES} \rightleftharpoons \text{E+P}
$$
### Pre-Steady State Kinetics
<br> - Timeframe: Milliseconds to a few seconds
<br> - Free enzyme binds substrate; intermediates accumulate
<br> - Determine individual rate and equilibrium constants (\(k_1, k_{-1}, k_2\), etc.)
<br> - [E] > [S] or high-concentration rapid mixing
<br> - <span class="badge-exploration">Explore! (*Out of Syllabus*)</span> 
<br> - <a href="https://ocw.mit.edu/courses/5-08j-biological-chemistry-ii-spring-2016/fd3e7767f2bbc6a06cce34b566fdf3a0_MIT5_08jS16r2_handout.pdf" target="blank">Click here for more on pre steady state kinetics</a>
<br><br>

</a>
<details>
<summary>👉 Click to reveal derivation of steady state kinetics</summary>

 <strong>Steady State kinetics derivation:</strong> <br>The assumption: Rate of formation = Rate of breakdown 
   i.e., $$
k_1 ([E_t] - [ES]) [S] = k_{-1} [ES] + k_2 [ES]
$$
<br>
simplifying and adding $k_!$[ES][S] to both sides, we get: 
   $$
[ES] = \frac{[E_t] \cdot [S]}{[S] + \frac{k_{-1} + k_2}{k_1}}
$$
multiplying by $k_2$ , we finally arrive at
$$
V_t = \dfrac{V_{\text{max}} [S]}{K_m + [S]}
$$
Note that if $k_2$ is rate limiting, $K_m$ = $K_d$ = $k_{-1}$/$k_1$ 

</details>
<br>

### Steady State Kinetics
Before Starting, we advise you to familiarize yourself with <a href="#" onclick="switchToTabAndScroll(3, 'mm-plot'); return false;">Michaelis-Menten</a> and <a href="#" onclick="switchToTabAndScroll(3, 'lb-plot'); return false;">Lineweaver-Burk</a> plots, if not already, so you are able to understand all presented graphs.
The central equation of steady state kinetics <a href="#" onclick="switchToTabAndScroll(3, 'mmdefinition'); return false;">*Michaelis-Menten Kinetics*</a> is
$$
V_t = \dfrac{V_{\text{max}} [S]}{K_m + [S]}
$$
Where $K_m$ is the substrate concentration at which velocity of the reaction is $V_{max}$/2, it is also an inverse indicator of the affinity of an enzyme for its substrate. Why? Hint: remember it is =
$$
 \frac{k_{-1}+k_2}{k_1}
$$
### V_max and k_cat
The parameter $V_{max}$ is equal to the product of $k_{cat}$ and [$E_t$]
where $k_{cat}$ is the kinetic constant of the rate limiting step. In our case, it is equal to $k_2$ as product release is the rate limiting step.If the reactions were:
$$
\text{E+S} \rightleftharpoons \text{ES} \rightleftharpoons \text{EP} \rightleftharpoons \text{E+P}
$$
The rate constant $k_{cat}$ would be $k_3$ assuming product release is limiting step.
  <br>It is also called the *Turnover number* as it represents the number of substrate molecules being converted to product molecules per unit time, when enzyme is saturated with substrate.<br> It is also proportional to the speed of the enzyme<br><br>
### Specificity Constant (k_cat/K_m)
The best way to compare the catalytic efficiencies
of different enzymes or the turnover of different substrates by the same enzyme is to compare the ratio kcat/Km
for the two reactions. This parameter, sometimes called
the specificity constant, is the rate constant for the
conversion of E->S to E->P. When [S] <<< Km, Equation 6–26 reduces to the form
$$
V_0 = [E_t] \cdot [S] \cdot \frac{k_{cat}}{K_m}
$$
the constant kcat/Km is a second-order
rate constant with units of $M^{-1}$$s^{-1}$
. There is an upper
limit to kcat/Km, imposed by the rate at which E and S can
diffuse together in an aqueous solution. This diffusion controlled limit is 108 to 109 $M^{-1}$$s^{-1}$
, and many enzymes
have a kcat/Km near this range (Table 6–8). Such
enzymes are said to have achieved catalytic perfection. 
![Alt text](/MCBBPICS/table68.png)
<br><br>
<strong> Worked Example 3‑1: Determination of $K_{\text{m}}$ </strong>

An enzyme is discovered that catalyzes the chemical reaction  

$$
\text{SAD} \rightleftharpoons \text{HAPPY}
$$

A team of motivated researchers sets out to study the enzyme, which they call **happyase**. They find that the $k_{\text{cat}}$ for happyase is $600\ \text{s}^{-1}$.

When [$E_t$] = 20 nM and [SAD] = 40 $\mu$M, the reaction velocity $V_{0}$ is $9.6\ \mu\text{M s}^{-1}$.

**Calculate $K_{\text{m}}$ for the substrate SAD.**

---
<a href="#" onclick="switchToTabAndScroll(3, 'we3-1'); return false;">Solution
</a>
<br><br>
<span class="badge-exploration">Explore! (*Out of Syllabus*)</span> <br>
<a href="https://courseware.cutm.ac.in/wp-content/uploads/2020/06/Bi-substrate-reaction-PDF.pdf" target="blank">Explore Ping-Pong and Ternary Complex bisubstrate reactions here</a><br><br>
## Enzyme Inhibition Kinetics
<br>![Alt text](/MCBBPICS/inhibitionmm.png)<br>
<br>![Alt text](/MCBBPICS/lbcomp.png)<br>
Inhibition of an enzyme translates to reduction in its activity, or ability to produce product by deduction of specificity constant, but the underlying mathematics are difference for each of the four kinds of reversible inhibition:<br>
### Competitive Reversible Inhibition
<br>
Competitive inhibition, quite literally means competition of a substrate (our good guy) with another evil substrate who plans to slow us down. The main effect observed due to this is apparent reduction in binding affinity of the simpleton enzyme to our good substrate, as there is another luring evil substrate in the vicinity. Hence, the apparent $K_m'$is greater than the original $K_{m0}$. But as the good substrate increases in number, eventually at very high concentrations it takes over the effect of the bad one, and we achieve the same $V_{max'}$ as the original $V_{max0}$.

$$
\text{E} + \text{S} \rightleftharpoons \text{ES} \rightarrow \text{E} + \text{P}
$$

$$
\text{E} + \text{I} \rightleftharpoons \text{EI}
$$

$$
V_t = \dfrac{V_{\text{max0}} [S]}{K_{m0} \cdot \alpha + [S]}
$$
With the apparent $K_{m'}$ = 
$$
K_{m'} = (1 + \frac{[I]}{K_I}) \cdot K_{m0} = K_{m0} \cdot \alpha
$$
Note that the $K_I$ equals 
$$
\frac{[E] \cdot [I]}{[EI]} = \alpha - 1
$$
<a href="#" onclick="switchToTabAndScroll(3, 'derivationkm'); return false;">*Click for derivation*</a>
<br><br>
### Uncompetitive Reversible Inhibition
Uncompetitive inhibition features the following additional reaction:
$$
\text{ES} + \text{I} \rightleftharpoons \text{EIS}
$$
Hence, as it blocks release of product, it increases the apparent affinity, and decreases the $K_{m'}$ of the enzyme. Obviously, it also decreases the $V_{max}$.
Both the parameters however, decrease by the same factor:
$$
K_{m'} = \frac{K_{m0}}{\alpha'} ; V_{max'} = \frac{V_{max0}}{\alpha'} ; \alpha' = 1 + \frac{[I]}{K_I}
$$
and the new michaelis-menten state equation is :
$$
V_t = \dfrac{V_{\text{max}} \cdot [S]}{K_{m} + (\alpha' \cdot [S])}
$$
<br>
### Noncompetitive Reversible Inhibition
the additional reactions going on are :
$$
\text{ES} + \text{I} \rightleftharpoons \text{EIS}
$$
$$
\text{E} + \text{I} \rightleftharpoons \text{EI}
$$
But the nuance is that both sites of enzyme have equal affinity for the substrate, hence only the $V_{max}$ decreases, and no prizes for guessing that it decreases by a fator of $\alpha$ = $\alpha'$ . Try to derive this one yourself.
<br><br>
### Mixed Reversible Inhibition
Mixed reversible inhibition is, by the reactive point of view, the same as noncompetitive inhibition. But the nuance in thi is that the affinities for [E] and [ES] are different, hence the $K_m$ can increase or decrease, and the $V_{max}$, is doomed to decrease.
The derivation of this is extremely out of syllabus, so we will just show the final results:
$$
K_{m'} = K_{m0} \cdot \frac{\alpha}{\alpha'}
$$
$$
V_{max'} = \frac{V_{max0}}{\alpha}
$$
<br>
There is one final type of enzymatic inhibition: <br><br>
### Irreversible Inhibition
Unlike Reversible Inhibition, the hallmark of which is non covalent bonds, irreversible inhibition uses only covalent bonds (hence, irreversible). Most common examples are poisons, toxins and so on. <br><br>
Think about it, you will have some question on this on the questions tab.

{{< /tab >}}

{{< tab name="APPENDIX 1" >}}
<div id="zwitterion-definition" style="background-color: #000000; padding: 4px 8px; margin: 10px 0;">
  <strong>Zwitterion</strong>: The ionic form of an amino acid with no net charge.
</div>
<div id="glyco-phospho" style="background-color: #000000; padding: 4px 8px; margin: 10px 0;">
  <strong>Glycosylation and Phosphorylation</strong>: <br> FUNCTIONS:<br> Protein Folding & Stability: Sugars (glycans) act as folding helpers (chaperones) that protect proteins from degrading before they reach maturity.<br>Protection: In areas like the respiratory tract, dense O-glycosylation (mucins) creates a slippery, physical shield against pathogens.<br>Cell Identification: Glycans on Ser/Thr and Asn form the "sugar coat" (glycocalyx) surrounding cells, determining blood types and allowing immune cells to recognize the body's own tissues
  <br> DEFINITION: Addition of sugar or phosphate group
</div>
<div id="stereo">
   <strong>Stereoisomerism</strong> : 
</div>

![Stereoisomers](/MCBBPICS/ld.png)


<div id="motif">
   <strong>Motif</strong> : A motif is a short, recurring pattern of nucleotides (in genomes) or amino acids (in proteins) that holds biological significance
</div> <br>
<div id="mmdefinition"></div>
   <strong>Michaelis-Menten</strong> : Leonor Michaelis and Maud Leonora Menten first published their work on enzyme kinetics in 1913, which featured the signature hyperbolic curve based on the central equation.<br>
  

<div id="we3-1">

#### 🧪 Solution
</div>
We know $k_{\text{cat}}$, [$E_t$], [S], and $V_{0}$. We want to solve for $K_{\text{m}}$.

The Michaelis‑Menten equation is:

$$
V_{0} = \frac{k_{\text{cat}} [E_t] [S]}{K_{\text{m}} + [S]}
$$

Substitute the known values:

$$
9.6\ \mu\text{M s}^{-1} = \frac{(600\ \text{s}^{-1})(0.020\ \mu\text{M})(40\ \mu\text{M})}{K_{\text{m}} + 40\ \mu\text{M}}
$$

$$
9.6\ \mu\text{M s}^{-1} = \frac{480\ \mu\text{M}^{2}\ \text{s}^{-1}}{K_{\text{m}} + 40\ \mu\text{M}}
$$

Multiply both sides by $K_{\text{m}} + 40\ \mu\text{M}$:

$$
9.6\ \mu\text{M s}^{-1} (K_{\text{m}} + 40\ \mu\text{M}) = 480\ \mu\text{M}^{2}\ \text{s}^{-1}
$$

$$
K_{\text{m}} + 40\ \mu\text{M} = \frac{480\ \mu\text{M}^{2}\ \text{s}^{-1}}{9.6\ \mu\text{M s}^{-1}} = 50\ \mu\text{M}
$$

$$
K_{\text{m}} = 50\ \mu\text{M} - 40\ \mu\text{M} = 10\ \mu\text{M}
$$

---

#### ✨ Shortcut using $V_{\text{max}}$

First compute $V_{\text{max}} = k_{\text{cat}} [E_t] = 600\ \text{s}^{-1} \times 0.020\ \mu\text{M} = 12\ \mu\text{M s}^{-1}$.

Then use:

$$
\frac{V_{0}}{V_{\text{max}}} = \frac{[S]}{K_{\text{m}} + [S]}
$$

$$
\frac{9.6}{12} = \frac{40}{K_{\text{m}} + 40}
$$

$$
0.8 = \frac{40}{K_{\text{m}} + 40}
$$

$$
K_{\text{m}} + 40 = \frac{40}{0.8} = 50
$$

$$
K_{\text{m}} = 50 - 40 = 10\ \mu\text{M}
$$

---

**Answer:**  

$$
\boxed{K_{\text{m}} = 10\ \mu\text{M}}
$$
<br><br>
<div id="derivationkm">
   <strong>Derivation of $K_{m'}$</strong> </div>:
   Under competitive inhibition, an inhibitor binds reversibly to the enzyme's active site, preventing the substrate from binding. This increases the substrate concentration required to reach a specific velocity, yielding a new, higher *apparent Michaelis constant* ($K_{m}^{app}$) derived as:

$$ K_{m}^{app} = K_m \left(1 + \frac{[I]}{K_i}\right) $$

---

### The Derivation Steps

**1. Define the Enzyme Reactions & Constants**
The reactions involved are the standard enzyme-substrate binding and the competitive inhibitor binding:
* $E + S \rightleftharpoons [k_{-1}][k_1] ES \xrightarrow{k_2} E + P$
* $E + I \rightleftharpoons [k_{-i}][k_i] EI$

Where:
* $E$, $S$, $I$, and $ES$ are the concentrations of free enzyme, substrate, inhibitor, and enzyme-substrate complex.
* $K_m = \frac{k_{-1} + k_2}{k_1}$ is the Michaelis constant.
* $K_i = \frac{[E][I]}{[EI]}$ is the inhibitor dissociation constant.

**2. Formulate the Enzyme Mass Balance**
The total enzyme concentration ($[E_t]$) is the sum of all enzyme states:
$$ [E_t] = [E] + [ES] + [EI] $$

**3. Substitute the Inhibitor Concentration**
Using the dissociation constant $K_i$, we can express the enzyme-inhibitor complex as $[EI] = \frac{[E][I]}{K_i}$. 
Substituting this into the mass balance:
$$ [E_t] = [E] + [ES] + \frac{[E][I]}{K_i} $$

Factor out the free enzyme concentration $[E]$:
$$ [E_t] = [E] \left(1 + \frac{[I]}{K_i}\right) + [ES] $$

**4. Introduce the Steady-State Assumption**
From the standard Michaelis-Menten derivation, the concentration of the ES complex depends on free enzyme and substrate:
$$ [ES] = \frac{[E][S]}{K_m} $$

Rearrange this to solve for the free enzyme $[E]$:
$$ [E] = \frac{[ES] K_m}{[S]} $$

**5. Substitute $[E]$ into the Mass Balance**
Substitute this expression for $[E]$ back into our rearranged mass balance:
$$ [E_t] = \left( \frac{[ES] K_m}{[S]} \right) \left( 1 + \frac{[I]}{K_i} \right) + [ES] $$

Factor out the enzyme-substrate complex $[ES]$:
$$ [E_t] = [ES] \left[ \frac{K_m}{[S]} \left( 1 + \frac{[I]}{K_i} \right) + 1 \right] $$

**6. Solve for $[ES]$**
Isolate $[ES]$ to get the full reaction rate expression:
$$ [ES] = \frac{[E_t]}{\frac{K_m}{[S]} \left( 1 + \frac{[I]}{K_i} \right) + 1} $$

Multiply both the numerator and denominator by $[S]$:
$$ [ES] = \frac{[E_t][S]}{K_m \left( 1 + \frac{[I]}{K_i} \right) + [S]} $$

**7. Calculate Reaction Velocity ($V_0$)**
The velocity of the reaction is $V_0 = k_2[ES]$. Since the maximum velocity ($V_{max}$) equals $k_2[E_t]$, we can rewrite the rate equation:
$$ V_0 = \frac{V_{max}[S]}{K_m \left( 1 + \frac{[I]}{K_i} \right) + [S]} $$

**8. Define the New $K_m$**
Comparing this to the standard Michaelis-Menten equation, $V_0 = \frac{V_{max}[S]}{K_m + [S]}$, the constant in the denominator is altered. We define this new, increased value as the **apparent $K_m$ ($K_{m}^{app}$)**:

$$ K_{m}^{app} = K_m \left(1 + \frac{[I]}{K_i}\right) $$

Because $\left(1 + \frac{[I]}{K_i}\right)$ is always greater than 1, the $K_m$ mathematically increases, meaning it takes more substrate to achieve half the maximum velocity. However, since the term $[I]$ is only tied to the $K_m$, the $V_{max}$ remains entirely unchanged.
<br><br>
<div id="derivationuncmm">
<strong>Derivation of New parameters for Uncompetitive Reversible Inhibition</strong></div><br>

In uncompetitive inhibition, both parameters decrease by a factor of $\alpha'$:

$$\text{New } V_{\max} = V_{\max}^{\text{app}} = \frac{V_{\max}}{\alpha'}$$

$$\text{New } K_m = K_m^{\text{app}} = \frac{K_m}{\alpha'}$$

Where the modifying factor is defined as $\alpha' = 1 + \frac{[I]}{K_I'}$.

---

### 1. Define Reaction Scheme

An uncompetitive inhibitor binds **only** to the enzyme-substrate ($ES$) complex, not to the free enzyme ($E$).

$$E + S \xrightarrow{k_1} ES \xrightarrow{k_2} E + P$$
$$ES + I \rightleftharpoons{K_I'} ESI$$

Where:
* $K_I'$ is the inhibitor dissociation constant: $K_I' = \frac{[ES][I]}{[ESI]}$
* $k_1, k_{-1}$ are the forward and reverse rate constants for $ES$ formation.
* $k_2$ is the catalytic rate constant.

---

### 2. Set Up Mass Balance

The total enzyme concentration $[E]_0$ is distributed across three distinct forms:

$$[E]_0 = [E] + [ES] + [ESI]$$

Using the equilibrium expression for the $ESI$ complex ($[ESI] = \frac{[ES][I]}{K_I'}$), substitute $[ESI]$ into the mass balance equation:

$$
[E]_0 = [E] + [ES] + \frac{[ES][I]}{K_I'}
$$

$$
[E]_0 = [E] + [ES]\left(1 + \frac{[I]}{K_I'}\right)
$$

Define the uncompetitive modification factor as $\alpha' = 1 + \frac{[I]}{K_I'}$:

$$[E]_0 = [E] + \alpha'[ES] \quad \implies \quad [E] = [E]_0 - \alpha'[ES]$$

---

#### 3. Apply Steady-State Approximation

The steady-state assumption states that the concentration of the active intermediate $[ES]$ remains constant over time:

$$
\frac{d[ES]}{dt} = k_1[E][S] - k_{-1}[ES] - k_2[ES] = 0
$$

Substitute the expression for free enzyme $[E] = [E]_0 - \alpha'[ES]$ into the steady-state equation:

$k_1$([$E_0$] - $\alpha$'[$ES$])[$S$] = ($k_{-1}$ + $k_2$)[$ES$]

Expand and isolate the terms containing $[ES]$:

$k_1$[$E_0$][$S$] - $k_1$$\alpha$'[$ES$][$S$] = ($k_{-1}$ + $k_2$)[$ES$]

$k_1$[$E_0$][$S$] = [$ES$] $\cdot$ ($k_{-1}$ + $k_2$) + $k_1$$\alpha$'[$S$]

Divide the entire equation by $k_1$:

$$
[E_0][S] = [ES]\left( \frac{k_{-1} + k_2}{k_1} + \alpha'[S] \right)
$$

Recall that the Michaelis constant is $K_m = \frac{k_{-1} + k_2}{k_1}$:

$$
[E]_0[S] = [ES](K_m + \alpha'[S])
$$

$$
[ES] = \frac{[E]_0[S]}{K_m + \alpha'[S]}
$$

---

### 4. Formulate Rate Equation

The initial reaction velocity $v_0$ depends entirely on the breakdown of the $ES$ complex to yield product:

$$v_0 = k_2[ES]$$

Substitute the solved expression for $[ES]$ into this velocity equation:

$$v_0 = \frac{k_2[E]_0[S]}{K_m + \alpha'[S]}$$

Since $V_{\max} = k_2[E]_0$, the equation becomes:

$$v_0 = \frac{V_{\max}[S]}{K_m + \alpha'[S]}$$

---

### 5. Identify Apparent Parameters

To bring the equation back to standard Michaelis-Menten form, divide both the numerator and the denominator by $\alpha'$:

$$v_0 = \frac{\left(\frac{V_{\max}}{\alpha'}\right)[S]}{\left(\frac{K_m}{\alpha'}\right) + [S]}$$

Comparing this directly to the classical velocity equation $v_0 = \frac{V_{\max}^{\text{app}}[S]}{K_m^{\text{app}} + [S]}$, we extract the altered kinetic constants:

$$
\boxed{\text{Apparent } V_{\max} = \frac{V_{\max}}{1 + \frac{[I]}{K_I'}}}
$$

$$
\boxed{\text{Apparent } K_m = \frac{K_m}{1 + \frac{[I]}{K_I'}}}
$$

<div id="mm-plot">
  <strong>Michaelis‑Menten Plot</strong><br>
  <img src="/MCBBPICS/mm_plot.png" alt="MM_PLOT">
  <p>The Michaelis‑Menten equation describes the hyperbolic relationship between initial reaction velocity \(V_0\) and substrate concentration \([S]\):</p>
  $$ V_0 = \frac{V_{\text{max}} [S]}{K_m + [S]} $$
  <ul>
    <li>At low \([S]\), \(V_0\) increases linearly with \([S]\) (first‑order kinetics).</li>
    <li>At high \([S]\), \(V_0\) approaches \(V_{\text{max}}\) (zero‑order kinetics).</li>
    <li>\(K_m\) is the substrate concentration at \(V_{\text{max}}/2\) and reflects the enzyme’s affinity for the substrate (lower \(K_m\) = higher affinity).</li>
  </ul>
</div>

<div id="lb-plot" style="margin-top: 2rem;">
  <strong>Lineweaver‑Burk Plot (Double‑Reciprocal)</strong><br>
  <img src="/MCBBPICS/lb_plot.png" alt="LB_PLOT">
  <p>Taking the reciprocal of the Michaelis‑Menten equation gives a straight line:</p>
  $$ \frac{1}{V_0} = \frac{K_m}{V_{\text{max}}} \cdot \frac{1}{[S]} + \frac{1}{V_{\text{max}}} $$
  <ul>
    <li>Slope \(= K_m / V_{\text{max}}\)</li>
    <li>Y‑intercept \(= 1 / V_{\text{max}}\)</li>
    <li>X‑intercept \(= -1 / K_m\)</li>
  </ul>
  <p>This plot is useful for determining kinetic parameters and identifying inhibition types.</p>
</div>

{{< /tab >}}
{{< tab name="Questions" >}}
<style>
.spoiler {
  background-color: #000000;
  color: #000;
  cursor: pointer;
  display: inline-block;
  transition: background-color 0.2s ease;
  border-radius: 4px;
  padding: 0 2px;
}
.spoiler.revealed {
  background-color: transparent;
  color: inherit;
}
</style>

<script>
function toggleSpoiler(el) {
  el.classList.toggle('revealed');
}
</script>
Here are some Questions based on previous year questions, and some good ones i made to test both routine basic memorised knowledge.
### Sample Questions

### 1. How do you differentiate between irreversible inhibition and normal non competitive inhibition? assume they achieve same final parameter values.

### 2. What is the difference between ORF and primary structure of a protein? what is the relation between them?

### 3. Isoelectric Point of a Tripeptide

A tripeptide is composed of **Glu‑Arg‑Gly**. The pKa values are:  
α‑COOH (2.1), α‑NH₃⁺ (9.5), R‑group of Glu (4.1), and R‑group of Arg (12.5).  

What is the approximate isoelectric point (pI) of this tripeptide at 25 °C?

A) 4.4  
B) 7.0  
C) 10.5  
D) 12.0  

<details>
<summary>👉 Click to reveal answer & explanation</summary>

**Correct answer: B**

📘 **Explanation:** The pI is the average of the two pKₐ values that bracket the zwitterionic form.  
The tripeptide has four ionizable groups: C‑terminus (pKₐ 2.1), Glu side chain (pKₐ 4.1), N‑terminus (pKₐ 9.5), and Arg side chain (pKₐ 12.5).  
At low pH, all groups are protonated. As pH increases, the C‑terminus deprotonates first (pKₐ 2.1), then the Glu side chain (pKₐ 4.1). At this point the net charge is zero (Arg⁺, N‑terminus⁺, C‑term⁻, Glu side⁻ → +2 –2 = 0).  
Therefore the pI lies between pKₐ 4.1 and pKₐ 9.5, i.e. (4.1 + 9.5)/2 = 6.8 ≈ 7.0.

</details>

---

### 4. The Role of Vitamin B₆ in Amino Acid Metabolism

Pyridoxal phosphate (PLP), the active form of vitamin B₆, is an essential cofactor for many enzymes of amino acid metabolism, including transaminases.  

**What is the unique chemical feature of PLP that allows it to serve as the essential cofactor for transaminases?**

A) PLP functions as a metal‑ion catalyst, stabilising a carbanion intermediate.  
B) PLP forms a high‑energy thioester intermediate with amino acids.  
C) PLP is a strong oxidant, converting amino acids directly into α‑keto acids.  
D) PLP acts as an electron sink, covalently binding the amino group via a Schiff base and stabilising a reaction intermediate.

<details>
<summary>👉 Click to reveal answer & explanation</summary>

**Correct answer: D**

📘 **Explanation:** The aldehyde group of PLP forms a Schiff base (aldimine) with the ε‑amino group of a lysine residue in the enzyme’s active site. Upon substrate binding, the substrate’s amino group replaces the lysine, forming a new Schiff base. The pyridinium ring of PLP acts as an electron sink, stabilising the carbanion intermediate that forms during the reaction – this is key to facilitating the transfer of the amino group. Metal ions, thioesters, and oxidation are not the primary mechanisms of PLP.

</details>

---

### 5. Membrane Protein Extraction

A researcher wants to extract an integral membrane protein from a cell membrane while **preserving its native folded structure** for a functional assay.

**Which of the following is the most appropriate first choice for this purpose?**

A) 1 % SDS (sodium dodecyl sulfate)  
B) 8 M urea  
C) 1 % Triton X‑100 (a non‑ionic detergent)  
D) High salt concentration (2 M NaCl)

<details>
<summary>👉 Click to reveal answer & explanation</summary>

**Correct answer: C**

📘 **Explanation:** Non‑ionic detergents like Triton X‑100 disrupt lipid bilayers by inserting into the membrane, effectively releasing integral proteins without denaturing them. SDS is a strong anionic denaturant. Urea also denatures proteins. High salt is used to elute peripherally associated proteins or to disrupt ionic interactions, but it will not solubilise integral membrane proteins.

</details>
{{< /tab >}}

{{< /tabs >}}
<script>
(function() {
  // Public function to switch tab and scroll
  window.switchToTabAndScroll = function(tabIndex, elementId) {
    // Switch tab
    const tablist = document.querySelector('[role="tablist"]');
    if (tablist) {
      const buttons = tablist.querySelectorAll('[role="tab"]');
      if (buttons[tabIndex]) {
        buttons[tabIndex].click();
      }
    }
    // Scroll to element after a short delay (allow tab content to render)
    setTimeout(function() {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // Handle direct hash links (e.g., manual URL with #zwitterion-definition)
  function handleHashOnLoad() {
    if (window.location.hash) {
      const targetId = window.location.hash.substring(1);
      // Find which tab contains that element and switch automatically
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const tablist = document.querySelector('[role="tablist"]');
        if (tablist) {
          const panels = document.querySelectorAll('[role="tabpanel"]');
          const buttons = tablist.querySelectorAll('[role="tab"]');
          for (let i = 0; i < panels.length; i++) {
            if (panels[i].contains(targetElement)) {
              if (buttons[i]) buttons[i].click();
              setTimeout(() => {
                targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 150);
              break;
            }
          }
        }
      }
    }
  }

  document.addEventListener('DOMContentLoaded', handleHashOnLoad);
})();
</script>

<script>
/* BOGuide Dynamic TOC v3 — rewrites from scratch
   Key fixes vs previous versions:
   1. Panel detection: maps tab button index → panel index, no reliance on [hidden]
   2. Links: onclick-based, activates the right tab then scrolls — no bare href anchors
   3. Change detection: MutationObserver on aria-selected attribute changes, not click events
   4. Works whether Hextra uses display:none, visibility, or [hidden] to hide panels
*/
(function () {
  'use strict';

  var TAB_DELAY = 80; // ms to wait after tab switch before scanning headings

  /* ── slugify ─────────────────────────────────────────────────────────── */
  function slugify(t) {
    return t.toLowerCase().replace(/[^\w\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim();
  }

  /* ── Get the currently active panel by matching button → panel index ─── */
  function getActivePanel() {
    var buttons = Array.from(document.querySelectorAll('[role="tab"]'));
    var panels  = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    if (!buttons.length || !panels.length) return panels[0] || null;

    // Find the selected button
    var idx = buttons.findIndex(function(b) {
      return b.getAttribute('aria-selected') === 'true'
          || b.classList.contains('active')
          || b.getAttribute('data-state') === 'active';
    });
    if (idx === -1) idx = 0;
    return panels[idx] || panels[0] || null;
  }

  /* ── Get or create the TOC nav element ──────────────────────────────── */
  function getTocEl() {
  var el = document.getElementById('boguide-toc');
  if (el) return el;
  el = document.createElement('nav');
  el.id = 'boguide-toc';
  el.style.cssText = [
    'position:fixed',
    'top:72px',
    'right:12px',
    'width:216px',
    'max-height:calc(100vh - 84px)',
    'overflow-y:auto',
    'border-radius:10px',
    'padding:12px 14px 14px',
    'z-index:9999',
    'font-family:inherit',
    'font-size:13px',
    'line-height:1.5',
    'display:none'
  ].join(';');
  document.body.appendChild(el);
  return el;
}

  /* ── Build (or rebuild) the TOC ─────────────────────────────────────── */
  function buildToc() {
    var panel = getActivePanel();
    var tocEl = getTocEl();

    if (!panel) { tocEl.style.display = 'none'; return; }

    // Stamp IDs on every h2/h3 in ALL panels (needed for cross-tab anchor nav)
    document.querySelectorAll('[role="tabpanel"]').forEach(function(p, panelIdx) {
      p.querySelectorAll('h2,h3').forEach(function(h) {
        if (!h.id) h.id = 'bg-' + panelIdx + '-' + slugify(h.textContent);
      });
    });

    var headings = Array.from(panel.querySelectorAll('h2, h3'));
    if (!headings.length) { tocEl.style.display = 'none'; return; }

    // Tab label
    var buttons   = Array.from(document.querySelectorAll('[role="tab"]'));
    var panels    = Array.from(document.querySelectorAll('[role="tabpanel"]'));
    var panelIdx  = panels.indexOf(panel);
    var activeBtn = buttons[panelIdx] || null;
    var tabLabel  = activeBtn ? activeBtn.textContent.trim() : '';

    // Render
    var html = '<p style="font-weight:700;font-size:11px;text-transform:uppercase;'
             + 'letter-spacing:.07em;margin:0 0 6px;color:var(--color-text-secondary,#6b7280)">'
             + 'On this page</p>';
    if (tabLabel) {
      html += '<p style="font-size:11px;color:var(--color-text-secondary,#9ca3af);'
            + 'margin:0 0 8px;padding-bottom:6px;'
            + 'border-bottom:1px solid var(--border-color,#e2e8f0)">'
            + '&#8627; ' + tabLabel + '</p>';
    }
    html += '<ul style="list-style:none;margin:0;padding:0">';
    headings.forEach(function(h) {
      var isH3   = h.tagName === 'H3';
      var indent = isH3 ? 'padding-left:12px' : '';
      var weight = isH3 ? 'normal' : '600';
      var size   = isH3 ? '12px' : '13px';
      var opacity= isH3 ? '.72' : '1';
      var pid    = panelIdx; // captured for onclick closure
      var hid    = h.id;
      html += '<li style="margin:1px 0;' + indent + '">'
           + '<a href="javascript:void(0)"'
           + ' data-panel="' + pid + '" data-hid="' + hid + '"'
           + ' style="display:block;padding:4px 6px;border-radius:5px;'
           + 'font-size:' + size + ';font-weight:' + weight + ';opacity:' + opacity + ';'
           + 'color:inherit;text-decoration:none;cursor:pointer;'
           + 'transition:background .12s,color .12s"'
           + ' onmouseover="this.style.background=\'var(--color-primary-100,rgba(22,163,74,.08))\';this.style.color=\'var(--color-primary-600,#16a34a)\';this.style.opacity=\'1\'"'
           + ' onmouseout="this.style.background=\'\';this.style.color=\'\';this.style.opacity=\'' + opacity + '\'"'
           + ' onclick="boGuideTocNav(this)">'
           + h.textContent.replace(/^[#\s]+/,'').trim()
           + '</a></li>';
    });
    html += '</ul>';
    tocEl.innerHTML = html;
    tocEl.style.display = 'block';
  }

  /* ── TOC link click handler — activate panel then scroll ─────────────── */
  window.boGuideTocNav = function(link) {
    var panelIdx = parseInt(link.getAttribute('data-panel'), 10);
    var hid      = link.getAttribute('data-hid');
    var buttons  = Array.from(document.querySelectorAll('[role="tab"]'));
    var btn      = buttons[panelIdx];

    function scrollToHeading() {
      var el = document.getElementById(hid);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (btn) {
      // Check if this panel is already active
      var alreadyActive = btn.getAttribute('aria-selected') === 'true'
                       || btn.classList.contains('active')
                       || btn.getAttribute('data-state') === 'active';
      if (alreadyActive) {
        scrollToHeading();
      } else {
        btn.click();
        setTimeout(scrollToHeading, 120);
      }
    } else {
      scrollToHeading();
    }
  };

  /* ── Watch for tab changes via MutationObserver on aria-selected ─────── */
  function attachObserver() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;

    // Watch attribute mutations on all tab buttons
    var obs = new MutationObserver(function(mutations) {
      var changed = mutations.some(function(m) {
        return m.type === 'attributes'
            && (m.attributeName === 'aria-selected'
             || m.attributeName === 'class'
             || m.attributeName === 'data-state');
      });
      if (changed) setTimeout(buildToc, TAB_DELAY);
    });

    tablist.querySelectorAll('[role="tab"]').forEach(function(btn) {
      obs.observe(btn, { attributes: true, attributeFilter: ['aria-selected','class','data-state'] });
    });

    // Also observe tablist itself for class changes
    obs.observe(tablist, { attributes: true, subtree: true,
                           attributeFilter: ['aria-selected','class','data-state'] });
  }

  /* ── MathJax re-render on tab switch ─────────────────────────────────── */
  function attachMathJax() {
    var tablist = document.querySelector('[role="tablist"]');
    if (!tablist) return;
    tablist.querySelectorAll('[role="tab"]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        setTimeout(function() {
          if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise();
        }, 150);
      });
    });
  }

  /* ── Init ────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
      buildToc();
      attachObserver();
      attachMathJax();
    }, 400);
  });

})();
</script>
<footer style="margin-top: 4rem; padding: 1rem; text-align: center; border-top: 1px solid #ccc;">
  <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    <img alt="Creative Commons License" style="border-width:0" 
         src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" />
  </a><br />
  <span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">
    BioGuide
  </span> by 
  <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">
    N
  </span> is licensed under a 
  <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
    Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License
  </a>.
</footer>
