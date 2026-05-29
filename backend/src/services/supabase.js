import { createClient } from '@supabase/supabase-js';
import { config } from '../config.js';

let client = null;

function resolveSupabaseUrl() {
  const url = config.supabaseUrl;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  return 'https://placeholder.supabase.co';
}

export function getSupabase() {
  if (!client) {
    client = createClient(resolveSupabaseUrl(), config.supabaseServiceKey);
  }
  return client;
}
