# Authentication Provider — Configuration Guide

**Sprint:** 2D.3.1 · **Layer:** Infrastructure (`src/providers/auth/`)

---

## 1. Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `AUTH_PROVIDER` | No | `supabase` | `supabase` (future: `authjs`, `clerk`, `keycloak`) |
| `NEXT_PUBLIC_SUPABASE_URL` | If `supabase` | — | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | If `supabase` | — | Supabase anon key (sign-in, session) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin only | — | Service role key (provisioning, health-check user management) |

```bash
# Development / Production (Supabase)
AUTH_PROVIDER="supabase"
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

> The provider uses the **anon key** for all auth operations. The service role
> key is only used by provisioning/health tooling, never by application code.

---

## 2. Provider Selection

The `AuthFactory` reads `AUTH_PROVIDER`:

```ts
import { createAuthProvider } from "@/providers/auth"

const auth = createAuthProvider() // uses AUTH_PROVIDER env
const auth = createAuthProvider({ provider: "supabase" }) // explicit
```

---

## 3. Supabase Provider

- Uses `@supabase/supabase-js` with the **anon key** and
  `persistSession: false`.
- `signIn` uses `signInWithPassword` (email + password).
- Session/refresh tokens are held by the provider instance; an optional
  `AuthSessionStore` can persist them (e.g. future cookie adapter).
- Roles/permissions: resolved from `user_metadata.role` /
  `user_metadata.roles` (or `app_metadata`) and mapped through
  `ROLE_PERMISSIONS` in `src/constants/permissions.ts`.

```ts
import { createSupabaseAuthProvider } from "@/providers/auth"

const auth = createSupabaseAuthProvider({
  roleResolver: async (user) => ({
    role: user.role,
    permissions: ["media:read", "media:create"],
  }),
})
```

---

## 4. Health Check

```ts
import { runAuthHealthCheck, auth } from "@/providers/auth"

// Basic (provider, connection, sign-in API reachable)
const basic = await runAuthHealthCheck(auth)

// Full (adds session retrieval + token refresh)
const full = await runAuthHealthCheck(auth, {
  email: "user@example.com",
  password: "password",
})
// { provider, ok, checks: [{ name, ok, message }] }
```

Checks: provider loaded → auth API connection → sign-in API responds →
session retrieval → token refresh. `ok` is `true` only when every check passes.
Session checks are skipped (with a message) when no credentials are given.

---

## 5. Adding a New Provider

1. Implement `AuthProvider` from `src/providers/auth/types.ts`.
2. Add `createXxxAuthProvider()` in `src/providers/auth/`.
3. Register the name in `factory.ts`.
4. Run the health check to verify.
