require('dotenv').config();
const { sendEvent } = require('../api/_lib/sentry');

(async () => {
  if (!process.env.SENTRY_DSN) {
    console.error('SENTRY_DSN is not set. Put it in .env or the environment and run again.');
    process.exit(1);
  }
  const ok = await sendEvent(new Error('BiOGuide Sentry test event'), { route: 'sentry-test' }, process.env, fetch);
  console.log(ok ? 'Sent. It should appear in Sentry under Issues within a minute.' : 'Sentry refused the event. Check the DSN.');
  process.exit(ok ? 0 : 1);
})().catch((err) => {
  console.error('Could not reach Sentry:', err.message);
  process.exit(1);
});
