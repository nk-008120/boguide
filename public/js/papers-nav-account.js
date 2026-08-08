/*
 * Site-wide: keeps the navbar account icon (layouts/partials/navbar-
 * title.html) in sync with login state, on every page. Loaded from
 * head-end.html right after papers-auth.js. Logged out => generic person
 * glyph linking to /account/. Logged in => the user's chosen avatar
 * (profiles.avatar_url), falling back to the generic glyph if none is set
 * yet. Updates reactively via PapersAuth.onChange, so logging in on the
 * account page updates every other open tab/nav-render without a reload.
 */
(function () {
  'use strict';

  var link = document.getElementById('nav-account-link');
  var defaultIcon = document.getElementById('nav-account-icon-default');
  var avatarIcon = document.getElementById('nav-account-icon-avatar');
  if (!link || !defaultIcon || !avatarIcon) return;

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) return;

  function showDefault() {
    avatarIcon.hidden = true;
    avatarIcon.removeAttribute('src');
    defaultIcon.hidden = false;
    link.classList.remove('nav-account-link-loggedin');
  }

  function showAvatar(url) {
    avatarIcon.src = url;
    avatarIcon.hidden = false;
    defaultIcon.hidden = true;
    link.classList.add('nav-account-link-loggedin');
  }

  function refresh(session) {
    if (!session) { showDefault(); return; }
    window.PapersAuth.getProfile(session.user.id).then(function (profile) {
      if (profile && profile.avatar_url) showAvatar(profile.avatar_url);
      else showDefault();
    }).catch(showDefault);
  }

  avatarIcon.addEventListener('error', showDefault);

  window.PapersAuth.getSession().then(refresh);
  window.PapersAuth.onChange(refresh);
})();
