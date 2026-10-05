---
title: "The Search for Life, Right Now: Astrobiology BiOHorizon Report"
description: "A rover drilled a rock with leopard spots, a telescope sniffed an alien atmosphere, an old flyby revealed fresh ocean chemistry, and an asteroid turned out to carry sugar. What was measured, what was only claimed, and why it matters for biologists."
layout: "horizon"
date: 2026-10-03
aliases: ["/biobytes/frontiers/astrobiology/"]
---

{{< mathjax >}}

<div class="fr-article">

<div class="fr-author-label">Author</div>
<div class="testimonial-author fr-author">
  <img src="/nkavat.jpg" alt="Nishit Kalani" class="testimonial-author-photo" onerror="this.onerror=null;this.src='/avatars/avatar-01.svg';">
  <div class="testimonial-author-info">
    <h3>Nishit Kalani</h3>
    <div class="testimonial-author-tagline">Founder, Director &amp; Software Engineer &middot; BiOGuide</div>
    <p class="testimonial-author-bio">I started olympiad biology late, among people who had been preparing for years, so I had no head start, only a method: teach yourself from public resources, build your own spreadsheets, and turn them into knowledge graphs until the patterns show up. A negative score in an early biology paper pushed me there, and biology stopped being something to memorise and became something to model. That path led to IOAA Jr gold (2025) and IBO silver (2026), and it is why I built BiOGuide: serious preparation should not depend on which city you happen to live in. Astronomy still shapes how I think, so astrobiology, where physical conditions meet the chemistry of life, is my favourite corner of this site.</p>
  </div>
</div>

<div class="fr-hero">
  <p class="fr-kicker">BiOHorizon Report &middot; Astrobiology &middot; October 2026</p>
  <p class="fr-dek">Since the start of 2025, a rover on Mars drilled a rock covered in "leopard spots", a space telescope claimed a whiff of a life-linked gas on an alien world and was promptly challenged, a 17-year-old flyby finally gave up fresh chemistry from a moon's hidden ocean, and an asteroid sample turned out to contain sugar. This report separates what was <em>measured</em> from what was <em>claimed</em>, and shows where each story plugs into the biology you are already studying.</p>
  <div class="fr-pills">
    <span class="fr-pill">🪐 5 stories</span>
    <span class="fr-pill">🔬 Technical, but readable</span>
    <span class="fr-pill">🧮 Worked maths + interactive lab</span>
    <span class="fr-pill">📚 20 sources</span>
    <span class="fr-pill">🖼️ 9 images</span>
    <span class="fr-pill">☕ ~14 min read</span>
  </div>
</div>


## How to read a life-detection claim

Almost every headline of the form "signs of life found!" survives or collapses on the same four questions. Keep them in your head through every story below.

<div class="fr-questions">
  <div class="fr-question"><span class="fr-q-num">1</span><div><h3>Is the signal real?</h3><p>Could noise, a quirk of the instrument, or one analyst's data-reduction choices have produced it?</p></div></div>
  <div class="fr-question"><span class="fr-q-num">2</span><div><h3>Is it from where we think?</h3><p>Contamination, from Earth or from the spacecraft, has fooled researchers before.</p></div></div>
  <div class="fr-question"><span class="fr-q-num">3</span><div><h3>Can non-living chemistry make it?</h3><p>An <strong>{{< term "abiotic" >}}abiotic false positive{{< /term >}}</strong> is a signal that looks like life but comes from geology, chemistry or physics.</p></div></div>
  <div class="fr-question"><span class="fr-q-num">4</span><div><h3>Has someone else confirmed it?</h3><p>Different team, different instrument, different data, same answer. Without this, a claim stays a hypothesis.</p></div></div>
</div>

<div class="fr-callout">
  <h3>Sigma, in one paragraph</h3>
  <p>When astronomers say a detection is "{{< term "sigma" >}}3 sigma{{< /term >}}", they mean that if there were really nothing there, random noise would fake a signal that strong only about 0.13% of the time (roughly 1 in 740, using the one-sided convention). "5 sigma", the usual bar for announcing a discovery, corresponds to about 1 in 3.5 million. The catch: if you search a spectrum for twenty different molecules, one of them reaching 3 sigma by chance is no longer surprising. Researchers call this the {{< term "look-elsewhere" >}}look-elsewhere effect{{< /term >}}, and it sits at the heart of the K2-18 b argument in Story 2.</p>
</div>

Scientists have also tried to standardise how loudly a claim should be announced. The {{< term "cold-scale" >}}CoLD scale{{< /term >}} (Confidence of Life Detection), proposed in *Nature* in 2021, is a seven-rung ladder that starts at "a signal was detected" and climbs through ruling out contamination and non-living explanations to independent verification at the top.<sup class="fr-ref"><a href="#ref-18">18</a></sup> The Mars result in Story 1 is reported with exactly that kind of caution.

## The five stories at a glance

<div class="fr-table-wrap">
<table class="fr-table">
<thead><tr><th>Story</th><th>Where</th><th>Headline</th><th>Honest status</th></tr></thead>
<tbody>
<tr><td>1. Leopard spots</td><td>Mars, Jezero Crater</td><td>Iron phosphate and iron sulfide patterns that on Earth are linked to microbial metabolism</td><td>Potential biosignature; non-living routes judged unlikely but not excluded</td></tr>
<tr><td>2. A 3-sigma whisper</td><td>Exoplanet K2-18 b</td><td>Claimed dimethyl sulfide in the atmosphere</td><td>Contested; independent reanalyses find insufficient evidence</td></tr>
<tr><td>3. Fresh from the ocean</td><td>Saturn's moon Enceladus</td><td>Organic compounds in minutes-old ice grains from the subsurface ocean</td><td>Solid detection; shows chemistry, not life</td></tr>
<tr><td>4. Life's ingredients on a rock</td><td>Asteroid Bennu</td><td>Amino acids, all five nucleobases, ribose and glucose in returned samples</td><td>Lab-measured fact; prebiotic, not biological</td></tr>
<tr><td>5. Life as a pattern</td><td>Theory</td><td>Detecting life through statistics across many planets, with no chemistry assumed</td><td>Simulation only</td></tr>
</tbody>
</table>
</div>

<div class="fr-story fr-story-mars">

<div class="fr-story-head">
  <span class="fr-story-num">1</span>
  <span class="fr-tag">🪐 Mars &middot; Perseverance rover</span>
</div>

## Mars has leopard spots

<p class="fr-label">The claim</p>

In July 2024, NASA's {{< term "perseverance" >}}Perseverance rover{{< /term >}} drilled a core from an arrowhead-shaped rock called Cheyava Falls (about 1 m by 0.6 m) in the Bright Angel formation, inside Neretva Vallis, an ancient river channel feeding {{< term "jezero" >}}Jezero Crater{{< /term >}}. The core was named Sapphire Canyon. In September 2025, a peer-reviewed paper in *Nature* reported that the rock holds mineral and organic patterns that could be a **potential {{< term "biosignature" >}}biosignature{{< /term >}}**: NASA's careful wording, and the right one.<sup class="fr-ref"><a href="#ref-1">1</a><a href="#ref-2">2</a></sup>

