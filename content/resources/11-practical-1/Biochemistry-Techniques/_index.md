---
title: "Biochemistry Techniques"
weight: 2
description: "Ni-NTA affinity chromatography, Bradford protein assay, continuous enzyme assays (ADH, pyruvate kinase, diaphorase), SDS-PAGE, DPPH antioxidant assays, fermentation kinetics, haematological indices, and chromatography theory."
difficulty: "advanced"
syllabus_tags: ["IBO", "practical", "biochemistry"]
---

{{< topic-meta >}}
{{< mathjax >}}

<div class="article-gate-root" id="article-gate-root" data-next="/resources/11-practical-1/biochemistry-techniques/">

<div class="article-gate-body" id="article-gate-body">

## Affinity Chromatography (Ni-NTA / His-tag)

**Why it works (first principles)**

This is arguably the single most important protein purification technique in IBO practicals - it appeared in 2016, 2018, and 2023. The principle is molecular recognition: six consecutive histidine residues (the "His-tag") at one end of the protein coordinate Ni2+ ions that are immobilised on the chromatography resin (NTA = nitrilotriacetic acid). Because most native *E. coli* proteins lack stretches of histidine, only the His-tagged target protein binds tightly.

Contaminant proteins are washed away with a low-imidazole wash buffer. The target is then released ("eluted") with a high-imidazole buffer - imidazole has an imidazole ring structurally similar to histidine's side chain, so it competes for the nickel binding sites and displaces the protein.

