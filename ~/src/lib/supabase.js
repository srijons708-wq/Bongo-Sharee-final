import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// `isSupabaseConfigured` lets every data-access module in `lib/api.js` fall
// back to the local demo dataset when no project has been connected yet —
// this is what lets the storefront run immediately after `npm install`,
// before anyone has created a Supabase project.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

if (!isSupabaseConfigured && import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '[Bongo Sharee] No Supabase credentials found in .env — running on local demo data. ' +
      'Copy .env.example to .env and add your project URL/anon key to go live.'
  );
}