<p class="fr-label">How they did it</p>

The rock is a {{< term "mudstone" >}}mudstone{{< /term >}} of clay and silt that contains organic carbon, sulfur, oxidised iron and phosphorus. Two instruments on the rover's arm did the detective work:

- **{{< term "pixl" >}}PIXL{{< /term >}}** (Planetary Instrument for X-ray Lithochemistry) maps which elements sit where, at the scale of fractions of a millimetre.
- **SHERLOC** (Scanning Habitable Environments with Raman & Luminescence for Organics & Chemicals) uses deep-UV light to look for organic molecules and minerals.<sup class="fr-ref"><a href="#ref-2">2</a></sup>

<div class="fr-figs">
<figure class="fr-fig">
  <img src="/horizon/astrobio/cheyavafalls.webp" alt="Close-up of a reddish Martian rock surface speckled with small pale spots, with one leopard spot and one olivine grain circled and labelled" width="649" height="472" loading="lazy">
  <figcaption><strong>Fig. 1.</strong> The Mars rock with leopard spots, as imaged by Perseverance. The labels mark one leopard spot and an olivine grain. <span class="fr-credit">Image: NASA/JPL-Caltech. <a href="https://science.nasa.gov/resource/perseverance-finds-a-rock-with-leopard-spots/">Source</a></span></figcaption>
</figure>
<figure class="fr-fig">
  <div class="fr-crop-pixl"><img src="/horizon/astrobio/PIXLVivianite.webp" alt="A rectangular PIXL elemental map in pink, red, purple and green pixels laid over a close-up of the speckled rock, with a 1 millimetre scale bar" width="739" height="415" loading="lazy"></div>
  <figcaption><strong>Fig. 2.</strong> A PIXL element map overlaid on a close-up of the rock. The colours show how elements are distributed across the spots. Scale bar: 1 mm. <span class="fr-credit">Image: NASA/JPL-Caltech, via astrobiology.com. <a href="https://astrobiology.com/2025/10/28/mars-perseverances-pixl-finds-vivianite-greigite-in-cheyava-falls-sample/">Source</a></span></figcaption>
</figure>
</div>

<p class="fr-label">The numbers and the chemistry</p>

The rock is dotted with two textures: **"leopard spots"** (pale cores ringed by dark rims, up to millimetre scale) and tiny dark **"poppy seeds"**. PIXL showed that the dark rims and seeds are rich in **{{< term "vivianite" >}}vivianite{{< /term >}}**, a hydrated iron(II) phosphate, while the spot interiors contain **{{< term "greigite" >}}greigite{{< /term >}}**, an iron sulfide (Fe<sub>3</sub>S<sub>4</sub>). Organic carbon sits in the same places.<sup class="fr-ref"><a href="#ref-1">1</a><a href="#ref-3">3</a></sup>

The proposed story is a two-step electron hand-off, as organic matter in the mud was oxidised:

1. Electrons first went to oxidised iron, Fe(III), which became Fe(II) and, with phosphate, precipitated as vivianite.
2. Once the iron was used up, electrons went to sulfate, producing sulfide and then greigite.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

On Earth, microbes make a living by running exactly these reactions in sediments.

<p class="fr-label">Where it is contested</p>

The same minerals can form without life, so the paper's case rests on ruling out non-living routes. Making iron sulfides abiotically needs sustained heating above roughly 150 °C, and the team found no evidence the rock was ever that hot. A volcano about 50 km away looks younger than the rock, and hot fluids seeping in would be expected to leave diffuse splotches, not sharp spots.<sup class="fr-ref"><a href="#ref-2">2</a><a href="#ref-3">3</a></sup> The weak link is the organics: the rover cannot say <em>which</em> organic molecules are present, and that is the very thing that would distinguish biology from chemistry. A member of the Perseverance science team has said publicly that the match could simply be a coincidence.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

The real test needs the rock on Earth. {{< term "msr" >}}Mars Sample Return{{< /term >}}, the mission meant to bring Perseverance's cores home, is under severe budget pressure, and China's {{< term "tianwen-3" >}}Tianwen-3{{< /term >}} (planned for launch in 2028) may return samples first.<sup class="fr-ref"><a href="#ref-3">3</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="4 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span><span class="fr-meter-note">In-situ instruments, peer reviewed, but no Earth lab yet</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Bearing on life</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Suggestive pattern; organics unidentified</span></div>
</div>

<p class="fr-label">The biology underneath</p>

This is respiration seen from the outside. Dissimilatory iron reduction and sulfate reduction are textbook {{< term "anaerobic-respiration" >}}anaerobic metabolisms{{< /term >}}: organic carbon is the electron donor, Fe(III) or sulfate is the terminal {{< term "electron-acceptor" >}}electron acceptor{{< /term >}}, and the energy released drives ATP synthesis. Ask which electron acceptors an organism would choose, and in what order, as each one runs out. The order the Mars minerals appear in (iron first, then sulfate) follows that same energy ladder.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/1-cell-molecular/bioenergetics-central-metabolism" label="Bioenergetics and Central Metabolism" why="electron acceptors and the energy ladder" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: what would you want in the returned sample?</summary>
<div>
<p>List three measurements you could do on Earth that Perseverance cannot. For example:</p>
<ul>
<li>identify the organic molecules individually</li>
<li>measure sulfur isotope ratios in the greigite, since biological sulfate reduction tends to fractionate sulfur isotopes in a characteristic way</li>
<li>look for microscopic textures at the nanometre scale</li>
</ul>
<p>Then ask the harder question: what result would make you <em>drop</em> the biological hypothesis?</p>
</div>
</details>

</div>

<div class="fr-story fr-story-exo">

<div class="fr-story-head">
  <span class="fr-story-num">2</span>
  <span class="fr-tag">🔭 Exoplanet &middot; JWST</span>
</div>

## A 3-sigma whisper from K2-18 b

<p class="fr-label">The claim</p>

{{< term "k2-18b" >}}K2-18 b{{< /term >}} is a temperate {{< term "sub-neptune" >}}sub-Neptune{{< /term >}}, about 120 light-years away, with an equilibrium temperature near 255 K. The claims about its atmosphere built up in steps:

- Hubble hinted at water vapour in its atmosphere.
- The {{< term "jwst" >}}James Webb Space Telescope{{< /term >}} (JWST) then reported methane and carbon dioxide, consistent with a "{{< term "hycean" >}}hycean{{< /term >}}" world: a water ocean under a thin hydrogen-rich atmosphere.
- In 2023 the same team reported a tentative hint of **{{< term "dms" >}}dimethyl sulfide (DMS){{< /term >}}**.
- In April 2025 a mid-infrared (MIRI, 5 to 12 µm) dataset was reported to show DMS and/or dimethyl disulfide (DMDS) at about 3 sigma.<sup class="fr-ref"><a href="#ref-4">4</a><a href="#ref-5">5</a></sup>

