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
- Placeholder pages: admin `transactions`, both `profile` pages, `featured-service`, and the empty `update-service`. Vendor `subscription` is now wired to Stripe Checkout (see below).
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

## Stripe premium subscription (frontend), 2026-11-20

All Stripe secrets stay on the backend. The frontend only requests a Checkout URL and redirects the browser to it.

Steps taken:

1. Inspected the existing `src/app/all-api/payment.tsx` draft (untracked at the time) and the other `src/app/all-api/*` wrappers. Rewrote `createCheckoutSession(vendorId)` with a typed `CheckoutSessionResponse`, `credentials: "include"`, backend error messages, and validation that `success` is true and `url` is an `https://` link. No Stripe.js / `loadStripe` is used; the redirect is plain `window.location.href`.
2. Read `src/lib/auth.ts`, `src/lib/auth-client.ts`, and `src/app/all-api/get-current-user.ts`. Confirmed the vendor id is `session.user.id` — the same value written to `services.vendorId` in `vendor/add-service/page.tsx`.
3. Updated `src/app/(dashboard)/vendor/subscription/page.tsx`:
   - `useSession()` now provides the vendor id and `subscriptionPlan` (falls back to `free`).
   - The Upgrade button calls `createCheckoutSession(vendorId)` and then `window.location.href = data.url`.
   - `isLoading` prevents repeated clicks and shows a spinner (`Redirecting to Stripe...`); errors are logged, surfaced with a `sonner` toast, and re-enable the button.
   - While the session loads, a loader is shown. Existing markup/colors/copy are preserved. When the plan is already premium, the Free card shows a disabled "Included in Premium" button instead of a misleading upgrade action.
4. Added `src/app/(dashboard)/vendor/subscription/success/page.tsx`: read-only status page ("Payment received / verifying" or "Premium is active" based on the session plan), a note that Stripe's verified webhook performs activation, and links back. It does not call a verification API because none exists.
5. Added `src/app/(dashboard)/vendor/subscription/cancel/page.tsx`: static cancelled message ("You have not been charged") with a button back to `/vendor/subscription`.
6. Added no secret keys, webhook secrets, or premium-activation logic to the client. `@stripe/stripe-js` was already a dependency but remains unused.
7. Verified with `npx tsc --noEmit` (only the pre-existing `update-service/[id]` TS2306 plus generated `.next` validator errors) and `npx eslint` on the four changed files (clean).

Real URLs (route groups do not affect URLs): `/vendor/subscription`, `/vendor/subscription/success`, `/vendor/subscription/cancel`.

## Missing backend APIs / follow-up work

- `POST ${NEXT_PUBLIC_API_URL}/create-checkout-session` must exist and return `{ success: true, url }`. It lives in the separate backend, not this repo. It should set `success_url` to `/vendor/subscription/success?session_id={CHECKOUT_SESSION_ID}` and `cancel_url` to `/vendor/subscription/cancel`.
- A Stripe webhook (`checkout.session.completed`, signature verified server-side) is required to set `subscriptionPlan` / `subscriptionExpiresAt`. Nothing in this repo can or should activate Premium.
- No checkout-verification endpoint exists. The success page intentionally does not poll one. If added later (e.g. `POST /verify-checkout-session`), it can use the `session_id` query param.
- The checkout request sends only `{ vendorId }` with no JWT. Until authentication is wired up and the backend derives the vendor from the token — rather than trusting the body — this is not production-secure. The backend should also confirm the caller is a vendor and not already premium.
