---
title: "Calvin Cycle, Photorespiration & C4/CAM Biochemistry"
weight: 6
description: "The three-phase Calvin cycle fixing CO2 into sugar using the ATP/NADPH from the light reactions, Rubisco's oxygenase side-reaction and the photorespiration/glycolate pathway it triggers, and the C4 and CAM biochemical strategies that concentrate CO2 around Rubisco to suppress that side-reaction, paired with the Kranz and CAM anatomy already covered in Plant Anatomy."
difficulty: "advanced"
prerequisites: ["Light-Reactions-Photophosphorylation"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

The light reactions (see [Light Reactions & Photophosphorylation](../light-reactions-photophosphorylation/)) produce ATP and NADPH but no sugar; carbon fixation uses those carriers to actually build carbohydrate from atmospheric CO₂. This page covers the **Calvin cycle** itself, the costly side-reaction (**photorespiration**) that its central enzyme is prone to under hot, dry, high-light conditions, and the two independent biochemical fixes (**C4** and **CAM** metabolism) that most severely affected lineages evolved to suppress it. [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/) already covered the anatomical arrangement enabling each fix (Kranz anatomy's bundle sheath ring, CAM's succulent water-storing mesophyll); this page covers the biochemistry that arrangement exists to support.

## Key Concepts

### The Calvin Cycle

The Calvin cycle runs in the chloroplast stroma in three phases, using 3 CO₂ molecules (fixed one at a time) as a convenient unit to track the stoichiometry through a full turn:

1. **Carbon fixation**: **Rubisco** (ribulose-1,5-bisphosphate carboxylase/oxygenase, the most abundant enzyme on Earth by mass, a reflection of how slow and inefficient its carboxylase reaction is per active site) catalyzes the addition of CO₂ to the 5-carbon sugar **RuBP**, producing an unstable 6-carbon intermediate that immediately splits into two molecules of the 3-carbon compound **3-phosphoglycerate (3-PGA)**.
2. **Reduction**, in which each 3-PGA is phosphorylated by ATP and then reduced by NADPH (both supplied by the light reactions) to **glyceraldehyde-3-phosphate (G3P)**. This is the cycle's only redox step and the point where light-reaction energy is actually invested into a carbon skeleton. Of every 6 G3P produced per 3 CO₂ fixed, 1 exits the cycle as net carbohydrate output (used for sucrose or starch synthesis); the remaining 5 continue to phase 3.
3. **Regeneration** — the remaining 5 G3P (15 carbons total) are rearranged through a series of enzymatic steps back into 3 molecules of RuBP (15 carbons), consuming additional ATP, so the cycle can continue fixing new CO₂.

Net cost per 3 CO₂ fixed: 9 ATP and 6 NADPH consumed for 1 net G3P produced. That stoichiometry is worth knowing because it is exactly what makes the ATP:NADPH ratio delivered by the light reactions matter, and exactly why cyclic electron flow (see [Light Reactions & Photophosphorylation](../light-reactions-photophosphorylation/)) exists to supplement ATP output when this ratio runs short.

![Full Calvin cycle: 3 CO2 fixed onto RuBP by RuBisCO (stage 1, carbon fixation) yields 6 3-PGA, reduced using 6 ATP and 6 NADPH to 6 G3P (stage 2), of which 1 exits as net output and the remaining 5 are rearranged using 3 more ATP back into 3 RuBP (stage 3, regeneration)](/PLANTPHYSIOPICS/calvin-cycle-full.png)
*Source: Biology LibreTexts*

### Photorespiration: Rubisco's Oxygenase Side-Reaction

Rubisco's active site cannot perfectly discriminate between CO₂ and O₂, and under conditions that lower the local CO₂:O₂ ratio at the active site, such as high temperature (which lowers CO₂ solubility relative to O₂ and increases Rubisco's relative affinity for O₂) and stomatal closure under water stress (which restricts fresh CO₂ entry while O₂ from ongoing photosynthesis accumulates, see [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)), Rubisco increasingly catalyzes **oxygenation** of RuBP instead of carboxylation.

