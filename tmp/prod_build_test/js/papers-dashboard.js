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

  function sparklineSVG(history, width, height) {
    if (!history || history.length < 2) return '';
    var w = width || 60;
    var h = height || 20;
    var pad = 2;
    var minV = 0, maxV = 1;
    var n = history.length;
    var points = [];
    for (var i = 0; i < n; i++) {
      var x = pad + (i / (n - 1)) * (w - 2 * pad);
      var acc = history[i].accuracy != null ? history[i].accuracy : (history[i].score != null ? history[i].score / 100 : 0);
      var y = h - pad - (acc - minV) / (maxV - minV) * (h - 2 * pad);
      points.push(Math.round(x * 10) / 10 + ',' + Math.round(y * 10) / 10);
    }
    var last = history[n - 1];
    var lastAcc = last.accuracy != null ? last.accuracy : (last.score != null ? last.score / 100 : 0);
    var dotY = h - pad - (lastAcc - minV) / (maxV - minV) * (h - 2 * pad);
    var dotX = w - pad;
    return '<svg class="dashboard-sparkline" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' +
      '<polyline points="' + points.join(' ') + '" fill="none" stroke="#8965c4" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="' + Math.round(dotX * 10) / 10 + '" cy="' + Math.round(dotY * 10) / 10 + '" r="2" fill="#8965c4"/>' +
      '</svg>';
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
      '<div class="dashboard-stat-label">Average Score</div>' +
      (overall.scoreHistory && overall.scoreHistory.length >= 2
        ? '<div style="margin-top:0.3rem;text-align:center;">' + sparklineSVG(overall.scoreHistory, 80, 24) + '</div>' : '') +
      '</div>';

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

    cards += '<div class="dashboard-stat-card">' +
      '<div class="dashboard-stat-number">' + overall.activeDaysLast30 + '</div>' +
      '<div class="dashboard-stat-label">Active Days (30d)</div></div>';

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
      html += '<div class="dashboard-section-group dashboard-collapsible">';
      html += '<h3 class="dashboard-collapse-toggle" tabindex="0" role="button" aria-expanded="true">';
      html += '<span class="dashboard-collapse-arrow">▼</span> ' + escapeHTML(group.title);
      html += ' <span class="dashboard-collapse-count">(' + group.items.length + ' topic' + (group.items.length === 1 ? '' : 's') + ')</span>';
      html += '</h3>';
      html += '<div class="dashboard-collapse-body">';
      group.items.forEach(function (s) {
        var pct = Math.round(s.weightedAccuracy * 100);
        var barWidth = Math.max(2, pct);
        var color = MASTERY_COLORS[s.masteryLevel] || MASTERY_COLORS.untested;
        var trend = TREND_ARROWS[s.trend] || '';
        var spark = sparklineSVG(s.accuracyHistory, 50, 16);
        html += '<div class="dashboard-subject-row">';
        html += '<a href="' + escapeHTML(s.link) + '" class="dashboard-subject-name">' + escapeHTML(s.name) + '</a>';
        html += '<span class="dashboard-mastery-badge" style="background:' + color + ';">' +
          (MASTERY_LABELS[s.masteryLevel] || s.masteryLevel) + '</span>';
        html += '<span class="dashboard-trend">' + trend + '</span>';
        if (spark) html += spark;
        html += '<div class="attempt-subject-bar-track" style="flex:1;">' +
          '<div class="attempt-subject-bar' + (pct < 40 ? ' weak' : '') + '" style="width:' + barWidth + '%;background:' + color + ';"></div></div>';
        html += '<span class="attempt-subject-pct">' + pct + '%</span>';
        html += '</div>';
      });
      html += '</div></div>';
    });

    el.innerHTML = html || '<p>No subject data yet.</p>';

    el.querySelectorAll('.dashboard-collapse-toggle').forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var body = toggle.nextElementSibling;
        var arrow = toggle.querySelector('.dashboard-collapse-arrow');
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        body.style.display = expanded ? 'none' : '';
        if (arrow) arrow.textContent = expanded ? '▶' : '▼';
      });
      toggle.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle.click(); }
      });
    });
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
      html += '<div class="dashboard-section-bar dashboard-section-expandable" tabindex="0" role="button" aria-expanded="false">';
      html += '<div class="dashboard-section-header">';
      html += '<span class="dashboard-collapse-arrow">▶</span> ';
      html += '<span class="dashboard-section-label">' + escapeHTML(c.sectionTitle || sec) + '</span>';
      html += '<span class="dashboard-section-stats">' + c.tested + '/' + c.total + ' topics tested';
      if (c.tested > 0) html += ' &middot; avg mastery ' + masteryPct + '%';
      html += '</span>';
      html += '</div>';
      html += '<div class="attempt-subject-bar-track"><div class="attempt-subject-bar" style="width:' + Math.max(2, pct) + '%;"></div></div>';

      html += '<div class="dashboard-section-topics" style="display:none;">';
      if (c.topics && c.topics.length) {
        c.topics.forEach(function (t) {
          var tColor = MASTERY_COLORS[t.masteryLevel] || MASTERY_COLORS.untested;
          var tLabel = MASTERY_LABELS[t.masteryLevel] || 'Untested';
          var tPct = Math.round(t.masteryScore * 100);
          html += '<div class="dashboard-topic-item">';
          html += '<a href="' + escapeHTML(t.slug) + '" class="dashboard-topic-link">' + escapeHTML(t.title) + '</a>';
          html += '<span class="dashboard-mastery-badge dashboard-mastery-sm" style="background:' + tColor + ';">' + tLabel;
          if (t.tested) html += ' ' + tPct + '%';
          html += '</span>';
          html += '</div>';
        });
      }
      html += '</div></div>';
    });

    el.innerHTML = html || '<p>No section data yet.</p>';

    el.querySelectorAll('.dashboard-section-expandable').forEach(function (bar) {
      bar.addEventListener('click', function () {
        var topics = bar.querySelector('.dashboard-section-topics');
        var arrow = bar.querySelector('.dashboard-collapse-arrow');
        var expanded = bar.getAttribute('aria-expanded') === 'true';
        bar.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        topics.style.display = expanded ? 'none' : '';
        if (arrow) arrow.textContent = expanded ? '▶' : '▼';
      });
      bar.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bar.click(); }
      });
    });
  }

  function renderRecent(attempts) {
    var el = document.getElementById('dashboard-recent');
    if (!el) return;

    var recent = attempts.slice(-5).reverse();
    var html = '<div class="dashboard-recent-list">';
    recent.forEach(function (a, idx) {
      var date = new Date(a.submitted_at).toLocaleDateString();
      var pct = a.score_pct != null ? a.score_pct : (
        a.total_statements > 0 ? Math.round(a.total_correct / a.total_statements * 100) : 0);
      var durStr = '';
      if (a.duration_sec) {
        var m = Math.floor(a.duration_sec / 60);
        var s = a.duration_sec % 60;
        durStr = m + ':' + (s < 10 ? '0' : '') + s;
      }
      var qCount = a.total_statements || 0;

      var delta = '';
      var prevIdx = attempts.length - 1 - idx - 1;
      if (prevIdx >= 0) {
        var prev = attempts[prevIdx];
        var prevPct = prev.score_pct != null ? prev.score_pct : (
          prev.total_statements > 0 ? Math.round(prev.total_correct / prev.total_statements * 100) : 0);
        var diff = pct - prevPct;
        if (diff > 0) delta = '<span class="dashboard-recent-delta positive">+' + diff + '</span>';
        else if (diff < 0) delta = '<span class="dashboard-recent-delta negative">' + diff + '</span>';
      }

      html += '<div class="dashboard-recent-item">';
      html += '<span class="dashboard-recent-label">' + escapeHTML(a.round_name || (a.olympiad + ' ' + a.year)) + '</span>';
      html += '<span class="dashboard-recent-meta">' + qCount + ' Qs';
      if (durStr) html += ' &middot; ' + durStr;
      html += '</span>';
      html += '<span class="dashboard-recent-score">' + pct + '%' + delta + '</span>';
      html += '<span class="dashboard-recent-date">' + date + '</span>';
      html += '</div>';
    });
    html += '</div>';

    el.innerHTML = html;
  }

  function renderStreak(attempts) {
    var el = document.getElementById('dashboard-streak');
    if (!el) return;

    var now = new Date();
    var DAY_MS = 86400000;
    var activeDays = {};
    attempts.forEach(function (a) {
      var d = new Date(a.submitted_at);
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      activeDays[key] = (activeDays[key] || 0) + 1;
    });

    var html = '<div class="dashboard-streak-grid">';
    for (var i = 29; i >= 0; i--) {
      var day = new Date(now.getTime() - i * DAY_MS);
      var key = day.getFullYear() + '-' + (day.getMonth() + 1) + '-' + day.getDate();
      var count = activeDays[key] || 0;
      var cls = count === 0 ? 'empty' : count === 1 ? 'low' : 'high';
      var label = day.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + ': ' + count + ' attempt' + (count === 1 ? '' : 's');
      html += '<div class="dashboard-streak-dot ' + cls + '" title="' + escapeHTML(label) + '"></div>';
    }
    html += '</div>';
    el.innerHTML = html;
  }

  function renderReadiness(profile, topicGraph, userProfile) {
    var el = document.getElementById('dashboard-readiness');
    if (!el) return;

    var target = (userProfile && userProfile.target_olympiad) || 'IBO';
    var readiness = BioKnowledge.computeReadiness(profile, topicGraph, target);

    var pct = readiness.readinessPct;
    var color = pct >= 60 ? '#16a34a' : pct >= 35 ? '#f59e0b' : '#dc2626';

    var html = '<div class="dashboard-readiness-card">';
    html += '<div class="dashboard-readiness-header">';
    html += '<span class="dashboard-readiness-target">' + escapeHTML(readiness.target) + ' Readiness</span>';
    html += '<span class="dashboard-readiness-pct" style="color:' + color + ';">' + pct + '%</span>';
    html += '</div>';
    html += '<div class="attempt-subject-bar-track" style="height:8px;">';
    html += '<div class="attempt-subject-bar" style="width:' + Math.max(2, pct) + '%;background:' + color + ';height:8px;"></div>';
    html += '</div>';
    html += '<div class="dashboard-readiness-detail">';
    html += readiness.coveredTopics + ' of ' + readiness.relevantTopics + ' relevant topics covered (' + readiness.coveragePct + '%)';
    if (readiness.coveredTopics > 0) html += ' &middot; avg mastery ' + readiness.avgMastery + '%';
    html += '</div>';
    html += '</div>';

    el.innerHTML = html;
  }

  function renderNextPaper(profile, attempts) {
    var el = document.getElementById('dashboard-next-paper');
    if (!el) return;

    var suggestion = BioKnowledge.suggestNextPaper(profile, attempts);
    if (!suggestion) {
      el.innerHTML = '';
      return;
    }

    var html = '<div class="dashboard-next-card">';
    html += '<div class="dashboard-next-header">Suggested Next Paper</div>';
    html += '<div class="dashboard-next-name">' + escapeHTML(suggestion.name) + '</div>';
    html += '<div class="dashboard-next-reason">Covers ' + suggestion.weakCoverage + ' of your ' + suggestion.weakTotal + ' weak subjects</div>';
    html += '<a href="/papers/" class="papers-subject-tag">Find in BiOrchive</a>';
    html += '</div>';

    el.innerHTML = html;
  }

  function renderStudyPlanLink(profile) {
    var el = document.getElementById('dashboard-plan-link');
    if (!el) return;

    var subjects = profile.subjects;
    var vals = Object.keys(subjects).map(function (k) { return subjects[k]; });
    var tested = vals.filter(function (s) { return s.masteryLevel !== 'untested'; });
    var link = '/plans/';
    var label = 'Find a Study Plan';
    if (tested.length < 3) {
      link = '/plans/1-year/';
      label = 'Start with the 1-Year Plan';
    } else {
      var avgMastery = 0;
      tested.forEach(function (s) { avgMastery += s.masteryScore; });
      avgMastery = avgMastery / tested.length;
      if (avgMastery < 0.35) { link = '/plans/6-months/'; label = 'Try the 6-Month Plan'; }
      else if (avgMastery < 0.55) { link = '/plans/3-months/'; label = 'Try the 3-Month Plan'; }
      else { link = '/plans/1-month/'; label = 'Try the 1-Month Plan'; }
    }

    el.innerHTML = '<a href="' + link + '" class="dashboard-plan-btn">' + escapeHTML(label) + ' →</a>';
  }

  function renderCopySummary(profile, overall) {
    var el = document.getElementById('dashboard-copy-summary');
    if (!el) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dashboard-copy-btn';
    btn.textContent = 'Copy Summary';
    btn.addEventListener('click', function () {
      var lines = [];
      lines.push('BioGuide Study Dashboard Summary');
      lines.push('================================');
      lines.push('Attempts: ' + overall.totalAttempts + ' | Average: ' + overall.averageScore + '%');
      lines.push('Active days (last 30): ' + overall.activeDaysLast30);
      lines.push('');

      if (overall.weakestSubjects.length) {
        lines.push('Weakest areas:');
        overall.weakestSubjects.forEach(function (s) {
          lines.push('  - ' + s.name + ': ' + Math.round(s.weightedAccuracy * 100) + '% (' + s.masteryLevel + ')');
        });
      }
      if (overall.strongestSubjects.length) {
        lines.push('Strongest areas:');
        overall.strongestSubjects.forEach(function (s) {
          lines.push('  - ' + s.name + ': ' + Math.round(s.weightedAccuracy * 100) + '% (' + s.masteryLevel + ')');
        });
      }
      lines.push('');
      lines.push('Generated from https://bioguide.world/dashboard/');

      var text = lines.join('\n');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          setTimeout(function () { btn.textContent = 'Copy Summary'; }, 2000);
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy Summary'; }, 2000);
      }
    });

    el.innerHTML = '';
    el.appendChild(btn);
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

        try { BioKnowledge.saveProfileCache(userId, profile); } catch (e) {}

        renderHeader(userProfile, profile.overall);
        renderSummary(userProfile, profile.overall);
        renderReadiness(profile, topicGraph, userProfile);
        renderRecommendations(recs);
        renderNextPaper(profile, attempts);
        renderStudyPlanLink(profile);
        renderSubjects(profile.subjects, topicGraph);
        renderSections(profile.sectionCoverage);
        renderRecent(attempts);
        renderStreak(attempts);
        renderCopySummary(profile, profile.overall);
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
