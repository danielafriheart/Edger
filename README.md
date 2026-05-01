# Edger

Monorepo (npm workspaces): **frontend** [`apps/web`](apps/web) (React, Vite, TanStack Router, Clerk + Supabase JS) and **API** [`apps/server`](apps/server) (Hono, Clerk JWT verification, optional Supabase service-role admin helper).

### Commands

- `npm install` — install hoisted deps at the repo root
- `npm run dev` — run Vite and the API together (the Vite dev server proxies `/api` to the API port)
- `npm run dev:web` / `npm run dev:server` — one workspace only

### Environment

Copy the examples and fill in locally (do not commit real secrets):

- [`apps/web/.env.example`](apps/web/.env.example) — `VITE_*` Clerk publishable key and Supabase URL + **`VITE_SUPABASE_PUBLISHABLE_KEY`** (Data API publishable key in the dashboard)
- [`apps/server/.env.example`](apps/server/.env.example) — Clerk **secret**, Supabase URL + **service role** for trusted server-side use, `WEB_ORIGIN`

For Clerk JWTs + Supabase Row Level Security together, configure [Clerk ↔ Supabase](https://dashboard.clerk.com/setup/supabase) and add Clerk as third-party auth in the [Supabase project](https://supabase.com/docs/guides/auth/third-party/clerk).

For `/login`, use **passwordless email code** with [**sign-up-if-missing**](https://clerk.com/docs/guides/development/custom-flows/authentication/sign-in-or-up#sign-in-or-up-with-sign-upifmissing): disable **password** for sign-in, enable **sign-in + sign-up with email** using **verification code**. The route uses a **custom Edger UI** wired to Clerk’s `useSignIn` / `useSignUp` hooks (not `<SignIn />`). Include `<div id="clerk-captcha" />` on the email step while bot protection is on.

The `/waitlist` page inserts into **`public.wishlist`**. Run [`supabase/migrations/20260201180000_create_wishlist.sql`](supabase/migrations/20260201180000_create_wishlist.sql) in the Supabase SQL Editor (or apply with the Supabase CLI).

---

## React + TypeScript + Vite (apps/web)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
