# Agents

## Monorepo layout

- **Web:** `apps/web` (Vite + Clerk + Supabase via `VITE_SUPABASE_PUBLISHABLE_KEY`; Clerk session JWT on PostgREST requests).
- **API:** `apps/server` (Hono; verify Clerk JWTs; `src/lib/supabase-admin.ts` for service-role access only on the server).

## Security reviews

Security guidance for AI-assisted coding lives in the **vibe-security** project skill:

- [`./.cursor/skills/vibe-security/SKILL.md`](./.cursor/skills/vibe-security/SKILL.md)
- Supporting references: [`.cursor/skills/vibe-security/references/`](./.cursor/skills/vibe-security/references/)

Use that skill whenever changing auth (Clerk), Supabase schemas or RLS, API routes, environment variables, or anything handling user data.