<figure class="fr-fig fr-fig-wide">
  <img src="/horizon/astrobio/exoplanet-k2-18b-illustration.webp" alt="Artist illustration of a large blue-and-purple planet filling the right of the frame, with a small red star and a tiny moon-like crescent in a starry sky" width="1280" height="720" loading="lazy">
  <figcaption><strong>Fig. 3.</strong> An artist's concept of K2-18 b. No telescope has resolved the planet, so this image shows one hypothesis (an ocean-covered "hycean" world) and is not data. <span class="fr-credit">Illustration: NASA, CSA, ESA, J. Olmsted (STScI); science: N. Madhusudhan (University of Cambridge). <a href="https://en.wikipedia.org/wiki/K2-18b">Source</a></span></figcaption>
</figure>

<p class="fr-label">Why DMS makes headlines</p>

On Earth, atmospheric DMS comes overwhelmingly from marine biology: phytoplankton make the osmolyte {{< term "dmsp" >}}DMSP{{< /term >}}, and bacteria and algae cleave it with DMSP lyase to release DMS. A gas with a famous biological source on Earth is exactly what a biosignature hunter wants to see. But "famous biological source" is not the same as "only possible source".

<p class="fr-label">The method, and where it came apart</p>

A {{< term "transmission-spectrum" >}}transmission spectrum{{< /term >}} is built by watching the planet cross its star: wavelengths that molecules absorb make the planet look very slightly bigger. The differences are tiny, so conclusions depend on how the raw data are reduced and which molecules the model is allowed to contain.

- **Reanalysis of the 2023 data** found methane at about 4 sigma but no statistically significant carbon dioxide or DMS.<sup class="fr-ref"><a href="#ref-5">5</a></sup>
- **A joint reanalysis (May 2025)** modelled the whole 0.6 to 12 µm spectrum from NIRISS, NIRSpec and MIRI together, using three data-reduction pipelines and two retrieval codes. It found insufficient evidence for DMS or DMDS. Other methyl-bearing molecules such as ethane fit the data equally well, and the marginal preference for DMS appeared only when the list of candidate molecules was restricted. The authors estimate that about 25 more MIRI transits would be needed to reach 3 sigma against a flat spectrum.<sup class="fr-ref"><a href="#ref-5">5</a></sup>
- **A NASA-led analysis (July 2025)** combined four new JWST observations with the original data and had three independent teams interpret them. The DMS evidence came out near 2.7 sigma, far below 5. It also noted that abiotic photochemistry in hydrogen-rich atmospheres can make DMS-like organosulfur molecules, as lab experiments show.<sup class="fr-ref"><a href="#ref-7">7</a></sup>
- **A paper in the *Astronomical Journal*** argued that K2-18 b does not meet the standards of evidence for life.<sup class="fr-ref"><a href="#ref-6">6</a></sup>

Even the hycean interpretation itself has been challenged by other modelling teams.<sup class="fr-ref"><a href="#ref-5">5</a></sup>

<p class="fr-label">Where the computer comes in</p>

Nobody looks at K2-18 b through an eyepiece. Software turns raw detector images into a spectrum (the joint reanalysis above ran three independent pipelines, and they do not produce identical spectra). Then retrieval codes search through enormous numbers of model atmospheres, typically with {{< term "bayesian-inference" >}}Bayesian sampling{{< /term >}}, to ask which compositions the spectrum allows. Every number in the debate above is the output of a computation, and the disagreements are largely disagreements about computational choices. So it is worth doing the arithmetic yourself.

<figure class="fr-fig fr-fig-wide">
  <img src="/horizon/astrobio/wasp-107b.webp" alt="Graph titled Transmission Spectrum of the gas giant WASP-107 b, with blue data points and a grey best-fit line, and peaks labelled water, carbon dioxide, methane, sulfur dioxide and carbon monoxide" width="693" height="443" loading="lazy">
  <figcaption><strong>Fig. 4.</strong> What a transmission spectrum looks like: JWST NIRSpec data for a different planet, the gas giant WASP-107 b, with the molecules that absorb at each wavelength labelled. Blue dots are data and the grey line is a best-fit model. Its features are far larger than the tens-of-ppm signals in the K2-18 b debate. <span class="fr-credit">Graphic: NASA, ESA, CSA, STScI. <a href="https://science.nasa.gov/asset/webb/warm-gas-giant-exoplanet-wasp-107-b-transmission-spectrum-nirspec/">Source</a></span></figcaption>
</figure>

<p class="fr-label">The maths under the hood</p>

<div class="fr-math">

**Step 1: how big is the signal?** When the planet crosses its star it blocks a fraction δ = (R<sub>p</sub> / R<sub>s</sub>)² of the starlight. The planet's radius is 2.610 R⊕ (1.663 × 10⁷ m) and its star's is 0.4445 R☉ (3.093 × 10⁸ m),<sup class="fr-ref"><a href="#ref-20">20</a></sup> so δ ≈ 2.9 × 10⁻³, about 2,900 ppm. That is the right ballpark for the transit-depth axis in the published spectra.

An atmosphere makes the planet look slightly bigger at wavelengths where its molecules absorb. The extra transit depth per atmospheric {{< term "scale-height" >}}scale height{{< /term >}} H is roughly

$$ \Delta\delta \approx \frac{2 R_p H}{R_s^2}, \qquad H = \frac{k_B T}{\mu m_H g} $$

Take g = GM / R² = 12.4 m/s² (using M = 8.63 M⊕),<sup class="fr-ref"><a href="#ref-20">20</a></sup> T = 255 K, and μ = 2.3 for a hydrogen-helium atmosphere. Then H ≈ 74 km and Δδ ≈ 2.6 × 10⁻⁵. **One scale height of extra absorption changes the transit depth by only about 26 ppm, less than 1% of the transit depth.** Spectral features are of that order, tens of ppm, which is why JWST's precision matters so much.

There is a hidden trap. H depends on μ, the mean molecular weight, which is part of what you are trying to measure. A water-rich atmosphere with μ ≈ 18 would shrink H roughly eightfold, to about 3 ppm per scale height. The composition you want to infer also decides how big a signal to expect.

**Step 2: from spectrum to significance.** Suppose a candidate molecule predicts a spectral shape t<sub>i</sub> across wavelength bins, and the data d<sub>i</sub> have Gaussian errors σ<sub>i</sub>. The best-fit amplitude of that shape, its uncertainty, and the significance are

$$ \hat A = \frac{\sum_i d_i t_i / \sigma_i^2}{\sum_i t_i^2 / \sigma_i^2}, \qquad \sigma_{\hat A} = \Big( \sum_i t_i^2 / \sigma_i^2 \Big)^{-1/2}, \qquad s = \frac{\hat A}{\sigma_{\hat A}} $$

Adding that one amplitude to the model improves the chi-squared fit by Δχ² = s², so "3 sigma" means Δχ² = 9. Now the useful part: averaging N independent transits shrinks the noise as 1/√N. **If the signal is real, significance grows as √N.** Going from 2.7 sigma to 5 sigma then takes (5 / 2.7)² ≈ 3.4 times as much data. **If it is a fluke, new transits bring fresh noise, the apparent feature dilutes, and s drifts back toward zero.** More data is the test that separates the two. This assumes white noise; real instruments also have correlated noise and systematics that do not average away like 1/√N, which is one reason pipelines disagree.

