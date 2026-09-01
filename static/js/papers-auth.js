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
      .select('display_name, avatar_url, country, about, education_level, notify_bioclash, target_olympiad, site_tutorial_seen')
      .eq('id', userId)
      .single()
      .then(function (result) {
        return (result && result.data) || null;
      });
  }

  function escapeHTML(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function avatarHTML(displayName, avatarUrl) {
    if (avatarUrl) {
      return '<img class="papers-avatar" src="' + escapeHTML(avatarUrl) + '" alt="" loading="lazy" onerror="this.outerHTML=window.PapersAuth.avatarFallbackHTML(' + escapeHTML(JSON.stringify(displayName || '')) + ')">';
    }
    return avatarFallbackHTML(displayName);
  }

  function avatarFallbackHTML(displayName) {
    var initial = (displayName || '?').trim().charAt(0).toUpperCase() || '?';
    return '<span class="papers-avatar papers-avatar-fallback">' + escapeHTML(initial) + '</span>';
  }

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