![Rubisco's dual reaction as a shared branch point: with CO2 (left), RuBP carboxylation feeds ordinary photosynthesis, consuming ATP/NADPH and yielding 2x 3PGA/sugars; with O2 (right), oxygenation feeds photorespiration instead, consuming ATP/NADPH/CO2 and yielding a 3PGA+2PG mixture that ultimately releases CO2](/PLANTPHYSIOPICS/rubisco-carboxylase-oxygenase.png)
*Source: Encyclopedia (encyclopedia.pub), entry 9827*

This produces one molecule of 3-PGA (usable) and one of **2-phosphoglycolate**, a toxic 2-carbon compound that is not part of the Calvin cycle and must be salvaged through the **photorespiration (glycolate) pathway**, a costly process spanning three organelles (chloroplast, peroxisome, mitochondrion) that recovers only 3 of every 4 carbons entering it as usable product, consumes additional ATP, and releases the fourth carbon as CO₂, a net loss of both fixed carbon and previously invested energy, and the direct biochemical reason C3 photosynthesis becomes inefficient under hot, dry, high-light conditions.

![Photorespiration (glycolate pathway) spanning three organelles: chloroplast Rubisco splits between 3-PGA and 2-PG (energy loss versus ordinary photosynthesis), the peroxisome converts glycolate through glyoxylate/glycine, and the mitochondrion converts glycine to serine, releasing both NH3 (re-assimilated at ATP cost) and CO2 (a net carbon loss)](/PLANTPHYSIOPICS/photorespiration-glycolate-pathway.png)
*Source: New Phytologist*

### C4 Biochemistry: Spatial CO2 Concentration

C4 plants suppress photorespiration by physically separating initial CO₂ capture from the Calvin cycle, using the **Kranz anatomy** already described structurally on [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/) (mesophyll cells surrounding an enlarged, chloroplast-rich bundle sheath):

1. In **mesophyll cells**, atmospheric CO₂ (as HCO₃⁻) is fixed by **PEP carboxylase** onto the 3-carbon compound **PEP (phosphoenolpyruvate)**, producing the 4-carbon compound **oxaloacetate**, the reaction giving C4 photosynthesis its name. Critically, PEP carboxylase has no oxygenase activity at all and a much higher affinity for its substrate than Rubisco, so this initial fixation step is essentially immune to the O₂ competition that plagues Rubisco directly.
2. Oxaloacetate is converted to **malate** (or in some species aspartate) and shuttled through plasmodesmata into the adjacent bundle sheath cell, the anatomical adjacency and abundant plasmodesmatal connections Kranz anatomy specifically provides.
3. Inside the bundle sheath, malate is decarboxylated, releasing CO₂ at a locally very high concentration directly around Rubisco, which now runs the ordinary Calvin cycle (identical biochemistry to C3, just physically relocated) under conditions where the oxygenase side-reaction is strongly suppressed by the elevated local CO₂:O₂ ratio.
4. The resulting 3-carbon compound (pyruvate) is shuttled back to the mesophyll cell and converted back to PEP (consuming additional ATP), regenerating the initial CO₂ acceptor for another cycle.

This spatial separation costs extra ATP per CO₂ fixed compared to C3 (for the PEP regeneration step), but that cost is repaid, under hot and high-light conditions specifically, by nearly eliminating the carbon and energy losses photorespiration would otherwise impose — which is why C4 is an advantage in exactly the environments where C3 struggles, not universally.

![C4 photosynthetic pathway: (A) in the mesophyll cell, CA and PEPC fix CO2/HCO3- onto PEP to form OAA, converted to a 4-carbon acid (malate/aspartate) shuttled to the bundle sheath cell, where a decarboxylase (DC) releases CO2 to RuBisCO/the Calvin cycle, with pyruvate/alanine shuttled back and reconverted to PEP by PPDK; (B) the ATP/NADPH cost per CO2 fixed, split between mesophyll and bundle sheath, compared across the NADP-ME, NAD-ME, and PEPCK biochemical subtypes](/PLANTPHYSIOPICS/c4-pathway-biochemistry.png)
*Source: Encyclopedia (encyclopedia.pub)*

### CAM Biochemistry: Temporal CO2 Concentration

CAM plants achieve a related benefit through *time* rather than *space*, using the same cell for both steps rather than two anatomically distinct cell types (consistent with CAM leaf anatomy lacking Kranz anatomy, see [Leaf Anatomy](../../6-plant-anatomy/leaf-anatomy/)):

- **At night**, stomata open (evaporative water loss is minimized in the cooler, more humid nighttime air, see [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)) and CO₂ is fixed by the same **PEP carboxylase** reaction C4 uses, producing oxaloacetate, then malate. But here malate is stored overnight as **malic acid** in the cell's large vacuole (the structural feature CAM leaf anatomy is specifically built around).
- **During the day**, stomata close (limiting water loss during the hottest, driest, highest-evaporative-demand period), and the stored malic acid is decarboxylated, releasing CO₂ internally at high concentration directly to Rubisco and the Calvin cycle, run using ATP/NADPH from the light reactions occurring in the same illuminated cell at the same time.

Because CO₂ uptake (night) and CO₂ fixation via the Calvin cycle (day) are separated in time rather than location, a single mesophyll cell type suffices, at the cost of requiring large-volume malic acid storage between the two phases — directly explaining the enlarged vacuoles CAM leaf anatomy shows structurally.

![CAM diurnal cycle: at night (stomata open), CO2 combines with PEP via PEPC (primary carboxylation) to form a C4 acid stored in the vacuole; during the day (stomata closed), the C4 acid is decarboxylated back to a C3 acid, releasing CO2 to Rubisco and the Calvin-Benson cycle (secondary carboxylation), with surplus carbon stored as starch](/PLANTPHYSIOPICS/cam-diurnal-cycle.png)
*Source: ScienceDirect (topic page, "Crassulacean Acid Metabolism")*

## Comparative Structures

| Feature | C3 | C4 | CAM |
|---|---|---|---|
| Initial CO2 fixation enzyme | Rubisco directly | PEP carboxylase (mesophyll) | PEP carboxylase (night) |
| Calvin cycle location/time | Mesophyll, continuous with fixation | Bundle sheath, separated spatially | Same cell, separated temporally (day) |
| Photorespiration | Significant under heat/drought | Strongly suppressed | Strongly suppressed |
| Extra ATP cost vs. C3 | None | Yes (PEP regeneration) | Yes (PEP regeneration) |
| Stomata open | Day | Day | Night |
| Anatomical basis (see Leaf Anatomy) | Ordinary mesophyll | Kranz anatomy | Large-vacuole succulent mesophyll |

## Common Exam Questions

- "Trace one carbon atom through a full turn of the Calvin cycle, from CO2 fixation through reduction to either net output or RuBP regeneration."
- "Explain why Rubisco's oxygenase reaction becomes more frequent under hot, dry conditions, and why this reaction represents a net loss of carbon and energy for the plant."
- "Explain how Kranz anatomy enables the spatial separation of initial CO2 fixation from the Calvin cycle in C4 plants, referencing the specific enzyme used at each location."
- "Explain why CAM plants store malic acid in a large vacuole overnight, and why this makes Kranz anatomy unnecessary for them."
- "Explain why C4 photosynthesis costs more ATP than C3 per CO2 fixed, and why this cost is nonetheless favorable under hot, high-light conditions."

## Visual Reference

**Interactive**

- **Calvin cycle carbon tracer (click-through SVG/JS, no new library)** — a schematic cycle where clicking "step" moves a highlighted carbon atom through fixation, reduction, and regeneration, with a running tally of ATP/NADPH consumed and net G3P produced after each full turn.

<div id="calvin-tracer-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 260 260" width="240" height="240" style="display:block; margin:0 auto;">
    <circle cx="130" cy="130" r="95" fill="none" stroke="#cbd5e1" stroke-width="18"/>
    <path id="arcFix" d="M 130 35 A 95 95 0 0 1 212 177" fill="none" stroke="#8fbf8f" stroke-width="18" opacity="0.35"/>
    <path id="arcRed" d="M 212 177 A 95 95 0 0 1 48 177" fill="none" stroke="#7fb8e0" stroke-width="18" opacity="0.35"/>
    <path id="arcReg" d="M 48 177 A 95 95 0 0 1 130 35" fill="none" stroke="#f3c98b" stroke-width="18" opacity="0.35"/>
    <text x="185" y="90" font-size="11" font-weight="600" fill="#1a472a">Fixation</text>
    <text x="130" y="235" text-anchor="middle" font-size="11" font-weight="600" fill="#1d70a2">Reduction</text>
    <text x="55" y="90" font-size="11" font-weight="600" fill="#92400e">Regeneration</text>
    <circle id="calvinMarker" cx="130" cy="35" r="10" fill="#b91c1c" stroke="#fff" stroke-width="2"/>
  </svg>
  <div style="text-align:center;">
    <div id="calvinTally" style="font-size:0.85rem; font-weight:600; color:#1a472a; margin-bottom:6px;">Turns completed: 0 &nbsp;|&nbsp; ATP used: 0 &nbsp;|&nbsp; NADPH used: 0 &nbsp;|&nbsp; Net G3P: 0</div>
    <button id="calvinStepBtn" style="background:#2d6a4f; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Step &#8594;</button>
    <button id="calvinResetBtn" style="background:#94a3b8; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer; margin-left:8px;">Reset tally</button>
    <div id="calvinNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563; min-height:2.4em;">Turn begins: 3 CO2 entering the cycle to combine with 3 RuBP.</div>
  </div>
</div>
<script>
(function(){
  var marker = document.getElementById('calvinMarker');
  var note = document.getElementById('calvinNote');
  var tally = document.getElementById('calvinTally');
  var stepBtn = document.getElementById('calvinStepBtn');
  var resetBtn = document.getElementById('calvinResetBtn');
  var positions = [
    {x:130,y:35,text:'Turn begins: 3 CO2 entering the cycle to combine with 3 RuBP.'},
    {x:212,y:177,text:'Fixation: RuBisCO combines each CO2 with RuBP, producing 6 molecules of 3-PGA.'},
    {x:130,y:235,text:'Reduction: 6 ATP and 6 NADPH reduce the 6 3-PGA to 6 G3P, the cycle’s only redox step.'},
    {x:88,y:206,text:'Output: 1 of the 6 G3P exits the cycle as net carbohydrate product.'},
    {x:48,y:177,text:'Regeneration: the remaining 5 G3P are rearranged, using 3 more ATP, back into 3 RuBP.'}
  ];
  var step = 0;
  var turns = 0;
  function render(){
    marker.setAttribute('cx', positions[step].x);
    marker.setAttribute('cy', positions[step].y);
    note.textContent = positions[step].text;
    tally.textContent = 'Turns completed: ' + turns + ' | ATP used: ' + (turns*9) + ' | NADPH used: ' + (turns*6) + ' | Net G3P: ' + turns;
  }
  stepBtn.addEventListener('click', function(){
    step = step + 1;
    if (step >= positions.length){
      step = 0;
      turns = turns + 1;
    }
    render();
  });
  resetBtn.addEventListener('click', function(){
    step = 0;
    turns = 0;
    render();
  });
  render();
})();
</script>

- **C3 vs. C4 vs. CAM CO2 pathway toggle**: a single diagram frame toggles between the three modes, visually showing where (C3: one cell; C4: two adjacent cell types) or when (CAM: night vs. day, same cell) each fixation step occurs, paired with the Kranz/CAM anatomy diagrams already specified on Leaf Anatomy.

<div id="pathway-toggle-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 400 170" width="100%" style="max-width:420px; display:block; margin:0 auto;">
    <text id="pTimeIcon" x="370" y="30" font-size="22" text-anchor="middle">&#9728;&#65039;</text>
    <rect id="pCellA" x="40" y="40" width="140" height="100" rx="10" fill="#dff0df" stroke="#2d6a4f" stroke-width="2"/>
    <text id="pCellALabel1" x="110" y="80" text-anchor="middle" font-size="11" fill="#1a472a">Rubisco +</text>
    <text id="pCellALabel2" x="110" y="96" text-anchor="middle" font-size="11" fill="#1a472a">Calvin cycle</text>
    <text id="pCellATitle" x="110" y="30" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Mesophyll cell</text>
    <path id="pArrow" d="M180 90 H210" stroke="#b45309" stroke-width="3" marker-end="url(#pgArrow)" opacity="0"/>
    <rect id="pCellB" x="210" y="40" width="140" height="100" rx="10" fill="#e0ecf7" stroke="#1d70a2" stroke-width="2" opacity="0"/>
    <text id="pCellBLabel1" x="280" y="80" text-anchor="middle" font-size="11" fill="#1d70a2" opacity="0">Rubisco +</text>
    <text id="pCellBLabel2" x="280" y="96" text-anchor="middle" font-size="11" fill="#1d70a2" opacity="0">Calvin cycle</text>
    <text id="pCellBTitle" x="280" y="30" text-anchor="middle" font-size="11" font-weight="600" fill="#334155" opacity="0">Bundle sheath cell</text>
    <defs>
      <marker id="pgArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b45309"/></marker>
    </defs>
  </svg>
  <div style="text-align:center;">
    <button class="p-btn" id="pC3Btn" style="background:#2d6a4f; color:#fff; border:none; padding:8px 16px; border-radius:999px; font-size:0.85rem; cursor:pointer; margin:2px;">C3</button>
    <button class="p-btn" id="pC4Btn" style="background:#94a3b8; color:#fff; border:none; padding:8px 16px; border-radius:999px; font-size:0.85rem; cursor:pointer; margin:2px;">C4</button>
    <button class="p-btn" id="pCamBtn" style="background:#94a3b8; color:#fff; border:none; padding:8px 16px; border-radius:999px; font-size:0.85rem; cursor:pointer; margin:2px;">CAM</button>
    <span id="pCamTimeToggle" style="display:none; margin-left:10px;">
      <button class="p-time-btn" id="pNightBtn" style="background:#94a3b8; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.8rem; cursor:pointer;">Night</button>
      <button class="p-time-btn" id="pDayBtn" style="background:#2d6a4f; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.8rem; cursor:pointer;">Day</button>
    </span>
    <div id="pNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563;">C3: a single mesophyll cell type does both initial fixation and the Calvin cycle, continuously during the day.</div>
  </div>
</div>
<script>
(function(){
  var buttons = {c3:document.getElementById('pC3Btn'), c4:document.getElementById('pC4Btn'), cam:document.getElementById('pCamBtn')};
  var nightBtn = document.getElementById('pNightBtn');
  var dayBtn = document.getElementById('pDayBtn');
  var camTimeToggle = document.getElementById('pCamTimeToggle');
  var note = document.getElementById('pNote');
  var timeIcon = document.getElementById('pTimeIcon');
  var cellATitle = document.getElementById('pCellATitle');
  var cellALabel1 = document.getElementById('pCellALabel1');
  var cellALabel2 = document.getElementById('pCellALabel2');
  var arrow = document.getElementById('pArrow');
  var cellB = document.getElementById('pCellB');
  var cellBTitle = document.getElementById('pCellBTitle');
  var cellBLabel1 = document.getElementById('pCellBLabel1');
  var cellBLabel2 = document.getElementById('pCellBLabel2');
  function clearButtons(){
    Object.keys(buttons).forEach(function(k){ buttons[k].style.background = '#94a3b8'; });
  }
  function setMode(mode, time){
    clearButtons();
    buttons[mode].style.background = '#2d6a4f';
    camTimeToggle.style.display = mode === 'cam' ? 'inline' : 'none';
    if (mode === 'c3'){
      timeIcon.textContent = '☀️';
      cellATitle.textContent = 'Mesophyll cell';
      cellALabel1.textContent = 'Rubisco +';
      cellALabel2.textContent = 'Calvin cycle';
      arrow.style.opacity = 0;
      cellB.setAttribute('opacity', 0);
      cellBTitle.setAttribute('opacity', 0);
      cellBLabel1.setAttribute('opacity', 0);
      cellBLabel2.setAttribute('opacity', 0);
      note.textContent = 'C3: a single mesophyll cell type does both initial fixation and the Calvin cycle, continuously during the day.';
    } else if (mode === 'c4'){
      timeIcon.textContent = '☀️';
      cellATitle.textContent = 'Mesophyll cell';
      cellALabel1.textContent = 'PEPC →';
      cellALabel2.textContent = 'malate/aspartate';
      arrow.style.opacity = 1;
      cellB.setAttribute('opacity', 1);
      cellBTitle.setAttribute('opacity', 1);
      cellBLabel1.setAttribute('opacity', 1);
      cellBLabel2.setAttribute('opacity', 1);
      note.textContent = 'C4: two adjacent cell types split the job spatially, at the same time (day) — mesophyll fixes CO2 via PEPC, bundle sheath runs the Calvin cycle using the CO2 shuttled in.';
    } else if (mode === 'cam'){
      arrow.style.opacity = 0;
      cellB.setAttribute('opacity', 0);
      cellBTitle.setAttribute('opacity', 0);
      cellBLabel1.setAttribute('opacity', 0);
      cellBLabel2.setAttribute('opacity', 0);
      cellATitle.textContent = 'Mesophyll cell';
      if (time === 'night'){
        timeIcon.textContent = '🌙';
        nightBtn.style.background = '#2d6a4f';
        dayBtn.style.background = '#94a3b8';
        cellALabel1.textContent = 'PEPC →';
        cellALabel2.textContent = 'malic acid (stored)';
        note.textContent = 'CAM at night: the same cell type fixes CO2 via PEPC and stores it as malic acid in the vacuole — stomata are open now since evaporative demand is low.';
      } else {
        timeIcon.textContent = '☀️';
        dayBtn.style.background = '#2d6a4f';
        nightBtn.style.background = '#94a3b8';
        cellALabel1.textContent = 'Rubisco +';
        cellALabel2.textContent = 'Calvin cycle';
        note.textContent = 'CAM during the day: stomata close, stored malic acid is decarboxylated, and the same cell now runs the Calvin cycle using the released CO2.';
      }
    }
  }
  buttons.c3.addEventListener('click', function(){ setMode('c3'); });
  buttons.c4.addEventListener('click', function(){ setMode('c4'); });
  buttons.cam.addEventListener('click', function(){ setMode('cam','day'); });
  nightBtn.addEventListener('click', function(){ setMode('cam','night'); });
  dayBtn.addEventListener('click', function(){ setMode('cam','day'); });
  setMode('c3');
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. Starting from 3 CO2 molecules, trace the Calvin cycle's stoichiometry to confirm that exactly 1 net G3P is produced per turn, and state the total ATP and NADPH consumed.
2. A plant is moved from a cool, humid greenhouse to a hot, dry field. Predict the effect on its rate of photorespiration and explain the mechanism responsible.
3. Explain why a C4 plant's mesophyll cells lack functional Rubisco-driven Calvin cycle activity even though Rubisco is present in the leaf.
4. A succulent plant's stomata are found to be open at night and closed during the day. Identify its photosynthetic pathway and explain the biochemical reason for this stomatal timing.
5. Explain why both C4 and CAM plants pay an ATP cost that C3 plants do not, and identify the specific reaction responsible for that extra cost in both pathways.
