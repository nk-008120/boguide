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
