/* papers-knowledge.js -- Client-side knowledge profile and recommendation engine.
   Aggregates a logged-in user's attempt_reports into per-subject mastery scores,
   then ranks study recommendations using the site's topic prerequisite graph.
   Exposes window.BioKnowledge. */

(function () {
  'use strict';

  var DAY_MS = 86400000;
  var CACHE_KEY_PREFIX = 'bioguide-kp-';
  var CACHE_MAX_AGE = 3600000;

  function timeDecayWeight(submittedAt) {
    var age = Date.now() - new Date(submittedAt).getTime();
    var days = age / DAY_MS;
    if (days < 7) return 1.0;
    if (days < 30) return 0.8;
    if (days < 90) return 0.5;
    return 0.3;
  }

  function normalizeSubjectKey(link, name) {
    if (link) return link.replace(/\/$/, '') + '/';
    return (name || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
  }

  function saveProfileCache(userId, profile) {
    try {
      var payload = JSON.stringify({ ts: Date.now(), uid: userId, profile: profile });
      localStorage.setItem(CACHE_KEY_PREFIX + userId, payload);
      localStorage.setItem(CACHE_KEY_PREFIX + 'active', payload);
    } catch (e) { /* quota exceeded or private mode */ }
    try {
      sessionStorage.setItem('bioguide-knowledge-profile', JSON.stringify(profile));
    } catch (e) { /* fallback */ }
  }

  function loadProfileCache(userId) {
    try {
      var raw = localStorage.getItem(CACHE_KEY_PREFIX + userId);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.ts || !parsed.profile) return null;
      if (Date.now() - parsed.ts > CACHE_MAX_AGE) return null;
      return parsed.profile;
    } catch (e) {
      try { localStorage.removeItem(CACHE_KEY_PREFIX + userId); } catch (e2) {}
      return null;
    }
  }

  function clearProfileCache(userId) {
    if (userId) {
      try { localStorage.removeItem(CACHE_KEY_PREFIX + userId); } catch (e) {}
    }
    try { localStorage.removeItem(CACHE_KEY_PREFIX + 'active'); } catch (e) {}
    try { sessionStorage.removeItem('bioguide-knowledge-profile'); } catch (e) {}
  }

  function readCachedProfile() {
    try {
      var raw = localStorage.getItem(CACHE_KEY_PREFIX + 'active');
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.profile) return parsed.profile;
      }
    } catch (e) {
      try { localStorage.removeItem(CACHE_KEY_PREFIX + 'active'); } catch (e2) {}
    }
    try {
      var raw2 = sessionStorage.getItem('bioguide-knowledge-profile');
      if (raw2) return JSON.parse(raw2);
    } catch (e) {}
    return null;
  }

  function initAuthListener() {
    if (!window.PapersAuth) return;
    try {
      var client = PapersAuth.getClient();
      if (client && client.auth && client.auth.onAuthStateChange) {
        client.auth.onAuthStateChange(function (event) {
          if (event === 'SIGNED_OUT') clearProfileCache();
        });
      }
    } catch (e) {}
  }

  function loadAttempts(supabaseClient, userId) {
    return supabaseClient
      .from('attempt_reports')
      .select('olympiad, year, round_id, round_name, total_correct, total_statements, score_pct, duration_sec, subject_stats, per_question, submitted_at')
      .eq('user_id', userId)
      .eq('show_on_dashboard', true)
      .order('submitted_at', { ascending: true })
      .then(function (res) {
        if (res.error) throw res.error;
        return res.data || [];
      });
  }

  function buildProfile(attempts, topicGraph) {
    var subjectMap = {};

    attempts.forEach(function (attempt) {
      var stats = attempt.subject_stats;
      if (!stats || typeof stats !== 'object') return;
      var weight = timeDecayWeight(attempt.submitted_at);

      Object.keys(stats).forEach(function (name) {
        var s = stats[name];
        var link = s.link || '';
        var key = normalizeSubjectKey(link, name);

        if (!subjectMap[key]) {
          subjectMap[key] = {
            name: name,
            link: link,
            entries: [],
            totalCorrect: 0,
            totalStatements: 0,
            weightedCorrect: 0,
            weightedTotal: 0
          };
        }

        var entry = subjectMap[key];
        if (link && !entry.link) entry.link = link;
        entry.entries.push({
          correct: s.correct,
          total: s.total,
          weight: weight,
          submittedAt: attempt.submitted_at,
          scorePct: attempt.score_pct
        });
        entry.totalCorrect += s.correct;
        entry.totalStatements += s.total;
        entry.weightedCorrect += s.correct * weight;
        entry.weightedTotal += s.total * weight;
      });
    });

    var subjects = {};
    Object.keys(subjectMap).forEach(function (key) {
      var entry = subjectMap[key];
      var rawAccuracy = entry.totalStatements > 0
        ? entry.totalCorrect / entry.totalStatements : 0;
      var weightedAccuracy = entry.weightedTotal > 0
        ? entry.weightedCorrect / entry.weightedTotal : 0;
      var sampleConfidence = Math.min(1.0, entry.totalStatements / 12);
      var masteryScore = weightedAccuracy * sampleConfidence;

      var masteryLevel;
      if (sampleConfidence < 0.25) masteryLevel = 'untested';
      else if (masteryScore < 0.35) masteryLevel = 'critical';
      else if (masteryScore < 0.55) masteryLevel = 'weak';
      else if (masteryScore < 0.75) masteryLevel = 'developing';
      else if (masteryScore < 0.90) masteryLevel = 'strong';
      else masteryLevel = 'mastered';

      var trend = 'stable';
      var accuracyHistory = [];
      if (entry.entries.length >= 2) {
        var sorted = entry.entries.slice().sort(function (a, b) {
          return new Date(a.submittedAt) - new Date(b.submittedAt);
        });
        sorted.forEach(function (e) {
          accuracyHistory.push({ date: e.submittedAt, accuracy: e.total > 0 ? e.correct / e.total : 0 });
        });
        var latest = sorted[sorted.length - 1];
        var latestAcc = latest.total > 0 ? latest.correct / latest.total : 0;
        var olderCorrect = 0, olderTotal = 0;
        for (var i = 0; i < sorted.length - 1; i++) {
          olderCorrect += sorted[i].correct;
          olderTotal += sorted[i].total;
        }
        var olderAcc = olderTotal > 0 ? olderCorrect / olderTotal : 0;
        var diff = latestAcc - olderAcc;
        if (diff > 0.10) trend = 'improving';
        else if (diff < -0.10) trend = 'declining';
      } else if (entry.entries.length === 1) {
        accuracyHistory.push({ date: entry.entries[0].submittedAt, accuracy: entry.entries[0].total > 0 ? entry.entries[0].correct / entry.entries[0].total : 0 });
      }

      var linkKey = entry.link ? (entry.link.replace(/\/$/, '') + '/') : key;
      subjects[linkKey] = {
        name: entry.name,
        link: entry.link,
        rawAccuracy: rawAccuracy,
        weightedAccuracy: weightedAccuracy,
        sampleConfidence: sampleConfidence,
        masteryScore: masteryScore,
        masteryLevel: masteryLevel,
        totalCorrect: entry.totalCorrect,
        totalStatements: entry.totalStatements,
        attemptCount: entry.entries.length,
        lastAttempted: entry.entries[entry.entries.length - 1].submittedAt,
        trend: trend,
        accuracyHistory: accuracyHistory
      };
    });

    var sectionCoverage = {};
    var graphBySlug = {};
    (topicGraph || []).forEach(function (t) {
      graphBySlug[t.slug] = t;
      if (!sectionCoverage[t.section]) {
        sectionCoverage[t.section] = {
          sectionTitle: t.sectionTitle,
          tested: 0,
          total: 0,
          masterySum: 0,
          topics: []
        };
      }
      sectionCoverage[t.section].total++;
      var topicInfo = { slug: t.slug, title: t.title, difficulty: t.difficulty, tested: false, masteryLevel: 'untested', masteryScore: 0 };
      if (subjects[t.slug]) {
        sectionCoverage[t.section].tested++;
        sectionCoverage[t.section].masterySum += subjects[t.slug].masteryScore;
        topicInfo.tested = true;
        topicInfo.masteryLevel = subjects[t.slug].masteryLevel;
        topicInfo.masteryScore = subjects[t.slug].masteryScore;
      }
      sectionCoverage[t.section].topics.push(topicInfo);
    });
    Object.keys(sectionCoverage).forEach(function (sec) {
      var c = sectionCoverage[sec];
      c.avgMastery = c.tested > 0 ? c.masterySum / c.tested : 0;
      c.topics.sort(function (a, b) { return a.masteryScore - b.masteryScore; });
    });

    var subjectValues = Object.keys(subjects).map(function (k) { return subjects[k]; });
    var testedSubjects = subjectValues.filter(function (s) { return s.masteryLevel !== 'untested'; });
    var sortedByMastery = testedSubjects.slice().sort(function (a, b) { return a.masteryScore - b.masteryScore; });
    var strongestSubjects = sortedByMastery.slice(-3).reverse();
    var weakestSubjects = sortedByMastery.slice(0, 3);

    var totalAttempts = attempts.length;
    var avgScore = 0;
    var scoreHistory = [];
    if (totalAttempts > 0) {
      var scoreSum = 0;
      attempts.forEach(function (a) {
        scoreSum += (a.score_pct || 0);
        scoreHistory.push({ date: a.submitted_at, score: a.score_pct || 0, name: a.round_name || (a.olympiad + ' ' + a.year) });
      });
      avgScore = scoreSum / totalAttempts;
    }

    var activeDays = {};
    attempts.forEach(function (a) {
      var d = new Date(a.submitted_at);
      var key = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
      activeDays[key] = true;
    });
    var now = new Date();
    var streakDays = 0;
    for (var dOff = 0; dOff < 30; dOff++) {
      var check = new Date(now.getTime() - dOff * DAY_MS);
      var ck = check.getFullYear() + '-' + (check.getMonth() + 1) + '-' + check.getDate();
      if (activeDays[ck]) streakDays++;
    }

    return {
      subjects: subjects,
      overall: {
        totalAttempts: totalAttempts,
        averageScore: Math.round(avgScore * 10) / 10,
        strongestSubjects: strongestSubjects,
        weakestSubjects: weakestSubjects,
        lastAttemptDate: totalAttempts > 0
          ? attempts[attempts.length - 1].submitted_at : null,
        scoreHistory: scoreHistory,
        activeDaysLast30: streakDays
      },
      sectionCoverage: sectionCoverage,
      _graphBySlug: graphBySlug
    };
  }

  function computeReadiness(profile, topicGraph, targetOlympiad) {
    var target = (targetOlympiad || 'IBO').toUpperCase();
    var relevant = 0;
    var covered = 0;
    var masterySum = 0;
    (topicGraph || []).forEach(function (t) {
      var tags = (t.syllabus_tags || []).map(function (s) { return s.toUpperCase(); });
      if (tags.indexOf(target) === -1) return;
      relevant++;
      var subj = profile.subjects[t.slug];
      if (subj && subj.masteryLevel !== 'untested') {
        covered++;
        masterySum += subj.masteryScore;
      }
    });
    return {
      target: target,
      relevantTopics: relevant,
      coveredTopics: covered,
      coveragePct: relevant > 0 ? Math.round(covered / relevant * 100) : 0,
      avgMastery: covered > 0 ? Math.round(masterySum / covered * 100) : 0,
      readinessPct: relevant > 0 ? Math.round((covered / relevant) * (covered > 0 ? masterySum / covered : 0) * 100) : 0
    };
  }

  function roundKey(olympiad, year, roundId) {
    return (olympiad || '') + '|' + (year || '') + '|' + (roundId || '');
  }

  function suggestNextPaper(profile, attempts, roundsCatalog) {
    if (!roundsCatalog || !roundsCatalog.length) return null;

    var attempted = {};
    attempts.forEach(function (a) { attempted[roundKey(a.olympiad, a.year, a.round_id)] = true; });

    var subjects = profile.subjects;
    var weakLinks = [];
    Object.keys(subjects).forEach(function (k) {
      var s = subjects[k];
      if (s.masteryLevel === 'critical' || s.masteryLevel === 'weak') {
        weakLinks.push(k);
      }
    });
    if (!weakLinks.length) return null;

    var best = null;
    var bestScore = 0;
    roundsCatalog.forEach(function (r) {
      var key = roundKey(r.olympiad, r.year, r.roundId);
      if (attempted[key]) return;
      var covered = {};
      (r.subjectLinks || []).forEach(function (link) { covered[link] = true; });
      var score = 0;
      weakLinks.forEach(function (wk) { if (covered[wk]) score++; });
      if (score > bestScore) {
        bestScore = score;
        best = { roundId: r.roundId, name: r.name, weakCoverage: score, weakTotal: weakLinks.length };
      }
    });
    return best;
  }

  function qualityFromAccuracy(accuracy) {
    if (accuracy >= 0.90) return 5;
    if (accuracy >= 0.75) return 4;
    if (accuracy >= 0.60) return 3;
    if (accuracy >= 0.40) return 2;
    if (accuracy >= 0.20) return 1;
    return 0;
  }

  function computeSm2Update(state, quality) {
    var ease = (state && state.ease_factor != null) ? state.ease_factor : 2.5;
    var interval = (state && state.interval_days != null) ? state.interval_days : 1;
    var repetitions = (state && state.repetitions != null) ? state.repetitions : 0;

    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * ease);
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ease < 1.3) ease = 1.3;

    return {
      ease_factor: ease,
      interval_days: interval,
      repetitions: repetitions,
      due_at: new Date(Date.now() + interval * DAY_MS).toISOString()
    };
  }

  function syncReviewSchedule(client, userId, profile) {
    return client.from('subject_review_state').select('*').eq('user_id', userId)
      .then(function (res) {
        if (res.error) throw res.error;
        var existing = {};
        (res.data || []).forEach(function (row) { existing[row.subject_link] = row; });

        var subjects = profile.subjects;
        var toWrite = [];

        Object.keys(subjects).forEach(function (link) {
          var subj = subjects[link];
          if (!subj.link || !subj.lastAttempted) return;
          var row = existing[link];
          if (row && row.last_attempt_at && new Date(subj.lastAttempted) <= new Date(row.last_attempt_at)) return;

          var history = subj.accuracyHistory || [];
          var latest = history.length ? history[history.length - 1] : null;
          var accuracy = latest ? latest.accuracy : subj.weightedAccuracy;
          var update = computeSm2Update(row, qualityFromAccuracy(accuracy));

          toWrite.push({
            user_id: userId,
            subject_link: link,
            subject_name: subj.name,
            ease_factor: update.ease_factor,
            interval_days: update.interval_days,
            repetitions: update.repetitions,
            due_at: update.due_at,
            last_reviewed_at: row ? row.last_reviewed_at : null,
            last_attempt_at: subj.lastAttempted
          });
        });

        if (!toWrite.length) return existing;

        return client.from('subject_review_state')
          .upsert(toWrite, { onConflict: 'user_id,subject_link' })
          .select('*')
          .then(function (writeRes) {
            if (writeRes.error) throw writeRes.error;
            (writeRes.data || []).forEach(function (row) { existing[row.subject_link] = row; });
            return existing;
          });
      })
      .catch(function () { return {}; });
  }

  function recordManualReview(client, userId, subjectLink, subjectName, quality, currentState) {
    var update = computeSm2Update(currentState, quality);
    var row = {
      user_id: userId,
      subject_link: subjectLink,
      subject_name: subjectName,
      ease_factor: update.ease_factor,
      interval_days: update.interval_days,
      repetitions: update.repetitions,
      due_at: update.due_at,
      last_reviewed_at: new Date().toISOString()
    };
    if (currentState && currentState.last_attempt_at) row.last_attempt_at = currentState.last_attempt_at;

    return client.from('subject_review_state')
      .upsert(row, { onConflict: 'user_id,subject_link' })
      .select('*')
      .then(function (res) {
        if (res.error) throw res.error;
        return (res.data && res.data[0]) || row;
      });
  }

  function generateRecommendations(profile, topicGraph, userProfile, reviewStates) {
    var subjects = profile.subjects;
    var graphBySlug = profile._graphBySlug || {};
    var sectionCoverage = profile.sectionCoverage;
    var targetOlympiad = (userProfile && userProfile.target_olympiad)
      ? userProfile.target_olympiad.toUpperCase() : 'IBO';

    var candidates = [];

    (topicGraph || []).forEach(function (topic) {
      var subj = subjects[topic.slug];

      var weaknessSignal = 0.5;
      if (subj) {
        if (subj.masteryLevel === 'critical') weaknessSignal = 1.0;
        else if (subj.masteryLevel === 'weak') weaknessSignal = 0.8;
        else if (subj.masteryLevel === 'developing' && subj.trend === 'declining') weaknessSignal = 0.7;
        else if (subj.masteryLevel === 'developing') weaknessSignal = 0.3;
        else if (subj.masteryLevel === 'strong' || subj.masteryLevel === 'mastered') weaknessSignal = 0.0;
        else if (subj.masteryLevel === 'untested') weaknessSignal = 0.6;
      }

      var prereqReadiness = 1.0;
      if (topic.prerequisites && topic.prerequisites.length > 0) {
        var metCount = 0;
        var hasBlocker = false;
        topic.prerequisites.forEach(function (prereqSlug) {
          var prereqSubj = subjects[prereqSlug];
          if (prereqSubj) {
            if (prereqSubj.masteryLevel === 'developing' ||
                prereqSubj.masteryLevel === 'strong' ||
                prereqSubj.masteryLevel === 'mastered') {
              metCount++;
            } else if (prereqSubj.masteryLevel === 'critical' ||
                       prereqSubj.masteryLevel === 'untested') {
              hasBlocker = true;
            }
          } else {
            hasBlocker = true;
          }
        });
        if (hasBlocker) prereqReadiness = 0.1;
        else if (metCount === topic.prerequisites.length) prereqReadiness = 1.0;
        else prereqReadiness = 0.5;
      }

      var examRelevance = 0.3;
      var tags = topic.syllabus_tags || [];
      for (var i = 0; i < tags.length; i++) {
        if (tags[i].toUpperCase() === targetOlympiad) {
          examRelevance = 1.0;
          break;
        }
      }

      var coverageGap = 0.2;
      var sec = sectionCoverage[topic.section];
      if (sec) {
        var coveragePct = sec.total > 0 ? sec.tested / sec.total : 0;
        if (coveragePct === 0) coverageGap = 1.0;
        else if (coveragePct < 0.3) coverageGap = 0.7;
      }

      var recencyBoost = 0.0;
      if (subj && subj.lastAttempted) {
        var daysSince = (Date.now() - new Date(subj.lastAttempted).getTime()) / DAY_MS;
        if (daysSince > 90 && subj.masteryLevel !== 'strong' && subj.masteryLevel !== 'mastered') {
          recencyBoost = 1.0;
        } else if (daysSince > 30 && subj.masteryLevel !== 'strong' && subj.masteryLevel !== 'mastered') {
          recencyBoost = 0.6;
        }
      }

      var priority =
        0.40 * weaknessSignal +
        0.25 * prereqReadiness +
        0.15 * examRelevance +
        0.10 * coverageGap +
        0.10 * recencyBoost;

      if (subj && subj.masteryLevel === 'mastered' && subj.sampleConfidence > 0.5) {
        priority = 0;
      }

      candidates.push({
        topic: topic,
        subject: subj,
        priority: priority,
        weaknessSignal: weaknessSignal,
        prereqReadiness: prereqReadiness,
        examRelevance: examRelevance,
        coverageGap: coverageGap,
        recencyBoost: recencyBoost
      });
    });

    candidates.sort(function (a, b) { return b.priority - a.priority; });

    var priorityStudy = [];
    var prereqGaps = [];
    var expandCoverage = [];
    var revisitSoon = [];

    candidates.forEach(function (c) {
      if (c.priority <= 0) return;

      if (c.prereqReadiness <= 0.1 && prereqGaps.length < 3) {
        var needed = [];
        (c.topic.prerequisites || []).forEach(function (ps) {
          var ps_subj = subjects[ps];
          if (!ps_subj || ps_subj.masteryLevel === 'critical' || ps_subj.masteryLevel === 'untested') {
            var pt = graphBySlug[ps];
            needed.push(pt ? pt.title : ps);
          }
        });
        prereqGaps.push(makeRec(c, 'neutral',
          'Cover prerequisites first',
          'Before tackling ' + c.topic.title + ', strengthen: ' + needed.join(', ') + '.',
          c.topic.slug, 'Study ' + c.topic.title, 'prereq'));
        return;
      }

      var reviewRow = reviewStates ? reviewStates[c.topic.slug] : null;
      var isDue = !!(reviewRow && new Date(reviewRow.due_at).getTime() <= Date.now());

      if (isDue && c.subject && revisitSoon.length < 3) {
        var daysOverdue = Math.max(0, Math.round((Date.now() - new Date(reviewRow.due_at).getTime()) / DAY_MS));
        var dueBody = (daysOverdue > 0
          ? daysOverdue + ' day' + (daysOverdue === 1 ? '' : 's') + ' overdue for review'
          : 'Due for review today') + ', last scored ' + Math.round(c.subject.weightedAccuracy * 100) + '% accuracy.';
        var revisitRec = makeRec(c,
          c.subject.trend === 'declining' ? 'critical' : 'neutral',
          'Revisit ' + c.topic.title,
          dueBody,
          c.topic.slug, 'Review ' + c.topic.title, 'revisit');
        revisitRec.subjectLink = c.topic.slug;
        revisitRec.subjectName = c.subject.name;
        revisitRec.reviewState = reviewRow;
        revisitSoon.push(revisitRec);
        return;
      }

      if (!c.subject && expandCoverage.length < 3) {
        expandCoverage.push(makeRec(c, 'neutral',
          'Expand into ' + c.topic.title,
          'You haven\'t been tested on this yet. It falls under ' + (c.topic.sectionTitle || c.topic.section) + '.',
          c.topic.slug, 'Start ' + c.topic.title, 'expand'));
        return;
      }

      if (priorityStudy.length < 5) {
        var tone = 'neutral';
        var body = '';
        if (c.subject) {
          if (c.subject.masteryLevel === 'critical') {
            tone = 'critical';
            body = 'You\'ve scored ' + Math.round(c.subject.weightedAccuracy * 100) + '% across ' + c.subject.attemptCount + ' attempt' + (c.subject.attemptCount === 1 ? '' : 's') + ' on this topic';
            if (c.subject.trend === 'declining') body += ' (declining trend)';
            body += '. This is a priority area.';
          } else if (c.subject.masteryLevel === 'weak') {
            tone = 'weak';
            body = 'At ' + Math.round(c.subject.weightedAccuracy * 100) + '% accuracy, this topic needs focused study.';
          } else if (c.subject.masteryLevel === 'developing') {
            tone = 'neutral';
            body = 'Developing at ' + Math.round(c.subject.weightedAccuracy * 100) + '% -- a bit more practice should solidify this.';
          } else if (c.subject.masteryLevel === 'untested') {
            tone = 'neutral';
            body = 'Very little data on this topic yet. Try some questions that cover it.';
          }
        } else {
          body = 'Not yet tested. Covers ' + (c.topic.sectionTitle || c.topic.section) + '.';
        }
        priorityStudy.push(makeRec(c, tone,
          'Focus on ' + c.topic.title,
          body,
          c.topic.slug, 'Study ' + c.topic.title, 'priority'));
      }
    });

    var recs = [];
    if (priorityStudy.length) recs = recs.concat(priorityStudy);
    if (prereqGaps.length) recs = recs.concat(prereqGaps);
    if (expandCoverage.length) recs = recs.concat(expandCoverage);
    if (revisitSoon.length) recs = recs.concat(revisitSoon);

    if (recs.length === 0) {
      recs.push({
        tone: 'positive',
        title: 'Looking solid across the board',
        body: 'No urgent weak spots detected. Keep practicing to maintain your edge, or explore untested sections for broader coverage.',
        link: '/papers/',
        linkLabel: 'Practice more papers',
        bucket: 'positive'
      });
    }

    return recs.slice(0, 10);
  }

  function makeRec(candidate, tone, title, body, link, linkLabel, bucket) {
    return {
      tone: tone,
      title: title,
      body: body,
      link: link,
      linkLabel: linkLabel,
      bucket: bucket,
      masteryData: candidate.subject ? {
        score: candidate.subject.masteryScore,
        level: candidate.subject.masteryLevel,
        trend: candidate.subject.trend,
        attempts: candidate.subject.attemptCount,
        lastDate: candidate.subject.lastAttempted
      } : null,
      priority: candidate.priority
    };
  }

  window.BioKnowledge = {
    loadAttempts: loadAttempts,
    buildProfile: buildProfile,
    generateRecommendations: generateRecommendations,
    computeReadiness: computeReadiness,
    suggestNextPaper: suggestNextPaper,
    saveProfileCache: saveProfileCache,
    loadProfileCache: loadProfileCache,
    clearProfileCache: clearProfileCache,
    readCachedProfile: readCachedProfile,
    initAuthListener: initAuthListener,
    computeSm2Update: computeSm2Update,
    syncReviewSchedule: syncReviewSchedule,
    recordManualReview: recordManualReview
  };

  initAuthListener();
})();
