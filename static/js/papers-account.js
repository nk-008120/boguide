/*
 * Drives the login / signup / password-reset / profile forms on
 * content/account/index.md (relocated from content/papers/account/ —
 * see LOGIN_ROADMAP.md Part 2, feature 1; an alias keeps the old URL
 * working). Page-scoped (not loaded site-wide, unlike papers-auth.js)
 * since form-handling code is only needed here.
 */
(function () {
  'use strict';

  var root = document.getElementById('papers-account-root');
  if (!root) return;

  // Curated avatar set (feature 2) — actual image files live in
  // static/avatars/ and are supplied separately (not generated here); this
  // list just needs to match whatever filenames end up there.
  var AVATAR_FILES = [
    'avatar-01.jpg', 'avatar-02.jpg', 'avatar-03.jpg', 'avatar-04.png',
    'avatar-05.png', 'avatar-06.png', 'avatar-07.jpg', 'avatar-08.jpg',
    'avatar-09.png', 'avatar-10.jpg', 'avatar-11.jpg', 'avatar-12.svg'
  ];

  // ISO 3166-1 alpha-2 codes — stored as-is in profiles.country so the
  // leaderboard can derive a flag emoji client-side with no image assets
  // (see papers-leaderboard.js / papers-leaderboard-overall.js).
  var COUNTRIES = [
    ['AF', 'Afghanistan'], ['AL', 'Albania'], ['DZ', 'Algeria'], ['AR', 'Argentina'],
    ['AM', 'Armenia'], ['AU', 'Australia'], ['AT', 'Austria'], ['AZ', 'Azerbaijan'],
    ['BD', 'Bangladesh'], ['BY', 'Belarus'], ['BE', 'Belgium'], ['BJ', 'Benin'],
    ['BO', 'Bolivia'], ['BA', 'Bosnia and Herzegovina'], ['BW', 'Botswana'], ['BR', 'Brazil'],
    ['BG', 'Bulgaria'], ['BF', 'Burkina Faso'], ['KH', 'Cambodia'], ['CM', 'Cameroon'],
    ['CA', 'Canada'], ['CL', 'Chile'], ['CN', 'China'], ['CO', 'Colombia'],
    ['CR', 'Costa Rica'], ['HR', 'Croatia'], ['CU', 'Cuba'], ['CY', 'Cyprus'],
    ['CZ', 'Czechia'], ['DK', 'Denmark'], ['DO', 'Dominican Republic'], ['EC', 'Ecuador'],
    ['EG', 'Egypt'], ['SV', 'El Salvador'], ['EE', 'Estonia'], ['ET', 'Ethiopia'],
    ['FI', 'Finland'], ['FR', 'France'], ['GE', 'Georgia'], ['DE', 'Germany'],
    ['GH', 'Ghana'], ['GR', 'Greece'], ['GT', 'Guatemala'], ['HN', 'Honduras'],
    ['HK', 'Hong Kong'], ['HU', 'Hungary'], ['IS', 'Iceland'], ['IN', 'India'],
    ['ID', 'Indonesia'], ['IR', 'Iran'], ['IQ', 'Iraq'], ['IE', 'Ireland'],
    ['IL', 'Israel'], ['IT', 'Italy'], ['CI', "Ivory Coast"], ['JM', 'Jamaica'],
    ['JP', 'Japan'], ['JO', 'Jordan'], ['KZ', 'Kazakhstan'], ['KE', 'Kenya'],
    ['KR', 'South Korea'], ['KW', 'Kuwait'], ['KG', 'Kyrgyzstan'], ['LA', 'Laos'],
    ['LV', 'Latvia'], ['LB', 'Lebanon'], ['LY', 'Libya'], ['LT', 'Lithuania'],
    ['LU', 'Luxembourg'], ['MO', 'Macau'], ['MG', 'Madagascar'], ['MY', 'Malaysia'],
    ['ML', 'Mali'], ['MT', 'Malta'], ['MX', 'Mexico'], ['MD', 'Moldova'],
    ['MN', 'Mongolia'], ['ME', 'Montenegro'], ['MA', 'Morocco'], ['MZ', 'Mozambique'],
    ['MM', 'Myanmar'], ['NP', 'Nepal'], ['NL', 'Netherlands'], ['NZ', 'New Zealand'],
    ['NI', 'Nicaragua'], ['NE', 'Niger'], ['NG', 'Nigeria'], ['MK', 'North Macedonia'],
    ['NO', 'Norway'], ['OM', 'Oman'], ['PK', 'Pakistan'], ['PA', 'Panama'],
    ['PY', 'Paraguay'], ['PE', 'Peru'], ['PH', 'Philippines'], ['PL', 'Poland'],
    ['PT', 'Portugal'], ['QA', 'Qatar'], ['RO', 'Romania'], ['RU', 'Russia'],
    ['RW', 'Rwanda'], ['SA', 'Saudi Arabia'], ['SN', 'Senegal'], ['RS', 'Serbia'],
    ['SG', 'Singapore'], ['SK', 'Slovakia'], ['SI', 'Slovenia'], ['SO', 'Somalia'],
    ['ZA', 'South Africa'], ['ES', 'Spain'], ['LK', 'Sri Lanka'], ['SD', 'Sudan'],
    ['SE', 'Sweden'], ['CH', 'Switzerland'], ['SY', 'Syria'], ['TW', 'Taiwan'],
    ['TJ', 'Tajikistan'], ['TZ', 'Tanzania'], ['TH', 'Thailand'], ['TN', 'Tunisia'],
    ['TR', 'Turkey'], ['TM', 'Turkmenistan'], ['UG', 'Uganda'], ['UA', 'Ukraine'],
    ['AE', 'United Arab Emirates'], ['GB', 'United Kingdom'], ['US', 'United States'],
    ['UY', 'Uruguay'], ['UZ', 'Uzbekistan'], ['VE', 'Venezuela'], ['VN', 'Vietnam'],
    ['YE', 'Yemen'], ['ZM', 'Zambia'], ['ZW', 'Zimbabwe'], ['OT', 'Other']
  ];

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

  // ---- return-to-article support (feature 4's gate links here with ?next=) ----
  function getNextParam() {
    var m = /[?&]next=([^&]+)/.exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : null;
  }

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

  // ---- avatar picker (feature 2) ----
  var avatarGrid = document.getElementById('account-avatar-grid');
  var avatarMsg = document.getElementById('account-avatar-msg');
  var currentUserId = null;

  function renderAvatarGrid(selectedUrl) {
    avatarGrid.innerHTML = AVATAR_FILES.map(function (file) {
      var url = '/avatars/' + file;
      var selected = url === selectedUrl;
      return '<button type="button" class="account-avatar-option' + (selected ? ' selected' : '') +
        '" data-url="' + url + '" aria-label="Choose avatar">' +
        '<img src="' + url + '" alt="" loading="lazy" onerror="this.parentElement.classList.add(\'account-avatar-missing\')">' +
        '</button>';
    }).join('');
    avatarGrid.querySelectorAll('.account-avatar-option').forEach(function (btn) {
      btn.addEventListener('click', function () { selectAvatar(btn.dataset.url); });
    });
  }

  function selectAvatar(url) {
    if (!currentUserId) return;
    setMsg(avatarMsg, 'Saving…', false);
    client.from('profiles').update({ avatar_url: url }).eq('id', currentUserId).then(function (result) {
      if (result.error) { setMsg(avatarMsg, result.error.message, true); return; }
      setMsg(avatarMsg, 'Avatar updated.', false);
      avatarGrid.querySelectorAll('.account-avatar-option').forEach(function (btn) {
        btn.classList.toggle('selected', btn.dataset.url === url);
      });
    });
  }

  // ---- profile form (feature 3) ----
  var countrySelect = document.getElementById('account-country-select');
  countrySelect.innerHTML = '<option value="">Prefer not to say</option>' +
    COUNTRIES.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + '</option>'; }).join('');

  var profileForm = document.getElementById('account-profile-form');
  var aboutInput = document.getElementById('account-about-input');
  var aboutCount = document.getElementById('account-about-count');

  function wordCount(text) {
    var trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  aboutInput.addEventListener('input', function () {
    var n = wordCount(aboutInput.value);
    aboutCount.textContent = n + ' / 50 words';
    aboutCount.classList.toggle('account-word-count-over', n > 50);
  });

  profileForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('account-profile-msg');
    var n = wordCount(aboutInput.value);
    if (n > 50) { setMsg(msg, 'Keep "About" to 50 words or fewer.', true); return; }
    if (!currentUserId) return;
    setMsg(msg, 'Saving…', false);
    client.from('profiles').update({
      country: profileForm.country.value || null,
      education_level: profileForm.educationLevel.value || null,
      about: aboutInput.value.trim() || null
    }).eq('id', currentUserId).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      setMsg(msg, 'Profile saved.', false);
    });
  });

  // ---- logged-in view ----
  function renderLoggedIn(session) {
    currentUserId = session.user.id;
    var nameEl = document.getElementById('account-display-name');
    nameEl.textContent = session.user.email;
    renderAvatarGrid(null);
    window.PapersAuth.getProfile(session.user.id).then(function (profile) {
      if (!profile) return;
      if (profile.display_name) nameEl.textContent = profile.display_name;
      if (profile.avatar_url) renderAvatarGrid(profile.avatar_url);
      countrySelect.value = profile.country || '';
      profileForm.educationLevel.value = profile.education_level || '';
      aboutInput.value = profile.about || '';
      aboutInput.dispatchEvent(new Event('input'));
    });
    showScreen('loggedIn');

    var next = getNextParam();
    if (next) window.location.replace(next);
  }

  document.getElementById('account-signout-btn').addEventListener('click', function () {
    window.PapersAuth.signOut().then(refresh);
  });

  // ---- delete account ----
  document.getElementById('account-delete-btn').addEventListener('click', function () {
    var msg = document.getElementById('account-delete-msg');
    if (!window.confirm('Delete your account? This permanently removes your login, profile, and leaderboard history and cannot be undone.')) return;
    client.auth.getSession().then(function (result) {
      var session = result.data && result.data.session;
      if (!session) { setMsg(msg, 'Your session expired — log in again and retry.', true); return; }
      setMsg(msg, 'Deleting…', false);
      fetch('/api/delete-account', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + session.access_token }
      }).then(function (res) {
        return res.json().then(function (body) { return { ok: res.ok, body: body }; });
      }).then(function (result) {
        if (!result.ok) { setMsg(msg, (result.body && result.body.error) || 'Could not delete your account.', true); return; }
        window.PapersAuth.signOut().then(function () {
          window.location.href = '/';
        });
      }).catch(function () {
        setMsg(msg, 'Could not delete your account — try again.', true);
      });
    });
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
      redirectTo: window.location.origin + '/account/'
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