**Step 3: how many chances did the data have to fool you?** If you test M independent candidates, the chance that at least one reaches a local probability p by luck is

$$ p_{\text{global}} = 1 - (1 - p_{\text{local}})^{M} $$

A 3 sigma local result has p = 0.00135. With M = 20 candidates, p<sub>global</sub> ≈ 2.7%, which is only about 1.9 sigma. Bayesian model comparison builds the same penalty in from the start: a model's evidence integrates over its whole parameter space, so every extra molecule has to earn its place (an Occam factor). Turn that around and you see the criticism in the joint reanalysis: restricting the list of molecules removes the competitors that would have absorbed the same wiggle, and manufactures a "preference" for DMS.<sup class="fr-ref"><a href="#ref-5">5</a></sup>

</div>

<div class="fr-viz" id="fr-transit">
  <h3>Watch a transit, then try to see the atmosphere</h3>
  <p class="fr-viz-intro">Press play and watch K2-18 b cross its star. The top plot builds the light curve as the planet moves, using the radius ratio from Step 1. Then raise the atmosphere height: the dashed curve for the planet with an atmosphere sits right on top of the plain one, and the bottom plot magnifies the difference so you can see how tiny the signal really is. Switch to a water-rich atmosphere to watch it shrink.</p>
  <p class="fr-viz-status">Loading the interactive figure (needs JavaScript)...</p>
  <div class="fr-viz-controls"></div>
  <div class="fr-viz-plot"></div>
  <div class="fr-viz-readout" aria-live="polite"></div>
  <p class="fr-viz-caption">Interactive. Uses the planet and star radii from Benneke et al. (2019) and a scale height computed for 255 K. The star is a uniform disc (no limb darkening), the atmosphere is treated as a perfectly opaque ring, and the impact parameter is illustrative, so this shows the geometry of the signal, not the real K2-18 b data.<sup class="fr-ref"><a href="#ref-20">20</a><a href="#ref-5">5</a></sup></p>
</div>

<div class="fr-lab" id="fr-lab">
  <h3>Try it: the noise lab</h3>
  <p class="fr-lab-intro">A toy version of the K2-18 b problem. Dots are a simulated spectrum averaged over N transits, with error bars. The purple line is the best-fitting absorption feature among M candidate positions. Start with <strong>pure noise</strong> and 10 candidates, then add transits.</p>
  <div class="fr-lab-controls">
    <fieldset class="fr-lab-truth-set">
      <legend>What is really there?</legend>
      <label><input type="radio" name="fr-lab-truth" value="noise" checked> Pure noise, no molecule</label>
      <label><input type="radio" name="fr-lab-truth" value="real"> A real molecule</label>
    </fieldset>
    <label class="fr-lab-slider"><span>Real feature strength <output id="fr-lab-amp-out"></output></span><input type="range" id="fr-lab-amp" min="0" max="200" step="10" value="80"></label>
    <label class="fr-lab-slider"><span>Transits observed, N <output id="fr-lab-n-out"></output></span><input type="range" id="fr-lab-n" min="1" max="100" step="1" value="4"></label>
    <label class="fr-lab-slider"><span>Candidate molecules tested, M <output id="fr-lab-m-out"></output></span><input type="range" id="fr-lab-m" min="1" max="20" step="1" value="10"></label>
    <div class="fr-lab-buttons">
      <button type="button" id="fr-lab-redraw" class="fr-lab-btn">New noise draw</button>
      <button type="button" id="fr-lab-mc" class="fr-lab-btn">Run 2,000 noise-only trials</button>
    </div>
  </div>
  <svg id="fr-lab-plot" class="fr-lab-plot" viewBox="0 0 640 300" role="img" aria-label="Simulated transmission spectrum with error bars and the best-fitting absorption feature"></svg>
  <div id="fr-lab-readout" class="fr-lab-readout" aria-live="polite"></div>
  <p id="fr-lab-mc-out" class="fr-lab-mc-out" aria-live="polite"></p>
  <p class="fr-lab-note">Toy model: Gaussian white noise and a single Gaussian-shaped feature, with made-up units for noise per transit. It shows the statistical logic, not the real K2-18 b data, and real retrievals fit physical atmosphere models with many more parameters.</p>
</div>

<div class="fr-callout fr-callout-twist">
  <h3>The plot twist: DMS on a dead comet</h3>
  <p>{{< term "rosetta" >}}Rosetta{{< /term >}}'s ROSINA mass spectrometer had already seen DMS in the gas around {{< term "comet-67p" >}}comet 67P{{< /term >}}, a frozen, lifeless body, at about 0.13% of the methanol abundance. DMS has also been reported in interstellar space. Whatever makes it there is not marine phytoplankton, which weakens DMS as a standalone biosignature.<sup class="fr-ref"><a href="#ref-8">8</a></sup></p>
</div>

The debate has now moved to more basic ground. A 2026 paper lays out three outstanding physical questions for K2-18 b and similar temperate sub-Neptunes, a reminder that before a biosignature can be interpreted, we need to agree on what kind of planet we are looking at.<sup class="fr-ref"><a href="#ref-9">9</a></sup>

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="2 out of 5"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span><span class="fr-meter-note">Near the noise floor; results depend on reduction choices</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Bearing on life</span><span class="fr-bar" role="img" aria-label="1 out of 5"><i class="on"></i><i></i><i></i><i></i><i></i></span><span class="fr-meter-note">No significant detection; abiotic sources exist</span></div>
</div>

<p class="fr-label">The biology underneath</p>

The DMSP to DMS pathway is a small piece of marine microbial ecology with planetary consequences: it links phytoplankton physiology to atmospheric sulfur on Earth. Use it to practise a skill that ecology questions test constantly: a molecule's biological source on Earth does not make it a unique marker anywhere else. This story is also the cleanest case study of statistical thinking in the sciences: model selection, multiple comparisons and why "a 3 sigma hint" and "a discovery" are different things.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/8-ecology" label="Ecology" why="a molecule's source is not a unique marker" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: use the noise lab to test your intuition</summary>
<div>
<p>Set the lab to pure noise with M = 1 and run the 2,000 trials. Predict the hit rate for M = 10 and for M = 20, then check. Why is the simulated number for M = 20 a little lower than the formula's 2.7%?</p>
<p>Next, leave pure noise on with M = 10 and drag N from 4 up to 100. Now switch to "a real molecule" and do the same. What does each case do to the significance, and what would you tell a journalist about a 3 sigma result from a single observation?</p>
</div>
</details>

</div>

<div class="fr-story fr-story-ocean">

<div class="fr-story-head">
  <span class="fr-story-num">3</span>
  <span class="fr-tag">🧊 Ocean world &middot; Cassini archive</span>
</div>

## Enceladus, minutes fresh

<p class="fr-label">The claim</p>

