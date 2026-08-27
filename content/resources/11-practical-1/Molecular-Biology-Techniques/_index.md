---
title: "Molecular Biology Techniques"
weight: 1
description: "Restriction enzyme digestion and mapping, PCR-based genotyping, agarose gel electrophoresis, EMSA, and auxotrophy testing - the DNA-side techniques tested in IBO practicals."
difficulty: "advanced"
syllabus_tags: ["IBO", "practical", "molecular-biology"]
---

{{< topic-meta >}}
{{< mathjax >}}

<div class="article-gate-root" id="article-gate-root" data-next="/resources/11-practical-1/molecular-biology-techniques/">

<div class="article-gate-body" id="article-gate-body">

## Restriction Enzyme Digestion and Mapping

**Why it works (first principles)**

Restriction endonucleases recognise short, usually palindromic DNA sequences and cut the phosphodiester backbone at specific positions. The specificity comes from hydrogen bonding and shape complementarity between the enzyme's active site and the DNA sequence. Each enzyme requires specific buffer conditions (salt concentration, pH, Mg2+), and wrong buffer leads to either no activity or "star activity" - cutting at non-canonical sites.

![EcoRI recognising its palindromic recognition site GAATTC and cutting between the G and A on each strand](/PRACTICAL1PICS/restriction-palindrome.jpg)

The pattern of fragment sizes produced by a given enzyme on a given plasmid is a unique fingerprint. If you know the restriction map (the positions of all cut sites), you can predict the fragments. If you are given the fragments (from a gel), you can reconstruct the map.

**How it is performed (IBO style)**

1. Mix DNA + appropriate buffer + restriction enzyme(s) in a small reaction volume (typically 10 uL).
2. Incubate at the enzyme's optimal temperature (37 degC for most, 25 degC for some like SmaI and ApaI).
3. Stop the reaction (heat or EDTA addition).
4. Separate fragments on an agarose gel with a DNA ladder.
5. Compare fragment sizes to the predicted patterns from candidate maps.

**Controls matter.** Always run an uncut control alongside each digest. Uncut circular plasmid migrates as a mixture of supercoiled (fast) and open-circular (slow) forms - if your digest lane looks the same as your uncut lane, your enzyme did not work.

![A real agarose gel under UV light, showing a DNA ladder lane and restriction digest lanes with orange-glowing bands](/PRACTICAL1PICS/agarose-gel-ladder-digest.jpg)

**Critical design decisions (IBO 2015 example)**

The 2015 exam gave students four possible plasmids (pX, pX:alb, pZ, pZ:alb, ranging from 3 to 5 kb) and three available enzymes (ApaI, EcoRI, SmaI). Students had to choose which enzyme would best distinguish among the candidates. The key was selecting an enzyme that produces fragments all larger than ~100 bp (smaller fragments are hard to see and hard to size accurately) and that gives a unique pattern for each plasmid.

**Available enzymes and their buffer compatibilities (IBO 2015)**:

<table>
<thead><tr><th>Enzyme</th><th>Buffer 1</th><th>Buffer 2</th><th>Buffer 3</th><th>Optimal temp</th></tr></thead>
<tbody>
<tr><td>ApaI</td><td>25%</td><td>50%</td><td><strong>100%</strong></td><td>25 degC</td></tr>
<tr><td>EcoRI</td><td>10%</td><td><strong>100%</strong></td><td>10%</td><td>37 degC</td></tr>
<tr><td>SmaI</td><td>0%</td><td>0%</td><td><strong>100%</strong></td><td>25 degC</td></tr>
</tbody>
</table>

**Exam traps**

- Forgetting that double digests need buffers compatible with both enzymes.
- Mis-reading partial digests as complete digests.
- Confusing linear, supercoiled, and open-circular forms on the gel (they migrate differently even at the same molecular weight).
- Choosing an enzyme that cannot distinguish between the candidate plasmids.
- Using a buffer in which the enzyme has 0-10% activity.

**Try it yourself** -- enter restriction enzyme cut sites on a circular plasmid and see the predicted fragment sizes:

