---
title: "Human Integumentary System"
weight: 3
description: "Epidermal strata and keratinization, dermal structure and cutaneous sensory receptors, hair and nail structure, glands, and the structural basis of thermoregulation, split from the combined Skeletal/Integumentary page for full IBO depth."
difficulty: "beginner"
prerequisites: ["Body-Plans"]
syllabus_tags: ["IBO", "USABO", "human-anatomy"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

Skin is the body's largest organ by surface area, and structurally one of the most information-dense. A cross-section shows layered epithelium, embedded sensory receptors, glands, and appendage-generating structures all in a few millimeters of thickness. This page covers that structure at the depth IBO exams test: named epidermal strata, dermal receptor types, and the mechanistic link between structure and thermoregulatory/sensory function.

## Key Concepts

### Epidermis: Layers and Keratinization

The epidermis is stratified squamous epithelium (see [Body Plans](../body-plans/)), avascular, renewed continuously from its deepest layer. In thick skin (palms, soles), five strata are present, deepest to most superficial:

| Stratum | Key features |
|---|---|
| **Basale (germinativum)** | Single layer of cuboidal/columnar cells on the basement membrane; mitotically active, the source of all epidermal renewal; also contains melanocytes and Merkel cells (see below) |
| **Spinosum** | Several layers of polyhedral cells connected by numerous desmosomes ("spines" seen in fixed histology are desmosomal attachment points, not a true structural feature of living cells); contains Langerhans cells |
| **Granulosum** | Cells flattening, accumulating keratohyalin granules (precursor to keratin) and lamellar granules (secrete a lipid barrier into the intercellular space); cells begin to die as their nuclei degrade |
| **Lucidum** | Thin, clear layer of dead, densely packed cells, present only in thick skin |
| **Corneum** | Many layers of dead, flattened, fully keratinized cells (**corneocytes**) that are continuously shed (desquamation) and replaced from below |

This basale-to-corneum progression is a single continuous process, **keratinization**: a cell born at the basale migrates outward over roughly 2–4 weeks, progressively filling with keratin, losing its nucleus and organelles, and finally becoming a dead, flattened, keratin-filled sac that is mechanically tough and metabolically inert, the structural basis of the epidermis's barrier function. Thin skin (most of the body) has the same layer sequence minus the stratum lucidum, and a thinner stratum corneum.

![Full-thickness skin block showing epidermis, dermis, and subcutaneous tissue with a hair follicle (A), and a zoomed view of the epidermis with all five strata labeled: stratum corneum, lucidum, granulosum, spinosum, and basale (B).](/ANATOMYPICS/skin-cross-section-five-strata.png)
*Source:*

**Epidermal cell types**, beyond the keratinocytes that make up the bulk of every layer: **melanocytes** (stratum basale, produce the pigment melanin in organelles called melanosomes, then transfer melanosomes to surrounding keratinocytes via dendritic processes; melanin content, not melanocyte number, which is roughly constant across skin tones, is what differs between individuals); **Langerhans cells** (stratum spinosum, dendritic, antigen-presenting immune cells, the skin's front-line immune surveillance); **Merkel cells** (stratum basale, associated with sensory nerve endings, function in light touch discrimination).

![Top-left inset: a dendritic melanocyte (brown) transferring melanosomes (black granules) directly to surrounding keratinocytes. Main panel: a separate, more technical diagram of intracellular melanosome transport within a melanocyte, showing dynein motor proteins carrying melanosomes along microtubules toward the cell body.](/ANATOMYPICS/melanosome-transfer-melanocyte-keratinocyte.png)
*Source: research figure. Only the small inset actually shows transfer to keratinocytes as described in the text; the larger main diagram illustrates a related but distinct process, intracellular dynein/microtubule-based melanosome trafficking within the melanocyte itself, not the transfer step.*
### Dermis

Beneath the epidermis, separated by the basement membrane, the dermis is dense irregular/dense regular connective tissue (see [Body Plans](../body-plans/)) in two sublayers:

- **Papillary layer**: thin, loose connective tissue, forms finger-like **dermal papillae** projecting into the epidermis (increasing the interface surface area and mechanical interlock between the two layers, the structural basis of fingerprints, where papillae are arranged in patterned ridges); rich in capillary loops and Meissner's corpuscles (see below).
- **Reticular layer**: thicker, dense irregular connective tissue with interwoven collagen and elastin fibers providing tensile strength and elasticity; contains most of the skin's glands, hair follicles, and deeper sensory receptors.

![Histology section showing the epidermis sitting atop the papillary dermis (finger-like projections interlocking with the epidermal underside) and the deeper, denser reticular dermis.](/ANATOMYPICS/dermal-papillae-epidermal-junction.jpg)
*Source: Unspecified. the papillary/reticular dermis distinction and the interlocking papillae are both visible.*

**Cutaneous sensory receptors**, each structurally specialized for a distinct stimulus modality, a favorite IBO comparison table:

| Receptor | Location | Stimulus detected |
|---|---|---|
| Meissner's corpuscles | Papillary dermis, dense in fingertips/lips | Light touch, low-frequency vibration |
| Pacinian corpuscles | Deep dermis/hypodermis, concentric lamellae ("onion-like") | Deep pressure, high-frequency vibration |
| Merkel discs | Stratum basale (epidermis) | Sustained light touch, texture |
| Ruffini endings | Deep dermis | Skin stretch, sustained pressure |
| Free nerve endings | Throughout epidermis and dermis | Pain, temperature |

![All five cutaneous receptor types positioned at their depths in a skin cross-section: Merkel's disk and Meissner's corpuscle near the epidermal-dermal boundary, Ruffini ending and Pacinian corpuscle deeper in the dermis, plus a bonus sixth receptor type (Krause end bulb) not covered in the text.](/ANATOMYPICS/cutaneous-receptors-by-depth.png)
*Source: OpenStax-style figure (via Lumen Learning). Exact match for all five receptor types in the table above; includes one extra receptor type (Krause end bulb) beyond this page's scope.*

<div style="width:100%; background:#fefcf5; border-radius:24px; padding:1.2rem; margin:1.5rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:'Inter',system-ui,sans-serif;">
  <h3 style="margin:0 0 0.8rem 0; color:#1a472a;">🔬 Skin Cross-Section Hotspot Diagram</h3>
  <div style="display:flex; gap:2rem; flex-wrap:wrap; align-items:flex-start;">
    <div style="flex:0 0 260px;">
      <svg id="skinSvg" viewBox="0 0 300 400" style="width:100%; max-width:260px; display:block; margin:0 auto; border-radius:8px; overflow:hidden;">
        <rect x="0" y="0" width="300" height="30" fill="#f3e6c9" class="skin-hotspot" data-key="corneum" style="cursor:pointer;"/>
        <rect x="0" y="30" width="300" height="15" fill="#f7efd6" class="skin-hotspot" data-key="lucidum" style="cursor:pointer;"/>
        <rect x="0" y="45" width="300" height="25" fill="#ecd9ab" class="skin-hotspot" data-key="granulosum" style="cursor:pointer;"/>
        <rect x="0" y="70" width="300" height="40" fill="#e0c48f" class="skin-hotspot" data-key="spinosum" style="cursor:pointer;"/>
        <rect x="0" y="110" width="300" height="15" fill="#c98f5e" class="skin-hotspot" data-key="basale" style="cursor:pointer;"/>
        <rect x="0" y="125" width="300" height="45" fill="#f2b6ad" class="skin-hotspot" data-key="papillary" style="cursor:pointer;"/>
        <rect x="0" y="170" width="300" height="150" fill="#e8938a" class="skin-hotspot" data-key="reticular" style="cursor:pointer;"/>
        <rect x="0" y="320" width="300" height="80" fill="#f7e2b8" class="skin-hotspot" data-key="hypodermis" style="cursor:pointer;"/>
        <circle cx="230" cy="118" r="8" fill="#2d6a4f" class="skin-hotspot" data-key="merkel" style="cursor:pointer;"/>
        <circle cx="70" cy="142" r="9" fill="#1f5c99" class="skin-hotspot" data-key="meissner" style="cursor:pointer;"/>
        <circle cx="200" cy="240" r="10" fill="#7a3f96" class="skin-hotspot" data-key="ruffini" style="cursor:pointer;"/>
        <circle cx="90" cy="350" r="14" fill="#b1650f" class="skin-hotspot" data-key="pacinian" style="cursor:pointer;"/>
        <circle cx="150" cy="90" r="6" fill="#c0392b" class="skin-hotspot" data-key="freenerve" style="cursor:pointer;"/>
      </svg>
    </div>
    <div style="flex:1; min-width:220px;">
      <div style="font-weight:700; font-size:1.05rem; color:#1a472a; margin-bottom:0.4rem;" id="skinInfoTitle">Click a layer or receptor</div>
      <div style="font-size:0.9rem; color:#4b5563; min-height:4.5em;" id="skinInfoDesc">Click any epidermal stratum (band) or dermal receptor (dot) on the cross-section to see its name, depth, and function or stimulus detected.</div>
    </div>
  </div>
</div>

<script>
(function(){
  var info = {
    corneum: { name: 'Stratum Corneum', desc: 'Many layers of dead, flattened, fully keratinized corneocytes, continuously shed (desquamation) and replaced from below.' },
    lucidum: { name: 'Stratum Lucidum', desc: 'Thin, clear layer of dead, densely packed cells, present only in thick skin (palms, soles).' },
    granulosum: { name: 'Stratum Granulosum', desc: 'Cells flattening, accumulating keratohyalin granules (keratin precursor) and lamellar granules (secrete a lipid barrier); nuclei begin to degrade.' },
    spinosum: { name: 'Stratum Spinosum', desc: 'Several layers of polyhedral cells joined by desmosomes; contains Langerhans cells (antigen-presenting immune surveillance).' },
    basale: { name: 'Stratum Basale', desc: 'Single layer of mitotically active cuboidal/columnar cells on the basement membrane, the source of all epidermal renewal; also contains melanocytes and Merkel cells.' },
    papillary: { name: 'Papillary Dermis', desc: "Thin, loose connective tissue forming dermal papillae that interlock with the epidermis; rich in capillary loops and Meissner's corpuscles." },
    reticular: { name: 'Reticular Dermis', desc: 'Thicker, dense irregular connective tissue with interwoven collagen/elastin fibers; contains most glands, hair follicles, and deeper receptors.' },
    hypodermis: { name: 'Hypodermis', desc: 'Adipose-rich connective tissue anchoring the dermis to underlying fascia/muscle, thermal insulation, cushioning, energy storage.' },
    merkel: { name: 'Merkel Disc', desc: 'Location: stratum basale. Detects sustained light touch and texture.' },
    meissner: { name: "Meissner's Corpuscle", desc: 'Location: papillary dermis, dense in fingertips/lips. Detects light touch and low-frequency vibration.' },
    ruffini: { name: 'Ruffini Ending', desc: 'Location: deep dermis. Detects skin stretch and sustained pressure.' },
    pacinian: { name: 'Pacinian Corpuscle', desc: 'Location: deep dermis/hypodermis, concentric lamellae ("onion-like"). Detects deep pressure and high-frequency vibration.' },
    freenerve: { name: 'Free Nerve Ending', desc: 'Location: throughout epidermis and dermis. Detects pain and temperature.' }
  };
  var titleEl = document.getElementById('skinInfoTitle');
  var descEl = document.getElementById('skinInfoDesc');
  document.querySelectorAll('#skinSvg .skin-hotspot').forEach(function(el){
    el.addEventListener('click', function(){
      var entry = info[el.getAttribute('data-key')];
      titleEl.textContent = entry.name;
      descEl.textContent = entry.desc;
    });
  });
})();
</script>

### Hypodermis (Subcutaneous Layer)

Not part of the skin proper, but adipose-rich connective tissue anchoring the dermis to underlying fascia/muscle, providing thermal insulation, mechanical cushioning, and energy storage; thickness varies substantially by body region and is hormonally regulated (a physiology point, noted here for its direct structural consequence, regional variation in skin mobility and cushioning).

### Hair Structure and Growth Cycle

A hair follicle is an epidermal invagination into the dermis, structured around a **hair bulb** at its base, which encloses the **dermal papilla** (a connective-tissue projection carrying the blood supply that nourishes the actively dividing **hair matrix** cells surrounding it). Matrix cells proliferate and keratinize (the same keratinization process as the epidermis, but producing hard, compact hair keratin rather than the epidermis's softer keratin) to form the hair shaft, which grows outward through the follicle. Each follicle cycles through three phases: **anagen** (active growth, lasting years on the scalp), **catagen** (brief regression, the follicle base degenerates), and **telogen** (resting, the old hair is eventually shed as a new anagen phase begins beneath it). Follicles cycle asynchronously, which is why hair loss is normally continuous and unnoticeable rather than occurring in synchronized waves. A small band of smooth muscle, the **arrector pili**, attaches to each follicle at an angle; its contraction (sympathetically controlled) pulls the hair more upright and dimples the skin surface ("goosebumps"), in animals with a fuller coat this traps an insulating air layer, a thermoregulatory function largely vestigial in humans.

![Detailed hair follicle cross-section labeling the hard-keratin shaft (medulla, cortex, hair cuticle), the surrounding root sheaths and glassy membrane, the matrix and hair root at the follicle base, the connective tissue papilla, and the adjacent arrector pili muscle and sebaceous gland.](/ANATOMYPICS/hair-follicle-structure.png)

<div style="width:100%; background:#fefcf5; border-radius:24px; padding:1.2rem; margin:1.5rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:'Inter',system-ui,sans-serif;">
  <h3 style="margin:0 0 0.8rem 0; color:#1a472a;">💇 Hair Growth Cycle Stepper</h3>
  <div style="display:flex; gap:2rem; flex-wrap:wrap; align-items:flex-start;">
    <div style="flex:0 0 200px;">
      <svg id="hairSvg" viewBox="0 0 200 320" style="width:100%; max-width:200px; display:block; margin:0 auto;">
        <rect x="0" y="90" width="200" height="6" fill="#e0c48f"/>
        <line id="hairShaft" x1="100" y1="20" x2="100" y2="300" stroke="#4a3728" stroke-width="6" stroke-linecap="round"/>
        <line id="follicleWallL" x1="88" y1="93" x2="88" y2="300" stroke="#c9915a" stroke-width="2" fill="none"/>
        <line id="follicleWallR" x1="112" y1="93" x2="112" y2="300" stroke="#c9915a" stroke-width="2" fill="none"/>
        <circle id="hairBulb" cx="100" cy="300" r="22" fill="#8b5e34"/>
        <circle id="dermalPapilla" cx="100" cy="300" r="9" fill="#e8938a"/>
      </svg>
    </div>
    <div style="flex:1; min-width:220px;">
      <div style="font-weight:700; font-size:1.05rem; color:#1a472a; margin-bottom:0.4rem;" id="hairPhaseTitle">Anagen (active growth)</div>
      <div style="font-size:0.9rem; color:#4b5563; margin-bottom:1rem; min-height:4.5em;" id="hairPhaseDesc">The dermal papilla nourishes actively dividing matrix cells, which proliferate and keratinize to produce the hair shaft. This phase lasts years on the scalp.</div>
      <button id="hairStepBtn" style="padding:6px 16px; border:none; border-radius:30px; background:#2d6a4f; color:white; cursor:pointer; font-weight:500; font-size:0.85rem;">Step to next phase →</button>
      <div style="margin-top:1rem;">
        <button id="hairWhyBtn" style="padding:6px 14px; border:2px solid #b1650f; border-radius:20px; background:white; color:#b1650f; cursor:pointer; font-weight:500; font-size:0.8rem;">Why don't we go bald from normal shedding?</button>
        <div id="hairWhyAnswer" style="display:none; font-size:0.85rem; color:#4b5563; margin-top:0.6rem;">Because thousands of follicles cycle <strong>asynchronously</strong>, each on its own independent timer, at any moment some are in anagen while others are in catagen or telogen. Shedding is spread continuously across the whole scalp rather than happening in one synchronized wave, so hair loss is normally unnoticeable.</div>
      </div>
    </div>
  </div>
</div>

<script>
(function(){
  var phases = [
    { name: 'Anagen (active growth)', desc: 'The dermal papilla nourishes actively dividing matrix cells, which proliferate and keratinize to produce the hair shaft. This phase lasts years on the scalp.', shaftY1: 20, bulbCy: 300, bulbR: 22, papillaR: 9, papillaOpacity: 1, wallY2: 300 },
    { name: 'Catagen (brief regression)', desc: 'The follicle base degenerates: the matrix stops dividing and the bulb shrinks and pulls away from the dermal papilla. The existing shaft stops growing but is not shed yet.', shaftY1: 20, bulbCy: 220, bulbR: 14, papillaR: 9, papillaOpacity: 0.25, wallY2: 220 },
    { name: 'Telogen (resting)', desc: 'The follicle is fully regressed and resting, detached from the papilla. The old hair is eventually shed as a new anagen phase begins beneath it.', shaftY1: 40, bulbCy: 140, bulbR: 10, papillaR: 9, papillaOpacity: 0, wallY2: 140 }
  ];
  var idx = 0;
  var titleEl = document.getElementById('hairPhaseTitle');
  var descEl = document.getElementById('hairPhaseDesc');
  var stepBtn = document.getElementById('hairStepBtn');
  var shaft = document.getElementById('hairShaft');
  var bulb = document.getElementById('hairBulb');
  var papilla = document.getElementById('dermalPapilla');
  var wallL = document.getElementById('follicleWallL');
  var wallR = document.getElementById('follicleWallR');

  function render(){
    var p = phases[idx];
    titleEl.textContent = p.name;
    descEl.textContent = p.desc;
    shaft.setAttribute('y1', p.shaftY1);
    bulb.setAttribute('cy', p.bulbCy);
    bulb.setAttribute('r', p.bulbR);
    papilla.setAttribute('cy', p.bulbCy);
    papilla.setAttribute('r', p.papillaR);
    papilla.setAttribute('opacity', p.papillaOpacity);
    wallL.setAttribute('y2', p.wallY2);
    wallR.setAttribute('y2', p.wallY2);
  }

  stepBtn.addEventListener('click', function(){
    idx = (idx + 1) % phases.length;
    render();
  });

  document.getElementById('hairWhyBtn').addEventListener('click', function(){
    var ans = document.getElementById('hairWhyAnswer');
    ans.style.display = ans.style.display === 'none' ? 'block' : 'none';
  });

  render();
})();
</script>

### Nail Structure

The **nail plate** (a flattened sheet of hard keratin, structurally continuous with hair keratin production logic) sits on the **nail bed**, growing from the **nail matrix** (a proliferative region beneath the proximal nail fold, visible externally as the pale crescent-shaped **lunula**), with the **eponychium (cuticle)** sealing the proximal edge against infection and the **hyponychium** sealing the distal free edge.

![Labeled nail structure from two views: surface view showing the free edge, lateral nail folds, lunula, cuticle, and eponychium (proximal nail fold), and a longitudinal section showing the germinal matrix, nail bed, and nail fold.](/ANATOMYPICS/nail-structure-cross-section.jpg)
*Source: Wikimedia Commons-style figure. Exact match, covers every landmark named in the text (matrix, bed, lunula, eponychium, hyponychium) plus additional surface-anatomy labels.*
s
### Glands

- **Sebaceous glands**: associated with hair follicles (opening into the follicle rather than directly onto the skin surface in most locations), holocrine secretion (the entire cell disintegrates to release its contents) producing **sebum**, an oily/waxy mixture that lubricates hair and skin and contributes to the skin's antimicrobial barrier.
- **Eccrine sweat glands**: simple coiled tubular glands, found over nearly the entire body surface, ducts opening directly onto the skin surface; the primary thermoregulatory sweat glands, secreting a dilute, largely aqueous fluid.
- **Apocrine sweat glands**: restricted to the axillary and anogenital regions, ducts opening into hair follicles rather than directly onto the surface, become active at puberty, secrete a more viscous, protein-rich fluid that is odorless until metabolized by skin surface bacteria.

### Thermoregulatory Structure

Two independent structural mechanisms, both under autonomic (sympathetic) control, work in the skin to regulate core body temperature: **eccrine sweat evaporation** (evaporative heat loss, sweat's latent heat of vaporization is drawn from the skin surface, cooling the body) and **dermal blood vessel caliber** (vasodilation of the dermal vascular plexus increases blood flow near the skin surface, promoting radiative/convective heat loss; vasoconstriction reduces it, conserving core heat). Both mechanisms depend directly on the dermal structures described above (the dense dermal capillary network and the eccrine gland distribution), making thermoregulation a direct structure-function extension of this page's anatomy, even though the autonomic control itself is physiology.

## Comparative Structures

The epidermis-over-dermis plan and keratinization process described here are shared, in substantially modified form, with the keratinized structures of other vertebrates, reptile scales, bird feathers, and mammalian fur are all epidermal keratin derivatives, directly compared on the [Reptile & Bird Anatomy](../reptile-bird-anatomy/) and [Mammalian Comparative Anatomy](../mammalian-comparative-anatomy/) pages. Fish scales, by contrast, are dermal (bony) rather than epidermal; see [Fish & Amphibian Anatomy](../fish-amphibian-anatomy/) for this structural distinction.

## Common Exam Questions

- "Trace a keratinocyte from the stratum basale to the point of desquamation, describing the structural changes it undergoes at each stratum."
- "Distinguish Meissner's corpuscles from Pacinian corpuscles by both location and the specific stimulus each detects."
- "Explain the source of the dermal papillae and their functional/structural contribution to the epidermal-dermal junction."
- "A patient's sympathetic nervous system is pharmacologically blocked. Predict the effect on both sweat production and dermal blood vessel diameter, and explain the consequence for thermoregulation."
- "Explain why melanocyte number is roughly constant across individuals with different skin tones, identifying what structural factor actually differs."

## Visual Reference

**Interactive**

*(Implemented inline above: the skin cross-section hotspot diagram sits directly below the cutaneous receptors image, and the hair growth cycle stepper sits directly below the hair follicle structure image.)*

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. List the five epidermal strata from deepest to most superficial and identify which layer(s) contain living, mitotically active cells.
2. Name the epidermal cell type responsible for immune surveillance and state its layer of residence.
3. A deep, high-frequency vibration is applied to the skin. Which receptor type is primarily responsible for detecting it, and at what depth is it located?
4. Explain why hair loss is normally a continuous, unnoticeable process rather than occurring in a single synchronized event, referencing the hair growth cycle.
5. Distinguish eccrine from apocrine sweat glands by duct location, distribution, developmental timing, and secretion composition.
