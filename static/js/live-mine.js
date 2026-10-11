(function () {
  'use strict';

  var box = document.getElementById('live-mine');
  var Auth = window.PapersAuth;
  if (!box || !Auth || !Auth.isConfigured()) return;

  var canPullOut = box.hasAttribute('data-pullout');

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function load() {
    return Auth.getSession().then(function (session) {
      if (!session) {
        box.innerHTML = '';
        return;
      }
      return Auth.getClient().from('live_registrations')
        .select('id, live_sessions(starts_at, duration_min, topic, status)')
        .then(function (res) {
          var now = Date.now();
          var list = (res.data || []).filter(function (r) {
            var s = r.live_sessions;
            return s && s.status === 'scheduled' && new Date(s.starts_at).getTime() + s.duration_min * 60000 > now;
          }).sort(function (a, b) {
            return new Date(a.live_sessions.starts_at) - new Date(b.live_sessions.starts_at);
          });
          var rows = list.map(function (r) {
            var d = new Date(r.live_sessions.starts_at);
            var out = canPullOut && d.getTime() > now
              ? '<button type="button" class="live-mine-out" data-id="' + r.id + '">Pull out</button>' : '';
            return '<li><time>' + esc(d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) + ' / ' +
              d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })) + '</time>' +
              '<a href="/live/">' + esc(r.live_sessions.topic) + '</a>' + out + '</li>';
          }).join('');
          box.innerHTML = '<p class="live-mine-label">BiOLive / ' + (rows ? 'Your next live sessions' : 'Weekend paper solving') + '</p>' +
            (rows ? '<ul class="live-mine-list">' + rows + '</ul>' : '') +
            '<a class="live-mine-more" href="/live/">' + (rows ? 'Open the calendar' : 'Join a live session this weekend') + ' &rarr;</a>';
        });
    });
  }

  box.addEventListener('click', function (e) {
    var btn = e.target.closest('.live-mine-out');
    if (!btn || !window.confirm('Pull out of this session?')) return;
    btn.disabled = true;
    Auth.getClient().from('live_registrations').delete().eq('id', btn.dataset.id).then(load);
  });

  load();
  Auth.onChange(load);
})();
