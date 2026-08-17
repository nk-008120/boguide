---
title: "Phloem Transport & Translocation"
weight: 3
description: "The pressure-flow (Munch) hypothesis explaining bulk phloem transport, source/sink dynamics, and the active phloem loading and passive/active unloading mechanisms at each end of the sieve tube, built on the sieve tube element/companion cell structure covered in Plant Anatomy."
difficulty: "intermediate"
prerequisites: ["Water-Transport-Transpiration"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

[Xylem, Phloem & Vascular Tissue](../../6-plant-anatomy/xylem-phloem-vascular-tissue/) described the sieve tube element and companion cell structurally, a living conducting cell stripped of its nucleus and most organelles, kept metabolically functional by a companion cell wired to it through elaborated plasmodesmata. This page covers the transport mechanism that structure supports: **translocation**, the bulk movement of sugars (mainly sucrose) from where they are produced or stored to where they are used or stored, driven by a pressure gradient rather than by the water-potential-driven passive movement covered on [Water Transport & Transpiration](../water-transport-transpiration/).

## Key Concepts

### Source and Sink

Phloem transport is defined relationally, not by fixed anatomical location: a **source** is any tissue that is a net exporter of sugar (mature photosynthesizing leaves; germinating seeds mobilizing stored reserves; storage organs during regrowth), and a **sink** is any tissue that is a net importer (growing shoot and root tips, developing fruits and seeds, storage organs during accumulation). The same organ can switch roles across a plant's life cycle (a storage root is a sink while accumulating starch and a source when that starch is later mobilized to support new growth), which is why phloem flow direction is not fixed like xylem's root-to-shoot direction, but reverses according to which tissues are currently acting as source and which as sink.

![Whole-plant source-sink nitrogen and sucrose movement: (A) source leaf photosynthesis/N-metabolism supplying sucrose and nitrogen via phloem and xylem to a sink leaf and to roots, and root NO3-/NH4+/amino acid uptake feeding back via xylem; (B) the source-cell and sink-cell transporter proteins (SUTs, AAPs, CAT1, INVs) underlying that movement](/PLANTPHYSIOPICS/source-sink-whole-plant.png)
*Source: ResearchGate, fig. 1, "Source-Sink Relationships in Plants: Whole-plant movement of nitrogen-containing..."*

### Phloem Loading

At the source end, sucrose produced by photosynthesis (or released from storage) must be concentrated into the sieve tube against its concentration gradient, which happens by one of two routes:

- **Apoplastic loading**, sucrose is first exported from mesophyll cells into the cell wall space (apoplast) near the minor vein, then actively taken up into the sieve tube element/companion cell complex by **sucrose-H⁺ symporters**, powered by a proton gradient that H⁺-ATPases maintain across the plasma membrane. This is an active, energy-consuming step, and it is why **transfer cells** (specialized companion cells with wall ingrowths that amplify surface area, see [Xylem, Phloem & Vascular Tissue](../../6-plant-anatomy/xylem-phloem-vascular-tissue/)) are concentrated exactly where apoplastic loading is most intense.
- **Symplastic loading**: sucrose moves cell-to-cell via plasmodesmata all the way from mesophyll to sieve tube without ever entering the apoplast. Many species using this route additionally convert sucrose into larger sugars (raffinose, stachyose) once inside the phloem, a mechanism called **polymer trapping**: because plasmodesmata size-exclude molecules above a threshold, the larger sugars cannot diffuse back out the way they came in, maintaining the concentration gradient needed for continued loading without added transporter proteins.

Either route achieves the same essential outcome: sieve tube solute concentration at the source is driven well above that of surrounding tissue, sharply lowering the sieve tube's water potential there.

![Apoplastic vs. symplastic sucrose phloem loading pathways: top, sucrose crossing the apoplast via facilitated transport then an H+-ATPase-driven H+/sucrose symporter into the companion cell, exiting to the sieve tube via a SWEET effluxer; bottom, sucrose moving directly from sugar-producing cell to companion cell to sieve tube via plasmodesmata by simple diffusion down its concentration gradient](/PLANTPHYSIOPICS/phloem-loading-symplastic.png)
*Source: Wikimedia Commons*

### The Pressure-Flow (Münch) Hypothesis

Once sucrose is loaded at the source, water follows osmotically from the adjacent xylem (the two vascular tissues run alongside each other precisely so this water exchange is fast, see [Xylem, Phloem & Vascular Tissue](../../6-plant-anatomy/xylem-phloem-vascular-tissue/)), raising **turgor pressure** in the sieve tube at the source end.

![Pressure-flow (Munch) hypothesis: water enters the phloem from the xylem at the source (leaf) companion cell as sucrose is loaded, driving bulk flow of water and sucrose through sieve-tube elements to the sink (root/fruit) companion cell, where sucrose exits and water returns to the xylem](/PLANTPHYSIOPICS/pressure-flow-hypothesis.png)
*Source: ResearchGate, fig. 1, "Translocation of sugars (photoassimilates) in plants: Pressure flow hypothesis (Muench)"*

At the sink end, sugar is continuously removed (unloaded, see below), keeping sieve tube solute concentration, and therefore turgor pressure, low there. The resulting pressure difference between source and sink, transmitted through the continuous, plasmodesmata- and sieve-plate-connected sieve tube lumen, drives **bulk flow** of the entire sap (water and dissolved sugars together) from source to sink, mechanistically distinct from xylem transport, which is pulled by tension rather than pushed by a pressure gradient, and from simple diffusion, which would be far too slow to account for the observed translocation rates. Because the driving pressure difference depends only on the relative concentrations at the two ends, not on which end is physically higher or lower, phloem sap can move in any direction, including downward from a leaf source to a root sink, upward from a storage root source to a growing shoot sink, or laterally between two leaves at the same height, a direct, testable contrast with xylem's exclusively upward flow.

![Xylem vs. phloem transport contrasted: xylem carries water/minerals one-way only through non-living cells with no end walls between them, while phloem carries organic molecules two-way through living (support-dependent) cells connected by sieve plates, paired with a real stained cross-section showing xylem (red, meta-/protoxylem) and phloem tissue side by side](/PLANTPHYSIOPICS/xylem-vs-phloem-direction.png)
*Source: microbenotes.com, "Xylem vs Phloem"*

### Phloem Unloading

At the sink end, sugar exits the sieve tube by routes mirroring the loading options: **symplastic unloading** (plasmodesmata, common in rapidly growing sinks like root tips, where cells need bulk sugar delivery without fine metabolic control) or **apoplastic unloading** (sucrose exported into the apoplast, then actively or passively taken up by sink cells, common where the sink needs to regulate its own uptake rate independently of phloem pressure, e.g. developing seeds, where the maternal phloem and the offspring embryo are genetically distinct tissues not connected by plasmodesmata at all, making apoplastic unloading the only option). Continuous removal of sugar at the sink, by whichever route, is what keeps sink-end turgor low and therefore keeps the pressure gradient driving bulk flow from collapsing.

```mermaid
graph LR;
    A["Source: sucrose loaded into sieve tube (apoplastic or symplastic)"] --> B["Source-end solute potential drops, water enters from xylem"];
    B --> C["Source-end turgor pressure rises"];
    C --> D["Bulk flow through sieve tube, driven by pressure gradient"];
    D --> E["Sink-end turgor pressure lower (sugar continuously unloaded)"];
    E --> F["Sink: sucrose unloaded (apoplastic or symplastic), water exits to xylem"];
```

## Comparative Structures

| Feature | Xylem transport | Phloem transport |
|---|---|---|
| Driving force | Tension (negative pressure) from transpiration | Positive pressure gradient (source high, sink low) |
| Direction | Root to shoot only | Source to sink, either direction |
| Conducting cell state | Dead at maturity | Alive at maturity |
| What moves | Water and dissolved minerals | Sugars (mainly sucrose) and other organic solutes |
| Energy requirement | None directly (passive, physical) | Active (loading requires ATP-driven transport) |

## Common Exam Questions

- "Define source and sink in phloem transport, and explain why the same organ can act as either depending on developmental stage."
- "Distinguish apoplastic from symplastic phloem loading, and explain the specific role of polymer trapping in the symplastic route."
- "Explain the pressure-flow hypothesis, tracing the full sequence from sucrose loading at the source to bulk flow arriving at the sink."
- "Explain why phloem transport, unlike xylem transport, is not restricted to one direction."
- "Explain why a developing seed must unload phloem sugar apoplastically rather than symplastically."

## Visual Reference

**Interactive**

- **Pressure-flow (Münch) demonstrator (SVG/JS, step-through)**, two connected chambers (source, sink) linked by a tube, with a slider controlling source-end sucrose loading rate; increasing loading visibly raises source turgor (rendered as chamber pressure) and drives flow toward the sink chamber, letting the user confirm that flow direction reverses if the sink-chamber loading is set higher instead.

{{< iframe src="/pressure-flow-demonstrator.html" title="Pressure-flow (Munch) demonstrator" height="480px" >}}

- **Loading pathway toggle (click-through)**, a single minor-vein cross-section that toggles between apoplastic loading (sucrose crossing the apoplast, sucrose-H+ symporter highlighted) and symplastic loading (plasmodesmata route, polymer trapping shown converting sucrose to raffinose/stachyose once inside).

<div id="loading-toggle-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 400 190" width="100%" style="max-width:420px; display:block; margin:0 auto;">
    <text x="70" y="20" font-size="12" font-weight="600" fill="#334155">Mesophyll</text>
    <rect x="20" y="30" width="100" height="120" rx="6" fill="#dff0df" stroke="#2d6a4f" stroke-width="2"/>
    <text x="150" y="20" font-size="12" font-weight="600" fill="#334155">Apoplast</text>
    <rect x="140" y="30" width="60" height="120" rx="4" fill="#fdf6e3" stroke="#b45309" stroke-width="1.5" stroke-dasharray="4 3"/>
    <text x="230" y="20" font-size="12" font-weight="600" fill="#334155">Companion cell</text>
    <rect x="215" y="30" width="90" height="120" rx="6" fill="#e0ecf7" stroke="#1d70a2" stroke-width="2"/>
    <text x="330" y="20" font-size="12" font-weight="600" fill="#334155">Sieve tube</text>
    <rect x="320" y="30" width="60" height="120" rx="6" fill="#c9dcee" stroke="#1d70a2" stroke-width="2"/>
    <g id="apoplasticRoute">
      <path d="M120 90 H140" stroke="#b45309" stroke-width="3" marker-end="url(#ldArrow)"/>
      <path d="M200 90 H215" stroke="#b45309" stroke-width="3" marker-end="url(#ldArrow)"/>
      <circle cx="207" cy="90" r="9" fill="#fde68a" stroke="#92400e" stroke-width="1.5"/>
      <text x="207" y="94" font-size="7" text-anchor="middle" fill="#92400e">H+/Suc</text>
      <path d="M305 90 H320" stroke="#b45309" stroke-width="3" marker-end="url(#ldArrow)"/>
      <text x="150" y="165" font-size="10.5" fill="#92400e" text-anchor="middle">sucrose crosses apoplast,</text>
      <text x="150" y="177" font-size="10.5" fill="#92400e" text-anchor="middle">H&#8314;/sucrose symporter loads it in</text>
    </g>
    <g id="symplasticRoute" opacity="0">
      <path d="M120 100 H305" stroke="#2d6a4f" stroke-width="3" stroke-dasharray="2 4" marker-end="url(#ldArrowGreen)"/>
      <text x="150" y="70" font-size="7" fill="#2d6a4f">plasmodesmata</text>
      <text x="150" y="165" font-size="10.5" fill="#1a472a" text-anchor="middle">sucrose &#8594; raffinose/stachyose</text>
      <text x="150" y="177" font-size="10.5" fill="#1a472a" text-anchor="middle">(too large to diffuse back out)</text>
    </g>
    <defs>
      <marker id="ldArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b45309"/></marker>
      <marker id="ldArrowGreen" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#2d6a4f"/></marker>
    </defs>
  </svg>
  <div style="text-align:center; margin-top:0.5rem;">
    <button class="ld-btn" id="ldApoBtn" style="background:#b45309; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer; margin-right:8px;">Apoplastic</button>
    <button class="ld-btn" id="ldSymBtn" style="background:#94a3b8; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Symplastic</button>
    <div id="ldNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563;">Sucrose exits the mesophyll into the cell-wall apoplast, then is actively taken up into the companion cell/sieve tube by an H&#8314;/sucrose symporter, an energy-consuming step, hence the transfer cells found where this route is most active.</div>
  </div>
</div>
<script>
(function(){
  var apo = document.getElementById('apoplasticRoute');
  var sym = document.getElementById('symplasticRoute');
  var apoBtn = document.getElementById('ldApoBtn');
  var symBtn = document.getElementById('ldSymBtn');
  var note = document.getElementById('ldNote');
  function setRoute(isApo){
    apo.style.opacity = isApo ? 1 : 0;
    sym.style.opacity = isApo ? 0 : 1;
    apoBtn.style.background = isApo ? '#b45309' : '#94a3b8';
    symBtn.style.background = isApo ? '#94a3b8' : '#2d6a4f';
    note.textContent = isApo
      ? 'Sucrose exits the mesophyll into the cell-wall apoplast, then is actively taken up into the companion cell/sieve tube by an H⁺/sucrose symporter, an energy-consuming step, hence the transfer cells found where this route is most active.'
      : 'Sucrose moves cell-to-cell via plasmodesmata without ever entering the apoplast; many species convert it to raffinose/stachyose once inside the phloem (polymer trapping), too large to diffuse back out, maintaining the gradient for continued loading.';
  }
  apoBtn.addEventListener('click', function(){ setRoute(true); });
  symBtn.addEventListener('click', function(){ setRoute(false); });
  setRoute(true);
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. A germinating seed's cotyledons are shrinking as their stored starch is converted to sucrose and exported. Identify whether the cotyledon is currently acting as a source or sink, and justify your answer.
2. Explain why blocking a plant's sucrose-H+ symporters with a chemical inhibitor would prevent apoplastic loading but not symplastic loading.
3. A developing fruit is not connected to maternal phloem tissue by plasmodesmata. Explain how it nonetheless receives sugar, naming the specific unloading route involved.
4. Using the pressure-flow hypothesis, explain why phloem sap can move downward from a leaf to a root at the same time xylem sap is moving upward through the same region of stem.
5. Predict what would happen to sink-end turgor pressure, and therefore to bulk flow rate, if a sink tissue's sugar consumption suddenly stopped.
