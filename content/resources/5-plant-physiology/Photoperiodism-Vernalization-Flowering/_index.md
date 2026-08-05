---
title: "Photoperiodism, Vernalization & Flowering"
weight: 9
description: "Phytochrome's red/far-red photoreversible switch and its role in measuring night length, the short-day/long-day/day-neutral flowering classification built on critical night length rather than day length, vernalization's cold requirement, and florigen (FT protein) as the mobile signal triggering the floral transition covered structurally in Plant Anatomy."
difficulty: "advanced"
prerequisites: ["Plant-Hormones"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}

## Overview

[Flower Anatomy & Reproductive Structures](../../6-plant-anatomy/flower-anatomy-reproductive-structures/) covers what a flower is built from once the plant has committed to flowering — the four whorls, microsporogenesis, megasporogenesis. This page covers the upstream decision: how a plant determines *when* to make that commitment, using day length and, in some species, a prior cold exposure, as environmental timing cues, and what mobile internal signal actually carries that decision from the leaf (where the cue is sensed) to the shoot apical meristem (where the floral transition physically occurs).

## Key Concepts

### Phytochrome and the Red/Far-Red Switch

**Phytochrome** is a photoreversible pigment-protein that exists in two interconvertible forms: **Pr** (absorbs red light, ~660 nm) and **Pfr** (absorbs far-red light, ~730 nm) — absorbing red light converts Pr to Pfr, and absorbing far-red light converts Pfr back to Pr. Sunlight contains far more red than far-red light, so Pfr accumulates during the day; in darkness, Pfr slowly and spontaneously reverts to Pr over the course of the night (rather than requiring far-red light specifically), at a roughly constant rate. This slow, dark-driven Pfr-to-Pr conversion is what allows phytochrome to function as a night-length timer: the longer an uninterrupted dark period lasts, the more completely Pfr reverts to Pr, so the Pfr:Pr ratio present at dawn is a direct molecular readout of how long the preceding night was. Critically, this makes phytochrome sensitive to **night length**, not day length directly, which is the basis for the terminology correction in the next section.

![Phytochrome Pr/Pfr photoreversible cycle: red light (670 nm) converts the inactive Pr form to the active Pfr form; far-red light (730 nm) or, more slowly, darkness converts Pfr back to Pr](/PLANTPHYSIOPICS/phytochrome-pr-pfr-cycle.png)
*Source: Preach Bio*

### Short-Day, Long-Day, and Day-Neutral Plants

Flowering-time classification is conventionally named by day length but mechanistically determined by **critical night length**, a fact demonstrable by a single classic experiment: interrupting a long night with a brief pulse of red light in the middle prevents flowering in a short-day plant just as effectively as shortening the night itself, while interrupting a short night has no equivalent effect — showing that the plant is measuring the uninterrupted dark period, not daylight directly.

{{< youtube yvyZTzq_d7Q >}}

On that basis:

- **Short-day (long-night) plants** — flower only when the uninterrupted night exceeds a species-specific critical length (i.e., when days are short), because a sufficiently long night allows Pfr to fall low enough to permit the floral transition. A brief red-light interruption in the middle of an otherwise long night restores enough Pfr to block flowering.
- **Long-day (short-night) plants** — flower only when the uninterrupted night is shorter than the critical length (i.e., when days are long), because flowering here requires that Pfr remain relatively high through the night, which only occurs if the dark period is short enough to prevent much Pfr-to-Pr reversion.
- **Day-neutral plants** — flower based on developmental stage (e.g., reaching a minimum leaf number) rather than photoperiod at all.

### Vernalization

Some species (many biennials and winter annuals) additionally require **vernalization** — a prolonged period of cold exposure, typically during winter, before they become competent to flower even under an otherwise inductive photoperiod the following season. Mechanistically, vernalization involves epigenetic silencing of a floral repressor gene (in the well-studied case, sustained cold progressively represses the *FLC* repressor via chromatin modification), a change that persists through subsequent cell divisions in the meristem (a form of cellular, mitotically heritable memory of the cold exposure) even after the cold period ends and temperatures rise — which is why a single winter's cold, not the plant's continued exposure to cold at flowering time, is sufficient to unlock the response. Vernalization and photoperiod act as independent checkpoints: a species requiring both will not flower on photoperiod alone without prior cold exposure, nor on cold exposure alone without the correct subsequent photoperiod.

![Vernalization outcome and the classical (pre-molecular) flower-inducing-substance model: left, a slightly germinated seed either chilled (flowers) or not chilled (fails to flower) at the same ordinary growing temperature; right, the classical "vernalin"/"florigen" translocation model proposed to carry the vernalization-induced signal from leaf to flower bud, with devernalization by high temperature](/PLANTPHYSIOPICS/vernalization-flc-timeline.png)
*Source: SlideShare*

### Florigen: The Mobile Flowering Signal

Photoperiod is sensed in leaves (where phytochrome and the night-length-measuring clock operate), but the floral transition itself occurs at the **shoot apical meristem**, often at a considerable distance — classic grafting experiments (an induced leaf grafted onto an otherwise non-induced plant of the same species triggers flowering in the recipient) demonstrated decades before its molecular identity was known that a mobile, graft-transmissible signal, not an electrical or purely local response, carries the flowering decision from leaf to apex.

