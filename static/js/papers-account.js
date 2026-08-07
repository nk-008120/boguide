/*
 * Drives the login / signup / password-reset forms on content/papers/
 * account/index.md. Page-scoped (not loaded site-wide, unlike papers-
 * auth.js) since form-handling code is only needed here.
 */
(function () {
  'use strict';

  var root = document.getElementById('papers-account-root');
  if (!root) return;

  var screens = {
    unconfigured: document.getElementById('account-unconfigured'),
    loading: document.getElementById('account-loading'),
    loggedOut: document.getElementById('account-logged-out'),
    recovery: document.getElementById('account-recovery'),
    loggedIn: document.getElementById('account-logged-in')
  };

  function showScreen(name) {
    Object.keys(screens).forEach(function (key) {
      if (screens[key]) screens[key].hidden = key !== name;
    });
  }

  if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
    showScreen('unconfigured');
    return;
  }

  var client = window.PapersAuth.getClient();

  // ---- tabs (login / signup) ----
  var tabs = root.querySelectorAll('.account-tab');
  var loginForm = document.getElementById('account-login-form');
  var signupForm = document.getElementById('account-signup-form');
  var resetForm = document.getElementById('account-reset-form');

  function showForm(which) {
    loginForm.hidden = which !== 'login';
    signupForm.hidden = which !== 'signup';
    resetForm.hidden = which !== 'reset';
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.dataset.tab === which);
    });
  }

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () { showForm(tab.dataset.tab); });
  });
  document.getElementById('account-forgot-btn').addEventListener('click', function () { showForm('reset'); });
  document.getElementById('account-reset-cancel-btn').addEventListener('click', function () { showForm('login'); });

  function setMsg(el, text, isError) {
    el.textContent = text;
    el.classList.toggle('account-msg-error', !!isError);
  }

  // ---- logged-in view ----
  function renderLoggedIn(session) {
    var nameEl = document.getElementById('account-display-name');
    nameEl.textContent = session.user.email;
    client.from('profiles').select('display_name').eq('id', session.user.id).single()
      .then(function (result) {
        if (result.data && result.data.display_name) nameEl.textContent = result.data.display_name;
      });
    showScreen('loggedIn');
  }

  document.getElementById('account-signout-btn').addEventListener('click', function () {
    window.PapersAuth.signOut().then(refresh);
  });

  // ---- forms ----
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('account-login-msg');
    var email = loginForm.email.value.trim();
    var password = loginForm.password.value;
    setMsg(msg, 'Logging in…', false);
    client.auth.signInWithPassword({ email: email, password: password }).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      setMsg(msg, '', false);
      refresh();
    });
  });

  signupForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('account-signup-msg');
    var email = signupForm.email.value.trim();
    var password = signupForm.password.value;
    var displayName = signupForm.displayName.value.trim();
    setMsg(msg, 'Signing up…', false);
    client.auth.signUp({
      email: email,
      password: password,
      options: { data: { display_name: displayName } }
    }).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      if (result.data && result.data.session) {
        // Email confirmation is off on this project — signed in immediately.
        refresh();
      } else {
        setMsg(msg, 'Check your email to confirm your account, then log in.', false);
      }
    });
  });

  resetForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('account-reset-msg');
    var email = resetForm.email.value.trim();
    setMsg(msg, 'Sending…', false);
    client.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/papers/account/'
    }).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      setMsg(msg, 'Check your email for a reset link.', false);
    });
  });

  document.getElementById('account-new-password-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    var msg = document.getElementById('account-recovery-msg');
    setMsg(msg, 'Updating…', false);
    client.auth.updateUser({ password: form.password.value }).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      setMsg(msg, 'Password updated.', false);
      refresh();
    });
  });

  // ---- initial state + recovery-link detection ----
  var isRecovery = /type=recovery/.test(window.location.hash);

  function refresh() {
    if (isRecovery) { showScreen('recovery'); return; }
    window.PapersAuth.getSession().then(function (session) {
      if (session) renderLoggedIn(session);
      else { showScreen('loggedOut'); showForm('login'); }
    });
  }

  client.auth.onAuthStateChange(function (event) {
    if (event === 'PASSWORD_RECOVERY') { isRecovery = true; showScreen('recovery'); }
  });

  showScreen('loading');
  refresh();
})();
