'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useMemo, useRef } from 'react';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type GetToken = ReturnType<typeof useAuth>['getToken'];

function publishableKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    ''
  );
}

/**
 * Clerk JWT template name configured for Supabase third-party auth.
 * Send only this token as `Authorization` to PostgREST — never the default
 * Clerk session JWT (publishable keys reject it with PGRST301).
 */
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
 * Browser Supabase client with Clerk template JWT auto-attached. The fetch
 * closure reads the latest `getToken` via a ref that is updated in an effect,
 * so it always sees the current Clerk session.
 */
export function useSupabase(): SupabaseClient {
  const { getToken } = useAuth();
  const getTokenRef = useRef<GetToken | undefined>(getToken);

  useEffect(() => {
    getTokenRef.current = getToken;
  }, [getToken]);

  // eslint-disable-next-line react-hooks/refs -- ref is read inside fetch (event-time), not during render
  return useMemo(() => buildClient(getTokenRef), []);
}

function buildClient(getTokenRef: { current: GetToken | undefined }): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = publishableKey();
  if (!url || !key) {
    console.warn(
      '[edger] Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (Supabase → Settings → API → publishable key).',
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (input, options) => {
        const headers = new Headers(options?.headers);
        const template = jwtTemplate();
        const get = getTokenRef.current;
        if (template && get) {
          try {
            const token = await get({ template });
            if (token) headers.set('Authorization', `Bearer ${token}`);
          } catch {
            /* fall through with anon key */
          }
        }
        return fetch(input, { ...options, headers });
      },
    },
  });
}
