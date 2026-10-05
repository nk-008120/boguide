---
title: "From Screen to Body: Drug Delivery BiOHorizon Report"
description: "A designed drug in patients, proteins built from scratch against snake venom, a gene editor made for one baby, a shuttle across the blood-brain barrier, and the 2% problem inside the cell. What was measured, what was only claimed, and where the molecule gets lost between the computer and the body."
layout: "horizon"
date: 2026-10-03
aliases: ["/biobytes/frontiers/drug-delivery/"]
---

{{< mathjax >}}

<div class="fr-article">

<div class="fr-author-label">Author</div>
<div class="testimonial-author fr-author">
  <img src="/bgavat.jpg" alt="Bhavyaa Gunwal" class="testimonial-author-photo" onerror="this.onerror=null;this.src='/avatars/avatar-01.svg';">
  <div class="testimonial-author-info">
    <h3>Bhavyaa Gunwal</h3>
    <div class="testimonial-author-tagline">Senior Partner &middot; BiOGuide</div>
    <p class="testimonial-author-bio">A rash from a poisonous plant on a hillside, soothed by leaves from a different plant growing right beside it: that was the moment I understood biology could heal. Growing up around my parents' clinic, I was always more curious about the molecules that reverse a disease than about administering the treatment. Olympiads (IJSO 2024 gold, then IBO silver in 2025 and gold in 2026) taught me to form a testable idea, probe it, and revise it from the evidence. The problem I keep coming back to is drug delivery, making molecules that work on a screen work inside a living body, which is why this report is close to my heart. I have also taught biology at NGOs and started my school's biology club, because science matters most when it reaches people.</p>
  </div>
</div>

<div class="fr-hero">
  <p class="fr-kicker">BiOHorizon Report &middot; Drug Delivery &middot; October 2026</p>
  <p class="fr-dek">Designing a molecule on a computer is getting fast. Getting it to work inside a living body is where most of the loss still happens. Over the last two years, a {{< term "generative-ai" >}}generative-AI{{< /term >}} drug reached patients, designed proteins neutralised snake toxins in mice, a gene editor was built for a single baby in six months, a receptor shuttle carried a drug across the {{< term "blood-brain-barrier" >}}blood-brain barrier{{< /term >}} into regulatory approval, and researchers measured how little RNA actually escapes inside a cell. This report separates what was <em>measured</em> from what was <em>claimed</em> and shows where each story plugs into the biology you are studying.</p>
  <div class="fr-pills">
    <span class="fr-pill">💊 5 stories</span>
    <span class="fr-pill">🔬 Beginner friendly</span>
    <span class="fr-pill">🧮 Delivery-budget lab, 3-D visualizer</span>
    <span class="fr-pill">📚 11 sources</span>
    <span class="fr-pill">🖼️ 7 images</span>
    <span class="fr-pill">☕ ~15 min read</span>
  </div>
</div>


## How to read a delivery claim

A drug has to survive a long obstacle course, and almost every headline of the form "new therapy works!" survives or collapses on the same four questions. Keep them in your head through every story below.

<div class="fr-questions">
  <div class="fr-question"><span class="fr-q-num">1</span><div><h3>What was actually measured?</h3><p>Reaching a tissue, working inside a cell, moving a blood marker and helping a patient feel or live better are four different results. Headlines blur them.</p></div></div>
  <div class="fr-question"><span class="fr-q-num">2</span><div><h3>In what, and how many?</h3><p>Cells in a dish, mice, monkeys or people? Five mice or seventy-one patients? Mouse data is not a human result.</p></div></div>
  <div class="fr-question"><span class="fr-q-num">3</span><div><h3>Compared with what?</h3><p>A {{< term "placebo" >}}placebo{{< /term >}}, the previous best design, or nothing at all? A change with no comparison group can have many causes.</p></div></div>
  <div class="fr-question"><span class="fr-q-num">4</span><div><h3>Who else has seen it, and who paid?</h3><p>Has a different team reproduced it? Is the sponsor the company that makes the drug? A company press release is a claim, not evidence.</p></div></div>
</div>

<div class="fr-callout">
  <h3>Four hurdles: get there, get in, get out, do the job</h3>
  <p>Whatever the cargo, a drug that works inside a cell must pass four hurdles, in this order:</p>
  <ol>
    <li>Reach the right tissue from the blood.</li>
    <li>Enter the right cells.</li>
    <li>Get out of the membrane-bound compartment it was swallowed into.</li>
    <li>Do its job once free.</li>
  </ol>
  <p>Each step keeps only a fraction of what entered it, and the fractions <em>multiply</em>. Three stages that each keep 10% leave 0.1% (0.1 &times; 0.1 &times; 0.1 = 0.001). That multiplication is why a molecule that binds its target beautifully in a test tube can still fail in a body, and it is the idea behind the lab in story 5.</p>
</div>

Delivery is also not the same as efficacy. A drug can arrive and do nothing useful, or do something useful for a reason unrelated to where you aimed it. Each story below says which of those it has shown.

## The five stories at a glance

<div class="fr-table-wrap">
<table class="fr-table">
<thead><tr><th>Story</th><th>Where</th><th>Headline</th><th>Honest status</th></tr></thead>
<tbody>
<tr><td>1. A designed drug in patients</td><td>Lungs, by mouth</td><td>A small molecule whose target and structure came from generative AI, tested against placebo in 71 patients</td><td>{{< term "clinical-trial-phases" >}}Phase IIa{{< /term >}} result, small and short; a larger Phase III has been announced by the company</td></tr>
<tr><td>2. Designed against venom</td><td>Mouse blood</td><td>Proteins built from scratch to grab snake neurotoxins and protect mice</td><td>Mouse data; a binder against the cytotoxin class did not protect</td></tr>
<tr><td>3. One baby, one editor</td><td>Liver</td><td>A {{< term "base-editor" >}}base editor{{< /term >}} in {{< term "lipid-nanoparticle" >}}lipid nanoparticles{{< /term >}} made for a single infant with a {{< term "urea-cycle" >}}urea-cycle{{< /term >}} disease</td><td>One patient, seven weeks of follow-up reported, editing in his liver not directly measured</td></tr>
<tr><td>4. Across the barrier</td><td>Brain</td><td>A {{< term "transferrin-receptor" >}}transferrin-receptor{{< /term >}} shuttle carrying an enzyme into the brain, approved in the US</td><td>{{< term "accelerated-approval" >}}Accelerated approval{{< /term >}} on a biomarker; clinical benefit still being tested</td></tr>
<tr><td>5. The 2% problem</td><td>Inside the cell</td><td>Only a small share of delivered RNA escapes the {{< term "endosome" >}}endosome{{< /term >}}, and new methods are measuring it better</td><td>Several methods agree it is low and disagree on the number</td></tr>
</tbody>
</table>
</div>

