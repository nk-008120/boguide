const { getAdminClient, getAnonClient } = require('./_lib/supabaseAdmin');
const { verifyCronSecret } = require('./_lib/cronAuth');
const { captureError } = require('./_lib/sentry');

const UNRESOLVED_CODES = new Set(['ZZ', 'XX', 'EU', 'AP']);

function flagFromCode(code) {
  if (!/^[A-Z]{2}$/.test(code)) return null;
  const points = [...code].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...points);
}

function nameFromCode(code) {
  if (UNRESOLVED_CODES.has(code)) return null;
  try {
    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
    return name && name !== code ? name : null;
  } catch (e) {
    return null;
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_CATCH_UP_DAYS = 60;

function startOfUtcDay(ms) {
  return Math.floor(ms / DAY_MS) * DAY_MS;
}

function dayString(ms) {
  return new Date(ms).toISOString().slice(0, 10);
}

async function umamiGet(path, params) {
  const base = (process.env.UMAMI_API_URL || 'https://api.umami.is/v1').replace(/\/$/, '');
  const res = await fetch(`${base}${path}?${new URLSearchParams(params)}`, {
    headers: { 'x-umami-api-key': process.env.UMAMI_API_KEY, Accept: 'application/json' }
  });
  if (!res.ok) throw new Error(`Umami request ${path} failed: ${res.status}`);
  return res.json();
}

function readStatValue(stats, key) {
  if (!stats || typeof stats !== 'object') return null;
  const field = stats[key];
  if (typeof field === 'number') return field;
  if (field && typeof field === 'object' && typeof field.value === 'number') return field.value;
  return null;
}

async function fetchDay(websiteId, dayStart) {
  const range = { startAt: String(dayStart), endAt: String(dayStart + DAY_MS - 1) };
  const stats = await umamiGet(`/websites/${websiteId}/stats`, range);
  const visits = readStatValue(stats, 'visits');
  if (visits == null) throw new Error('Umami stats response had no visits value');
  const rows = await umamiGet(`/websites/${websiteId}/metrics/expanded`, { ...range, type: 'country', limit: '500' });
  const countries = (Array.isArray(rows) ? rows : []).map((row) => ({
    code: String(row.name || row.x || '').toUpperCase(),
    visits: Number(row.visits != null ? row.visits : row.y) || 0
  }));
  return { visits, countries };
}

function mergeCountries(existing, additions) {
  const byCode = new Map();
  for (const c of Array.isArray(existing) ? existing : []) {
    if (c && c.code) byCode.set(c.code, { ...c, visits: Number(c.visits) || 0 });
  }
  for (const add of additions) {
    if (!add.visits) continue;
    const prev = byCode.get(add.code);
    if (prev) {
      prev.visits += add.visits;
      continue;
    }
    const name = nameFromCode(add.code);
    const flag = flagFromCode(add.code);
    if (!name || !flag) continue;
    byCode.set(add.code, { code: add.code, name, flag, visits: add.visits });
  }
  return [...byCode.values()].sort((a, b) => b.visits - a.visits);
}

async function runKeepalive() {
  const client = getAnonClient();
  const { error } = await client.from('profiles').select('id').limit(1);
  if (error) throw error;
}

async function runSyncCountryStats() {
  const websiteId = process.env.UMAMI_WEBSITE_ID;
  if (!process.env.UMAMI_API_KEY || !websiteId) {
    throw new Error('UMAMI_API_KEY / UMAMI_WEBSITE_ID are not configured');
  }

  const client = getAdminClient();
  const { data: row, error: readError } = await client
    .from('country_stats_cache')
    .select('total_visits, countries, last_synced_day')
    .eq('id', 'latest')
    .maybeSingle();
  if (readError) throw readError;

  const today = startOfUtcDay(Date.now());
  const yesterday = today - DAY_MS;
  let next = row && row.last_synced_day ? Date.parse(row.last_synced_day + 'T00:00:00Z') + DAY_MS : yesterday;
  next = Math.max(next, today - MAX_CATCH_UP_DAYS * DAY_MS);
  if (next > yesterday) return { days: 0, countries: (row && row.countries || []).length, visits: row ? row.total_visits : 0 };

  let totalVisits = row ? Number(row.total_visits) || 0 : 0;
  let countries = row ? row.countries : [];
  let lastDay = null;
  for (let day = next; day <= yesterday; day += DAY_MS) {
    const result = await fetchDay(websiteId, day);
    totalVisits += result.visits;
    countries = mergeCountries(countries, result.countries);
    lastDay = day;
  }

  const { error } = await client.from('country_stats_cache').upsert({
    id: 'latest',
    total_countries: countries.length,
    total_visits: totalVisits,
    countries,
    last_synced_day: dayString(lastDay),
    last_updated: new Date().toISOString()
  });
  if (error) throw error;

  return { days: Math.round((lastDay - next) / DAY_MS) + 1, countries: countries.length, visits: totalVisits };
}

module.exports = async (req, res) => {
  if (!verifyCronSecret(req, res)) return;

  const result = { ok: true, time: new Date().toISOString() };

  try {
    await runKeepalive();
    result.keepalive = 'ok';
  } catch (err) {
    console.error('daily-cron keepalive failed:', err);
    await captureError(err, { route: 'daily-cron', task: 'keepalive' });
    result.ok = false;
    result.keepalive = 'failed: ' + err.message;
  }

  try {
    const synced = await runSyncCountryStats();
    result.daysAdded = synced.days;
    result.totalCountries = synced.countries;
    result.totalVisits = synced.visits;
    result.syncCountryStats = 'ok';
  } catch (err) {
    console.error('daily-cron sync-country-stats failed:', err);
    await captureError(err, { route: 'daily-cron', task: 'sync-country-stats' });
    result.ok = false;
    result.syncCountryStats = 'failed: ' + err.message;
  }

  res.status(result.ok ? 200 : 500).json(result);
};
