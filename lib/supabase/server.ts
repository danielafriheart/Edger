import 'server-only';

import { auth } from '@clerk/nextjs/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function publishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''
  );
}

function supabaseUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
}

function jwtTemplate(): string | null {
  const raw = process.env.NEXT_PUBLIC_CLERK_SUPABASE_JWT_TEMPLATE;
  if (typeof raw === 'string') {
    const t = raw.trim();
    if (t === '' || t === 'none' || t === 'false') return null;
    return t;
  }
  return 'supabase';
}

/**
 * Per-request Supabase client for Server Components / Server Actions / route handlers.
 * Attaches the Clerk-issued Supabase JWT so PostgREST evaluates RLS as the signed-in user.
 * Falls back to anon (publishable key only) when there is no session — keep RLS strict.
 */
export async function getSupabaseServerClient(): Promise<SupabaseClient> {
  const url = supabaseUrl();
  const key = publishableKey();
  const template = jwtTemplate();

  let token: string | null = null;
  if (template) {
    try {
      const { getToken } = await auth();
      token = await getToken({ template });
    } catch {
      token = null;
    }
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, options) => {
        const headers = new Headers(options?.headers);
        if (token) headers.set('Authorization', `Bearer ${token}`);
        return fetch(input, { ...options, headers });
      },
    },
  });
}
