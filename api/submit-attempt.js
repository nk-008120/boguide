const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { getAdminClient } = require('./_lib/supabaseAdmin');
const { captureError } = require('./_lib/sentry');
const { authenticate } = require('./_lib/auth');

const ID_PATTERN = /^[a-z0-9-]+$/;

const roundsCache = new Map();

function loadRounds(olympiad, year) {
  const cacheKey = `${olympiad}:${year}`;
  if (roundsCache.has(cacheKey)) return roundsCache.get(cacheKey);
  const filePath = path.join(__dirname, '..', 'data', 'papers', olympiad, `${year}.yaml`);
  let raw;
  try {
    raw = fs.readFileSync(filePath, 'utf8');
  } catch (e) {
    return null;
  }
  const doc = yaml.load(raw);
  const rounds = (doc && doc.rounds) || [];
  roundsCache.set(cacheKey, rounds);
  return rounds;
}

function loadRound(olympiad, year, roundId) {
  const rounds = loadRounds(olympiad, year);
  if (!rounds) return null;
  return rounds.find((r) => r.id === roundId) || null;
}

function gradableStatements(p) {
  return (p.statements || []).filter((s) => (s.type || 'true_false') !== 'free_response');
}

function recompute(round, answers) {
  let totalCorrect = 0;
  let totalStatements = 0;
  const subjectStats = {};
  const perQuestion = [];

  (round.problems || []).forEach((p) => {
    const ans = (answers && answers[p.id]) || {};
    const gradable = gradableStatements(p);
    let correct = 0;
    gradable.forEach((s) => {
      totalStatements++;
      const given = ans[s.letter];
      let isCorrect;
      if (s.type === 'numeric') {
        isCorrect = typeof given === 'number' && !isNaN(given) &&
          Math.abs(given - s.expected) <= (s.tolerance || 0);
      } else {
        isCorrect = given === s.answer;
      }
      if (isCorrect) {
        correct++;
        totalCorrect++;
      }
    });
    perQuestion.push({ id: p.id, number: p.number, name: p.name, correct, total: gradable.length });
    const subjectCount = (p.subjects || []).length || 1;
    (p.subjects || []).forEach((subj) => {
      if (!subjectStats[subj.name]) subjectStats[subj.name] = { correct: 0, total: 0, link: subj.link };
      subjectStats[subj.name].correct += correct / subjectCount;
      subjectStats[subj.name].total += gradable.length / subjectCount;
    });
  });

  return { totalCorrect, totalStatements, subjectStats, perQuestion };
}

module.exports = async (req, res) => {
  try {
    await handle(req, res);
  } catch (e) {
    console.error('[submit-attempt] unhandled error:', e);
    await captureError(e, { route: 'submit-attempt' });
    if (!res.headersSent) res.status(500).json({ error: 'Internal error' });
  }
};

module.exports.recompute = recompute;

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userId = await authenticate(req, res, 'papers-submit-attempt', 10, 60000);
  if (!userId) return;

  const body = req.body || {};
  const { olympiad, year, roundId, answers, timeSpent, fullscreenExits } = body;
  const showOnLeaderboard = body.showOnLeaderboard !== false;
  const showOnDashboard = body.showOnDashboard !== false;

  if (
    typeof olympiad !== 'string' || !ID_PATTERN.test(olympiad) ||
    typeof year !== 'string' || !ID_PATTERN.test(year) ||
    typeof roundId !== 'string' || !ID_PATTERN.test(roundId) ||
    typeof answers !== 'object' || answers === null
  ) {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  if (!showOnLeaderboard && !showOnDashboard) {
    res.status(400).json({ error: 'Select at least one of leaderboard or dashboard to save this attempt' });
    return;
  }

  const round = loadRound(olympiad, year, roundId);
  if (!round) {
    res.status(400).json({ error: 'Unknown olympiad/year/round' });
    return;
  }

  const { totalCorrect, totalStatements, subjectStats, perQuestion } = recompute(round, answers);

  let durationSec = 0;
  if (timeSpent && typeof timeSpent === 'object') {
    durationSec = Object.keys(timeSpent).reduce((sum, k) => sum + (Number(timeSpent[k]) || 0), 0);
  }
  const maxDurationSec = (round.durationMinutes || 180) * 60;
  durationSec = Math.max(0, Math.min(durationSec, maxDurationSec));
  const avgTimeSec = perQuestion.length ? durationSec / perQuestion.length : 0;

  const admin = getAdminClient();
  const { error: insertError } = await admin.from('attempt_reports').insert({
    user_id: userId,
    olympiad,
    year,
    round_id: roundId,
    round_name: round.name || roundId,
    total_correct: totalCorrect,
    total_statements: totalStatements,
    duration_sec: Math.round(durationSec),
    avg_time_sec: avgTimeSec,
    fullscreen_exits: Number(fullscreenExits) || 0,
    subject_stats: subjectStats,
    per_question: perQuestion,
    show_on_leaderboard: showOnLeaderboard,
    show_on_dashboard: showOnDashboard
  });

  if (insertError) {
    console.error('[submit-attempt] insert failed:', insertError);
    await captureError(insertError, { route: 'submit-attempt', stage: 'insert' });
    res.status(500).json({ error: 'Could not save attempt' });
    return;
  }

  let rank = null;
  if (showOnLeaderboard) {
    const { data: rankRow } = await admin
      .from('leaderboard_per_round')
      .select('rank')
      .eq('user_id', userId)
      .eq('olympiad', olympiad)
      .eq('year', year)
      .eq('round_id', roundId)
      .maybeSingle();
    rank = rankRow ? rankRow.rank : null;
  }

  const scorePct = totalStatements > 0 ? Math.round((totalCorrect / totalStatements) * 1000) / 10 : 0;

  res.status(200).json({
    totalCorrect,
    totalStatements,
    showOnLeaderboard,
    showOnDashboard,
    scorePct,
    rank,
    roundName: round.name || roundId,
    submittedAt: new Date().toISOString()
  });
};
