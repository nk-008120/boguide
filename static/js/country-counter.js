(function () {
  'use strict';

  function init() {
    var heroEl = document.getElementById('hero-country-counter');
    var reachEl = document.getElementById('community-reach');
    if (!heroEl && !reachEl) return;

    fetch('/data/country-stats.json')
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.totalCountries) return;
        if (heroEl) renderHeroCounter(heroEl, data.totalCountries);
        if (reachEl) renderCommunityReach(data);
      })
      .catch(function () {});
  }

  function renderHeroCounter(el, total) {
    var link = document.createElement('a');
    link.href = '/about/#community-reach';
    link.className = 'hero-country-badge';

    function setText(n) {
      link.innerHTML = '🌍 Students from <b>' + n + '</b> countries';
    }

    el.appendChild(link);

    if (document.hidden) {
      setText(total);
      return;
    }
    var duration = 1500;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      setText(Math.floor(eased * total));
      if (progress < 1) requestAnimationFrame(step);
      else setText(total);
    }
    requestAnimationFrame(step);
  }

  function renderCommunityReach(data) {
    var heroDiv = document.getElementById('community-reach-hero');
    if (heroDiv) {
      heroDiv.innerHTML =
        '<span class="reach-number">' + data.totalCountries + '</span>' +
        '<span class="reach-label">countries use BiOGuide</span>';
    }

    var gridDiv = document.getElementById('community-reach-grid');
    if (gridDiv && data.countries && data.countries.length) {
      var sorted = data.countries.slice().sort(function (a, b) {
        return (b.views || 0) - (a.views || 0);
      });
      var html = '';
      for (var i = 0; i < sorted.length; i++) {
        var c = sorted[i];
        html += '<div class="reach-country-card">';
        html += '<span class="reach-flag">' + escapeHtml(c.flag) + '</span>';
        html += '<span class="reach-country-name">' + escapeHtml(c.name) + '</span>';
        if (c.views) {
          html += '<span class="reach-country-visitors">' +
            formatNumber(c.views) + '</span>';
        }
        html += '</div>';
      }
      gridDiv.innerHTML = html;
    }

    var updatedEl = document.getElementById('community-reach-updated');
    if (updatedEl && data.lastUpdated) {
      updatedEl.textContent =
        'Source: Umami Analytics · Last updated ' + data.lastUpdated;
    }
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str || ''));
    return div.innerHTML;
  }

  function formatNumber(n) {
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
