---
title: "Plant Stress Physiology & Defense"
weight: 11
description: "Whole-plant integration of abiotic stress responses (drought, salinity, temperature extremes) and biotic defense against pathogens and herbivores — the hypersensitive response, systemic acquired resistance and its salicylic acid signal, and constitutive/induced chemical defenses against herbivory — closing the section by drawing on transport, hormone, and stomatal mechanisms covered throughout."
difficulty: "advanced"
prerequisites: []
syllabus_tags: ["IBO", "USABO", "comparative"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

Every mechanism covered earlier in this section (stomatal control, ABA signaling, hormone balance, mineral uptake) is also a tool the plant deploys under stress. This closing page integrates them into whole-plant stress responses, first abiotic (drought, salinity, temperature) and then biotic (pathogen and herbivore defense), the two broad categories a stationary organism must survive without the option of fleeing either.

## Key Concepts

### Drought Stress

Water deficit triggers a coordinated response built almost entirely from mechanisms already established: root and leaf **ABA synthesis rises sharply**, driving the stomatal closure covered in full on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/) to limit further transpirational water loss, at the direct cost of restricting CO₂ entry and therefore photosynthetic rate, a whole-plant example of the same photosynthesis-transpiration trade-off introduced on that page, now pushed toward its water-conserving extreme. Sustained drought also triggers **osmotic adjustment**: cells accumulate compatible solutes (proline, glycine betaine, soluble sugars) that lower cellular solute potential without disrupting enzyme function at high concentration (unlike ionic solutes, which become toxic at the concentrations needed to meaningfully shift Ψₛ), helping cells retain water and maintain turgor even as external/soil water potential falls.

### Salinity Stress

High soil salinity presents a double challenge: an osmotic component (a saline soil has a very negative water potential, making it physically harder for roots to extract water at all, mechanistically continuous with the water potential framework on [Water Transport & Transpiration](../water-transport-transpiration/)) and an ionic toxicity component (excess Na⁺ specifically disrupts K⁺-dependent enzyme function and membrane integrity once it accumulates intracellularly).

![Salt stress overview: ionic toxicity and osmotic stress together drive morphological (reduced growth, chlorosis, reduced tillering/root growth), biochemical (oxidative stress, altered metabolism, high Na+ transport, lower K+ uptake), and physiological (reduced photosynthesis, stomatal closure, decreased water content) responses, ultimately reducing crop productivity](/PLANTPHYSIOPICS/compatible-solute-accumulation.png)
*Source: not specified*

Plants respond by **excluding** Na⁺ at the root (selective ion channels favoring K⁺ uptake over Na⁺) or, where exclusion is incomplete, **compartmentalizing** absorbed Na⁺ into the vacuole (away from cytoplasmic enzymes) using tonoplast Na⁺/H⁺ antiporters — a cellular-scale solution conceptually similar to CAM's vacuolar malic acid storage (see [Carbon Fixation](../calvin-cycle-photorespiration-c4-cam/)) in that both rely on the vacuole as a large-capacity storage compartment isolated from cytoplasmic metabolism.

![Cellular Na+ transport and salt-stress response network: apoplastic Na+ influx via non-selective cation channels, Ca2+/ROS sensing and downstream transcriptional control (WRKY/NAC/bHLH/AP2-ERF/bZIP/MYB) regulating HKT1, vacuolar compartmentalization via the NHX Na+/H+ antiporter, and SOS1-mediated Na+ efflux/xylem-loading control limiting Na+ delivery to the shoot](/PLANTPHYSIOPICS/salinity-na-exclusion-compartmentalization.png)
*Source: ResearchGate / Trends in Plant Science, fig. 5, "Overview of cellular Na+ transport mechanisms and the salt stress response network"*

### Temperature Stress

**Heat stress** induces **heat-shock proteins (HSPs)**, molecular chaperones that bind partially denatured proteins and prevent irreversible aggregation, buying time for normal folding to resume once temperature falls, the same chaperone principle covered for animal/general protein folding elsewhere, applied here as an inducible, stress-triggered response rather than a constitutive one.

![Heat shock factor (HSF) activation pathway: environmental stressors (heat shock, oxidative stress, heavy metals) and non-stress developmental signals both converge on HSF, which trimerizes, enters the nucleus, and binds heat shock elements (HSE) to induce heat-shock protein production](/PLANTPHYSIOPICS/heat-shock-protein-mechanism.png)
*Source: MDPI*

