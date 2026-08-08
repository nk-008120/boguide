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
      .select('display_name, avatar_url, country, about, education_level')
      .eq('id', userId)
      .single()
      .then(function (result) {
        return (result && result.data) || null;
      });
  }

  window.PapersAuth = {
    isConfigured: isConfigured,
    getClient: getClient,
    getSession: getSession,
    getProfile: getProfile,
    onChange: onChange,
    signOut: signOut
  };
})();
