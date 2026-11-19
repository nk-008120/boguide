(function () {
  'use strict';

  var root = document.getElementById('papers-account-root');
  if (!root) return;

  var AVATAR_FILES = [
    'lydia-01.webp', 'lydia-02.webp', 'lydia-03.webp', 'lydia-04.webp',
    'lydia-05.webp', 'lydia-06.webp', 'lydia-07.webp', 'lydia-08.webp',
    'lydia-09.webp', 'lydia-10.webp', 'lydia-11.webp', 'lydia-12.webp'
  ];

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

  function getNextParam() {
    var m = /[?&]next=([^&]+)/.exec(window.location.search);
    if (!m) return null;
    var next;
    try { next = decodeURIComponent(m[1]); } catch (e) { return null; }
    if (!/^\/(?![/\\])/.test(next) || next.indexOf('\\') !== -1) return null;
    for (var i = 0; i < next.length; i++) {
      if (next.charCodeAt(i) < 32) return null;
    }
    try {
      if (new URL(next, window.location.origin).origin !== window.location.origin) return null;
    } catch (e) { return null; }
    return next;
  }

  var tabs = root.querySelectorAll('.account-tab');
  var loginForm = document.getElementById('account-login-form');
  var signupForm = document.getElementById('account-signup-form');
  var resetForm = document.getElementById('account-reset-form');
  var otpRequestForm = document.getElementById('account-otp-request-form');
  var otpVerifyForm = document.getElementById('account-otp-verify-form');

  function showForm(which) {
    loginForm.hidden = which !== 'login';
    signupForm.hidden = which !== 'signup';
    resetForm.hidden = which !== 'reset';
    otpRequestForm.hidden = which !== 'otp-request';
    otpVerifyForm.hidden = which !== 'otp-verify';
    var activeTab = which.indexOf('otp') === 0 ? 'login' : which;
    tabs.forEach(function (t) {
      t.classList.toggle('active', t.dataset.tab === activeTab);
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

  var TURNSTILE_SITEKEY = window.__TURNSTILE_SITEKEY || '';
  var CAPTCHA_WAIT = 'The security check did not finish. Reload the page and try again.';
  var CAPTCHA_CHECKING = 'Running a quick security check…';
  var CAPTCHA_INTERACT = 'Please tick the security check box below. We will continue as soon as it passes.';
  var CAPTCHA_SLOW = 'The security check is taking longer than usual. If a box appears below, tick it. Otherwise please keep this page open.';
  var CAPTCHA_BLOCKED = 'The security check could not load. If you use an ad or content blocker, allow challenges.cloudflare.com on this page and reload it.';
  var CAPTCHA_UNSUPPORTED = 'Your browser is not supported by the security check. Please update it or try another browser.';
  var CAPTCHA_SLOW_MS = 20000;
  var CAPTCHA_GIVE_UP_MS = 180000;
  var turnstileBox = document.getElementById('account-turnstile');
  var turnstileWidget = null;
  var turnstileReady = null;
  var captchaToken = '';
  var captchaState = 'idle';
  var captchaErrorCode = '';
  var captchaWaiters = [];
  var weakPasswordNotice = false;

  function settleCaptchaWaiters() {
    var waiters = captchaWaiters;
    captchaWaiters = [];
    waiters.forEach(function (w) { w(); });
  }

  function withCode(text) {
    return captchaErrorCode ? text + ' (Cloudflare code ' + captchaErrorCode + ')' : text;
  }

  function loadTurnstile() {
    if (!TURNSTILE_SITEKEY || !turnstileBox) return Promise.resolve(false);
    if (turnstileReady) return turnstileReady;
    captchaState = 'loading';
    turnstileReady = new Promise(function (resolve) {
      window.bioTurnstileLoaded = function () {
        try {
          turnstileWidget = window.turnstile.render(turnstileBox, {
            sitekey: TURNSTILE_SITEKEY,
            action: 'account',
            appearance: 'always',
            retry: 'auto',
            'refresh-expired': 'auto',
            callback: function (token) {
              captchaToken = token;
              captchaErrorCode = '';
              captchaState = 'ready';
              settleCaptchaWaiters();
            },
            'expired-callback': function () {
              captchaToken = '';
              captchaState = 'loading';
            },
            'before-interactive-callback': function () {
              captchaState = 'interactive';
              settleCaptchaWaiters();
            },
            'after-interactive-callback': function () {
              if (captchaState === 'interactive') captchaState = 'loading';
            },
            'unsupported-callback': function () {
              captchaState = 'unsupported';
              settleCaptchaWaiters();
            },
            'error-callback': function (code) {
              captchaToken = '';
              captchaErrorCode = String(code || '');
              return true;
            }
          });
          resolve(true);
        } catch (err) {
          captchaState = 'blocked';
          resolve(false);
          settleCaptchaWaiters();
        }
      };
      var script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=bioTurnstileLoaded';
      script.async = true;
      script.onerror = function () {
        captchaState = 'blocked';
        resolve(false);
        settleCaptchaWaiters();
      };
      document.head.appendChild(script);
    });
    return turnstileReady;
  }

  function waitForCaptcha(msgEl) {
    return new Promise(function (resolve, reject) {
      var slow = false;
      var slowTimer = null;
      var giveUpTimer = null;
      function finish() {
        clearTimeout(slowTimer);
        clearTimeout(giveUpTimer);
        captchaWaiters = captchaWaiters.filter(function (w) { return w !== check; });
      }
      function show() {
        if (!msgEl) return;
        if (captchaState === 'interactive') {
          setMsg(msgEl, CAPTCHA_INTERACT, false);
          if (turnstileBox.scrollIntoView) turnstileBox.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        } else {
          setMsg(msgEl, slow ? withCode(CAPTCHA_SLOW) : CAPTCHA_CHECKING, false);
        }
      }
      function check() {
        if (captchaToken) {
          finish();
          var token = captchaToken;
          captchaToken = '';
          resolve(token);
          return;
        }
        if (captchaState === 'blocked') { finish(); reject(new Error(CAPTCHA_BLOCKED)); return; }
        if (captchaState === 'unsupported') { finish(); reject(new Error(CAPTCHA_UNSUPPORTED)); return; }
        show();
        captchaWaiters.push(check);
      }
      slowTimer = setTimeout(function () { slow = true; show(); }, CAPTCHA_SLOW_MS);
      giveUpTimer = setTimeout(function () {
        finish();
        reject(new Error(withCode(CAPTCHA_WAIT)));
      }, CAPTCHA_GIVE_UP_MS);
      check();
    });
  }

  function captchaOptions(options, msgEl) {
    if (!TURNSTILE_SITEKEY) return Promise.resolve(options);
    return loadTurnstile().then(function () {
      return waitForCaptcha(msgEl);
    }).then(function (token) {
      options.captchaToken = token;
      return options;
    });
  }

  function resetCaptcha() {
    captchaToken = '';
    if (turnstileWidget !== null && window.turnstile) {
      captchaState = 'loading';
      window.turnstile.reset(turnstileWidget);
    }
  }

  function isCaptchaError(err) {
    return !!err && (err.code === 'captcha_failed' || /captcha/i.test(err.message || ''));
  }

  function withCaptcha(msgEl, options, call, workingText) {
    if (msgEl.dataset.busy) {
      setMsg(msgEl, captchaState === 'interactive' ? CAPTCHA_INTERACT : CAPTCHA_CHECKING, false);
      return Promise.resolve(null);
    }
    msgEl.dataset.busy = '1';
    function done(value) { delete msgEl.dataset.busy; return value; }
    return captchaOptions(options, msgEl).then(function (ready) {
      if (workingText) setMsg(msgEl, workingText, false);
      return Promise.resolve(call(ready)).then(function (result) {
        resetCaptcha();
        if (result && isCaptchaError(result.error)) {
          setMsg(msgEl, CAPTCHA_WAIT, true);
          return null;
        }
        return result;
      }, function (err) {
        resetCaptcha();
        throw err;
      });
    }, function (err) {
      setMsg(msgEl, (err && err.message) || CAPTCHA_WAIT, true);
      return null;
    }).then(done, function (err) {
      done();
      throw err;
    });
  }

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
    var olympiadVal = document.getElementById('account-target-olympiad');
    client.from('profiles').update({
      country: profileForm.country.value || null,
      education_level: profileForm.educationLevel.value || null,
      target_olympiad: olympiadVal ? (olympiadVal.value || null) : null,
      about: aboutInput.value.trim() || null
    }).eq('id', currentUserId).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      setMsg(msg, 'Profile saved.', false);
    });
  });

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
      var olympiadSelect = document.getElementById('account-target-olympiad');
      if (olympiadSelect) olympiadSelect.value = profile.target_olympiad || '';
      aboutInput.value = profile.about || '';
      aboutInput.dispatchEvent(new Event('input'));
    });
    showScreen('loggedIn');

    if (weakPasswordNotice) {
      weakPasswordNotice = false;
      setMsg(document.getElementById('account-set-password-msg'), 'Your password is shorter than the new minimum of 10 characters. Please choose a new one here.', true);
      return;
    }

    var next = getNextParam();
    if (next) window.location.replace(next);
  }

  document.getElementById('account-signout-btn').addEventListener('click', function () {
    window.PapersAuth.signOut().then(refresh);
  });

  document.getElementById('account-delete-btn').addEventListener('click', function () {
    var msg = document.getElementById('account-delete-msg');
    if (!window.confirm('Delete your account? This permanently removes your login, profile, and leaderboard history and cannot be undone.')) return;
    client.auth.getSession().then(function (result) {
      var session = result.data && result.data.session;
      if (!session) { setMsg(msg, 'Your session expired, log in again and retry.', true); return; }
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
        setMsg(msg, 'Could not delete your account, try again.', true);
      });
    });
  });

  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('account-login-msg');
    var email = loginForm.email.value.trim();
    var password = loginForm.password.value;
    setMsg(msg, 'Logging in…', false);
    withCaptcha(msg, {}, function (options) {
      return client.auth.signInWithPassword({ email: email, password: password, options: options });
    }, 'Logging in…').then(function (result) {
      if (!result) return;
      if (result.error) {
        if (/not confirmed/i.test(result.error.message || '')) {
          setMsg(msg, 'Your email is not confirmed yet. Choose "Email me a sign-in code" below to activate your account.', true);
        } else {
          setMsg(msg, result.error.message, true);
        }
        return;
      }
      setMsg(msg, '', false);
      weakPasswordNotice = !!(result.data && result.data.weakPassword);
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
    withCaptcha(msg, { data: { display_name: displayName } }, function (options) {
      return client.auth.signUp({ email: email, password: password, options: options });
    }, 'Signing up…').then(function (result) {
      if (!result) return;
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      if (result.data && result.data.session) {
        if (window.PostHogEvents) window.PostHogEvents.trackSignup();
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
    withCaptcha(msg, { redirectTo: window.location.origin + '/account/' }, function (options) {
      return client.auth.resetPasswordForEmail(email, options);
    }, 'Sending…').then(function (result) {
      if (!result) return;
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      setMsg(msg, 'Check your email for a reset link.', false);
    });
  });

  var OTP_COOLDOWN_SECONDS = 60;
  var otpEmail = '';
  var otpTimer = null;
  var otpCodeInput = document.getElementById('account-otp-code');
  var otpResendBtn = document.getElementById('account-otp-resend-btn');
  var otpRequestMsg = document.getElementById('account-otp-request-msg');
  var otpVerifyMsg = document.getElementById('account-otp-verify-msg');

  function stopOtpTimer() {
    if (otpTimer) { clearInterval(otpTimer); otpTimer = null; }
  }

  function startOtpCooldown() {
    stopOtpTimer();
    var remaining = OTP_COOLDOWN_SECONDS;
    function tick() {
      if (remaining <= 0) {
        stopOtpTimer();
        otpResendBtn.disabled = false;
        otpResendBtn.textContent = 'Resend code';
        return;
      }
      otpResendBtn.disabled = true;
      otpResendBtn.textContent = 'Resend code in ' + remaining + 's';
      remaining -= 1;
    }
    tick();
    otpTimer = setInterval(tick, 1000);
  }

  function sendOtp(email, msgEl, workingText) {
    var failure = { ok: false, error: 'Could not send a code right now. Please try again shortly.' };
    return captchaOptions({ shouldCreateUser: false }, msgEl).then(function (options) {
      if (msgEl && workingText) setMsg(msgEl, workingText, false);
      return client.auth.signInWithOtp({ email: email, options: options }).then(function (result) {
        resetCaptcha();
        return result;
      }, function (err) {
        resetCaptcha();
        throw err;
      });
    }, function (err) {
      return { captchaMissing: (err && err.message) || CAPTCHA_WAIT };
    }).then(function (result) {
      if (result.captchaMissing) return { ok: false, error: result.captchaMissing };
      var err = result.error;
      if (!err) return { ok: true };
      if (isCaptchaError(err)) return { ok: false, error: CAPTCHA_WAIT };
      var status = err.status || 0;
      if (status === 400 || status === 422) return { ok: true };
      if (status === 429) return { ok: false, error: 'Too many requests. Please wait a minute and try again.' };
      return failure;
    }).catch(function () {
      return failure;
    });
  }

  document.getElementById('account-otp-btn').addEventListener('click', function () {
    otpRequestForm.email.value = loginForm.email.value.trim();
    setMsg(otpRequestMsg, '', false);
    showForm('otp-request');
    otpRequestForm.email.focus();
  });

  document.getElementById('account-otp-request-cancel-btn').addEventListener('click', function () {
    showForm('login');
  });

  otpRequestForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = otpRequestForm.email.value.trim();
    var sendBtn = document.getElementById('account-otp-send-btn');
    setMsg(otpRequestMsg, 'Sending…', false);
    sendBtn.disabled = true;
    sendOtp(email, otpRequestMsg, 'Sending…').then(function (result) {
      sendBtn.disabled = false;
      if (!result.ok) { setMsg(otpRequestMsg, result.error, true); return; }
      setMsg(otpRequestMsg, '', false);
      setMsg(otpVerifyMsg, '', false);
      otpEmail = email;
      otpCodeInput.value = '';
      showForm('otp-verify');
      startOtpCooldown();
      otpCodeInput.focus();
    });
  });

  otpCodeInput.addEventListener('input', function () {
    otpCodeInput.value = otpCodeInput.value.replace(/\D/g, '').slice(0, 6);
  });

  otpResendBtn.addEventListener('click', function () {
    if (otpResendBtn.disabled || !otpEmail) return;
    otpResendBtn.disabled = true;
    setMsg(otpVerifyMsg, 'Sending a new code…', false);
    sendOtp(otpEmail, otpVerifyMsg, 'Sending a new code…').then(function (result) {
      if (!result.ok) {
        setMsg(otpVerifyMsg, result.error, true);
        otpResendBtn.disabled = false;
        return;
      }
      setMsg(otpVerifyMsg, 'A new code is on its way. Use the newest email only.', false);
      startOtpCooldown();
    });
  });

  document.getElementById('account-otp-change-btn').addEventListener('click', function () {
    stopOtpTimer();
    otpRequestForm.email.value = otpEmail;
    setMsg(otpRequestMsg, '', false);
    showForm('otp-request');
    otpRequestForm.email.focus();
  });

  function verifyEmailCode(email, token, type) {
    return client.auth.verifyOtp({ email: email, token: token, type: type });
  }

  otpVerifyForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = otpCodeInput.value.replace(/\D/g, '');
    var verifyBtn = document.getElementById('account-otp-verify-btn');
    if (code.length !== 6) {
      setMsg(otpVerifyMsg, 'Enter the 6-digit code from your email.', true);
      return;
    }
    setMsg(otpVerifyMsg, 'Signing in…', false);
    verifyBtn.disabled = true;
    verifyEmailCode(otpEmail, code, 'email').then(function (result) {
      if (result.error && result.error.status !== 429) return verifyEmailCode(otpEmail, code, 'signup');
      return result;
    }).then(function (result) {
      verifyBtn.disabled = false;
      if (result.error) {
        if (result.error.status === 429) {
          setMsg(otpVerifyMsg, 'Too many attempts. Please wait a minute and try again.', true);
        } else {
          setMsg(otpVerifyMsg, 'That code is wrong or has expired. Check the newest email, or request a new code.', true);
        }
        return;
      }
      stopOtpTimer();
      setMsg(otpVerifyMsg, '', false);
      otpEmail = '';
      refresh();
    }).catch(function () {
      verifyBtn.disabled = false;
      setMsg(otpVerifyMsg, 'Could not verify the code right now. Please try again.', true);
    });
  });

  document.getElementById('account-set-password-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    var msg = document.getElementById('account-set-password-msg');
    setMsg(msg, 'Saving…', false);
    client.auth.updateUser({ password: form.password.value }).then(function (result) {
      if (result.error) { setMsg(msg, result.error.message, true); return; }
      form.reset();
      setMsg(msg, 'Password saved.', false);
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

  // Covers both a "forgot password" recovery link and a magic-link account-setup
  // link (used for form-based registrations, which create the account passwordless
  // via /auth/v1/otp) -- both land here needing a password set before they can use
  // the normal email+password login going forward.
  var isRecovery = /type=(recovery|magiclink|invite)/.test(window.location.hash);

  function refresh() {
    if (isRecovery) { showScreen('recovery'); return; }
    window.PapersAuth.getSession().then(function (session) {
      if (session) renderLoggedIn(session);
      else { showScreen('loggedOut'); showForm('login'); loadTurnstile(); }
    });
  }

  client.auth.onAuthStateChange(function (event) {
    if (event === 'PASSWORD_RECOVERY') { isRecovery = true; showScreen('recovery'); }
  });

  showScreen('loading');
  refresh();
})();