**Cold stress** below freezing threatens cells primarily through extracellular ice formation drawing water out of the cytoplasm (worsening cellular dehydration) and, if ice forms intracellularly, direct membrane puncture by ice crystals; cold-acclimated tissue increases membrane unsaturated-fatty-acid content (maintaining membrane fluidity at low temperature, preventing the phase transition that would otherwise rupture the membrane) and accumulates the same compatible solutes used in drought response, since freeze-induced cellular dehydration and drought-induced water deficit present the plant with an overlapping physiological problem.

### Biotic Defense: Constitutive and Induced Barriers

Plants maintain **constitutive defenses** present regardless of attack, the cuticle and cell wall as physical barriers, and preformed antimicrobial/antifeedant secondary metabolites (e.g. tannins, which bind and precipitate proteins, reducing herbivore digestive efficiency and palatability), alongside **induced defenses** activated specifically upon attack, which are faster to deploy only when actually needed and less costly to maintain constitutively across the plant's whole lifetime.

### The Hypersensitive Response and Systemic Acquired Resistance

Localized pathogen recognition (via plant immune receptors detecting pathogen-associated molecules) can trigger the **hypersensitive response (HR)**: rapid, localized **programmed cell death** at and immediately around the infection site, which deprives biotrophic pathogens (which require living host tissue to feed) of the living cells they depend on, physically containing the infection to a small necrotic lesion rather than allowing it to spread through continuously living tissue.

![Hypersensitive response: a leaf showing multiple discrete necrotic lesions, each a ring of dead tissue localized around and containing an infection site](/PLANTPHYSIOPICS/hypersensitive-response.png)
*Source: Wikipedia*

HR is typically accompanied by a burst of reactive oxygen species and local **salicylic acid** accumulation, which, beyond its local role, also functions as a signal (itself or via a derived mobile signal) that travels systemically to uninfected parts of the plant, inducing **systemic acquired resistance (SAR)**: a primed, heightened defensive state (including elevated expression of **pathogenesis-related (PR) proteins**, many with direct antimicrobial activity such as chitinases degrading fungal cell walls) across the whole plant, providing broad, long-lasting resistance to subsequent infection by a wide range of pathogens, not just the one that triggered HR initially — an induced, whole-plant analog of an immune "memory," though mechanistically unrelated to (and evolutionarily independent of) the adaptive immune memory covered for vertebrates on [Immune Physiology](../../3-animal-physiology/immune-physiology/).

![Systemic acquired resistance signaling downstream of R-gene-mediated resistance: salicylic acid triggers induction of PR-proteins (resistance to fungi and bacteria), increased RdRP expression (increased viral RNA turnover), and AOX-dependent expression of other defense genes (inhibition of viral replication and movement)](/PLANTPHYSIOPICS/systemic-acquired-resistance.png)
*Source: ScienceDirect (topic page, "Systemic Acquired Resistance")*

### Herbivory Defense

