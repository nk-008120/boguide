---
title: "Mineral Nutrition & Nutrient Uptake"
weight: 4
description: "Essential macro- and micronutrients and their deficiency symptoms, active/selective ion uptake mechanisms at the root, and the nitrogen-fixing Rhizobium and mycorrhizal symbioses that extend a plant's nutrient-acquisition capacity beyond what its own roots can achieve alone."
difficulty: "intermediate"
prerequisites: ["Water-Transport-Transpiration"]
syllabus_tags: ["IBO", "USABO", "plant-physiology"]
---
{{< topic-meta >}}

## Overview

Water movement into the root, covered on [Water Transport & Transpiration](../water-transport-transpiration/), is not selective — it moves down a water potential gradient regardless of what's dissolved in it. Mineral uptake is a separate problem: the plant needs specific ions in specific amounts, often against their own concentration gradient, and it solves this both with its own root machinery and by outsourcing part of the task to microbial partners. This page covers what nutrients a plant actually needs, how its roots take them up selectively, and the two major symbioses — nitrogen-fixing bacteria and mycorrhizal fungi — that extend a plant's effective root system far beyond its own tissue.

## Key Concepts

### Essential Elements

An element is **essential** only if a plant cannot complete its life cycle without it, the deficiency is specifically correctable by supplying that element and no other, and the element is directly involved in the plant's metabolism (not merely beneficial indirectly). Essential elements are grouped by the quantity required:

