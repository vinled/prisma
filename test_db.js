import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://placeholder';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'placeholder';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('properties').select('*').limit(1);
  console.log("properties columns:", data ? Object.keys(data[0] || {}) : error);
  const { data: pData, error: pErr } = await supabase.from('profiles').select('*').limit(1);
  console.log("profiles columns:", pData ? Object.keys(pData[0] || {}) : pErr);
}
check();
