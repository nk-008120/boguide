// POST /api/bioclash-heartbeat  { paperId, sessionToken }
// Anti-cheat: single-active-session enforcement, verify half. Polled every
// ~20s by the frontend while an attempt is live. Unlike start-attempt and
// attempt-state, this endpoint never reclaims the session — it only checks
// whether the token it was handed still matches bioclash_attempts'
// active_session_token. If a second tab/device opened the same attempt
// since this client last loaded the page, that reclaim already overwrote
// the token, so this call starts failing here — which is the frontend's
// signal to lock its own UI. See supabase/migrations/010_bioclash_anticheat.sql
// and context/anti-cheating-measures.md for the full design.
//
// This alone is UX signaling, not the enforcement — a superseded tab could
// in principle keep POSTing here forever without ever finding out, if it
// weren't for the fact that save-draft and lock-block ALSO check the same
// token before writing anything. This endpoint just makes that visible to
// the student promptly instead of silently.
const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');

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
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, status, active_session_token')
      .eq('user_id', userId)
      .eq('paper_id', paperId)
      .maybeSingle();
    if (attemptError) throw attemptError;

    // Nothing to protect (no attempt, or it's already over) — tell the
    // frontend to stop polling rather than erroring.
    if (!attempt || attempt.status !== 'in_progress') {
      res.status(200).json({ ok: true, active: false });
      return;
    }

    if (attempt.active_session_token !== sessionToken) {
      res.status(409).json({ error: 'This attempt is now active in another tab or device.', reason: 'superseded' });
      return;
    }

    await admin.from('bioclash_attempts').update({ active_session_claimed_at: new Date().toISOString() }).eq('id', attempt.id);

    res.status(200).json({ ok: true, active: true });
  } catch (err) {
    console.error('bioclash-heartbeat failed:', err);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
};
