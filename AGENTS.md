<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# WedPlan

Next.js 16.4.6 App Router + React 19 scaffold for a wedding-vendor marketplace. Only the marketing home page and auth screens exist; dashboards are placeholders. Use **npm** (`package-lock.json` is the only lockfile), not the yarn/pnpm commands suggested by the boilerplate README.

## Commands

- `npm run dev` — dev server on :3000. `next dev` rewrites the Next.js block above; leave it in the tree.
- `npm run build` — production build **and** typecheck. Currently fails (see below).
- `npm run lint` — currently fails on pre-existing `react-hooks/set-state-in-effect` errors in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts` (shadcn-generated). Don't chase or attribute these to your change.
- `npx tsc --noEmit` — standalone typecheck; includes generated `.next/types` and `.next/dev/types`.
- No test runner, test script, CI workflow, pre-commit hook, or codegen exists. Don't invent `npm test`.

## Known broken state (check before "fixing" something else)

- `src/app/(dashboard)/{admin,customer,vendor}/page.tsx` are 0-byte files. They are not modules (TS2306), which is what breaks `npm run build` / `tsc`. Each needs a default-exported component.
- Route groups do not affect URLs: real routes are `/`, `/admin`, `/vendor`, `/customer`, `/sign-in`, `/sign-up`. Comments mentioning `/dashboard/admin` are stale.
- Dead links point at routes that don't exist: `/services`, `/signin`, `/signup`, `/forgot-password`. Canonical auth paths use hyphens; `Navbar.tsx` and `Banner.tsx` still use the old ones.
- `src/app/(auth)/sign-in/page.tsx` is UI-only — it `console.log`s instead of calling better-auth. Only sign-up calls the API.
- No `middleware.ts` or route protection: dashboard URLs are public and empty.

## Auth and environment

- better-auth + MongoDB. Server config `src/lib/auth.ts` (database `wedplan`, server-only), browser entrypoint `src/lib/auth-client.ts`, API handler `src/app/api/auth/[...all]/route.ts`. `src/type/types.ts` is empty.
- Never import `@/lib/auth` into a client component: it constructs a `MongoClient` at module scope. `auth-client.ts` currently imports it for types — keep such references type-only.
- `.env` is gitignored and there is no example file. It defines `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URL`, `NEXT_PUBLIC_IMGBB_API_KEY`.
- **`src/lib/auth.ts` reads `MONGODB_URI`, but `.env` only defines `MONGODB_URL`.** Auth receives `undefined` until the names are reconciled.
- `role` is an additional better-auth user field (`admin | vendor | customer`) with `input: false` and default `customer`. The sign-up role picker is not sent to the API and cannot set the role from the client under the current config.
- `auth-client.ts` hardcodes `baseURL: "http://localhost:3000"`; derive it from env before deploying elsewhere.
- Profile images upload directly from the browser to imgbb using `NEXT_PUBLIC_IMGBB_API_KEY`.

## UI and styling conventions

- `src/components/ui` is shadcn/ui **"base-nova"** style on `@base-ui/react` primitives, not Radix. Follow the existing `@base-ui/react` + `useRender`/`mergeProps` patterns when adding components; `components.json` is the source of truth.
- Components import `cn` directly from the `cn` package (`src/lib/utils.ts` only re-exports it). Don't introduce `clsx`/`tailwind-merge` wrappers.
- Tailwind v4 CSS-first: no `tailwind.config` and no PostCSS config. Add tokens in `src/app/globals.css`; the custom `@tailwindcss/turbopack` CSS loader is wired in `next.config.ts`.
- Site chrome lives in `src/app/shared` (`Navbar`, `Banner`, `Logo`), not `src/components`. Pages are hardcoded client components using the wine/gold/cream palette (`#4A1F2A`, `#722F3E`, `#C6A15B`, `#FAF5F0`) rather than the neutral shadcn theme variables.
- Serif headings reference `var(--font-playfair)`, but only Geist/Geist Mono are loaded in `src/app/layout.tsx`, so they currently fall back to Georgia.
