/*
 * Renders BiOClash's cumulative "Season Champions" standing from
 * Supabase's bioclash_season_standings view (supabase/migrations/
 * 013_bioclash_season_scoring.sql) — sum of each round's
 * time_normalized_z * season_weight per user, for the season. Same
 * hand-entered-results posture as bioclash-champions.js (no automated
 * scoring pipeline — see scripts/bioclash-score-round.js), just summed
 * across a season instead of showing one round. The view has no separate
 * "placement" column (it's a plain aggregate), so rank here is just
 * position after sorting by season_index descending — ties get the same
 * rank number by design (see renderPodiumSlot's rounding note).
 */
(function () {
  'use strict';

  var root = document.getElementById('bioclash-season-champions-root');
  if (!root) return;

  var eyebrowEl = document.getElementById('bioclash-season-champions-eyebrow');
  var statusEl = document.getElementById('bioclash-season-champions-status');
  var podium = document.getElementById('bioclash-season-champions-podium');
  var table = document.getElementById('bioclash-season-champions-table');
  var tbody = document.getElementById('bioclash-season-champions-tbody');

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  var MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

  function formatIndex(v) {
    var n = Number(v);
    return (n >= 0 ? '+' : '') + n.toFixed(2);
  }

  function renderPodiumSlot(r) {
    return (
      '<div class="bioclash-champion-slot bioclash-champion-rank-' + r.rank + '">' +
      '<div class="bioclash-champion-medal">' + (MEDALS[r.rank] || '🎖️') + '</div>' +
      '<div class="bioclash-champion-avatar-wrap">' + window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) + '</div>' +
      '<div class="bioclash-champion-name">' + window.PapersAuth.flagHTML(r.country) + '<span>' + escapeHTML(r.display_name) + '</span></div>' +
      '<div class="bioclash-champion-score">' + formatIndex(r.season_index) + '</div>' +
      '</div>'
    );
  }

  function renderRow(r) {
    return '<tr>' +
      '<td>' + r.rank + '</td>' +
      '<td class="papers-leaderboard-namecell">' +
        window.PapersAuth.avatarHTML(r.display_name, r.avatar_url) +
        window.PapersAuth.flagHTML(r.country) +
        '<span class="papers-leaderboard-name">' + escapeHTML(r.display_name) + '</span>' +
      '</td>' +
      '<td>' + formatIndex(r.season_index) + '</td>' +
      '</tr>';
  }

  function render(rows) {
    if (!rows.length) {
      statusEl.textContent = 'No season standings yet — be the first to claim a spot. To get your name here, ';
      var link = document.createElement('a');
      link.href = '/account/?next=/papers/leaderboard/';
      link.textContent = 'register for BiOClash Season 1 →';
      statusEl.appendChild(link);
      return;
    }

    var seasonYear = rows[0].season_year;
    var seasonRows = rows.filter(function (r) { return r.season_year === seasonYear; })
      .sort(function (a, b) { return b.season_index - a.season_index; })
      .map(function (r, i) {
        r.rank = i + 1;
        return r;
      });

    var top3 = seasonRows.filter(function (r) { return r.rank <= 3; });
    var rest = seasonRows.filter(function (r) { return r.rank > 3; });

    if (top3.length) {
      podium.innerHTML = top3.map(renderPodiumSlot).join('');
      podium.hidden = false;
    }
    if (rest.length) {
      tbody.innerHTML = rest.map(renderRow).join('');
      table.hidden = false;
    }

    if (eyebrowEl) eyebrowEl.textContent = 'Season ' + seasonYear;
    statusEl.textContent = '';
  }

  function load() {
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) {
      statusEl.textContent = "Season Champions aren't configured on this environment yet.";
      return;
    }
    var client = window.PapersAuth.getClient();
    client.from('bioclash_season_standings').select('*').limit(200).then(function (result) {
      if (result.error) {
        statusEl.textContent = 'Could not load Season Champions right now — try refreshing.';
        return;
      }
      render(result.data || []);
    }).catch(function () {
      statusEl.textContent = 'Could not load Season Champions right now — try refreshing.';
    });
  }

  load();
})();
