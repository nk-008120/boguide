/*
 * Forces the BiOClash "case file" dark mode on the leaderboard page, exactly
 * like static/js/bioclash-attempt.js does for the attempt page itself — see
 * that file and assets/css/custom.css section 24 for the full rationale.
 * Duplicated rather than shared because the two pages have independent
 * lifecycles and root ids; the logic is intentionally identical.
 */
(function () {
  'use strict';

  var root = document.getElementById('bioclash-leaderboard-root');
  if (!root) return;

  function forceDark() {
    var cl = document.documentElement.classList;
    if (cl.contains('light') || cl.contains('favourite') || !cl.contains('dark')) {
      cl.remove('light', 'favourite');
      cl.add('dark');
    }
  }

  document.body.classList.add('bioclash-leaderboard-active');

  var themeAtLoad = localStorage.getItem('color-theme');
  document.addEventListener('click', function (e) {
    if (e.target.closest('.hextra-theme-toggle, .hextra-theme-toggle-options')) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  }, true);
  new MutationObserver(function () {
    if (localStorage.getItem('color-theme') !== themeAtLoad) {
      if (themeAtLoad === null) localStorage.removeItem('color-theme');
      else localStorage.setItem('color-theme', themeAtLoad);
    }
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  forceDark();
  new MutationObserver(forceDark).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
})();
