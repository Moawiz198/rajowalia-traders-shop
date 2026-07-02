import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || supabaseUrl.includes('YOUR_PROJECT_REF')) {
  console.warn(
    'Supabase URL is not configured. Please update VITE_SUPABASE_URL in your .env.local file.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://okzmytwwhuwaqnkwujbs.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0ZWFxampyZ3pucHl0ZXFhY3NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxNDQyNDAsImV4cCI6MjA4MDcyMDI0MH0.Xq-W_0-Yl05x81_W648_xM7G16n8y61Xy7YcQ1g1U7Q'
);