![Grafting technique terminology (in vitro micrografting vs. conventional grafting): scion/microscion, rootstock/microrootstock, and the graft union where callus cells from both sides interconnect the vascular systems](/PLANTPHYSIOPICS/grafting-experiment-florigen.png)
*Source: not identified*

This signal is now identified as **florigen**, the **FT (Flowering Locus T) protein**: synthesized in leaf phloem companion cells under inductive photoperiod, then transported through the phloem (see [Phloem Transport & Translocation](../phloem-transport-translocation/) for the general mechanism carrying it) to the shoot apical meristem, where it triggers the transcriptional program converting the vegetative meristem into a floral meristem — the developmental switch whose structural output (the four floral whorls) is covered on [Flower Anatomy & Reproductive Structures](../../6-plant-anatomy/flower-anatomy-reproductive-structures/).

![FT (florigen) production and transport: under long-day/inductive red:far-red light conditions, FT-producing companion cells in the leaf phloem load FT (and FLP1) protein into the sieve element flow, carrying it to the shoot apical meristem to trigger floral development and to promote stem growth](/PLANTPHYSIOPICS/florigen-ft-pathway.png)
*Source: ScienceDirect (journal article abstract page, S1534580725000656)*

```mermaid
graph TD;
    A["Leaf: phytochrome measures night length"] --> B["Inductive photoperiod detected"];
    B --> C["FT (florigen) synthesized in phloem companion cells"];
    C --> D["FT transported via phloem to shoot apical meristem"];
    D --> E["Vegetative meristem converts to floral meristem"];
    E --> F["Floral whorls develop (see Flower Anatomy)"];
```

## Comparative Structures

| Feature | Short-day plant | Long-day plant | Day-neutral plant |
|---|---|---|---|
| Flowering trigger | Night length exceeds critical value | Night length below critical value | Developmental stage, independent of photoperiod |
| Effect of interrupting the night with red light | Blocks flowering | No effect / can promote flowering | No effect |
| Example season | Flowers in autumn/short days | Flowers in late spring/summer | Any season once mature |

## Common Exam Questions

- "Explain why phytochrome is better described as measuring night length rather than day length, referencing the red-light night-interruption experiment."
- "Distinguish short-day, long-day, and day-neutral plants by their response to critical night length."
- "Explain the mechanism of vernalization, including why the cold-induced change persists after the cold period ends."
- "Describe the classical grafting experiment demonstrating florigen's existence, and explain what it proved that simply observing flowering timing could not."
- "Trace florigen's path from its site of synthesis to its site of action, naming the transport tissue involved."

## Visual Reference

**Interactive**

- **Phytochrome Pfr/Pr night-length timer (SVG/JS, slider for night duration)** — a slider sets night length; the diagram shows Pfr-to-Pr reversion accumulating over the dark period, with a threshold marker indicating whether the resulting dawn Pfr:Pr ratio would trigger flowering in a short-day vs. long-day plant, letting the user test the red-light-interruption scenario as a toggle mid-night.

<div id="phyto-timer-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 300 90" width="100%" style="max-width:320px; display:block; margin:0 auto;">
    <rect x="10" y="20" width="280" height="24" rx="4" fill="#1e293b"/>
    <rect id="ptPfrBar" x="10" y="20" width="280" height="24" rx="4" fill="#fde68a"/>
    <line x1="150" y1="10" x2="150" y2="60" stroke="#b91c1c" stroke-width="2" stroke-dasharray="3 2"/>
    <text x="150" y="72" text-anchor="middle" font-size="9" fill="#b91c1c">critical threshold</text>
    <text x="10" y="14" font-size="9" fill="#4b5563">dusk (Pfr high)</text>
    <text x="290" y="14" text-anchor="end" font-size="9" fill="#4b5563">dawn</text>
  </svg>
  <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; text-align:center; margin-top:8px;">Night length: <span id="ptHoursOut">8</span> h</label>
  <input type="range" id="ptSlider" min="0" max="16" value="8" style="width:100%; max-width:300px; display:block; margin:0 auto;">
  <div style="text-align:center; margin-top:8px;">
    <label style="font-size:0.82rem; color:#334155;"><input type="checkbox" id="ptInterrupt"> Interrupt night with a red-light pulse at midnight</label>
  </div>
  <div id="ptReadout" style="text-align:center; margin-top:10px; font-size:0.85rem; font-weight:600; color:#1a472a;">Dawn Pfr level: high</div>
  <div style="display:flex; justify-content:center; gap:20px; margin-top:8px;">
    <div id="ptShortDay" style="font-size:0.82rem; color:#4b5563;">Short-day plant: <b>—</b></div>
    <div id="ptLongDay" style="font-size:0.82rem; color:#4b5563;">Long-day plant: <b>—</b></div>
  </div>
