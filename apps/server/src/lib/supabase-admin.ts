import { createClient } from '@supabase/supabase-js'

let admin: ReturnType<typeof createClient> | undefined

/** Service-role client — bypasses RLS. Use only in trusted server code. */
export function getSupabaseAdmin() {
  if (admin) return admin

  const url = process.env.SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for admin access')
  }

  admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return admin
}
