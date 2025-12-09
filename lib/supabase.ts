import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

let supabase: SupabaseClient | null = null
let supabaseAdmin: SupabaseClient | null = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('Supabase credentials not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Create admin client with service role key (bypasses RLS) - only for server-side use
if (supabaseUrl && supabaseServiceRoleKey) {
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Get Supabase client (throws error if not configured)
export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  }
  return supabase
}

// Get Supabase admin client (for server-side operations that need to bypass RLS)
export function getSupabaseAdminClient(): SupabaseClient {
  if (!supabaseAdmin) {
    // Fallback to regular client if service role key not set
    if (supabase) {
      console.warn('Service role key not set, falling back to anon key. Some operations may fail due to RLS.')
      return supabase
    }
    throw new Error('Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.')
  }
  return supabaseAdmin
}
