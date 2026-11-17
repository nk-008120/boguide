const crypto = require('crypto');

const TIMEOUT_MS = 2000;
const MAX_FRAMES = 50;

function parseDsn(dsn) {
  try {
    const url = new URL(dsn);
    const parts = url.pathname.split('/').filter(Boolean);
    const projectId = parts.pop();
    if (!url.username || !projectId) return null;
    const prefix = parts.length ? '/' + parts.join('/') : '';
    return {
      key: url.username,
      endpoint: `${url.protocol}//${url.host}${prefix}/api/${projectId}/envelope/`
    };
  } catch {
    return null;
  }
}

function parseStack(stack) {
  const frames = [];
  for (const line of String(stack || '').split('\n').slice(1)) {
    const m = line.match(/^\s*at (?:(.+?) \()?(.+?):(\d+):(\d+)\)?$/);
    if (!m) continue;
    frames.push({ function: m[1] || '?', filename: m[2], lineno: Number(m[3]), colno: Number(m[4]), in_app: !m[2].includes('node_modules') && !m[2].startsWith('node:') });
    if (frames.length >= MAX_FRAMES) break;
  }
  return frames.reverse();
}

function buildEvent(err, context, env) {
  const error = err instanceof Error ? err : new Error(typeof err === 'string' ? err : JSON.stringify(err));
  const tags = {};
  if (context) {
    for (const key of Object.keys(context)) tags[key] = String(context[key]);
  }
  const frames = parseStack(error.stack);
  return {
    event_id: crypto.randomUUID().replace(/-/g, ''),
    timestamp: Date.now() / 1000,
    platform: 'node',
    level: 'error',
    environment: env.VERCEL_ENV || env.NODE_ENV || 'development',
    release: env.VERCEL_GIT_COMMIT_SHA || undefined,
    tags,
    exception: {
      values: [{
        type: error.name || 'Error',
        value: error.message || String(error),
        stacktrace: frames.length ? { frames } : undefined
      }]
    }
  };
}

function buildEnvelope(event, dsn) {
  const header = JSON.stringify({ event_id: event.event_id, sent_at: new Date().toISOString(), dsn });
  return `${header}\n${JSON.stringify({ type: 'event' })}\n${JSON.stringify(event)}\n`;
}

async function sendEvent(err, context, env, fetchImpl) {
  const dsn = env.SENTRY_DSN;
  const target = dsn ? parseDsn(dsn) : null;
  if (!target) return false;
  const event = buildEvent(err, context, env);
  const res = await fetchImpl(target.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-sentry-envelope',
      'X-Sentry-Auth': `Sentry sentry_version=7, sentry_key=${target.key}, sentry_client=bioguide-api/1.0`
    },
    body: buildEnvelope(event, dsn),
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  return res.ok;
}

async function captureError(err, context) {
  try {
    await sendEvent(err, context, process.env, fetch);
  } catch (sendErr) {
    console.error('sentry capture failed:', sendErr);
  }
}

module.exports = { captureError, sendEvent, parseDsn, parseStack, buildEvent };
