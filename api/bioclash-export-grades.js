const { getAdminClient } = require('./_lib/supabaseAdmin');
const { loadPaper, allBlocks, componentIsCorrect } = require('./_lib/bioclash');

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

  try {
    const paperId = req.method === 'POST'
      ? (req.body && req.body.paperId)
      : req.query.paperId;

    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }

    const admin = getAdminClient();

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
    const blockMap = {};
    for (const b of paperBlocks) blockMap[b.id] = b;

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
  } catch (err) {
    console.error('bioclash-export-grades failed:', err);
    res.status(500).json({ error: 'Export failed' });
  }
};
