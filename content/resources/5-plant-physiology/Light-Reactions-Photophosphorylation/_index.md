---
title: "Light Reactions & Photophosphorylation"
weight: 5
description: "Photosystem I and II structure and function, the Z-scheme of electron flow, water-splitting at the oxygen-evolving complex, chemiosmotic ATP synthesis across the thylakoid membrane, and the cyclic electron flow pathway supplementing ATP output when NADPH demand is already met."
difficulty: "advanced"
prerequisites: []
syllabus_tags: ["IBO", "USABO", "foundations"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

Photosynthesis is conventionally split into two linked stages: the **light reactions**, which convert light energy into the chemical energy carriers ATP and NADPH, and **carbon fixation**, which uses those carriers to build sugar from CO₂ (covered on [Carbon Fixation: Calvin Cycle, Photorespiration & C4/CAM Biochemistry](../calvin-cycle-photorespiration-c4-cam/)). This page covers the light reactions: how chlorophyll captures a photon, how that energy is used to strip electrons from water, and how the resulting electron flow across the thylakoid membrane is coupled to ATP synthesis. [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/) covered where this happens (chloroplast-dense mesophyll cells) and, for C4/CAM plants, the anatomical arrangement that later separates this from carbon fixation spatially or temporally; this page covers the biochemistry itself, which Leaf Anatomy explicitly deferred.

## Key Concepts

### Photosystem Structure and Light Capture

A **photosystem** is a large pigment-protein complex embedded in the thylakoid membrane, consisting of a **light-harvesting complex** (an antenna of chlorophyll *a*, chlorophyll *b*, and accessory carotenoid pigments, each absorbing a slightly different wavelength range so the complex collectively captures a broader slice of the visible spectrum than any single pigment could) surrounding a **reaction center**: a specific pair of chlorophyll *a* molecules where the captured energy is ultimately used to eject an electron. Energy absorbed anywhere in the antenna is passed molecule to molecule by **resonance energy transfer** until it reaches the reaction center, where it excites an electron enough to be donated to a primary electron acceptor, the point at which light energy first becomes chemical (redox) energy.

Two spectrally distinct photosystems exist in the thylakoid membrane, named historically by order of discovery rather than order of function:

- **Photosystem II (PSII)**, reaction center **P680** (absorbs maximally near 680 nm)
- **Photosystem I (PSI)**, reaction center **P700** (absorbs maximally near 700 nm)

![How a photosystem harvests light: a photon absorbed anywhere in the light-harvesting complex's pigment molecules is passed by resonance energy transfer to the special pair of chlorophyll a molecules in the reaction-center complex, which ejects an electron to the primary electron acceptor](/PLANTPHYSIOPICS/photosystem-structure.avif)
*Source: Preach Bio*

### The Z-Scheme: Linear Electron Flow

The two photosystems operate in series, connected by an electron transport chain, in a pathway conventionally drawn as a redox-potential diagram shaped like the letter Z (rising at each photosystem, falling between them):

1. Light excites **P680** in PSII, ejecting an electron to the primary acceptor. The resulting P680⁺ is an extremely strong oxidant, strong enough to pull electrons from water itself.
2. The **oxygen-evolving complex** (a manganese-cluster catalytic site associated with PSII) splits water: $$ 2\text{H}_2\text{O} \rightarrow 4\text{H}^+ + 4e^- + \text{O}_2 $$ replacing the electrons P680 lost, and releasing O₂ as a byproduct, the source of essentially all atmospheric photosynthetic oxygen, and the reaction the entire light-reaction system exists to drive.
3. The ejected electron passes down an electron transport chain (plastoquinone → cytochrome b₆f complex → plastocyanin), losing energy at each step; this energy loss is harnessed at the cytochrome b₆f complex to pump additional protons into the thylakoid lumen (see chemiosmosis below).
4. The electron reaches **PSI**, replacing an electron that PSI's own reaction center, P700, lost when it absorbed light independently.
5. The electron ejected from P700 passes through a short second transport chain (ferredoxin) to **NADP⁺ reductase**, which reduces NADP⁺ to **NADPH**, the second energy carrier the Calvin cycle requires.

Because electrons flow in one direction only, from water through both photosystems to NADP⁺, and are never recycled back to PSII, this route is called **linear (noncyclic) electron flow**, and it produces both ATP (via the proton gradient built up along the way) and NADPH in a fixed ratio.

```mermaid
graph LR;
    W["H2O (oxygen-evolving complex)"] --> P2["PSII (P680)"];
    P2 --> ETC1["Plastoquinone -> Cytochrome b6f (H+ pumped)"];
    ETC1 --> P1["PSI (P700)"];
    P1 --> ETC2["Ferredoxin"];
    ETC2 --> NADP["NADP+ reductase -> NADPH"];
```

![Full Z-scheme of electron transport: redox potential plotted against each carrier from water/oxygen-evolving complex through PSII (P680), the plastoquinone-cytochrome b6f-plastocyanin chain, PSI (P700), and ferredoxin to NADP+ reductase, with approximate timescales for each transfer step](/PLANTPHYSIOPICS/z-scheme-electron-flow.png)
*Source: ResearchGate, fig. 6 (diagram modified from Demeter & Govindjee, 1989, per in-image credit)*

![Oxygen-evolving complex detail: (A) the Mn4CaO5 cluster and its position relative to Tyrz, P680, pheophytin, and the QA/QB plastoquinone acceptors within the PSII protein structure; (B) the Kok cycle of S-state transitions (S0-S4) through which the complex accumulates oxidizing power before releasing O2](/PLANTPHYSIOPICS/oxygen-evolving-complex.png)
*Source: Frontiers in Plant Science*

### Chemiosmotic ATP Synthesis

Protons accumulate in the thylakoid lumen from two sources acting together: directly from water-splitting (step 2 above) and from active pumping by the cytochrome b₆f complex (step 3). Because the thylakoid membrane is otherwise impermeable to H⁺, this produces a steep proton gradient (both a concentration gradient and, since the lumen becomes positively charged, an electrical gradient) across the membrane, a **proton motive force** conceptually identical to the one driving oxidative phosphorylation in mitochondrial respiration, but built from light-driven electron transport instead. Protons can only cross back out through **ATP synthase**, a membrane-embedded enzyme that couples the energetically favorable flow of H⁺ down its gradient to the energetically unfavorable synthesis of ATP from ADP + Pᵢ, the process of **photophosphorylation**, mechanistically chemiosmotic (a proton gradient across a membrane driving ATP synthase) rather than substrate-level.

![Chemiosmotic ATP synthesis across the thylakoid membrane: water-splitting and photosystem II electron transport deposit H+ in the lumen, PSII/electron carriers move electrons toward NADP+ reduction in the stroma, and ATP synthase uses the resulting H+ gradient to phosphorylate ADP, producing ATP for the Calvin cycle](/PLANTPHYSIOPICS/thylakoid-chemiosmosis.png)
*Source: © Merriam-Webster, Inc.*

### Cyclic Electron Flow

When a chloroplast's NADPH supply is already saturated relative to its ATP demand (common when Calvin cycle activity, and therefore NADPH consumption, is limited relative to other cellular ATP needs), electrons ejected from PSI's P700 can be redirected back into the cytochrome b₆f complex instead of continuing to NADP⁺ reductase, a route called **cyclic electron flow**. This bypasses PSII entirely (no water-splitting, no O₂ released, no NADPH produced) but still pumps protons via cytochrome b₆f, generating additional ATP without additional NADPH, a way to fine-tune the ATP:NADPH ratio the Calvin cycle actually needs (a ratio the strict linear pathway alone cannot supply, since it always produces both products in a fixed proportion).

![Cyclic photophosphorylation: an electron ejected from the PSI special pair (reaction center) passes through ferredoxin, a plastoquinone-like carrier, and cytochrome b/cytochrome f back to PSI, pumping protons that drive ATP synthesis (ADP + Pi to ATP) without involving PSII or producing NADPH](/PLANTPHYSIOPICS/cyclic-electron-flow.png)
*Source: Biology Reader (credit in image)*

## Comparative Structures

| Feature | Linear (noncyclic) electron flow | Cyclic electron flow |
|---|---|---|
| Photosystems involved | Both PSII and PSI | PSI only |
| Electron source | Water (via oxygen-evolving complex) | Recycled from PSI itself |
| O2 released? | Yes | No |
| NADPH produced? | Yes | No |
| ATP produced? | Yes | Yes |
| When favored | Balanced ATP/NADPH demand | NADPH supply already sufficient, additional ATP needed |

## Common Exam Questions

- "Trace an electron's path from water to NADPH, naming every intermediate carrier and both photosystems in order."
- "Explain why splitting water is necessary for PSII to continue functioning, referencing the redox potential of P680+."
- "Explain chemiosmotic ATP synthesis in the chloroplast, identifying the two sources of the thylakoid lumen proton gradient."
- "Explain why cyclic electron flow produces ATP but no NADPH, and under what physiological circumstance a chloroplast would favor it over linear flow."
- "Explain why atmospheric oxygen is considered a byproduct of the light reactions rather than their purpose."

## Visual Reference

**Interactive**

- **Z-scheme electron flow tracer (click-through SVG/JS, no new library)**, a redox-potential Z-diagram; clicking "step" moves a highlighted electron marker from water through the oxygen-evolving complex, PSII, the electron transport chain, PSI, and finally to NADP+ reductase, with each step's energy change and any proton-pumping event annotated as it happens.

<div id="zscheme-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 420 220" width="100%" style="max-width:440px; display:block; margin:0 auto;">
    <text x="10" y="15" font-size="10" fill="#4b5563">high energy</text>
    <text x="10" y="215" font-size="10" fill="#4b5563">low energy</text>
    <path d="M40 190 L40 60 L140 65 L140 170 L240 175 L240 40 L340 45 L340 150 L400 155" fill="none" stroke="#cbd5e1" stroke-width="3"/>
    <circle id="zNode0" cx="40" cy="190" r="6" fill="#94a3b8"/>
    <circle id="zNode1" cx="40" cy="60" r="6" fill="#94a3b8"/>
    <circle id="zNode2" cx="140" cy="170" r="6" fill="#94a3b8"/>
    <circle id="zNode3" cx="240" cy="175" r="6" fill="#94a3b8"/>
    <circle id="zNode4" cx="240" cy="40" r="6" fill="#94a3b8"/>
    <circle id="zNode5" cx="340" cy="150" r="6" fill="#94a3b8"/>
    <circle id="zNode6" cx="400" cy="155" r="6" fill="#94a3b8"/>
    <text x="40" y="205" font-size="9" text-anchor="middle" fill="#334155">H2O</text>
    <text x="40" y="50" font-size="9" text-anchor="middle" fill="#334155">P680*</text>
    <text x="140" y="185" font-size="9" text-anchor="middle" fill="#334155">ETC/Cyt b6f</text>
    <text x="240" y="190" font-size="9" text-anchor="middle" fill="#334155">P700</text>
    <text x="240" y="30" font-size="9" text-anchor="middle" fill="#334155">P700*</text>
    <text x="340" y="140" font-size="9" text-anchor="middle" fill="#334155">Fd</text>
    <text x="400" y="170" font-size="9" text-anchor="middle" fill="#334155">NADPH</text>
    <circle id="zMarker" cx="40" cy="190" r="9" fill="#1d70a2" stroke="#fff" stroke-width="2"/>
  </svg>
  <div style="text-align:center;">
    <button id="zStepBtn" style="background:#2d6a4f; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Step &#8594;</button>
    <div id="zNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563; min-height:2.4em;">Start: water at the oxygen-evolving complex, ready to donate electrons to PSII.</div>
  </div>
</div>
<script>
(function(){
  var marker = document.getElementById('zMarker');
  var note = document.getElementById('zNote');
  var btn = document.getElementById('zStepBtn');
  var nodes = [
    {x:40,y:190,text:'Start: water at the oxygen-evolving complex, ready to donate electrons to PSII.'},
    {x:40,y:60,text:'Light excites P680 in PSII; the oxygen-evolving complex splits water, replacing the ejected electron and releasing O2.'},
    {x:140,y:170,text:'The electron passes down the electron transport chain (plastoquinone to cytochrome b6f), losing energy that pumps H+ into the thylakoid lumen.'},
    {x:240,y:175,text:'The electron reaches P700 (PSI), replacing an electron PSI lost when it absorbed light independently.'},
    {x:240,y:40,text:'Light excites P700 to P700*, ejecting a new high-energy electron.'},
    {x:340,y:150,text:'The electron passes to ferredoxin.'},
    {x:400,y:155,text:'NADP+ reductase uses the electron to reduce NADP+ to NADPH, the second energy carrier for the Calvin cycle.'}
  ];
  var i = 0;
  function render(){
    marker.setAttribute('cx', nodes[i].x);
    marker.setAttribute('cy', nodes[i].y);
    note.textContent = nodes[i].text;
    btn.textContent = i === nodes.length - 1 ? 'Restart' : 'Step →';
  }
  btn.addEventListener('click', function(){
    i = (i + 1) % nodes.length;
    render();
  });
  render();
})();
</script>

- **Linear vs. cyclic electron flow toggle**: the same thylakoid membrane diagram toggles between full linear flow (both photosystems, O2 released, NADPH produced) and cyclic flow (PSI only, electron rerouted back to cytochrome b6f, no O2/NADPH), making the "PSII bypass" visible as a rerouting rather than a separate diagram to memorize.

<div id="cyclic-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 400 160" width="100%" style="max-width:420px; display:block; margin:0 auto;">
    <rect id="cPSII" x="30" y="60" width="70" height="40" rx="6" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
    <text x="65" y="84" text-anchor="middle" font-size="11" fill="#1a472a">PSII</text>
    <path id="cPathWater" d="M10 80 H30" stroke="#1d70a2" stroke-width="3" marker-end="url(#cArrow)"/>
    <text id="cO2Label" x="15" y="70" font-size="9" fill="#1d70a2">H2O/O2</text>
    <path id="cPathToETC" d="M100 80 H160" stroke="#1d70a2" stroke-width="3" marker-end="url(#cArrow)"/>
    <rect x="160" y="60" width="70" height="40" rx="6" fill="#e0ecf7" stroke="#1d70a2" stroke-width="2"/>
    <text x="195" y="84" text-anchor="middle" font-size="10" fill="#1d70a2">Cyt b6f</text>
    <path id="cPathToPSI" d="M230 80 H290" stroke="#1d70a2" stroke-width="3" marker-end="url(#cArrow)"/>
    <rect x="290" y="60" width="70" height="40" rx="6" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
    <text x="325" y="84" text-anchor="middle" font-size="11" fill="#1a472a">PSI</text>
    <path id="cPathToFd" d="M325 60 V25 H340" stroke="#7c3aed" stroke-width="3" marker-end="url(#cArrowPurple)"/>
    <text x="330" y="18" font-size="9" fill="#7c3aed">Fd</text>
    <path id="cPathToNADPH" d="M360 25 H385" stroke="#7c3aed" stroke-width="3" marker-end="url(#cArrowPurple)"/>
    <text id="cNADPHLabel" x="365" y="15" font-size="9" fill="#7c3aed">NADPH</text>
    <path id="cCyclicReturn" d="M325 25 Q195 5 195 60" fill="none" stroke="#b45309" stroke-width="3" stroke-dasharray="4 3" opacity="0" marker-end="url(#cArrowOrange)"/>
    <defs>
      <marker id="cArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1d70a2"/></marker>
      <marker id="cArrowPurple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c3aed"/></marker>
      <marker id="cArrowOrange" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b45309"/></marker>
    </defs>
  </svg>
  <div style="text-align:center;">
    <button class="c-btn" id="cLinearBtn" style="background:#2d6a4f; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer; margin-right:8px;">Linear flow</button>
    <button class="c-btn" id="cCyclicBtn" style="background:#94a3b8; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Cyclic flow</button>
    <div id="cNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563;">Linear flow: both photosystems in series, water split, O2 released, NADPH produced.</div>
  </div>
</div>
<script>
(function(){
  var linearBtn = document.getElementById('cLinearBtn');
  var cyclicBtn = document.getElementById('cCyclicBtn');
  var note = document.getElementById('cNote');
  var psii = document.getElementById('cPSII');
  var waterPath = document.getElementById('cPathWater');
  var toETC = document.getElementById('cPathToETC');
  var o2Label = document.getElementById('cO2Label');
  var toNADPH = document.getElementById('cPathToNADPH');
  var nadphLabel = document.getElementById('cNADPHLabel');
  var cyclicReturn = document.getElementById('cCyclicReturn');
  function setLinear(isLinear){
    psii.setAttribute('opacity', isLinear ? 1 : 0.3);
    waterPath.setAttribute('opacity', isLinear ? 1 : 0);
    toETC.setAttribute('opacity', isLinear ? 1 : 0);
    o2Label.setAttribute('opacity', isLinear ? 1 : 0);
    toNADPH.setAttribute('opacity', isLinear ? 1 : 0);
    nadphLabel.setAttribute('opacity', isLinear ? 1 : 0);
    cyclicReturn.style.opacity = isLinear ? 0 : 1;
    linearBtn.style.background = isLinear ? '#2d6a4f' : '#94a3b8';
    cyclicBtn.style.background = isLinear ? '#94a3b8' : '#2d6a4f';
    note.textContent = isLinear
      ? 'Linear flow: both photosystems in series, water split, O2 released, NADPH produced.'
      : 'Cyclic flow: PSII is bypassed entirely. The electron ejected from PSI loops back through cytochrome b6f instead of continuing to NADP+ reductase. No water-splitting, no O2, no NADPH, but the proton pumping at cytochrome b6f still generates extra ATP.';
  }
  linearBtn.addEventListener('click', function(){ setLinear(true); });
  cyclicBtn.addEventListener('click', function(){ setLinear(false); });
  setLinear(true);
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. A chemical inhibitor blocks the oxygen-evolving complex specifically. Predict the effect on O2 release, PSII electron flow, and ultimately NADPH production, and explain the causal chain connecting them.
2. Explain why PSII and PSI are numbered in the order they were discovered rather than the order electrons pass through them, and state the correct functional order.
3. A chloroplast's ATP:NADPH output ratio needs to increase without any additional water being split. Identify the mechanism that could achieve this and explain why it does not increase NADPH output.
4. Explain why the thylakoid lumen becomes both more acidic and more positively charged during active linear electron flow, and how ATP synthase uses this combined gradient.
5. Distinguish photophosphorylation from substrate-level phosphorylation, referencing the specific mechanism ATP synthase depends on.
