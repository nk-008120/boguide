---
title: "Tropisms & Nastic Movements"
weight: 8
description: "Directional growth responses to light and gravity (phototropism, the Cholodny-Went model, gravitropism and statolith-based gravity sensing), thigmotropism in climbing/twining growth, and non-directional, reversible nastic movements driven by turgor change rather than differential growth."
difficulty: "intermediate"
prerequisites: ["Plant-Hormones"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

Because plants cannot relocate, they redirect growth and, in a smaller number of cases, rapidly reposition existing tissue in response to directional environmental cues. This page covers both categories: **tropisms**, directional growth responses whose direction depends on the stimulus's direction (built on the auxin mechanism from [Plant Hormones](../plant-hormones/)), and **nastic movements**, non-directional and often rapid responses driven by turgor change rather than differential growth, mechanistically closer to the guard cell turgor mechanism on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/) than to anything on this page's tropism side.

## Key Concepts

### Phototropism and the Cholodny-Went Model

**Phototropism** is directional growth toward (positive) or away from (negative) a light source, most classically observed as a grass coleoptile or dicot stem bending toward unilateral light. The **Cholodny-Went model**, built directly on the auxin transport mechanism established on [Plant Hormones](../plant-hormones/), explains this as **asymmetric auxin distribution** rather than a direct light-driven growth change: blue light is detected by **phototropin** photoreceptors (the same receptor class covered driving stomatal opening on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)) concentrated at the tip, which triggers lateral auxin transport toward the shaded side of the coleoptile or stem before the auxin is transported basipetally. Because auxin promotes cell elongation, the shaded side (now carrying more auxin) elongates faster than the illuminated side, and the unequal elongation rate on the two sides is what physically bends the stem toward the light, a differential-growth mechanism, not a bending of already-formed tissue. This is the same auxin transport machinery (**polar, PIN-transporter-mediated**) established by the Darwin/Went experiments, redirected laterally rather than simply basipetally.

