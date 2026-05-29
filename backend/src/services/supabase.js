import { createClient } from '@supabase/supabase-js';

let client = null;

function readSupabaseEnv() {
  return {
    url: process.env.SUPABASE_URL,
    key:
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY,
  };
}

export function getSupabase() {
  if (!client) {
    const { url, key } = readSupabaseEnv();

    if (!url || !url.startsWith('http')) {
      throw new Error('SUPABASE_URL is missing or invalid');
    }

    if (!key || key.startsWith('TODO')) {
      throw new Error('Supabase service role or anon key is missing');
    }

    client = createClient(url, key);
  }

  return client;
}
