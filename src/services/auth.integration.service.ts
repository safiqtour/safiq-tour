import { cache } from "react"

import { createAuthProvider } from "@/providers/auth/factory"
import type { AuthProvider } from "@/providers/auth/types"
import type { AuthCredentials, AuthSession } from "@/providers/auth/types"
import type { AuthUser as ProviderUser } from "@/providers/auth/types"
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  encodeSessionCookie,
  decodeSessionCookie,
  type SessionCookiePayload,
} from "@/lib/auth/session-token"
import { resolveUserFromIdentity } from "@/providers/auth/resolvers/user.resolver"
import type { ResolvedRole, ResolvedUser } from "@/providers/auth/resolvers/role.resolver"

export {
  SESSION_COOKIE,
  encodeSessionCookie,
  decodeSessionCookie,
} from "@/lib/auth/session-token"

export type AuthCookieTransport = {
  get(): Promise<string | null> | string | null
  set(value: string): Promise<void> | void
  delete(): Promise<void> | void
}

export type AppRole = ResolvedRole

export type AppUser = ResolvedUser

export type AppSession = {
  user: AppUser
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  provider: string
}

let provider: AuthProvider | null = null

function getProvider(): AuthProvider {
  provider ??= createAuthProvider()
  return provider
}

async function defaultTransport(): Promise<AuthCookieTransport> {
  const { cookies } = await import("next/headers")
  const store = await cookies()
  return {
    get: () => store.get(SESSION_COOKIE)?.value ?? null,
    set: async (value: string) => {
      await store.set(SESSION_COOKIE, value, SESSION_COOKIE_OPTIONS)
    },
    delete: async () => {
      await store.delete(SESSION_COOKIE)
    },
  }
}

async function resolveTransport(
  transport?: AuthCookieTransport
): Promise<AuthCookieTransport> {
  return transport ?? (await defaultTransport())
}

async function readSession(transport?: AuthCookieTransport): Promise<SessionCookiePayload | null> {
  const active = await resolveTransport(transport)
  const raw = await active.get()
  return raw ? await decodeSessionCookie(raw) : null
}

async function writeSession(
  payload: SessionCookiePayload,
  transport?: AuthCookieTransport
): Promise<void> {
  const active = await resolveTransport(transport)
  await active.set(await encodeSessionCookie(payload))
}

async function deleteSession(transport?: AuthCookieTransport): Promise<void> {
  const active = await resolveTransport(transport)
  await active.delete()
}

function isExpired(session: AuthSession, skewMs = 30_000): boolean {
  if (!session.expiresAt) return false
  return session.expiresAt - skewMs <= Date.now()
}

export async function resolveAppUser(providerUser: ProviderUser): Promise<AppUser> {
  return resolveUserFromIdentity(providerUser)
}

async function buildAppSession(session: AuthSession): Promise<AppSession> {
  const user = await resolveAppUser(session.user)
  return {
    user,
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    expiresAt: session.expiresAt,
    provider: session.provider,
  }
}

async function toCookiePayload(session: AuthSession): Promise<SessionCookiePayload> {
  const appUser = await resolveAppUser(session.user)
  return { session, appRole: appUser.role }
}

export async function verifySession(session?: AuthSession | null): Promise<boolean> {
  return getProvider().verifySession(session ?? null)
}

export async function signIn(
  credentials: AuthCredentials,
  transport?: AuthCookieTransport
): Promise<AppSession> {
  const session = await getProvider().signIn(credentials)
  const payload = await toCookiePayload(session)
  await writeSession(payload, transport)
  return buildAppSession(session)
}

export async function signOut(transport?: AuthCookieTransport): Promise<void> {
  const current = await readSession(transport)
  const active = getProvider()
  try {
    await active.signOut(current?.session ?? null)
  } catch {
    // best-effort: clear the local session regardless
  }
  await deleteSession(transport)
}

// Read-only session accessor. Safe to call during Server Component
// rendering — it NEVER mutates cookies. Memoized per request with
// React.cache(). An expired/invalid session returns null without writing;
// callers that need to refresh an expired session (Server Actions / Route
// Handlers) must use getWritableSession() instead.
export const getSession = cache(
  async (transport?: AuthCookieTransport): Promise<AppSession | null> => {
    const current = await readSession(transport)
    if (!current?.session.accessToken) return null

    // Read-only: do not refresh (which would write the cookie) here.
    if (isExpired(current.session)) return null

    const session = await getProvider().getSession(current.session)
    if (!session) return null
    return buildAppSession(session)
  }
)

export const getUser = cache(
  async (transport?: AuthCookieTransport): Promise<AppUser | null> => {
    const session = await getSession(transport)
    return session?.user ?? null
  }
)

// Writable session accessor. Only call from a Server Action or Route
// Handler. Refreshes an expired session (rewriting the cookie) and clears
// the cookie when the stored session can no longer be validated.
export async function getWritableSession(
  transport?: AuthCookieTransport
): Promise<AppSession | null> {
  const current = await readSession(transport)
  if (!current?.session.accessToken) return null

  if (isExpired(current.session)) {
    return refreshSession(transport)
  }

  const session = await getProvider().getSession(current.session)
  if (!session) {
    await deleteSession(transport)
    return null
  }
  return buildAppSession(session)
}

export async function refreshSession(
  transport?: AuthCookieTransport
): Promise<AppSession | null> {
  const current = await readSession(transport)
  if (!current?.session.refreshToken) return null

  const refreshed = await getProvider().refreshSession(current.session)
  if (!refreshed) {
    await deleteSession(transport)
    return null
  }
  const payload = await toCookiePayload(refreshed)
  await writeSession(payload, transport)
  return buildAppSession(refreshed)
}
