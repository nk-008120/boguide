(function () {
  'use strict';

  var container = document.getElementById('olympiad-map-container');
  if (!container) return;

  var tooltip = document.getElementById('olympiad-map-tooltip');
  var loading = document.getElementById('olympiad-map-loading');
  var programmeData = null;

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadMap() {
    var svgUrl = (document.querySelector('meta[name="base"]') || {}).content || '';
    svgUrl = '/images/world-map.svg';

    Promise.all([
      fetch(svgUrl).then(function (r) { return r.text(); }),
      fetch('/data/olympiad-programmes.json').then(function (r) { return r.json(); })
    ]).then(function (results) {
      var svgText = results[0];
      programmeData = results[1].countries || {};

      if (loading) loading.style.display = 'none';
      container.insertAdjacentHTML('beforeend', svgText);

      var svg = container.querySelector('svg');
      if (!svg) return;

      svg.setAttribute('role', 'presentation');
      svg.style.width = '100%';
      svg.style.height = 'auto';

      highlightCountries(svg);
      attachEvents(svg);
    }).catch(function (err) {
      console.error('olympiad-map: failed to load', err);
      if (loading) loading.textContent = 'Could not load map.';
    });
  }

  var SMALL_COUNTRY_MAX_DIMENSION = 20; // viewBox units (map is 1200x620) -- below this a country
                                        // is too small to see or click reliably on its own, so we
                                        // add a centroid marker dot for it.

  function highlightCountries(svg) {
    var keys = Object.keys(programmeData);
    for (var i = 0; i < keys.length; i++) {
      var code = keys[i];
      var info = programmeData[code];
      var el = svg.getElementById('country-' + code);
      if (!el) continue;

      var isPublished = info.status === 'published' && info.guideUrl;

      if (isPublished) {
        el.classList.add('country-published');
        el.setAttribute('data-clickable', 'true');
        el.style.cursor = 'pointer';
      } else if (info.status === 'coming-soon') {
        el.classList.add('country-coming-soon');
      }

      el.setAttribute('data-country', code);
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'link');
      el.setAttribute('aria-label', escapeHtml(info.name) +
        (info.programme ? ' -- ' + escapeHtml(info.programme) : ''));

      if (isPublished) {
        addMarkerIfSmall(svg, el, code);
      }
    }
  }

  function addMarkerIfSmall(svg, el, code) {
    var bbox;
    try {
      bbox = el.getBBox();
    } catch (e) {
      return; // element not rendered/measurable yet
    }
    if (!bbox || bbox.width <= 0 || bbox.height <= 0) return;
    if (Math.max(bbox.width, bbox.height) >= SMALL_COUNTRY_MAX_DIMENSION) return;

    var cx = bbox.x + bbox.width / 2;
    var cy = bbox.y + bbox.height / 2;

    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    marker.setAttribute('cx', cx);
    marker.setAttribute('cy', cy);
    marker.setAttribute('r', 6);
    marker.setAttribute('class', 'country-marker');
    marker.setAttribute('data-country', code);
    marker.setAttribute('tabindex', '0');
    marker.setAttribute('role', 'link');
    marker.setAttribute('aria-label', el.getAttribute('aria-label') || '');
    el.parentNode.appendChild(marker);
  }

  function attachEvents(svg) {
    svg.addEventListener('mouseover', function (e) {
      var path = findCountryPath(e.target);
      if (!path) return;
      showTooltip(path, e);
    });

    svg.addEventListener('mouseout', function (e) {
      var path = findCountryPath(e.target);
      if (!path) return;
      hideTooltip();
    });

    svg.addEventListener('mousemove', function (e) {
      if (tooltip && !tooltip.hidden) {
        positionTooltip(e);
      }
    });

    svg.addEventListener('click', function (e) {
      var path = findCountryPath(e.target);
      if (!path) return;
      var code = path.getAttribute('data-country');
      if (!code || !programmeData[code]) return;
      var info = programmeData[code];
      if (info.guideUrl && info.status === 'published') {
        window.location.href = info.guideUrl;
      }
    });

    svg.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var path = findCountryPath(e.target);
      if (!path) return;
      var code = path.getAttribute('data-country');
      if (!code || !programmeData[code]) return;
      var info = programmeData[code];
      if (info.guideUrl && info.status === 'published') {
        e.preventDefault();
        window.location.href = info.guideUrl;
      }
    });
  }

  function findCountryPath(el) {
    var node = el;
    while (node && node !== container) {
      if (node.getAttribute && node.getAttribute('data-country')) return node;
      node = node.parentElement;
    }
    return null;
  }

  function showTooltip(path, e) {
    if (!tooltip) return;
    var code = path.getAttribute('data-country');
    if (!code || !programmeData[code]) return;
    var info = programmeData[code];

    var flag = info.flag ? escapeHtml(info.flag) + ' ' : '';
    var name = escapeHtml(info.name);
    var prog = info.programme ? '<br><span class="olympiad-tooltip-prog">' + escapeHtml(info.programme) + '</span>' : '';
    var status = '';
    if (info.status === 'published') {
      status = '<br><span class="olympiad-tooltip-status published">Guide available -- click to read</span>';
    } else if (info.status === 'coming-soon') {
      status = '<br><span class="olympiad-tooltip-status coming">Coming soon</span>';
    }

    tooltip.innerHTML = '<strong>' + flag + name + '</strong>' + prog + status;
    tooltip.hidden = false;
    positionTooltip(e);
  }

  function positionTooltip(e) {
    if (!tooltip) return;
    var rect = container.getBoundingClientRect();
    var x = e.clientX - rect.left + 12;
    var y = e.clientY - rect.top - 10;

    if (x + 220 > rect.width) x = x - 240;
    if (y < 0) y = 10;

    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
  }

  function hideTooltip() {
    if (tooltip) tooltip.hidden = true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMap);
  } else {
    loadMap();
  }
})();
