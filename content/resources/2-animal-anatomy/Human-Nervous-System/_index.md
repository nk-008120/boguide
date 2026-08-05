---
title: "Human Nervous System"
weight: 5
description: "CNS and PNS structure, synapse and action-potential structural basis, meninges and CSF circulation, detailed brain regional anatomy including cortical functional areas, spinal cord and reflex arc organization, cranial/spinal nerves, and autonomic ganglion structure. Eye and ear anatomy are covered on the separate Sensory Organs page."
difficulty: "advanced"
prerequisites: ["Body-Plans"]
syllabus_tags: ["IBO", "USABO", "human-anatomy"]
---
{{< topic-meta >}}

## Overview

The nervous system is nervous tissue (see [Body Plans](../body-plans/)) organized into a signal-processing network. This page is structural: anatomical divisions, neuron/glial/synapse anatomy, detailed brain and spinal cord regional organization, and the peripheral/autonomic nerve plan. Sense-organ structure (eye, ear) is deep enough to warrant its own page — see [Human Sensory Organs](../human-sensory-organs/). Cephalization (introduced on the Body Plans page) means this page carries a disproportionate share of IBO exam weight relative to its position in the reading order.

## Key Concepts

### Anatomical Divisions

```mermaid
graph TD;
    NS["Nervous System"] --> CNS["Central Nervous System (CNS)"];
    NS --> PNS["Peripheral Nervous System (PNS)"];
    CNS --> Brain;
    CNS --> SpinalCord["Spinal Cord"];
    PNS --> Somatic["Somatic (voluntary, skeletal muscle)"];
    PNS --> Autonomic["Autonomic (involuntary)"];
    Autonomic --> Sympathetic["Sympathetic ('fight or flight')"];
    Autonomic --> Parasympathetic["Parasympathetic ('rest and digest')"];
```

The **CNS** (brain + spinal cord) is protected by bone (skull, vertebral column — see [Human Skeletal System](../human-skeletal-system/)), three connective-tissue **meninges** — **dura mater** (outermost, tough, two-layered, encloses venous sinuses draining the brain), **arachnoid mater** (middle, web-like, encloses the **subarachnoid space**, through which CSF circulates and major blood vessels run), **pia mater** (innermost, delicate, adheres directly to the brain/spinal cord surface, following every gyrus and sulcus) — and cerebrospinal fluid.

![Three panels: (a) posterior view of the CNS showing the brain and spinal nerve regions, (b) a sectional view of the meninges showing dura mater, subdural space, arachnoid membrane, pia mater, subarachnoid space, and venous sinus, (c) a posterior view of the spinal cord and vertebra showing gray/white matter, the meninges, and an autonomic ganglion.](/ANATOMYPICS/meninges-layers-cross-section.png)
*Source: Dee Unglaub Silverthorn,* Human Physiology: An Integrated Approach*.*

**CSF** is produced by the **choroid plexus** (specialized, highly vascularized ependymal tissue) within the brain's four **ventricles** (paired lateral ventricles, third ventricle, fourth ventricle, connected in sequence), circulates through the ventricular system and central canal of the spinal cord, exits into the subarachnoid space, and is reabsorbed into the venous system via **arachnoid granulations**. Structurally, CSF performs three roles: mechanical cushioning (the brain effectively floats, reducing its effective weight against the skull), chemical stability (a tightly regulated extracellular environment for neurons), and buoyant/waste clearance function. Obstruction of this circulation pathway (e.g. at a narrow ventricular connection) causes CSF to accumulate proximally — the structural basis of hydrocephalus, a common applied-anatomy question.

![CSF circulation pathway: choroid plexus (lateral ventricle) → interventricular foramina → third ventricle → aqueduct → fourth ventricle → foramen of Magendie → cisterna magna/subarachnoid space → arachnoid granulations.](/ANATOMYPICS/ventricular-system-csf-circulation.jpg)
*Source: user-sourced (originally attempted via ResearchGate, which returned 403 Forbidden on direct fetch). Exact match, full pathway traced end to end.*

