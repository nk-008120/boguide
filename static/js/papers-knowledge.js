/* papers-knowledge.js -- Client-side knowledge profile and recommendation engine.
   Aggregates a logged-in user's attempt_reports into per-subject mastery scores,
   then ranks study recommendations using the site's topic prerequisite graph.
   Exposes window.BioKnowledge. */

(function () {
  'use strict';

  var DAY_MS = 86400000;

  function timeDecayWeight(submittedAt) {
    var age = Date.now() - new Date(submittedAt).getTime();
    var days = age / DAY_MS;
    if (days < 7) return 1.0;
    if (days < 30) return 0.8;
    if (days < 90) return 0.5;
    return 0.3;
  }

  function loadAttempts(supabaseClient, userId) {
    return supabaseClient
      .from('attempt_reports')
      .select('olympiad, year, round_id, round_name, total_correct, total_statements, score_pct, duration_sec, subject_stats, per_question, submitted_at')
      .eq('user_id', userId)
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
        var key = link || name;

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
        entry.entries.push({
          correct: s.correct,
          total: s.total,
          weight: weight,
          submittedAt: attempt.submitted_at
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
      if (entry.entries.length >= 2) {
        var sorted = entry.entries.slice().sort(function (a, b) {
          return new Date(a.submittedAt) - new Date(b.submittedAt);
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
      }

      subjects[key] = {
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
        trend: trend
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
          masterySum: 0
        };
      }
      sectionCoverage[t.section].total++;
      if (subjects[t.slug]) {
        sectionCoverage[t.section].tested++;
        sectionCoverage[t.section].masterySum += subjects[t.slug].masteryScore;
      }
    });
    Object.keys(sectionCoverage).forEach(function (sec) {
      var c = sectionCoverage[sec];
      c.avgMastery = c.tested > 0 ? c.masterySum / c.tested : 0;
    });

    var subjectValues = Object.keys(subjects).map(function (k) { return subjects[k]; });
    var testedSubjects = subjectValues.filter(function (s) { return s.masteryLevel !== 'untested'; });
    var sortedByMastery = testedSubjects.slice().sort(function (a, b) { return a.masteryScore - b.masteryScore; });
    var strongestSubjects = sortedByMastery.slice(-3).reverse();
    var weakestSubjects = sortedByMastery.slice(0, 3);

    var totalAttempts = attempts.length;
    var avgScore = 0;
    if (totalAttempts > 0) {
      var scoreSum = 0;
      attempts.forEach(function (a) { scoreSum += (a.score_pct || 0); });
      avgScore = scoreSum / totalAttempts;
    }

    return {
      subjects: subjects,
      overall: {
        totalAttempts: totalAttempts,
        averageScore: Math.round(avgScore * 10) / 10,
        strongestSubjects: strongestSubjects,
        weakestSubjects: weakestSubjects,
        lastAttemptDate: totalAttempts > 0
          ? attempts[attempts.length - 1].submitted_at : null
      },
      sectionCoverage: sectionCoverage,
      _graphBySlug: graphBySlug
    };
  }

  function generateRecommendations(profile, topicGraph, userProfile) {
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

      if (c.recencyBoost >= 0.6 && c.subject && revisitSoon.length < 3) {
        var daysSince = Math.round((Date.now() - new Date(c.subject.lastAttempted).getTime()) / DAY_MS);
        revisitSoon.push(makeRec(c,
          c.subject.trend === 'declining' ? 'critical' : 'neutral',
          'Revisit ' + c.topic.title,
          'Last tested ' + daysSince + ' days ago at ' + Math.round(c.subject.weightedAccuracy * 100) + '% accuracy. Time for a refresh.',
          c.topic.slug, 'Review ' + c.topic.title, 'revisit'));
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
    generateRecommendations: generateRecommendations
  };
})();
