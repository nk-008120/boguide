(function () {
  'use strict';

  var root = document.getElementById('papers-leaderboard-root');
  if (!root) return;
  var dataEl = document.getElementById('papers-leaderboard-data');
  if (!dataEl) return;
  var DATA = JSON.parse(dataEl.textContent);

  var statusEl = document.getElementById('papers-leaderboard-status');
  var table = document.getElementById('papers-leaderboard-table');
  var tbody = document.getElementById('papers-leaderboard-tbody');

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  function formatTime(sec) {
    sec = Math.round(sec || 0);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  function render(rows) {
    if (!rows.length) {
      statusEl.textContent = 'No submissions yet for this round — log in and submit a Timed Attempt to be the first on the board.';
      return;
    }
    tbody.innerHTML = rows.map(function (r) {
      return '<tr' + (r.isSelf ? ' class="papers-leaderboard-self"' : '') + '>' +
        '<td>' + r.rank + '</td>' +
        '<td class="papers-leaderboard-namecell">' +
          window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) +
          window.PapersAuth.flagHTML(r.country) +
          '<span class="papers-leaderboard-name">' + escapeHTML(r.display_name) + '</span>' +
        '</td>' +
        '<td>' + r.total_correct + '/' + r.total_statements + ' (' + r.score_pct + '%)</td>' +
        '<td>' + formatTime(r.duration_sec) + '</td>' +
        '</tr>';
    }).join('');
    statusEl.hidden = true;
    table.hidden = false;
  }

  function load() {
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      statusEl.textContent = "The leaderboard isn't configured on this environment yet.";
      return;
    }
    var client = window.PapersAuth.getClient();
    Promise.all([
      client.from('leaderboard_per_round').select('*')
        .eq('olympiad', DATA.olympiad).eq('year', DATA.year).eq('round_id', DATA.roundId)
        .order('rank', { ascending: true }).limit(100),
      window.PapersAuth.getSession()
    ]).then(function (results) {
      var result = results[0];
      var session = results[1];
      if (result.error) {
        statusEl.textContent = 'Could not load the leaderboard right now — try refreshing.';
        return;
      }
      var rows = (result.data || []).map(function (r) {
        r.isSelf = !!(session && session.user && session.user.id === r.user_id);
        return r;
      });
      render(rows);
    }).catch(function () {
      statusEl.textContent = 'Could not load the leaderboard right now — try refreshing.';
    });
  }

  load();
})();