{{< iframe src="/restriction-map-builder.html" title="Restriction Map Builder" height="680px" >}}

---

## PCR-Based Genotyping

**Why it works (first principles)**

PCR exponentially amplifies a defined DNA segment using two flanking primers. If a mutation involves an insertion or deletion (or the presence/absence of a selectable marker like a KanR cassette), the amplicon size changes. Wild-type and mutant alleles therefore give different bands on a gel, and you can determine genotype by inspection.

**Practical workflow**

1. Choose primer pairs that flank the variable region.
2. Prepare master mix: buffer, dNTPs, DNA polymerase, primers.
3. Add template DNA last (colony lysate, genomic DNA, or plasmid).
4. Run the thermal cycling programme (denature, anneal, extend - repeat 25-35 cycles).
5. Separate the products on an agarose gel alongside a ladder.

![The three-step PCR thermal cycle: denaturation, primer annealing, and extension, repeated over 25-35 cycles](/PRACTICAL1PICS/pcr-thermal-cycling.png)

**Primer design logic**

In the 2015 IBO exam, five primer pairs were provided, each targeting a different gene in the aromatic amino acid biosynthetic pathway of yeast:

<table>
<thead><tr><th>Primer pair</th><th>Gene</th><th>WT size</th><th>Mutant size</th></tr></thead>
<tbody>
<tr><td>A</td><td><em>TYR1</em></td><td>500 bp</td><td>400 bp</td></tr>
<tr><td>B</td><td><em>PHA2</em></td><td>500 bp</td><td>250 bp</td></tr>
<tr><td>C</td><td><em>ARO7</em></td><td>500 bp</td><td>300 bp</td></tr>
<tr><td>D</td><td><em>TRP5</em></td><td>500 bp</td><td>350 bp</td></tr>
<tr><td>E</td><td><em>ARO2</em></td><td>500 bp</td><td>300 bp</td></tr>
</tbody>
</table>

Students had to choose two primer pairs and deduce which gene was mutated based on band sizes. The intellectual challenge was not the PCR itself but understanding the pathway well enough to choose informative primers - two primers on the same branch cannot distinguish which branch is blocked.

**Pathway logic**: Chorismate is the branch point. ARO7 sends it toward Tyr/Phe, TRP5 sends it toward Trp, and ARO2 acts upstream (shikimate to chorismate). A mutant that needs both Tyr and Phe but not Trp is most likely defective in ARO7.

**Exam traps**

- Wrong annealing temperature leads to non-specific bands or no product.
- Forgetting the no-template control (NTC) - without it, you cannot rule out contamination.
- Mis-assigning which band is wild-type versus mutant.
- Choosing primers that both probe the same pathway branch.
- Extension time too short for the expected amplicon size.

---

## Agarose Gel Electrophoresis and Gel Retardation (EMSA)

**Why it works (first principles)**

DNA carries a uniform negative charge (from its phosphate backbone) and migrates toward the anode in an electric field. An agarose gel acts as a molecular sieve: smaller fragments move through the pores faster than larger ones. By running fragments alongside a ladder of known sizes, you can estimate the size of any unknown band.

**Gel retardation (EMSA)**

When a protein binds to DNA, the resulting complex has a larger effective size (and often a different charge-to-mass ratio), so it migrates more slowly than the free DNA. This is the basis of the Electrophoretic Mobility Shift Assay, which was used extensively in the 2018 IBO exam.

In that exam, students purified a protein called "Pep" and tested whether it could bind plasmid DNA. The expected gel pattern:

- Free plasmid alone: fast-migrating bands (supercoiled + open-circular forms)
- Plasmid + Pep at increasing concentrations: progressively retarded (higher) bands
- Plasmid + DNase alone: DNA degraded (smear or no bands)
- Plasmid + Pep + DNase: if Pep protects the DNA from nuclease cleavage, bands survive

![An EMSA (gel shift) result: free DNA runs fast, while DNA bound to increasing amounts of protein forms progressively slower-migrating shifted complexes](/PRACTICAL1PICS/emsa-gel-shift.png)

