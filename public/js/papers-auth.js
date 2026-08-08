/*
 * Site-wide Supabase auth helper for BiOrchive's optional login system.
 * Loaded on every page via layouts/partials/custom/head-end.html, after
 * the Supabase CDN SDK and the window.__SUPABASE_URL/__SUPABASE_ANON_KEY
 * config script (defer preserves document order, so both are guaranteed
 * ready by the time this runs).
 *
 * Exposes window.PapersAuth — a small wrapper other scripts (papers-
 * account.js, papers-attempt.js, papers-leaderboard.js) use instead of
 * touching the raw Supabase client directly, so the "is auth even
 * configured" check only has to live in one place.
 */
(function () {
  'use strict';

  var client = null;

  function isConfigured() {
    return !!(window.__SUPABASE_URL && window.__SUPABASE_ANON_KEY && window.supabase);
  }

  function getClient() {
    if (!isConfigured()) return null;
    if (!client) {
      client = window.supabase.createClient(window.__SUPABASE_URL, window.__SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    }
    return client;
  }

  function getSession() {
    var c = getClient();
    if (!c) return Promise.resolve(null);
    return c.auth.getSession().then(function (result) {
      return (result && result.data && result.data.session) || null;
    });
  }

  function onChange(cb) {
    var c = getClient();
    if (!c) return function unsubscribe() {};
    var sub = c.auth.onAuthStateChange(function (_event, session) {
      cb(session || null);
    });
    return function unsubscribe() {
      try { sub.data.subscription.unsubscribe(); } catch (e) {}
    };
  }

  function signOut() {
    var c = getClient();
    if (!c) return Promise.resolve();
    return c.auth.signOut();
  }

  function getProfile(userId) {
    var c = getClient();
    if (!c) return Promise.resolve(null);
    return c.from('profiles')
      .select('display_name, avatar_url, country, about, education_level, notify_bioclash')
      .eq('id', userId)
      .single()
      .then(function (result) {
        return (result && result.data) || null;
      });
  }

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  // Shared avatar/flag markup for anywhere a profile row gets rendered
  // (navbar icon, leaderboard rows) so the "no avatar yet" / "no country
  // set" / "Other" fallbacks only have to be handled once.
  function avatarHTML(displayName, avatarUrl) {
    if (avatarUrl) {
      return '<img class="papers-avatar" src="' + escapeHTML(avatarUrl) + '" alt="" loading="lazy" onerror="this.outerHTML=window.PapersAuth.avatarFallbackHTML(' + JSON.stringify(displayName || '') + ')">';
    }
    return avatarFallbackHTML(displayName);
  }

  function avatarFallbackHTML(displayName) {
    var initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';
    return '<span class="papers-avatar papers-avatar-fallback">' + escapeHTML(initial) + '</span>';
  }

  // profiles.country is an ISO 3166-1 alpha-2 code, or the sentinel "OT"
  // for "Other" (papers-account.js's country picker) — real flag images
  // from flagcdn.com render identically across every OS/browser, unlike
  // the regional-indicator emoji this used to be (Windows Chrome has no
  // flag glyphs and falls back to showing the bare two-letter code).
  function flagHTML(code) {
    if (!code || code.length !== 2 || code.toUpperCase() === 'OT') return '';
    var lower = code.toLowerCase();
    return '<img class="papers-flag" src="https://flagcdn.com/24x18/' + lower + '.png" ' +
      'srcset="https://flagcdn.com/48x36/' + lower + '.png 2x" width="24" height="18" ' +
      'alt="' + escapeHTML(code.toUpperCase()) + '" loading="lazy" onerror="this.remove()">';
  }

  window.PapersAuth = {
    isConfigured: isConfigured,
    getClient: getClient,
    getSession: getSession,
    getProfile: getProfile,
    onChange: onChange,
    signOut: signOut,
    avatarHTML: avatarHTML,
    avatarFallbackHTML: avatarFallbackHTML,
    flagHTML: flagHTML
  };
})();
