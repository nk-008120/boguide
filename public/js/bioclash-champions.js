/*
 * Renders the BiOClash "Champions" podium from Supabase's
 * bioclash_leaderboard view (supabase/migrations/006_bioclash_results.sql)
 * — a manually-populated results table, not an automated scoring pipeline
 * (BiOClash has no question bank or timed-round system yet). Read-only,
 * same posture as papers-leaderboard-overall.js. The view is ordered
 * newest-result-first; this takes the top row's `season` value as "the
 * current season" and renders only that group, so a future season's
 * results naturally replace the old ones with no code change.
 */
(function () {
  'use strict';

  var root = document.getElementById('bioclash-champions-root');
  if (!root) return;

  var statusEl = document.getElementById('bioclash-champions-status');
  var podium = document.getElementById('bioclash-champions-podium');
  var table = document.getElementById('bioclash-champions-table');
  var tbody = document.getElementById('bioclash-champions-tbody');

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  var MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

  function renderPodiumSlot(r) {
    return (
      '<div class="bioclash-champion-slot bioclash-champion-rank-' + r.placement + '">' +
      '<div class="bioclash-champion-medal">' + (MEDALS[r.placement] || '🎖️') + '</div>' +
      '<div class="bioclash-champion-avatar-wrap">' + window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) + '</div>' +
      '<div class="bioclash-champion-name">' + window.PapersAuth.flagHTML(r.country) + '<span>' + escapeHTML(r.display_name) + '</span></div>' +
      (r.score_label ? '<div class="bioclash-champion-score">' + escapeHTML(r.score_label) + '</div>' : '') +
      '</div>'
    );
  }

  function renderRow(r) {
    return '<tr>' +
      '<td>' + r.placement + '</td>' +
      '<td class="papers-leaderboard-namecell">' +
        window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) +
        window.PapersAuth.flagHTML(r.country) +
        '<span class="papers-leaderboard-name">' + escapeHTML(r.display_name) + '</span>' +
      '</td>' +
      '<td>' + (r.score_label ? escapeHTML(r.score_label) : '—') + '</td>' +
      '</tr>';
  }

  function render(rows) {
    if (!rows.length) {
      statusEl.textContent = 'Season 1 hasn’t concluded yet — no champions crowned. ' ;
      var link = document.createElement('a');
      link.href = '/bioclash/';
      link.textContent = 'Get notified when it opens →';
      statusEl.appendChild(link);
      return;
    }

    var season = rows[0].season;
    var seasonRows = rows.filter(function (r) { return r.season === season; })
      .sort(function (a, b) { return a.placement - b.placement; });

    var top3 = seasonRows.filter(function (r) { return r.placement <= 3; });
    var rest = seasonRows.filter(function (r) { return r.placement > 3; });

    if (top3.length) {
      podium.innerHTML = top3.map(renderPodiumSlot).join('');
      podium.hidden = false;
    }

    if (rest.length) {
      tbody.innerHTML = rest.map(renderRow).join('');
      table.hidden = false;
    }

    statusEl.textContent = season;
    statusEl.classList.add('bioclash-champions-season-label');
  }

  function load() {
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      statusEl.textContent = "Champions aren't configured on this environment yet.";
      return;
    }
    var client = window.PapersAuth.getClient();
    client.from('bioclash_leaderboard').select('*').limit(100).then(function (result) {
      if (result.error) {
        statusEl.textContent = 'Could not load Champions right now — try refreshing.';
        return;
      }
      render(result.data || []);
    }).catch(function () {
      statusEl.textContent = 'Could not load Champions right now — try refreshing.';
    });
  }

  load();
})();