<div class="fr-story fr-story-idea">

<div class="fr-story-head">
  <span class="fr-story-num">1</span>
  <span class="fr-tag">💊 Small molecule &middot; Generative AI</span>
</div>

## An AI-designed drug meets real patients

<p class="fr-label">The claim</p>

In June 2025, *Nature Medicine* reported a {{< term "rct" >}}randomised, placebo-controlled{{< /term >}} {{< term "clinical-trial-phases" >}}Phase IIa{{< /term >}} trial of a drug whose biological target and chemical structure were both found with {{< term "generative-ai" >}}generative AI{{< /term >}}. The drug, {{< term "rentosertib" >}}rentosertib{{< /term >}}, inhibits an enzyme called {{< term "tnik" >}}TNIK{{< /term >}} and was tested in {{< term "ipf" >}}idiopathic pulmonary fibrosis{{< /term >}} (IPF), a disease in which lung tissue scars and breathing capacity falls. The authors report that it was safe enough in 12 weeks and that the highest dose group showed a gain in lung function while placebo patients lost some.<sup class="fr-ref"><a href="#ref-1">1</a></sup>

<p class="fr-label">How they did it</p>

The company Insilico Medicine used one AI platform (PandaOmics) to nominate TNIK as a target and another (Chemistry42) to propose the molecule. Those are the "in silico" steps, meaning done on a computer. Then came the part no computer can do: patients. The trial enrolled 71 people with IPF at multiple sites in China between July 2023 and June 2024 and gave them a placebo or rentosertib by mouth for 12 weeks. The main goal was safety; lung function was a secondary measure, tracked as forced vital capacity (FVC), the volume of air you can blow out after a full breath.<sup class="fr-ref"><a href="#ref-1">1</a></sup>

<figure class="fr-fig fr-fig-wide">
  <img src="/horizon/drug-delivery/followupscheme.webp" alt="Flow chart: 128 patients screened, 57 excluded, 71 randomised into four boxes (rentosertib 30 mg once daily 18, 30 mg twice daily 18, 60 mg once daily 18, placebo 17), each followed by the number who discontinued and the numbers in the safety and efficacy analyses." width="709" height="300" loading="lazy">
  <figcaption><strong>Fig. 1.</strong> Patient flow in the rentosertib trial: how many were screened, randomised to each group, stopped treatment, and were analysed. <span class="fr-credit">Figure: from the rentosertib Phase IIa paper, <em>Nature Medicine</em> (2025), reproduced unaltered under CC BY-NC-ND 4.0. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12353801/">Source</a></span></figcaption>
</figure>

<p class="fr-label">The numbers</p>

- **Groups:** placebo (17 patients), 30 mg once daily (18), 30 mg twice daily (18), 60 mg once daily (18).
- **FVC change at 12 weeks:**
  - placebo -20.3 mL ({{< term "confidence-interval" >}}95% confidence interval{{< /term >}} -116.1 to 75.6)
  - 30 mg once daily -27.0 mL
  - 30 mg twice daily +19.7 mL
  - 60 mg once daily **+98.4 mL (95% confidence interval 10.9 to 185.9)**
- **Adverse events ({{< term "endpoint" >}}primary endpoint{{< /term >}}):** at least one treatment-emergent event in 70.6% of placebo patients and 72.2% to 83.3% of drug groups.
- **Dropouts:** 16 of 71 patients stopped treatment early. Seven stopped for liver dysfunction, four of whom were also taking another IPF drug, {{< term "nintedanib" >}}nintedanib{{< /term >}}.<sup class="fr-ref"><a href="#ref-1">1</a></sup>

<p class="fr-label">Where it is contested</p>

Read the confidence intervals, not just the averages:

- Only the 60 mg group's interval excludes zero.
- Each group has about 18 people.
- 12 weeks is short for a scarring disease.
- The response was not smoothly dose-ordered (the twice-daily 30 mg group did less than the once-daily 60 mg group).

The authors themselves list small groups, a single country and short follow-up as limits. Several authors are Insilico employees and the company sponsored the trial.<sup class="fr-ref"><a href="#ref-1">1</a></sup> The real test is a larger trial: in July 2026 the company announced a 52-week Phase III in 320 patients at 47 centres in China, with the yearly rate of FVC decline as the main endpoint. That is a press release and the drug has no regulatory approval.<sup class="fr-ref"><a href="#ref-2">2</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Randomised and placebo-controlled, but small, short and sponsor-run</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Closeness to the clinic</span><span class="fr-bar" role="img" aria-label="4 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span><span class="fr-meter-note">In patients, with a Phase III announced</span></div>
</div>

<p class="fr-label">The biology underneath</p>

