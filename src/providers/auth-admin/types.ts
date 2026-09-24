export type AuthAdminIdentity = {
  id: string
  email: string | null
  phone: string | null
  emailConfirmed: boolean
  phoneConfirmed: boolean
  roles: string[]
  role: string | null
  metadata: Record<string, unknown>
  appMetadata: Record<string, unknown>
  bannedUntil: string | null
  createdAt: string
  updatedAt: string
  lastSignInAt: string | null
}

export type AuthAdminIdentityQuery =
  | { userId: string }
  | { email: string }

export type AuthAdminCreateInput = {
  email?: string
  phone?: string
  password: string
  emailConfirmed?: boolean
  metadata?: Record<string, unknown>
}

export type AuthAdminSetStatusInput = {
  enabled: boolean
}

export type AuthAdminInviteOptions = {
  redirectTo?: string
  metadata?: Record<string, unknown>
}

export type AuthAdminSignOutOptions = {
  /** A valid, non-expired access token for the user. Required by Supabase to revoke sessions. */
  accessToken?: string
}

export type AuthAdminErrorCode =
  | "duplicate-identity"
  | "identity-not-found"
  | "invalid-input"
  | "provider-unavailable"
  | "unknown"

export class AuthAdminError extends Error {
  readonly code: AuthAdminErrorCode
  readonly cause?: unknown

  constructor(code: AuthAdminErrorCode, message: string, cause?: unknown) {
    super(message)
    this.name = "AuthAdminError"
    this.code = code
    this.cause = cause
  }
}

export function isAuthAdminError(error: unknown): error is AuthAdminError {
  return error instanceof AuthAdminError
}

export type AuthAdminProvider = {
  createUser(input: AuthAdminCreateInput): Promise<AuthAdminIdentity>
  updatePassword(userId: string, newPassword: string): Promise<AuthAdminIdentity>
  updateEmail(
    userId: string,
    newEmail: string,
    options?: { emailConfirmed?: boolean }
  ): Promise<AuthAdminIdentity>
  setUserStatus(
    userId: string,
    input: AuthAdminSetStatusInput
  ): Promise<AuthAdminIdentity>
  deleteUser(
    userId: string,
    options?: { shouldSoftDelete?: boolean }
  ): Promise<void>
  sendPasswordReset(email: string, options?: { redirectTo?: string }): Promise<void>
  inviteUserByEmail(
    email: string,
    options?: AuthAdminInviteOptions
  ): Promise<AuthAdminIdentity>
  findUserByIdentity(query: AuthAdminIdentityQuery): Promise<AuthAdminIdentity | null>
  signOutUser(userId: string, options?: AuthAdminSignOutOptions): Promise<void>
}

export type AuthAdminProviderName =
  | "supabase"
  | "keycloak"
  | "aws-cognito"
  | "auth0"
  | "firebase"
