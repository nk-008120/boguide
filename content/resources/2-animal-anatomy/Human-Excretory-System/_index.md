---
title: "Human Excretory System"
weight: 10
description: "Kidney gross anatomy, detailed nephron structure (renal corpuscle, tubule regions, juxtaglomerular apparatus), the two nephron populations, renal blood supply, and lower urinary tract histology — split from the combined Digestive/Excretory/Reproductive page for full IBO depth."
difficulty: "intermediate"
prerequisites: ["Body-Plans", "Human-Circulatory-System"]
syllabus_tags: ["IBO", "USABO", "human-anatomy"]
---
{{< topic-meta >}}
{{< mathjax >}}

## Overview

The kidney's structure is inseparable from its function as a high-pressure filter followed by a long, regionally specialized reabsorption/secretion tube. Nearly every anatomical feature covered on this page exists because it serves that specific two-stage logic.

## Key Concepts

### Kidney Gross Anatomy

Each kidney is enclosed by a thin fibrous **renal capsule**, structurally divided into an outer **cortex** and inner **medulla**; the medulla is organized into 8–18 cone-shaped **renal pyramids** (separated by cortical extensions, the **renal columns**), each pyramid's apex (**renal papilla**) draining urine into a cup-shaped **minor calyx**; minor calices converge into **major calices**, which converge into the funnel-shaped **renal pelvis**, continuous with the **ureter** exiting at the **hilum** (the same structural entry/exit point for the renal artery and renal vein, a standard labeled-cross-section exam feature).

![Kidney gross anatomy in coronal section: fibrous capsule, renal cortex, renal medulla, renal pyramids, renal columns, renal papilla, minor and major calyces, renal pelvis, hilum, renal artery/vein, and ureter, with a whole-body inset showing kidney position.](/ANATOMYPICS/kidney-gross-anatomy-cortex-medulla-pyramids.png)
*Source: Wikipedia, "Kidney"*

### The Nephron: Renal Corpuscle

The nephron (~1 million per kidney) is the functional unit, with two main structural parts. The **renal corpuscle** comprises the **glomerulus** (a capillary tuft fed by an **afferent arteriole** and drained by an **efferent arteriole**, both arterioles, not an arteriole-then-venule, meaning the glomerulus is unusually positioned between two resistance vessels, keeping capillary pressure high enough to force filtration) surrounded by **Bowman's (glomerular) capsule**. The capsule's inner (visceral) layer is made of specialized cells, **podocytes**, wrapping the glomerular capillaries with foot-like processes (**pedicels**) that interdigitate, leaving narrow **filtration slits** between them; together with the fenestrated (pored) glomerular capillary endothelium and a shared basement membrane, this three-layer structure forms the **filtration membrane**: permeable to water and small solutes, but structurally excluding blood cells and most plasma proteins by size and the basement membrane's negative charge (which repels similarly negatively charged proteins like albumin). Fluid crossing this membrane (the **filtrate**) collects in Bowman's capsule space and enters the renal tubule.

![Renal corpuscle detail: glomerular capillaries wrapped by podocytes with pedicels, Bowman's capsule (parietal and visceral layers), Bowman's space, the basement membrane, mesangial cells (intra- and extraglomerular), afferent/efferent arterioles, myocytes, the proximal tubule brush border, and the juxtaglomerular apparatus (macula densa and granular cells) at the vascular pole.](/ANATOMYPICS/renal-corpuscle-glomerulus-podocytes.png)
*Source: Wikipedia, "Podocyte"*

### The Nephron: Renal Tubule

The filtrate then passes through a sequence of structurally and functionally distinct tubule regions:

```mermaid
graph LR;
    BC["Bowman's Capsule"] --> PCT["Proximal Convoluted Tubule (PCT)"];
    PCT --> DL["Loop of Henle:<br/>Descending thin limb"];
    DL --> AL["Loop of Henle:<br/>Ascending thin + thick limb"];
    AL --> DCT["Distal Convoluted Tubule (DCT)"];
    DCT --> CD["Collecting Duct"];
```