This is the "easy" delivery case: a small molecule you swallow, which is why the story is mostly about whether the *target* was the right one. TNIK is a kinase, an enzyme that transfers a phosphate group from {{< term "atp" >}}ATP{{< /term >}} onto other proteins, and many kinase drugs work by blocking that step. FVC and lung scarring connect to respiratory physiology.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/1-cell-molecular/enzyme-kinetics-regulation" label="Enzyme Kinetics and Regulation" why="kinases and what blocking one does" >}}
{{< notebtn path="/resources/1-cell-molecular/cell-signaling-communication" label="Cell Signalling" why="phosphorylation as a signal" >}}
{{< notebtn path="/resources/3-animal-physiology/respiratory-physiology" label="Respiratory Physiology" why="what FVC measures" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: what would make you believe the lung gain is real?</summary>
<div>
<p>The 60 mg group gained 98.4 mL and placebo lost 20.3 mL, but both averages come from small groups, and some patients also took another drug. List two things that could produce a gap like this without rentosertib doing anything. Then say which single result in the Phase III would convince you.</p>
</div>
</details>

</div>

<div class="fr-story fr-story-rock">

<div class="fr-story-head">
  <span class="fr-story-num">2</span>
  <span class="fr-tag">🐍 Protein design &middot; Mouse</span>
</div>

## Proteins built from scratch against snake venom

<p class="fr-label">The claim</p>

In January 2025, *Nature* published work led by the Baker lab (University of Washington) and the Technical University of Denmark in which researchers used deep learning to design small proteins that bind three families of snake venom toxins called {{< term "three-finger-toxin" >}}three-finger toxins{{< /term >}}. The designed proteins neutralised toxins in the lab and protected mice from a lethal neurotoxin dose.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

<figure class="fr-fig fr-fig-narrow">
  <img src="/horizon/drug-delivery/monocledcobra.webp" alt="A dark grey snake coiled on leaf litter with its head raised at the front of the coil." width="250" height="187" loading="lazy">
  <figcaption><strong>Fig. 2.</strong> A monocled cobra (<em>Naja kaouthia</em>), the species whose alpha-cobratoxin was one of the toxins targeted. A photograph of the animal, not data from the study. <span class="fr-credit">Photo: Akash M. Deshmukh, CC BY-SA 4.0 (share-alike applies to reuse). <a href="https://commons.wikimedia.org/wiki/File:Monocled_cobra_(cropped).jpg">Source</a></span></figcaption>
</figure>

<p class="fr-label">How they did it</p>

Instead of immunising an animal and harvesting antibodies, as traditional {{< term "antivenom" >}}antivenom{{< /term >}} does, the team asked software to invent a protein that would fit the toxin's surface. Three tools did the work in turn:

1. A diffusion model ({{< term "rfdiffusion" >}}RFdiffusion{{< /term >}}) generated backbones.
2. {{< term "proteinmpnn" >}}ProteinMPNN{{< /term >}} chose amino-acid sequences for them.
3. {{< term "alphafold" >}}AlphaFold2{{< /term >}} was used to filter out designs predicted not to fold or bind.

Only the top candidates were then made and tested in the lab. I read the open {{< term "preprint" >}}preprint{{< /term >}} version of this work, so numbers below come from it and the published paper may differ in detail.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

<figure class="fr-fig ">
  <img src="/horizon/drug-delivery/crystalsoverlaid.webp" alt="Three rows labelled SHRT, LNG and CYTX_B10. Each has a centre image of two overlaid ribbon models of a designed protein bound to a toxin, flanked by two boxed close-ups of amino-acid side chains making contacts." width="759" height="731" loading="lazy">
  <figcaption><strong>Fig. 3.</strong> Crystal structures of three designed binders overlaid on their computer design models, with close-ups of contact points. Rows: (a) short-chain neurotoxin binder SHRT, (b) long-chain binder LNG, (c) cytotoxin binder CYTX_B10. The close match is what &quot;near-atomic agreement&quot; means. <span class="fr-credit">Figure: Vázquez Torres et al., preprint version of the <em>Nature</em> paper, CC BY 4.0. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11118692/">Source</a></span></figcaption>
</figure>

<div class="fr-viz fr-mol" id="fr-mol" data-pdb="/horizon/drug-delivery/9bk5.pdb">
  <h3>Try it: rotate a designed binder gripping its toxin</h3>
  <p class="fr-viz-intro">This is the real crystal structure behind row (b) of Fig. 3: the designed LNG binder holding alpha-cobratoxin. Drag to rotate and scroll to zoom. Switch on the contact residues to see which amino acids touch across the interface, or the toxin surface to see how snugly the binder sits on it.</p>
  <p class="fr-viz-status">Loading the 3D structure (needs JavaScript and WebGL)...</p>
  <div class="fr-viz-controls">
    <button type="button" class="fr-viz-btn" data-mol="spin" aria-pressed="true">Spin</button>
    <button type="button" class="fr-viz-btn" data-mol="interface" aria-pressed="false">Show contact residues</button>
    <button type="button" class="fr-viz-btn" data-mol="surface" aria-pressed="false">Toxin surface</button>
    <button type="button" class="fr-viz-btn" data-mol="reset">Reset view</button>
  </div>
  <div class="fr-mol-canvas"></div>
  <p class="fr-mol-legend"><span><i style="background:#e0457b"></i>LNG binder (the designed protein)</span><span><i style="background:#1f9bb5"></i>Alpha-cobratoxin (the toxin)</span></p>
  <p class="fr-viz-caption">Interactive. PDB entry <a href="https://www.rcsb.org/structure/9BK5">9BK5</a>, solved by X-ray crystallography at 2.68 &Aring; resolution, from Vázquez Torres et al., <em>Nature</em> 639, 225 to 231 (2025). Structure data from the RCSB Protein Data Bank (open data). Contact residues are those within 4.5 &Aring; of the other protein.<sup class="fr-ref"><a href="#ref-3">3</a></sup></p>
</div>

<p class="fr-label">The numbers</p>

- **Binding:** the best designs held their toxins with {{< term "dissociation-constant" >}}dissociation constants{{< /term >}} (K<sub>d</sub>) of about 0.9 nM (short-chain neurotoxin), 1.9 nM (long-chain alpha-cobratoxin) and 271 nM ({{< term "cytotoxin" >}}cytotoxin{{< /term >}}, the weakest). Lower K<sub>d</sub> means tighter binding.
- **Stability:** melting temperatures of 78 &deg;C, above 95 &deg;C and 61 &deg;C, high for proteins.
- **Structure check:** crystal structures of three designs matched the computer models closely, with {{< term "rmsd" >}}root-mean-square deviations{{< /term >}} between about 0.4 and 1.3 &Aring;.
- **Mice:** groups of 5 got three times the lethal dose of toxin. When toxin and binder were mixed first, both neurotoxin binders gave 100% survival. When the binder was given 15 minutes *after* the toxin, survival was 100% for both, and at 30 minutes it was 100% for the short-chain binder and 60% for the long-chain one.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

<p class="fr-label">Where it is contested</p>

Two limits are in the paper itself. The cytotoxin binder, the weakest at 271 nM, did not significantly shrink the tissue-damaging lesions in preliminary mouse tests, and the authors say its affinity probably needs improving. And protection fell off as the delay grew, which is the realistic situation for a bite. Beyond that, the work covers three toxin families, while real venoms are mixtures that also contain other classes of toxins, so a bite would need several binders. The mouse results use small groups and, in the pre-mixed case, never test the harder question of reaching a toxin already spreading through the body.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Strong structural and binding data, small mouse groups</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Closeness to the clinic</span><span class="fr-bar" role="img" aria-label="1 out of 5"><i class="on"></i><i></i><i></i><i></i><i></i></span><span class="fr-meter-note">Mouse only, no human data</span></div>
</div>

<p class="fr-label">The biology underneath</p>

A binder is a protein whose shape is complementary to its target, the same lock-and-key logic as an {{< term "antibody" >}}antibody{{< /term >}} and its antigen, and K<sub>d</sub> is the concentration at which half of the target is occupied. This story is protein structure-function in its purest form: sequence determines fold, fold determines surface, surface determines binding.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/1-cell-molecular/protein-structure-folding-function" label="Protein Structure, Folding and Function" why="sequence to fold to binding" >}}
{{< notebtn path="/resources/3-animal-physiology/immune-physiology" label="Immune Physiology" why="how the body normally neutralises toxins" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: why does the order of mixing matter?</summary>
<div>
<p>Mixing binder and toxin in a tube before injection tests whether they bind. Giving the binder 15 or 30 minutes after the toxin tests whether the binder can find toxin that is already in the body. Which result would you trust more as a model of a snakebite, and what extra measurement (for example, how fast the binder leaves the blood) would you want before believing a human dose could work?</p>
</div>
</details>

</div>

<div class="fr-story fr-story-ocean">

<div class="fr-story-head">
  <span class="fr-story-num">3</span>
  <span class="fr-tag">🧬 Gene editing &middot; Lipid nanoparticle</span>
</div>

## A gene editor made for one baby

<p class="fr-label">The claim</p>

In May 2025 (print issue June 2025), the *New England Journal of Medicine* reported that a team including clinicians at the Children's Hospital of Philadelphia had designed, tested and delivered a customised {{< term "base-editor" >}}base-editing{{< /term >}} therapy to a single infant with severe {{< term "cps1-deficiency" >}}carbamoyl-phosphate synthetase 1 (CPS1) deficiency{{< /term >}}. After the second dose, the authors report that he tolerated more dietary protein and needed half the starting dose of a nitrogen-scavenger drug, with no serious adverse events. They also stress that longer follow-up is needed.<sup class="fr-ref"><a href="#ref-4">4</a></sup>

<p class="fr-label">How they did it</p>

CPS1 is the first enzyme of the {{< term "urea-cycle" >}}urea cycle{{< /term >}}, the liver pathway that converts toxic ammonia into urea. The baby's blood ammonia was above 1000 micromoles per litre in his first days (the reference range is 9 to 33), and he carried two different {{< term "stop-codon" >}}stop-codon{{< /term >}} variants, one on each copy of the gene. The team built a therapy around the paternal variant, Q335X. A **base editor** is a protein that rewrites a single DNA letter without cutting both strands; here an adenine base editor and a {{< term "guide-rna" >}}guide RNA{{< /term >}} were packaged as {{< term "mrna" >}}mRNA{{< /term >}} and RNA in **{{< term "lipid-nanoparticle" >}}lipid nanoparticles{{< /term >}}** that, given intravenously, are taken up by liver cells. Candidate editors went through three tests in turn:

1. They were screened in a lab-made cell line carrying the variant.
2. They were tested in mice engineered with the human sequence.
3. They were checked for safety in monkeys.

The whole process from diagnosis to first dose took about six months.<sup class="fr-ref"><a href="#ref-4">4</a></sup>

<p class="fr-label">The numbers</p>

- **Mice:** up to 42% whole-liver corrective editing in a small number of mice, with editing visible at the lowest dose, 0.1 mg per kg.
- **Monkeys:** a safety study at 1.5 mg per kg of total RNA showed transient rises in liver enzymes and no clinical signs of toxicity.
- **The baby:** a first dose of 0.1 mg per kg of total RNA on day 208 of life (his weight was 7.14 kg the day before, so about 0.7 mg of RNA), and 0.3 mg per kg 22 days later. His nitrogen-scavenger dose was cut from 10.1 to 5.0 mL per square metre of body surface per day. Median blood ammonia was 23 micromoles per litre before the first dose, 9 between doses and 13 after the second.<sup class="fr-ref"><a href="#ref-4">4</a></sup>

<div class="fr-callout fr-callout-twist">
  <h3>The detail that matters most: nobody measured the editing in him</h3>
  <p>A liver biopsy to check for corrective editing was skipped because it posed an unacceptable risk to the infant, so the 42% figure comes from mice, not from him. The evidence of benefit is indirect: less ammonia, more tolerated protein, better weight gain, in a baby also receiving immune-suppressing drugs and surviving viral illnesses. That is a real and encouraging signal, but it is not the same as showing how much of his liver was edited.<sup class="fr-ref"><a href="#ref-4">4</a></sup></p>
</div>

<p class="fr-label">Where it is contested</p>

This is one patient, so there is no comparison group and the improvements sit alongside other changes (diet, medication, growth, recovery from infections). The reported follow-up is seven weeks after the first dose, and the authors say longer follow-up is needed for safety, efficacy and neurological health. The work was funded by the US National Institutes of Health and others, with in-kind contributions from Acuitas Therapeutics (which makes lipid nanoparticles) and other companies. The authors argue that similar customised therapies could be built for hundreds of liver metabolic diseases, but that is their expectation, not something this single case shows.<sup class="fr-ref"><a href="#ref-4">4</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="2 out of 5"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span><span class="fr-meter-note">One patient, short follow-up, editing in the patient unmeasured</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Closeness to the clinic</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Given to a patient, but bespoke and not yet a trial</span></div>
</div>

<p class="fr-label">The biology underneath</p>

The baby is a **compound heterozygote**: two different disease variants, one inherited from each parent, so the therapy as described targets only one of them. That is a classic pedigree and human genetic disorders idea. The urea cycle sits within digestive and metabolic physiology, and the delivery vehicle is built from lipids and membrane biochemistry. Base editing itself is a use of recombinant DNA and biotechnology techniques.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/7-genetics/pedigree-analysis-human-genetic-disorders" label="Pedigree Analysis and Human Genetic Disorders" why="two variants, one from each parent" >}}
{{< notebtn path="/resources/3-animal-physiology/digestive-metabolic-physiology" label="Digestive and Metabolic Physiology" why="where the urea cycle fits" >}}
{{< notebtn path="/resources/1-cell-molecular/lipids-membrane-biochemistry" label="Lipids and Membrane Biochemistry" why="what the delivery vehicle is made of" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: how would you prove it worked?</summary>
<div>
<p>You cannot biopsy the baby's liver. List three indirect measurements that would together make the case that the editor worked in his liver (think about the pathway: which molecules rise or fall if CPS1 activity comes back?). Then name one result that would make you suspect the improvement had another cause.</p>
</div>
</details>

</div>

<div class="fr-story fr-story-exo">

<div class="fr-story-head">
  <span class="fr-story-num">4</span>
  <span class="fr-tag">🧠 Brain &middot; Receptor shuttle</span>
</div>

## A shuttle across the blood-brain barrier

<p class="fr-label">The claim</p>

In March 2026 the US Food and Drug Administration granted {{< term "accelerated-approval" >}}accelerated approval{{< /term >}} to tividenofusp alfa (brand name Avlayah), for the neurologic effects of {{< term "hunter-syndrome" >}}Hunter syndrome{{< /term >}} in children. The FDA describes the approval as based on a {{< term "surrogate-endpoint" >}}surrogate endpoint{{< /term >}} and says a confirmatory randomised trial is under way.<sup class="fr-ref"><a href="#ref-5">5</a></sup> It is the first approved drug built to cross the {{< term "blood-brain-barrier" >}}blood-brain barrier{{< /term >}} using the {{< term "transferrin-receptor" >}}transferrin receptor{{< /term >}}, according to the company.

<p class="fr-label">How they did it</p>

The blood-brain barrier is a layer of tightly joined cells lining brain capillaries that keeps most of the blood's contents out. About 98% of small-molecule drugs do not cross it.<sup class="fr-ref"><a href="#ref-6">6</a></sup> The shuttle trick is to fuse the drug to a protein that binds the transferrin receptor, a surface protein these cells use to import iron, so the cell carries the drug through by **receptor-mediated transcytosis**: taken in on one side, ferried across, released on the other. Tividenofusp alfa fuses the missing enzyme (iduronate-2-sulfatase, IDS) to such a binder. Hunter syndrome is caused by too little IDS, which lets sugar polymers such as {{< term "heparan-sulfate" >}}heparan sulfate{{< /term >}} build up in tissues including the brain.

<div class="fr-figs">
<figure class="fr-fig ">
  <img src="/horizon/drug-delivery/rmt.webp" alt="Line drawing of a cell layer between a blood side on top and a brain side below, with a tight junction at the left marked with a cross, a receptor-bound cargo taken in and carried across (route A), a hatched cationic molecule carried across (route B) and small nutrient molecules passing through membrane channels (route C)." width="1050" height="851" loading="lazy">
  <figcaption><strong>Fig. 4.</strong> Routes across the barrier cell. The gap between cells is sealed by tight junctions (cross). Route A: a cargo carried by a receptor (receptor-mediated transcytosis). Route B: positively charged molecules (adsorptive transcytosis). Route C: small nutrients through transporters. A concept drawing, not data. <span class="fr-credit">Figure: from the review of receptor-mediated transcytosis receptors, CC BY. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12363266/">Source</a></span></figcaption>
</figure>
<figure class="fr-fig ">
  <img src="/horizon/drug-delivery/bbb.webp" alt="Line drawing of a drug carrier coated with antibodies crossing a curved barrier studded with transferrin receptors, then three arrows to neurons and astrocytes, to a glioma cell, and to neurons with a cofactor marked by a star." width="900" height="898" loading="lazy">
  <figcaption><strong>Fig. 5.</strong> Concept drawing of a carrier coated with antibodies against the transferrin receptor (TfR) crossing the barrier to reach neurons, astrocytes or glioma cells. Variants I to III add a second antibody (anti-HIR) or a cofactor. <span class="fr-credit">Figure: from the same review, CC BY. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12363266/">Source</a></span></figcaption>
</figure>
</div>

<p class="fr-label">The numbers</p>

- **Trial:** 47 children aged 3 months to 13 years, with 44 measured at week 24.
- **Result:** {{< term "cerebrospinal-fluid" >}}cerebrospinal fluid{{< /term >}} heparan sulfate fell by about 91% on average, and 93% of treated patients ended below the upper limit of normal.
- **Safety:** a boxed warning for severe allergic reactions including anaphylaxis, with monitoring for anaemia and a kidney condition called membranous nephropathy.<sup class="fr-ref"><a href="#ref-5">5</a></sup>

The same strategy is being tested in Alzheimer's disease. Roche's {{< term "trontinemab" >}}trontinemab{{< /term >}} is an anti-{{< term "amyloid-beta" >}}amyloid{{< /term >}} antibody with a transferrin-receptor-binding fragment attached. A summary by Alzforum of mid-2025 early-phase data reports deep amyloid clearance at 3.6 mg per kg and a low rate of brain swelling, with anaemia as the most notable safety signal. Two Phase 3 trials (TRONTIER 1 and 2, 800 patients each, started September 2025) test whether clearing amyloid actually helps cognition.<sup class="fr-ref"><a href="#ref-7">7</a></sup>

<div class="fr-callout fr-callout-twist">
  <h3>The detail that matters most: a surrogate is not the outcome</h3>
  <p>Heparan sulfate in spinal fluid is a stand-in measurement. The FDA granted accelerated approval because it is judged reasonably likely to predict benefit, not because children were shown to think, speak or learn better. The drug getting in and clearing the sugar is a delivery result; whether it changes a child's development is an efficacy result that is still being tested.<sup class="fr-ref"><a href="#ref-5">5</a></sup></p>
</div>

<p class="fr-label">Where it is contested</p>

Beyond the surrogate question, the study is small and the patients were not compared with a control group in the result quoted. Anaphylaxis and anaemia are not accidents: they are plausible consequences of aiming at a receptor that is also used by blood-forming cells and that circulates widely, so the shuttle has to be strong enough to cross the barrier without hijacking iron handling elsewhere. For trontinemab the key evidence so far is amyloid clearance, the same kind of stand-in, and the Phase 3 results are not expected before 2028.<sup class="fr-ref"><a href="#ref-7">7</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Large, consistent biomarker effect in a small trial, no clinical outcome yet</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Closeness to the clinic</span><span class="fr-bar" role="img" aria-label="4 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span><span class="fr-meter-note">Approved, conditionally; the Alzheimer's version is in Phase 3</span></div>
</div>

<p class="fr-label">The biology underneath</p>

Receptor-mediated transcytosis is plasma membrane transport and endomembrane trafficking applied to medicine: coated pits, vesicles, sorting and release. The barrier itself, with its {{< term "tight-junction" >}}tight junctions{{< /term >}} and special endothelium, belongs with the nervous system notes.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/1-cell-molecular/plasma-membrane-structure-transport" label="Plasma Membrane Structure and Transport" why="how receptors carry cargo across" >}}
{{< notebtn path="/resources/1-cell-molecular/endomembrane-system-protein-trafficking" label="Endomembrane System and Protein Trafficking" why="vesicles, sorting and release" >}}
{{< notebtn path="/resources/3-animal-physiology/nervous-system-physiology" label="Nervous System Physiology" why="the barrier around the brain" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: tight binding can backfire</summary>
<div>
<p>A shuttle that grabs the transferrin receptor very tightly might get stuck inside the barrier cell and never be released on the brain side. A shuttle that binds weakly might never be taken up. Sketch how the amount of drug reaching the brain would change as binding goes from weak to very strong. What would you measure to find the best middle?</p>
</div>
</details>

</div>

<div class="fr-story fr-story-mars">

<div class="fr-story-head">
  <span class="fr-story-num">5</span>
  <span class="fr-tag">🔬 Inside the cell &middot; Endosomal escape</span>
</div>

## The 2% problem

<p class="fr-label">The claim</p>

Stories 3 and 4 both end with a drug that has to leave a bubble. When a cell swallows a {{< term "lipid-nanoparticle" >}}lipid nanoparticle{{< /term >}}, the particle sits inside an **endosome**, a membrane-bound compartment that gets steadily more acidic and eventually fuses with lysosomes that digest its contents. RNA only works if it reaches the {{< term "cytosol" >}}cytosol{{< /term >}} first. A 2013 *Nature Biotechnology* study using imaging found that escape of {{< term "sirna" >}}siRNA{{< /term >}} from endosomes into the cytosol is inefficient, at about 1 to 2%, and happens only in a narrow window.<sup class="fr-ref"><a href="#ref-8">8</a></sup> A 2025 paper still describes it that way in its introduction, calling current escape strategies "largely ineffective" with 1 to 2% of administered RNA reaching the cytoplasm.<sup class="fr-ref"><a href="#ref-9">9</a></sup>

<p class="fr-label">How they did it</p>

Measuring {{< term "endosomal-escape" >}}escape{{< /term >}} is hard because the RNA is invisible once it mixes into the cytosol. The 2013 study tracked fluorescently labelled siRNA in lipid nanoparticles by quantitative imaging and electron microscopy, in cells and in mouse liver.<sup class="fr-ref"><a href="#ref-8">8</a></sup> The 2025 study added iron oxide nanoparticles inside the lipid particles and followed their magnetic signal by {{< term "mri" >}}MRI{{< /term >}} in cultured cells and mice, as an indirect read-out of escape.<sup class="fr-ref"><a href="#ref-9">9</a></sup> A March 2026 *Nature Biotechnology* paper reports an {{< term "in-vivo" >}}in vivo{{< /term >}} assay built on mice that allow liver lysosomes to be isolated, with a "lysosomal barcoding" method, and from it a new {{< term "ionisable-lipid" >}}ionisable lipid{{< /term >}}, BiP-20.<sup class="fr-ref"><a href="#ref-11">11</a></sup> I read only the abstract-level summary of that paper.

<figure class="fr-fig fr-fig-wide">
  <img src="/horizon/drug-delivery/endosomalescape.webp" alt="Panels a and b are cell-and-vesicle schematics showing lipid nanoparticles entering by endocytosis and either staying trapped in the endosome or escaping to release RNA or iron oxide particles. Panels c to g are an infrared spectrum, a magnetisation curve, a bar chart of surface charge, a size distribution and electron micrographs of the particles." width="546" height="445" loading="lazy">
  <figcaption><strong>Fig. 6.</strong> How the 2025 MRI method works. (a) RNA in lipid nanoparticles must escape the endosome to work. (b) The same particles loaded with iron oxide: the magnetic signal changes as the iron is released. (c to g) Tests that characterise the particles, including electron micrographs. <span class="fr-credit">Figure: Lee et al., <em>Advanced Healthcare Materials</em> (2025), CC BY 4.0. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12645086/">Source</a></span></figcaption>
</figure>

<figure class="fr-fig fr-fig-tall">
  <img src="/horizon/drug-delivery/endosomalescapem.webp" alt="Four stacked rows, A to D, of dark microscope images. Each row has a wide view of green cell material with small magenta speckles and a boxed region enlarged on the right, with scale bars." width="520" height="827" loading="lazy">
  <figcaption><strong>Fig. 7.</strong> Fluorescence microscope images of cells, panels A to D, each with an enlarged inset. The meaning of the green and magenta channels is given in the original figure legend. <span class="fr-credit">Figure: from the 2022 <em>Journal of Cell Biology</em> article on endosomal escape of delivered mRNA. <a href="https://rupress.org/jcb/article/221/2/e202110137/212896/Endosomal-escape-of-delivered-mRNA-from-endosomal">Source</a></span></figcaption>
</figure>

<p class="fr-label">The numbers</p>

- **About 1 to 2%** of siRNA escaping in the 2013 imaging study.<sup class="fr-ref"><a href="#ref-8">8</a></sup>
- **About 8%** of BiP-20 particles reaching the cytosol within 30 minutes in liver, according to the 2026 abstract-level summary, with eightfold better gene editing of the TTR gene at low dose than a clinical benchmark lipid (LP01). The same work reports that losing a protein called Rab7, which helps endosomes mature, increased escape.<sup class="fr-ref"><a href="#ref-11">11</a></sup>
- **A 2025 caution:** the MRI study's own escape index came out higher than the literature, and its authors attribute that to using bulky iron oxide particles as stand-ins rather than tracking RNA directly.<sup class="fr-ref"><a href="#ref-9">9</a></sup>
- **Upstream losses:** an analysis of 117 published papers found a median of only 0.7% of an injected nanoparticle dose reaching a solid tumour.<sup class="fr-ref"><a href="#ref-10">10</a></sup>

<p class="fr-label">The maths under the hood</p>

<div class="fr-math">

**Step 1: the delivery budget multiplies.** The share of the injected dose that ends up working in the cytosol of the target cells is the product of the fractions kept at each hurdle:

$$ f_{\text{cytosol}} = f_{\text{reach}} \times f_{\text{uptake}} \times f_{\text{escape}} $$

Take the tumour figure of 0.7% reaching the tissue,<sup class="fr-ref"><a href="#ref-10">10</a></sup> an illustrative 30% of that taken up by cells (this one is a made-up round number, not a measurement), and 2% escaping.<sup class="fr-ref"><a href="#ref-8">8</a></sup> Then 0.007 &times; 0.30 &times; 0.02 = 4.2 &times; 10<sup>-5</sup>, or 0.0042% of the dose. In other words, about 24,000 injected molecules for each one that reaches the cytosol.

**Step 2: headroom.** For any stage with fraction f, the most that stage can improve the outcome is a factor of 1 / f (at most 100% kept). The 2% escape stage has up to 50 times of headroom; a stage already at 30% has only 3.3 times. Raising escape from 2% to 8%, as in the newest result above, multiplies the end result by 4 (to 0.0168%) without touching anything upstream.

**Step 3: the trap.** These stages are not independent or fixed. Particle size and surface change both tissue reach and uptake, a dose that saturates the cell changes the fractions, and a small cytosolic number can still be plenty when the cargo is catalytic, such as an editing enzyme or an {{< term "mrna" >}}mRNA{{< /term >}} translated many times. Treat the budget as a way to ask where the loss is, not as a prediction.

</div>

<div class="fr-lab" id="fr-lab-budget" data-toc-label="Try the delivery-budget lab">
  <h3>Try it: the delivery budget</h3>
  <p class="fr-lab-intro">Move the three sliders to set how much of the dose survives each hurdle, or press a preset. The bars show the share of the injected dose still in play after each stage, on a log scale because the losses multiply. Start with the typical tumour case, then press the better-escape preset.</p>
  <div class="fr-lab-presets">
    <button type="button" class="fr-lab-btn" data-preset="tumour">Typical tumour nanoparticle (0.7%, 30%, 2%)</button>
    <button type="button" class="fr-lab-btn" data-preset="better">Better escape lipid (escape 8%)</button>
  </div>
  <div class="fr-lab-controls">
    <label class="fr-lab-slider"><span>Reaches the target tissue <output id="fr-bud-reach-out"></output></span><input type="range" id="fr-bud-reach" min="-1000" max="2000" step="1" value="-155"></label>
    <label class="fr-lab-slider"><span>Taken up by target cells <output id="fr-bud-uptake-out"></output></span><input type="range" id="fr-bud-uptake" min="-1000" max="2000" step="1" value="1477"></label>
    <label class="fr-lab-slider"><span>Escapes the endosome <output id="fr-bud-escape-out"></output></span><input type="range" id="fr-bud-escape" min="-1000" max="2000" step="1" value="301"></label>
  </div>
  <svg id="fr-bud-plot" class="fr-lab-plot" viewBox="0 0 640 230" role="img" aria-label="Horizontal bars on a log scale showing the share of the injected dose remaining after reaching the tissue, entering cells and escaping the endosome"></svg>
  <div id="fr-bud-readout" class="fr-lab-readout" aria-live="polite"></div>
  <p class="fr-lab-note">Toy model: three independent fractions multiplied together. Only the 0.7% tissue figure (a median across published tumour studies) and the 1 to 2% and 8% escape figures come from the sources; the uptake value is illustrative. Real stages interact and differ by tissue, particle and cell.</p>
</div>

<p class="fr-label">Where it is contested</p>

The headline number is slippery. The 1 to 2% figure comes from siRNA in one system and has been repeated for over a decade; newer methods read out different things (fluorescence, magnetic signal, reporter genes, barcoded lysosomes) and do not give the same number, as the 2025 authors admit about their own index. The 2026 result also comes with its own assumptions, and I did not read the full paper. And a low percentage is not automatically a failure: some therapies work with very few molecules in the cytosol, which is why a 4 times better escape rate does not guarantee a 4 times better drug.<sup class="fr-ref"><a href="#ref-9">9</a></sup><sup class="fr-ref"><a href="#ref-11">11</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Methods agree escape is low, but disagree on how low</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Closeness to the clinic</span><span class="fr-bar" role="img" aria-label="2 out of 5"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span><span class="fr-meter-note">Mechanistic science that already guides clinical lipid design</span></div>
</div>

<p class="fr-label">The biology underneath</p>

An endosome is the cell's sorting station, and the whole story is endomembrane trafficking seen from the cargo's point of view: vesicle uptake, acidification, maturation and fusion with the lysosome. The lipids that help RNA escape work by disturbing the endosomal membrane, which is why it also matters to know lipids and membrane biochemistry. Once free, an mRNA meets the machinery of translation.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/1-cell-molecular/endomembrane-system-protein-trafficking" label="Endomembrane System and Protein Trafficking" why="uptake, acidification and fusion" >}}
{{< notebtn path="/resources/1-cell-molecular/lipids-membrane-biochemistry" label="Lipids and Membrane Biochemistry" why="why lipids can disturb a membrane" >}}
{{< notebtn path="/resources/1-cell-molecular/translation-genetic-code" label="Translation and the Genetic Code" why="what an mRNA does once free" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: where would you spend your effort?</summary>
<div>
<p>Use the lab to compare two projects: one that triples the share reaching the tissue, and one that triples endosomal escape. Why do they give the same result in the budget? What real-world considerations (safety, cost, off-target tissues, headroom) would make you choose one over the other?</p>
</div>
</details>

</div>

## What happens next

<div class="fr-timeline">
  <div class="fr-tl-item"><span class="fr-tl-date">Now</span><p><strong>Rentosertib</strong> {{< term "clinical-trial-phases" >}}Phase III{{< /term >}}: a 52-week trial in 320 patients at 47 centres in China, announced July 2026 by the sponsor.<sup class="fr-ref"><a href="#ref-2">2</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">Ongoing</span><p><strong>Tividenofusp alfa</strong> must show clinical benefit in its randomised confirmatory trial to keep its {{< term "accelerated-approval" >}}accelerated approval{{< /term >}}.<sup class="fr-ref"><a href="#ref-5">5</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">2028</span><p><strong>TRONTIER 1 and 2</strong>, the Phase 3 trials of {{< term "trontinemab" >}}trontinemab{{< /term >}} for early {{< term "alzheimers-disease" >}}Alzheimer's disease{{< /term >}}, have an estimated completion in 2028.<sup class="fr-ref"><a href="#ref-7">7</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">2032</span><p><strong>PrevenTRON</strong>, a trontinemab prevention trial in 1,600 people without symptoms, began recruiting in September 2026 with an estimated completion in September 2032.<sup class="fr-ref"><a href="#ref-7">7</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">Unscheduled</span><p><strong>Longer follow-up of the CPS1 patient</strong> and any further customised editors: the authors call for it but no schedule is stated.<sup class="fr-ref"><a href="#ref-4">4</a></sup></p></div>
</div>

## Where this meets your syllabus

<div class="fr-table-wrap">
<table class="fr-table">
<thead><tr><th>Story</th><th>Concepts you can practise with it</th><th>Study next</th></tr></thead>
<tbody>
<tr><td>1. Designed drug</td><td>Enzymes and kinases, signalling, reading a clinical trial, lung function</td><td>{{< notebtn path="/resources/1-cell-molecular/enzyme-kinetics-regulation" label="Enzyme Kinetics and Regulation" compact=true >}}{{< notebtn path="/resources/1-cell-molecular/cell-signaling-communication" label="Cell Signalling" compact=true >}}</td></tr>
<tr><td>2. Venom binders</td><td>Protein structure and folding, binding affinity, antibodies and antigens</td><td>{{< notebtn path="/resources/1-cell-molecular/protein-structure-folding-function" label="Protein Structure, Folding and Function" compact=true >}}{{< notebtn path="/resources/3-animal-physiology/immune-physiology" label="Immune Physiology" compact=true >}}</td></tr>
<tr><td>3. One baby</td><td>Compound heterozygotes, the urea cycle, lipid nanoparticles, DNA editing</td><td>{{< notebtn path="/resources/7-genetics/pedigree-analysis-human-genetic-disorders" label="Pedigree Analysis and Human Genetic Disorders" compact=true >}}{{< notebtn path="/resources/3-animal-physiology/digestive-metabolic-physiology" label="Digestive and Metabolic Physiology" compact=true >}}</td></tr>
<tr><td>4. Brain shuttle</td><td>Receptor-mediated transport, tight junctions, surrogate versus clinical endpoints</td><td>{{< notebtn path="/resources/1-cell-molecular/plasma-membrane-structure-transport" label="Plasma Membrane Structure and Transport" compact=true >}}{{< notebtn path="/resources/3-animal-physiology/nervous-system-physiology" label="Nervous System Physiology" compact=true >}}</td></tr>
<tr><td>5. The 2% problem</td><td>Endocytosis, endosome maturation, membrane lipids, multiplying fractions</td><td>{{< notebtn path="/resources/1-cell-molecular/endomembrane-system-protein-trafficking" label="Endomembrane System and Protein Trafficking" compact=true >}}{{< notebtn path="/resources/1-cell-molecular/lipids-membrane-biochemistry" label="Lipids and Membrane Biochemistry" compact=true >}}</td></tr>
</tbody>
</table>
</div>

## Glossary

{{< faq-item q="In silico" >}}
Done on a computer, as opposed to in vitro (in a dish) or in vivo (in a living organism). A design that works in silico has only passed the first and cheapest test.
{{< /faq-item >}}

{{< faq-item q="Surrogate endpoint" >}}
A measurable stand-in, such as a level of a molecule in spinal fluid, that is expected to predict a real outcome like how a patient feels or lives. It speeds up approval but can turn out to be a poor predictor.
{{< /faq-item >}}

{{< faq-item q="Accelerated approval" >}}
A US regulatory route that approves a drug early on a surrogate endpoint, with a requirement to confirm clinical benefit afterwards. The approval can be withdrawn if the confirmatory trial fails.
{{< /faq-item >}}

{{< faq-item q="Phase I, II and III trials" >}}
Phase I mainly tests safety in a small group. Phase II looks for signs of benefit and the right dose, in more people. Phase III tests whether the drug works, in hundreds or thousands, compared with placebo or standard care.
{{< /faq-item >}}

{{< faq-item q="Forced vital capacity (FVC)" >}}
The largest volume of air a person can forcibly breathe out after a full breath, measured in millilitres. In scarring lung disease it falls over time.
{{< /faq-item >}}

{{< faq-item q="Dissociation constant (Kd)" >}}
The concentration of a ligand at which half of its binding sites are occupied. A smaller value means tighter binding; nanomolar values are considered strong.
{{< /faq-item >}}

{{< faq-item q="Base editor" >}}
A protein that changes one letter of DNA into another at a chosen spot, without making a full double-strand cut. It is guided to the spot by a guide RNA.
{{< /faq-item >}}

{{< faq-item q="Lipid nanoparticle (LNP)" >}}
A tiny fat-based bubble that carries RNA through the blood and into cells. Its ionisable lipids are neutral in blood but become positively charged in the acidic endosome, which helps disturb the membrane.
{{< /faq-item >}}

{{< faq-item q="Compound heterozygote" >}}
A person who carries two different disease-causing variants of the same gene, one on each copy. Fixing one of them may or may not be enough to restore function.
{{< /faq-item >}}

{{< faq-item q="Receptor-mediated transcytosis" >}}
A route where a cell takes up a cargo by binding a surface receptor, carries it across the cell in vesicles, and releases it on the other side. It is how the blood-brain barrier lets in iron on transferrin, and what brain shuttles borrow.
{{< /faq-item >}}

{{< faq-item q="Endosome" >}}
A membrane-bound compartment formed when a cell takes in material from outside. It acidifies as it matures and often fuses with lysosomes that break down its contents.
{{< /faq-item >}}

## Sources

<ol class="fr-refs">
  <li id="ref-1">A generative AI-discovered TNIK inhibitor for idiopathic pulmonary fibrosis: a randomized phase 2a trial. <em>Nature Medicine</em> (2025). <a href="https://doi.org/10.1038/s41591-025-03743-2">doi:10.1038/s41591-025-03743-2</a>. Read via the open PMC copy: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12353801/">PMC12353801</a>.</li>
  <li id="ref-2">Insilico Medicine. Insilico initiates Phase III clinical trial for rentosertib, its AI-empowered TNIK inhibitor for idiopathic pulmonary fibrosis. Press release, 7 July 2026 (company announcement, not independent evidence). <a href="https://www.prnewswire.com/news-releases/insilico-initiates-phase-iii-clinical-trial-for-rentosertib-its-ai-empowered-tnik-inhibitor-for-idiopathic-pulmonary-fibrosis-302819553.html">PR Newswire</a></li>
  <li id="ref-3">Vázquez Torres S et al. De novo designed proteins neutralize lethal snake venom toxins. <em>Nature</em> (2025). <a href="https://doi.org/10.1038/s41586-024-08393-x">doi:10.1038/s41586-024-08393-x</a>. Numbers above were read from the preprint version, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC11118692/">PMC11118692</a> (Research Square, doi:10.21203/rs.3.rs-4402792/v1), and may differ from the published paper.</li>
  <li id="ref-4">Musunuru K et al. Patient-specific in vivo gene editing to treat a rare genetic disease. <em>N Engl J Med</em> 392:2235-2243 (2025). <a href="https://doi.org/10.1056/NEJMoa2504747">doi:10.1056/NEJMoa2504747</a></li>
  <li id="ref-5">US Food and Drug Administration. FDA approves drug to treat neurologic manifestations of Hunter syndrome. Press announcement, March 2026. <a href="https://www.fda.gov/news-events/press-announcements/fda-approves-drug-treat-neurologic-manifestations-hunter-syndrome">fda.gov</a></li>
  <li id="ref-6">Pardridge WM. Advanced blood-brain barrier drug delivery. <em>Pharmaceutics</em> 15:93 (2023). <a href="https://doi.org/10.3390/pharmaceutics15010093">doi:10.3390/pharmaceutics15010093</a>. Read via <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9866552/">PMC9866552</a>. Used only for the share of small molecules that cross the barrier.</li>
  <li id="ref-7">Alzforum. Trontinemab (therapeutics database entry), reading of AAIC 2025 data and trial status. Secondary coverage, not the primary papers. <a href="https://www.alzforum.org/therapeutics/trontinemab">alzforum.org</a></li>
  <li id="ref-8">Gilleron J et al. Image-based analysis of lipid nanoparticle-mediated siRNA delivery, intracellular trafficking and endosomal escape. <em>Nature Biotechnology</em> 31:638-646 (2013). <a href="https://www.nature.com/articles/nbt.2612">nature.com/articles/nbt.2612</a>. Abstract-level reading only.</li>
  <li id="ref-9">Lee S et al. Magnetic resonance imaging-based quantification of endosomal escape using iron oxide nanoparticle-loaded lipid nanoparticles. <em>Advanced Healthcare Materials</em> 14(30):e03055 (2025). <a href="https://doi.org/10.1002/adhm.202503055">doi:10.1002/adhm.202503055</a>. Open copy: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12645086/">PMC12645086</a>.</li>
  <li id="ref-10">Wilhelm S, Chan WCW et al. Analysis of nanoparticle delivery to tumours. <em>Nature Reviews Materials</em> 1:16014 (2016). <a href="https://www.nature.com/articles/natrevmats201614">nature.com/articles/natrevmats201614</a>. Abstract-level reading only.</li>
  <li id="ref-11">In vivo endosomal escape assay identifies mechanisms for efficient hepatic LNP delivery. <em>Nature Biotechnology</em> (March 2026). <a href="https://doi.org/10.1038/s41587-026-03022-6">doi:10.1038/s41587-026-03022-6</a>. Abstract-level summary only; the full paper was behind a sign-in page and was not read.</li>
</ol>

<div class="fr-footer-note">
  <p>This page is educational and is not medical advice. Meters are editorial ratings, not an official scale. Status and schedule details were last checked on 4 October 2026 and will age; spotted something out of date or wrong? Email <a href="mailto:resourcerepository4boguide@gmail.com">resourcerepository4boguide@gmail.com</a>.</p>
</div>

</div>