Saturn's moon {{< term "enceladus" >}}Enceladus{{< /term >}} hides a global ocean beneath its ice and vents it into space through cracks near its south pole. In 2025, a *Nature Astronomy* paper reported organic compounds in ice grains that were only minutes old when {{< term "cassini" >}}Cassini{{< /term >}}'s instrument sampled them, showing that the organics come from the ocean itself and not from years of space weathering.<sup class="fr-ref"><a href="#ref-10">10</a><a href="#ref-11">11</a></sup>

<figure class="fr-fig fr-fig-wide">
  <img src="/horizon/astrobio/cassiniviews.webp" alt="Four-panel figure: a black-and-white image of icy jets rising from Enceladus, Enceladus and Tethys beside a faint ring, a fractured grey surface with a zoomed inset, and an orange-and-yellow map over the south polar region" width="515" height="388" loading="lazy">
  <figcaption><strong>Fig. 5.</strong> Cassini views of Enceladus: (a) the water-ice plumes at the south pole, (b) Enceladus and Tethys against the faint E ring, (c) fractured terrain with an enlarged inset, and (d) a colour-scaled map of the south polar region with a 50 km scale bar. <span class="fr-credit">Composite figure built from Cassini data, via ResearchGate. <a href="https://www.researchgate.net/figure/Cassini-views-of-Enceladus-a-ISS-image-of-the-water-ice-plumes-at-Enceladuss-South_fig6_352931759">Source</a></span></figcaption>
</figure>

<p class="fr-label">How they did it</p>

Cassini's {{< term "cda" >}}Cosmic Dust Analyzer{{< /term >}} (CDA) is a mass spectrometer. It works in three steps:

1. A grain hits a metal target at high speed.
2. The grain vaporises and ionises.
3. The ions are sorted by mass.

Data from a 2008 flyby, when the spacecraft hit the plume at nearly 18 km/s, were re-examined years later. Grains in Saturn's E ring can persist for hundreds of years and are altered by radiation, so earlier organics detections could not be pinned to the ocean. These grains had been ejected only minutes before.<sup class="fr-ref"><a href="#ref-10">10</a><a href="#ref-11">11</a></sup>

<figure class="fr-fig fr-fig-tall">
  <img src="/horizon/astrobio/cassinicosmicdust.webp" alt="Graphic of the Cassini spacecraft near Saturn with an enlarged photo of its Cosmic Dust Analyser and a circular inset of a grain labelled about 10 micrometres" width="357" height="560" loading="lazy">
  <figcaption><strong>Fig. 6.</strong> Cassini's Cosmic Dust Analyser (enlarged), the instrument that sampled the plume grains. The circular inset is labelled about 10 micrometres. <span class="fr-credit">Graphic: ESA. <a href="https://www.esa.int/ESA_Multimedia/Images/2016/04/Cassini_Cosmic_Dust_Analyser">Source</a></span></figcaption>
</figure>

<p class="fr-label">Why speed matters</p>

Impact speed is a design choice with chemical consequences. At lower speeds the ice grain shatters into clusters of water molecules whose signal can mask the organic signal; at nearly 18 km/s the fragmentation is different and previously hidden molecular fragments become visible.<sup class="fr-ref"><a href="#ref-11">11</a></sup>

<div class="fr-callout">
  <h3>Do the maths: why 18 km/s?</h3>
  <p>A water molecule has a mass of 18 u, or 2.99 × 10⁻²⁶ kg. Its kinetic energy at speed v is ½mv². At 18 km/s that is 4.8 × 10⁻¹⁸ J, about <strong>30 eV</strong>. At 6 km/s it is only about 3.4 eV, because energy scales as v²: triple the speed, nine times the energy. Typical covalent bonds take 3 to 5 eV to break. So an 18 km/s impact carries far more energy per molecule than the bonds can hold, vaporising the grain and ionising the fragments, while a slow impact barely breaks anything. (This is an upper bound, since the energy is shared with the target and neighbouring molecules.)</p>
  <p>The ions are then sorted by {{< term "time-of-flight" >}}time of flight{{< /term >}}. An ion of mass m and charge z accelerated through a potential V over a drift length L arrives after</p>
  $$ t = L \sqrt{\frac{m}{2 z e V}} $$
  <p>so t² is proportional to m/z, and the spectrum is a histogram of arrival times converted into mass.</p>
</div>

<p class="fr-label">The numbers</p>

The spectra reveal fragments diagnostic of these compound types, including fragments not seen before:

- aliphatic compounds
- (hetero)cyclic esters and alkenes
- ethers
- tentatively, nitrogen- and oxygen-bearing compounds

The authors read this as hinting at a hydrothermal origin and at geochemical pathways that build and modify organics.<sup class="fr-ref"><a href="#ref-10">10</a></sup> That fits earlier Cassini work that found molecular hydrogen in the plume, evidence of hydrothermal chemistry that could in principle feed methane-producing microbes.<sup class="fr-ref"><a href="#ref-12">12</a></sup>

<p class="fr-label">Where it is contested</p>

Read the claim carefully: organics are not life. ESA's coverage stresses that the right ingredients being present does not show that biological processes are happening, and that much more remains in the data than has been analysed.<sup class="fr-ref"><a href="#ref-11">11</a></sup> Fresh sampling gets you around contamination and radiation damage, but not around the abiotic-chemistry question.

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="4 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i></i></span><span class="fr-meter-note">Direct sampling; some assignments only tentative</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Bearing on life</span><span class="fr-bar" role="img" aria-label="3 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i></i><i></i></span><span class="fr-meter-note">Habitable chemistry, no sign of organisms</span></div>
</div>

<p class="fr-label">The biology underneath</p>

{{< term "hydrothermal-vent" >}}Hydrothermal vents{{< /term >}} are one of the leading settings for the origin of life and a home for {{< term "chemolithoautotroph" >}}chemolithoautotrophs{{< /term >}}, organisms that get energy from inorganic chemistry and fix carbon without sunlight. The textbook example is {{< term "methanogenesis" >}}methanogenesis{{< /term >}}, CO<sub>2</sub> + 4 H<sub>2</sub> &rarr; CH<sub>4</sub> + 2 H<sub>2</sub>O, which is exactly the kind of metabolism that hydrogen in the plume would make possible. Compare this with the electron-acceptor ladder from Story 1: different planet, same energetic logic.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/15-evolution/history-of-life-origin-and-major-transitions" label="History of Life: Origin and Major Transitions" why="vents and the origin of life" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: design the next flyby</summary>
<div>
<p>Cassini's instrument was built in the 1990s and was never designed to look for life. If you could design a successor, what would you measure to tell biological organics from abiotic ones? Think about patterns rather than single molecules: the relative abundance of amino acids of different chain lengths, for instance, or whether the same handedness dominates.</p>
</div>
</details>

</div>

<div class="fr-story fr-story-rock">

<div class="fr-story-head">
  <span class="fr-story-num">4</span>
  <span class="fr-tag">☄️ Asteroid &middot; OSIRIS-REx samples</span>
</div>

## A sugar-coated asteroid

<p class="fr-label">The claim</p>

