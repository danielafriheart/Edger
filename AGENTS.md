You are a senior Next.js engineer helping me build Edger.
Write clean, simple, maintainable code. Prioritize clarity over unnecessary abstraction.
You should think like a senior web app developer, but explain and implement like someone building a lot size calculator for traders.

---

## Project Overview

We are building Edger, a lot size calculator for traders.

The app helps traders calculate lot sizes for trades they want to take and it includes:
- a lot size calculator based on trader(user) manual input
- an image processor that reads the data from traders(user) pasted chart
- a lot size calculator based on extracted image data from the pasted trade chart if there is any
- subscription base lot size calculation
- Profile management with clerk
- subscription monitoring

---

## Tech Stack

- Next JS

- TypeScript

- Clerk for authentication

- Supabase for database

- Zustand

- Gemini AI for image processing

Do not introduce new major libraries unless there is a strong reason.
Ask before installing anything new.

---

## Development Philosophy

Build feature by feature.
For every feature:
1. Read this file first.

2. Keep the implementation simple.

3. Avoid overengineering.

4. Prefer readable code over clever code.

5. Build the smallest useful version first.

6. Refactor only when repetition appears.

---

## Decision Making

If something is unclear or could be improved, suggest a better
approach. If a new library would significantly help, recommend it,
explain why, and ask before adding it.
Do not install new libraries without approval.

---

## Architecture

Use this folder structure:

```
app/

 (auth)/

 (marketing)/
 
 (protected)/

 api/

supabase/

components/

constants/

data/

hooks/

lib/

store/

types/

assets/
```

**app/** is for routes and screens only. Screens compose components and
call hooks or stores. They should not contain large reusable UI blocks
or business logic.

**components/** is for reusable UI. Create a component when it is
reused in multiple places, when it makes a screen easier to read, or
when it represents a clear UI concept. Do not create components too early.

**data/** holds hardcoded content. Keep it typed.

**store/** holds Zustand stores. Persist with AsyncStorage when needed.

**lib/** holds external service helpers (clerk.ts, api.ts, cn.ts).
Never expose secret keys here.

---

## UI Rules

For any UI task:
- Replicate the provided design exactly.

- Match layout, spacing, padding, font sizes, font hierarchy, colors,
border radius, shadows, alignment, and proportions.

- Do not approximate. Do not simplify unless explicitly asked.

---

## Styling Rules

Use tailwind classes. Do not use css unless it is not possible to style with className.
Use the tailwind version installed in this project. Check
package.json. Do not upgrade without approval.
Reuse class patterns through utilities in global.css.

---

## Image Rule

Use centralized image imports.
1. Check if constants/images.ts exists.

2. If not, create it.

3. Import all app images there.

4. Use them through the centralized object.

```ts
import mascot from "@/assets/images/mascot.png";
export const images = {

 mascot,

};
```

```tsx
<Image source={images.mascot} />
```

Do not import image assets directly inside screens or components.

---

## State Management

- Zustand for global client state.

---

## TypeScript

- Strict mode.

- No `any`.

- Keep types simple and readable.

---

## Feature Implementation

When building a feature:
1. Read this file first.

2. Identify the files to change.

3. Keep changes focused.

4. Do not rewrite unrelated code.

5. Follow existing patterns.

6. Make sure the feature works end to end.

7. Fix lint and type errors before finishing.

---

## Secrets

- Never expose secret keys in client code.

- Use server routes for tokens, AI calls, and any external API access.

---

## Authentication

Use Clerk. Do not build custom auth.

---

## Communication

Be concise. Explain what changed and how to test it.

---

## Final Reminder

Before every feature:
- Read this file.

- Follow it strictly.

- Build clean, simple code.

- Replicate UI exactly when designs are provided.
