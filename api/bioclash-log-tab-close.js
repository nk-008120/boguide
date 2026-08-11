// POST /api/bioclash-log-tab-close  { paperId, sessionToken }
// Soft anti-cheat signal (2026-08-11 season-system planning pass), same
// posture as fullscreen_exits/visibility_losses: there is no technical way
// to prevent a tab from closing, so this only logs that it happened, for
// founder post-hoc review — never auto-penalizing, never gating anything.
// Fired via navigator.sendBeacon() from bioclash-attempt.js's
// beforeunload listener specifically BECAUSE a normal fetch() can be
// aborted mid-flight when a page unloads, while sendBeacon is designed to
// reliably complete a small POST during unload — but sendBeacon cannot
// attach a custom Authorization header, so unlike every other bioclash-*
// endpoint this one does NOT verify a Supabase auth token. Instead it
// trusts sessionToken (the anti-cheat single-active-session token,
// freshly minted per boot/resume — see supabase/migrations/
// 010_bioclash_anticheat.sql) to identify which in-progress attempt to
// increment. That's an acceptable trade-off ONLY because this is a purely
// informational counter with zero security/scoring consequence — never
// reuse this reduced-auth pattern for anything that writes an answer or
// affects a result.
const { getAdminClient } = require('./_lib/supabaseAdmin');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { paperId, sessionToken } = req.body || {};
    if (!paperId || !sessionToken) {
      res.status(400).json({ error: 'paperId and sessionToken are required' });
      return;
    }

    const admin = getAdminClient();

    const { data: attempt, error: attemptError } = await admin
      .from('bioclash_attempts')
      .select('id, tab_close_events')
      .eq('paper_id', paperId)
      .eq('active_session_token', sessionToken)
      .eq('status', 'in_progress')
      .maybeSingle();
    if (attemptError) throw attemptError;

    // No matching in-progress attempt (already submitted/expired, or a
    // stale/superseded token) — nothing to log, not an error. sendBeacon
    // has no way to read the response anyway.
    if (!attempt) {
      res.status(200).json({ ok: true, logged: false });
      return;
    }

    await admin
      .from('bioclash_attempts')
      .update({ tab_close_events: (attempt.tab_close_events || 0) + 1 })
      .eq('id', attempt.id);

    res.status(200).json({ ok: true, logged: true });
  } catch (err) {
    console.error('bioclash-log-tab-close failed:', err);
    res.status(500).json({ error: 'Could not log tab-close event' });
  }
};
