# Agents

## Layout

Single Next.js 16 app at the repo root (App Router, Tailwind v4):

- `app/` — routes (`(marketing)`, `(auth)`, `(protected)`), `layout.tsx`, `globals.css`, `styles/`, `api/` route handlers, server actions live next to the feature they back.
- `src/components/<feature>/` — presentational pieces.
- `src/features/<feature>/` — orchestrators, hooks, server actions.
- `src/lib/` — cross-feature utilities (`calc.ts`, `supabase/{client,server,admin}.ts`, …).
- `src/constants/`, `src/hooks/`, `src/types/`.
- `proxy.ts` — Clerk middleware (Next 16 renamed `middleware.ts` → `proxy.ts`).

There is no `apps/` directory and no Hono server. All server work is done from Server Components, Server Actions, and `app/api/*` route handlers.

## Auth + Supabase

- **Clerk:** `@clerk/nextjs`. `proxy.ts` redirects unauthenticated users away from `/app` and `/profile`. `/login` and `/signup` stay reachable when signed in so the UI can show “Already signed in” and sign out.
- **Supabase clients (`src/lib/supabase/`):**
  - `client.ts` — browser client with a custom `fetch` that injects the Clerk Supabase template JWT (`useAuth().getToken({ template: 'supabase' })`). Used in Client Components.
  - `server.ts` — per-request server client; reads `auth().getToken({ template: 'supabase' })` from `@clerk/nextjs/server` and attaches it. Used in Server Components, Server Actions, and route handlers.
  - `admin.ts` — service-role; tagged `import 'server-only'`. For webhooks/cron only, never imported from a Client Component.

The Clerk ↔ Supabase third-party auth + `supabase` JWT template must be configured in both dashboards. Without it, server-side Supabase calls return 401s on RLS reads.

## Modularity

Hard cap: every `.ts`, `.tsx`, and `.css` file under **300 lines**. See [`.cursor/rules/modular-files.mdc`](./.cursor/rules/modular-files.mdc) for splitting guidance.

## Security reviews

Security guidance for AI-assisted coding lives in the **vibe-security** project skill:

- [`./.cursor/skills/vibe-security/SKILL.md`](./.cursor/skills/vibe-security/SKILL.md)
- Supporting references: [`.cursor/skills/vibe-security/references/`](./.cursor/skills/vibe-security/references/)

Use it whenever changing auth (Clerk), Supabase schemas or RLS, route handlers / server actions, environment variables, or anything handling user data.

## Next 16 caveats

- The middleware file is `proxy.ts`, not `middleware.ts`. Same API surface (`clerkMiddleware`, `createRouteMatcher`, `NextResponse`).
- Read the relevant page in `node_modules/next/dist/docs/` before touching anything proxy-, route-, or caching-related — Next 16 ships breaking changes from 15.
- `@clerk/react` (Vite) and `@clerk/nextjs` have different surfaces. Use `@clerk/nextjs` everywhere; the OTP flow already does.
