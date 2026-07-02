import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_REF')) {
  console.warn(
    'Supabase URL is not configured. Please update VITE_SUPABASE_URL in your .env.local file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://emwbfypvdhasamkpebca.supabase.co',
  supabaseKey || 'sb_publishable_tB-r6XbN8DpU6tQOZKLZcw_An7YJKD_'
);