![Polar auxin transport machinery within and between cells: PIN exporters and AUX1/LAX importers setting up directional IAA flow via the pH gradient between apoplast and cytoplasm, with PIN5/PIN8/PILS/WAT1 additionally regulating intracellular auxin distribution via the ER and vacuole, the general PIN-mediated transport mechanism the Cholodny-Went model's lateral relocalization builds on](/PLANTPHYSIOPICS/cholodny-went-model.png)
*Source: Wikipedia*

### Gravitropism and Statolith Sensing

**Gravitropism** (geotropism) is directional growth relative to gravity: most roots show **positive gravitropism** (grow toward gravity, downward) while most shoots show **negative gravitropism** (grow away from gravity, upward), the same organ-specific auxin sensitivity difference explaining the opposite sign, since roots are far more sensitive to auxin and are inhibited by the same concentration that promotes elongation in a shoot. Gravity is detected via **statoliths**: dense, starch-filled amyloplasts that settle toward the gravity-ward side of specialized **statocyte** cells (concentrated in the root cap's columella cells, and in the stem's endodermis or vascular bundle sheath) under simple sedimentation. Statolith settling triggers redistribution of **PIN auxin transporters** to the lower side of the statocyte, again producing asymmetric lateral auxin transport exactly as in phototropism, but triggered by gravity sensing rather than light sensing, and with an opposite growth response in root tissue because of that tissue's heightened auxin sensitivity. A root's gravitropic response depends on an intact root cap, removing it experimentally abolishes gravity sensing (though not growth itself), directly implicating the cap's statocytes as the sensing site rather than the elongating zone behind it.

![Root gravitropism: in a vertically growing root tip, statocytes at the columella show downward-settled statoliths (red arrows) and symmetric auxin efflux (orange cell diagrams); after gravistimulation/reorientation, statoliths resettle toward the new lower side and auxin is redistributed asymmetrically (yellow arrows) toward that side, producing differential elongation that reorients growth back toward gravity](/PLANTPHYSIOPICS/root-gravitropism-statocytes.png)
*Source: Frontiers in Plant Science (fpls.2017.01304)*

### Thigmotropism

**Thigmotropism** is directional growth in response to physical contact, most visibly in the tendrils of climbing plants (e.g. pea, grape, cucumber), which grow straight until contacting a support, then rapidly curl around it via differential, contact-side-specific growth, mechanistically an asymmetric growth response analogous to photo- and gravitropism, but triggered by mechanical touch receptors rather than light or statolith sedimentation. Twining stems (e.g. morning glory, bindweed) show a related but distinct whole-stem coiling response used to climb a support without a specialized tendril organ.

![Positive thigmotropism in a stem tendril: a tendril on a weak-stemmed climbing plant grows freely until it contacts a support, then coils tightly around it, converting an otherwise unsupported stem into one that can climb upward](/PLANTPHYSIOPICS/tendril-coiling-thigmotropism.png)
*Source: sciencefacts.net*

### Nastic Movements

Unlike tropisms, **nastic movements** are non-directional, the response's form is fixed regardless of the stimulus's direction, and the response is typically driven by rapid, reversible **turgor pressure change** in specialized motor cells (a **pulvinus**, a swollen joint-like structure at the base of a leaf or leaflet) rather than by differential growth, which is why nastic responses can be far faster and fully reversible, unlike a tropism's growth-based bend.

- ***Mimosa pudica* seismonastic response (touch-me-not)**, mechanical stimulation triggers a rapid **action-potential-like electrical signal** that propagates to the pulvinus, where motor cells on one side rapidly lose K⁺ and water (turgor collapse) while the opposite side does not, causing the leaflets to fold and the petiole to droop within seconds, a defensive response thought to deter herbivores by suddenly appearing less like intact leaf tissue, or to dislodge small feeding insects directly.

![Mimosa pudica seismonastic response: (a) unstimulated leaflets held open; (b) leaflets folded within seconds of mechanical stimulation; (c) the pulvinus (motor organ) in cross-section, showing flaccid cells on one side and turgid cells on the other, the asymmetric turgor loss producing the fold](/PLANTPHYSIOPICS/mimosa-pulvinus-states.png)
*Source: University of Reading (Tropical Biodiversity blog)*

- **Venus flytrap (*Dionaea*) snap-trap closure**, mechanical stimulation of trigger hairs on the trap's inner surface (requiring two touches within roughly 20 seconds, or one sustained touch, a specific threshold mechanism reducing false triggers from a single raindrop or debris) generates an action potential that triggers rapid turgor-driven closure of the trap lobes, followed by slower, growth-based tightening that seals the trap fully once prey is confirmed present by continued struggling.

![Venus flytrap closure sequence after trigger-hair stimulation: two independent trials (A, B) each show the trap open at 0s and progressively closing over roughly 3 seconds following mechanical stimulation of the trigger hairs](/PLANTPHYSIOPICS/venus-flytrap-closure.png)
*Source: ResearchGate, fig. 5, "Sequence of Venus flytrap photos after stimulation of trigger hairs"*
- **Nyctinasty (sleep movements)**, rhythmic leaf/leaflet folding at night in many legumes, driven by circadian-timed turgor changes in a pulvinus, distinct from any external stimulus (i.e., an endogenous nastic rhythm rather than a stimulus-triggered one), conceptually related to the circadian stomatal baseline covered on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/).

## Comparative Structures

| Feature | Tropisms (photo-, gravi-, thigmotropism) | Nastic movements |
|---|---|---|
| Direction of response | Depends on stimulus direction | Fixed, independent of stimulus direction |
| Underlying mechanism | Differential growth (asymmetric auxin distribution) | Turgor pressure change in motor cells (pulvinus) |
| Speed | Slow (hours) | Fast (seconds) to slow (nyctinasty, circadian) |
| Reversible? | No (growth is permanent) | Yes (turgor can be restored) |
| Example | Coleoptile bending toward light | *Mimosa* leaf-folding on touch |

