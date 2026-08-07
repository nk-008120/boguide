// Shared service-role Supabase client for api/ functions. This key bypasses
// Row Level Security entirely — never expose it to the browser, never log
// it, and never construct a client with it outside of trusted server code.
const { createClient } = require('@supabase/supabase-js');

let adminClient = null;
function getAdminClient() {
  if (adminClient) return adminClient;
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not configured');
  }
  adminClient = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return adminClient;
}

// A request-scoped client using the anon key, used only to verify a caller's
// access token via auth.getUser(token) — never used to read/write data.
let anonClient = null;
function getAnonClient() {
  if (anonClient) return anonClient;
  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY are not configured');
  }
  anonClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
  return anonClient;
}

module.exports = { getAdminClient, getAnonClient };
