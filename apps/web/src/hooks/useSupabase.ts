import { useContext } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { SupabaseContext } from '../contexts/supabase-context'

export function useSupabase(): SupabaseClient {
  const client = useContext(SupabaseContext)
  if (!client) {
    throw new Error(
      'useSupabase must be used within SupabaseProvider (inside ClerkProvider)',
    )
  }
  return client
}
