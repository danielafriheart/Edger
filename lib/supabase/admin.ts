import 'server-only';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let admin: SupabaseClient | undefined;

/**
 * Service-role Supabase client — bypasses RLS. Use only in trusted server code
 * (webhooks, cron, privileged jobs). Never import from a Client Component.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set for admin access',
    );
  }

  admin = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return admin;
}
