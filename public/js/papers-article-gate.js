/*
 * BiOInsights gating (LOGIN_ROADMAP.md Part 2, feature 4; section renamed
 * from "Articles" 2026-08-09) — loaded only on pages using
 * layouts/gated-article.html. The body is blurred by default
 * (CSS, .article-gate-body at rest) so a visitor without JS never sees an
 * unlocked article; this script removes the blur for a logged-in visitor
 * and otherwise shows a "log in to keep reading" CTA that returns here
 * (via ?next=) after login.
 */
(function () {
  'use strict';

  var root = document.getElementById('article-gate-root');
  if (!root) return;
  var cta = document.getElementById('article-gate-cta');
  var ctaLink = document.getElementById('article-gate-cta-link');

  function unlock() {
    root.classList.add('article-gate-unlocked');
    if (cta) cta.hidden = true;
  }

  function lock() {
    root.classList.remove('article-gate-unlocked');
    if (cta) cta.hidden = false;
    if (ctaLink) {
      var next = root.getAttribute('data-next') || window.location.pathname;
      ctaLink.href = '/account/?next=' + encodeURIComponent(next);
    }
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    // No login system on this environment — nothing to gate against.
    unlock();
    return;
  }

  window.PapersAuth.getSession().then(function (session) {
    if (session) unlock();
    else lock();
  }).catch(lock);

  window.PapersAuth.onChange(function (session) {
    if (session) unlock(); else lock();
  });
})();
