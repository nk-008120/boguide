(function () {
  'use strict';

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var FLOOR = 0.0001;

  function budget(reach, uptake, escape) {
    var a = reach / 100;
    var b = uptake / 100;
    var c = escape / 100;
    return {
      afterReach: a,
      afterUptake: a * b,
      afterEscape: a * b * c,
      total: a * b * c
    };
  }

  function headroom(pct) {
    return 100 / pct;
  }

  function fromSlider(v) {
    return Math.pow(10, v / 1000);
  }

  function toSlider(pct) {
    return Math.round(Math.log10(pct) * 1000);
  }

  function fmtPct(frac) {
    var p = frac * 100;
    if (p >= 10) return p.toFixed(0) + '%';
    if (p >= 1) return p.toFixed(1) + '%';
    if (p >= 0.1) return p.toFixed(2) + '%';
    if (p >= 0.01) return p.toFixed(3) + '%';
    if (p >= 0.0001) return p.toFixed(4) + '%';
    return 'under 0.0001%';
  }

  function fmtSlider(pct) {
    if (pct >= 10) return pct.toFixed(0) + '%';
    if (pct >= 1) return pct.toFixed(1) + '%';
    return pct.toFixed(2) + '%';
  }

  function fmtTimes(x) {
    if (x >= 100) return Math.round(x).toLocaleString('en-US');
    if (x >= 10) return x.toFixed(0);
    return x.toFixed(1);
  }

  var PRESETS = {
    tumour: { reach: 0.7, uptake: 30, escape: 2 },
    better: { reach: 0.7, uptake: 30, escape: 8 }
  };

  var root = document.getElementById('fr-lab-budget');
  if (!root) return;

  var inputs = {
    reach: document.getElementById('fr-bud-reach'),
    uptake: document.getElementById('fr-bud-uptake'),
    escape: document.getElementById('fr-bud-escape')
  };
  var outs = {
    reach: document.getElementById('fr-bud-reach-out'),
    uptake: document.getElementById('fr-bud-uptake-out'),
    escape: document.getElementById('fr-bud-escape-out')
  };
  var plot = document.getElementById('fr-bud-plot');
  var readout = document.getElementById('fr-bud-readout');
  var presetButtons = root.querySelectorAll('[data-preset]');

  function el(name, attrs, text) {
    var node = document.createElementNS(SVG_NS, name);
    for (var key in attrs) node.setAttribute(key, attrs[key]);
    if (text != null) node.textContent = text;
    return node;
  }

  function values() {
    return {
      reach: fromSlider(Number(inputs.reach.value)),
      uptake: fromSlider(Number(inputs.uptake.value)),
      escape: fromSlider(Number(inputs.escape.value))
    };
  }

  function render() {
    var v = values();
    outs.reach.textContent = fmtSlider(v.reach);
    outs.uptake.textContent = fmtSlider(v.uptake);
    outs.escape.textContent = fmtSlider(v.escape);

    var r = budget(v.reach, v.uptake, v.escape);
    var rows = [
      { label: 'Injected dose', frac: 1 },
      { label: 'Reaches target tissue', frac: r.afterReach },
      { label: 'Taken up by target cells', frac: r.afterUptake },
      { label: 'Escapes the endosome', frac: r.afterEscape }
    ];

    var W = 640;
    var H = 230;
    var left = 190;
    var right = 70;
    var top = 14;
    var rowH = 40;
    var lo = Math.log10(FLOOR);
    var span = -lo;
    function px(frac) {
      var f = Math.max(frac, FLOOR);
      return left + ((Math.log10(f) - lo) / span) * (W - left - right);
    }

    while (plot.firstChild) plot.removeChild(plot.firstChild);

    [0.0001, 0.001, 0.01, 0.1, 1].forEach(function (g) {
      var x = px(g);
      plot.appendChild(el('line', { x1: x, x2: x, y1: top, y2: top + rowH * 4 + 4, 'class': 'fr-lab-grid' }));
      plot.appendChild(el('text', { x: x, y: top + rowH * 4 + 20, 'text-anchor': 'middle', 'class': 'fr-lab-text' }, g >= 1 ? '100%' : (g * 100) + '%'));
    });
    plot.appendChild(el('text', { x: (left + W - right) / 2, y: H - 4, 'text-anchor': 'middle', 'class': 'fr-lab-text' }, 'Share of the injected dose still in play (log scale)'));

    rows.forEach(function (row, i) {
      var y = top + i * rowH + 6;
      plot.appendChild(el('text', { x: left - 10, y: y + 17, 'text-anchor': 'end', 'class': 'fr-lab-text' }, row.label));
      var x0 = px(FLOOR);
      var x1 = px(row.frac);
      plot.appendChild(el('rect', { x: x0, y: y, width: Math.max(x1 - x0, 1), height: 26, rx: 4, 'class': i === 3 ? 'fr-lab-bar fr-lab-bar-final' : 'fr-lab-bar' }));
      plot.appendChild(el('text', { x: Math.min(x1 + 6, W - right + 4), y: y + 17, 'text-anchor': 'start', 'class': 'fr-lab-text' }, fmtPct(row.frac)));
    });

    var perHundredK = r.total * 100000;
    var needed = r.total > 0 ? 1 / r.total : Infinity;
    var stages = [
      { name: 'reaching the tissue', value: v.reach },
      { name: 'cell uptake', value: v.uptake },
      { name: 'endosomal escape', value: v.escape }
    ];
    var best = stages[0];
    stages.forEach(function (s) { if (s.value < best.value) best = s; });

    readout.innerHTML = '<dl class="fr-lab-dl">' +
      '<div><dt>Reaches the cytosol</dt><dd>' + fmtPct(r.total) + ' of the injected dose</dd></div>' +
      '<div><dt>Per 100,000 injected molecules</dt><dd>' + (perHundredK >= 10 ? perHundredK.toFixed(0) : perHundredK.toFixed(1)) + ' reach the cytosol</dd></div>' +
      '<div><dt>Dose needed per cytosolic molecule</dt><dd>about ' + fmtTimes(needed) + ' injected molecules</dd></div>' +
      '</dl>' +
      '<p class="fr-lab-verdict">The leakiest stage is ' + best.name + ' at ' + fmtSlider(best.value) + '. Its headroom, the most that stage alone could improve the outcome, is ' + fmtTimes(headroom(best.value)) + ' times; for the stage at ' + fmtSlider(Math.max(v.reach, v.uptake, v.escape)) + ' it is only ' + fmtTimes(headroom(Math.max(v.reach, v.uptake, v.escape))) + ' times.</p>';
  }

  function applyPreset(name) {
    var p = PRESETS[name];
    if (!p) return;
    inputs.reach.value = toSlider(p.reach);
    inputs.uptake.value = toSlider(p.uptake);
    inputs.escape.value = toSlider(p.escape);
    render();
  }

  Object.keys(inputs).forEach(function (k) {
    inputs[k].addEventListener('input', render);
  });
  for (var i = 0; i < presetButtons.length; i++) {
    presetButtons[i].addEventListener('click', function () {
      applyPreset(this.getAttribute('data-preset'));
    });
  }

  applyPreset('tumour');

})();
