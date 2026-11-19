<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# WedPlan

Wedding-vendor marketplace frontend: Next.js 16.4.6 App Router + React 19 (React Compiler on) calling a **separate REST backend** at `NEXT_PUBLIC_API_URL` (default `http://localhost:5000`). better-auth + MongoDB own users/sessions; services, bookings, and admin stats come from the external API. Use **npm** (`package-lock.json` is the only lockfile); the boilerplate README's yarn/pnpm/bun commands are wrong.

## Commands

- `npm run dev` — dev server on :3000. `next dev` rewrites the Next.js block above; leave it in the tree.
- `npm run build` — production build, then TypeScript; currently fails (see below).
- `npm run lint` — `eslint`; 2 pre-existing errors, both `react-hooks/set-state-in-effect` in `src/components/ui/carousel.tsx` and `src/hooks/use-mobile.ts` (shadcn-generated). Don't attribute them to your change.
- `npx tsc --noEmit` — standalone typecheck; includes generated `.next/types` and `.next/dev/types`.
- No test runner, test script, CI workflow, pre-commit hook, or codegen exists. Don't invent `npm test`.

## Known broken state (check before "fixing" something else)

- `src/app/(dashboard)/vendor/update-service/[id]/page.tsx` is 0 bytes, so it is not a module (TS2306). This is what breaks `npm run build` / `tsc`; it needs a default-exported component.
- `src/app/(dashboard)/admin/manage-users/page.tsx` calls `auth.api.listUsers`, but `src/lib/auth.ts` imports `admin` from `better-auth/plugins` without adding it to `plugins`. That causes TS2339 (`listUsers` does not exist) and a runtime failure; add `admin()` to fix.
- Route groups do not affect URLs: real routes are `/`, `/browse-services`, `/featured-service`, `/admin`, `/vendor`, `/customer`, `/sign-in`, `/sign-up`.
- Dead links/routes: `/services` (canonical is `/browse-services`), `/signup`, `/profile`, `/forgot-password`. Stale redirects to `/dashboard` (`vendor/page.tsx`, `vendor/add-service`) and `/login` (`admin/page.tsx`) also point at nonexistent routes.
- No `middleware.ts`. `src/app/(dashboard)/layout.tsx` only checks for a session; per-page role guards are inconsistent (some server pages redirect, customer pages do not), so a signed-in user can open another role's URLs directly.
- Placeholder pages: admin `transactions`, vendor `subscription`, both `profile` pages, `featured-service`, and the empty `update-service`.
- `src/app/all-api/*` mixes external-API wrappers (`service.tsx`, `bookings.tsx`, `filter.tsx`) with `get-current-user.ts` (server-only better-auth helper). Some files use `.tsx` despite containing no JSX.

## Auth and environment

- better-auth + MongoDB: `src/lib/auth.ts` (database `wedplan`, module-scope `MongoClient`, server-only), `src/lib/auth-client.ts` (browser entrypoint), handler `src/app/api/auth/[...all]/route.ts`.
- Never import `@/lib/auth` from client code: it constructs a `MongoClient` at module scope. `auth-client.ts` imports it only for `inferAdditionalFields<typeof auth>`; keep that reference type-only.
- `.env` is gitignored and there is no example file. Keys: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL=http://localhost:3000`, `MONGODB_URL`, `NEXT_PUBLIC_API_URL=http://localhost:5000`, `NEXT_PUBLIC_IMGBB_API_KEY`.
- `auth-client.ts` passes `BETTER_AUTH_URL` to `createAuthClient`, but non-`NEXT_PUBLIC_` vars are undefined in the browser, so it relies on the same-origin fallback. Use a `NEXT_PUBLIC_` URL if auth needs to be cross-origin.
- `role` (`admin | vendor | customer`, default `customer`) is an additional user field with `input: true`, and sign-up sends the selected role. A client can therefore self-register as `admin`; treat role as user-controlled until this is tightened. `isBlocked`, `businessName`, `subscriptionPlan`, and `subscriptionExpiresAt` are `input: false`.
- Profile and service images upload directly from the browser to imgbb using `NEXT_PUBLIC_IMGBB_API_KEY`.

## UI and styling conventions

- `src/components/ui` is shadcn/ui **"base-nova"** style on `@base-ui/react` primitives, not Radix. Follow the existing `useRender`/`mergeProps` patterns when adding components; `components.json` is the source of truth.
- Components import `cn` directly from the `cn` package (`src/lib/utils.ts` only re-exports it). Don't introduce `clsx`/`tailwind-merge` wrappers.
- Tailwind v4 CSS-first: no `tailwind.config` and no PostCSS config. Add tokens in `src/app/globals.css`; `next.config.ts` wires the `@tailwindcss/turbopack` CSS loader and enables React Compiler.
- Site chrome lives in `src/app/shared` (`Navbar`, `Banner`, `Logo`), not `src/components`. Pages are hardcoded client components using the wine/gold/cream palette (`#4A1F2A`, `#722F3E`, `#C6A15B`, `#FAF5F0`) rather than the neutral shadcn theme variables.
- Only Geist/Geist Mono are loaded in `src/app/layout.tsx`, so `var(--font-playfair)` in `Logo`/`Banner` falls back to Georgia.
