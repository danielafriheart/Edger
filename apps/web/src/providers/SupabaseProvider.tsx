import { useAuth } from '@clerk/react'
import { type ReactNode, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { SupabaseContext } from '../contexts/supabase-context'

/** Supabase dashboard (new UI): “Publishable” / “default” public key. Legacy env: `VITE_SUPABASE_ANON_KEY`. */
function getSupabasePublishableKey(): string {
  return (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
    ?? import.meta.env.VITE_SUPABASE_ANON_KEY
    ?? ''
  )
}

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const { getToken } = useAuth()

  const client = useMemo(() => {
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
      },
      global: {
        fetch: async (input, options) => {
          const token = await getToken()
          const headers = new Headers(options?.headers)
          if (token) {
            headers.set('Authorization', `Bearer ${token}`)
          }
          return fetch(input, { ...options, headers })
        },
      },
    })
  }, [getToken])

  return (
    <SupabaseContext.Provider value={client}>{children}</SupabaseContext.Provider>
  )
}
