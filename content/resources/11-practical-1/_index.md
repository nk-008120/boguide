---
title: "P1 - Molecular Biology & Biochemistry Practicals"
weight: 1
description: "A unified, bottom-up guide to every major wet-lab technique tested in IBO Molecular Biology and Biochemistry practical exams (2015-2023 and beyond): restriction mapping, PCR genotyping, auxotrophy, Ni-NTA chromatography, Bradford assay, enzyme kinetics, SDS-PAGE, gel retardation, and the integrated workflows that tie them together."
difficulty: "advanced"
prerequisites: ["Enzyme Kinetics & Regulation", "Recombinant DNA & Biotechnology"]
syllabus_tags: ["IBO", "practical", "biochemistry", "molecular-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

<div class="article-gate-root" id="article-gate-root" data-next="/resources/11-practical-1/">

<div class="article-gate-body" id="article-gate-body">

## Overview

This is the single master reference for every major wet-lab technique you will meet in IBO Molecular Biology and Biochemistry practical exams. It is not a protocol list -- it is an attempt to explain every technique from the ground up: why does it work, how is it performed under exam conditions, what goes wrong, and how do the pieces fit together?

IBO practicals are never about memorising a protocol. They test whether you understand four things:

1. **Molecular recognition** - enzyme-substrate, protein-DNA, His-tag-Ni2+, antibody-antigen
2. **Physical separation** - by size, charge, affinity, or hydrophobicity
3. **Quantitative detection** - absorbance, fluorescence, colony count
4. **Biological consequence** - growth, phenotype, pathway flux
5. **Actual Practical relevance**
Every technique below is built from these four pillars. If you understand all four, you can walk into any practical exam and figure out what to do, even if you have never seen the exact protocol before.

---

## Core Laboratory Skills (The Foundation Layer)

These are the basic motor skills and conceptual tools that underpin every technique in this section. Master these first.

### Accurate Pipetting

Why it matters: a 5% volume error translates into 5-25% error in concentration or activity, and in a 90-minute exam with no replacement materials, one sloppy pipetting step can ruin the whole practical.

How to do it right:

- Keep the pipette vertical. Slanting might introduce inaccuracies.
- Pre-wet the tip 2-3 times for viscous or volatile liquids.
- Immerse the tip 2-4 mm only - deeper causes liquid to coat the outside.
- Depress to the first stop, release slowly to aspirate, then dispense by pressing to the second stop.
- Never reverse-pipette unless the protocol explicitly says so.
- Always use the correct pipette range: a P200 (20-200 uL) set to 5 uL will give terrible accuracy.
- In Molecular Biology practicals, remember to freuquently change tips! Contamination just for saving a little time can ruin the whole practical.
- Always do dilutions in the most time-efficient manner. This may happen in 2 ways:
  1. Use same solution (Most often used): Different Volumes of same solution added. Advantage - No tip change time waste, Disadvantage - Rotate the know repeatedly.
  2. Use different solutions but same volume: Tip has to be changed frequently, more often time consuming.<br>
*Determine which combination of these 2 ways gives you the most time-efficient dilutions.*

**Common exam trap**: Using the wrong pipette range, or failing to change tips between solutions.

![Correct micropipette technique -- vertical grip, controlled tip immersion depth, and the first/second stop plunger positions](/PRACTICAL1PICS/micropipette-technique.png)

### Spectrophotometry at 340 nm and 595 nm

Two wavelengths dominate IBO practicals:

<table>
<thead><tr><th>Wavelength</th><th>What absorbs</th><th>Typical use</th></tr></thead>
<tbody>
<tr><td>340 nm</td><td>NADH / NADPH</td><td>Dehydrogenase and kinase assays (ADH, pyruvate kinase, diaphorase)</td></tr>
<tr><td>595 nm</td><td>Coomassie-protein complex <strong>or</strong> reduced NBT formazan</td><td>Bradford protein assay <strong>or</strong> diaphorase/NBT assay</td></tr>
</tbody>
</table>

But there are quite frequently a lot of practicals which use various spectra.

![A spectrophotometer with a cuvette holder, used to measure absorbance at a chosen wavelength](/PRACTICAL1PICS/spectrophotometer-cuvette.jpg)

The quantitative backbone of spectrophotometry is the Beer-Lambert law:

{{< eqbox >}}
$$A = \varepsilon \cdot c \cdot l$$
{{< /eqbox >}}

![Beer-Lambert law: incident light I0 passes through a path length l of a solution at concentration c, emerging as transmitted light I](/PRACTICAL1PICS/beer-lambert-diagram.jpg)

where A is absorbance (dimensionless), $\varepsilon$ is the molar extinction coefficient, c is the concentration, and l is the path length (usually 1 cm).

Key extinction coefficients to memorise:

- $\varepsilon_{\text{NADH}}$ = 6.22 mM$^{-1}$ cm$^{-1}$ at 340 nm
- $\varepsilon_{\text{NBT formazan}}$ = 12.3 mM$^{-1}$ cm$^{-1}$ at 595 nm (exam-specific)

**Common exam trap**: Forgetting to blank the spectrophotometer with the correct control mixture. Also, touching the optical faces of the cuvette with your fingers.

### Time Management in Parallel Assays

Most IBO practicals force you to run multiple experiments simultaneously - restriction digests while PCR cycles, enzyme assays while chromatography fractions drip. The golden rule: **start the longest incubation first**, then fill the waiting time with shorter tasks or theory questions.

For example, in the <a href="https://www.ibo-info.org/files/downloads/papers/2015%20Denmark/IBO%202015_Practical%20Exam%202_Molecular%20Biology.pdf">2015</a> (90 minutes, 3 parts), students who started the 15-minute restriction digest and the PCR cycling first had time to answer the auxotrophy questions while waiting. Students who started with the auxotrophy observations ran out of time for the gel.

---

## The Techniques

The techniques are split across two pages to keep things navigable. The third page covers how the techniques combine into real exam workflows, the formulas you need to memorise, and self-assessment questions.

{{< cards cols="1" >}}
  {{< card link="molecular-biology-techniques/" title="Molecular Biology Techniques" subtitle="Restriction enzyme digestion and mapping, PCR-based genotyping, agarose gel electrophoresis and EMSA, auxotrophy testing and biosynthetic pathway mapping." tag="DNA side" tagColor="blue" >}}
  {{< card link="biochemistry-techniques/" title="Biochemistry Techniques" subtitle="Ni-NTA affinity chromatography, Bradford protein assay, continuous enzyme assays (ADH, PK, diaphorase), SDS-PAGE, DPPH antioxidant assays, fermentation kinetics, haematological indices, chromatography theory, and E. coli expression strains." tag="Protein side" tagColor="purple" >}}
  {{< card link="integrated-workflows-reference/" title="Integrated Workflows & Reference" subtitle="The four major IBO workflow patterns, mathematical toolkit, universal exam traps, year-specific index, 10 self-assessment questions with model answers, and study strategy." tag="Putting it together" tagColor="green" >}}
{{< /cards >}}

</div>

<div class="article-gate-cta" id="article-gate-cta" hidden>
  <p>Log in to keep reading - free, and takes a few seconds.</p>
  <a class="papers-nav-btn papers-nav-next" id="article-gate-cta-link" href="/account/">Log in to keep reading</a>
</div>

</div>

<script src="/js/papers-article-gate.js" defer></script>
