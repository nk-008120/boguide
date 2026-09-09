/* staff-welcome.js -- a one-per-session "Welcome, {name}" toast for staff
   accounts (profiles.is_staff). Depends on: papers-auth.js (PapersAuth). */
(function () {
  'use strict';

  var SESSION_FLAG = 'bioguide_staff_welcome_shown';

  function getFlag() {
    try { return sessionStorage.getItem(SESSION_FLAG) === '1'; } catch (e) { return true; }
  }

  function setFlag() {
    try { sessionStorage.setItem(SESSION_FLAG, '1'); } catch (e) {}
  }

  function clearFlag() {
    try { sessionStorage.removeItem(SESSION_FLAG); } catch (e) {}
  }

  function showToast(name) {
    if (document.getElementById('staff-welcome-toast')) return;
    var el = document.createElement('div');
    el.id = 'staff-welcome-toast';
    el.className = 'staff-welcome-toast';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'staff-welcome-close';
    closeBtn.setAttribute('aria-label', 'Dismiss');
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function () { el.remove(); });
    el.appendChild(closeBtn);

    var msg = document.createElement('span');
    msg.className = 'staff-welcome-message';
    msg.textContent = '👋 Welcome, ' + (name || 'there') + '!';
    el.appendChild(msg);

    document.body.appendChild(el);
  }

  function handleSession(session) {
    if (!session) { clearFlag(); return; }
    if (getFlag()) return;
    // Claim immediately -- getSession().then(...) and onChange(...) below
    // both route through this function and can fire near-simultaneously
    // on initial page load, so this dedupes before the async profile
    // fetch below ever resolves.
    setFlag();
    window.PapersAuth.getProfile(session.user.id).then(function (profile) {
      if (profile && profile.is_staff) showToast(profile.display_name);
    });
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) return;
  window.PapersAuth.getSession().then(handleSession);
  window.PapersAuth.onChange(handleSession);
})();
