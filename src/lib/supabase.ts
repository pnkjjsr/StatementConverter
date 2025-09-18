
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL') {
  throw new Error("Missing or placeholder NEXT_PUBLIC_SUPABASE_URL. Please update your .env file with your Supabase project's URL.");
}
if (!supabaseAnonKey || supabaseAnonKey === 'YOUR_SAPABASE_ANON_KEY') {
  throw new Error("Missing or placeholder NEXT_PUBLIC_SUPABASE_ANON_KEY. Please update your .env file with your Supabase project's anon key.");
}

try {
  new URL(supabaseUrl);
} catch (error) {
    throw new Error(`Invalid Supabase URL format: ${supabaseUrl}. Please ensure it is a valid HTTP/HTTPS URL from your Supabase project settings.`);
}


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
