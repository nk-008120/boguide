(function () {
  'use strict';

  var grid = document.getElementById('olympiad-directory-grid');
  if (!grid) return;

  var searchInput = document.getElementById('olympiad-directory-search');
  var filterButtons = document.querySelectorAll('.olympiad-directory-filter-btn');
  var countEl = document.getElementById('olympiad-directory-count');
  var emptyEl = document.getElementById('olympiad-directory-empty');
  var loadingEl = document.getElementById('olympiad-directory-loading');

  var entries = [];
  var state = { query: '', filter: 'all' };

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function cardHtml(entry) {
    var info = entry.info;
    var isPublished = info.status === 'published' && info.guideUrl;
    var subtitle = info.stages || info.programme || '';
    var tag = isPublished ? 'a' : 'div';
    var attrs = isPublished ? ' href="' + escapeHtml(info.guideUrl) + '"' : '';
    var cls = 'olympiad-directory-card' + (isPublished ? '' : ' is-coming-soon');
    var badge = isPublished ? '' : '<span class="olympiad-directory-badge">Soon</span>';
    return '<' + tag + ' class="' + cls + '"' + attrs + '>' +
      '<span class="olympiad-directory-flag">' + escapeHtml(info.flag || '') + '</span>' +
      '<span class="olympiad-directory-body">' +
        '<h4>' + escapeHtml(info.name) + '</h4>' +
        '<p>' + escapeHtml(subtitle) + '</p>' +
      '</span>' +
      badge +
      '</' + tag + '>';
  }

  function render() {
    var q = state.query.trim().toLowerCase();
    var filtered = entries.filter(function (entry) {
      if (state.filter !== 'all' && entry.info.status !== state.filter) return false;
      if (!q) return true;
      return entry.info.name.toLowerCase().indexOf(q) !== -1 ||
        (entry.info.programme || '').toLowerCase().indexOf(q) !== -1;
    });

    if (filtered.length === 0) {
      grid.innerHTML = '';
      emptyEl.hidden = false;
    } else {
      emptyEl.hidden = true;
      grid.innerHTML = filtered.map(cardHtml).join('');
    }
  }

  function updateCount() {
    var published = entries.filter(function (e) { return e.info.status === 'published'; }).length;
    var comingSoon = entries.length - published;
    countEl.textContent = published + ' guide' + (published === 1 ? '' : 's') + ' available' +
      (comingSoon > 0 ? ', ' + comingSoon + ' more coming soon' : '');
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.query = searchInput.value;
      render();
    });
  }

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.filter = btn.getAttribute('data-filter');
      filterButtons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
      render();
    });
  });

  fetch('/data/olympiad-programmes.json')
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var countries = data.countries || {};
      entries = Object.keys(countries)
        .map(function (code) { return { code: code, info: countries[code] }; })
        .sort(function (a, b) { return a.info.name.localeCompare(b.info.name); });

      if (loadingEl) loadingEl.remove();
      updateCount();
      render();
    })
    .catch(function (err) {
      console.error('olympiad-directory: failed to load', err);
      if (loadingEl) loadingEl.textContent = 'Could not load the country list.';
    });
})();
