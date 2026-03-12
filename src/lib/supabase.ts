import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  console.error('❌ Missing Supabase environment variables:', missingVars.join(', '));
  console.error('Please check your .env file and ensure all required variables are set.');
  throw new Error(`Missing Supabase environment variables: ${missingVars.join(', ')}`);
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (urlError) {
  console.error('❌ Invalid Supabase URL format:', supabaseUrl);
  throw new Error(`Invalid Supabase URL format. Please check VITE_SUPABASE_URL in your .env file.`);
}

console.log('✅ Supabase client initialized');
console.log('📍 Supabase URL:', supabaseUrl.substring(0, 30) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});
