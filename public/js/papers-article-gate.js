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
