(function () {
  'use strict';

  var root = document.getElementById('papers-leaderboard-overall-root');
  if (!root) return;

  var statusEl = document.getElementById('papers-leaderboard-overall-status');
  var podium = document.getElementById('papers-hof-podium');
  var table = document.getElementById('papers-leaderboard-overall-table');
  var tbody = document.getElementById('papers-leaderboard-overall-tbody');

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  var MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

  function renderPodiumSlot(r) {
    return (
      '<div class="papers-hof-slot papers-hof-rank-' + r.rank + (r.isSelf ? ' papers-leaderboard-self' : '') + '">' +
      '<div class="papers-hof-medal">' + MEDALS[r.rank] + '</div>' +
      '<div class="papers-hof-avatar-wrap">' + window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) + '</div>' +
      '<div class="papers-hof-name">' + window.PapersAuth.flagHTML(r.country) + '<span>' + escapeHTML(r.display_name) + '</span></div>' +
      '<div class="papers-hof-score">' + r.total_correct + '/' + r.total_statements + ' (' + r.overall_pct + '%)</div>' +
      '<div class="papers-hof-rounds">' + r.rounds_completed + ' round' + (r.rounds_completed === 1 ? '' : 's') + '</div>' +
      '</div>'
    );
  }

  function renderRow(r) {
    return '<tr' + (r.isSelf ? ' class="papers-leaderboard-self"' : '') + '>' +
      '<td>' + r.rank + '</td>' +
      '<td class="papers-leaderboard-namecell">' +
        window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) +
        window.PapersAuth.flagHTML(r.country) +
        '<span class="papers-leaderboard-name">' + escapeHTML(r.display_name) + '</span>' +
      '</td>' +
      '<td>' + r.rounds_completed + '</td>' +
      '<td>' + r.total_correct + '/' + r.total_statements + ' (' + r.overall_pct + '%)</td>' +
      '</tr>';
  }

  function render(rows) {
    if (!rows.length) {
      statusEl.textContent = 'No submissions yet — log in and submit a Timed Attempt to be the first on the board.';
      return;
    }

    var top3 = rows.filter(function (r) { return r.rank <= 3; });
    var rest = rows.filter(function (r) { return r.rank > 3; });

    if (top3.length) {
      podium.innerHTML = top3.map(renderPodiumSlot).join('');
      podium.hidden = false;
    }

    if (rest.length) {
      tbody.innerHTML = rest.map(renderRow).join('');
      table.hidden = false;
    }

    statusEl.hidden = true;
  }

  function load() {
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      statusEl.textContent = "The leaderboard isn't configured on this environment yet.";
      return;
    }
    var client = window.PapersAuth.getClient();
    Promise.all([
      client.from('leaderboard_overall').select('*').order('rank', { ascending: true }).limit(100),
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
