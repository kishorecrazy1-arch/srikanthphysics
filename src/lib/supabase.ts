import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Allow app to load locally without .env; Supabase calls will fail until vars are set
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them to .env for auth and DB.');
}

const hasValidConfig = supabaseUrl && supabaseAnonKey && (() => {
  try { new URL(supabaseUrl); return true; } catch { return false; }
})();

const options = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey, options)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key', options);
