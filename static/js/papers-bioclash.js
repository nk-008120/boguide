(function () {
  'use strict';

  var countdownRoot = document.getElementById('bioclash-countdown');
  if (countdownRoot) {
    var TARGET = new Date('2026-10-10T00:00:00Z').getTime();
    var DAY = 24 * 60 * 60 * 1000;
    var HOUR = 60 * 60 * 1000;

    var renderCountdown = function () {
      var diff = TARGET - Date.now();
      if (diff <= 0) {
        countdownRoot.textContent = 'Season 1 is here.';
        return;
      }
      var days = Math.floor(diff / DAY);
      var hours = Math.floor((diff % DAY) / HOUR);
      countdownRoot.textContent = days + 'd ' + hours + 'h until October 10.';
    };
    renderCountdown();
    setInterval(renderCountdown, 60 * 1000);
  }

  var notifyRoot = document.getElementById('bioclash-notify');
  if (!notifyRoot) return;

  var nextPath = notifyRoot.getAttribute('data-next') || '/bioclash/';
  var nextParam = encodeURIComponent(nextPath);

  function renderUnconfigured() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg">Login isn\'t configured on this environment yet. Use the Discord and Instagram links below to stay posted in the meantime.</p>';
  }

  function renderLoggedOut() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg">Log in and we\'ll email you automatically before Season 1 opens, no separate signup.</p>' +
      '<a class="bioclash-btn bioclash-btn-primary" href="/account/?next=' + nextParam + '">Log in to get notified</a>';
  }

  function renderOptedIn() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg bioclash-notify-confirmed">You\'re opted in. We\'ll email you before Season 1 opens.</p>' +
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

  function renderOptIn() {
    notifyRoot.innerHTML =
      '<p class="bioclash-notify-msg">Want to be notified before Season 1 opens?</p>' +
      '<button type="button" class="bioclash-btn bioclash-btn-primary" id="bioclash-notify-optin"><span class="bioclash-btn-shine" aria-hidden="true"></span><span>Notify me</span></button>';
    var optInBtn = document.getElementById('bioclash-notify-optin');
    if (!optInBtn) return;
    optInBtn.addEventListener('click', function () {
      window.PapersAuth.getSession().then(function (session) {
        if (!session) { renderLoggedOut(); return; }
        window.PapersAuth.getClient()
          .from('profiles')
          .update({ notify_bioclash: true })
          .eq('id', session.user.id)
          .then(function (result) {
            if (result.error) return;
            renderOptedIn();
          });
      });
    });
  }

  function handleSession(session) {
    if (!session) { renderLoggedOut(); return; }
    var profile = window.PapersAuth.getProfile && window.PapersAuth.getProfile();
    if (profile && profile.notify_bioclash) {
      renderOptedIn();
    } else {
      renderOptIn();
    }
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    renderUnconfigured();
    return;
  }

  notifyRoot.innerHTML = '<p class="bioclash-notify-msg">Checking your login status...</p>';
  window.PapersAuth.getSession().then(handleSession).catch(renderLoggedOut);
  window.PapersAuth.onChange(handleSession);
})();
