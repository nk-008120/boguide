---
title: "Plant Hormones"
weight: 7
description: "The five classical plant hormones (auxin, gibberellin, cytokinin, abscisic acid, ethylene) plus brassinosteroids, their sites of synthesis, core mechanisms, and the classic experiments (Darwin/Went coleoptile bending, the triple response) that established each one's role, the shared regulatory vocabulary the rest of this tier assumes."
difficulty: "intermediate"
prerequisites: []
syllabus_tags: ["IBO", "USABO", "foundations"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

Where the earlier pages in this section covered transport and biochemistry, this page and the three that follow it cover **growth regulation**: how a plant coordinates development, movement, and timing using a small number of mobile chemical signals. Plant hormones differ from animal hormones covered on [Endocrine System Physiology](../../3-animal-physiology/endocrine-system-physiology/) in a key structural way: most are not produced by dedicated glands but by ordinary tissue at the site where they're needed, and most act locally as much as systemically. This page introduces all six major hormone classes together, since their effects are heavily interdependent (ratios between hormones, not any single hormone's absolute level, often determine the outcome); [Tropisms & Nastic Movements](../tropisms-nastic-movements/), [Photoperiodism, Vernalization & Flowering](../photoperiodism-vernalization-flowering/), and [Seed Germination & Dormancy Physiology](../seed-germination-dormancy-physiology/) each build on the specific hormone mechanisms established here.

## Key Concepts

### Auxin (IAA)

Synthesized primarily in shoot apical meristems and young leaves, then transported **polarly** (unidirectionally, cell to cell, via asymmetrically localized **PIN transporter proteins** that export auxin only from one end of each cell) predominantly from shoot tip toward the root, a directional, energy-dependent transport mechanism unlike the passive diffusion of most other hormones. Auxin promotes cell elongation (by loosening the cell wall, permitting turgor-driven expansion), maintains **apical dominance** (auxin from the shoot apex suppresses outgrowth of lateral/axillary buds below it; removing the apex releases this suppression, the physiological basis of pruning to promote bushier growth), and promotes lateral root initiation from the pericycle (see [Root Anatomy](../../6-plant-anatomy/root-anatomy/)).

![Apical dominance mechanism, historical and current models: (A) the 1930s model (auxin directly inhibiting bud auxin synthesis; auxin diverting root/cotyledon growth factors away from buds; auxin indirectly inhibiting buds via stem growth), compared to (B, C) the 2010s auxin-transport-canalization and second-messenger (strigolactone/cytokinin) models](/PLANTPHYSIOPICS/apical-dominance.png)
*Source: Frontiers in Plant Science*

The classic **Darwin/Went coleoptile experiments** (a grass seedling's coleoptile bends toward light only if its tip is intact and light-exposed; a severed tip's diffusible substance, collected in agar and reapplied off-center, causes bending even in the dark) first demonstrated that a mobile chemical signal, not a direct tissue response, causes phototropic bending, established before auxin was chemically identified, and the model this page's classic-experiment framing follows throughout.

![The classic phototropism experimental series: an intact, light-exposed coleoptile bends toward light; removing the tip abolishes bending; covering the tip with an opaque cap abolishes bending; covering the tip with a transparent cap preserves bending; shielding only the base leaves bending intact, together localizing both light perception and the response-initiating signal to the tip](/PLANTPHYSIOPICS/coleoptile-bending-experiment.png)
*Source: Pathwayz.org*

### Gibberellins (GA)

A family of related compounds synthesized in young leaves, developing seeds, and shoot tips, best known for promoting **stem elongation** (the "genetically dwarf" phenotype in many classic study species, e.g. dwarf pea, is caused by a GA-biosynthesis or GA-signaling mutation, and is rescued by exogenous GA application, a direct causal demonstration, not merely a correlation), **seed germination** (developed further on [Seed Germination & Dormancy Physiology](../seed-germination-dormancy-physiology/), where GA induces the α-amylase enzyme mobilizing stored starch), and **bolting/flowering** in some species (rapid stem elongation preceding flowering).

### Cytokinins

