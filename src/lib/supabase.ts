
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null;
let supabaseError: string | null = null;
let supabaseAdmin: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseUrl === 'YOUR_SAPABASE_URL') { // Also checking for the typo from previous version
  supabaseError = "Missing Supabase URL. The application will not function correctly without it."
} else if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY' || supabaseAnonKey === 'YOUR_SAPABASE_ANON_KEY') {
    supabaseError = "Missing Supabase anon key. The application will not function correctly without it."
} else {
    try {
        new URL(supabaseUrl);
        supabase = createClient(supabaseUrl, supabaseAnonKey);
        if (supabaseServiceKey && supabaseServiceKey !== 'YOUR_SUPABASE_SERVICE_ROLE_KEY') {
            supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            });
        }
    } catch (error) {
        supabaseError = `Invalid Supabase URL format: ${supabaseUrl}. Please ensure it is a valid HTTP/HTTPS URL from your Supabase project settings.`
    }
}

export { supabase, supabaseError, supabaseAdmin };
