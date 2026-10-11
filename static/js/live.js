(function () {
  'use strict';

  var root = document.getElementById('live-root');
  if (!root) return;

  var Auth = window.PapersAuth;
  var statusEl = document.getElementById('live-status');
  var appEl = document.getElementById('live-app');
  var CUTOFF_MS = 24 * 60 * 60 * 1000;
  var DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  var OLYMPIADS = [['', 'Not sure yet'], ['ibo', 'IBO'], ['usabo', 'USABO'], ['inbo', 'INBO'], ['other', 'Another olympiad']];

  var state = { user: null, profile: null, sessions: [], counts: {}, mine: {}, cursor: null, day: null, msg: null };

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function dayKey(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }

  function fmtDate(d, short) {
    return d.toLocaleDateString(undefined, short
      ? { weekday: 'short', day: 'numeric', month: 'short' }
      : { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function fmtTime(d) {
    return d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  }

  function phase(s) {
    var now = Date.now();
    var start = s.start.getTime();
    if (s.status === 'cancelled') return 'cancelled';
    if (now >= start + s.duration_min * 60000) return 'ended';
    if (now >= start) return 'running';
    if (now >= start - CUTOFF_MS) return 'closed';
    return 'open';
  }

  function upcoming() {
    return state.sessions.filter(function (s) { return s.start.getTime() + s.duration_min * 60000 > Date.now(); });
  }

  function load() {
    var client = Auth && Auth.getClient();
    if (!client) {
      statusEl.textContent = 'The live schedule is not available in this environment.';
      return Promise.resolve();
    }
    var jobs = [
      client.from('live_sessions').select('*').order('starts_at'),
      client.rpc('live_session_counts'),
      state.user ? client.from('live_registrations').select('id, session_id, real_name, target_olympiad, attended') : Promise.resolve({ data: [] })
    ];
    return Promise.all(jobs).then(function (res) {
      if (res[0].error) {
        statusEl.textContent = 'Could not load the schedule. Please reload the page.';
        return;
      }
      state.sessions = (res[0].data || []).map(function (s) {
        s.start = new Date(s.starts_at);
        return s;
      });
      state.counts = {};
      (res[1].data || []).forEach(function (c) { state.counts[c.session_id] = Number(c.registered); });
      state.mine = {};
      (res[2].data || []).forEach(function (r) { state.mine[r.session_id] = r; });
      if (!state.day) {
        var next = upcoming().filter(function (s) { return s.status !== 'cancelled'; })[0];
        var base = next ? next.start : new Date();
        state.day = dayKey(base);
        state.cursor = new Date(base.getFullYear(), base.getMonth(), 1);
      }
      statusEl.hidden = true;
      appEl.hidden = false;
      render();
    });
  }

  function byDay() {
    var map = {};
    state.sessions.forEach(function (s) {
      var k = dayKey(s.start);
      (map[k] = map[k] || []).push(s);
    });
    return map;
  }

  function calendarHTML(map) {
    var y = state.cursor.getFullYear();
    var m = state.cursor.getMonth();
    var offset = (new Date(y, m, 1).getDay() + 6) % 7;
    var days = new Date(y, m + 1, 0).getDate();
    var today = dayKey(new Date());
    var html = '<div class="live-cal-head">' +
      '<button type="button" class="live-cal-nav" data-nav="-1" aria-label="Previous month">&larr;</button>' +
      '<p class="live-cal-month">' + esc(state.cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })) + '</p>' +
      '<button type="button" class="live-cal-nav" data-nav="1" aria-label="Next month">&rarr;</button></div>' +
      '<div class="live-cal-grid">';
    DOW.forEach(function (d) { html += '<span class="live-cal-dow">' + d + '</span>'; });
    for (var i = 0; i < offset; i++) html += '<span></span>';
    for (var d = 1; d <= days; d++) {
      var key = y + '-' + (m + 1) + '-' + d;
      var list = map[key];
      var cls = 'live-day' + (key === today ? ' is-today' : '');
      if (!list) {
        html += '<span class="' + cls + '">' + d + '</span>';
        continue;
      }
      if (list.every(function (s) { return s.status === 'cancelled'; })) cls += ' is-off';
      if (list.some(function (s) { return state.mine[s.id]; })) cls += ' is-mine';
      if (key === state.day) cls += ' is-selected';
      html += '<button type="button" class="' + cls + '" data-day="' + key + '" aria-label="' +
        esc(fmtDate(list[0].start) + ', ' + list.length + (list.length === 1 ? ' session' : ' sessions')) + '">' + d + '</button>';
    }
    html += '</div><p class="live-cal-key"><span><i></i>Session</span><span><i class="is-mine"></i>You are registered</span>' +
      '<span>Times shown in ' + esc(Intl.DateTimeFormat().resolvedOptions().timeZone || 'your time zone') + '</span></p>';
    return html;
  }

  function agendaHTML() {
    var list = upcoming();
    if (!list.length) return '';
    return list.map(function (s) {
      var key = dayKey(s.start);
      return '<button type="button" data-day="' + key + '"' + (key === state.day ? ' class="is-selected"' : '') + '>' +
        '<time>' + esc(fmtDate(s.start, true) + ' / ' + fmtTime(s.start)) + '</time><strong>' + esc(s.topic) + '</strong></button>';
    }).join('');
  }

  function actionsHTML(s) {
    var p = phase(s);
    var reg = state.mine[s.id];
    var msg = state.msg && state.msg.id === s.id
      ? '<p class="live-msg' + (state.msg.error ? ' is-error' : '') + '" role="status">' + esc(state.msg.text) + '</p>' : '';
    if (p === 'cancelled') {
      return '<p class="live-hint">This session was cancelled. ' + (reg ? 'The host will email you about it.' : '') + '</p>';
    }
    if (p === 'ended') {
      return '<p class="live-hint">This session has ended.' + (reg && reg.attended ? ' You attended.' : '') + '</p>';
    }
    if (reg) {
      return '<p class="live-hint"><span class="live-badge is-on">You are registered</span></p>' +
        '<p class="live-hint">The host emails the Zoom link to your account address before the session starts. Check spam if it has not arrived an hour before.</p>' +
        '<div class="live-actions">' +
        '<button type="button" class="papers-nav-btn papers-nav-next" data-ics="' + s.id + '">Add to calendar</button>' +
        (p !== 'running' ? '<button type="button" class="papers-nav-btn" data-pullout="' + s.id + '">Pull out</button>' : '') +
        '</div>' + msg;
    }
    if (p !== 'open') {
      return '<p class="live-hint">Registration closed 24 hours before the start, so the host could send the Zoom link to a fixed list.</p>';
    }
    if (!state.user) {
      return '<div class="live-actions"><a class="papers-nav-btn papers-nav-next" href="/account/?next=/live/">Sign in to register</a></div>' +
        '<p class="live-hint">BiOLive is free for every BiOGuide account holder.</p>';
    }
    var anyReg = Object.keys(state.mine).map(function (k) { return state.mine[k]; })[0];
    var name = anyReg ? anyReg.real_name : '';
    var target = anyReg ? anyReg.target_olympiad : (state.profile && state.profile.target_olympiad) || '';
    return '<form class="live-form" data-session="' + s.id + '">' +
      '<div class="live-form-row">' +
      '<label>Your name<input type="text" name="real_name" required minlength="2" maxlength="80" autocomplete="name" value="' + esc(name) + '"></label>' +
      '<label>Target olympiad<select name="target_olympiad">' + OLYMPIADS.map(function (o) {
        return '<option value="' + o[0] + '"' + (o[0] === (target || '') ? ' selected' : '') + '>' + o[1] + '</option>';
      }).join('') + '</select></label></div>' +
      '<label>A doubt or question for the host (optional)<textarea name="question" rows="3" maxlength="1000"></textarea></label>' +
      '<p class="live-consent">Your name, your account email and these answers are shared with the BiOGuide team so the host can email you the Zoom link. See the <a href="/privacy/">Privacy Policy</a>.</p>' +
      '<div class="live-actions"><button type="submit" class="papers-nav-btn papers-nav-next">Register</button></div>' + msg +
      '</form>';
  }

  function cardHTML(s) {
    var end = new Date(s.start.getTime() + s.duration_min * 60000);
    var count = state.counts[s.id] || 0;
    return '<article class="live-card">' +
      '<p class="live-card-label">' + esc(fmtDate(s.start, true)) + ' / ' + s.duration_min + ' min' +
      (s.status === 'cancelled' ? ' / Cancelled' : '') + '</p>' +
      '<p class="live-card-title">' + esc(s.topic) + '</p>' +
      '<dl class="live-meta">' +
      '<dt>When</dt><dd>' + esc(fmtDate(s.start)) + '<br>' + esc(fmtTime(s.start) + ' to ' + fmtTime(end)) +
      '<small>' + s.start.toISOString().slice(11, 16) + ' UTC</small></dd>' +
      '<dt>Host</dt><dd>' + esc(s.host_name) + '</dd>' +
      '<dt>Going</dt><dd>' + count + (count === 1 ? ' student' : ' students') + '</dd>' +
      (s.paper_url ? '<dt>Paper</dt><dd><a href="' + esc(s.paper_url) + '">Open the paper</a></dd>' : '') +
      '</dl>' +
      (s.note ? '<p class="live-note">' + esc(s.note) + '</p>' : '') +
      actionsHTML(s) + '</article>';
  }

  function panelHTML(map) {
    var list = map[state.day];
    if (list) return list.map(cardHTML).join('');
    return '<article class="live-card"><p class="live-card-label">No session selected</p>' +
      '<p class="live-hint">' + (upcoming().length
        ? 'Pick a marked day on the calendar to see what is being solved and to register.'
        : 'No sessions are scheduled yet. New weekends are added regularly, so check back soon.') + '</p></article>';
  }

  function mineHTML() {
    var list = upcoming().filter(function (s) { return state.mine[s.id] && s.status !== 'cancelled'; });
    if (!list.length) return '';
    return '<p class="live-mine-label">Your sessions</p><ul class="live-mine-list">' + list.map(function (s) {
      return '<li><time>' + esc(fmtDate(s.start, true) + ' / ' + fmtTime(s.start)) + '</time>' +
        '<button type="button" class="live-mine-pick" data-day="' + dayKey(s.start) + '">' + esc(s.topic) + '</button></li>';
    }).join('') + '</ul>';
  }

  function archiveHTML() {
    var list = state.sessions.filter(function (s) { return phase(s) === 'ended'; }).reverse().slice(0, 30);
    if (!list.length) return '';
    return '<p class="live-label">Past sessions</p><ul class="live-archive">' + list.map(function (s) {
      var reg = state.mine[s.id];
      return '<li><time>' + esc(fmtDate(s.start, true) + ' ' + s.start.getFullYear()) + '</time><strong>' + esc(s.topic) + '</strong>' +
        '<span>' + esc(s.host_name) + (reg && reg.attended ? ' / You attended' : '') + '</span></li>';
    }).join('') + '</ul>';
  }

  function render() {
    var map = byDay();
    document.getElementById('live-mine').innerHTML = mineHTML();
    document.getElementById('live-cal').innerHTML = calendarHTML(map);
    document.getElementById('live-agenda').innerHTML = agendaHTML();
    document.getElementById('live-panel').innerHTML = panelHTML(map);
    document.getElementById('live-archive').innerHTML = archiveHTML();
  }

  function findSession(id) {
    return state.sessions.filter(function (s) { return s.id === id; })[0];
  }

  function downloadIcs(s) {
    var stamp = function (d) { return d.toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; };
    var clean = function (t) { return String(t).replace(/([,;\\])/g, '\\$1').replace(/\r?\n/g, '\\n'); };
    var end = new Date(s.start.getTime() + s.duration_min * 60000);
    var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//BiOGuide//BiOLive//EN', 'BEGIN:VEVENT',
      'UID:' + s.id + '@bioguide', 'DTSTAMP:' + stamp(new Date()), 'DTSTART:' + stamp(s.start), 'DTEND:' + stamp(end),
      'SUMMARY:' + clean('BiOLive: ' + s.topic),
      'DESCRIPTION:' + clean('Hosted by ' + s.host_name + '. The Zoom link arrives by email from the host.'),
      'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    a.download = 'biolive-session.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('[data-nav], [data-day], [data-ics], [data-pullout]');
    if (!t) return;
    if (t.dataset.nav) {
      state.cursor = new Date(state.cursor.getFullYear(), state.cursor.getMonth() + Number(t.dataset.nav), 1);
      render();
    } else if (t.dataset.day) {
      var parts = t.dataset.day.split('-');
      state.day = t.dataset.day;
      state.cursor = new Date(Number(parts[0]), Number(parts[1]) - 1, 1);
      state.msg = null;
      render();
      if (!t.classList.contains('live-day')) document.getElementById('live-panel').scrollIntoView({ block: 'nearest' });
    } else if (t.dataset.ics) {
      downloadIcs(findSession(t.dataset.ics));
    } else if (t.dataset.pullout) {
      var id = t.dataset.pullout;
      if (!window.confirm('Pull out of this session? You can register again until 24 hours before it starts.')) return;
      t.disabled = true;
      Auth.getClient().from('live_registrations').delete().eq('id', state.mine[id].id).then(function (res) {
        state.msg = res.error ? { id: id, error: true, text: 'Could not pull out. Please try again.' } : null;
        return load();
      });
    }
  });

  root.addEventListener('submit', function (e) {
    var form = e.target.closest('.live-form');
    if (!form) return;
    e.preventDefault();
    var id = form.dataset.session;
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    Auth.getClient().from('live_registrations').insert({
      session_id: id,
      real_name: form.real_name.value.trim(),
      target_olympiad: form.target_olympiad.value || null,
      question: form.question.value.trim() || null
    }).then(function (res) {
      if (res.error) {
        var text = res.error.code === '23505' ? 'You are already registered for this session.'
          : res.error.code === '42501' ? 'Registration for this session has closed.'
          : 'Could not register. Check your name and try again.';
        state.msg = { id: id, error: true, text: text };
      } else {
        state.msg = { id: id, error: false, text: 'You are in. See you there.' };
      }
      return load();
    });
  });

  function start(session) {
    state.user = session ? session.user : null;
    var profile = state.user ? Auth.getProfile(state.user.id).catch(function () { return null; }) : Promise.resolve(null);
    return profile.then(function (p) {
      state.profile = p;
      return load();
    });
  }

  if (!Auth || !Auth.isConfigured()) {
    statusEl.textContent = 'The live schedule is not available in this environment.';
    return;
  }
  Auth.getSession().then(start).then(function () {
    Auth.onChange(function (session) {
      var id = session ? session.user.id : null;
      if (id !== (state.user ? state.user.id : null)) start(session);
    });
  });
})();