Synthesized predominantly in root tips and transported upward (opposite auxin's predominant direction), cytokinins promote **cell division** (rather than elongation) and, critically, act antagonistically with auxin to control lateral bud outgrowth and root-vs-shoot balance in tissue culture: a high auxin:cytokinin ratio promotes root formation, a low ratio promotes shoot formation, and intermediate ratios promote undifferentiated callus growth, a specific ratio-dependent (not single-hormone-dependent) outcome that is a frequently tested example of hormone interaction rather than isolated hormone action. Cytokinins also delay leaf senescence, detectable experimentally as a "green island" of retained chlorophyll around a site of localized cytokinin application on an otherwise yellowing leaf.

### Abscisic Acid (ABA)

Synthesized in response to water stress (roots and leaves) and during seed maturation, ABA is often called the "stress hormone": it triggers **stomatal closure** (the specific guard cell signaling mechanism covered in full on [Stomatal Physiology & Gas Exchange](../stomatal-physiology-gas-exchange/)), maintains **seed dormancy** by antagonizing GA (developed on [Seed Germination & Dormancy Physiology](../seed-germination-dormancy-physiology/)), and promotes bud dormancy heading into unfavorable seasons. ABA and GA act as a recurring antagonistic pair across several of these processes, the ratio between them, not either hormone in isolation, determines whether a seed remains dormant or germinates.

### Ethylene

Unlike the other five hormones, ethylene is a **gas** and diffuses freely through air spaces rather than requiring vascular or cell-to-cell transport, which is why it can coordinate ripening or senescence across an entire fruit or even between adjacent fruits (the basis of the practical observation that one ripening fruit accelerates ripening in nearby fruit, and of commercial ripening chambers). Ethylene promotes **fruit ripening** (activating enzymes that break down cell wall pectin, convert starches to sugars, and degrade chlorophyll), leaf and flower **abscission** (senescence-triggered detachment via enzymatic breakdown of a specialized **abscission zone** layer at the base of the petiole or pedicel), and the seedling **triple response**, a classic diagnostic assay in which a dark-grown seedling exposed to ethylene shows three simultaneous morphological changes (radial swelling/thickening of the stem, a reduction in stem elongation rate, and exaggerated curvature of the apical hook) that together represent a specific "obstacle encountered" developmental program, historically used to identify ethylene-signaling mutants (before molecular tools existed) by screening dark-grown seedlings for those failing to show all three components of the response even when ethylene is supplied.

![The triple response in dark-grown seedlings: gram and pea seedlings treated with ethylene (left of each pair) show exaggerated curvature of the plumular hook, inhibition of hypocotyl/root elongation, and radial swelling of the root/hypocotyl, compared to untreated controls](/PLANTPHYSIOPICS/ethylene-triple-response.png)
*Source: Springer (book chapter, doi 978-981-13-2023-1_19)*

### Brassinosteroids

Structurally steroid-like (unlike the other five hormones), synthesized broadly across tissues, and acting largely locally rather than being transported long distances. Brassinosteroids promote cell elongation and division in a way that overlaps functionally with auxin and gibberellin (a mutant deficient in brassinosteroid synthesis shows a dwarf phenotype reminiscent of a GA-deficient mutant, but is not rescued by GA application, the specific genetic test distinguishing the two dwarfing causes) and also contribute to vascular tissue differentiation and stress tolerance.

![Six-hormone summary table: chemical nature, primary sites of biosynthesis, transport mode, and effects for auxins, cytokinins, ethylene, abscisic acid, gibberellins, and brassinosteroids, side by side](/PLANTPHYSIOPICS/plant-hormones-summary.png)
*Source: public source*

## Comparative Structures

| Hormone | Primary synthesis site | Core promoted effect | Classic diagnostic experiment/phenotype |
|---|---|---|---|
| Auxin | Shoot apex, young leaves | Cell elongation, apical dominance | Darwin/Went coleoptile bending |
| Gibberellin | Young leaves, seeds, shoot tips | Stem elongation, germination | Dwarf mutant rescued by exogenous GA |
| Cytokinin | Root tips | Cell division, delays senescence | Auxin:cytokinin ratio controls root vs. shoot in culture |
| Abscisic acid | Roots/leaves under stress, seeds | Stomatal closure, dormancy | Antagonizes GA in seed dormancy |
| Ethylene | Ripening fruit, senescing tissue | Ripening, abscission | Triple response in dark-grown seedlings |
| Brassinosteroid | Broadly, local action | Elongation/division (auxin/GA-like) | Dwarf phenotype not rescued by GA |

## Common Exam Questions

- "Explain what the Darwin/Went coleoptile experiments demonstrated, and why a diffusible substance rather than direct light detection at the base was the necessary conclusion."
- "Explain apical dominance in terms of auxin transport direction, and predict the effect of removing the shoot apex."
- "Explain why the auxin:cytokinin ratio, not either hormone alone, determines root versus shoot development in tissue culture."
- "Describe the triple response and explain why all three components together, rather than any one alone, are used to identify ethylene-signaling mutants."
- "Explain why ethylene's gaseous nature allows it to affect fruit that are not physically connected to the source, unlike the other five hormones covered here."
- "Distinguish a GA-deficient dwarf mutant from a brassinosteroid-deficient dwarf mutant using a single genetic test."

## Visual Reference

**Interactive**

- **Coleoptile bending simulator (click-through SVG/JS, no new library)**, reproduces the Darwin/Went experimental series (intact tip + light, tip removed, tip covered, severed tip on agar reapplied off-center) as selectable conditions, each showing the resulting bending or lack thereof, letting the user reconstruct the logical case for a diffusible signal step by step.

<div id="coleoptile-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 200 200" width="180" height="180" style="display:block; margin:0 auto;">
    <text id="coLightIcon" x="170" y="30" font-size="20" text-anchor="middle">&#9728;&#65039;</text>
    <rect x="0" y="160" width="200" height="20" fill="#c9a877"/>
    <path id="coStem" d="M100 160 L100 60" stroke="#2d6a4f" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path id="coTip" d="M100 60 L100 45" stroke="#1a472a" stroke-width="10" fill="none" stroke-linecap="round"/>
    <rect id="coCap" x="90" y="35" width="20" height="14" rx="4" fill="#334155" opacity="0"/>
    <rect id="coBaseShield" x="85" y="150" width="30" height="20" fill="#334155" opacity="0"/>
    <rect id="coAgarBlock" x="60" y="55" width="16" height="10" fill="#fde68a" stroke="#92400e" opacity="0"/>
  </svg>
  <div style="text-align:center;">
    <select id="coCondition" style="padding:6px 10px; border-radius:8px; border:1px solid #94a3b8; font-size:0.85rem;">
      <option value="control">Control: intact tip, light from one side</option>
      <option value="removed">Tip removed</option>
      <option value="opaque">Tip covered by opaque cap</option>
      <option value="transparent">Tip covered by transparent cap</option>
      <option value="baseshield">Base covered by opaque shield</option>
      <option value="agar">Severed tip on agar, reapplied off-center (dark)</option>
    </select>
    <div id="coNote" style="margin-top:10px; font-size:0.85rem; color:#4b5563; min-height:2.4em;">The intact, light-exposed tip bends toward the light: auxin is redistributed to the shaded side and promotes elongation there.</div>
  </div>
</div>
<script>
(function(){
  var select = document.getElementById('coCondition');
  var stem = document.getElementById('coStem');
  var tip = document.getElementById('coTip');
  var cap = document.getElementById('coCap');
  var baseShield = document.getElementById('coBaseShield');
  var agarBlock = document.getElementById('coAgarBlock');
  var lightIcon = document.getElementById('coLightIcon');
  var note = document.getElementById('coNote');
  var conditions = {
    control: {bend:true, cap:false, base:false, agar:false, light:true, text:'The intact, light-exposed tip bends toward the light: auxin is redistributed to the shaded side and promotes elongation there.'},
    removed: {bend:false, cap:false, base:false, agar:false, light:true, text:'With the tip removed, no bending occurs. The light-sensing, auxin-redistributing tissue is gone.'},
    opaque: {bend:false, cap:true, base:false, agar:false, light:true, text:'An opaque cap blocks light from reaching the tip, so no bending occurs, proving the tip itself must detect the light.'},
    transparent: {bend:true, cap:true, base:false, agar:false, light:true, text:'A transparent cap still lets light through to the tip, and bending occurs normally, the cap material, not covering the tip per se, is what matters.'},
    baseshield: {bend:true, cap:false, base:true, agar:false, light:true, text:'Shielding only the base (not the tip) from light does not prevent bending, the tip is the site of perception, not the base.'},
    agar: {bend:true, cap:false, base:false, agar:true, light:false, text:'In the dark, a severed tip\'s diffusible substance (collected in agar and reapplied off-center to a decapitated coleoptile) causes bending even with no light and no tip present. This is the direct evidence for a mobile chemical signal.'}
  };
  function render(){
    var c = conditions[select.value];
    stem.setAttribute('d', c.bend ? 'M100 160 Q80 110 95 65' : 'M100 160 L100 60');
    tip.setAttribute('d', c.bend ? 'M95 65 Q92 55 85 47' : 'M100 60 L100 45');
    cap.setAttribute('opacity', c.cap ? 1 : 0);
    baseShield.setAttribute('opacity', c.base ? 1 : 0);
    agarBlock.setAttribute('opacity', c.agar ? 1 : 0);
    lightIcon.setAttribute('opacity', c.light ? 1 : 0.15);
    note.textContent = c.text;
  }
  select.addEventListener('change', render);
  render();
})();
</script>

- **Auxin:cytokinin ratio tissue-culture predictor (slider)**, a slider sets the relative auxin:cytokinin ratio; the diagram updates between root-dominant, shoot-dominant, and undifferentiated callus outcomes, visualizing the ratio-dependence directly rather than as a memorized table.

<div id="ratio-widget" style="background:#fefcf5; border-radius:16px; padding:1.5rem; margin:1rem 0; font-family:'Inter','Segoe UI',Arial,sans-serif; box-shadow:0 4px 14px rgba(0,0,0,0.06);">
  <svg viewBox="0 0 220 160" width="200" height="150" style="display:block; margin:0 auto;">
    <ellipse cx="110" cy="90" rx="45" ry="30" fill="#e2c08d" stroke="#92400e" stroke-width="2"/>
    <text x="110" y="94" text-anchor="middle" font-size="10" fill="#92400e">callus</text>
    <g id="ratioShoots" opacity="0">
      <path d="M100 65 Q95 40 90 25" stroke="#2d6a4f" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M110 65 Q110 35 110 20" stroke="#2d6a4f" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M120 65 Q125 40 130 25" stroke="#2d6a4f" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
    <g id="ratioRoots" opacity="0">
      <path d="M100 115 Q95 140 90 155" stroke="#7c5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M110 115 Q110 145 110 158" stroke="#7c5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M120 115 Q125 140 130 155" stroke="#7c5a3a" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>
  </svg>
  <label style="font-size:0.85rem; font-weight:600; color:#334155; display:block; text-align:center;">Auxin:Cytokinin ratio</label>
  <input type="range" id="ratioSlider" min="0" max="100" value="50" style="width:100%; max-width:300px; display:block; margin:0 auto;">
  <div style="text-align:center; font-size:0.8rem; color:#4b5563;">
    <span>low (high cytokinin)</span> &nbsp;&mdash;&nbsp; <span>high (high auxin)</span>
  </div>
  <div id="ratioNote" style="text-align:center; margin-top:10px; font-size:0.85rem; color:#4b5563;">Equal auxin and cytokinin, undifferentiated callus growth, no roots or shoots yet.</div>
</div>
<script>
(function(){
  var slider = document.getElementById('ratioSlider');
  var shoots = document.getElementById('ratioShoots');
  var roots = document.getElementById('ratioRoots');
  var note = document.getElementById('ratioNote');
  function update(){
    var v = parseInt(slider.value,10);
    if (v < 35){
      shoots.style.opacity = 1;
      roots.style.opacity = 0;
      note.textContent = 'Low auxin:cytokinin ratio (cytokinin-dominant), shoot formation is favored.';
    } else if (v > 65){
      shoots.style.opacity = 0;
      roots.style.opacity = 1;
      note.textContent = 'High auxin:cytokinin ratio (auxin-dominant): root formation is favored.';
    } else {
      shoots.style.opacity = 0;
      roots.style.opacity = 0;
      note.textContent = 'Roughly equal auxin and cytokinin, undifferentiated callus growth, no roots or shoots yet.';
    }
  }
  slider.addEventListener('input', update);
  update();
})();
</script>

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here. The dwarf-pea GA-rescue comparison was dropped, no image sourced.)*

## Practice Problems

1. A researcher removes the shoot apex of a plant and observes multiple lateral buds beginning to grow within days. Explain this observation in terms of auxin transport and apical dominance.
2. A dwarf pea mutant is treated with exogenous gibberellin and grows to normal height. A second dwarf mutant treated the same way remains dwarf. Propose a hypothesis distinguishing the two mutants.
3. Plant tissue is cultured with a high cytokinin:auxin ratio. Predict the developmental outcome and explain the mechanism.
4. A single ripe apple is placed in a sealed container with several unripe apples, which then ripen faster than a control batch stored openly. Identify the hormone responsible and explain why its physical properties make this possible.
5. A dark-grown seedling is exposed to ethylene and develops a thickened stem, reduced elongation, and an exaggerated apical hook. Explain why all three of these responses, rather than just one, are used to confirm ethylene signaling is intact.
