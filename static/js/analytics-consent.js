(function () {
  'use strict';

  var KEY = 'bio-analytics-consent-v1';
  var cfg = window.__ANALYTICS || {};
  var started = false;
  var bar = null;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function write(value) {
    try { localStorage.setItem(KEY, value); } catch (e) { return; }
  }

  function loadScript(src, integrity, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    if (integrity) {
      s.integrity = integrity;
      s.crossOrigin = 'anonymous';
    }
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }

  function startGa4() {
    if (!cfg.ga4) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.ga4);
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4));
  }

  function startPosthog() {
    var p = cfg.posthog;
    if (!p || !p.key || !p.src) return;
    loadScript(p.src, p.integrity, function () {
      if (!window.posthog || !window.posthog.init) return;
      window.posthog.init(p.key, {
        api_host: p.host,
        autocapture: false,
        capture_pageview: false,
        disable_session_recording: true,
        persistence: 'localStorage',
        loaded: function () {
          document.dispatchEvent(new CustomEvent('bio:posthog-ready'));
        }
      });
    });
  }

  function start() {
    if (started) return;
    started = true;
    startGa4();
    startPosthog();
  }

  function clearStoredData() {
    var host = location.hostname;
    var domains = ['', host, '.' + host, '.' + host.replace(/^www\./, '')];
    document.cookie.split(';').forEach(function (part) {
      var name = part.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var k = localStorage.key(i);
        if (k && /^ph_/.test(k)) localStorage.removeItem(k);
      }
    } catch (e) { return; }
  }

  function hideBar() {
    if (bar && bar.parentNode) bar.parentNode.removeChild(bar);
    bar = null;
  }

  function choose(value) {
    var previous = read();
    write(value);
    hideBar();
    if (value === 'granted') {
      start();
    } else if (previous === 'granted' || started) {
      clearStoredData();
      location.reload();
    }
  }

  function showBar() {
    hideBar();
    bar = document.createElement('div');
    bar.className = 'bio-consent';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Analytics choice');

    var text = document.createElement('p');
    text.className = 'bio-consent-text';
    text.appendChild(document.createTextNode('Can we use Google Analytics and PostHog to see which pages and features help students? They only run if you allow them. '));
    var link = document.createElement('a');
    link.href = '/privacy/#analytics';
    link.textContent = 'Privacy policy';
    text.appendChild(link);

    var actions = document.createElement('div');
    actions.className = 'bio-consent-actions';
    var no = document.createElement('button');
    no.type = 'button';
    no.className = 'bio-consent-btn';
    no.textContent = 'No thanks';
    no.addEventListener('click', function () { choose('denied'); });
    var yes = document.createElement('button');
    yes.type = 'button';
    yes.className = 'bio-consent-btn bio-consent-btn-primary';
    yes.textContent = 'Allow';
    yes.addEventListener('click', function () { choose('granted'); });
    actions.appendChild(no);
    actions.appendChild(yes);

    bar.appendChild(text);
    bar.appendChild(actions);
    document.body.appendChild(bar);
  }

  function bindSettingsLinks() {
    var links = document.querySelectorAll('[data-analytics-settings]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        e.preventDefault();
        showBar();
      });
    }
  }

  window.bioAnalyticsConsent = { show: showBar, state: read };

  bindSettingsLinks();
  if (!cfg.ga4 && !cfg.posthog) return;

  var choice = read();
  if (choice === 'granted') {
    start();
  } else if (choice === null && navigator.globalPrivacyControl !== true) {
    showBar();
  }
})();
