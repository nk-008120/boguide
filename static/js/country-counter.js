(function () {
  'use strict';

  function init() {
    var heroEl = document.getElementById('hero-country-counter');
    var reachEl = document.getElementById('community-reach');
    if (!heroEl && !reachEl) return;

    fetch('/api/country-stats')
      .then(function (res) {
        if (!res.ok) return null;
        return res.json();
      })
      .then(function (data) {
        if (!data || !data.totalCountries) return;
        var totalVisits = (typeof data.totalVisits === 'number' && data.totalVisits > 0)
          ? data.totalVisits
          : (data.countries || []).reduce(function (sum, c) {
              return sum + countryVisits(c);
            }, 0);
        if (heroEl) renderHeroCounter(heroEl, totalVisits, data.totalCountries);
        if (reachEl) renderCommunityReach(data, totalVisits);
      })
      .catch(function () {});
  }

  function countryVisits(c) {
    if (!c) return 0;
    return Number(c.visits != null ? c.visits : c.views) || 0;
  }

  function renderHeroCounter(el, totalVisits, totalCountries) {
    var link = document.createElement('a');
    link.href = '/about/#community-reach';
    link.className = 'hero-country-badge';

    function setText(visits, countries) {
      link.innerHTML = '<svg class="ui-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg> <b>' + formatWithCommas(visits) + '</b> student visits from <b>' +
        countries + '</b> countries';
    }

    el.appendChild(link);

    if (document.hidden) {
      setText(totalVisits, totalCountries);
      return;
    }
    var duration = 1500;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      setText(Math.floor(eased * totalVisits), Math.floor(eased * totalCountries));
      if (progress < 1) requestAnimationFrame(step);
      else setText(totalVisits, totalCountries);
    }
    requestAnimationFrame(step);
  }

  function renderCommunityReach(data, totalVisits) {
    var heroDiv = document.getElementById('community-reach-hero');
    if (heroDiv) {
      heroDiv.innerHTML =
        '<div class="reach-stats-row">' +
        '<div class="reach-stat">' +
        '<span class="reach-number">' + formatWithCommas(totalVisits) + '</span>' +
        '<span class="reach-label">student visits</span>' +
        '</div>' +
        '<div class="reach-stat">' +
        '<span class="reach-number">' + data.totalCountries + '</span>' +
        '<span class="reach-label">countries reached</span>' +
        '</div>' +
        '</div>';
    }

    var gridDiv = document.getElementById('community-reach-grid');
    if (gridDiv && data.countries && data.countries.length) {
      var sorted = data.countries.slice().sort(function (a, b) {
        return countryVisits(b) - countryVisits(a);
      });
      var html = '';
      for (var i = 0; i < sorted.length; i++) {
        var c = sorted[i];
        html += '<div class="reach-country-card">';
        html += '<span class="reach-flag">' + escapeHtml(c.flag) + '</span>';
        html += '<span class="reach-country-name">' + escapeHtml(c.name) + '</span>';
        if (countryVisits(c)) {
          html += '<span class="reach-country-visitors">' +
            formatNumber(countryVisits(c)) + '</span>';
        }
        html += '</div>';
      }
      gridDiv.innerHTML = html;
    }

    var updatedEl = document.getElementById('community-reach-updated');
    if (updatedEl) {
      updatedEl.textContent = 'Sourced live every day at 5 AM UTC from Umami Analytics';
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

  function formatWithCommas(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