## Common Exam Questions

- "Explain the Cholodny-Went model of phototropism, tracing the signal from blue-light detection to differential stem elongation."
- "Explain why roots and shoots show opposite gravitropic responses to the same auxin redistribution mechanism."
- "Explain the role of statoliths and statocytes in gravity sensing, and predict the effect of surgically removing a root cap."
- "Distinguish a tropism from a nastic movement using two criteria: directionality and underlying mechanism (growth vs. turgor)."
- "Explain why the Venus flytrap requires two trigger-hair touches within a short window before closing, rather than responding to a single touch."

## Visual Reference

**Interactive**

- **Phototropic bending mechanism animator (SVG/JS)**, a coleoptile cross-section under unilateral light; activating the response shows phototropin detection, lateral PIN-transporter relocalization, auxin accumulating on the shaded side, and the resulting differential elongation bending the coleoptile toward the light, step by step.

<div id="photo-anim-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 200 200" width="180" height="180" style="display:block; margin:0 auto;">
    <text x="30" y="30" font-size="20" text-anchor="middle">&#9728;&#65039;</text>
    <path id="phStem" d="M100 170 L100 60" stroke="#2d6a4f" stroke-width="14" fill="none" stroke-linecap="round"/>
    <circle id="phReceptor" cx="100" cy="55" r="6" fill="#fde68a" stroke="#92400e" stroke-width="1.5" opacity="0"/>
    <path id="phPinArrow" d="M108 90 L92 90" stroke="#1d70a2" stroke-width="3" opacity="0" marker-end="url(#phArrow)"/>
    <ellipse id="phAuxinGlow" cx="88" cy="90" rx="10" ry="30" fill="#b45309" opacity="0"/>
    <defs>
      <marker id="phArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1d70a2"/></marker>
    </defs>
  </svg>
  <div style="text-align:center;">
    <button id="phStepBtn" style="background:#2d6a4f; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Activate</button>
    <div id="phNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563; min-height:2.4em;">Unilateral blue light shines on the coleoptile from the left.</div>
  </div>
</div>
<script>
(function(){
  var stem = document.getElementById('phStem');
  var receptor = document.getElementById('phReceptor');
  var pinArrow = document.getElementById('phPinArrow');
  var auxinGlow = document.getElementById('phAuxinGlow');
  var btn = document.getElementById('phStepBtn');
  var note = document.getElementById('phNote');
  var steps = [
    'Unilateral blue light shines on the coleoptile from the left.',
    'Phototropin photoreceptors at the tip detect the blue light.',
    'PIN transporters relocalize laterally, redirecting auxin transport toward the shaded (right) side.',
    'Auxin accumulates on the shaded side, well above the illuminated side.',
    'The auxin-rich shaded side elongates faster than the illuminated side, physically bending the coleoptile toward the light.'
  ];
  var i = 0;
  function render(){
    receptor.setAttribute('opacity', i >= 1 ? 1 : 0);
    pinArrow.setAttribute('opacity', i >= 2 ? 1 : 0);
    auxinGlow.setAttribute('opacity', i >= 3 ? 0.6 : 0);
    stem.setAttribute('d', i >= 4 ? 'M100 170 Q75 120 88 65' : 'M100 170 L100 60');
    note.textContent = steps[i];
    btn.textContent = i === steps.length - 1 ? 'Replay' : 'Next step';
  }
  btn.addEventListener('click', function(){
    i = i + 1;
    if (i >= steps.length){ i = 0; }
    render();
  });
  render();
})();
</script>

- **Statolith gravity-sensing simulator (click-through, tiltable diagram)**, a root cap statocyte cell that can be "tilted" by the user; statoliths visibly resettle toward the new gravity-ward side, triggering a redrawn auxin distribution and predicted growth direction, letting the user test multiple orientations rather than only the vertical default.

