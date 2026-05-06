# Edger

Single Next.js 16 app (App Router, Tailwind v4, TypeScript) using Clerk for auth and Supabase as the database. The Vite SPA + Hono API monorepo has been collapsed into this one tree.

## Quick start

```bash
npm install
npm run dev          # next dev with Turbopack
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |

## Layout

```
app/
├── (marketing)/{page.tsx, pricing/, legal/, waitlist/}
├── (auth)/{login/, signup/}
├── (protected)/{app/, profile/}
├── api/                     # only when truly needed (e.g. Clerk webhooks, /api/me)
├── globals.css              # design tokens + @import "tailwindcss"
├── styles/{landing,animations,analyzer-*}.css
└── layout.tsx               # ClerkProvider + fonts
src/
├── components/<feature>/    # presentational pieces (one per file, ≤300 LOC)
├── features/<feature>/      # orchestrators, hooks, server actions
├── lib/                     # calc, vision, supabase clients, helpers
├── constants/, hooks/, types/
proxy.ts                     # clerkMiddleware (Next 16: middleware.ts → proxy.ts)
```

Hard cap: every `.ts`, `.tsx`, and `.css` file ≤ 300 lines. See [`.cursor/rules/modular-files.mdc`](.cursor/rules/modular-files.mdc) and [`AGENTS.md`](AGENTS.md).

## Environment

Copy [`.env.example`](.env.example) to `.env.local` and fill in:

- Clerk: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` (and `CLERK_WEBHOOK_SIGNING_SECRET` if using webhooks).
- Supabase: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only).

For Clerk JWTs + Supabase Row Level Security together, configure [Clerk ↔ Supabase third-party auth](https://supabase.com/docs/guides/auth/third-party/clerk) and add a `supabase` JWT template in the Clerk dashboard.

## Auth + Supabase architecture

- **Auth gating** is done at the request boundary by `proxy.ts`:
  - `/app(.*)`, `/profile(.*)` redirect to `/login` if signed-out.
  - `/login(.*)`, `/signup(.*)` redirect to `/app` if signed-in.
- **Supabase clients (`src/lib/supabase/`):**
  - `client.ts` — browser client; injects the Clerk Supabase JWT via a custom `fetch`.
  - `server.ts` — per-request server client used in Server Components / Server Actions / route handlers; reads the Clerk JWT via `auth().getToken({ template: 'supabase' })`.
  - `admin.ts` — service-role; tagged `import 'server-only'` for webhooks/cron only.
- The Waitlist insert at `/waitlist` is a Server Action (`src/features/waitlist/joinWaitlistAction.ts`) writing to `public.wishlist`. Run [`supabase/migrations/20260201180000_create_wishlist.sql`](supabase/migrations/20260201180000_create_wishlist.sql) and [`20260202103000_restrict_wishlist_insert_rls.sql`](supabase/migrations/20260202103000_restrict_wishlist_insert_rls.sql) in the Supabase SQL editor (or apply with the Supabase CLI).

## Auth UX

`/login` and `/signup` use Clerk's email-OTP custom flow (`useSignIn` / `useSignUp` from `@clerk/nextjs`) with sign-up-if-missing. Sign-up maps the full name to `username` (and splits first/last). Keep `<div id="clerk-captcha" />` on the email step while bot protection is on.

## Security

See [`.cursor/skills/vibe-security/SKILL.md`](.cursor/skills/vibe-security/SKILL.md). Use that skill whenever changing auth, Supabase schemas / RLS, route handlers / server actions, environment variables, or anything handling user data.
