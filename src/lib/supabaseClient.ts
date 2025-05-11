import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase URL or Anon Key is missing. Make sure they are set in your .env file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
