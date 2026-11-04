import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

if (!url || !key) {
  throw new Error('Missing Supabase settings. Copy .env.example to .env.local and fill it in.')
}

// The publishable key is safe in the browser: row level security protects the data.
export const supabase = createClient(url, key)
