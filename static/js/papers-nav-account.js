(function () {
  'use strict';

  var signin = document.getElementById('nav-signin');
  var menu = document.getElementById('nav-account-menu');
  var btn = document.getElementById('nav-account-btn');
  var list = document.getElementById('nav-account-list');
  var avatar = document.getElementById('nav-account-icon-avatar');
  var glyph = document.getElementById('nav-account-icon-default');
  if (!signin || !menu || !btn || !list || !avatar || !glyph) return;

  function close() {
    list.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = list.hidden;
    list.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var first = list.querySelector('a');
      if (first) first.focus();
    }
  });
  document.addEventListener('click', function (e) {
    if (!menu.contains(e.target)) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !list.hidden) {
      close();
      btn.focus();
    }
  });

  function signedOut() {
    close();
    menu.hidden = true;
    signin.hidden = false;
  }

  function signedIn(url) {
    signin.hidden = true;
    menu.hidden = false;
    if (url) {
      avatar.src = url;
      avatar.hidden = false;
      glyph.hidden = true;
    } else {
      avatar.hidden = true;
      avatar.removeAttribute('src');
      glyph.hidden = false;
    }
  }

  avatar.addEventListener('error', function () { signedIn(null); });

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) return;

  function refresh(session) {
    if (!session) { signedOut(); return; }
    signedIn(null);
    window.PapersAuth.getProfile(session.user.id).then(function (profile) {
      if (profile && profile.avatar_url) signedIn(profile.avatar_url);
    }).catch(function () {});
  }

  window.PapersAuth.getSession().then(refresh);
  window.PapersAuth.onChange(refresh);
})();
