let Sentry = null;
let initialized = false;

function init() {
  if (initialized) return;
  initialized = true;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) return;
  Sentry = require('@sentry/vercel-edge');
  Sentry.init({
    dsn,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
    tracesSampleRate: 0
  });
}

async function captureError(err, context) {
  init();
  if (!Sentry) return;
  try {
    Sentry.withScope((scope) => {
      if (context) {
        for (const key of Object.keys(context)) scope.setTag(key, String(context[key]));
      }
      Sentry.captureException(err);
    });
    await Sentry.flush(2000);
  } catch (flushErr) {
    console.error('sentry capture failed:', flushErr);
  }
}

module.exports = { captureError };
