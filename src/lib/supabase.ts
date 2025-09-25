
import { createBrowserClient } from '@supabase/ssr'
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabaseError: string | null = null;
let supabaseAdmin: SupabaseClient | null = null;
let browserClient: SupabaseClient | null = null;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    supabaseError = "Missing Supabase URL or Anon Key. The application will not function correctly without them."
}

if (supabaseServiceKey) {
    supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

function createSupabaseBrowserClient() {
    if (browserClient) {
        return browserClient;
    }
    
    if (!supabaseUrl || !supabaseAnonKey) {
        supabaseError = "Missing Supabase URL or Anon Key for browser client.";
        return null;
    }

    browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
    return browserClient;
}

const supabase = createSupabaseBrowserClient();

export { supabase, supabaseError, supabaseAdmin, createSupabaseBrowserClient };
