import { createClient } from '@supabase/supabase-js';

const fallbackUrl = 'https://emwbfypvdhasamkpebca.supabase.co';
const fallbackKey = 'sb_publishable_tB-r6XbN8DpU6tQOZKLZcw_An7YJKD_';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || fallbackUrl;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || fallbackKey;

if (supabaseUrl === 'https://emwbfypvdhasamkpebca.supabase.co' && !import.meta.env.VITE_SUPABASE_URL) {
  console.log('Connecting to database using storefront fallback credentials.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
