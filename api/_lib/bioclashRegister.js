const { getAdminClient } = require('./supabaseAdmin');
const { captureError } = require('./sentry');
const { verifySecret } = require('./cronAuth');
const { rateLimit } = require('./rateLimit');

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL = 254;
const MAX_NAME = 60;
const DEFAULT_REDIRECT = 'https://bioguide.world/account/';

function isAlreadyRegistered(error) {
  if (!error) return false;
  if (error.code === 'email_exists' || error.code === 'user_already_exists') return true;
  return /already (been )?registered|already exists/i.test(error.message || '');
}

function readInput(body) {
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const displayName = typeof body.display_name === 'string' ? body.display_name.trim() : '';
  if (!email || email.length > MAX_EMAIL || !EMAIL_PATTERN.test(email)) {
    return { error: 'A valid email is required' };
  }
  if (!displayName || displayName.length > MAX_NAME) {
    return { error: `A display name of 1 to ${MAX_NAME} characters is required` };
  }
  return { email, displayName };
}

async function register(admin, body, redirectTo) {
  const input = readInput(body || {});
  if (input.error) return { status: 400, body: { ok: false, error: input.error } };

  const { error } = await admin.auth.admin.inviteUserByEmail(input.email, {
    data: { display_name: input.displayName },
    redirectTo
  });
  if (!error) return { status: 200, body: { ok: true, status: 'invited' } };
  if (isAlreadyRegistered(error)) return { status: 200, body: { ok: true, status: 'existing' } };
  return { status: 502, body: { ok: false, error: 'Could not send the invite' }, cause: error };
}

async function route(req, res) {
  try {
    await handle(req, res);
  } catch (e) {
    console.error('[bioclash-register] unhandled error:', e);
    await captureError(e, { route: 'bioclash-register' });
    if (!res.headersSent) res.status(500).json({ ok: false, error: 'Internal error' });
  }
}

module.exports = { route, register, readInput };

async function handle(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }
  if (!verifySecret(req, res, 'BIOCLASH_REGISTER_SECRET')) return;

  if (await rateLimit('bioclash-register', 'invite', 120, 3600000)) {
    res.status(429).json({ ok: false, error: 'Too many registrations this hour' });
    return;
  }

  const admin = getAdminClient();
  const redirectTo = process.env.BIOCLASH_REGISTER_REDIRECT || DEFAULT_REDIRECT;
  const result = await register(admin, req.body, redirectTo);
  if (result.cause) {
    console.error('[bioclash-register] invite failed:', result.cause);
    await captureError(result.cause, { route: 'bioclash-register' });
  }
  res.status(result.status).json(result.body);
}