NASA's {{< term "osiris-rex" >}}OSIRIS-REx{{< /term >}} mission returned material from the asteroid {{< term "bennu" >}}Bennu{{< /term >}} to Earth in late 2023. Over 2025, laboratory analyses of that pristine material showed that an ordinary-looking carbon-rich rock contains many of the molecules biology is built from.<sup class="fr-ref"><a href="#ref-13">13</a></sup>

<figure class="fr-fig fr-fig-narrow">
  <img src="/horizon/astrobio/nasabennu.webp" alt="Black-and-white mosaic of the rubble-covered, diamond-shaped asteroid Bennu against black space" width="640" height="480" loading="lazy">
  <figcaption><strong>Fig. 7.</strong> Bennu, the carbon-rich asteroid visited by OSIRIS-REx, in a mosaic of the mission's images. <span class="fr-credit">Image: NASA/Goddard/University of Arizona. <a href="https://science.nasa.gov/mission/osiris-rex/">Source</a></span></figcaption>
</figure>

<p class="fr-label">The numbers</p>

- **Amino acids and nucleobases (January 2025, *Nature Astronomy*):** 14 of the 20 amino acids used in terrestrial proteins, and all five {{< term "nucleobase" >}}nucleobases{{< /term >}} used in DNA and RNA (adenine, guanine, cytosine, thymine and uracil).<sup class="fr-ref"><a href="#ref-13">13</a></sup>
- **Salts (January 2025, *Nature*):** an {{< term "evaporite" >}}evaporite{{< /term >}} sequence, minerals left behind as a sodium-rich brine dried out inside Bennu's parent body, in a phyllosilicate-rich (clay-like) host rock. That makes a wet, salty, chemically interesting environment, as in a drying pond.<sup class="fr-ref"><a href="#ref-14">14</a></sup>
- **Sugars (December 2025, *Nature Geoscience*):** ribose, the five-carbon sugar of RNA, and glucose, which is the first time glucose has been found in an extraterrestrial sample. Deoxyribose, the sugar of DNA, was not found. The sugars likely formed in brines containing formaldehyde.<sup class="fr-ref"><a href="#ref-15">15</a></sup>
- **Isotopes (2026, *PNAS*):** carbon and nitrogen isotope data in the Bennu amino acids point to multiple formation pathways in the early Solar System, not a single recipe.<sup class="fr-ref"><a href="#ref-16">16</a></sup>

Combine the findings and all the components needed to build RNA (nucleobases, ribose and phosphate) are now documented in material that formed before life on Earth existed.<sup class="fr-ref"><a href="#ref-15">15</a></sup>

<figure class="fr-fig fr-fig-tall">
  <img src="/horizon/astrobio/bioessential.webp" alt="NASA infographic titled Bio-essential sugars ribose and glucose in samples from asteroid Bennu, showing chemical structures of the RNA nucleobases, ribose, phosphate and glucose" width="387" height="516" loading="lazy">
  <figcaption><strong>Fig. 8.</strong> NASA's graphic summarising the sugar discovery: the molecular components of RNA found in Bennu samples (nucleobases, ribose and phosphate) alongside glucose. <span class="fr-credit">Graphic: NASA Scientific Visualization Studio. <a href="https://svs.gsfc.nasa.gov/14932/">Source</a></span></figcaption>
</figure>

<div class="fr-callout fr-callout-twist">
  <h3>The detail that matters most: handedness</h3>
  <p>Life on Earth builds proteins almost exclusively from L-amino acids. Bennu's amino acids came as roughly equal mixtures of left-handed and right-handed forms.<sup class="fr-ref"><a href="#ref-13">13</a></sup> That is what you would expect from chemistry alone, and it is a sharp reminder of why {{< term "homochirality" >}}homochirality{{< /term >}} is considered such a strong biosignature: the ingredients can be made without life, but the strong preference for one hand is the part that biology adds.</p>
</div>

<p class="fr-label">Where it is contested</p>

Almost nowhere, and that is the point of this story. These are laboratory measurements on returned material, made by several independent teams. The open questions are about interpretation: did such asteroids seed early Earth, and how much did that matter compared with chemistry made on Earth itself? Notice also that finding ingredients says nothing on its own about how they became cells.

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="5 out of 5"><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i><i class="on"></i></span><span class="fr-meter-note">Direct lab measurement on returned samples</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Bearing on life</span><span class="fr-bar" role="img" aria-label="2 out of 5"><i class="on"></i><i class="on"></i><i></i><i></i><i></i></span><span class="fr-meter-note">Prebiotic ingredients, not life</span></div>
</div>

<p class="fr-label">The biology underneath</p>

