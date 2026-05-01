/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLERK_PUBLISHABLE_KEY: string
  readonly VITE_SUPABASE_URL: string
  /** Public publishable key (Supabase Dashboard → Settings → API). Safe in the browser; RLS still applies. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string
  /** Deprecated env name — same value as publishable key if your team still uses the old label “anon”. */
  readonly VITE_SUPABASE_ANON_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