**DNase protection** is a powerful extension of this idea: protein bound to DNA physically shields the bound region from nuclease cleavage.

**Topology forms on agarose gels**

A critical concept that catches students every year: the same circular plasmid can appear as multiple bands on a gel, each corresponding to a different topological form:

- **Supercoiled** (Form I): the most compact form, migrates fastest
- **Linear** (Form III): intermediate migration
- **Open-circular / nicked** (Form II): relaxed circle, migrates slowest

![The same plasmid resolved into three distinct bands on one gel lane: supercoiled, linear, and open-circular/nicked forms](/PRACTICAL1PICS/dna-topology-gel.png)

Restriction digestion converts the circular forms into linear fragments, which then migrate purely by size.

**Exam traps**

- Sample floating out of the well (loading too fast, or sample too dilute in loading dye).
- Running the gel too long (small fragments run off the end) or too short (large fragments do not resolve).
- Mis-interpreting topology bands as different-sized fragments.
- At very high protein concentrations, the complex may not enter the gel at all -- stained material stuck in the well.

**Simulate a gel** -- choose an IBO exam preset or enter your own fragment sizes to see how they migrate:

{{< iframe src="/gel-electrophoresis-simulator.html" title="Gel Electrophoresis Simulator" height="750px" >}}

---

## Auxotrophy Testing and Biosynthetic Pathway Mapping

**Why it works (first principles)**

An auxotroph is an organism that cannot synthesise an essential metabolite. If you grow it on minimal medium (which lacks that metabolite), it will not grow. If you supplement the medium with the missing compound, growth is restored.

By systematically testing growth on minimal medium supplemented with individual amino acids (or other metabolites), you can figure out which metabolic step is blocked. This is the classical genetic approach to dissecting biosynthetic pathways, and it appeared in the 2015 IBO exam.

**How it is used in IBO**

- Spot yeast or bacterial mutants on a series of plates, each containing minimal medium plus one specific supplement.
- Record growth (+) or no growth (-) for each strain on each medium.
- Map the growth pattern onto the known biosynthetic pathway to identify the blocked enzymatic step.

![Auxotrophy plate test: colonies growing on supplemented minimal medium but absent on unsupplemented minimal medium, revealing a metabolic block](/PRACTICAL1PICS/auxotrophy-plates.png)

**Key logical principle**: if a mutant grows when supplied with compound X but not when supplied with compound Y (where Y is upstream of X in the pathway), the block must be between Y and X.

![The shikimate pathway branching into aromatic amino acid biosynthesis, with chorismate as the key branch point leading to the Trp branch and the Tyr/Phe branch](/PRACTICAL1PICS/aromatic-aa-pathway.webp)

**Media used in the 2015 exam**:

<table>
<thead><tr><th>Medium</th><th>Composition</th></tr></thead>
<tbody>
<tr><td>A</td><td>Rich (YPD) - all strains grow</td></tr>
<tr><td>B</td><td>Minimal - only prototrophs grow</td></tr>
<tr><td>C</td><td>Minimal + homocysteine</td></tr>
<tr><td>D</td><td>Minimal + isoleucine</td></tr>
<tr><td>E</td><td>Minimal + threonine</td></tr>
<tr><td>F</td><td>Minimal + Met + Thr</td></tr>
<tr><td>G</td><td>Minimal + lysine</td></tr>
<tr><td>H</td><td>Minimal + proline</td></tr>
</tbody>
</table>

**Exam traps**

- Mis-reading faint colonies as no growth (or vice versa).
- Contaminating plates by not using aseptic technique.
- Forgetting that some intermediates cannot be taken up by the cell even if they bypass the block - only metabolites that are membrane-permeable (or actively transported) count.
- Assigning the block to a downstream step when it is actually upstream.


</div>

<div class="article-gate-cta" id="article-gate-cta" hidden>
  <p>Log in to keep reading - free, and takes a few seconds.</p>
  <a class="papers-nav-btn papers-nav-next" id="article-gate-cta-link" href="/account/">Log in to keep reading</a>
</div>

</div>

<script src="/js/papers-article-gate.js" defer></script>
