import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Session, User } from "@supabase/supabase-js"
import { resolvePermissionsFromRoles, matchesPermission } from "@/providers/auth/resolvers/permission.resolver"
import type {
  AuthCredentials,
  AuthProvider,
  AuthRoleResolution,
  AuthRoleResolver,
  AuthSession,
  AuthSessionStore,
  AuthUser,
} from "./types"

export type SupabaseAuthProviderOptions = {
  url?: string
  anonKey?: string
  serviceRoleKey?: string
  sessionStore?: AuthSessionStore
  roleResolver?: AuthRoleResolver
}

function requireEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `AuthProvider "supabase" requires ${name} to be configured in the environment.`
    )
  }
  return value
}

function mapUser(user: User): AuthUser {
  const userMetadata = (user.user_metadata ?? {}) as Record<string, unknown>
  const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>

  const role =
    (appMetadata.role as string | undefined) ??
    (userMetadata.role as string | undefined) ??
    null
  const roles = [
    ...(Array.isArray(appMetadata.roles) ? (appMetadata.roles as string[]) : []),
    ...(Array.isArray(userMetadata.roles) ? (userMetadata.roles as string[]) : []),
    ...(role ? [role] : []),
  ]

  return {
    id: user.id,
    email: user.email ?? "",
    name: (userMetadata.name as string | undefined) ?? (user.email ?? null),
    image: (userMetadata.avatar_url as string | undefined) ?? null,
    role,
    roles: [...new Set(roles)],
    metadata: { ...appMetadata, ...userMetadata },
  }
}

function mapSession(session: Session | null): AuthSession | null {
  if (!session) return null
  return {
    user: mapUser(session.user),
    accessToken: session.access_token ?? null,
    refreshToken: session.refresh_token ?? null,
    expiresAt: session.expires_at ? session.expires_at * 1000 : null,
    provider: "supabase",
  }
}

function permissionsForRole(role: string | null): string[] {
  return role ? resolvePermissionsFromRoles([role]) : []
}

export function createSupabaseAuthProvider(
  options: SupabaseAuthProviderOptions = {}
): AuthProvider {
  const url = requireEnvVar(
    "NEXT_PUBLIC_SUPABASE_URL",
    options.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  )
  const anonKey = requireEnvVar(
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    options.anonKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  void options.serviceRoleKey

  const supabase: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

  const sessionStore: AuthSessionStore | null = options.sessionStore ?? null
  const roleResolver: AuthRoleResolver | null = options.roleResolver ?? null

  let currentSession: AuthSession | null = null

  async function loadSession(): Promise<AuthSession | null> {
    if (currentSession) return currentSession
    const stored = await sessionStore?.get()
    if (stored) {
      currentSession = stored
      return stored
    }
    return null
  }

  async function persistSession(session: AuthSession | null): Promise<void> {
    currentSession = session
    await sessionStore?.set(session)
  }

  async function resolveRoles(user: AuthUser): Promise<AuthRoleResolution> {
    if (roleResolver) return roleResolver(user)
    return { role: user.role, permissions: permissionsForRole(user.role) }
  }

  return {
    async signIn(credentials: AuthCredentials): Promise<AuthSession> {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })
      if (error) {
        throw new Error(`Sign-in failed: ${error.message}`)
      }
      const session = mapSession(data.session)
      if (!session) {
        throw new Error("Sign-in failed: no session returned by provider.")
      }
      await persistSession(session)
      return session
    },

    async signOut(): Promise<void> {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(`Sign-out failed: ${error.message}`)
      }
      await persistSession(null)
    },

    async getSession(): Promise<AuthSession | null> {
      const loaded = await loadSession()
      if (loaded) return loaded
      const { data } = await supabase.auth.getSession()
      return mapSession(data.session)
    },

    async getUser(): Promise<AuthUser | null> {
      const session = await loadSession()
      const token = session?.accessToken ?? undefined
      const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser()
      if (error || !data.user) return null
      return mapUser(data.user)
    },

    async refreshSession(): Promise<AuthSession | null> {
      const session = await loadSession()
      const refreshToken = session?.refreshToken ?? undefined
      const { data, error } = refreshToken
        ? await supabase.auth.refreshSession({ refresh_token: refreshToken })
        : await supabase.auth.refreshSession()
      if (error || !data.session) {
        await persistSession(null)
        return null
      }
      const refreshed = mapSession(data.session)
      await persistSession(refreshed)
      return refreshed
    },

    async verifySession(): Promise<boolean> {
      const session = await loadSession()
      if (!session?.accessToken) return false
      const { error } = await supabase.auth.getUser(session.accessToken)
      return !error
    },

    async hasRole(role: string): Promise<boolean> {
      const user = await this.getUser()
      if (!user) return false
      const resolved = await resolveRoles(user)
      const roles = new Set([...(resolved.role ? [resolved.role] : []), ...user.roles])
      return roles.has(role)
    },

    async hasPermission(permission: string): Promise<boolean> {
      const user = await this.getUser()
      if (!user) return false
      const resolved = await resolveRoles(user)
      const granted =
        resolved.permissions.length > 0
          ? resolved.permissions
          : permissionsForRole(resolved.role)
      return matchesPermission(permission, granted)
    },
  }
}
