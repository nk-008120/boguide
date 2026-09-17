const { getAdminClient } = require('./_lib/supabaseAdmin');
const { authenticate } = require('./_lib/bioclash');
const { captureError } = require('./_lib/sentry');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const userId = await authenticate(req, res, 'heartbeat', 6, 60000);
    if (!userId) return;

    const { paperId, sessionToken, reachedFinalPage, event } = req.body || {};
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    if (event === 'tab_close') {
      const { data: attempt, error: attemptError } = await admin
        .from('bioclash_attempts')
        .select('id, tab_close_events')
        .eq('user_id', userId)
        .eq('paper_id', paperId)
        .eq('active_session_token', sessionToken)
        .eq('status', 'in_progress')
        .maybeSingle();
      if (attemptError) throw attemptError;

      if (!attempt) {
        res.status(200).json({ ok: true, logged: false });
        return;
      }

      await admin
        .from('bioclash_attempts')
        .update({ tab_close_events: (attempt.tab_close_events || 0) + 1 })
        .eq('id', attempt.id);

      res.status(200).json({ ok: true, logged: true });
      return;
    }

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, active_session_token, active_session_claimed_at, heartbeat_gaps')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;

    if (!attempt || attempt.status !== 'in_progress') {
      res.status(200).json({ ok: true, active: false });
      return;
    }

    if (attempt.active_session_token !== sessionToken) {
      res.status(409).json({ error: 'This attempt is now active in another tab or device.', reason: 'superseded' });
      return;
    }

    const now = new Date();
    const patch = { active_session_claimed_at: now.toISOString() };
    if (reachedFinalPage === true) patch.reached_final_page = true;

    if (attempt.active_session_claimed_at) {
      const lastClaim = new Date(attempt.active_session_claimed_at).getTime();
      const gapMs = now.getTime() - lastClaim;
      if (gapMs > 60000) {
        patch.heartbeat_gaps = (attempt.heartbeat_gaps || 0) + 1;
      }
    }

    await admin.from('bioclash_attempts').update(patch).eq('id', attempt.id);

    res.status(200).json({ ok: true, active: true });
  } catch (err) {
    console.error('bioclash-heartbeat failed:', err);
    await captureError(err, { route: 'bioclash-heartbeat' });
    res.status(500).json({ error: 'Heartbeat failed' });
  }
};
