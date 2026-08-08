/*
 * Drives the three dynamic pieces of the BiOClash landing page
 * (content/bioclash/index.md, layout: "wide"): a curtain-reveal intro, a
 * client-side countdown to the Season 1 target date, and the login-based
 * "notify me" widget.
 *
 * Notify mechanism: login is the preferred path (per the planning doc) —
 * visiting this page while logged in auto-opts the visitor into
 * profiles.notify_bioclash, no separate signup form. Logged-out visitors get
 * a CTA to /account/?next=/bioclash/ (same ?next= pattern papers-account.js
 * already reads for the article gate), so logging in returns them here and
 * the auto-opt-in fires on that return visit. Page-scoped, not loaded
 * sitewide (like papers-account.js / papers-article-gate.js).
 */
(function () {
  'use strict';

  // ---- Curtain-reveal intro (#bioclash-curtains, CSS in custom.css
  // section 15b). Whether the curtain is shown at all (vs. skipped for
  // prefers-reduced-motion or already opened this session) is decided
  // synchronously by the inline <script> right after the curtain markup in
  // content/bioclash/index.md, before first paint — this deferred script
  // only wires up the open interaction, so there's nothing left here that
  // could show-then-hide a beat late. ----
  var curtains = document.getElementById('bioclash-curtains');
  if (curtains) {
    var openCurtains = function () {
      curtains.classList.add('is-open');
      try { sessionStorage.setItem('bioclash-curtains-opened', '1'); } catch (e) {}
      var hide = function () { curtains.style.display = 'none'; };
      curtains.addEventListener('transitionend', hide, { once: true });
      setTimeout(hide, 1400); // fallback in case transitionend never fires
    };
    curtains.addEventListener('click', openCurtains);
    curtains.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        openCurtains();
      }
    });
  }

  // ---- Countdown to Season 1's target date ----
  var countdownRoot = document.getElementById('bioclash-countdown');
  if (countdownRoot) {
    var TARGET = new Date('2026-09-11T00:00:00Z').getTime();
    var DAY = 24 * 60 * 60 * 1000;
    var HOUR = 60 * 60 * 1000;

    var renderCountdown = function () {
      var diff = TARGET - Date.now();
      if (diff <= 0) {
        countdownRoot.textContent = 'Season 1’s target window is here.';
        return;
      }
      var days = Math.floor(diff / DAY);
      var hours = Math.floor((diff % DAY) / HOUR);
      countdownRoot.textContent = days + 'd ' + hours + 'h until the September 11 target.';
    };
    renderCountdown();
    setInterval(renderCountdown, 60 * 1000);
  }

  // ---- Notify-me widget ----
  var notifyRoot = document.getElementById('bioclash-notify');
  if (!notifyRoot) return;

  var nextPath = notifyRoot.getAttribute('data-next') || '/bioclash/';
  var nextParam = encodeURIComponent(nextPath);

  function renderUnconfigured() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg">Login isn’t configured on this environment yet — use the Discord and Instagram links below to stay posted in the meantime.</p>';
  }

  function renderLoggedOut() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg">Log in and we’ll email you automatically before Season 1 opens — no separate signup.</p>' +
      '<a class="bioclash-btn bioclash-btn-primary" href="/account/?next=' + nextParam + '">Log in to get notified</a>';
  }

  function renderOptedIn() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg bioclash-notify-confirmed">You’re opted in ✓ — we’ll email you before Season 1 opens.</p>' +
      '<button type="button" class="bioclash-link-btn" id="bioclash-notify-optout">Opt out</button>';
    var optOutBtn = document.getElementById('bioclash-notify-optout');
    if (!optOutBtn) return;
    optOutBtn.addEventListener('click', function () {
      window.PapersAuth.getSession().then(function (session) {
        if (!session) { renderLoggedOut(); return; }
        window.PapersAuth.getClient()
          .from('profiles')
          .update({ notify_bioclash: false })
          .eq('id', session.user.id)
          .then(function (result) {
            if (result.error) { return; }
            renderLoggedOut();
          });
      });
    });
  }

  function handleSession(session) {
    if (!session) { renderLoggedOut(); return; }
    window.PapersAuth.getClient()
      .from('profiles')
      .update({ notify_bioclash: true })
      .eq('id', session.user.id)
      .then(function (result) {
        if (result.error) { renderLoggedOut(); return; }
        renderOptedIn();
      });
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    renderUnconfigured();
    return;
  }

  notifyRoot.innerHTML = '<p class="bioclash-notify-msg">Checking your login status…</p>';
  window.PapersAuth.getSession().then(handleSession).catch(renderLoggedOut);
  window.PapersAuth.onChange(handleSession);
})();
