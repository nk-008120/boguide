(function () {
  'use strict';

  var finder = document.getElementById('cg-finder');
  if (!finder) return;

  var CONTACT = 'r6394175@gmail.com';

  var loadingEl = document.getElementById('cg-finder-loading');
  var publishedWrap = document.getElementById('cg-finder-published-wrap');
  var openWrap = document.getElementById('cg-finder-open-wrap');
  var publishedEl = document.getElementById('cg-finder-published');
  var openEl = document.getElementById('cg-finder-open');
  var statsEl = document.getElementById('cg-stats');
  var statPublished = document.getElementById('cg-stat-published');
  var statOpen = document.getElementById('cg-stat-open');

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function mailtoFor(name) {
    var subject = 'Country guide for BiOGuide: ' + name;
    var body = 'Hi,\n\nI would like to write the BiOGuide guide for ' + name + '.\n\nMy background:\n';
    return 'mailto:' + CONTACT + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  }

  function chipHtml(entry) {
    var info = entry.info;
    var isPublished = info.status === 'published' && info.guideUrl;
    var href = isPublished ? info.guideUrl : mailtoFor(info.name);
    var cls = 'cg-chip ' + (isPublished ? 'is-published' : 'is-open');
    var title = isPublished
      ? 'Read the ' + info.name + ' guide'
      : 'Email us to write the ' + info.name + ' guide';
    return '<a class="' + cls + '" href="' + escapeHtml(href) + '" title="' + escapeHtml(title) + '">' +
      '<span>' + escapeHtml(info.flag || '') + '</span>' +
      '<span>' + escapeHtml(info.name) + '</span>' +
      '</a>';
  }

  function showError() {
    loadingEl.textContent = 'Could not load the country list. Email ' + CONTACT + ' and tell us which country you have in mind.';
  }

  fetch('/data/olympiad-programmes.json')
    .then(function (r) {
      if (!r.ok) throw new Error('bad response');
      return r.json();
    })
    .then(function (data) {
      var countries = data.countries || {};
      var entries = Object.keys(countries)
        .map(function (code) { return { code: code, info: countries[code] }; })
        .sort(function (a, b) { return a.info.name.localeCompare(b.info.name); });

      var published = entries.filter(function (e) { return e.info.status === 'published' && e.info.guideUrl; });
      var open = entries.filter(function (e) { return !(e.info.status === 'published' && e.info.guideUrl); });

      publishedEl.innerHTML = published.map(chipHtml).join('');
      openEl.innerHTML = open.map(chipHtml).join('');
      publishedWrap.hidden = published.length === 0;
      openWrap.hidden = open.length === 0;
      loadingEl.hidden = true;

      if (statsEl) {
        statPublished.textContent = published.length;
        statOpen.textContent = open.length;
        statsEl.hidden = false;
      }
    })
    .catch(showError);
})();