<div id="statolith-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 200 200" width="180" height="180" style="display:block; margin:0 auto;">
    <g id="stTiltGroup" transform="rotate(0 100 100)">
      <ellipse cx="100" cy="100" rx="60" ry="70" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
      <circle id="stDot1" cx="90" cy="145" r="6" fill="#7c3aed"/>
      <circle id="stDot2" cx="105" cy="150" r="6" fill="#7c3aed"/>
      <circle id="stDot3" cx="100" cy="158" r="6" fill="#7c3aed"/>
      <path id="stAuxinArrow" d="M40 100 H15" stroke="#b45309" stroke-width="4" marker-end="url(#stArrow)"/>
    </g>
    <text x="100" y="20" text-anchor="middle" font-size="11" fill="#334155" font-weight="600">g &#8595;</text>
    <defs>
      <marker id="stArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b45309"/></marker>
    </defs>
  </svg>
  <div style="text-align:center;">
    <button class="st-btn" id="stVertBtn" style="background:#2d6a4f; color:#fff; border:none; padding:7px 14px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">Vertical</button>
    <button class="st-btn" id="stRightBtn" style="background:#94a3b8; color:#fff; border:none; padding:7px 14px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">Tilt right</button>
    <button class="st-btn" id="stLeftBtn" style="background:#94a3b8; color:#fff; border:none; padding:7px 14px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">Tilt left</button>
    <div id="stNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563;">Root growing vertically, statoliths settle evenly, auxin distributed symmetrically, growth continues straight down.</div>
  </div>
</div>
<script>
(function(){
  var buttons = {vert:document.getElementById('stVertBtn'), right:document.getElementById('stRightBtn'), left:document.getElementById('stLeftBtn')};
  var tiltGroup = document.getElementById('stTiltGroup');
  var auxinArrow = document.getElementById('stAuxinArrow');
  var note = document.getElementById('stNote');
  function clearButtons(){
    Object.keys(buttons).forEach(function(k){ buttons[k].style.background = '#94a3b8'; });
  }
  function setTilt(dir){
    clearButtons();
    buttons[dir].style.background = '#2d6a4f';
    if (dir === 'vert'){
      tiltGroup.setAttribute('transform', 'rotate(0 100 100)');
      auxinArrow.style.opacity = 0;
      note.textContent = 'Root growing vertically, statoliths settle evenly, auxin distributed symmetrically, growth continues straight down.';
    } else if (dir === 'right'){
      tiltGroup.setAttribute('transform', 'rotate(35 100 100)');
      auxinArrow.style.opacity = 1;
      note.textContent = 'Tilted to the right, statoliths resettle toward the new lower side, PIN transporters redistribute auxin there, and growth curves back downward (positive gravitropism).';
    } else if (dir === 'left'){
      tiltGroup.setAttribute('transform', 'rotate(-35 100 100)');
      auxinArrow.style.opacity = 1;
      note.textContent = 'Tilted to the left, statoliths resettle toward the new lower side (now the left), auxin redistributes there, and growth curves back downward on the opposite side from before.';
    }
  }
  buttons.vert.addEventListener('click', function(){ setTilt('vert'); });
  buttons.right.addEventListener('click', function(){ setTilt('right'); });
  buttons.left.addEventListener('click', function(){ setTilt('left'); });
  setTilt('vert');
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. A coleoptile is illuminated uniformly from all sides simultaneously. Predict whether it will bend, and explain your prediction using the Cholodny-Went model.
2. A root's cap is removed but the root continues to elongate. Predict whether it will still respond gravitropically, and explain why.
3. Explain why the same lateral auxin redistribution mechanism causes a root to bend toward gravity and a shoot to bend away from it.
4. A Mimosa pudica leaf folds within two seconds of being touched, then reopens fully ten minutes later. Explain why this response is classified as nastic rather than tropic, and why it is reversible while a tropic response is not.
5. Explain the functional significance of the Venus flytrap's two-touch closure threshold in terms of avoiding a wasted response.