- **Macronutrients** (needed in large quantity) — carbon, hydrogen, oxygen (from air and water, not soil-derived and rarely limiting), then the soil-derived macronutrients nitrogen (amino acids, nucleic acids, chlorophyll), potassium (osmotic/turgor regulation, enzyme activation, the guard cell ion covered on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)), calcium (cell wall middle lamella, signaling), magnesium (chlorophyll's central atom), phosphorus (ATP, nucleic acids, phospholipids), and sulfur (some amino acids, coenzymes).
- **Micronutrients** (needed in trace quantity, but still strictly essential) — iron (chlorophyll synthesis, electron transport chain components, see [Light Reactions & Photophosphorylation](../light-reactions-photophosphorylation/)), manganese, zinc, copper, boron, molybdenum (a cofactor of nitrogenase, see below), chlorine, and nickel.

Deficiency symptoms are diagnostic and depend heavily on whether the element is **phloem-mobile** — mobile elements (N, P, K, Mg) can be resorbed from older leaves and relocated to actively growing tissue when supply is short, so their deficiency symptoms (commonly chlorosis, yellowing from lost chlorophyll) appear first in **older leaves**; immobile elements (Ca, B, Fe in most species) cannot be relocated once incorporated, so their deficiency symptoms appear first in **younger, actively growing tissue** instead — a single mobility fact that converts "which leaves show symptoms first" into a diagnostic clue for which nutrient is deficient.

![Deficiency symptom chart across macro- and micronutrients, keyed to leaf position on the stem: immobile elements (calcium, boron) shown affecting the youngest growth at the tip, mobile elements (nitrogen, potassium, phosphorus, magnesium) shown affecting older lower leaves first](/PLANTPHYSIOPICS/essential-element-deficiency.png)
*Source: public domain*

### Root Uptake Mechanisms

Soil mineral ions are typically far more dilute than the concentration a root cell needs internally, so uptake is predominantly **active transport** rather than passive diffusion:

- **Active transport via membrane proteins** — H⁺-ATPases pump protons out of root epidermal/cortical cells, generating both a membrane potential and a pH gradient (a **proton motive force**) that is then used to drive selective ion uptake through specific channels and **secondary active transporters** (symporters and antiporters that move a mineral ion against its gradient by coupling it to H⁺ moving down its gradient) — mechanistically the same proton-gradient-coupled strategy phloem loading uses (see [Phloem Transport & Translocation](../phloem-transport-translocation/)), applied here to mineral uptake instead of sucrose.

![Membrane transport underlying the proton motive force: an ATP-driven H+ pump establishes a charge and pH gradient across the membrane, which channels (cation/anion/water) and carriers (symport, antiport, uniport) then use to move other solutes across](/PLANTPHYSIOPICS/proton-motive-force-uptake.png)
*Source: ScienceDirect (journal article, S0005273600001280)*
- **Root hairs** (see [Root Anatomy](../../6-plant-anatomy/root-anatomy/)) dramatically increase the absorptive surface area available for this uptake machinery per unit root length, without requiring the root system itself to grow proportionally larger.
- Once inside the epidermis/cortex, ions can travel toward the stele apoplastically or symplastically exactly as water does (see [Water Transport & Transpiration](../water-transport-transpiration/)), and are likewise forced from the apoplast into the symplast at the endodermal Casparian strip — giving the plant the same single regulatory checkpoint over mineral entry into the vascular cylinder that it has over water entry.

### Nitrogen Fixation and the *Rhizobium* Symbiosis

Atmospheric N₂ is abundant but chemically inert (a strong triple bond) and unusable by plants directly; **nitrogen fixation** — reducing N₂ to biologically usable NH₃/NH₄⁺ — is performed only by certain prokaryotes, using the enzyme **nitrogenase** (with a molybdenum-iron cofactor, the reason molybdenum is an essential plant micronutrient despite the plant not fixing nitrogen itself). Legumes form a specific symbiosis with **Rhizobium** bacteria: the bacteria infect root hairs and induce the plant to form specialized **root nodules**, inside which Rhizobium differentiate into nitrogen-fixing **bacteroids**. The relationship is mutualistic and tightly regulated on both sides — the plant supplies the bacteroids with carbohydrate (photosynthate delivered via phloem) and synthesizes **leghemoglobin** inside the nodule specifically to bind free O₂ and keep the nodule's internal oxygen concentration low (nitrogenase is irreversibly inactivated by O₂), while the bacteroids supply the plant with fixed nitrogen it could not otherwise access from most soils at a comparable energetic cost. This is the physiological mechanism underlying the "nitrogen fixation" entry in the ecosystem-level nitrogen cycle covered in [Ecology](../../8-ecology/) — that page treats nitrogen fixation as one flux among many in a whole-ecosystem nutrient budget, while this page covers the specific plant-microbe mechanism producing that flux.

![Root nodule structure compared across a lateral root, leguminous determinate and indeterminate nodules, and an actinorhizal nodule: epidermis, cortex, pericycle, endodermis, peripheral vasculature, and the infected cells housing the nitrogen-fixing symbiont are labeled in each](/PLANTPHYSIOPICS/root-nodule-cross-section.png)
*Source: ScienceDirect (topic page, "Root Nodule")*

### Mycorrhizal Symbiosis

Independent of nitrogen fixation, most land plant species (a large majority, across nearly every major lineage) form **mycorrhizae** — symbioses with soil fungi that extend nutrient absorption well beyond the physical reach and surface area of the root system itself:

- **Arbuscular mycorrhizae** — fungal hyphae penetrate root cortical cell walls (but not the plasma membrane) and form highly branched **arbuscules** within the cell, a large-surface-area interface for nutrient exchange; the dominant mycorrhizal type across most plant lineages, especially effective at improving phosphorus uptake (an ion that diffuses very slowly through soil and is easily depleted in the immediate vicinity of a root).

![Arbuscular mycorrhizal fungus-plant symbiosis: extraradical mycelium and spores in the soil, hyphal branching and a hyphopodium at the root epidermis, intraradical hyphae penetrating cortical cells, and branched arbuscules and vesicles formed within cortex cells](/PLANTPHYSIOPICS/arbuscular-mycorrhiza.png)
*Source: ResearchGate, fig. 1, "Arbuscular mycorrhizal fungi colonize root cortical cells through germinating spores"*

- **Ectomycorrhizae** — fungal hyphae form a dense sheath around the root surface and penetrate between (not into) cortical cells, forming a **Hartig net**; characteristic of many temperate forest trees (pines, oaks, beeches).

![Ectomycorrhizal structure compared between an angiosperm and a pine root: external hyphae and mantle hyphae sheathing the root surface, Hartig net hyphae between epidermal and cortex cells (not entering them), hypodermis and endodermis labeled](/PLANTPHYSIOPICS/ectomycorrhiza-hartig-net.png)
*Source: public domain*

In both types the fungus receives photosynthate from the plant in exchange for extending the effective absorptive surface area for water and, especially, poorly mobile mineral ions like phosphorus — a division of labor directly analogous to the Rhizobium symbiosis above, but for general mineral/water uptake rather than nitrogen specifically, and via a fungal rather than bacterial partner.

## Comparative Structures

| Feature | *Rhizobium* symbiosis | Mycorrhizal symbiosis |
|---|---|---|
| Partner organism | Nitrogen-fixing bacteria | Soil fungi |
| Host range | Mostly legumes | Most land plant lineages |
| Structure formed | Root nodule (bacteroids inside) | Arbuscules (within cells) or Hartig net (around/between cells) |
| Nutrient supplied to plant | Fixed nitrogen (NH3/NH4+) | Primarily phosphorus and water; some nitrogen |
| Plant cost | Photosynthate + leghemoglobin synthesis (O2 exclusion) | Photosynthate |
| Key limiting factor addressed | Inert atmospheric N2 unusable directly | Slow ion diffusion / limited root surface area/reach |

## Common Exam Questions

- "Define the criteria for an element to be classified as essential, and distinguish macronutrients from micronutrients by the underlying reason for the classification (quantity needed, not degree of essentiality)."
- "Explain why a nitrogen deficiency produces chlorosis first in older leaves, while a calcium deficiency affects new growth first, referencing nutrient mobility."
- "Explain why root mineral uptake is predominantly active rather than passive, and describe the proton motive force mechanism driving it."
- "Explain why the Rhizobium-legume symbiosis requires the plant to synthesize leghemoglobin, referencing nitrogenase's specific vulnerability."
- "Distinguish arbuscular mycorrhizae from ectomycorrhizae by their structural interface with the root, and identify which is more effective at improving phosphorus uptake specifically."

## Visual Reference

**Interactive**

- **Nutrient deficiency diagnostic tool (click-through)** — a diagram of a plant showing older and younger leaves separately; clicking a nutrient (N, Ca, Fe, etc.) highlights which leaves show the deficiency symptom first, reinforcing the mobile/immobile distinction as a diagnostic rule rather than a memorized list.

<div id="nutrient-diag-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 220 260" width="200" height="240" style="display:block; margin:0 auto;">
    <line x1="110" y1="30" x2="110" y2="240" stroke="#2d6a4f" stroke-width="4"/>
    <g id="youngLeaves">
      <ellipse cx="90" cy="45" rx="22" ry="10" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5" transform="rotate(-20 90 45)"/>
      <ellipse cx="130" cy="45" rx="22" ry="10" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5" transform="rotate(20 130 45)"/>
      <ellipse cx="110" cy="30" rx="10" ry="18" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5"/>
    </g>
    <g id="oldLeaves">
      <ellipse cx="70" cy="150" rx="34" ry="14" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5" transform="rotate(-15 70 150)"/>
      <ellipse cx="150" cy="150" rx="34" ry="14" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5" transform="rotate(15 150 150)"/>
      <ellipse cx="65" cy="200" rx="34" ry="14" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5" transform="rotate(-15 65 200)"/>
      <ellipse cx="155" cy="200" rx="34" ry="14" fill="#8fbf8f" stroke="#2d6a4f" stroke-width="1.5" transform="rotate(15 155 200)"/>
    </g>
    <text x="110" y="20" text-anchor="middle" font-size="10" fill="#4b5563">younger leaves</text>
    <text x="110" y="235" text-anchor="middle" font-size="10" fill="#4b5563">older leaves</text>
  </svg>
  <div style="text-align:center;">
    <div style="margin-bottom:8px; font-size:0.8rem; color:#4b5563;">Mobile (resorbed from old growth):</div>
    <button class="nd-btn" data-mobile="1" style="background:#2d6a4f; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">N</button>
    <button class="nd-btn" data-mobile="1" style="background:#2d6a4f; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">P</button>
    <button class="nd-btn" data-mobile="1" style="background:#2d6a4f; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">K</button>
    <button class="nd-btn" data-mobile="1" style="background:#2d6a4f; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">Mg</button>
    <div style="margin:8px 0; font-size:0.8rem; color:#4b5563;">Immobile (stays where deposited):</div>
    <button class="nd-btn" data-mobile="0" style="background:#b45309; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">Ca</button>
    <button class="nd-btn" data-mobile="0" style="background:#b45309; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">B</button>
    <button class="nd-btn" data-mobile="0" style="background:#b45309; color:#fff; border:none; padding:6px 12px; border-radius:999px; font-size:0.82rem; cursor:pointer; margin:2px;">Fe</button>
    <div id="ndNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563;">Click a nutrient to see which leaves show its deficiency symptom first.</div>
  </div>
</div>
<script>
(function(){
  var buttons = document.querySelectorAll('#nutrient-diag-widget .nd-btn');
  var young = document.getElementById('youngLeaves');
  var old = document.getElementById('oldLeaves');
  var note = document.getElementById('ndNote');
  function reset(){
    young.querySelectorAll('ellipse').forEach(function(e){ e.setAttribute('fill','#8fbf8f'); });
    old.querySelectorAll('ellipse').forEach(function(e){ e.setAttribute('fill','#8fbf8f'); });
  }
  buttons.forEach(function(btn){
    btn.addEventListener('click', function(){
      reset();
      var isMobile = btn.dataset.mobile === '1';
      var el = btn.textContent;
      if (isMobile){
        old.querySelectorAll('ellipse').forEach(function(e){ e.setAttribute('fill','#fde68a'); });
        note.textContent = el + ' is phloem-mobile — it is resorbed from older leaves and relocated to new growth when supply is short, so deficiency symptoms (chlorosis) appear first in older leaves.';
      } else {
        young.querySelectorAll('ellipse').forEach(function(e){ e.setAttribute('fill','#fde68a'); });
        note.textContent = el + ' is immobile — once incorporated it cannot be relocated, so deficiency symptoms appear first in younger, actively growing tissue.';
      }
    });
  });
})();
</script>

- **Proton motive force ion uptake animator (SVG/JS)** — a root epidermal cell membrane with an H+-ATPase; activating it shows the resulting pH/voltage gradient, then a coupled secondary transporter using that gradient to pull a mineral ion in against its own concentration gradient.

<div id="pmf-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 400 160" width="100%" style="max-width:420px; display:block; margin:0 auto;">
    <text x="80" y="20" font-size="12" font-weight="600" fill="#334155">Soil (apoplast)</text>
    <rect x="10" y="30" width="380" height="10" fill="#e2e8f0"/>
    <text x="300" y="150" font-size="12" font-weight="600" fill="#334155">Root cell (cytosol)</text>
    <circle cx="120" cy="40" r="9" fill="#94a3b8" id="pmfPump"/>
    <text x="120" y="44" font-size="7" text-anchor="middle" fill="#fff">ATPase</text>
    <path id="hOutArrow" d="M120 40 L120 20" stroke="#b91c1c" stroke-width="3" opacity="0" marker-end="url(#pmfArrow)"/>
    <text id="hOutLabel" x="135" y="18" font-size="11" fill="#b91c1c" opacity="0">H+ out</text>
    <circle cx="260" cy="40" r="9" fill="#1d70a2" id="pmfSymporter"/>
    <text x="260" y="44" font-size="7" text-anchor="middle" fill="#fff">Sym</text>
    <path id="hInArrow" d="M260 20 L260 40" stroke="#b91c1c" stroke-width="3" opacity="0" marker-end="url(#pmfArrow)"/>
    <path id="ionInArrow" d="M275 20 L275 40" stroke="#7c3aed" stroke-width="3" opacity="0" marker-end="url(#pmfArrowPurple)"/>
    <text id="ionLabel" x="300" y="18" font-size="11" fill="#7c3aed" opacity="0">mineral ion in</text>
    <text id="gradientLabel" x="190" y="70" text-anchor="middle" font-size="11" fill="#334155" opacity="0">pH / voltage gradient</text>
    <defs>
      <marker id="pmfArrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#b91c1c"/></marker>
      <marker id="pmfArrowPurple" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#7c3aed"/></marker>
    </defs>
  </svg>
  <div style="text-align:center;">
    <button id="pmfActivateBtn" style="background:#2d6a4f; color:#fff; border:none; padding:9px 18px; border-radius:999px; font-size:0.88rem; cursor:pointer;">Activate H+-ATPase</button>
    <div id="pmfNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563;">Click to pump protons out and build the proton motive force.</div>
  </div>
</div>
<script>
(function(){
  var btn = document.getElementById('pmfActivateBtn');
  var hOut = document.getElementById('hOutArrow');
  var hOutLabel = document.getElementById('hOutLabel');
  var gradientLabel = document.getElementById('gradientLabel');
  var hIn = document.getElementById('hInArrow');
  var ionIn = document.getElementById('ionInArrow');
  var ionLabel = document.getElementById('ionLabel');
  var note = document.getElementById('pmfNote');
  function reset(){
    hOut.style.opacity = 0;
    hOutLabel.style.opacity = 0;
    gradientLabel.style.opacity = 0;
    hIn.style.opacity = 0;
    ionIn.style.opacity = 0;
    ionLabel.style.opacity = 0;
    note.textContent = 'Click to pump protons out and build the proton motive force.';
  }
  btn.addEventListener('click', function(){
    btn.disabled = true;
    btn.textContent = 'Replay';
    reset();
    setTimeout(function(){
      hOut.style.opacity = 1;
      hOutLabel.style.opacity = 1;
      note.textContent = 'H+-ATPase pumps protons out of the cell, hyperpolarizing the membrane and lowering apoplast pH...';
    }, 150);
    setTimeout(function(){
      gradientLabel.style.opacity = 1;
      note.textContent = 'A proton motive force now exists across the membrane — both a pH gradient and a voltage gradient.';
    }, 1200);
    setTimeout(function(){
      hIn.style.opacity = 1;
      ionIn.style.opacity = 1;
      ionLabel.style.opacity = 1;
      note.textContent = 'A secondary transporter (symporter) lets H+ flow back down its gradient, coupling that energetically favorable movement to pulling a mineral ion in against its own concentration gradient.';
    }, 2200);
    setTimeout(function(){ btn.disabled = false; }, 3100);
  });
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. A crop shows yellowing (chlorosis) beginning in its oldest leaves. Identify whether the deficient nutrient is more likely to be nitrogen or calcium, and explain your reasoning using nutrient mobility.
2. Explain why a mutation that inactivates a root cell's H+-ATPase would impair mineral ion uptake generally, not just uptake of one specific ion.
3. A legume grown in nitrogen-poor, sterile (microbe-free) soil grows poorly compared to the same species grown in soil containing Rhizobium. Explain the mechanism responsible for the difference.
4. Explain why molybdenum is an essential micronutrient for a plant that does not itself perform nitrogen fixation.
5. A plant grown with intact mycorrhizal associations shows better growth in phosphorus-poor soil than a mycorrhiza-free control of the same species. Explain the mechanism responsible.