![The His-tag's consecutive histidine residues coordinating a Ni2+ ion held by the NTA resin, with imidazole competing for the same binding site](/PRACTICAL1PICS/his-tag-ni-nta-binding.jpg)

**Workflow (IBO style)**

1. **Equilibrate** the column with lysis buffer - this removes storage ethanol and conditions the resin.
2. **Load** clarified bacterial lysate onto the column.
3. **Wash** extensively with wash buffer (low imidazole or standard lysis buffer) to remove contaminants.
4. **Elute** with elution buffer into successive fractions (usually 2-3 tubes).
5. **Never let the resin run dry.** This is the single most important rule. A dry resin collapses irreversibly and loses all binding capacity.

![The Ni-NTA workflow: equilibrate, load lysate, wash away contaminants, then elute the purified His-tagged protein with imidazole](/PRACTICAL1PICS/ni-nta-column-workflow.png)

**Exam traps**

- Letting the resin dry between steps (catastrophic - irreversible).
- Incomplete washing - contaminated elution fractions.
- Collecting elution drops into the wrong tubes.
- Adding buffers too roughly, which disturbs the resin bed and reduces separation quality.

---

## Bradford Protein Assay

**Why it works (first principles)**

Coomassie Brilliant Blue G-250 exists in three colour forms depending on its protonation state. The anionic (blue) form binds to basic and aromatic amino acid residues in proteins, and this binding stabilises the blue form, shifting the absorbance maximum to 595 nm. The more protein present, the more dye shifts to the blue form, and the higher the A595.

![Bradford reagent showing the visible colour gradient from brown (low protein) to deep blue (high protein) across a standard series](/PRACTICAL1PICS/bradford-color-gradient.png)

**Workflow**

1. Prepare a BSA standard series (typically 0-0.6 mg/mL in 7 tubes).
2. Dilute your unknown samples into the linear range of the assay.
3. Add Bradford reagent to each standard and unknown, incubate 5 minutes in the dark.
4. Read absorbance at 595 nm.
5. Plot A595 vs [BSA] for the standards, draw the best-fit line through the linear portion.
6. Interpolate the unknowns from the standard curve.
7. **Multiply by the dilution factor** to get the original concentration.

**Typical BSA standard series (IBO 2018 and 2023)**:

<table>
<thead><tr><th>Tube</th><th>BSA 1 mg/mL (uL)</th><th>Buffer (uL)</th><th>[BSA] (mg/mL)</th></tr></thead>
<tbody>
<tr><td>Blank</td><td>0</td><td>200</td><td>0.0</td></tr>
<tr><td>1</td><td>20</td><td>180</td><td>0.1</td></tr>
<tr><td>2</td><td>40</td><td>160</td><td>0.2</td></tr>
<tr><td>3</td><td>60</td><td>140</td><td>0.3</td></tr>
<tr><td>4</td><td>80</td><td>120</td><td>0.4</td></tr>
<tr><td>5</td><td>100</td><td>100</td><td>0.5</td></tr>
<tr><td>6</td><td>120</td><td>80</td><td>0.6</td></tr>
</tbody>
</table>

The Bradford assay appeared in the 2018 and 2023 IBO exams, both times as part of the "Purify then Quantify then Assay" integrated workflow.

**Exam traps**

- Bubbles in microplate wells scatter light and inflate absorbance readings.
- Light exposure during the 5-minute incubation degrades the dye-protein complex.
- Using the non-linear high-concentration region of the standard curve for interpolation.
- **The most common mistake**: forgetting the dilution factor when back-calculating the original protein concentration.

**Plot your own standard curve** -- enter BSA concentrations and absorbance values, then interpolate unknowns:

{{< iframe src="/bradford-standard-curve.html" title="Bradford Standard Curve Interpolator" height="720px" >}}

**Need to calculate dilution volumes?** Use this quick calculator:

{{< iframe src="/dilution-calculator.html" title="Dilution Calculator" height="420px" >}}

{{< callout type="info" emoji="🧪" >}}
Want to run a colorimetric assay yourself, on real samples, and log a result? [BiOLab](/biolab/) is BiOGuide's protocol archive — its baseline protocol uses the same absorbance-at-a-fixed-wavelength logic as Bradford, just with a different reagent and readout.
{{< /callout >}}

---

## Continuous Enzyme Assays

**Why they work (first principles)**

In a continuous assay, you follow the appearance or disappearance of a chromophore in real time. The most common chromophore in IBO practicals is NADH (absorbs at 340 nm). As the enzymatic reaction proceeds, NADH is either produced (in oxidation reactions, like ADH) or consumed (in coupled assays, like PK/LDH), and the absorbance changes proportionally.

The initial rate (the linear portion of the progress curve) gives you $v_0$, the velocity at the starting substrate concentration. By varying [S] and measuring $v_0$ at each concentration, you build a Michaelis-Menten curve and extract $K_M$ and $V_{\max}$.

![The classic Michaelis-Menten hyperbola: v0 rises steeply at low [S] then plateaus toward Vmax, with Km marking the [S] at half-maximal velocity](/PRACTICAL1PICS/michaelis-menten-curve.jpg)

**General workflow**

1. Prepare a master mix containing buffer, cofactors, and any coupling enzymes.
2. Add substrate (or enzyme) last to start the reaction.
3. Record absorbance at short intervals (every 15-30 seconds).
4. Plot A vs time, identify the linear region, and calculate the slope (= initial rate).
5. Convert the slope to velocity using Beer-Lambert:

{{< eqbox >}}
$$v_0 = \frac{\Delta A / \Delta t}{\varepsilon \times l} \times V_{\text{total}}$$
{{< /eqbox >}}

6. Vary [S] and repeat to generate a Michaelis-Menten plot.
7. Extract $K_M$ (the [S] at half-$V_{\max}$) and $V_{\max}$ either graphically or via linear transformation (Hanes-Woolf: plot [S]/$v_0$ vs [S]; slope = 1/$V_{\max}$, x-intercept = $-K_M$).

### ADH Assay (IBO 2022)

Alcohol dehydrogenase catalyses:

{{< eqbox >}}
$$\text{Ethanol} + \text{NAD}^+ \rightleftharpoons \text{Acetaldehyde} + \text{NADH} + \text{H}^+$$
{{< /eqbox >}}

The increase in A340 directly reports NADH production and hence ADH activity.

**Activity formula (from the 2022 exam)**:

{{< eqbox >}}
$$\text{ADH (U mL}^{-1}\text{)} = \frac{\Delta A \times V_1}{6.22 \times V_2 \times \Delta t}$$
{{< /eqbox >}}

where $V_1$ = total assay volume (3.0 mL), $V_2$ = volume of enzyme added (0.1 mL), and $\Delta t$ is in **minutes**.

The 2022 exam also tested **active-site modifier effects**: students pre-incubated ADH with EDTA (a metal chelator that strips out the essential Zn2+ cofactor) or PCMB (p-chloromercuribenzoate, which covalently modifies cysteine -SH groups). The results allowed students to deduce which residues and cofactors are essential for catalysis:

<table>
<thead><tr><th>Modifier</th><th>Target</th><th>Expected effect</th></tr></thead>
<tbody>
<tr><td>EDTA</td><td>Chelates Zn<sup>2+</sup></td><td>Strong inhibition (~57% decrease)</td></tr>
<tr><td>PCMB</td><td>Modifies cysteine -SH</td><td>Moderate inhibition (~34% decrease)</td></tr>
</tbody>
</table>

This tells you that yeast ADH requires both Zn2+ (for substrate polarisation and transition-state stabilisation) and cysteine residues (which coordinate the zinc and participate in catalysis).

**Calculate enzyme activity from your data** -- includes Beer-Lambert conversion and common-mistake warnings:

{{< iframe src="/enzyme-activity-calculator.html" title="Enzyme Activity Calculator" height="780px" >}}

### Pyruvate Kinase Coupled Assay (IBO 2017)

Pyruvate kinase catalyses:

{{< eqbox >}}
$$\text{PEP} + \text{ADP} \xrightarrow{\text{PK}} \text{Pyruvate} + \text{ATP}$$
{{< /eqbox >}}

Neither substrate nor product absorbs distinctively, so the assay is **coupled** to lactate dehydrogenase (LDH), which is added in large excess:

{{< eqbox >}}
$$\text{Pyruvate} + \text{NADH} \xrightarrow{\text{LDH}} \text{Lactate} + \text{NAD}^+$$
{{< /eqbox >}}

The decrease in A340 is stoichiometric with PEP consumption, because excess LDH ensures that the LDH step is never rate-limiting - the observed rate reflects only PK activity.

The 2017 exam embedded this kinetics work in a clinical context: a family with suspected pyruvate kinase deficiency (PKD), the most common cause of hereditary non-spherocytic haemolytic anaemia. Students calculated haematological indices (MCV, MCH, MCHC) from blood data, determined PK kinetic parameters, and connected the biochemistry to a pedigree analysis.

**Why PKD causes anaemia**: mature red blood cells lack mitochondria and depend entirely on glycolysis for ATP. PK is the final, irreversible step of glycolysis. Reduced PK activity means reduced ATP, which means RBCs cannot maintain their membrane integrity and are destroyed prematurely (haemolysis).

### Diaphorase Assay (IBO 2023)

Diaphorase is a flavoprotein (contains FAD and iron-sulfur centres, MW ~23 kDa) that catalyses:

{{< eqbox >}}
$$\text{NADH} + \text{H}^+ + \text{NBT} \rightarrow \text{NAD}^+ + \text{NBT formazan (purple)}$$
{{< /eqbox >}}

The reduced NBT formazan absorbs at 595 nm - the same wavelength as the Bradford assay, which is a coincidence but can cause confusion if you mix up your plates.

The 2023 exam combined Ni-NTA purification, Bradford quantification, and diaphorase kinetics into a single integrated practical, culminating in $V_{\max}$ and $k_{\text{cat}}$ calculations.

**Worked example from the 2023 official key**:

Given: at [S] = 20 uM, observed activity = 6500 umol min$^{-1}$ mg$^{-1}$; $K_M$ = 10 uM.

{{< eqbox >}}
$$V_0 = V_{\max} \cdot \frac{[\text{S}]}{K_M + [\text{S}]} \implies 6500 = V_{\max} \cdot \frac{20}{10 + 20} \implies V_{\max} = 9750 \text{ umol min}^{-1}\text{ mg}^{-1}$$
{{< /eqbox >}}

**Plot your own kinetics data** -- enter [S] and v0 values, fit the Michaelis-Menten curve, and toggle a Hanes-Woolf linearisation:

{{< iframe src="/mm-kinetics-explorer.html" title="Michaelis-Menten Kinetics Explorer" height="780px" >}}

---

## SDS-PAGE

**Why it works (first principles)**

SDS (sodium dodecyl sulfate) is a detergent that denatures proteins and coats them with negative charge proportional to their length. This means all SDS-coated proteins have roughly the same charge-to-mass ratio, so separation in the polyacrylamide gel is purely by size: smaller proteins migrate faster.

After electrophoresis, the gel is stained (usually Coomassie Blue) so bands become visible. Molecular weight is estimated by comparing the migration distance (Rf = distance protein / distance dye front) to a standard ladder.

![An SDS-PAGE gel diagram with a protein ladder lane alongside sample lanes, bands resolved by molecular weight](/MCBBPICS/sds-page-gel-diagram.jpg)

SDS-PAGE appeared in the 2016 IBO exam as part of a protein expression and purification workflow, where students had to:

- Calculate loading volumes to achieve a target cell concentration per lane
- Load samples in the correct order
- Estimate molecular weights from the gel using a log(MW) vs Rf calibration plot
- Interpret gel-filtration chromatography data to determine whether the purified proteins form homo- or hetero-oligomers

**Exam traps**

- Incorrect loading-volume calculations (forgetting dilution factors).
- Damaging the gel while opening the cassette.
- Plotting Rf incorrectly.
- Confusing gel-filtration retention time (larger = earlier elution) with molecular weight.

---

## Antioxidant Assays (DPPH)

The 2016 exam included a DPPH radical-scavenging assay. DPPH is a stable free radical with a deep purple colour ($\lambda_{\max}$ = 517 nm). When an antioxidant donates an electron or hydrogen atom, DPPH is reduced to colourless DPPH-H, and the absorbance drops.

![A microplate showing the DPPH colour change from deep purple to pale yellow as antioxidant concentration increases across the wells](/PRACTICAL1PICS/dpph-color-change.jpg)

The key metric is **SC50**: the concentration of antioxidant that scavenges 50% of the DPPH radicals. Lower SC50 = stronger antioxidant.

{{< eqbox >}}
$$\text{SC\%} = \frac{A_{\text{control}} - A_{\text{sample}}}{A_{\text{control}}} \times 100$$
{{< /eqbox >}}

Plot SC% vs log(concentration), interpolate to find the concentration at SC% = 50.

**Exam trap**: a very common mistake is claiming that a higher SC50 means a stronger antioxidant - it is the opposite.

---

## Fermentation Kinetics

Also from the 2016 exam: a homolactic *Lactobacillus* strain is grown in MRS medium. Growth is tracked by OD600, and lactic acid production is quantified by acid-base titration with 0.1 M NaOH.

![A lactic acid fermentation setup: inoculated MRS broth in flasks or tubes, sampled over time for OD600 and titratable acidity](/PRACTICAL1PICS/fermentation-setup.png)

**Key formulas**:

Generation time during exponential growth:

{{< eqbox >}}
$$g = \frac{t}{n} \quad \text{where} \quad n = \frac{\log N_t - \log N_0}{\log 2}$$
{{< /eqbox >}}

Lactic acid from titration (1 mol lactic acid reacts with 1 mol NaOH; MW lactic acid = 90 g/mol, MW NaOH = 40 g/mol):

{{< eqbox >}}
$$[\text{Lactic acid}] = \frac{V_{\text{NaOH}} \times C_{\text{NaOH}} \times 90}{V_{\text{sample}}} \quad \text{g L}^{-1}$$
{{< /eqbox >}}

**Exam traps**: uncalibrated pH electrode, stir bar striking the electrode, endpoint missed (pH outside 6.95-7.05), forgetting dilution factor.

---

## Haematological Indices

The 2017 exam required calculation and interpretation of blood indices. These formulas come up whenever the practical has a clinical-case component.

![Blood smear comparison: normal-sized, well-haemoglobinised red cells alongside microcytic hypochromic cells and macrocytic cells from different anaemia types](/PRACTICAL1PICS/blood-smear-comparison.jpg)

{{< eqbox >}}
$$\text{MCV (fL)} = \frac{\text{Hct (\%)} \times 10}{\text{RBC count } (\times 10^{12} \text{ L}^{-1})}$$
{{< /eqbox >}}

{{< eqbox >}}
$$\text{MCH (pg)} = \frac{\text{Hb (g dL}^{-1}\text{)} \times 10}{\text{RBC count } (\times 10^{12} \text{ L}^{-1})}$$
{{< /eqbox >}}

{{< eqbox >}}
$$\text{MCHC (g dL}^{-1}\text{)} = \frac{\text{Hb (g dL}^{-1}\text{)}}{\text{Hct (\%)}} \times 100$$
{{< /eqbox >}}

**Classification**:

<table>
<thead><tr><th>MCV</th><th>Classification</th><th>Typical MCHC</th></tr></thead>
<tbody>
<tr><td>Normal (78-95 fL)</td><td>Normocytic</td><td>Normochromic</td></tr>
<tr><td>Increased</td><td>Macrocytic</td><td>Normochromic</td></tr>
<tr><td>Decreased</td><td>Microcytic</td><td>Often hypochromic</td></tr>
</tbody>
</table>

In PKD, the typical pattern is normocytic/normochromic anaemia with elevated reticulocytes (the bone marrow compensating by releasing immature RBCs).

**Compute blood indices from CBC data** -- includes IBO 2017 exam presets and automatic anaemia classification:

{{< iframe src="/haematological-index-calculator.html" title="Haematological Index Calculator" height="620px" >}}

---

## Chromatography and Electrophoresis Theory

The 2023 exam included True/False questions about ion-exchange and size-exclusion chromatography that required conceptual understanding, not just recall.

**Ion-exchange chromatography**: proteins bind based on net charge, which depends on the relationship between the protein's isoelectric point (pI) and the buffer pH. At pH > pI, the protein is negatively charged and binds an anion exchanger (like DEAE-Sepharose). At pH < pI, the protein is positively charged and binds a cation exchanger. Elution is by increasing salt (ionic strength competition) or changing pH.

**Size-exclusion (gel-filtration) chromatography**: smaller proteins enter the pores of the beads and take a longer path through the column, so they elute later. Larger proteins (or complexes) are excluded from the pores and elute earlier. A calibration curve of log(MW) vs elution volume allows estimation of the native molecular weight and hence the oligomeric state.

**Key principle**: in gel filtration, larger = earlier elution. In SDS-PAGE, larger = slower migration. These are opposite directions and easy to confuse.

---

## E. coli Expression Strain Selection

The 2023 exam tested knowledge of specialised *E. coli* strains for recombinant protein expression:

<table>
<thead><tr><th>Problem</th><th>Best strain</th><th>Why</th></tr></thead>
<tbody>
<tr><td>Disulfide bonds needed (e.g. insulin)</td><td>Origami</td><td>Promotes disulfide-bond formation in the reducing cytosol</td></tr>
<tr><td>Toxic membrane protein (e.g. Gasdermin D)</td><td>C43 or C41 (Walker strains)</td><td>Engineered to tolerate membrane-toxic proteins</td></tr>
<tr><td>Membrane transporter (e.g. Glut1)</td><td>C41</td><td>Optimised for membrane-protein expression</td></tr>
<tr><td>High beta-sheet content (aggregation-prone)</td><td>SoluBL21</td><td>Promotes soluble expression of aggregation-prone proteins</td></tr>
</tbody>
</table>


</div>

<div class="article-gate-cta" id="article-gate-cta" hidden>
  <p>Log in to keep reading - free, and takes a few seconds.</p>
  <a class="papers-nav-btn papers-nav-next" id="article-gate-cta-link" href="/account/">Log in to keep reading</a>
</div>

</div>

<script src="/js/papers-article-gate.js" defer></script>
