(function () {
  'use strict';

  var EARTH_RADIUS = 6.371e6;
  var SUN_RADIUS = 6.957e8;
  var EARTH_MASS = 5.972e24;
  var G = 6.674e-11;
  var K_B = 1.380649e-23;
  var M_H = 1.6735575e-27;
  var PLANET_RADIUS = 2.61 * EARTH_RADIUS;
  var STAR_RADIUS = 0.4445 * SUN_RADIUS;
  var PLANET_MASS = 8.63 * EARTH_MASS;
  var TEMPERATURE = 255;
  var RATIO = PLANET_RADIUS / STAR_RADIUS;
  var GRAVITY = G * PLANET_MASS / (PLANET_RADIUS * PLANET_RADIUS);
  var DOMAIN = 1.5;
  var W = 640;
  var H = 492;
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function scaleHeight(mu) {
    return K_B * TEMPERATURE / (mu * M_H * GRAVITY);
  }

  function overlapFraction(d, r) {
    if (d >= 1 + r) return 0;
    if (d <= Math.abs(1 - r)) return r < 1 ? r * r : 1;
    var a = r * r * Math.acos((d * d + r * r - 1) / (2 * d * r));
    var b = Math.acos((d * d + 1 - r * r) / (2 * d));
    var c = 0.5 * Math.sqrt((-d + r + 1) * (d + r - 1) * (d - r + 1) * (d + r + 1));
    return (a + b - c) / Math.PI;
  }

  function depthPpm(x, b, r) {
    return 1e6 * overlapFraction(Math.sqrt(x * x + b * b), r);
  }

  var root = document.getElementById('fr-transit');
  if (!root || root.getAttribute('data-ready')) return;
  root.setAttribute('data-ready', '1');

  var state = { x: -DOMAIN, b: 0.3, n: 1, mu: 2.3, playing: false, started: false };
  var d3ref = null;
  var nodes = {};
  var lastTick = null;

  function loadD3(done) {
    if (window.d3) {
      done();
      return;
    }
    var s = document.createElement('script');
    s.src = '/vendor/d3/d3.min.js';
    s.onload = done;
    s.onerror = function () {
      root.querySelector('.fr-viz-status').textContent = 'The interactive figure could not load the D3 library.';
    };
    document.head.appendChild(s);
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (text != null) node.textContent = text;
    return node;
  }

  function slider(id, label, min, max, step, value) {
    var wrap = el('label', { 'class': 'fr-viz-slider' });
    var top = el('span');
    top.appendChild(document.createTextNode(label + ' '));
    var out = el('output', { id: id + '-out' });
    top.appendChild(out);
    var input = el('input', { type: 'range', id: id, min: min, max: max, step: step, value: value });
    wrap.appendChild(top);
    wrap.appendChild(input);
    return { wrap: wrap, input: input, out: out };
  }

  function buildControls() {
    var controls = root.querySelector('.fr-viz-controls');
    var play = el('button', { type: 'button', 'class': 'fr-viz-btn', id: 'fr-transit-play' }, 'Play');
    var pos = slider('fr-transit-x', 'Planet position', -DOMAIN, DOMAIN, 0.005, state.x);
    var imp = slider('fr-transit-b', 'Impact parameter (illustrative)', 0, 0.85, 0.05, state.b);
    var atm = slider('fr-transit-n', 'Atmosphere height (scale heights)', 0, 5, 0.5, state.n);
    var mu = el('fieldset', { 'class': 'fr-viz-set' });
    mu.appendChild(el('legend', {}, 'Atmosphere is'));
    var l1 = el('label');
    var r1 = el('input', { type: 'radio', name: 'fr-transit-mu', value: '2.3', checked: 'checked' });
    l1.appendChild(r1);
    l1.appendChild(document.createTextNode(' Hydrogen-helium (mean molecular weight 2.3)'));
    var l2 = el('label');
    var r2 = el('input', { type: 'radio', name: 'fr-transit-mu', value: '18' });
    l2.appendChild(r2);
    l2.appendChild(document.createTextNode(' Water-rich (mean molecular weight 18)'));
    mu.appendChild(l1);
    mu.appendChild(l2);
    controls.appendChild(play);
    controls.appendChild(pos.wrap);
    controls.appendChild(imp.wrap);
    controls.appendChild(atm.wrap);
    controls.appendChild(mu);
    nodes.play = play;
    nodes.pos = pos;
    nodes.imp = imp;
    nodes.atm = atm;
    nodes.mu = [r1, r2];

    play.addEventListener('click', function () {
      state.playing = !state.playing;
      if (state.playing && state.x >= DOMAIN - 0.01) state.x = -DOMAIN;
      lastTick = null;
      play.textContent = state.playing ? 'Pause' : 'Play';
    });
    pos.input.addEventListener('input', function () {
      state.x = Number(pos.input.value);
      state.playing = false;
      play.textContent = 'Play';
      render();
    });
    imp.input.addEventListener('input', function () {
      state.b = Number(imp.input.value);
      renderStatic();
      render();
    });
    atm.input.addEventListener('input', function () {
      state.n = Number(atm.input.value);
      renderStatic();
      render();
    });
    nodes.mu.forEach(function (r) {
      r.addEventListener('change', function () {
        state.mu = Number(r.value);
        renderStatic();
        render();
      });
    });
  }

  function geometry() {
    var rEff = RATIO + state.n * scaleHeight(state.mu) / STAR_RADIUS;
    return { r0: RATIO, r1: rEff };
  }

  function samples(fn) {
    var out = [];
    for (var i = 0; i <= 600; i++) {
      var x = -DOMAIN + (2 * DOMAIN * i) / 600;
      out.push([x, fn(x)]);
    }
    return out;
  }

  function buildSvg() {
    var d3 = d3ref;
    var svg = d3.select(root.querySelector('.fr-viz-plot')).append('svg')
      .attr('viewBox', '0 0 ' + W + ' ' + H)
      .attr('role', 'img')
      .attr('aria-label', 'Animated transit of K2-18 b across its star with the resulting light curve and the tiny extra dip from an atmosphere');
    nodes.svg = svg;

    svg.append('rect').attr('class', 'fr-tr-scene').attr('x', 0).attr('y', 0).attr('width', W).attr('height', 170);
    var defs = svg.append('defs');
    var grad = defs.append('radialGradient').attr('id', 'fr-tr-star').attr('cx', '50%').attr('cy', '50%').attr('r', '50%');
    grad.append('stop').attr('offset', '0%').attr('stop-color', '#ffb37a');
    grad.append('stop').attr('offset', '70%').attr('stop-color', '#f4813a');
    grad.append('stop').attr('offset', '100%').attr('stop-color', '#c75a1f');
    nodes.starR = 66;
    nodes.starCx = W / 2;
    nodes.starCy = 88;
    svg.append('circle').attr('cx', nodes.starCx).attr('cy', nodes.starCy).attr('r', nodes.starR).attr('fill', 'url(#fr-tr-star)');
    nodes.planet = svg.append('circle').attr('class', 'fr-tr-planet');
    nodes.planetRing = svg.append('circle').attr('class', 'fr-tr-ring');
    nodes.planetTag = svg.append('text').attr('class', 'fr-tr-tag');
    svg.append('text').attr('class', 'fr-tr-note fr-tr-note-dark').attr('x', 12).attr('y', 160).text('Star and planet drawn to scale (the planet is a speck)');

    nodes.xs = d3.scaleLinear().domain([-DOMAIN, DOMAIN]).range([56, W - 20]);
    nodes.yCurve = d3.scaleLinear().domain([-3700, 300]).range([328, 192]);
    nodes.curveG = svg.append('g');
    nodes.curveG.append('text').attr('class', 'fr-tr-title').attr('x', 56).attr('y', 186).text('Brightness of the star (parts per million below normal)');
    nodes.curveG.append('g').attr('class', 'fr-tr-axis').attr('transform', 'translate(0,328)')
      .call(d3.axisBottom(nodes.xs).ticks(7).tickFormat(function (v) { return v === 0 ? '0' : d3.format('.1f')(v); }));
    nodes.curveG.append('g').attr('class', 'fr-tr-axis').attr('transform', 'translate(56,0)')
      .call(d3.axisLeft(nodes.yCurve).ticks(5).tickFormat(function (v) { return d3.format(',')(v); }));
    nodes.curveG.append('line').attr('class', 'fr-tr-base').attr('x1', 56).attr('x2', W - 20).attr('y1', nodes.yCurve(0)).attr('y2', nodes.yCurve(0));
    nodes.curveAll = nodes.curveG.append('path').attr('class', 'fr-tr-curve-ghost');
    nodes.curveSeen = nodes.curveG.append('path').attr('class', 'fr-tr-curve');
    nodes.curveAtm = nodes.curveG.append('path').attr('class', 'fr-tr-curve-atm');
    nodes.dot = nodes.curveG.append('circle').attr('class', 'fr-tr-dot').attr('r', 4.5);
    nodes.xLabel = svg.append('text').attr('class', 'fr-tr-note').attr('x', W / 2).attr('y', 366).attr('text-anchor', 'middle').text('Planet position across the star (stellar radii)');

    nodes.yRes = d3.scaleLinear().domain([0, 40]).range([472, 404]);
    nodes.resG = svg.append('g');
    nodes.resG.append('text').attr('class', 'fr-tr-title').attr('x', 56).attr('y', 394).text('The extra dip caused by the atmosphere, magnified (ppm)');
    nodes.resAxisX = nodes.resG.append('g').attr('class', 'fr-tr-axis').attr('transform', 'translate(0,472)').call(d3.axisBottom(nodes.xs).ticks(7).tickFormat(function () { return ''; }));
    nodes.resAxisY = nodes.resG.append('g').attr('class', 'fr-tr-axis').attr('transform', 'translate(56,0)');
    nodes.resPath = nodes.resG.append('path').attr('class', 'fr-tr-res');
    nodes.resDot = nodes.resG.append('circle').attr('class', 'fr-tr-dot').attr('r', 4);
  }

  function renderStatic() {
    var d3 = d3ref;
    var g = geometry();
    var line = d3.line().x(function (p) { return nodes.xs(p[0]); }).y(function (p) { return nodes.yCurve(-p[1]); });
    var full = samples(function (x) { return depthPpm(x, state.b, g.r0); });
    var withAtm = samples(function (x) { return depthPpm(x, state.b, g.r1); });
    nodes.fullData = full;
    nodes.atmData = withAtm;
    nodes.curveAll.attr('d', line(full));
    nodes.curveAtm.attr('d', line(withAtm));

    var extra = samples(function (x) { return depthPpm(x, state.b, g.r1) - depthPpm(x, state.b, g.r0); });
    var peak = d3.max(extra, function (p) { return p[1]; });
    var top = Math.max(10, Math.ceil((peak * 1.25) / 10) * 10);
    nodes.yRes.domain([0, top]);
    nodes.resAxisY.call(d3.axisLeft(nodes.yRes).ticks(4).tickFormat(function (v) { return d3.format(',')(v); }));
    var resLine = d3.line().x(function (p) { return nodes.xs(p[0]); }).y(function (p) { return nodes.yRes(p[1]); });
    nodes.resData = extra;
    nodes.resPath.attr('d', resLine(extra));
    nodes.peakExtra = peak;
  }

  function interp(data, x) {
    var i = Math.round(((x + DOMAIN) / (2 * DOMAIN)) * 600);
    i = Math.max(0, Math.min(600, i));
    return data[i][1];
  }

  function render() {
    var d3 = d3ref;
    var g = geometry();
    var px = nodes.starCx + state.x * nodes.starR;
    var py = nodes.starCy + state.b * nodes.starR;
    var pr = Math.max(1.8, g.r0 * nodes.starR);
    nodes.planet.attr('cx', px).attr('cy', py).attr('r', pr);
    nodes.planetRing.attr('cx', px).attr('cy', py).attr('r', pr + 5);
    nodes.planetTag.attr('x', px).attr('y', Math.max(14, py - 14)).attr('text-anchor', 'middle').text('K2-18 b');

    var line = d3.line().x(function (p) { return nodes.xs(p[0]); }).y(function (p) { return nodes.yCurve(-p[1]); });
    var seen = nodes.fullData.filter(function (p) { return p[0] <= state.x; });
    nodes.curveSeen.attr('d', seen.length > 1 ? line(seen) : null);
    var now = interp(nodes.fullData, state.x);
    nodes.dot.attr('cx', nodes.xs(state.x)).attr('cy', nodes.yCurve(-now));
    var ex = interp(nodes.resData, state.x);
    nodes.resDot.attr('cx', nodes.xs(state.x)).attr('cy', nodes.yRes(ex));

    nodes.pos.input.value = state.x;
    nodes.pos.out.textContent = state.x.toFixed(2);
    nodes.imp.out.textContent = state.b.toFixed(2);
    nodes.atm.out.textContent = state.n.toFixed(1);

    var hKm = scaleHeight(state.mu) / 1000;
    var fullDepth = 1e6 * RATIO * RATIO;
    var formula = 1e6 * 2 * PLANET_RADIUS * (state.n * scaleHeight(state.mu)) / (STAR_RADIUS * STAR_RADIUS);
    var share = state.n === 0 ? 0 : (nodes.peakExtra / (1e6 * RATIO * RATIO)) * 100;
    var readout = root.querySelector('.fr-viz-readout');
    readout.innerHTML =
      '<dl class="fr-viz-dl">' +
      '<div><dt>Planet to star radius</dt><dd>' + RATIO.toFixed(4) + ', so a mid-transit dip of about ' + Math.round(fullDepth).toLocaleString() + ' ppm</dd></div>' +
      '<div><dt>One scale height</dt><dd>' + hKm.toFixed(1) + ' km, worth about ' + (1e6 * 2 * PLANET_RADIUS * scaleHeight(state.mu) / (STAR_RADIUS * STAR_RADIUS)).toFixed(1) + ' ppm of extra dip</dd></div>' +
      '<div><dt>Your atmosphere</dt><dd>' + state.n.toFixed(1) + ' scale heights adds about ' + Math.round(formula) + ' ppm (formula) and ' + nodes.peakExtra.toFixed(0) + ' ppm (full geometry), only ' + share.toFixed(2) + '% of the transit</dd></div>' +
      '</dl>';
  }

  function tick(ts) {
    if (state.playing) {
      if (lastTick == null) lastTick = ts;
      var dt = (ts - lastTick) / 1000;
      lastTick = ts;
      state.x += dt * ((2 * DOMAIN) / 7);
      if (state.x >= DOMAIN) {
        state.x = DOMAIN;
        state.playing = false;
        nodes.play.textContent = 'Replay';
      }
      render();
    }
    window.requestAnimationFrame(tick);
  }

  function start() {
    if (state.started) return;
    state.started = true;
    loadD3(function () {
      d3ref = window.d3;
      var st = root.querySelector('.fr-viz-status');
      if (st) st.remove();
      buildControls();
      buildSvg();
      renderStatic();
      render();
      window.requestAnimationFrame(tick);
      var seen = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting && state.x <= -DOMAIN + 0.01 && !state.playing) {
          state.playing = true;
          lastTick = null;
          nodes.play.textContent = 'Pause';
          seen.disconnect();
        }
      }, { threshold: 0.45 });
      seen.observe(root.querySelector('.fr-viz-plot'));
    });
  }

  if ('IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        near.disconnect();
        start();
      }
    }, { rootMargin: '700px 0px' });
    near.observe(root);
  } else {
    start();
  }
})();
