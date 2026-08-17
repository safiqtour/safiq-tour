# Authentication Integration Refactor Report

- **Date:** 2026-07-31
- **Status:** DONE — typecheck, lint, and production build all pass
- **Scope:** Authentication integration layer (session management)

## Goal
Ensure a **single source of truth** for the session, simplify the auth
integration, and remove duplicated session logic — while preserving Supabase
Auth and RBAC (users, roles, permissions).

## What Was Duplicated (Before)
1. **Two sources of truth for the session:**
   - `SupabaseAuthProvider` kept its own `currentSession` cache + `sessionStore`.
   - `auth.integration.service.ts` re-created a provider *per call*, seeding a
     throwaway `sessionStore` from the cookie.
   - The provider's internal cache was therefore dead weight — the signed
     cookie (`stms.session-token`) was already the real source of truth.
2. **`auth.middleware.ts`** was a redundant hop that (a) re-exported cookie
   helpers and (b) rebuilt a provider just to call `verifySession`.
3. **`middleware.ts`** imported cookie helpers via `auth.middleware.ts` instead
   of from the cookie module directly.
4. **Cookie config** (name + options + max-age) was split across
   `session-token.ts` and `auth.integration.service.ts`.

## New Architecture
```
UI / Server Action / API Route / Edge Middleware
        │
        ▼
auth.integration.service.ts   ← single session source of truth (cookie)
        │
        ▼
SupabaseAuthProvider          ← stateless; session passed in explicitly
        │
        ▼
Supabase Auth API
```
- The **signed HTTP cookie** is the only persisted session state.
- `auth.integration.service.ts` is the **only** module that reads/writes the
  cookie (via `AuthCookieTransport`).
- `SupabaseAuthProvider` is **stateless**: every method receives the session
  (or user) it needs. No internal cache, no session store.

## File Changes
| File | Change |
|------|--------|
| `src/lib/auth/session-token.ts` | Centralized `SESSION_COOKIE`, `SESSION_COOKIE_MAX_AGE`, `SESSION_COOKIE_OPTIONS` (single cookie config source). |
| `src/providers/auth/types.ts` | Removed `AuthSessionStore` / `AuthRoleResolver` / `AuthRoleResolution`. `AuthProvider` methods now take `session`/`user` params. |
| `src/providers/auth/supabase.provider.ts` | Stateless rewrite — removed `currentSession`, `sessionStore`, `loadSession`, `persistSession`, `roleResolver`. `hasRole`/`hasPermission` now take the user. |
| `src/providers/auth/factory.ts` | Removed `sessionStore` option plumbing. |
| `src/services/auth.integration.service.ts` | Single source of truth: lazy singleton provider + cookie read/write; `verifySession` now lives here. |
| `src/services/auth.middleware.ts` | **Deleted** (logic moved into `auth.integration.service.ts`). |
| `src/middleware.ts` | Imports cookie helpers directly from `@/lib/auth/session-token`. |
| `src/providers/auth/health.ts` | Updated to pass the session explicitly to provider methods. |
| `src/providers/auth/resolvers/user.resolver.ts` | Removed leftover debug `console.log` noise (supabase/db user dumps). |

## Behavior Preserved
- **Login:** `signIn` → provider signs in → app user resolved (RBAC role +
  permissions from app DB) → cookie written.
- **Session persistence across refresh:** `getSession` reads cookie, refreshes
  the token via `refreshSession` when expired, and rewrites the cookie with the
  new tokens + refreshed app role claim.
- **Middleware:** only validates the signed cookie (`decodeSessionCookie`) and
  the role claim; does not hold or guess session state.
- **Logout:** `signOut` calls provider `signOut` (best-effort) and always
  deletes the cookie.
- **RBAC:** unchanged (`users`, `roles`, `permissions`, resolvers untouched).
- **Business layer / repository layer:** unchanged.

## Verification
| Check | Result |
|-------|--------|
| `npx tsc --noEmit --incremental false` | PASS (exit 0, no errors) |
| `npx eslint src` | PASS (0 errors; only pre-existing warnings) |
| `npm run build` | PASS (compiled successfully) |

## Vercel Compatibility
- No new runtime dependencies; no env var changes.
- `postinstall: prisma generate` (from the earlier Prisma fix) remains in
  `package.json`.
- The provider is constructed lazily (singleton), so build-time page collection
  has no side effects.