</div>
<script>
(function(){
  var slider = document.getElementById('ptSlider');
  var interrupt = document.getElementById('ptInterrupt');
  var hoursOut = document.getElementById('ptHoursOut');
  var pfrBar = document.getElementById('ptPfrBar');
  var readout = document.getElementById('ptReadout');
  var shortDay = document.getElementById('ptShortDay');
  var longDay = document.getElementById('ptLongDay');
  var critical = 12;
  function update(){
    var hours = parseInt(slider.value,10);
    var interrupted = interrupt.checked;
    hoursOut.textContent = hours;
    var pfrFraction = Math.max(0, 1 - hours/16);
    if (interrupted){ pfrFraction = Math.max(pfrFraction, 0.7); }
    pfrBar.setAttribute('width', 280 * pfrFraction);
    readout.textContent = 'Dawn Pfr level: ' + Math.round(pfrFraction*100) + '%' + (interrupted ? ' (reset by red-light pulse)' : '');
    var effectiveLongNight = hours > critical && !interrupted;
    shortDay.innerHTML = 'Short-day plant: <b>' + (effectiveLongNight ? 'Flowers' : 'No flowering') + '</b>';
    longDay.innerHTML = 'Long-day plant: <b>' + (effectiveLongNight ? 'No flowering' : 'Flowers') + '</b>';
  }
  slider.addEventListener('input', update);
  interrupt.addEventListener('change', update);
  update();
})();
</script>

- **Grafting experiment reconstructor (click-through)** — a two-plant diagram (induced donor, non-induced recipient) where clicking "graft" transmits a visible signal marker across the graft union to the recipient's apex, which then transitions to flowering — reproducing the classic experiment's logic before revealing FT protein as the modern molecular identity of that signal.

<div id="graft-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 320 140" width="100%" style="max-width:340px; display:block; margin:0 auto;">
    <text x="80" y="18" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Donor (induced)</text>
    <path d="M80 120 L80 40" stroke="#2d6a4f" stroke-width="8" fill="none" stroke-linecap="round"/>
    <text id="donorFlower" x="80" y="35" text-anchor="middle" font-size="16">&#127801;</text>
    <text x="240" y="18" text-anchor="middle" font-size="11" font-weight="600" fill="#334155">Recipient (non-induced)</text>
    <path d="M240 120 L240 40" stroke="#2d6a4f" stroke-width="8" fill="none" stroke-linecap="round"/>
    <text id="recipientTop" x="240" y="35" text-anchor="middle" font-size="16">&#127807;</text>
    <path id="graftLine" d="M80 90 H240" stroke="#94a3b8" stroke-width="3" stroke-dasharray="4 3" opacity="0"/>
    <circle id="signalDot" cx="80" cy="90" r="7" fill="#7c3aed" opacity="0"/>
  </svg>
  <div style="text-align:center;">
    <button id="graftBtn" style="background:#2d6a4f; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Graft donor to recipient</button>
    <div id="graftNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563; min-height:2.4em;">The donor plant has been induced to flower; the recipient has not.</div>
  </div>
</div>
<script>
(function(){
  var btn = document.getElementById('graftBtn');
  var graftLine = document.getElementById('graftLine');
  var signalDot = document.getElementById('signalDot');
  var recipientTop = document.getElementById('recipientTop');
  var note = document.getElementById('graftNote');
  var running = false;
  function reset(){
    graftLine.style.opacity = 0;
    signalDot.style.opacity = 0;
    signalDot.setAttribute('cx', 80);
    recipientTop.textContent = '\u{1F343}';
    note.textContent = 'The donor plant has been induced to flower; the recipient has not.';
  }
  btn.addEventListener('click', function(){
    if (running){ return; }
    running = true;
    reset();
    graftLine.style.opacity = 1;
    signalDot.style.opacity = 1;
    note.textContent = 'Grafting connects the vascular tissue of both plants — a mobile signal can now travel between them.';
    setTimeout(function(){
      signalDot.setAttribute('cx', 240);
      note.textContent = 'The mobile signal travels from the induced donor across the graft union toward the recipient apex.';
    }, 200);
    setTimeout(function(){
      recipientTop.textContent = '\u{1F337}';
      note.textContent = 'The recipient flowers — despite never itself experiencing the inductive photoperiod. This signal is now identified as FT (florigen) protein.';
    }, 1600);
    setTimeout(function(){ running = false; }, 2000);
  });
  reset();
})();
</script>

*(Static images, and one embedded video for the critical-night-length concept, are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. A short-day plant is kept under a long uninterrupted night, but a brief flash of red light is applied exactly halfway through. Predict whether it will flower and explain why.
2. A biennial plant is grown entirely in a warm greenhouse and given an inductive photoperiod. It fails to flower. Propose an explanation involving vernalization.
3. Explain why grafting an induced leaf onto a non-induced plant causes the recipient to flower, and what this result rules out as an explanation (a purely local, non-mobile response at the leaf).
4. Using the concept of critical night length, explain why some long-day plants can be induced to flower using a brief light interruption during an otherwise long night, functionally shortening it.
5. Explain why the vernalization response persists in a meristem's descendant cells even after the plant is moved to a warm environment, referencing the type of molecular change involved.
