// POST /api/bioclash-request-extension  { paperId, sessionToken }
// Live time-extension mechanic (2026-08-11 season-system planning pass).
// Modeled directly on bioclash-heartbeat.js's auth/session-token shape.
// Grants one more extensionBlockMinutes-sized block on top of the
// attempt's end_at, up to the round's maxExtensionBlocks — always one
// continuous sitting, this only ever pushes end_at further out, never
// pauses/resumes anything. The actual Z-score COST of the block requested
// here isn't computed or charged at request time — it's a fixed,
// pre-declared marginal cost (paper.extensionCostSchedule) applied later,
// once the round closes and raw scores are graded, by
// scripts/bioclash-score-round.js — see
// context/bioclash-season-points-plan.md for the full formula. This
// endpoint's only job is to extend the clock and record how many blocks
// were used; it does not touch bioclash_results.
const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { loadPaper } = require('./_lib/bioclash');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      res.status(401).json({ error: 'Missing Authorization header' });
      return;
    }

    const anon = getAnonClient();
    const { data: userData, error: userError } = await anon.auth.getUser(token);
    if (userError || !userData || !userData.user) {
      res.status(401).json({ error: 'Invalid session' });
      return;
    }
    const userId = userData.user.id;

    const { paperId, sessionToken } = req.body || {};
    const paper = loadPaper(paperId);
    if (!paper) {
      res.status(400).json({ error: 'Unknown paper' });
      return;
    }
    const maxBlocks = paper.maxExtensionBlocks || 0;
    const blockMinutes = paper.extensionBlockMinutes || 0;
    if (!maxBlocks || !blockMinutes) {
      res.status(400).json({ error: 'This round has no time-extension mechanic.' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, end_at, active_session_token, extension_blocks_used')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;
    if (!attempt || attempt.status !== 'in_progress') {
      res.status(409).json({ error: 'No active attempt' });
      return;
    }
    // Hard cutoff, no grace window — same posture as lock-block/save-draft.
    if (new Date(attempt.end_at).getTime() <= Date.now()) {
      res.status(409).json({ error: 'Time has expired' });
      return;
    }
    // Anti-cheat: single-active-session enforcement, same gate every other
    // write endpoint checks — see supabase/migrations/010_bioclash_anticheat.sql.
    if (!sessionToken || sessionToken !== attempt.active_session_token) {
      res.status(409).json({ error: 'This attempt is now active in another tab or device.', reason: 'superseded' });
      return;
    }
    if (attempt.extension_blocks_used >= maxBlocks) {
      res.status(409).json({ error: 'No extension blocks remaining for this round.' });
      return;
    }

    const newEndAt = new Date(new Date(attempt.end_at).getTime() + blockMinutes * 60000).toISOString();
    const newBlocksUsed = attempt.extension_blocks_used + 1;

    // Conditional update: only succeeds if extension_blocks_used hasn't
    // moved since we read it — guards against a double-click/replayed
    // request granting two blocks for one click.
    const { data: updated, error: updateError } = await admin
      .from('bioclash_attempts')
      .update({ end_at: newEndAt, extension_blocks_used: newBlocksUsed })
      .eq('id', attempt.id)
      .eq('extension_blocks_used', attempt.extension_blocks_used)
      .select('end_at, extension_blocks_used')
      .maybeSingle();
    if (updateError) throw updateError;
    if (!updated) {
      res.status(409).json({ error: 'Could not grant extension — try again.' });
      return;
    }

    res.status(200).json({
      ok: true,
      endAt: updated.end_at,
      extensionBlocksUsed: updated.extension_blocks_used,
      maxExtensionBlocks: maxBlocks
    });
  } catch (err) {
    console.error('bioclash-request-extension failed:', err);
    res.status(500).json({ error: 'Could not grant extension' });
  }
};