This story is a tour of the central molecules of the course: {{< term "amino-acids" >}}amino acids and protein chemistry{{< /term >}}, {{< term "nucleic-acids" >}}nucleotides and nucleic acids{{< /term >}} and {{< term "carbohydrates" >}}carbohydrate chemistry{{< /term >}}. The missing deoxyribose is also a nice argument for the {{< term "rna-world" >}}RNA-world hypothesis{{< /term >}}, in which RNA preceded DNA: the sugar RNA needs was easy to make on an asteroid, and the one DNA needs was not found.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/1-cell-molecular/amino-acids-protein-chemistry" label="Amino Acids and Protein Chemistry" why="the protein building blocks" >}}
{{< notebtn path="/resources/1-cell-molecular/nucleotide-nucleic-acid-chemistry" label="Nucleotides and Nucleic Acids" why="nucleobases, ribose and RNA" >}}
{{< notebtn path="/resources/1-cell-molecular/carbohydrate-chemistry-biology" label="Carbohydrate Chemistry" why="ribose and glucose" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: why not just trust the sample?</summary>
<div>
<p>Amino acids are everywhere on Earth, including on fingerprints and in lab air. If you were running the lab, how would you convince a sceptical reviewer that the amino acids in a Bennu sample did not come from Earth? Think about isotope ratios, handedness, and comparing against a control sample exposed to the same handling.</p>
</div>
</details>

</div>

<div class="fr-story fr-story-idea">

<div class="fr-story-head">
  <span class="fr-story-num">5</span>
  <span class="fr-tag">🧠 Method &middot; Theory</span>
</div>

## What if life is a pattern, not a molecule?

<p class="fr-label">The idea</p>

Every story so far hunts for a particular molecule or mineral, which quietly assumes alien life uses familiar chemistry. In April 2026 a paper in *The Astrophysical Journal* proposed an **agnostic biosignature** that assumes nothing about biochemistry or even about what counts as habitable.<sup class="fr-ref"><a href="#ref-17">17</a></sup>

<figure class="fr-fig fr-fig-narrow">
  <img src="/horizon/astrobio/elsi.webp" alt="Glass entrance with the Earth-Life Science Institute logo and name, framed by pale cherry blossoms" width="602" height="510" loading="lazy">
  <figcaption><strong>Fig. 9.</strong> The Earth-Life Science Institute (ELSI) at the Institute of Science Tokyo, one of the institutions behind the study. <span class="fr-credit">Photo: ELSI. <a href="https://www.elsi.jp/en/news_events/news/2025/elsi_welcomes_new_students/">Source</a></span></figcaption>
</figure>

<p class="fr-label">How it works</p>

The authors start with only two assumptions:

- life can spread between planets ({{< term "panspermia" >}}panspermia{{< /term >}}, in a broad sense)
- life can change the environment of a planet it lands on ({{< term "terraforming" >}}terraforming{{< /term >}}, in the same broad sense)

They built an {{< term "agent-based-model" >}}agent-based simulation{{< /term >}} of a population of planets. If both are true, life leaves a statistical fingerprint across the population: planets that share certain observable properties end up clustered in space, in a pattern that non-living processes would not produce. A {{< term "cluster-analysis" >}}clustering analysis{{< /term >}} can then pick out groups of planets that probably host life, without identifying a biosignature on any single world.<sup class="fr-ref"><a href="#ref-17">17</a></sup>

<p class="fr-label">Where the computer comes in</p>

In this story the computer is the experiment. There is no telescope data at all. The authors:

1. simulate many populations of planets in which life spreads and modifies its surroundings
2. run a clustering analysis on the results
3. measure how often it picks out the right planets and how often it raises a false alarm

That last step is the same logic as the noise lab in Story 2: before you trust a detection method on real data, run it on simulated data where you know the answer, including simulations with no life at all.

<p class="fr-label">The limits</p>

The method is deliberately conservative: it favours few false positives over finding every inhabited planet. And it has only been shown in simulation. The authors say future work must use more realistic planetary data and galactic dynamics.<sup class="fr-ref"><a href="#ref-17">17</a></sup> Think of it as a proposal for what to do with big exoplanet surveys later, not a result.

<div class="fr-meters">
  <div class="fr-meter"><span class="fr-meter-label">Data robustness</span><span class="fr-bar" role="img" aria-label="1 out of 5"><i class="on"></i><i></i><i></i><i></i><i></i></span><span class="fr-meter-note">Simulation only, no real planetary data yet</span></div>
  <div class="fr-meter"><span class="fr-meter-label">Bearing on life</span><span class="fr-bar" role="img" aria-label="0 out of 5"><i></i><i></i><i></i><i></i><i></i></span><span class="fr-meter-note">A method, not a detection</span></div>
</div>

<p class="fr-label">The biology underneath</p>

This is ecology and evolution at a cosmic scale: dispersal, colonisation and niche construction (organisms modifying their own environment) applied to planets instead of islands. If you have studied {{< term "biogeography" >}}biogeography{{< /term >}}, you already know the logic: the distribution of traits across space carries information about the processes that produced it.

<div class="fr-notes">
<span class="fr-notes-label">Connect to your notes</span>
{{< notebtn path="/resources/8-ecology" label="Ecology" why="dispersal, colonisation and niche construction" >}}
</div>

<details class="fr-think">
<summary>Think like a researcher: where could this go wrong?</summary>
<div>
<p>The method treats a clustering of similar planets as evidence for spreading life. Name two non-living reasons planets near each other might look alike (for instance, forming from the same cloud of gas, or being irradiated by the same star). How would you control for them?</p>
</div>
</details>

</div>

## What happens next

<div class="fr-timeline">
  <div class="fr-tl-item"><span class="fr-tl-date">3 Dec 2026</span><p><strong>{{< term "europa-clipper" >}}Europa Clipper{{< /term >}}</strong> swings past Earth for a gravity assist on its way to Jupiter's ocean moon.<sup class="fr-ref"><a href="#ref-19">19</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">2028</span><p><strong>{{< term "dragonfly" >}}Dragonfly{{< /term >}}</strong>, a rotorcraft for Saturn's moon Titan, is currently scheduled to launch in July 2028. China's <strong>{{< term "tianwen-3" >}}Tianwen-3{{< /term >}}</strong> Mars sample-return mission is planned for 2028 as well.<sup class="fr-ref"><a href="#ref-3">3</a><a href="#ref-19">19</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">April 2030</span><p><strong>Europa Clipper</strong> arrives at Jupiter to begin flybys of Europa.<sup class="fr-ref"><a href="#ref-19">19</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">2040s</span><p>The <strong>{{< term "hwo" >}}Habitable Worlds Observatory{{< /term >}}</strong> is planned to give far higher-resolution spectra and direct imaging of temperate planets.<sup class="fr-ref"><a href="#ref-7">7</a></sup></p></div>
  <div class="fr-tl-item"><span class="fr-tl-date">Unscheduled</span><p><strong>{{< term "msr" >}}Mars Sample Return{{< /term >}}</strong> remains the single most useful test of the Cheyava Falls claim, but its future is uncertain under budget pressure.<sup class="fr-ref"><a href="#ref-3">3</a></sup></p></div>
</div>

## Where this meets your syllabus

<div class="fr-table-wrap">
<table class="fr-table">
<thead><tr><th>Story</th><th>Concepts you can practise with it</th><th>Study next</th></tr></thead>
<tbody>
<tr><td>1. Mars</td><td>Anaerobic respiration, electron donors and acceptors, redox energetics</td><td>{{< notebtn path="/resources/1-cell-molecular/bioenergetics-central-metabolism" label="Bioenergetics and Central Metabolism" compact=true >}}</td></tr>
<tr><td>2. K2-18 b</td><td>Marine microbial ecology, abiotic false positives, hypothesis testing, significance and multiple comparisons</td><td>{{< notebtn path="/resources/8-ecology" label="Ecology" compact=true >}} plus the noise lab above</td></tr>
<tr><td>3. Enceladus</td><td>Chemolithoautotrophy, methanogenesis, hydrothermal vents and origin-of-life settings</td><td>{{< notebtn path="/resources/15-evolution/history-of-life-origin-and-major-transitions" label="History of Life" compact=true >}}</td></tr>
<tr><td>4. Bennu</td><td>Amino acids, chirality and homochirality, nucleobases and sugars, RNA world</td><td>{{< notebtn path="/resources/1-cell-molecular/amino-acids-protein-chemistry" label="Amino Acids" compact=true >}}{{< notebtn path="/resources/1-cell-molecular/nucleotide-nucleic-acid-chemistry" label="Nucleic Acids" compact=true >}}</td></tr>
<tr><td>5. Agnostic biosignature</td><td>Dispersal, colonisation, niche construction, spatial patterns</td><td>{{< notebtn path="/resources/8-ecology" label="Ecology" compact=true >}}</td></tr>
</tbody>
</table>
</div>

## Glossary

{{< faq-item q="Biosignature" >}}
Any measurable feature (a molecule, a mineral pattern, an isotope ratio, a spatial pattern) that provides evidence for past or present life. A biosignature is evidence, not proof, because most can in principle be produced without life.
{{< /faq-item >}}

{{< faq-item q="Abiotic" >}}
Not involving living organisms. An abiotic false positive is a signal that looks biological but has a non-living explanation.
{{< /faq-item >}}

{{< faq-item q="Transmission spectrum" >}}
The pattern of how much starlight a planet's atmosphere blocks at each wavelength as the planet crosses its star. Molecules absorb specific wavelengths, so the pattern reveals which gases are present.
{{< /faq-item >}}

{{< faq-item q="Hycean world" >}}
A hypothesised type of planet with a liquid-water ocean beneath a hydrogen-rich atmosphere. Whether K2-18 b is one is itself debated.
{{< /faq-item >}}

{{< faq-item q="Redox reaction" >}}
A reaction in which electrons move from one substance (oxidised) to another (reduced). Cells harvest energy by moving electrons through carefully ordered chains of such reactions.
{{< /faq-item >}}

{{< faq-item q="Homochirality" >}}
The preference of life for just one of two mirror-image forms of a molecule, for example L-amino acids in proteins. Chemistry without life normally produces equal mixtures.
{{< /faq-item >}}

{{< faq-item q="Panspermia" >}}
The idea that life, or its precursors, can travel between planets or star systems, for example inside rocks or dust.
{{< /faq-item >}}

## Sources

<ol class="fr-refs">
  <li id="ref-1">Hurowitz, J. A., Tice, M. M., Allwood, A. C. et al. Redox-driven mineral and organic associations in Jezero Crater, Mars. <em>Nature</em> 645, 332 to 340 (2025). <a href="https://www.nature.com/articles/s41586-025-09413-0">doi:10.1038/s41586-025-09413-0</a></li>
  <li id="ref-2">NASA/JPL. NASA Says Mars Rover Discovered Potential Biosignature Last Year. <a href="https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/">jpl.nasa.gov</a></li>
  <li id="ref-3">The Planetary Society. Our best proof of life on Mars yet? A deep dive into Cheyava Falls. <a href="https://www.planetary.org/articles/our-best-proof-of-life-on-mars-yet-a-deep-dive-into-cheyava-falls">planetary.org</a></li>
  <li id="ref-4">Madhusudhan, N. et al. New Constraints on DMS and DMDS in the Atmosphere of K2-18 b from JWST MIRI (2025). <a href="https://arxiv.org/abs/2504.12267">arXiv:2504.12267</a></li>
  <li id="ref-5">Luque, R. et al. Insufficient evidence for DMS and DMDS in the atmosphere of K2-18 b: from a joint analysis of JWST NIRISS, NIRSpec, and MIRI observations. <em>Astronomy &amp; Astrophysics</em> (Letter, 2025). <a href="https://arxiv.org/abs/2505.13407">arXiv:2505.13407</a></li>
  <li id="ref-6">K2-18b Does Not Meet the Standards of Evidence for Life. <em>The Astronomical Journal</em> (2025). <a href="https://iopscience.iop.org/article/10.3847/1538-3881/ae0338">doi:10.3847/1538-3881/ae0338</a></li>
  <li id="ref-7">Astronomy magazine. Signs of life on K2-18 b revisited in new NASA study (July 2025). <a href="https://www.astronomy.com/science/new-study-revisits-signs-of-life-on-k2-18-b/">astronomy.com</a></li>
  <li id="ref-8">Evidence for Abiotic Dimethyl Sulfide in Cometary Matter (2024). <a href="https://arxiv.org/abs/2410.08724">arXiv:2410.08724</a>. See also: On the abiotic origin of dimethyl sulfide: discovery of DMS in the Interstellar Medium. <a href="https://arxiv.org/abs/2501.08892">arXiv:2501.08892</a></li>
  <li id="ref-9">Tsai, S.-M. et al. Three Outstanding Physical Questions for K2-18 b and other Temperate Sub-Neptunes (2026). <a href="https://arxiv.org/abs/2603.19803">arXiv:2603.19803</a></li>
  <li id="ref-10">Khawaja, N. et al. Detection of organic compounds in freshly ejected ice grains from Enceladus's ocean. <em>Nature Astronomy</em> (2025). <a href="https://www.nature.com/articles/s41550-025-02655-y">doi:10.1038/s41550-025-02655-y</a></li>
  <li id="ref-11">ESA. Cassini proves complex chemistry in Enceladus ocean. <a href="https://www.esa.int/Science_Exploration/Space_Science/Cassini-Huygens/Cassini_proves_complex_chemistry_in_Enceladus_ocean">esa.int</a></li>
  <li id="ref-12">Waite, J. H. et al. Cassini finds molecular hydrogen in the Enceladus plume: evidence for hydrothermal processes. <em>Science</em> 356, 155 to 159 (2017).</li>
  <li id="ref-13">Glavin, D. P., Dworkin, J. P. et al. Abundant ammonia and nitrogen-rich soluble organic matter in samples from asteroid (101955) Bennu. <em>Nature Astronomy</em> (2025). <a href="https://doi.org/10.1038/s41550-024-02472-9">doi:10.1038/s41550-024-02472-9</a></li>
  <li id="ref-14">An evaporite sequence from ancient brine recorded in Bennu samples. <em>Nature</em> 637, 1072 to 1077 (2025). <a href="https://www.nature.com/articles/s41586-024-08495-6">doi:10.1038/s41586-024-08495-6</a></li>
  <li id="ref-15">Bio-essential sugars in samples from asteroid Bennu. <em>Nature Geoscience</em> (2025). <a href="https://www.nature.com/articles/s41561-025-01838-6">doi:10.1038/s41561-025-01838-6</a>. Coverage: <a href="https://phys.org/news/2025-12-sugars-gum-stardust-nasa-asteroid.html">phys.org</a></li>
  <li id="ref-16">Multiple formation pathways for amino acids in the early Solar System based on carbon and nitrogen isotopes in asteroid Bennu samples. <em>PNAS</em> (2026). <a href="https://www.pnas.org/doi/10.1073/pnas.2517723123">doi:10.1073/pnas.2517723123</a></li>
  <li id="ref-17">Smith, H. B. &amp; Sinapayen, L. An Agnostic Biosignature Based on Modeling Panspermia and Terraforming. <em>The Astrophysical Journal</em> 1001 (2026). <a href="https://iopscience.iop.org/article/10.3847/1538-4357/ae4ee3">doi:10.3847/1538-4357/ae4ee3</a></li>
  <li id="ref-18">Green, J. et al. Call for a framework for reporting evidence for life beyond Earth. <em>Nature</em> 598 (2021).</li>
  <li id="ref-19">NASA. Europa Clipper mission overview. <a href="https://europa.nasa.gov/spacecraft/meet-europa-clipper/">europa.nasa.gov</a></li>
  <li id="ref-20">Benneke, B. et al. Water Vapor and Clouds on the Habitable-Zone Sub-Neptune Exoplanet K2-18b (2019). <a href="https://arxiv.org/abs/1909.04642">arXiv:1909.04642</a>. Planet and star parameters used in Story 2: R<sub>p</sub> = 2.610 R⊕, M = 8.63 M⊕, R<sub>s</sub> = 0.4445 R☉.</li>
</ol>

<div class="fr-footer-note">
  <p>Images remain the property of the agencies and institutions credited in each caption. Status and schedule details were last checked on 4 October 2026 and will age; spotted something out of date or wrong? Email <a href="mailto:resourcerepository4boguide@gmail.com">resourcerepository4boguide@gmail.com</a>.</p>
</div>

</div>