- **Proximal convoluted tubule (PCT)**: cuboidal epithelium with a prominent **brush border** (dense microvilli, maximizing surface area) and high mitochondrial density (supporting active transport); reabsorbs the bulk (~65%) of filtered water, ions, and essentially all filtered glucose and amino acids. Its structural profile (brush border + mitochondria) is a direct histological signature of a high-throughput active-reabsorption region, directly comparable in logic to small intestinal absorptive epithelium (see [Human Digestive System](../human-digestive-system/)).
- **Loop of Henle**: a hairpin turn descending from cortex into medulla and back; the **descending thin limb** is highly permeable to water but not solutes, while the **ascending limb** (thin, then thick segment) is permeable to solutes (actively transporting Na⁺/K⁺/Cl⁻ out) but impermeable to water. This asymmetric permeability pattern is the structural basis of the kidney's **countercurrent multiplier** mechanism, which establishes a progressively concentrated interstitial gradient deep in the medulla, necessary for producing concentrated urine.
- **Distal convoluted tubule (DCT)** — shorter, fewer microvilli than the PCT; site of regulated (hormonally controlled) reabsorption, fine-tuning final urine composition.
- **Collecting duct**: receives filtrate from many nephrons; its water permeability is variable, regulated by antidiuretic hormone (ADH) acting on **aquaporin** channels, the specific structural target of the kidney's main water-balance control point.

![A full labeled nephron: glomerulus and glomerular capsule fed by the afferent/efferent arteriole, proximal convoluted tubule, descending/ascending limbs of the loop of Henle with the surrounding capillary network, distal convoluted tubule, and collecting duct draining to the ureter, with the cortex/medulla boundary shown.](/ANATOMYPICS/nephron-labeled-tubule-regions-blood-supply.jpg)
*Source: user-sourced (originally via pharmacy180.com). Exact match for all tubule regions and the peritubular blood supply.*

<div style="width:100%; background:#fefcf5; border-radius:24px; padding:1.2rem; margin:1.5rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:'Inter',system-ui,sans-serif;">
  <h3 style="margin:0 0 0.8rem 0; color:#1a472a;">🔍 Nephron Filtration/Reabsorption Explorer</h3>
  <p style="font-size:0.85rem; color:#6b7280; margin:0 0 1rem 0;">Hover (or click) each tubule segment to see exactly what's reabsorbed or secreted there.</p>
  <div id="nephronSegments" style="display:flex; gap:0.3rem; flex-wrap:wrap;"></div>
  <div style="margin-top:1rem; background:#f8fafc; border-radius:14px; padding:0.9rem 1.1rem;">
    <div style="font-weight:700; color:#1a472a; margin-bottom:0.3rem;" id="nephronTitle">Hover a segment above</div>
    <div style="font-size:0.88rem; color:#4b5563; min-height:3.6em;" id="nephronDesc">Move your cursor over PCT, the loop of Henle limbs, DCT, or the collecting duct to see what happens at each stop.</div>
  </div>
</div>

<script>
(function(){
  var segments = [
    { key: 'pct', name: 'PCT', color: '#2d6a4f', desc: 'Reabsorbs ~65% of filtered water and ions, and essentially all filtered glucose and amino acids. Brush border + high mitochondrial density signal high-throughput active reabsorption.' },
    { key: 'desc', name: 'Descending Limb', color: '#1f5c99', desc: 'Highly permeable to water (reabsorbed into the hypertonic medullary interstitium) but not solutes. Filtrate becomes progressively more concentrated as it descends.' },
    { key: 'asc', name: 'Ascending Limb', color: '#7a3f96', desc: 'Impermeable to water; actively transports Na⁺/K⁺/Cl⁻ out into the interstitium. Filtrate becomes progressively more dilute as it ascends. This asymmetric permeability is the structural basis of the countercurrent multiplier.' },
    { key: 'dct', name: 'DCT', color: '#b1650f', desc: 'Shorter, fewer microvilli than the PCT. Site of regulated, hormonally controlled reabsorption — fine-tunes final urine composition.' },
    { key: 'cd', name: 'Collecting Duct', color: '#c0392b', desc: "Receives filtrate from many nephrons. Water permeability is variably regulated by ADH acting on aquaporin channels — the kidney's main water-balance control point." }
  ];
  var container = document.getElementById('nephronSegments');
  var titleEl = document.getElementById('nephronTitle');
  var descEl = document.getElementById('nephronDesc');

  segments.forEach(function(seg){
    var el = document.createElement('div');
    el.textContent = seg.name;
    el.style.cssText = 'flex:1; min-width:110px; text-align:center; padding:14px 8px; border-radius:12px; background:' + seg.color + '; color:white; font-weight:600; font-size:0.82rem; cursor:pointer; opacity:0.85; transition:opacity 0.15s, transform 0.15s;';
    function show(){
      titleEl.textContent = seg.name;
      descEl.textContent = seg.desc;
      el.style.opacity = '1';
      el.style.transform = 'scale(1.04)';
    }
    function hide(){
      el.style.opacity = '0.85';
      el.style.transform = 'scale(1)';
    }
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('click', show);
    container.appendChild(el);
  });
})();
</script>

