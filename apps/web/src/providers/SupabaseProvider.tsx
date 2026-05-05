import { useAuth } from '@clerk/react'
import { type ReactNode, useLayoutEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SupabaseContext } from '../contexts/supabase-context'

type GetToken = ReturnType<typeof useAuth>['getToken']

/**
 * Latest Clerk `getToken` for the browser Supabase client’s custom `fetch`.
 * Updated in `useLayoutEffect` only (no render side effects), so the client can stay a singleton.
 */
const clerkGetTokenSink: { current: GetToken | undefined } = { current: undefined }

/** Supabase dashboard (new UI): “Publishable” / “default” public key. Legacy env: `VITE_SUPABASE_ANON_KEY`. */
function getSupabasePublishableKey(): string {
  return (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ?? import.meta.env.VITE_SUPABASE_ANON_KEY
    ?? ''
  )
}

/** Name of Clerk JWT template that matches Supabase third-party JWT. Never send the default Clerk session JWT in `Authorization` — PostgREST rejects it with PGRST301 / wrong key type with publishable keys. */
function clerkSupabaseJwtTemplate(): string | null {
  const raw = import.meta.env.VITE_CLERK_SUPABASE_JWT_TEMPLATE
  if (typeof raw === 'string') {
    const t = raw.trim()
    if (t === '' || t === 'none' || t === 'false') {
      return null
    }
    return t
  }
  return 'supabase'
}

async function bearerForSupabase(getToken: GetToken | undefined) {
  const template = clerkSupabaseJwtTemplate()
  if (!template || !getToken) {
    return null
  }
  try {
    return await getToken({ template })
  } catch {
    return null
  }
}

/** One browser client; custom `fetch` reads `getToken` from `clerkGetTokenSink`. */
function createBrowserSupabaseClient() {
  const url = import.meta.env.VITE_SUPABASE_URL ?? ''
  const publishableKey = getSupabasePublishableKey()
  if (!url || !publishableKey) {
    console.warn(
      '[@edger/web] Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (Supabase → Settings → API → publishable key).',
    )
  }

  return createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: async (input, options) => {
        const headers = new Headers(options?.headers)
        const token = await bearerForSupabase(clerkGetTokenSink.current)
        if (token) {
          headers.set('Authorization', `Bearer ${token}`)
        }
        return fetch(input, { ...options, headers })
      },
    },
  })
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  useLayoutEffect(() => {
    clerkGetTokenSink.current = getToken
    return () => {
      clerkGetTokenSink.current = undefined
    }
  }, [getToken])

  const client = useMemo(() => createBrowserSupabaseClient(), [])

  return (
    <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>
  )
}
