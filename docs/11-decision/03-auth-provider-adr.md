# ADR-0030 — Enterprise Authentication Provider Foundation

**Status:** Accepted
**Date:** 2026-07-31
**Deciders:** Chief Software Architect
**Sprint:** 2D.3.1

---

## Context

STMS requires a centralized authentication layer that:

- Supports multiple auth providers without code changes.
- Treats **Supabase Auth** as only one possible implementation.
- Keeps the business layer (sessions, RBAC, login flows) decoupled from any
  specific vendor.
- Must be verifiable at runtime via a health check.

The application currently authenticates through Auth.js v5 (NextAuth) in
`src/lib/auth/auth.ts` (credentials provider + Prisma adapter) with business
user records in the application database. Sprint 2D.3.1 does **not** replace
that live flow; it introduces an enterprise-grade, provider-agnostic
foundation in a new infrastructure layer (`src/providers/auth/`) that future
sprints can adopt. Only Supabase is implemented; Auth.js, Clerk, and Keycloak
are named as future providers.

The RBAC model is defined in `src/constants/permissions.ts` (roles, actions,
resources) and is the source of truth for role/permission checks. This layer
reads that map; it never modifies it.

---

## Decision

Create `src/providers/auth/` as the Infrastructure authentication layer with:

### 1. `AuthProvider` interface (`types.ts`)

A single contract every provider must implement:

```ts
signIn(credentials: AuthCredentials): Promise<AuthSession>
signOut(): Promise<void>
getSession(): Promise<AuthSession | null>
getUser(): Promise<AuthUser | null>
refreshSession(): Promise<AuthSession | null>
verifySession(): Promise<boolean>
hasRole(role: string): Promise<boolean>
hasPermission(permission: string): Promise<boolean>
```

Supporting types: `AuthCredentials`, `AuthUser`, `AuthSession`, `AuthRoleResolution`,
`AuthRoleResolver`, `AuthSessionStore`.

### 2. Implementations

| Provider | File | Notes |
|----------|------|-------|
| `supabase` | `supabase.provider.ts` | `@supabase/supabase-js` with anon key; email/password, JWT session, refresh token |

`supabase.provider.ts` maps Supabase `Session`/`User` into the provider-neutral
`AuthSession`/`AuthUser` shapes. Role and permission resolution is pluggable
via `roleResolver`; by default it derives the role from Supabase
`user_metadata`/`app_metadata` and maps the role slug through
`ROLE_PERMISSIONS` (`src/constants/permissions.ts`) using the same
`resource:action` matching semantics as `auth.service.hasPermission`.

### 3. Factory (`factory.ts`)

Provider selection is driven by environment:

```
AUTH_PROVIDER=supabase     # default
# future: authjs, clerk, keycloak
```

### 4. Health Service (`health.ts`)

`runAuthHealthCheck(provider?, options?)` verifies:

1. Provider loaded
2. Auth API connection (reachable, HTTP 200)
3. Sign-in API responds (invalid credentials rejected as expected)
4. Session retrieval (real sign-in + session read; needs credentials)
5. Token refresh (refreshed access token; needs credentials)

Checks 4 and 5 are skipped with a clear message when no credentials are passed.

---

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                  Business / Application Layer                │
│   (Login flows, RBAC guards, session UI — future sprints)    │
└──────────────────────────┬───────────────────────────────────┘
                           │  AuthProvider interface
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                 AuthFactory  (src/providers/auth/)           │
│            selects provider from AUTH_PROVIDER env           │
└──────────────┬──────────────────────────┬────────────────────┘
               │                          │
               │ (only implemented)       │ (planned)
      ┌────────▼────────┐        ┌────────▼─────────────┐
      │ SupabaseAuth    │        │ authjs / clerk /     │
      │ Provider        │        │ keycloak providers   │
      │ (supabase-js,   │        └──────────────────────┘
      │  anon key)      │
      └────────┬────────┘
               ▼
        Supabase Auth API
               │
        auth.users (Supabase)
               │
      PostgreSQL (app data)

   RBAC source of truth: src/constants/permissions.ts (ROLE_PERMISSIONS)
   Role/permission resolution: AuthRoleResolver or role metadata + ROLE_PERMISSIONS

                        ┌────────────────────────────┐
                        │   Auth Health Service      │
                        │  (runAuthHealthCheck)      │
                        └────────────────────────────┘
```

**Layer rules (AGENTS.md):** UI → Service → Repository → Database.
Auth is accessed through this provider layer only — React components never
talk to Supabase directly. Business rules, repositories, validation,
permissions, audit, and the existing Auth.js v5 flow are untouched.

---

## Consequences

**Positive**
- Vendor-agnostic: Supabase today; Auth.js, Clerk, Keycloak as drop-in
  implementations behind one interface.
- Sessions are provider-neutral; a pluggable `AuthSessionStore` lets the
  future cookie/session adapter persist them without touching the provider.
- RBAC stays consistent with the existing `ROLE_PERMISSIONS` map.
- Runtime verifiability via health check.
- No business-layer, repository, permission, audit, or UI changes.

**Negative / Trade-offs**
- Only Supabase is implemented in this sprint; `authjs`/`clerk`/`keycloak`
  names are registered in the factory but throw "not implemented yet".
- Supabase Auth users (`auth.users`) are a separate identity store from the
  application `users` table; reconciling them is future work.
- `hasRole`/`hasPermission` return `false` when no session exists or no role
  can be resolved — callers must treat that as "not authorized".
- `@supabase/supabase-js` adds a dependency to the infrastructure layer.

---

## Alternatives Considered

| Alternative | Decision |
|-------------|----------|
| Keep only Auth.js v5 (NextAuth) | Rejected — single-vendor coupling violates "auth provider must be replaceable" |
| Clerk or Keycloak first | Rejected — project already runs on Supabase; keep Supabase as the primary identity backend |
| Hard-coded role checks in UI | Rejected — violates layer architecture and central RBAC rules |
| No interface, direct supabase-js everywhere | Rejected — violates replaceability rule |

---

## Verification

- `npx tsc --noEmit` — clean
- `npx eslint src/providers/auth` — 0 errors
- `npm run build` — 0 errors
- Auth health check (`AUTH_PROVIDER=supabase`) — 5/5 pass (provider loaded,
  connection, sign-in API, session retrieval, token refresh)
- RBAC checks on a temporary auth user (role `admin`) — `hasRole("admin")` ✓,
  `hasRole("super-admin")` ✗, `hasPermission("media:create")` ✓,
  `hasPermission("dashboard:read")` ✓, `hasPermission("media:all")` ✗
