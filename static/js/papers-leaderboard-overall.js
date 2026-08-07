/*
 * Renders the overall/aggregate leaderboard from Supabase's
 * leaderboard_overall view (sum of each user's best-per-round results —
 * see supabase/schema.sql). Same read-only posture as papers-leaderboard.js.
 */
(function () {
  'use strict';

  var root = document.getElementById('papers-leaderboard-overall-root');
  if (!root) return;

  var statusEl = document.getElementById('papers-leaderboard-overall-status');
  var table = document.getElementById('papers-leaderboard-overall-table');
  var tbody = document.getElementById('papers-leaderboard-overall-tbody');

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  function render(rows) {
    if (!rows.length) {
      statusEl.textContent = 'No submissions yet — log in and submit a Timed Attempt to be the first on the board.';
      return;
    }
    tbody.innerHTML = rows.map(function (r) {
      return '<tr' + (r.isSelf ? ' class="papers-leaderboard-self"' : '') + '>' +
        '<td>' + r.rank + '</td>' +
        '<td>' + escapeHTML(r.display_name) + '</td>' +
        '<td>' + r.rounds_completed + '</td>' +
        '<td>' + r.total_correct + '/' + r.total_statements + ' (' + r.overall_pct + '%)</td>' +
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
