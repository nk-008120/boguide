const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, allBlocks, componentIsCorrect, extensionPenalty, autoGrade } = require('./_lib/bioclash');

async function runCleanup(req, res, admin) {
  const { data: stale, error: staleError } = await admin
    .from('bioclash_attempts')
    .select('id, paper_id, end_at')
    .eq('status', 'in_progress')
    .lt('end_at', new Date().toISOString())
    .limit(50);
  if (staleError) throw staleError;

  let submitted = 0;
  for (const attempt of stale || []) {
    const paper = loadPaper(attempt.paper_id);
    if (!paper) continue;

    const { data: blocks } = await admin
      .from('bioclash_attempt_blocks')
      .select('block_id, answer')
      .eq('attempt_id', attempt.id);

    const { autoCorrect, autoTotal, autoMarksEarned, autoMarksTotal } = autoGrade(paper, blocks || []);

    const { error: updateError } = await admin
      .from('bioclash_attempts')
      .update({
        status: 'submitted',
        submitted_at: attempt.end_at,
        auto_score_correct: autoCorrect,
        auto_score_total: autoTotal,
        auto_marks_earned: autoMarksEarned,
        auto_marks_total: autoMarksTotal
      })
      .eq('id', attempt.id)
      .eq('status', 'in_progress');
    if (!updateError) submitted += 1;
  }

  res.status(200).json({ ok: true, found: (stale || []).length, submitted });
}

async function runExportGrades(req, res, admin) {
  const paperId = req.method === 'POST'
    ? (req.body && req.body.paperId)
    : req.query.paperId;

  const paper = loadPaper(paperId);
  if (!paper) {
    res.status(400).json({ error: 'Unknown paper' });
    return;
  }

  const { data: attempts, error: attemptsError } = await admin
    .from('bioclash_attempts')
    .select('id, user_id, status, started_at, submitted_at, extension_blocks_used')
    .eq('paper_id', paperId)
    .eq('status', 'submitted');
  if (attemptsError) throw attemptsError;

  if (!attempts || attempts.length === 0) {
    res.status(200).json({ paperId, totalMarks: paper.totalMarks || 0, participants: [] });
    return;
  }

  const userIds = attempts.map((a) => a.user_id);
  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);
  if (profilesError) throw profilesError;

  const profileMap = {};
  for (const p of profiles || []) profileMap[p.id] = p.display_name;

  const paperBlocks = allBlocks(paper);
  const participants = [];

  for (const attempt of attempts) {
    const { data: blockRows, error: blockError } = await admin
      .from('bioclash_attempt_blocks')
      .select('block_id, answer')
      .eq('attempt_id', attempt.id);
    if (blockError) throw blockError;

    const answerMap = {};
    for (const row of blockRows || []) answerMap[row.block_id] = row.answer || {};

    const components = [];
    let autoMarksEarned = 0;
    let autoMarksTotal = 0;

    for (const block of paperBlocks) {
      if (block.type === 'reveal_content') continue;
      for (const comp of block.components || []) {
        const submitted = (answerMap[block.id] || {})[comp.key];
        const result = componentIsCorrect(comp, submitted);
        const marks = comp.marks || 1;
        const autoGraded = result !== null;

        let marksAwarded = null;
        if (autoGraded) {
          marksAwarded = result ? marks : 0;
          autoMarksTotal += marks;
          autoMarksEarned += marksAwarded;
        }

        const entry = {
          blockId: block.id,
          key: comp.key,
          type: comp.type,
          marks,
          submitted: submitted !== undefined ? submitted : null,
          autoGraded,
          marksAwarded
        };

        if (autoGraded) {
          if (comp.type === 'mcq') entry.correct = comp.correctKey;
          else if (comp.type === 'true_false') entry.correct = comp.correctValue;
          else if (comp.type === 'numeric') entry.correct = comp.expected;
        }

        components.push(entry);
      }
    }

    participants.push({
      attemptId: attempt.id,
      userId: attempt.user_id,
      displayName: profileMap[attempt.user_id] || null,
      extensionBlocksUsed: attempt.extension_blocks_used || 0,
      startedAt: attempt.started_at,
      submittedAt: attempt.submitted_at,
      autoMarksEarned,
      autoMarksTotal,
      components
    });
  }

  res.status(200).json({
    paperId,
    totalMarks: paper.totalMarks || 0,
    participants
  });
}