Beyond constitutive deterrents like tannins, many species mount **induced** anti-herbivore responses: mechanical damage or herbivore saliva components trigger **jasmonic acid** signaling (a hormone pathway distinct from but interacting with the six covered on [Plant Hormones](../plant-hormones/)), which upregulates production of defensive secondary metabolites — protease inhibitors (impairing the herbivore's digestive enzymes), alkaloids, or, in some species, **volatile organic compounds** released from damaged tissue that can attract the herbivore's own natural predators or parasitoids (an indirect defense, recruiting a third party rather than acting on the herbivore directly) or warn neighboring undamaged tissue/plants to preemptively upregulate their own defenses before being attacked themselves.

![Induced plant defense after herbivore damage: JA/JA-Ile signaling in the damaged cell upregulates mRNA/enzyme production, protease inhibitors, and phytoalexins (direct defense), while released green leaf volatiles (GLVs) and other volatile organic compounds (VOCs) attract the herbivore's natural enemies — wasps, predatory flies, spiders (indirect defense)](/PLANTPHYSIOPICS/induced-herbivory-defense.png)
*Source: ResearchGate, fig. 2, "Schematic picture of induced plant defense"*

## Comparative Structures

| Stress type | Primary signal/mediator | Core response | Mechanism reused from elsewhere in this section |
|---|---|---|---|
| Drought | ABA | Stomatal closure, osmotic adjustment | Stomatal Physiology, Water Transport |
| Salinity | Ion channel selectivity, Na+/H+ antiporters | Na+ exclusion or vacuolar compartmentalization | Water potential framework, vacuolar storage (cf. CAM) |
| Heat | Heat-shock proteins | Chaperone-mediated protein protection | — |
| Cold | Membrane composition shift, compatible solutes | Membrane fluidity maintenance, cellular dehydration tolerance | Compatible solute accumulation (shared with drought) |
| Biotic (localized) | Salicylic acid, ROS | Hypersensitive response (localized cell death) | — |
| Biotic (systemic) | Salicylic acid (mobile signal) | Systemic acquired resistance, PR protein induction | — |
| Herbivory | Jasmonic acid | Digestive inhibitors, toxins, volatile signaling | Interacts with hormone signaling from Plant Hormones |

## Common Exam Questions

- "Explain why ABA-driven stomatal closure under drought stress necessarily reduces photosynthetic rate, referencing the trade-off established on Stomatal Physiology."
- "Distinguish the osmotic and ionic components of salinity stress, and describe one plant response to each."
- "Explain why the hypersensitive response is an effective defense specifically against biotrophic pathogens, referencing what those pathogens require from living host tissue."
- "Explain the relationship between the hypersensitive response and systemic acquired resistance, naming the mobile signal connecting them."
- "Distinguish a constitutive plant defense from an induced defense, and explain the trade-off that favors maintaining some defenses constitutively and others only upon induction."
- "Explain how a volatile organic compound released from herbivore-damaged tissue can function as an indirect defense."

## Visual Reference

**Interactive**

- **Drought response cascade (click-through, extends the Stomatal Physiology diagram)** — clicking through rising ABA levels shows stomatal closure, reduced CO2 uptake, and osmotic adjustment occurring in sequence, with a running photosynthesis-rate readout showing the water-conservation/carbon-gain trade-off numerically as ABA rises.

<div id="drought-cascade-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 160 100" width="140" height="88" style="display:block; margin:0 auto;">
    <path id="dcTop" d="M 20 45 Q 80 25 140 45 Q 80 35 20 45 Z" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
    <path id="dcBottom" d="M 20 55 Q 80 75 140 55 Q 80 65 20 55 Z" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
  </svg>
  <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; text-align:center;">ABA level (rising drought stress)</label>
  <input type="range" id="dcSlider" min="0" max="100" value="0" style="width:100%; max-width:300px; display:block; margin:0 auto;">
  <div id="dcReadout" style="text-align:center; margin-top:8px; font-size:0.85rem; font-weight:600; color:#1a472a;">Stomatal aperture: 100% | Photosynthesis rate: 100% of max</div>
  <div id="dcNote" style="text-align:center; margin-top:6px; font-size:0.82rem; color:#4b5563;">No water stress — stomata fully open, photosynthesis unrestricted.</div>
</div>
<script>
(function(){
  var slider = document.getElementById('dcSlider');
  var top = document.getElementById('dcTop');
  var bottom = document.getElementById('dcBottom');
  var readout = document.getElementById('dcReadout');
  var note = document.getElementById('dcNote');
  function update(){
    var aba = parseInt(slider.value,10);
    var aperture = Math.max(0, 100 - aba);
    var photo = Math.max(5, Math.round(100 - aba*0.9));
    var gap = (aperture/100) * 12;
    top.setAttribute('d', 'M 20 '+(45-gap*0.3)+' Q 80 '+(45-gap)+' 140 '+(45-gap*0.3)+' Q 80 '+(45-gap*0.5)+' 20 '+(45-gap*0.3)+' Z');
    bottom.setAttribute('d', 'M 20 '+(55+gap*0.3)+' Q 80 '+(55+gap)+' 140 '+(55+gap*0.3)+' Q 80 '+(55+gap*0.5)+' 20 '+(55+gap*0.3)+' Z');
    readout.textContent = 'Stomatal aperture: ' + aperture + '% | Photosynthesis rate: ' + photo + '% of max';
    if (aba < 20){
      note.textContent = 'No water stress, stomata fully open, photosynthesis unrestricted.';
    } else if (aba < 60){
      note.textContent = 'Rising ABA closes stomata to conserve water — CO2 uptake and photosynthesis fall as a direct cost.';
    } else {
      note.textContent = 'High ABA — stomata nearly closed, photosynthesis sharply limited, and osmotic adjustment (proline/sugar accumulation) is now active to retain cellular water.';
    }
  }
  slider.addEventListener('input', update);
  update();
})();
</script>

- **Hypersensitive response / SAR spread simulator (SVG/JS)** — a leaf diagram where clicking an infection site triggers a localized necrotic lesion (HR) and then an animated systemic signal spreading to the rest of the plant, activating a visibly "primed" state (PR protein icon) in distant, uninfected tissue.

<div id="hr-sar-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 300 140" width="100%" style="max-width:320px; display:block; margin:0 auto;">
    <ellipse cx="70" cy="70" rx="45" ry="30" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
    <circle id="hrLesion" cx="70" cy="70" r="0" fill="#7c5a3a" stroke="#3f2d1a" stroke-width="1.5"/>
    <ellipse cx="220" cy="45" rx="38" ry="24" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
    <text id="prIcon1" x="220" y="50" text-anchor="middle" font-size="14" opacity="0">&#128737;&#65039;</text>
    <ellipse cx="230" cy="100" rx="38" ry="24" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="2"/>
    <text id="prIcon2" x="230" y="105" text-anchor="middle" font-size="14" opacity="0">&#128737;&#65039;</text>
    <circle id="signalDot1" cx="115" cy="70" r="5" fill="#7c3aed" opacity="0"/>
    <circle id="signalDot2" cx="115" cy="70" r="5" fill="#7c3aed" opacity="0"/>
  </svg>
  <div style="text-align:center;">
    <button id="hrInfectBtn" style="background:#b91c1c; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Infect leaf 1</button>
    <div id="hrNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563; min-height:2.4em;">Click to simulate a pathogen infecting the left leaf.</div>
  </div>
</div>
<script>
(function(){
  var btn = document.getElementById('hrInfectBtn');
  var lesion = document.getElementById('hrLesion');
  var dot1 = document.getElementById('signalDot1');
  var dot2 = document.getElementById('signalDot2');
  var pr1 = document.getElementById('prIcon1');
  var pr2 = document.getElementById('prIcon2');
  var note = document.getElementById('hrNote');
  var running = false;
  function reset(){
    lesion.setAttribute('r', 0);
    dot1.style.opacity = 0;
    dot2.style.opacity = 0;
    dot1.setAttribute('cx', 115);
    dot2.setAttribute('cx', 115);
    pr1.setAttribute('opacity', 0);
    pr2.setAttribute('opacity', 0);
    note.textContent = 'Click to simulate a pathogen infecting the left leaf.';
  }
  btn.addEventListener('click', function(){
    if (running){ return; }
    running = true;
    reset();
    setTimeout(function(){
      lesion.setAttribute('r', 12);
      note.textContent = 'Hypersensitive response: localized programmed cell death forms a necrotic lesion, containing the infection at the source leaf.';
    }, 150);
    setTimeout(function(){
      dot1.style.opacity = 1;
      dot2.style.opacity = 1;
      note.textContent = 'Salicylic acid spreads systemically from the infection site to uninfected leaves.';
    }, 1200);
    setTimeout(function(){
      dot1.setAttribute('cx', 220);
      dot2.setAttribute('cx', 230);
    }, 1300);
    setTimeout(function(){
      pr1.setAttribute('opacity', 1);
      pr2.setAttribute('opacity', 1);
      dot1.style.opacity = 0;
      dot2.style.opacity = 0;
      note.textContent = 'Systemic acquired resistance: distant, never-infected leaves now express PR proteins, primed with broad, long-lasting resistance.';
    }, 2300);
    setTimeout(function(){ running = false; }, 3000);
  });
  reset();
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. No image was sourced for the Drought Stress section's compatible-solute mechanism specifically.)*

## Practice Problems

1. Explain why a drought-stressed plant's photosynthetic rate falls even before any visible wilting occurs, tracing the causal chain from soil water potential to stomatal aperture to CO2 availability.
2. A plant growing in saline soil accumulates high internal Na+ concentrations but shows no toxicity symptoms. Propose a cellular mechanism explaining this tolerance.
3. Explain why the hypersensitive response would be an ineffective strategy against a necrotrophic pathogen (one that feeds on and benefits from dead tissue), even though it works well against biotrophic pathogens.
4. A plant with an experimentally infected leaf shows heightened pathogen resistance in leaves on the opposite side of the plant that were never directly infected. Explain the mechanism responsible.
5. Explain why maintaining tannins constitutively but reserving jasmonic-acid-induced defenses for actual herbivore attack represents an energetic trade-off, rather than the plant simply deploying its strongest defense at all times.
