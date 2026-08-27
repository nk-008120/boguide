---
title: "Integrated Workflows & Reference"
weight: 3
description: "The four major IBO practical workflow patterns, the complete mathematical toolkit, universal exam traps, year-specific index, self-assessment questions, and study strategy."
difficulty: "advanced"
syllabus_tags: ["IBO", "practical", "biochemistry", "molecular-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

<div class="article-gate-root" id="article-gate-root" data-next="/resources/11-practical-1/integrated-workflows-reference/">

<div class="article-gate-body" id="article-gate-body">

## Integrated Workflows - What You Will Actually Face

IBO practicals rarely test a single technique in isolation. Instead, they build integrated workflows where each step feeds into the next. Here are the four major patterns:

### Workflow A - "Purify, then Quantify, then Assay" (IBO 2018, 2023)

1. **Ni-NTA chromatography** to purify the His-tagged protein from bacterial lysate.
2. **Bradford assay** on the elution fractions to determine protein concentration.
3. **Activity assay** (gel retardation in 2018; colorimetric diaphorase assay in 2023) on the fraction with the highest protein concentration.
4. Calculate **specific activity** (U mg$^{-1}$) = total activity / total protein.

This is the most common workflow pattern. It tests your ability to connect purification to quantification to functional assay.

### Workflow B - "Genotype, then Phenotype, then Pathway" (IBO 2015)

1. **Restriction mapping** or **PCR genotyping** to identify which gene is mutated.
2. **Auxotrophy plate test** to determine which supplement restores growth.
3. **Map the blocked enzymatic step** by combining genotype and phenotype data.

This workflow tests the connection between molecular biology (DNA analysis) and classical genetics (growth phenotypes).

### Workflow C - "Clinical Case, then Enzyme Kinetics, then Inheritance" (IBO 2017)

1. **Haematological indices** (MCV, MCH, MCHC, reticulocyte count) to characterise the anaemia.
2. **Pyruvate kinase kinetic parameters** ($K_M$, $V_{\max}$) to quantify enzyme deficiency.
3. **Pedigree analysis** with genetic markers to determine inheritance pattern.

This workflow is the most integrative - it connects clinical medicine, enzymology, and genetics in a single exam.

### Workflow D - "Modifier Effects on the Active Site" (IBO 2022)

1. Measure **baseline ADH activity**.
2. Pre-incubate the enzyme with a modifier (EDTA or PCMB).
3. Re-assay activity and calculate the **percentage change**.
4. Deduce which amino acid residues and/or cofactors are essential for catalysis.

This workflow tests your ability to interpret inhibition data in terms of protein structure and mechanism.

**Walk through each workflow step by step** -- click through to see data flow between techniques:

{{< iframe src="/practical-workflow-navigator.html" title="IBO Practical Workflow Navigator" height="520px" >}}

---

## Mathematical Toolkit

These are the formulas you need to have memorised cold. They come up in almost every practical exam.

<table>
<thead><tr><th>Quantity</th><th>Formula</th><th>Units</th></tr></thead>
<tbody>
<tr><td>Enzyme activity</td><td>$\dfrac{\Delta A \times V_{\text{total}}}{\varepsilon \times V_{\text{enzyme}} \times \Delta t}$</td><td>U mL<sup>-1</sup></td></tr>
<tr><td>Specific activity</td><td>Activity / [protein]</td><td>U mg<sup>-1</sup></td></tr>
<tr><td>$K_M$</td><td>[S] at $V_{\max}/2$, or from Hanes-Woolf x-intercept</td><td>mM or uM</td></tr>
<tr><td>$k_{\text{cat}}$</td><td>$V_{\max} / [\text{E}]$</td><td>s<sup>-1</sup></td></tr>
<tr><td>MCV</td><td>$\dfrac{\text{Hct (\%)} \times 10}{\text{RBC } (\times 10^{12} \text{ L}^{-1})}$</td><td>fL</td></tr>
<tr><td>MCH</td><td>$\dfrac{\text{Hb (g dL}^{-1}\text{)} \times 10}{\text{RBC}}$</td><td>pg</td></tr>
<tr><td>MCHC</td><td>$\dfrac{\text{Hb}}{\text{Hct}} \times 100$</td><td>g dL<sup>-1</sup></td></tr>
<tr><td>Generation time</td><td>$g = t / n$, where $n = \log_2(N_t / N_0)$</td><td>hours or minutes</td></tr>
<tr><td>SC<sub>50</sub></td><td>Interpolated from SC% vs log[concentration] plot</td><td>mg mL<sup>-1</sup></td></tr>
</tbody>
</table>

---

## Universal Exam Traps (Across All Years)

These are the mistakes that cost students marks every single year. Read them carefully.

1. **Resin or column runs dry** - irreversible damage, no replacement.
2. **Wrong dilution factor** when calculating the original concentration from a diluted sample.
3. **Delta-t in seconds instead of minutes** - this gives an activity value 60-fold too high.
4. **Bubbles in cuvettes or 96-well plates** - scatter light, inflate absorbance.
5. **Light exposure** during Bradford or other photosensitive assays.
6. **Mis-assignment of DNA topology** on agarose gels - supercoiled, open-circular, and linear DNA all migrate differently even at the same molecular weight.
7. **Forgetting controls** - no-enzyme blanks, no-substrate blanks, uncut-DNA controls, no-template PCR controls.
8. **Writing decimal commas instead of points** on computer-read answer sheets (IBO uses Anglo conventions).
9. **Estimating kinetic parameters from non-linear regions** of the progress curve or the Michaelis-Menten plot.
10. **Starting short tasks first** and running out of time for long incubations - always start the longest incubation first.

---

## Year-Specific Reference Index

Each year's practical has its own character. Use this table to jump to the techniques you need to practise.

<table>
<thead><tr><th>Year</th><th>Host</th><th>Focus</th><th>Key techniques</th></tr></thead>
<tbody>
<tr><td>2015</td><td>Aarhus, Denmark</td><td>Molecular biology</td><td>Restriction mapping, PCR genotyping, yeast auxotrophy</td></tr>
<tr><td>2016</td><td>Hanoi, Vietnam</td><td>Biochemistry + microbiology</td><td>IPTG induction, Ni-NTA, SDS-PAGE, gel filtration, DPPH antioxidant, lactic acid fermentation</td></tr>
<tr><td>2017</td><td>Warwick, UK</td><td>Clinical biochemistry</td><td>Haematological indices, PK coupled assay, Michaelis-Menten kinetics, pedigree</td></tr>
<tr><td>2018</td><td>Tehran, Iran</td><td>Protein-DNA interactions</td><td>Ni-NTA, Bradford, gel retardation (EMSA), DNase protection, restriction theory</td></tr>
<tr><td>2022</td><td>Yerevan, Armenia</td><td>Enzymology</td><td>ADH spectrophotometric assay, EDTA/PCMB modifier effects, active-site deductions</td></tr>
<tr><td>2023</td><td>UAE University</td><td>Integrated biochemistry</td><td>Ni-NTA, Bradford, diaphorase colorimetric assay, Michaelis-Menten, k<sub>cat</sub>, expression hosts</td></tr>
</tbody>
</table>

---

## Self-Assessment Questions

Test yourself on these questions. Model answers are provided - try to answer each one before reading the answer.

**1. Why must the Ni-NTA resin never be allowed to run dry?**

<details>
<summary>Model answer</summary>
Drying collapses the resin matrix and irreversibly damages the nickel-binding sites. The column loses all binding capacity and cannot be recovered.
</details>

**2. A student obtains A595 = 0.35 for a 1.5-fold diluted eluate. From the standard curve, this corresponds to 0.22 mg/mL. What is the original concentration?**

<details>
<summary>Model answer</summary>
0.22 x 1.5 = 0.33 mg/mL. Forgetting the dilution factor is the most common Bradford assay mistake.
</details>

**3. Calculate the ADH activity if delta-A = 0.45 over 1.5 min, V1 = 3.0 mL, V2 = 0.1 mL.**

<details>
<summary>Model answer</summary>

$$\frac{0.45 \times 3.0}{6.22 \times 0.1 \times 1.5} \approx 1.45 \text{ U mL}^{-1}$$

</details>

**4. Why does EDTA inhibit yeast ADH more strongly than PCMB?**

<details>
<summary>Model answer</summary>
EDTA removes the essential catalytic Zn2+ completely, collapsing the active-site structure. PCMB modifies only a subset of the cysteine residues (or does so incompletely under the assay conditions), so residual activity remains.
</details>

**5. Why is LDH added in large excess in the PK coupled assay?**

<details>
<summary>Model answer</summary>
To ensure the LDH step is never rate-limiting. The observed rate must reflect only PK activity, so the coupling enzyme must convert pyruvate to lactate as fast as it is produced.
</details>

**6. Calculate MCV for a patient with Hct = 36%, RBC count = 4.0 x 10^12 /L.**

<details>
<summary>Model answer</summary>
MCV = (36 x 10) / 4.0 = 90 fL. This is within the normal range (normocytic).
</details>

**7. Why do mature red blood cells depend so heavily on PK activity?**

<details>
<summary>Model answer</summary>
Mature RBCs lack mitochondria and cannot perform oxidative phosphorylation. Glycolysis is their sole ATP source, and PK catalyses the final ATP-generating step.
</details>

**8. A yeast mutant grows on minimal + Tyr + Phe but not on minimal + Trp. Which gene is most likely mutated?**

<details>
<summary>Model answer</summary>
ARO7, the branch-point enzyme after chorismate that leads to the Tyr/Phe branch. The Trp branch (via TRP5) is unaffected, which is why Trp supplementation does not help.
</details>

**9. What would you expect on the gel if Pep protein completely protects plasmid DNA from DNase?**

<details>
<summary>Model answer</summary>
The Pep + DNase lane shows the same retarded bands as the Pep-only lane, while the DNase-only lane shows a degradation smear or loss of bands. Protection = preservation of intact DNA-protein complex.
</details>

**10. Why is the same wavelength (595 nm) used for both the Bradford assay and the diaphorase/NBT assay?**

<details>
<summary>Model answer</summary>
Coincidence. The Coomassie-protein complex and the reduced NBT formazan both happen to absorb maximally at 595 nm. They are chemically unrelated.
</details>

---

## Final Study Strategy

1. **Master the foundation layer** first - pipetting, Beer-Lambert, time management. These are not glamorous, but they are the difference between clean data and noise.
2. **Learn one technique per day** from the bottom up: first principles, then protocol, then traps.
3. **Practise the integrated workflows** under timed conditions. Set a 90-minute timer and work through a complete past practical from start to finish.
4. **Do the self-assessment questions** - all of them, not just the easy ones.
5. **Re-draw every standard curve and Michaelis-Menten plot** from memory. If you can sketch the expected shape and label the axes correctly, you understand the technique.
6. **Teach the technique to a peer.** If you can explain the "why" behind each step, you own it.

---

## Static Reference Images

*Images to be added: flowchart of the four integrated workflows (A through D), IBO practical lab bench photograph.*

</div>

<div class="article-gate-cta" id="article-gate-cta" hidden>
  <p>Log in to keep reading - free, and takes a few seconds.</p>
  <a class="papers-nav-btn papers-nav-next" id="article-gate-cta-link" href="/account/">Log in to keep reading</a>
</div>

</div>

<script src="/js/papers-article-gate.js" defer></script>
