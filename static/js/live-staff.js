(function () {
  'use strict';

  var root = document.getElementById('live-staff-root');
  if (!root) return;

  var Auth = window.PapersAuth;
  var KEY_STORE = 'biolive_staff_key';
  var ERRORS = {
    not_authenticated: 'Your session expired. Sign in again.',
    not_staff: 'This account is not marked as BiOGuide staff. Ask Nishit to enable it, then reload.',
    bad_key: 'That key is not valid.',
    locked: 'Too many wrong keys. This account is locked out of the staff page for 15 minutes.',
    not_found: 'That item no longer exists. Reload the page.'
  };

  var state = { key: '', sessions: [], open: {}, editing: null, msg: '' };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function readKey() {
    try { return sessionStorage.getItem(KEY_STORE) || ''; } catch (e) { return ''; }
  }

  function storeKey(k) {
    try { k ? sessionStorage.setItem(KEY_STORE, k) : sessionStorage.removeItem(KEY_STORE); } catch (e) {}
  }

  function call(fn, args) {
    args.p_key = state.key;
    return Auth.getClient().rpc(fn, args).then(function (res) {
      if (res.error) return { ok: false, error: res.error.code === '23514' ? 'invalid' : 'network' };
      return res.data;
    });
  }

  function errorText(code) {
    if (code === 'invalid') return 'Check the fields: topic needs 3 to 200 characters, duration 15 to 480 minutes, and a paper link must start with / or https://.';
    return ERRORS[code] || 'Something went wrong. Please try again.';
  }

  function fmt(d) {
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }) +
      ' ' + d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  function localInput(d) {
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + 'T' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function show(html) {
    root.innerHTML = html;
  }

  function gate(text, extra) {
    show('<div class="live-staff-panel"><p class="live-hint">' + text + '</p>' + (extra || '') + '</div>');
  }

  function keyForm(error) {
    show('<div class="live-staff-panel"><form class="live-form" id="live-staff-key-form">' +
      '<label>Staff key<input type="password" name="key" required minlength="32" maxlength="64" autocomplete="off" spellcheck="false"></label>' +
      '<div class="live-actions"><button type="submit" class="papers-nav-btn papers-nav-next">Unlock</button></div>' +
      (error ? '<p class="live-msg is-error" role="status">' + esc(error) + '</p>' : '') +
      '<p class="live-hint">The key stays in this browser tab only and is cleared when the tab closes.</p></form></div>');
  }

  function formHTML() {
    var s = state.editing;
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your local time';
    return '<form class="live-form" id="live-staff-session-form">' +
      '<div class="live-form-row">' +
      '<label>Start (' + esc(tz) + ')<input type="datetime-local" name="starts_at" required value="' + (s ? localInput(new Date(s.starts_at)) : '') + '"></label>' +
      '<label>Duration in minutes<input type="number" name="duration_min" required min="15" max="480" step="5" value="' + (s ? s.duration_min : 90) + '"></label>' +
      '<label>Host name<input type="text" name="host_name" required maxlength="80" value="' + esc(s ? s.host_name : '') + '"></label></div>' +
      '<label>Paper or topic<input type="text" name="topic" required minlength="3" maxlength="200" placeholder="IBO 2017 Theoretical A, Q1 to Q15" value="' + esc(s ? s.topic : '') + '"></label>' +
      '<label>Paper link (optional, /papers/... or https://...)<input type="text" name="paper_url" maxlength="500" value="' + esc(s ? s.paper_url : '') + '"></label>' +
      '<label>Note for students (optional)<textarea name="note" rows="3" maxlength="1000">' + esc(s ? s.note : '') + '</textarea></label>' +
      '<div class="live-actions"><button type="submit" class="papers-nav-btn papers-nav-next">' + (s ? 'Save changes' : 'Create session') + '</button>' +
      (s ? '<button type="button" class="papers-nav-btn" data-act="cancel-edit">Discard changes</button>' : '') + '</div>' +
      (state.msg ? '<p class="live-msg is-error" role="status">' + esc(state.msg) + '</p>' : '') + '</form>';
  }

  function rosterHTML(s) {
    if (!s.registrations.length) return '<p class="live-hint">Nobody has registered yet.</p>';
    return '<div class="live-roster-wrap"><table class="live-roster"><thead><tr>' +
      '<th>Name</th><th>Email</th><th>Olympiad</th><th>Doubt</th><th>Attended</th></tr></thead><tbody>' +
      s.registrations.map(function (r) {
        return '<tr><td>' + esc(r.real_name) + (r.display_name ? '<br><small>' + esc(r.display_name) + '</small>' : '') + '</td>' +
          '<td>' + esc(r.email) + '</td><td>' + esc((r.target_olympiad || '').toUpperCase()) + '</td>' +
          '<td class="is-question">' + esc(r.question) + '</td>' +
          '<td><input type="checkbox" data-attend="' + r.id + '"' + (r.attended ? ' checked' : '') + ' aria-label="Attended"></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function sessionHTML(s) {
    var n = s.registrations.length;
    var off = s.status === 'cancelled';
    return '<details class="live-staff-session" data-id="' + s.id + '"' + (state.open[s.id] ? ' open' : '') + '>' +
      '<summary><time>' + esc(fmt(new Date(s.starts_at))) + '</time><strong>' + esc(s.topic) + '</strong>' +
      '<span>' + esc(s.host_name) + '</span><span class="live-badge' + (off ? '' : ' is-on') + '">' + (off ? 'Cancelled' : n + ' registered') + '</span></summary>' +
      '<div class="live-staff-body"><div class="live-actions">' +
      (n ? '<button type="button" class="papers-nav-btn papers-nav-next" data-act="copy" data-id="' + s.id + '">Copy all emails</button>' +
        '<button type="button" class="papers-nav-btn" data-act="mail" data-id="' + s.id + '">Email all (BCC)</button>' : '') +
      '<button type="button" class="papers-nav-btn" data-act="edit" data-id="' + s.id + '">Edit</button>' +
      '<button type="button" class="papers-nav-btn" data-act="' + (off ? 'restore' : 'cancel') + '" data-id="' + s.id + '">' + (off ? 'Restore session' : 'Cancel session') + '</button>' +
      '</div>' + rosterHTML(s) + '</div></details>';
  }

  function render() {
    var now = Date.now();
    var ends = function (s) { return new Date(s.starts_at).getTime() + s.duration_min * 60000; };
    var next = state.sessions.filter(function (s) { return ends(s) > now; });
    var past = state.sessions.filter(function (s) { return ends(s) <= now; }).reverse();
    show('<div class="live-staff-panel"><div class="live-staff-bar">' +
      '<p class="live-card-label">' + (state.editing ? 'Edit session' : 'New session') + '</p>' +
      '<button type="button" class="papers-nav-btn" data-act="lock">Lock this page</button></div>' + formHTML() + '</div>' +
      '<p class="live-label">Upcoming sessions</p>' + (next.map(sessionHTML).join('') || '<p class="live-hint">None scheduled.</p>') +
      (past.length ? '<p class="live-label">Past sessions</p>' + past.map(sessionHTML).join('') : ''));
  }

  function refresh() {
    return call('live_staff_overview', {}).then(function (res) {
      if (!res.ok) {
        if (res.error === 'bad_key' || res.error === 'locked') {
          storeKey('');
          state.key = '';
          keyForm(errorText(res.error));
        } else {
          gate(esc(errorText(res.error)));
        }
        return;
      }
      storeKey(state.key);
      state.sessions = res.sessions;
      render();
    });
  }

  function find(id) {
    return state.sessions.filter(function (s) { return s.id === id; })[0];
  }

  root.addEventListener('toggle', function (e) {
    if (e.target.dataset && e.target.dataset.id) state.open[e.target.dataset.id] = e.target.open;
  }, true);

  root.addEventListener('submit', function (e) {
    e.preventDefault();
    var form = e.target;
    if (form.id === 'live-staff-key-form') {
      state.key = form.key.value.trim();
      refresh();
      return;
    }
    if (form.id !== 'live-staff-session-form') return;
    form.querySelector('button[type="submit"]').disabled = true;
    call('live_staff_save_session', {
      p_id: state.editing ? state.editing.id : null,
      p_starts_at: new Date(form.starts_at.value).toISOString(),
      p_duration_min: Number(form.duration_min.value),
      p_topic: form.topic.value,
      p_paper_url: form.paper_url.value,
      p_host_name: form.host_name.value,
      p_note: form.note.value
    }).then(function (res) {
      if (!res.ok) {
        state.msg = errorText(res.error);
        render();
        return;
      }
      state.msg = '';
      state.editing = null;
      return refresh();
    });
  });

  root.addEventListener('change', function (e) {
    var id = e.target.dataset && e.target.dataset.attend;
    if (!id) return;
    var box = e.target;
    call('live_staff_set_attendance', { p_registration_id: id, p_attended: box.checked }).then(function (res) {
      if (!res.ok) box.checked = !box.checked;
    });
  });

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-act]');
    if (!t) return;
    var act = t.dataset.act;
    var s = t.dataset.id ? find(t.dataset.id) : null;
    if (act === 'lock') {
      storeKey('');
      state.key = '';
      keyForm();
    } else if (act === 'cancel-edit') {
      state.editing = null;
      state.msg = '';
      render();
    } else if (act === 'edit') {
      state.editing = s;
      state.msg = '';
      render();
      root.scrollIntoView({ block: 'start' });
    } else if (act === 'cancel' || act === 'restore') {
      if (act === 'cancel' && !window.confirm('Cancel this session? It stays on the calendar marked as cancelled. Remember to email the registered students.')) return;
      call('live_staff_set_status', { p_id: s.id, p_status: act === 'cancel' ? 'cancelled' : 'scheduled' }).then(refresh);
    } else if (act === 'copy' || act === 'mail') {
      var emails = s.registrations.map(function (r) { return r.email; });
      if (act === 'mail') {
        location.href = 'mailto:?bcc=' + encodeURIComponent(emails.join(',')) + '&subject=' + encodeURIComponent('BiOLive: ' + s.topic);
        return;
      }
      navigator.clipboard.writeText(emails.join(', ')).then(function () {
        t.textContent = 'Copied ' + emails.length;
        setTimeout(function () { t.textContent = 'Copy all emails'; }, 2000);
      });
    }
  });

  if (!Auth || !Auth.isConfigured()) {
    gate('The staff page is not available in this environment.');
    return;
  }
  Auth.getSession().then(function (session) {
    if (!session) {
      gate('Sign in with your BiOGuide staff account first.',
        '<div class="live-actions"><a class="papers-nav-btn papers-nav-next" href="/account/?next=/live/staff/">Sign in</a></div>');
      return;
    }
    return Auth.getProfile(session.user.id).then(function (profile) {
      if (!profile || !profile.is_staff) {
        gate(esc(ERRORS.not_staff));
        return;
      }
      state.key = readKey();
      if (state.key) return refresh();
      keyForm();
    });
  });
})();