The **PNS** comprises 12 pairs of **cranial nerves** (emerging directly from the brain/brainstem) and 31 pairs of **spinal nerves** (emerging from the spinal cord between vertebrae, each formed by the union of a dorsal and ventral root — see below).

### Neuron and Synapse Structure

A **neuron** has three structural regions: **dendrites** (branched, receive synaptic input, increasing surface area for connections), **cell body (soma)** (nucleus, most organelles, integrates incoming signals), and **axon** (single, conducts an action potential away from the soma, ending in **axon terminals**).

**Resting membrane potential** (structurally maintained by unequal ion distribution across the membrane, set up by the Na⁺/K⁺-ATPase pump and leak channels) and the **action potential** (a rapid, self-propagating depolarization driven by sequential opening of voltage-gated Na⁺ channels, then voltage-gated K⁺ channels) are physiological processes with a direct structural dependency worth stating precisely: axons wrapped in **myelin** (produced by **Schwann cells** in the PNS, one Schwann cell per axon segment; by **oligodendrocytes** in the CNS, one oligodendrocyte extending processes to myelinate segments of several different axons — a structural PNS/CNS difference worth remembering) conduct faster because voltage-gated Na⁺ channels are concentrated at the unmyelinated gaps, the **nodes of Ranvier**, where the action potential regenerates and appears to "jump" node to node (**saltatory conduction**) rather than regenerating continuously along the entire membrane.

At the axon terminal, a **chemical synapse** transmits the signal to the next cell: an action potential arriving at the terminal opens voltage-gated Ca²⁺ channels, triggering **synaptic vesicles** (membrane-bound sacs of neurotransmitter) to fuse with the presynaptic membrane and release their contents into the **synaptic cleft**; neurotransmitter diffuses across and binds **postsynaptic receptors**, altering the postsynaptic cell's membrane potential (excitatory or inhibitory depending on the specific neurotransmitter-receptor pair). This same structural logic — vesicle fusion, cleft diffusion, receptor binding — is reused at the neuromuscular junction, detailed on the [Human Muscular System](../human-muscular-system/) page.