### Two Nephron Populations

Not all nephrons are structurally identical: **cortical nephrons** (~85%, glomerulus in the outer cortex, short loops of Henle barely entering the medulla) handle the bulk of filtration volume, while **juxtamedullary nephrons** (~15%, glomerulus near the cortex-medulla border, very long loops of Henle penetrating deep into the medulla, paralleled by specialized capillaries, the **vasa recta**) are structurally responsible for establishing the deep medullary concentration gradient that makes concentrated urine possible at all — a direct minority-population, disproportionate-function structural point worth stating explicitly.

![Cortical nephron (short loop of Henle) vs. juxtamedullary nephron (long loop reaching deep into the medulla, near the papilla) compared, alongside a PO2 gradient bar showing oxygen tension falling from 70 mmHg in the cortex to 10 mmHg near the papilla.](/ANATOMYPICS/cortical-vs-juxtamedullary-nephron-comparison.webp)
*Source: The Ohio State University, user-sourced originally via a ResearchGate figure.*

<div style="width:100%; background:#fefcf5; border-radius:24px; padding:1.2rem; margin:1.5rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:'Inter',system-ui,sans-serif;">
  <h3 style="margin:0 0 0.8rem 0; color:#1a472a;">🧂 Countercurrent Multiplier Gradient Chart</h3>
  <div id="countercurrentPlot" style="width:100%; height:380px;"></div>
  <input type="range" id="countercurrentSlider" min="0" max="100" step="1" value="0" style="width:100%; accent-color:#2d6a4f; margin-top:0.5rem;">
  <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#6b7280; margin-bottom:0.8rem;">
    <span>0% (cortex / corticomedullary junction)</span><span>100% (papilla)</span>
  </div>
  <div style="display:flex; gap:1.5rem; flex-wrap:wrap; font-size:0.85rem; color:#374151;">
    <div>Interstitial osmolarity: <strong id="ccInterstitialOut">300 mOsm/L</strong></div>
    <div>Descending-limb fluid: <strong id="ccDescOut">300 mOsm/L</strong></div>
    <div>Ascending-limb fluid: <strong id="ccAscOut">100 mOsm/L</strong></div>
  </div>
