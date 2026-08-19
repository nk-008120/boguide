/* papers-dashboard.js -- Renders the personalized study dashboard.
   Depends on: papers-auth.js (PapersAuth), papers-knowledge.js (BioKnowledge). */

(function () {
  'use strict';

  var MASTERY_COLORS = {
    mastered:   '#16a34a',
    strong:     '#22c55e',
    developing: '#f59e0b',
    weak:       '#f97316',
    critical:   '#dc2626',
    untested:   '#9ca3af'
  };

  var MASTERY_LABELS = {
    mastered: 'Mastered', strong: 'Strong', developing: 'Developing',
    weak: 'Weak', critical: 'Critical', untested: 'Untested'
  };

  var TREND_ARROWS = { improving: '↑', declining: '↓', stable: '↔' };

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s == null ? '' : s;
    return d.innerHTML;
  }

  function loadTopicGraph() {
    return fetch('/data/topic-graph.json')
      .then(function (res) { return res.ok ? res.json() : []; })
      .catch(function () { return []; });
  }

  function showScreen(id) {
    ['dashboard-loading', 'dashboard-logged-out', 'dashboard-no-data', 'dashboard-content']
      .forEach(function (s) {
        var el = document.getElementById(s);
        if (el) el.style.display = s === id ? '' : 'none';
      });
  }

  function renderHeader(profile, overall) {
    var el = document.getElementById('dashboard-header');
    if (!el) return;
    var name = profile ? escapeHTML(profile.display_name || 'there') : 'there';
    var lastDate = overall.lastAttemptDate
      ? new Date(overall.lastAttemptDate).toLocaleDateString() : 'never';
    el.innerHTML = '<h1>Welcome back, ' + name + '</h1>' +
      '<p class="dashboard-subtitle">Last practice: ' + lastDate +
      ' &middot; ' + overall.totalAttempts + ' attempt' +
      (overall.totalAttempts === 1 ? '' : 's') + ' submitted</p>';
  }

  function renderSummary(profile, overall) {
    var el = document.getElementById('dashboard-summary');
    if (!el) return;
    var cards = '';

    cards += '<div class="dashboard-stat-card">' +
      '<div class="dashboard-stat-number">' + overall.totalAttempts + '</div>' +
      '<div class="dashboard-stat-label">Attempts</div></div>';

    cards += '<div class="dashboard-stat-card">' +
      '<div class="dashboard-stat-number">' + overall.averageScore + '%</div>' +
      '<div class="dashboard-stat-label">Average Score</div></div>';

    var strongCount = overall.strongestSubjects.filter(function (s) {
      return s.masteryLevel === 'strong' || s.masteryLevel === 'mastered';
    }).length;
    cards += '<div class="dashboard-stat-card">' +
      '<div class="dashboard-stat-number">' + strongCount + '</div>' +
      '<div class="dashboard-stat-label">Strong Subjects</div></div>';

    var weakCount = overall.weakestSubjects.filter(function (s) {
      return s.masteryLevel === 'critical' || s.masteryLevel === 'weak';
    }).length;
    cards += '<div class="dashboard-stat-card">' +
      '<div class="dashboard-stat-number">' + weakCount + '</div>' +
      '<div class="dashboard-stat-label">Weak Subjects</div></div>';

    el.innerHTML = '<div class="dashboard-stat-grid">' + cards + '</div>';
  }

  function renderRecommendations(recs) {
    var el = document.getElementById('dashboard-recs');
    if (!el) return;
    el.innerHTML = recs.map(function (r) {
      var toneClass = 'attempt-rec-' + (r.tone || 'neutral');
      var linkHTML = '';
      if (r.link && r.linkLabel) {
        linkHTML = '<a class="papers-subject-tag" href="' + escapeHTML(r.link) + '">' +
          escapeHTML(r.linkLabel) + '</a>';
      }
      return '<div class="attempt-rec-card ' + toneClass + '">' +
        '<h4>' + escapeHTML(r.title) + '</h4>' +
        '<p>' + escapeHTML(r.body) + '</p>' +
        (linkHTML ? '<div style="margin-top:0.5rem;">' + linkHTML + '</div>' : '') +
        '</div>';
    }).join('');
  }

  function renderSubjects(subjects, topicGraph) {
    var el = document.getElementById('dashboard-subjects');
    if (!el) return;

    var sectionGroups = {};
    var sectionOrder = [];

    (topicGraph || []).forEach(function (t) {
      var subj = subjects[t.slug];
      if (!subj) return;
      var sec = t.section;
      if (!sectionGroups[sec]) {
        sectionGroups[sec] = { title: t.sectionTitle || sec, items: [] };
        sectionOrder.push(sec);
      }
      sectionGroups[sec].items.push(subj);
    });

    Object.keys(subjects).forEach(function (key) {
      var subj = subjects[key];
      var found = false;
      sectionOrder.forEach(function (sec) {
        sectionGroups[sec].items.forEach(function (s) {
          if (s.link === subj.link) found = true;
        });
      });
      if (!found) {
        if (!sectionGroups['_other']) {
          sectionGroups['_other'] = { title: 'Other Subjects', items: [] };
          sectionOrder.push('_other');
        }
        sectionGroups['_other'].items.push(subj);
      }
    });

    var html = '';
    sectionOrder.forEach(function (sec) {
      var group = sectionGroups[sec];
      if (!group.items.length) return;
      group.items.sort(function (a, b) { return a.masteryScore - b.masteryScore; });
      html += '<div class="dashboard-section-group">';
      html += '<h3>' + escapeHTML(group.title) + '</h3>';
      group.items.forEach(function (s) {
        var pct = Math.round(s.weightedAccuracy * 100);
        var barWidth = Math.max(2, pct);
        var color = MASTERY_COLORS[s.masteryLevel] || MASTERY_COLORS.untested;
        var trend = TREND_ARROWS[s.trend] || '';
        html += '<div class="dashboard-subject-row">';
        html += '<a href="' + escapeHTML(s.link) + '" class="dashboard-subject-name">' + escapeHTML(s.name) + '</a>';
        html += '<span class="dashboard-mastery-badge" style="background:' + color + ';">' +
          (MASTERY_LABELS[s.masteryLevel] || s.masteryLevel) + '</span>';
        html += '<span class="dashboard-trend">' + trend + '</span>';
        html += '<div class="attempt-subject-bar-track" style="flex:1;">' +
          '<div class="attempt-subject-bar' + (pct < 40 ? ' weak' : '') + '" style="width:' + barWidth + '%;background:' + color + ';"></div></div>';
        html += '<span class="attempt-subject-pct">' + pct + '%</span>';
        html += '</div>';
      });
      html += '</div>';
    });

    el.innerHTML = html || '<p>No subject data yet.</p>';
  }

  function renderSections(sectionCoverage) {
    var el = document.getElementById('dashboard-sections');
    if (!el) return;

    var keys = Object.keys(sectionCoverage).sort();
    var html = '';
    keys.forEach(function (sec) {
      var c = sectionCoverage[sec];
      var pct = c.total > 0 ? Math.round(c.tested / c.total * 100) : 0;
      var masteryPct = Math.round(c.avgMastery * 100);
      html += '<div class="dashboard-section-bar">';
      html += '<div class="dashboard-section-label">' + escapeHTML(c.sectionTitle || sec) + '</div>';
      html += '<div class="dashboard-section-stats">' + c.tested + '/' + c.total + ' topics tested';
      if (c.tested > 0) html += ' &middot; avg mastery ' + masteryPct + '%';
      html += '</div>';
      html += '<div class="attempt-subject-bar-track"><div class="attempt-subject-bar" style="width:' + Math.max(2, pct) + '%;"></div></div>';
      html += '</div>';
    });

    el.innerHTML = html || '<p>No section data yet.</p>';
  }

  function renderRecent(attempts) {
    var el = document.getElementById('dashboard-recent');
    if (!el) return;

    var recent = attempts.slice(-5).reverse();
    var html = '<div class="dashboard-recent-list">';
    recent.forEach(function (a) {
      var date = new Date(a.submitted_at).toLocaleDateString();
      var pct = a.score_pct != null ? a.score_pct : (
        a.total_statements > 0 ? Math.round(a.total_correct / a.total_statements * 100) : 0);
      html += '<div class="dashboard-recent-item">';
      html += '<span class="dashboard-recent-label">' + escapeHTML(a.round_name || (a.olympiad + ' ' + a.year)) + '</span>';
      html += '<span class="dashboard-recent-score">' + pct + '%</span>';
      html += '<span class="dashboard-recent-date">' + date + '</span>';
      html += '</div>';
    });
    html += '</div>';

    el.innerHTML = html;
  }

  function init() {
    if (!window.PapersAuth || !window.BioKnowledge) {
      showScreen('dashboard-loading');
      return;
    }

    PapersAuth.getSession().then(function (session) {
      if (!session || !session.user) {
        showScreen('dashboard-logged-out');
        return;
      }

      var userId = session.user.id;
      var client = PapersAuth.getClient();

      Promise.all([
        BioKnowledge.loadAttempts(client, userId),
        PapersAuth.getProfile(userId),
        loadTopicGraph()
      ]).then(function (results) {
        var attempts = results[0];
        var userProfile = results[1];
        var topicGraph = results[2];

        if (!attempts || attempts.length === 0) {
          showScreen('dashboard-no-data');
          return;
        }

        var profile = BioKnowledge.buildProfile(attempts, topicGraph);
        var recs = BioKnowledge.generateRecommendations(profile, topicGraph, userProfile);

        try {
          sessionStorage.setItem('bioguide-knowledge-profile', JSON.stringify(profile));
        } catch (e) { /* ignore */ }

        renderHeader(userProfile, profile.overall);
        renderSummary(userProfile, profile.overall);
        renderRecommendations(recs);
        renderSubjects(profile.subjects, topicGraph);
        renderSections(profile.sectionCoverage);
        renderRecent(attempts);
        showScreen('dashboard-content');
      }).catch(function (err) {
        console.error('[dashboard] load error:', err);
        showScreen('dashboard-no-data');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