**Other glial cells**, largely supportive rather than signal-conducting: **astrocytes** (CNS, form the blood-brain barrier by inducing tight junctions in brain capillary endothelium, provide metabolic support and regulate the extracellular ion environment), **microglia** (CNS, immune defense — the CNS's resident macrophage-like cells), **ependymal cells** (CNS, line the ventricles, produce CSF as part of the choroid plexus).

<div style="width:100%; background:#fefcf5; border-radius:24px; padding:1.2rem; margin:1.5rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:'Inter',system-ui,sans-serif;">
  <h3 style="margin:0 0 0.8rem 0; color:#1a472a;">⚡ Myelinated vs. Unmyelinated Conduction Race</h3>
  <div id="conductionPlot" style="width:100%; height:420px;"></div>
  <input type="range" id="conductionSlider" min="0" max="100" step="1" value="0" style="width:100%; accent-color:#2d6a4f; margin-top:0.5rem;">
  <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:#6b7280; margin:0.2rem 0 0.8rem 0;">
    <span>Race start</span><span>Race clock →</span>
  </div>
  <div style="display:flex; gap:1.5rem; flex-wrap:wrap; font-size:0.85rem; color:#374151;">
    <div id="conductionMyelinLabel">Myelinated: active node at 0 mm</div>
    <div id="conductionUnmyelinLabel">Unmyelinated: wavefront at 0.0 mm</div>
  </div>
  <div style="font-size:0.78rem; color:#6b7280; margin-top:0.4rem;">Saltatory conduction lets the action potential regenerate only at the nodes of Ranvier and "jump" between them, reaching the axon terminal roughly 10× faster in this comparison than continuous, point-by-point unmyelinated conduction.</div>
</div>

<script src="https://cdn.plot.ly/plotly-3.1.0.min.js"></script>
<script>
(function() {
  function initChart() {
    if (typeof Plotly === 'undefined') { setTimeout(initChart, 100); return; }

    var nodes = [];
    for (var n = 0; n <= 20; n += 2) nodes.push(n);

    var xs = [];
    for (var i = 0; i <= 200; i++) xs.push(i * 0.1);

    function bump(center, width) {
      return xs.map(function(x) {
        return -70 + 100 * Math.exp(-Math.pow(x - center, 2) / (2 * width * width));
      });
    }

    var slider = document.getElementById('conductionSlider');
    var myelinLabel = document.getElementById('conductionMyelinLabel');
    var unmyelinLabel = document.getElementById('conductionUnmyelinLabel');

    function render() {
      var t = parseFloat(slider.value);
      var continuousPos = Math.min(20, (t / 10) * 20);
      var activeNode = Math.min(20, Math.floor(continuousPos / 2) * 2);
      var unmyelinPos = (t / 100) * 20;

      var traceMyelin = {
        x: xs, y: bump(activeNode, 0.4), mode: 'lines', name: 'Myelinated (at node)',
        line: { color: '#2d6a4f', width: 3 }, xaxis: 'x', yaxis: 'y'
      };
      var traceNodes = {
        x: nodes, y: nodes.map(function(){ return -70; }), mode: 'markers', name: 'Nodes of Ranvier',
        marker: { symbol: 'line-ns-open', size: 14, color: '#b1650f', line: {width: 2} }, xaxis: 'x', yaxis: 'y'
      };
      var traceUnmyelin = {
        x: xs, y: bump(unmyelinPos, 1.2), mode: 'lines', name: 'Unmyelinated',
        line: { color: '#c0392b', width: 3 }, xaxis: 'x2', yaxis: 'y2'
      };

      var layout = {
        grid: { rows: 2, columns: 1, pattern: 'independent' },
        xaxis: { range: [0, 20], title: 'Distance along axon (mm)' },
        yaxis: { range: [-90, 50], title: 'Myelinated (mV)', domain: [0.58, 1] },
        xaxis2: { range: [0, 20], title: 'Distance along axon (mm)' },
        yaxis2: { range: [-90, 50], title: 'Unmyelinated (mV)', domain: [0, 0.42] },
        showlegend: false,
        margin: { t: 20, l: 55, r: 20, b: 40 },
        plot_bgcolor: '#ffffff',
        paper_bgcolor: '#ffffff'
      };

      Plotly.react('conductionPlot', [traceMyelin, traceNodes, traceUnmyelin], layout, { responsive: true, displayModeBar: false });

      myelinLabel.textContent = continuousPos >= 20
        ? 'Myelinated: reached the axon terminal — done.'
        : 'Myelinated: active node at ' + activeNode + ' mm';
      unmyelinLabel.textContent = unmyelinPos >= 20
        ? 'Unmyelinated: reached the axon terminal — done.'
        : 'Unmyelinated: wavefront at ' + unmyelinPos.toFixed(1) + ' mm';
    }

    slider.addEventListener('input', render);
    render();
    window.addEventListener('resize', function(){ Plotly.relayout('conductionPlot', { autosize: true }); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChart);
  } else {
    initChart();
  }
})();
</script>

**Gray matter vs. white matter**: gray matter is composed mainly of neuron cell bodies, dendrites, and unmyelinated fibers (found at the cerebral/cerebellar cortex, and centrally within the spinal cord); white matter is composed of myelinated axon tracts (myelin's lipid content gives it a pale color) and lies centrally in the brain, peripherally in the spinal cord — the brain and spinal cord invert this arrangement relative to each other, a frequently tested point.

### Major Brain Regions

| Region | Key structures | Primary functions |
|---|---|---|
| **Cerebrum** | Two hemispheres, each with frontal/parietal/temporal/occipital lobes; outer cerebral cortex (gray matter, extensively folded into gyri/sulci to increase surface area); underlying white matter tracts including the **corpus callosum** (connects the two hemispheres) | Voluntary movement, sensory processing, language, reasoning, memory |
| **Diencephalon** | Thalamus, hypothalamus | Thalamus: sensory relay station to the cortex (nearly all sensory input, except olfaction, synapses here first). Hypothalamus: homeostatic control (temperature, hunger, thirst), links nervous and endocrine systems via direct control of the pituitary gland |
| **Cerebellum** | Highly folded cortex, dorsal to the brainstem, connected to it by three paired **cerebellar peduncles** | Motor coordination, balance, fine-tuning of movement (not initiation) |
| **Brainstem** | Midbrain, pons, medulla oblongata | Relays signals between brain and spinal cord; medulla contains vital involuntary control centers (breathing rhythm, heart rate, blood pressure) |

![Midsagittal brain section labeling the right cerebral hemisphere with corpus callosum and occipital lobe, the diencephalon (epithalamus/pineal gland, thalamus, hypothalamus), the brainstem (midbrain/corpora quadrigemina/cerebral peduncle, pons, medulla oblongata), the spinal cord, and the right cerebellar hemisphere with arbor vitae and cerebral aqueduct.](/ANATOMYPICS/brain-sagittal-section-major-regions.jpg)
*Source: nursekey.com, citing Applegate,* The Anatomy and Physiology Learning System*, 2nd ed., Saunders, 2000.*

**Cerebral cortex functional areas**, a further level of structural detail within the cerebrum, high-yield for IBO: the **primary motor cortex** (precentral gyrus, frontal lobe — initiates voluntary movement, organized somatotopically as a "motor homunculus" with body-region representation proportional to the precision of control required, not literal body size) and **primary somatosensory cortex** (postcentral gyrus, parietal lobe, directly posterior to the motor cortex — receives touch/pressure/temperature/pain input, also somatotopically organized) sit on either side of the **central sulcus**. Language-specific areas are typically lateralized to one hemisphere (left, in most people): **Broca's area** (frontal lobe — speech production; damage produces halting, effortful speech with preserved comprehension) and **Wernicke's area** (temporal lobe — language comprehension; damage produces fluent but nonsensical speech), connected by a white-matter tract (the arcuate fasciculus) — a classic structure-function dissociation exam topic. Beneath the cortex, the **basal ganglia** (a group of subcortical gray-matter nuclei) regulate voluntary movement initiation and smoothing (their degeneration is the structural basis of Parkinson's disease, a useful applied-anatomy reference point), and the **limbic system** (including the hippocampus, for memory consolidation, and the amygdala, for emotional processing, both in the temporal lobe) links cortical processing to emotional and memory function.

![Lateral brain view with motor areas (primary motor cortex, motor association area, frontal eye field) in green, Broca's area and prefrontal cortex outlined, and sensory areas (primary somatosensory cortex, sensory/visual/auditory association areas, Wernicke's area, primary visual and auditory cortices, general interpretation area) in pink/red.](/ANATOMYPICS/cerebral-cortex-functional-areas.jpg)
*Source: user-sourced textbook-style figure*

### Spinal Cord Organization and the Reflex Arc

In cross-section, the spinal cord shows a butterfly/H-shaped core of gray matter (dorsal and ventral horns, plus lateral horns at thoracic/upper lumbar levels containing sympathetic preganglionic neurons) surrounded by white matter tracts (ascending sensory tracts and descending motor tracts). **Dorsal root** = sensory (afferent) input entering the cord, with cell bodies clustered in the **dorsal root ganglion** just outside the cord; **ventral root** = motor (efferent) output leaving the cord — a structural asymmetry (the Bell-Magendie law) that is a reliable exam fact. Dorsal and ventral roots merge just distal to the dorsal root ganglion to form a single mixed **spinal nerve**.

The **reflex arc** is the clearest anatomical demonstration of spinal cord organization, using the knee-jerk (patellar) reflex as the standard example: stretch receptor in the quadriceps muscle → sensory neuron → dorsal root → direct synapse onto a motor neuron in the ventral horn (a **monosynaptic reflex**, the fastest reflex type, since it involves no interneuron) → ventral root → motor neuron → quadriceps contraction — occurring without requiring the brain, though the brain normally receives a parallel signal and can modulate the reflex.

![The patellar tendon (knee-jerk) reflex traced end to end on a spinal cord cross-section: tendon tap → muscle spindle receptor fires → afferent sensory neuron → synapse in the spinal cord → efferent motor neuron to the quadriceps (contraction) and a parallel inhibitory interneuron to the hamstring motor neuron (reciprocal inhibition, staying relaxed).](/ANATOMYPICS/spinal-cord-cross-section-reflex-arc.png)
*Source: Dee Unglaub Silverthorn,* Human Physiology: An Integrated Approach *(Fig. 13.5; also used on [Animal Physiology: Nervous System Physiology](../../3-animal-physiology/Nervous-System-Physiology/)).*

<div style="width:100%; background:#fefcf5; border-radius:24px; padding:1.2rem; margin:1.5rem 0; box-shadow:0 4px 12px rgba(0,0,0,0.05); font-family:'Inter',system-ui,sans-serif;">
  <h3 style="margin:0 0 0.8rem 0; color:#1a472a;">🦵 Knee-Jerk Reflex Arc Walkthrough</h3>
  <p style="font-size:0.85rem; color:#6b7280; margin:0 0 1rem 0;">Click a step directly, or use Next/Previous to trace the patellar reflex from tendon tap to contraction.</p>
  <div id="reflexSteps" style="display:flex; flex-direction:column; gap:0.4rem;"></div>
  <div style="display:flex; gap:0.5rem; margin-top:0.8rem;">
    <button id="reflexPrev" style="padding:6px 16px; border:none; border-radius:30px; background:#e2e8f0; color:#1e293b; cursor:pointer; font-weight:500; font-size:0.85rem;">← Previous</button>
    <button id="reflexNext" style="padding:6px 16px; border:none; border-radius:30px; background:#2d6a4f; color:white; cursor:pointer; font-weight:500; font-size:0.85rem;">Next →</button>
  </div>
</div>

<script>
(function(){
  var steps = [
    { name: 'Stretch receptor fires', desc: 'The tendon tap stretches the quadriceps muscle; a stretch (muscle spindle) receptor within it fires in proportion to the stretch.' },
    { name: 'Sensory neuron → dorsal root', desc: 'The afferent sensory neuron carries this signal toward the spinal cord, entering via the dorsal root (its cell body sits in the dorsal root ganglion just outside the cord).' },
    { name: 'Direct synapse in the ventral horn', desc: 'The sensory neuron synapses directly onto a motor neuron in the ventral horn — a monosynaptic reflex, the fastest type since no interneuron is involved.' },
    { name: 'Motor neuron → ventral root', desc: 'The motor neuron\'s efferent output leaves the spinal cord via the ventral root (the Bell-Magendie law: dorsal = sensory, ventral = motor).' },
    { name: 'Quadriceps contracts', desc: 'The motor neuron signal reaches the quadriceps, causing it to contract and extend the knee.' },
    { name: 'Reciprocal inhibition (hamstring)', desc: 'A parallel inhibitory interneuron simultaneously suppresses the hamstring motor neuron, so the antagonist muscle relaxes rather than fighting the contraction. This entire pathway occurs without requiring the brain, though the brain normally receives a parallel signal and can modulate the reflex.' }
  ];
  var idx = 0;
  var container = document.getElementById('reflexSteps');
  var prevBtn = document.getElementById('reflexPrev');
  var nextBtn = document.getElementById('reflexNext');

  steps.forEach(function(s, i){
    var row = document.createElement('div');
    row.className = 'reflex-step';
    row.dataset.index = i;
    row.style.cssText = 'padding:8px 12px; border-radius:10px; border:2px solid transparent; cursor:pointer; transition:background 0.2s, border-color 0.2s;';
    row.innerHTML = '<strong>' + (i + 1) + '. ' + s.name + '</strong><div class="reflex-desc" style="font-size:0.82rem; color:#4b5563; margin-top:2px;">' + s.desc + '</div>';
    row.addEventListener('click', function(){ idx = i; render(); });
    container.appendChild(row);
  });

  function render(){
    var rows = container.querySelectorAll('.reflex-step');
    rows.forEach(function(row, i){
      if (i === idx) {
        row.style.background = '#2d6a4f';
        row.style.borderColor = '#1a472a';
        row.style.color = 'white';
        row.querySelector('.reflex-desc').style.color = '#e5f0ea';
      } else if (i < idx) {
        row.style.background = '#eaf3ea';
        row.style.borderColor = 'transparent';
        row.style.color = '#1a472a';
        row.querySelector('.reflex-desc').style.color = '#4b5563';
      } else {
        row.style.background = '#f1f5f9';
        row.style.borderColor = 'transparent';
        row.style.color = '#9ca3af';
        row.querySelector('.reflex-desc').style.color = '#9ca3af';
      }
    });
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === steps.length - 1;
  }

  prevBtn.addEventListener('click', function(){ if (idx > 0) { idx--; render(); } });
  nextBtn.addEventListener('click', function(){ if (idx < steps.length - 1) { idx++; render(); } });

  render();
})();
</script>

### Cranial and Spinal Nerves

The 12 pairs of cranial nerves are conventionally numbered I–XII and each carries a specific, named functional role — a standard IBO memorization/mapping topic: **I Olfactory** (smell), **II Optic** (vision), **III Oculomotor**, **IV Trochlear**, **VI Abducens** (these three jointly control most eye-muscle movement), **V Trigeminal** (facial sensation, jaw muscles), **VII Facial** (facial expression muscles, taste anterior 2/3 tongue), **VIII Vestibulocochlear** (hearing, balance), **IX Glossopharyngeal** (taste posterior tongue, pharynx), **X Vagus** (the major parasympathetic nerve to thoracic/abdominal organs — by far the most extensive distribution of any cranial nerve), **XI Accessory** (neck/shoulder muscles), **XII Hypoglossal** (tongue muscles). The 31 pairs of spinal nerves are grouped by the vertebral level they exit (8 cervical, 12 thoracic, 5 lumbar, 5 sacral, 1 coccygeal); nerves from adjacent levels often interweave into **plexuses** (e.g. the brachial plexus, supplying the upper limb) before redistributing into named peripheral nerves.

![Inferior (base-of-brain) view with all 12 cranial nerves numbered, named, and color-coded at their point of origin: Olfactory I, Optic II, Oculomotor III, Trochlear IV, Trigeminal V, Abducens VI, Facial VII, Vestibulocochlear VIII, Glossopharyngeal IX, Vagus X, Accessory XI, Hypoglossal XII.](/ANATOMYPICS/cranial-nerves-base-of-brain.png)
*Source: user-sourced. Exact match — a genuine base-of-brain nerve-origin view (a candidate found via teachmeanatomy.info during sourcing turned out to be a skull-base foramina view instead, a mismatch; this saved file is the correct one).*

### Autonomic Nervous System Structure

Both autonomic divisions use a two-neuron chain from CNS to target organ — a structural feature distinguishing autonomic from somatic motor pathways (which use a single motor neuron all the way to skeletal muscle): a **preganglionic neuron** (cell body in the CNS) synapses onto a **postganglionic neuron** (cell body in a peripheral autonomic ganglion), which then innervates the target organ. The two divisions differ structurally in exactly where this synapse occurs and what neurotransmitter the postganglionic neuron releases:

| Feature | Sympathetic | Parasympathetic |
|---|---|---|
| CNS origin | Thoracic and lumbar spinal cord | Brainstem (via cranial nerves, especially the vagus) and sacral spinal cord |
| Ganglion location | Close to the spinal cord (sympathetic chain ganglia) — short preganglionic, long postganglionic neuron | Close to or within the target organ — long preganglionic, short postganglionic neuron |
| Postganglionic neurotransmitter | Norepinephrine (mostly) | Acetylcholine |

This preganglionic/postganglionic length difference is itself a useful structural mnemonic: sympathetic responses (widespread, rapid, "fight or flight") are anatomically set up for broad, fast-diffusing activation from ganglia near the spinal cord, while parasympathetic responses (localized, "rest and digest") are anatomically set up for targeted, organ-specific control from ganglia embedded in or near the organ itself.

![Classic Gray's Anatomy diagram of the autonomic nervous system: sympathetic outflow (red) from thoracic/lumbar spinal segments through short preganglionic fibers to chain/collateral ganglia (superior cervical, celiac, superior/inferior mesenteric) then long postganglionic fibers to target organs, versus parasympathetic outflow (blue) via cranial nerves III/VII/IX/X and the pelvic nerve with long preganglionic fibers reaching ganglia at or within the target organs.](/ANATOMYPICS/sympathetic-parasympathetic-ganglion-comparison.png)
*Source: Wikimedia Commons, `Gray839.png`, public domain (Gray's Anatomy, 1918). Directly visualizes the pre-/postganglionic length asymmetry described in the text.*

## Comparative Structures

The tripartite CNS/PNS/autonomic organization and core neuron/synapse structure are conserved across all vertebrates, but relative brain-region proportions differ substantially by lifestyle and taxon — expanded on across the Vertebrate Anatomy tier. Invertebrate nervous systems trade the centralized brain + spinal cord plan for nerve nets (cnidarians, no true brain) or ganglia (a more distributed plan, seen in annelids and arthropods, including the notably centralized cephalopod brain) — see [Invertebrate Body Plans I](../invertebrate-body-plans-1/) and [II](../invertebrate-body-plans-2/).

## Common Exam Questions

- "Explain, structurally, why damage to the ventral root causes motor but not sensory deficits."
- "A patient has fluent but nonsensical speech with intact comprehension of written instructions. Which cortical area is most likely damaged, and where is the deficit lateralized?"
- "Trace the two-neuron pathway of a sympathetic signal from the spinal cord to a target organ, naming the ganglion location and the postganglionic neurotransmitter."
- "Explain why obstruction of CSF flow within the ventricular system causes fluid accumulation proximal to the blockage, and name the resulting condition."
- "A CNS axon and a PNS axon are both myelinated. Name the glial cell responsible in each case and describe one structural difference between them."

## Visual Reference

**Interactive**

*(Implemented inline above: the myelinated vs. unmyelinated conduction race sits directly below the myelin/saltatory conduction paragraph, and the knee-jerk reflex arc walkthrough sits directly below the reflex arc image.)*

**Static**

*(Static images are placed inline in Key Concepts above, next to the concept each one illustrates, rather than collected here.)*

## Practice Problems

1. Name the three meningeal layers from outermost to innermost and state which one directly contacts brain tissue.
2. A patient loses fine motor coordination but retains the ability to initiate movement. Which brain region is most likely affected?
3. Explain why gray matter is central in the spinal cord but peripheral (cortical) in the brain, in terms of what gray matter is made of.
4. Name the cranial nerve responsible for the majority of parasympathetic output to the thoracic and abdominal organs.
5. Distinguish the sympathetic and parasympathetic divisions by ganglion location and preganglionic/postganglionic neuron length, and explain how this structural difference supports each division's characteristic response pattern.
