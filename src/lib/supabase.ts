import { createClient } from "@supabase/supabase-js";

const supabaseUrl = `https://${process.env.SUPABASE_PROJECT_ID || process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey!);
