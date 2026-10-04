(function () {
  'use strict';

  var NBINS = 60;
  var WIDTH = 1.6;
  var SIGMA_PER_TRANSIT = 200;
  var TRUE_CENTRE = 30;
  var MAX_TRANSITS = 100;
  var MC_TRIALS = 2000;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function mulberry32(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gaussian(rand) {
    var u = 0;
    while (u === 0) u = rand();
    var v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  function erfc(x) {
    var z = Math.abs(x);
    var t = 1 / (1 + 0.5 * z);
    var ans = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 +
      t * (0.09678418 + t * (-0.18628806 + t * (0.27886807 + t * (-1.13520398 +
      t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? ans : 2 - ans;
  }

  function tailP(s) {
    return 0.5 * erfc(s / Math.SQRT2);
  }

  function sigmaFromP(p) {
    if (p >= 0.5) return 0;
    var lo = 0;
    var hi = 40;
    for (var i = 0; i < 80; i++) {
      var mid = (lo + hi) / 2;
      if (tailP(mid) > p) lo = mid; else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function globalP(p, m) {
    return -Math.expm1(m * Math.log1p(-p));
  }

  function template(centre) {
    var t = new Array(NBINS);
    for (var i = 0; i < NBINS; i++) {
      var d = i - centre;
      t[i] = Math.exp(-(d * d) / (2 * WIDTH * WIDTH));
    }
    return t;
  }

  function centresFor(m) {
    if (m <= 1) return [TRUE_CENTRE];
    var out = [];
    for (var j = 0; j < m; j++) out.push(3 + j * (NBINS - 7) / (m - 1));
    return out;
  }

  function sumSquares(t) {
    var s = 0;
    for (var i = 0; i < t.length; i++) s += t[i] * t[i];
    return s;
  }

  function fitTemplates(data, sigma, centres) {
    var best = null;
    for (var j = 0; j < centres.length; j++) {
      var t = template(centres[j]);
      var stt = sumSquares(t);
      var dot = 0;
      for (var i = 0; i < NBINS; i++) dot += data[i] * t[i];
      var amp = dot / stt;
      var ampErr = sigma / Math.sqrt(stt);
      var s = amp / ampErr;
      if (best === null || s > best.s) {
        best = { centre: centres[j], amp: amp, ampErr: ampErr, s: s, tpl: t };
      }
    }
    return best;
  }

  function noiseOnlyTrials(m, trials, rand) {
    var centres = centresFor(m);
    var tpls = centres.map(template);
    var norms = tpls.map(function (t) { return Math.sqrt(sumSquares(t)); });
    var hits = 0;
    for (var k = 0; k < trials; k++) {
      var z = new Array(NBINS);
      for (var i = 0; i < NBINS; i++) z[i] = gaussian(rand);
      var top = -Infinity;
      for (var j = 0; j < tpls.length; j++) {
        var dot = 0;
        for (var q = 0; q < NBINS; q++) dot += z[q] * tpls[j][q];
        var s = dot / norms[j];
        if (s > top) top = s;
      }
      if (top >= 3) hits++;
    }
    return hits / trials;
  }

  var root = document.getElementById('fr-lab');
  if (!root) return;

  var ampInput = document.getElementById('fr-lab-amp');
  var nInput = document.getElementById('fr-lab-n');
  var mInput = document.getElementById('fr-lab-m');
  var ampOut = document.getElementById('fr-lab-amp-out');
  var nOut = document.getElementById('fr-lab-n-out');
  var mOut = document.getElementById('fr-lab-m-out');
  var truthRadios = root.querySelectorAll('input[name="fr-lab-truth"]');
  var redrawBtn = document.getElementById('fr-lab-redraw');
  var mcBtn = document.getElementById('fr-lab-mc');
  var plot = document.getElementById('fr-lab-plot');
  var readout = document.getElementById('fr-lab-readout');
  var mcOut = document.getElementById('fr-lab-mc-out');

  var cumulative = [];

  function drawNoise(seed) {
    var rand = mulberry32(seed);
    cumulative = [];
    var running = new Array(NBINS);
    for (var i = 0; i < NBINS; i++) running[i] = 0;
    for (var k = 0; k < MAX_TRANSITS; k++) {
      for (var b = 0; b < NBINS; b++) running[b] += gaussian(rand);
      cumulative.push(running.slice());
    }
  }

  function truthIsReal() {
    for (var i = 0; i < truthRadios.length; i++) {
      if (truthRadios[i].checked) return truthRadios[i].value === 'real';
    }
    return false;
  }

  function wavelength(bin) {
    return 5 + (bin / (NBINS - 1)) * 7;
  }

  function fmtP(p) {
    if (p < 1e-6) return p.toExponential(1);
    if (p < 0.001) return p.toFixed(5);
    return p.toFixed(4);
  }

  function el(name, attrs, text) {
    var node = document.createElementNS(SVG_NS, name);
    for (var key in attrs) node.setAttribute(key, attrs[key]);
    if (text != null) node.textContent = text;
    return node;
  }

  function render() {
    var amp = Number(ampInput.value);
    var n = Number(nInput.value);
    var m = Number(mInput.value);
    var real = truthIsReal();
    ampOut.textContent = amp + ' ppm';
    nOut.textContent = n;
    mOut.textContent = m;
    ampInput.disabled = !real;

    var sigma = SIGMA_PER_TRANSIT / Math.sqrt(n);
    var trueTpl = template(TRUE_CENTRE);
    var data = new Array(NBINS);
    for (var i = 0; i < NBINS; i++) {
      var noise = SIGMA_PER_TRANSIT * cumulative[n - 1][i] / n;
      data[i] = (real ? amp * trueTpl[i] : 0) + noise;
    }

    var best = fitTemplates(data, sigma, centresFor(m));
    var fitCurve = best.tpl.map(function (v) { return v * best.amp; });

    var yMin = 0;
    var yMax = 0;
    for (var j = 0; j < NBINS; j++) {
      yMin = Math.min(yMin, data[j] - sigma, fitCurve[j]);
      yMax = Math.max(yMax, data[j] + sigma, fitCurve[j], real ? amp : 0);
    }
    var pad = (yMax - yMin) * 0.08;
    yMin -= pad;
    yMax += pad;

    var W = 640;
    var H = 300;
    var left = 58;
    var right = 14;
    var top = 14;
    var bottom = 40;
    function px(bin) { return left + (bin / (NBINS - 1)) * (W - left - right); }
    function py(v) { return top + (1 - (v - yMin) / (yMax - yMin)) * (H - top - bottom); }

    while (plot.firstChild) plot.removeChild(plot.firstChild);

    for (var w = 5; w <= 12; w++) {
      var xb = (w - 5) / 7 * (NBINS - 1);
      plot.appendChild(el('line', { x1: px(xb), x2: px(xb), y1: H - bottom, y2: H - bottom + 5, 'class': 'fr-lab-axis' }));
      plot.appendChild(el('text', { x: px(xb), y: H - bottom + 18, 'text-anchor': 'middle', 'class': 'fr-lab-text' }, w));
    }
    plot.appendChild(el('text', { x: (left + W - right) / 2, y: H - 6, 'text-anchor': 'middle', 'class': 'fr-lab-text' }, 'Wavelength (micrometres, toy axis)'));

    var span = yMax - yMin;
    var step = Math.pow(10, Math.floor(Math.log10(span / 4)));
    var mult = [1, 2, 5, 10].filter(function (c) { return span / (step * c) <= 6; })[0] || 10;
    step *= mult;
    for (var v = Math.ceil(yMin / step) * step; v <= yMax; v += step) {
      plot.appendChild(el('line', { x1: left, x2: W - right, y1: py(v), y2: py(v), 'class': Math.abs(v) < 1e-9 ? 'fr-lab-zero' : 'fr-lab-grid' }));
      plot.appendChild(el('text', { x: left - 6, y: py(v) + 4, 'text-anchor': 'end', 'class': 'fr-lab-text' }, Math.round(v)));
    }
    var yLabel = el('text', { x: 14, y: (top + H - bottom) / 2, 'text-anchor': 'middle', 'class': 'fr-lab-text', transform: 'rotate(-90 14 ' + ((top + H - bottom) / 2) + ')' }, 'Transit depth change (ppm)');
    plot.appendChild(yLabel);

    if (real) {
      var truthPath = '';
      for (var a = 0; a < NBINS; a++) truthPath += (a === 0 ? 'M' : 'L') + px(a).toFixed(1) + ' ' + py(amp * trueTpl[a]).toFixed(1);
      plot.appendChild(el('path', { d: truthPath, 'class': 'fr-lab-truth' }));
    }
    for (var b = 0; b < NBINS; b++) {
      plot.appendChild(el('line', { x1: px(b), x2: px(b), y1: py(data[b] - sigma), y2: py(data[b] + sigma), 'class': 'fr-lab-err' }));
    }
    for (var c = 0; c < NBINS; c++) {
      plot.appendChild(el('circle', { cx: px(c), cy: py(data[c]), r: 2.6, 'class': 'fr-lab-pt' }));
    }
    var fitPath = '';
    for (var d = 0; d < NBINS; d++) fitPath += (d === 0 ? 'M' : 'L') + px(d).toFixed(1) + ' ' + py(fitCurve[d]).toFixed(1);
    plot.appendChild(el('path', { d: fitPath, 'class': 'fr-lab-fit' }));

    var s = best.s;
    var pLocal = tailP(s);
    var pGlobal = globalP(pLocal, m);
    var zGlobal = sigmaFromP(pGlobal);
    var zText = zGlobal >= 8 ? 'more than 8' : zGlobal.toFixed(1);
    var verdict;
    if (s <= 0) {
      verdict = 'No absorption feature found at all: the best fit is flat or negative.';
    } else if (zGlobal < 3) {
      verdict = 'Not significant. Noise this large shows up by chance about ' + (pGlobal * 100 < 0.1 ? 'less than 0.1' : (pGlobal * 100).toFixed(1)) + '% of the time when you test ' + m + ' candidate' + (m === 1 ? '' : 's') + '.';
    } else if (zGlobal < 5) {
      verdict = 'Tentative: the 3 to 5 sigma range researchers call evidence or a hint, below the 5 sigma bar for a discovery.';
    } else {
      verdict = 'Passes the 5 sigma convention for a statistical detection.';
    }
    var html = '<dl class="fr-lab-dl">' +
      '<div><dt>Best-fitting template</dt><dd>centred at ' + wavelength(best.centre).toFixed(1) + ' &micro;m, amplitude ' + best.amp.toFixed(0) + ' &plusmn; ' + best.ampErr.toFixed(0) + ' ppm</dd></div>' +
      '<div><dt>Local significance</dt><dd>' + s.toFixed(1) + ' sigma (one-sided p = ' + fmtP(pLocal) + ')</dd></div>' +
      '<div><dt>After ' + m + ' test' + (m === 1 ? '' : 's') + '</dt><dd>' + zText + ' sigma (p = ' + fmtP(pGlobal) + ')</dd></div>' +
      '</dl><p class="fr-lab-verdict">' + verdict + '</p>';
    if (real && s > 0.5 && s < 5) {
      var need = Math.ceil(n * Math.pow(5 / s, 2));
      html += '<p class="fr-lab-extra">If this signal is real and the noise is white, reaching 5 sigma locally takes about (5 / ' + s.toFixed(1) + ')&sup2; = ' + Math.pow(5 / s, 2).toFixed(1) + ' times the data: roughly ' + need + ' transits in total.</p>';
    }
    readout.innerHTML = html;
  }

  function runMonteCarlo() {
    var m = Number(mInput.value);
    var frac = noiseOnlyTrials(m, MC_TRIALS, mulberry32((Date.now() & 0xffffffff) >>> 0));
    var single = tailP(3);
    var independent = globalP(single, m);
    mcOut.textContent = 'In ' + MC_TRIALS.toLocaleString() + ' noise-only experiments testing ' + m + ' template' + (m === 1 ? '' : 's') + ', ' + (frac * 100).toFixed(1) + '% produced a 3 sigma or stronger feature somewhere. One test alone does so ' + (single * 100).toFixed(2) + '% of the time; ' + m + ' fully independent tests would do so ' + (independent * 100).toFixed(1) + '%. (Neighbouring templates overlap, which pulls the true rate slightly below that, and 2,000 trials leave a few tenths of a percent of random scatter, so press the button again to see it move.)';
  }

  var seed = 1276;
  drawNoise(seed);
  render();

  [ampInput, nInput, mInput].forEach(function (input) {
    input.addEventListener('input', function () {
      mcOut.textContent = '';
      render();
    });
  });
  for (var r = 0; r < truthRadios.length; r++) {
    truthRadios[r].addEventListener('change', render);
  }
  redrawBtn.addEventListener('click', function () {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    drawNoise(seed);
    mcOut.textContent = '';
    render();
  });
  mcBtn.addEventListener('click', runMonteCarlo);
})();
