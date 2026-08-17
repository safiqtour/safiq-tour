export type AuthCredentials = {
  email: string
  password: string
}

export type AuthUser = {
  id: string
  email: string
  name: string | null
  image: string | null
  role: string | null
  roles: string[]
  metadata?: Record<string, unknown>
}

export type AuthSession = {
  user: AuthUser
  accessToken: string | null
  refreshToken: string | null
  expiresAt: number | null
  provider: string
}

export type AuthProvider = {
  signIn(credentials: AuthCredentials): Promise<AuthSession>
  signOut(session?: AuthSession | null): Promise<void>
  getSession(session?: AuthSession | null): Promise<AuthSession | null>
  getUser(session?: AuthSession | null): Promise<AuthUser | null>
  refreshSession(session?: AuthSession | null): Promise<AuthSession | null>
  verifySession(session?: AuthSession | null): Promise<boolean>
  hasRole(user: AuthUser | null, role: string): Promise<boolean>
  hasPermission(user: AuthUser | null, permission: string): Promise<boolean>
}

export type AuthProviderName = "supabase" | "authjs" | "clerk" | "keycloak"
