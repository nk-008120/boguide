/*
 * Timed test-attempt controller for the BioGuide papers archive.
 * Single-page controller: one real page per round, all "navigation" between
 * questions and screens is DOM swapping — no real page loads, so fullscreen
 * and the timer survive moving around freely. Zero backend: all state lives
 * in memory + sessionStorage (live attempt) / localStorage (last report).
 */
(function () {
  var root = document.getElementById('papers-attempt-root');
  if (!root) return;

  var dataEl = document.getElementById('papers-attempt-data');
  if (!dataEl) return;
  var DATA = JSON.parse(dataEl.textContent);
  var PROBLEMS = DATA.problems;
  var ROUND_KEY = [DATA.olympiad, DATA.year, DATA.roundId].join('-');
  var LIVE_KEY = 'papers-attempt-live-' + ROUND_KEY;
  var REPORT_KEY = 'papers-attempt-report-' + ROUND_KEY;

  var startScreen = document.getElementById('attempt-start');
  var liveScreen = document.getElementById('attempt-live');
  var reportScreen = document.getElementById('attempt-report');
  var lastReportSummaryEl = document.getElementById('attempt-last-report-summary');
  var startBtn = document.getElementById('attempt-start-btn');
  var timerEl = document.getElementById('attempt-timer');
  var submitBtn = document.getElementById('attempt-submit-btn');
  var paletteEl = document.getElementById('attempt-palette');
  var qNumberEl = document.getElementById('attempt-question-number');
  var qBodyEl = document.getElementById('attempt-question-body');
  var markBtn = document.getElementById('attempt-mark-btn');
  var prevBtn = document.getElementById('attempt-prev-btn');
  var nextBtn = document.getElementById('attempt-next-btn');
  var clearBtn = document.getElementById('attempt-clear-btn');
  var fsHintBtn = document.getElementById('attempt-refullscreen-btn');

  var contentCache = {};
  var state = null;
  var currentIndex = 0;
  var timerInterval = null;

  function freshState() {
    var answers = {}, status = {}, timeSpent = {};
    PROBLEMS.forEach(function (p) {
      answers[p.id] = {};
      status[p.id] = { visited: false, marked: false };
      timeSpent[p.id] = 0;
    });
    return {
      answers: answers,
      status: status,
      timeSpent: timeSpent,
      currentIndex: 0,
      endTimestamp: Date.now() + DATA.durationMinutes * 60000,
      fullscreenExits: 0,
      questionEnteredAt: null
    };
  }

  function saveLive() {
    try { sessionStorage.setItem(LIVE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function loadLive() {
    try {
      var raw = sessionStorage.getItem(LIVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }
  function clearLive() {
    try { sessionStorage.removeItem(LIVE_KEY); } catch (e) {}
  }
  function saveReport(report) {
    try { localStorage.setItem(REPORT_KEY, JSON.stringify(report)); } catch (e) {}
  }
  function loadReport() {
    try {
      var raw = localStorage.getItem(REPORT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function showScreen(el) {
    [startScreen, liveScreen, reportScreen].forEach(function (s) {
      if (s) s.hidden = (s !== el);
    });
  }

  // ---- fetch-and-strip: reuse the real practice pages verbatim ----
  function fetchQuestionHTML(id) {
    if (contentCache[id]) return Promise.resolve(contentCache[id]);
    return fetch(DATA.basePath + id + '/')
      .then(function (r) { return r.text(); })
      .then(function (text) {
        var doc = new DOMParser().parseFromString(text, 'text/html');
        var content = doc.querySelector('article .content') || doc.querySelector('.content');
        var html = '';
        if (content) {
          content.querySelectorAll('.papers-subject-tags, .tf-quiz-wrap, .papers-quiz-nav, script').forEach(function (n) { n.remove(); });
          html = content.innerHTML;
        }
        contentCache[id] = html;
        return html;
      })
      .catch(function () {
        contentCache[id] = '<p><em>Could not load this question — check your connection and try again.</em></p>';
        return contentCache[id];
      });
  }

  function prefetchAll() {
    return Promise.all(PROBLEMS.map(function (p) { return fetchQuestionHTML(p.id); }));
  }

  // ---- palette ----
  function questionStatusClass(p) {
    var ans = state.answers[p.id] || {};
    var answeredCount = Object.keys(ans).filter(function (k) { return ans[k] !== undefined && ans[k] !== null; }).length;
    var total = p.statements.length;
    var st = state.status[p.id] || {};
    var base = 'unvisited';
    if (answeredCount === total) base = 'answered';
    else if (answeredCount > 0) base = 'partial';
    else if (st.visited) base = 'visited';
    return base + (st.marked ? ' marked' : '');
  }

  function renderPalette() {
    paletteEl.innerHTML = '';
    var legend = document.createElement('div');
    legend.className = 'attempt-palette-legend';
    legend.innerHTML =
      '<span class="attempt-legend-item"><i class="attempt-dot unvisited"></i>Not visited</span>' +
      '<span class="attempt-legend-item"><i class="attempt-dot visited"></i>Visited</span>' +
      '<span class="attempt-legend-item"><i class="attempt-dot partial"></i>Partial</span>' +
      '<span class="attempt-legend-item"><i class="attempt-dot answered"></i>Answered</span>' +
      '<span class="attempt-legend-item"><i class="attempt-dot marked"></i>Marked</span>';
    paletteEl.appendChild(legend);

    var grid = document.createElement('div');
    grid.className = 'attempt-palette-grid';
    PROBLEMS.forEach(function (p, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'attempt-palette-btn ' + questionStatusClass(p) + (i === currentIndex ? ' current' : '');
      btn.textContent = String(i + 1);
      btn.setAttribute('aria-label', p.number);
      btn.addEventListener('click', function () { goToQuestion(i); });
      grid.appendChild(btn);
    });
    paletteEl.appendChild(grid);
  }

  // ---- question view ----
  function goToQuestion(index) {
    if (state.currentIndex != null && PROBLEMS[currentIndex]) {
      var prevId = PROBLEMS[currentIndex].id;
      if (state.questionEnteredAt) {
        state.timeSpent[prevId] = (state.timeSpent[prevId] || 0) + Math.round((Date.now() - state.questionEnteredAt) / 1000);
      }
    }
    currentIndex = index;
    state.currentIndex = index;
    var p = PROBLEMS[index];
    state.status[p.id].visited = true;
    state.questionEnteredAt = Date.now();

    qNumberEl.textContent = p.number + ' of ' + PROBLEMS.length;
    markBtn.classList.toggle('active', !!state.status[p.id].marked);
    markBtn.textContent = state.status[p.id].marked ? '★ Marked for Review' : '☆ Mark for Review';

    fetchQuestionHTML(p.id).then(function (html) {
      qBodyEl.innerHTML = html + buildStatementSelectors(p);
      wireStatementButtons(p);
    });

    prevBtn.disabled = index === 0;
    nextBtn.textContent = index === PROBLEMS.length - 1 ? 'Finish →' : 'Next →';
    renderPalette();
    saveLive();
  }

  function buildStatementSelectors(p) {
    var ans = state.answers[p.id] || {};
    var rows = p.statements.map(function (s) {
      var sel = ans[s.letter];
      return (
        '<div class="tf-quiz-row attempt-statement" data-letter="' + s.letter + '">' +
        '<div class="tf-quiz-statement"><span class="tf-quiz-letter">' + s.letter + '.</span> ' + escapeHTML(s.text) + '</div>' +
        '<div class="tf-quiz-toggle" role="group" aria-label="Statement ' + s.letter + '">' +
        '<button type="button" class="tf-btn' + (sel === true ? ' selected' : '') + '" data-value="true">TRUE</button>' +
        '<button type="button" class="tf-btn' + (sel === false ? ' selected' : '') + '" data-value="false">FALSE</button>' +
        '</div></div>'
      );
    }).join('');
    return '<div class="attempt-answer-block">' + rows + '</div>';
  }

  function escapeHTML(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  function wireStatementButtons(p) {
    qBodyEl.querySelectorAll('.attempt-statement').forEach(function (row) {
      var letter = row.dataset.letter;
      row.querySelectorAll('.tf-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          row.querySelectorAll('.tf-btn').forEach(function (b) { b.classList.remove('selected'); });
          btn.classList.add('selected');
          state.answers[p.id][letter] = (btn.dataset.value === 'true');
          renderPalette();
          saveLive();
        });
      });
    });
  }

  // ---- timer ----
  function formatDuration(ms) {
    var totalSec = Math.max(0, Math.round(ms / 1000));
    var h = Math.floor(totalSec / 3600);
    var m = Math.floor((totalSec % 3600) / 60);
    var s = totalSec % 60;
    var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
    return h > 0 ? (h + ':' + pad(m) + ':' + pad(s)) : (pad(m) + ':' + pad(s));
  }

  function tickTimer() {
    var remaining = state.endTimestamp - Date.now();
    timerEl.textContent = formatDuration(remaining);
    timerEl.classList.toggle('attempt-timer-low', remaining < 5 * 60000);
    if (remaining <= 0) {
      clearInterval(timerInterval);
      submitTest(true);
    }
  }

  // ---- fullscreen ----
  function enterFullscreen() {
    var el = document.documentElement;
    var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) {
      try { req.call(el).catch(function () {}); } catch (e) {}
    }
  }
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && liveScreen && !liveScreen.hidden) {
      state.fullscreenExits = (state.fullscreenExits || 0) + 1;
      saveLive();
      if (fsHintBtn) fsHintBtn.hidden = false;
    } else if (fsHintBtn) {
      fsHintBtn.hidden = true;
    }
  });

  // ---- start / resume ----
  function beginAttempt(resumed) {
    showScreen(liveScreen);
    if (!timerInterval) timerInterval = setInterval(tickTimer, 1000);
    tickTimer();
    prefetchAll().then(function () {
      goToQuestion(resumed ? (state.currentIndex || 0) : 0);
    });
  }

  function startFresh() {
    state = freshState();
    clearLive();
    enterFullscreen();
    beginAttempt(false);
  }

  // ---- submit + report ----
  function computeReport() {
    var totalCorrect = 0, totalStatements = 0;
    var subjectStats = {};
    var perQuestion = [];
    var totalTime = 0;
    PROBLEMS.forEach(function (p) {
      var ans = state.answers[p.id] || {};
      var correct = 0;
      p.statements.forEach(function (s) {
        totalStatements++;
        if (ans[s.letter] === s.answer) { correct++; totalCorrect++; }
      });
      var t = state.timeSpent[p.id] || 0;
      totalTime += t;
      perQuestion.push({
        id: p.id, number: p.number, name: p.name,
        correct: correct, total: p.statements.length,
        timeSec: t, marked: !!(state.status[p.id] && state.status[p.id].marked)
      });
      (p.subjects || []).forEach(function (subj) {
        if (!subjectStats[subj.name]) subjectStats[subj.name] = { correct: 0, total: 0, link: subj.link };
        subjectStats[subj.name].correct += correct;
        subjectStats[subj.name].total += p.statements.length;
      });
    });
    var avgTime = totalTime / PROBLEMS.length;
    return {
      roundName: DATA.roundName,
      totalCorrect: totalCorrect,
      totalStatements: totalStatements,
      subjectStats: subjectStats,
      perQuestion: perQuestion,
      avgTimeSec: avgTime,
      fullscreenExits: state.fullscreenExits || 0,
      submittedAt: Date.now()
    };
  }

  function submitTest(auto) {
    if (state.currentIndex != null && PROBLEMS[currentIndex] && state.questionEnteredAt) {
      var curId = PROBLEMS[currentIndex].id;
      state.timeSpent[curId] = (state.timeSpent[curId] || 0) + Math.round((Date.now() - state.questionEnteredAt) / 1000);
    }
    clearInterval(timerInterval);
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(function () {});
    }
    var report = computeReport();
    saveReport(report);
    clearLive();
    renderReport(report, true);
    showScreen(reportScreen);
  }

  function unansweredCount() {
    var n = 0;
    PROBLEMS.forEach(function (p) {
      var ans = state.answers[p.id] || {};
      var answered = Object.keys(ans).filter(function (k) { return ans[k] !== undefined && ans[k] !== null; }).length;
      if (answered < p.statements.length) n++;
    });
    return n;
  }
  function markedCount() {
    return PROBLEMS.filter(function (p) { return state.status[p.id] && state.status[p.id].marked; }).length;
  }

  function confirmSubmit() {
    var unanswered = unansweredCount();
    var marked = markedCount();
    var msg = 'Answered fully: ' + (PROBLEMS.length - unanswered) + ' / ' + PROBLEMS.length +
      '\nNot fully answered: ' + unanswered +
      '\nMarked for review: ' + marked +
      '\n\nSubmit the test now? This cannot be undone.';
    if (window.confirm(msg)) submitTest(false);
  }

  // ---- recommendation engine ----
  // Small rule-based pass over the report — no ML, just ordered heuristics,
  // each one a self-contained "step" that either adds a card or doesn't.
  function buildRecommendations(report) {
    var overallPct = report.totalStatements ? (report.totalCorrect / report.totalStatements * 100) : 0;
    var subjects = Object.keys(report.subjectStats).map(function (name) {
      var s = report.subjectStats[name];
      return { name: name, link: s.link, pct: s.total ? (s.correct / s.total * 100) : 0, correct: s.correct, total: s.total };
    });
    subjects.sort(function (a, b) { return a.pct - b.pct; });

    var critical = subjects.filter(function (s) { return s.pct < 40; });
    var weak = subjects.filter(function (s) { return s.pct >= 40 && s.pct < 60; });
    var strong = subjects.filter(function (s) { return s.pct >= 85; });
    var markedWrong = report.perQuestion.filter(function (q) { return q.marked && q.correct < q.total; });
    var visitedCount = report.perQuestion.filter(function (q) { return q.timeSec > 0; }).length;
    var slow = report.perQuestion.filter(function (q) { return q.timeSec > (report.avgTimeSec * 2.5) && q.timeSec > 60; });

    var recs = [];

    // 1. Excellent overall — point toward harder material instead of more of the same.
    if (overallPct >= 85) {
      recs.push({ tone: 'positive', title: "You're ready for tougher material",
        body: 'Strong result overall (' + Math.round(overallPct) + '%). Consider a harder programme, or the next available round, to keep progressing.' });
    }
    // 2. Broad gap across most subjects — recommend fundamentals, not more IBO drilling.
    else if (subjects.length >= 4 && critical.length >= Math.ceil(subjects.length * 0.5)) {
      recs.push({ tone: 'critical', title: 'Start from the fundamentals',
        body: 'You scored under 40% in ' + critical.length + ' of ' + subjects.length + ' subjects — broad enough that it is worth building up the basics before drilling more IBO questions. The guide’s own recommended starting point is Cell Theory, Prokaryotes & Eukaryotes.',
        link: '/resources/1-cell-molecular/cell-theory-prokaryotes-eukaryotes/', linkLabel: 'Start with Cell Theory' });
    }
    // 3. Otherwise, a focused list of the specific weak/critical subjects.
    else {
      var focusList = critical.concat(weak).slice(0, 5);
      if (focusList.length) {
        recs.push({ tone: 'weak', title: 'Focus on ' + focusList.length + ' subject' + (focusList.length === 1 ? '' : 's'),
          body: 'These are where you lost the most ground this attempt:', subjectLinks: focusList });
      }
    }

    // 4. One subject clearly dragging behind the rest — call it out by name.
    if (subjects.length && subjects[0].pct < 30 && (subjects.length === 1 || (subjects[1] && subjects[1].pct - subjects[0].pct > 25))) {
      recs.push({ tone: 'critical', title: subjects[0].name + ' stands out as your weakest spot',
        body: 'At ' + Math.round(subjects[0].pct) + '%, this one subject is dragging behind the rest — worth a dedicated study session before your next attempt.',
        link: subjects[0].link, linkLabel: 'Study ' + subjects[0].name });
    }

    // 5. Questions marked for review that turned out wrong — the instinct to flag them was correct.
    if (markedWrong.length) {
      recs.push({ tone: 'neutral', title: 'Revisit what you flagged',
        body: 'You marked ' + markedWrong.length + ' question' + (markedWrong.length === 1 ? '' : 's') + ' for review, and ' +
          (markedWrong.length === 1 ? 'it was' : 'they were') + ' not fully correct — that instinct was right. ' +
          markedWrong.map(function (q) { return q.number; }).join(', ') + (markedWrong.length === 1 ? ' is' : ' are') + ' worth a second look.' });
    }

    // 6. Positive reinforcement for subjects that are already solid.
    if (strong.length) {
      recs.push({ tone: 'positive', title: 'Keep doing what’s working',
        body: strong.map(function (s) { return s.name; }).join(', ') + (strong.length === 1 ? ' is' : ' are') + ' solid (85%+) — no action needed there.' });
    }

    // 7. Pacing — several questions took much longer than the paper's own average.
    if (slow.length >= 3) {
      recs.push({ tone: 'neutral', title: 'Watch your pacing',
        body: slow.length + ' questions took far longer than your own average — in a real timed sitting that risks not finishing the paper. Practising those question types untimed first, then timed, tends to help.' });
    }

    // 8. Coverage — less than half the paper was even visited.
    if (visitedCount < PROBLEMS.length * 0.5) {
      recs.push({ tone: 'neutral', title: 'You covered less than half the paper',
        body: 'Only ' + visitedCount + ' of ' + PROBLEMS.length + ' questions were visited this attempt. A full run-through (even with guesses on the ones you’re unsure of) gives a much more complete picture of your subject strengths next time.' });
    }

    // 9. Fallback — nothing else triggered, performance is unremarkable-but-fine.
    if (!recs.length) {
      recs.push({ tone: 'neutral', title: 'Solid, well-rounded attempt',
        body: 'No single subject or pattern stands out as urgent here — steady practice across the board is the main lever left.' });
    }

    // 10. Always-on closing tip, regardless of how the rest scored.
    recs.push({ tone: 'neutral', title: 'Track your progress',
      body: 'Retake this test after working through the recommendations above — comparing scores over time is the clearest signal of whether the study time is paying off.' });

    return recs;
  }

  function renderRecommendations(recs) {
    return recs.map(function (r) {
      var linksHTML = '';
      if (r.subjectLinks) {
        linksHTML = '<div class="papers-subject-tags" style="margin-top:0.6rem;">' + r.subjectLinks.map(function (s) {
          return '<a class="papers-subject-tag" href="' + s.link + '">' + escapeHTML(s.name) + ' (' + Math.round(s.pct) + '%)</a>';
        }).join('') + '</div>';
      } else if (r.link) {
        linksHTML = '<a class="papers-nav-btn" style="margin-top:0.6rem;display:inline-block;" href="' + r.link + '">' + escapeHTML(r.linkLabel || 'Study this') + ' →</a>';
      }
      return '<div class="attempt-rec-card attempt-rec-' + r.tone + '"><h4>' + escapeHTML(r.title) + '</h4><p>' + escapeHTML(r.body) + '</p>' + linksHTML + '</div>';
    }).join('');
  }

  // ---- optional leaderboard submission ----
  // Purely additive: anonymous users never see more than a one-line "log in"
  // link here (or nothing at all, if login isn't configured on this
  // environment), and the local report/recommendations above are always
  // computed and shown exactly as before regardless of login state.
  function renderLeaderboardSubmit(container) {
    if (!window.PapersAuth || !window.PapersAuth.isConfigured()) return;
    window.PapersAuth.getSession().then(function (session) {
      if (!session) {
        container.innerHTML = '<p class="attempt-leaderboard-prompt">' +
          '<a href="/account/">Log in</a> to save this result to the leaderboard — completely optional.</p>';
        return;
      }
      container.innerHTML =
        '<button type="button" class="papers-nav-btn papers-nav-next" id="attempt-submit-leaderboard-btn">Submit to Leaderboard</button>' +
        '<div class="attempt-leaderboard-msg" id="attempt-leaderboard-msg"></div>';
      document.getElementById('attempt-submit-leaderboard-btn').addEventListener('click', function () {
        submitToLeaderboard(session);
      });
    });
  }

  function submitToLeaderboard(session) {
    var btn = document.getElementById('attempt-submit-leaderboard-btn');
    var msg = document.getElementById('attempt-leaderboard-msg');
    if (btn) btn.disabled = true;
    msg.textContent = 'Submitting…';
    fetch('/api/submit-attempt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token },
      body: JSON.stringify({
        olympiad: DATA.olympiad,
        year: DATA.year,
        roundId: DATA.roundId,
        answers: state.answers,
        timeSpent: state.timeSpent,
        fullscreenExits: state.fullscreenExits || 0
      })
    }).then(function (r) {
      return r.json().then(function (body) {
        if (!r.ok) throw new Error(body.error || 'Submission failed');
        return body;
      });
    }).then(function (result) {
      msg.innerHTML = 'Submitted — server score: ' + result.totalCorrect + '/' + result.totalStatements +
        ' (' + result.scorePct + '%), rank #' + result.rank + '. ' +
        '<a href="' + DATA.basePath + 'leaderboard/">View leaderboard →</a>';
    }).catch(function (err) {
      if (btn) btn.disabled = false;
      setMsgError(msg, 'Error: ' + err.message);
    });
  }

  function setMsgError(el, text) {
    el.textContent = text;
    el.classList.add('attempt-leaderboard-msg-error');
  }

  // ---- report rendering ----
  function renderReport(report, canSubmit) {
    var pct = report.totalStatements ? Math.round((report.totalCorrect / report.totalStatements) * 100) : 0;
    var subjectRows = Object.keys(report.subjectStats).sort(function (a, b) {
      var pa = report.subjectStats[a].correct / report.subjectStats[a].total;
      var pb = report.subjectStats[b].correct / report.subjectStats[b].total;
      return pa - pb;
    }).map(function (name) {
      var s = report.subjectStats[name];
      var p = Math.round((s.correct / s.total) * 100);
      var weak = p < 60;
      return (
        '<div class="attempt-subject-row">' +
        '<div class="attempt-subject-name">' + escapeHTML(name) + (weak ? ' <a class="papers-subject-tag" href="' + s.link + '">Study this →</a>' : '') + '</div>' +
        '<div class="attempt-subject-bar-track"><div class="attempt-subject-bar' + (weak ? ' weak' : '') + '" style="width:' + p + '%"></div></div>' +
        '<div class="attempt-subject-pct">' + s.correct + '/' + s.total + ' (' + p + '%)</div>' +
        '</div>'
      );
    }).join('');

    var avgTime = report.avgTimeSec;
    var outliers = report.perQuestion.filter(function (q) { return q.timeSec > avgTime * 2 && q.timeSec > 30; })
      .sort(function (a, b) { return b.timeSec - a.timeSec; }).slice(0, 5);
    var outlierHTML = outliers.length ? (
      '<ul class="attempt-outlier-list">' + outliers.map(function (q) {
        return '<li>' + q.number + ' — ' + Math.round(q.timeSec / 60) + ' min (avg was ' + Math.round(avgTime / 60) + ' min)</li>';
      }).join('') + '</ul>'
    ) : '<p>No question took disproportionately long.</p>';

    var fsNote = report.fullscreenExits > 0
      ? '<p class="attempt-fs-note">Left fullscreen ' + report.fullscreenExits + ' time' + (report.fullscreenExits === 1 ? '' : 's') + ' during the attempt.</p>'
      : '';

    var recommendations = buildRecommendations(report);

    reportScreen.innerHTML =
      '<h2>Test Report — ' + escapeHTML(report.roundName) + '</h2>' +
      '<div class="attempt-score-hero">' + report.totalCorrect + ' / ' + report.totalStatements + '<span class="attempt-score-pct"> (' + pct + '%)</span></div>' +
      fsNote +
      '<div class="attempt-leaderboard-block" id="attempt-leaderboard-block"></div>' +
      '<h3>By Subject</h3>' +
      '<div class="attempt-subject-list">' + subjectRows + '</div>' +
      '<h3>What to Do Next</h3>' +
      '<div class="attempt-rec-list">' + renderRecommendations(recommendations) + '</div>' +
      '<h3>Time Check</h3>' +
      outlierHTML +
      '<div class="attempt-report-actions">' +
      '<a class="papers-nav-btn" href="/papers/">← Back to Papers Archive</a>' +
      '<button type="button" class="papers-nav-btn" onclick="window.print()">Print Report</button>' +
      '<button type="button" class="papers-nav-btn papers-nav-next" id="attempt-retake-btn">Retake Test</button>' +
      '</div>';

    var retakeBtn = document.getElementById('attempt-retake-btn');
    if (retakeBtn) retakeBtn.addEventListener('click', function () {
      showScreen(startScreen);
      renderLastReportSummary();
    });

    if (canSubmit) {
      var lbBlock = document.getElementById('attempt-leaderboard-block');
      if (lbBlock) renderLeaderboardSubmit(lbBlock);
    }
  }

  function renderLastReportSummary() {
    var last = loadReport();
    if (!last || !lastReportSummaryEl) {
      if (lastReportSummaryEl) lastReportSummaryEl.innerHTML = '';
      return;
    }
    var pct = last.totalStatements ? Math.round((last.totalCorrect / last.totalStatements) * 100) : 0;
    lastReportSummaryEl.innerHTML =
      '<p class="attempt-last-report">Last attempt: <strong>' + last.totalCorrect + ' / ' + last.totalStatements +
      '</strong> (' + pct + '%) on ' + new Date(last.submittedAt).toLocaleString() +
      ' — <a href="#" id="attempt-view-last-report">view report</a></p>';
    var link = document.getElementById('attempt-view-last-report');
    if (link) link.addEventListener('click', function (e) {
      e.preventDefault();
      renderReport(last);
      showScreen(reportScreen);
    });
  }

  // ---- wire top-level controls ----
  if (startBtn) startBtn.addEventListener('click', startFresh);
  if (submitBtn) submitBtn.addEventListener('click', confirmSubmit);
  if (prevBtn) prevBtn.addEventListener('click', function () { if (currentIndex > 0) goToQuestion(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    if (currentIndex < PROBLEMS.length - 1) goToQuestion(currentIndex + 1);
  });
  if (markBtn) markBtn.addEventListener('click', function () {
    var p = PROBLEMS[currentIndex];
    state.status[p.id].marked = !state.status[p.id].marked;
    markBtn.classList.toggle('active', state.status[p.id].marked);
    markBtn.textContent = state.status[p.id].marked ? '★ Marked for Review' : '☆ Mark for Review';
    renderPalette();
    saveLive();
  });
  if (clearBtn) clearBtn.addEventListener('click', function () {
    var p = PROBLEMS[currentIndex];
    state.answers[p.id] = {};
    goToQuestion(currentIndex);
  });
  if (fsHintBtn) fsHintBtn.addEventListener('click', function () { enterFullscreen(); });

  window.addEventListener('beforeunload', function () {
    if (liveScreen && !liveScreen.hidden) saveLive();
  });

  // ---- boot ----
  var resumable = loadLive();
  if (resumable) {
    state = resumable;
    beginAttempt(true);
  } else {
    showScreen(startScreen);
    renderLastReportSummary();
  }
})();
