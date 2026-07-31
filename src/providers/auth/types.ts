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

export type AuthRoleResolution = {
  role: string | null
  permissions: string[]
}

export type AuthRoleResolver = (user: AuthUser) => Promise<AuthRoleResolution> | AuthRoleResolution

export type AuthSessionStore = {
  get(): Promise<AuthSession | null> | AuthSession | null
  set(session: AuthSession | null): Promise<void> | void
}

export type AuthProvider = {
  signIn(credentials: AuthCredentials): Promise<AuthSession>
  signOut(): Promise<void>
  getSession(): Promise<AuthSession | null>
  getUser(): Promise<AuthUser | null>
  refreshSession(): Promise<AuthSession | null>
  verifySession(): Promise<boolean>
  hasRole(role: string): Promise<boolean>
  hasPermission(permission: string): Promise<boolean>
}

export type AuthProviderName = "supabase" | "authjs" | "clerk" | "keycloak"