</div>

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>
<script>
(function() {
  function initChart() {
    if (typeof Plotly === 'undefined') { setTimeout(initChart, 100); return; }

    function interp(keys, t) {
      for (var i = 0; i < keys.length - 1; i++) {
        var a = keys[i], b = keys[i + 1];
        if (t >= a[0] && t <= b[0]) {
          var f = (t - a[0]) / (b[0] - a[0]);
          return a[1] + (b[1] - a[1]) * f;
        }
      }
      return keys[keys.length - 1][1];
    }

    var interstitialKeys = [[0,300],[25,500],[50,700],[75,950],[100,1200]];
    var descKeys = [[0,300],[25,500],[50,700],[75,950],[100,1200]];
    var ascKeys = [[0,100],[25,300],[50,550],[75,900],[100,1200]];

    var xs = [];
    for (var i = 0; i <= 100; i++) xs.push(i);
    var interstitialY = xs.map(function(t){ return interp(interstitialKeys, t); });
    var descY = xs.map(function(t){ return interp(descKeys, t); });
    var ascY = xs.map(function(t){ return interp(ascKeys, t); });

    var slider = document.getElementById('countercurrentSlider');
    var interstitialOut = document.getElementById('ccInterstitialOut');
    var descOut = document.getElementById('ccDescOut');
    var ascOut = document.getElementById('ccAscOut');

    function render() {
      var t = parseFloat(slider.value);

      var traceInterstitial = { x: xs, y: interstitialY, mode: 'lines', name: 'Interstitial fluid', line: { color: '#9ca3af', width: 3, dash: 'dash' } };
      var traceDesc = { x: xs, y: descY, mode: 'lines', name: 'Descending limb fluid', line: { color: '#1f5c99', width: 3 } };
      var traceAsc = { x: xs, y: ascY, mode: 'lines', name: 'Ascending limb fluid', line: { color: '#7a3f96', width: 3 } };

      var layout = {
        xaxis: { range: [0, 100], title: 'Depth into medulla (% from cortex to papilla)' },
        yaxis: { range: [0, 1300], title: 'Osmolarity (mOsm/L)' },
        legend: { orientation: 'h', y: -0.25 },
        margin: { t: 20, l: 60, r: 20, b: 40 },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff',
        shapes: [
          { type: 'line', xref: 'x', yref: 'paper', x0: t, x1: t, y0: 0, y1: 1, line: { color: '#1a472a', width: 2, dash: 'dot' } }
        ]
      };

      Plotly.react('countercurrentPlot', [traceInterstitial, traceDesc, traceAsc], layout, { responsive: true, displayModeBar: false });

      interstitialOut.textContent = Math.round(interp(interstitialKeys, t)) + ' mOsm/L';
      descOut.textContent = Math.round(interp(descKeys, t)) + ' mOsm/L';
      ascOut.textContent = Math.round(interp(ascKeys, t)) + ' mOsm/L';
    }

    slider.addEventListener('input', render);
    render();
    window.addEventListener('resize', function(){ Plotly.relayout('countercurrentPlot', { autosize: true }); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChart);
  } else {
    initChart();
  }
})();
</script>

### Juxtaglomerular Apparatus

At the point where the ascending thick limb of the loop of Henle passes back between its own nephron's afferent and efferent arterioles, two structurally specialized cell populations meet: the **macula densa** (modified tubule epithelial cells, monitoring fluid Na⁺/Cl⁻ concentration as it passes) and **juxtaglomerular (granular) cells** (modified smooth muscle cells in the afferent arteriole wall, secreting renin in response to macula densa signaling or reduced arteriole stretch). This structure (the **juxtaglomerular apparatus**) is the kidney's built-in blood-pressure/filtration-rate sensor and the anatomical starting point of the renin-angiotensin-aldosterone hormonal axis, a direct structural link between kidney anatomy and systemic blood pressure regulation.

![Cross-section of a nephron and juxtaglomerular apparatus at the vascular pole: macula densa, angiotensin-II-producing granular cells, afferent/efferent arterioles, extraglomerular mesangial cells, parietal epithelium, podocyte foot processes, mesangial cells, basement membrane, Bowman's space, and the proximal tubule.](/ANATOMYPICS/juxtaglomerular-apparatus-macula-densa.jpg)
*Source: Kris W, Sakai T et al., "Morphological aspects of glomerular function," Proceedings of the 10th International Congress of Nephrology, Vol 1, Baillière Tindall, 1988; user-sourced via a ScienceDirect topic page.*

### Renal Blood Supply

Blood flow through the kidney passes through **two** capillary beds in series, a structurally unusual arrangement (most organs have only one) that directly enables the filtration-then-reabsorption logic: renal artery → afferent arteriole → **glomerular capillaries** (high pressure, filtration) → efferent arteriole → **peritubular capillaries** (low pressure, surrounding the PCT/DCT, positioned to reabsorb what the tubule reclaims) and, for juxtamedullary nephrons, the **vasa recta** (running alongside the loop of Henle, maintaining rather than washing out the medullary concentration gradient) → renal vein.

### Lower Urinary Tract

Urine draining from collecting ducts passes through the calyces/pelvis into the **ureter** (a muscular tube, peristaltic contraction of its wall, same general smooth-muscle logic as GI peristalsis, see [Human Digestive System](../human-digestive-system/), actively propels urine toward the bladder rather than relying on gravity alone), into the **urinary bladder** (a distensible muscular sac; its wall's **detrusor muscle** contracts to expel urine), through the **urethra**. The ureters, bladder, and proximal urethra are lined by **transitional epithelium**, a specialized stratified epithelium structurally capable of stretching (cells flatten and the apparent layer count decreases as the bladder fills) uniquely suited to an organ whose luminal surface must accommodate large volume changes, unlike any epithelium described on the [Human Digestive System](../human-digestive-system/) page. Urine release (**micturition**) involves an **internal urethral sphincter** (smooth muscle, involuntary) and an **external urethral sphincter** (skeletal muscle, voluntary), the same involuntary/voluntary sphincter pairing pattern seen at the anal canal.

![Transitional epithelium histology compared between a collapsed (relaxed) and a distended (stretched) urinary bladder wall, each shown as both a real micrograph and a labeled line diagram — cell layers appear taller/more numerous when collapsed and flattened/fewer when stretched.](/ANATOMYPICS/transitional-epithelium-bladder-relaxed-stretched.jpg)
*Source: user-sourced (originally via a Houston Community College histology lab page). Exact match, directly shows the stretch-dependent flattening described in the text.*

## Comparative Structures

The nephron's filtration-then-reabsorption logic has a structurally simpler invertebrate analog in the annelid **nephridium** (see [Invertebrate Body Plans I](../invertebrate-body-plans-1/)), a segmentally repeated, much less elaborate filtration unit lacking the nephron's regional tubule specialization or countercurrent-multiplier concentrating mechanism. Among vertebrates, nephron structure (particularly loop-of-Henle length and the proportion of juxtamedullary nephrons) correlates directly with an animal's need to concentrate urine and conserve water, a theme picked up on the [Fish & Amphibian Anatomy](../fish-amphibian-anatomy/), [Reptile & Bird Anatomy](../reptile-bird-anatomy/), and [Mammalian Comparative Anatomy](../mammalian-comparative-anatomy/) pages (e.g. desert mammals show a much higher proportion of long-looped juxtamedullary nephrons than aquatic mammals).

## Common Exam Questions

- "Trace a molecule of glucose from the glomerular capillary to the point it is normally fully reabsorbed, naming every structure it passes through."
- "Explain why the glomerulus, unlike a typical capillary bed, sits between two arterioles rather than an arteriole and a venule, and what functional advantage this provides."
- "Explain the structural basis of the countercurrent multiplier, referencing the differential water/solute permeability of the descending and ascending loop of Henle limbs."
- "A patient has a mutation preventing aquaporin insertion in the collecting duct in response to ADH. Predict the effect on urine concentration."
- "Identify the two cell types of the juxtaglomerular apparatus and state what each detects or secretes."
- "Explain why transitional epithelium, rather than the stratified squamous epithelium seen elsewhere in the body, lines the bladder."

## Visual Reference

**Interactive**

*(Implemented inline above: the nephron filtration/reabsorption explorer sits directly below the nephron tubule image, and the countercurrent multiplier gradient chart sits directly below the cortical-vs-juxtamedullary nephron image.)*

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. Name, in order, every structure urine passes through from the collecting duct to leaving the body.
2. Explain why juxtamedullary nephrons, despite being a minority (~15%) of all nephrons, are disproportionately important for producing concentrated urine.
3. A structure in the nephron has cuboidal epithelium with a dense brush border and high mitochondrial density. Identify it and explain what these two structural features indicate about its function.
4. Describe the two-capillary-bed path of blood flow through the kidney and explain why this arrangement (rather than a single capillary bed) is structurally necessary.
5. Distinguish the internal and external urethral sphincters by muscle type and voluntary/involuntary control.