async function runFinalizeRound(req, res, admin) {
  const { paperId, seasonYear, seasonWeight, dryRun, manualGrades } = req.body || {};

  if (!paperId || !seasonYear || seasonWeight == null) {
    res.status(400).json({ error: 'paperId, seasonYear, and seasonWeight are required' });
    return;
  }

  const paper = loadPaper(paperId);
  if (!paper) {
    res.status(400).json({ error: 'Unknown paper' });
    return;
  }

  const { data: attempts, error: attemptsError } = await admin
    .from('bioclash_attempts')
    .select('id, user_id, started_at, submitted_at, extension_blocks_used')
    .eq('paper_id', paperId)
    .eq('status', 'submitted');
  if (attemptsError) throw attemptsError;

  if (!attempts || attempts.length === 0) {
    res.status(200).json({ ok: true, message: 'No submitted attempts found', results: [] });
    return;
  }

  const userIds = attempts.map((a) => a.user_id);
  const { data: profiles, error: profilesError } = await admin
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds);
  if (profilesError) throw profilesError;

  const profileMap = {};
  for (const p of profiles || []) profileMap[p.id] = p.display_name;

  const paperBlocks = allBlocks(paper);
  const totalMarks = paper.totalMarks || 0;
  const grades = manualGrades || {};

  const participantScores = [];

  for (const attempt of attempts) {
    const { data: blockRows, error: blockError } = await admin
      .from('bioclash_attempt_blocks')
      .select('block_id, answer')
      .eq('attempt_id', attempt.id);
    if (blockError) throw blockError;

    const answerMap = {};
    for (const row of blockRows || []) answerMap[row.block_id] = row.answer || {};

    let autoMarks = 0;
    let manualMarks = 0;
    const attemptGrades = grades[attempt.id] || {};

    for (const block of paperBlocks) {
      if (block.type === 'reveal_content') continue;
      for (const comp of block.components || []) {
        const submitted = (answerMap[block.id] || {})[comp.key];
        const result = componentIsCorrect(comp, submitted);
        const marks = comp.marks || 1;

        if (result !== null) {
          autoMarks += result ? marks : 0;
        } else if (attemptGrades[comp.key] != null) {
          const awarded = Number(attemptGrades[comp.key]);
          if (!Number.isNaN(awarded) && awarded >= 0 && awarded <= marks) {
            manualMarks += awarded;
          }
        }
      }
    }

    const rawScore = autoMarks + manualMarks;
    const blocksUsed = attempt.extension_blocks_used || 0;
    const penalty = extensionPenalty(paper, blocksUsed);
    const penalizedScore = rawScore * (1 - penalty);

    participantScores.push({
      attemptId: attempt.id,
      userId: attempt.user_id,
      displayName: profileMap[attempt.user_id] || null,
      autoMarks,
      manualMarks,
      rawScore,
      extensionBlocksUsed: blocksUsed,
      extensionPenalty: penalty,
      penalizedScore,
      scoreLabel: rawScore + ' / ' + totalMarks,
      startedAt: attempt.started_at,
      submittedAt: attempt.submitted_at
    });
  }

  const mean = participantScores.reduce((s, p) => s + p.penalizedScore, 0) / participantScores.length;
  const variance = participantScores.reduce((s, p) => s + Math.pow(p.penalizedScore - mean, 2), 0) / participantScores.length;
  const stddev = Math.sqrt(variance);

  for (const p of participantScores) {
    p.zScore = stddev === 0 ? 0 : (p.penalizedScore - mean) / stddev;
    p.timeNormalizedZ = p.zScore;
  }

  participantScores.sort((a, b) => b.zScore - a.zScore);
  participantScores.forEach((p, i) => { p.placement = i + 1; });

  if (dryRun) {
    res.status(200).json({
      ok: true,
      dryRun: true,
      paperId,
      totalMarks,
      mean: Math.round(mean * 100) / 100,
      stddev: Math.round(stddev * 100) / 100,
      results: participantScores
    });
    return;
  }

  const season = seasonYear + ':' + paperId;

  const { error: deleteError } = await admin
    .from('bioclash_results')
    .delete()
    .eq('season', season);
  if (deleteError) throw deleteError;

  const rows = participantScores.map((p) => ({
    user_id: p.userId,
    season,
    placement: p.placement,
    score_label: p.scoreLabel,
    season_year: seasonYear,
    round_id: paperId,
    raw_score: p.rawScore,
    z_score: Math.round(p.zScore * 10000) / 10000,
    time_normalized_z: Math.round(p.timeNormalizedZ * 10000) / 10000,
    season_weight: seasonWeight
  }));

  const { error: insertError } = await admin
    .from('bioclash_results')
    .insert(rows);
  if (insertError) throw insertError;

  res.status(200).json({
    ok: true,
    dryRun: false,
    paperId,
    totalMarks,
    mean: Math.round(mean * 100) / 100,
    stddev: Math.round(stddev * 100) / 100,
    inserted: rows.length,
    results: participantScores
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const authHeader = req.headers.authorization || '';
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const action = req.method === 'POST' ? (req.body && req.body.action) : req.query.action;

  try {
    const admin = getAdminClient();

    if (action === 'cleanup') {
      await runCleanup(req, res, admin);
    } else if (action === 'export-grades') {
      await runExportGrades(req, res, admin);
    } else if (action === 'finalize-round') {
      await runFinalizeRound(req, res, admin);
    } else {
      res.status(400).json({ error: 'Unknown or missing action. Expected one of: cleanup, export-grades, finalize-round' });
    }
  } catch (err) {
    console.error('bioclash-admin failed (action=' + action + '):', err);
    res.status(500).json({ error: 'Admin operation failed' });
  }
};
