import { createClient } from "@supabase/supabase-js";

// Use NEXT_PUBLIC_ prefix for client-side access in Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID || process.env.SUPABASE_PROJECT_ID}.supabase.co`;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error("Missing Supabase credentials. Ensure NEXT_PUBLIC_SUPABASE_PROJECT_ID and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.");
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "missing-key");
