import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import type { Session, User } from "@supabase/supabase-js"
import { resolvePermissionsFromRoles, matchesPermission } from "@/providers/auth/resolvers/permission.resolver"
import type {
  AuthCredentials,
  AuthProvider,
  AuthSession,
  AuthUser,
} from "./types"

export type SupabaseAuthProviderOptions = {
  url?: string
  anonKey?: string
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

  const supabase: SupabaseClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  })

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
      return session
    },

    async signOut(session?: AuthSession | null): Promise<void> {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw new Error(`Sign-out failed: ${error.message}`)
      }
      void session
    },

    async getSession(session?: AuthSession | null): Promise<AuthSession | null> {
      return session ?? null
    },

    async getUser(session?: AuthSession | null): Promise<AuthUser | null> {
      const token = session?.accessToken ?? undefined
      const { data, error } = token
        ? await supabase.auth.getUser(token)
        : await supabase.auth.getUser()
      if (error || !data.user) return null
      return mapUser(data.user)
    },

    async refreshSession(session?: AuthSession | null): Promise<AuthSession | null> {
      const refreshToken = session?.refreshToken ?? undefined
      const { data, error } = refreshToken
        ? await supabase.auth.refreshSession({ refresh_token: refreshToken })
        : await supabase.auth.refreshSession()
      if (error || !data.session) return null
      return mapSession(data.session)
    },

    async verifySession(session?: AuthSession | null): Promise<boolean> {
      if (!session?.accessToken) return false
      const { error } = await supabase.auth.getUser(session.accessToken)
      return !error
    },

    async hasRole(user: AuthUser | null, role: string): Promise<boolean> {
      if (!user) return false
      const roles = new Set([...(user.role ? [user.role] : []), ...user.roles])
      return roles.has(role)
    },

    async hasPermission(user: AuthUser | null, permission: string): Promise<boolean> {
      if (!user) return false
      const granted = resolvePermissionsFromRoles(user.role ? [user.role] : [])
      return matchesPermission(permission, granted)
    },
  }
}
