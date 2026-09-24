import {
  createClient,
  AuthApiError,
  AuthRetryableFetchError,
  type SupabaseClient,
  type User,
} from "@supabase/supabase-js"
import type {
  AuthAdminCreateInput,
  AuthAdminIdentity,
  AuthAdminIdentityQuery,
  AuthAdminInviteOptions,
  AuthAdminProvider,
  AuthAdminError,
  AuthAdminSetStatusInput,
} from "./types"
import { AuthAdminError as AuthAdminErrorClass } from "./types"

export type SupabaseAuthAdminProviderOptions = {
  url?: string
  serviceRoleKey?: string
}

type SupabaseServiceRoleClient = SupabaseClient

function requireEnvVar(name: string, value: string | undefined): string {
  if (!value) {
    throw new AuthAdminErrorClass(
      "provider-unavailable",
      `AuthAdminProvider "supabase" requires ${name} to be configured in the environment.`
    )
  }
  return value
}

function isDuplicateIdentityError(error: unknown): boolean {
  if (error instanceof AuthApiError) {
    const message = error.message.toLowerCase()
    return (
      error.status === 422 ||
      message.includes("already") ||
      message.includes("registered") ||
      message.includes("in use") ||
      message.includes("duplicate")
    )
  }
  return false
}

function isNotFoundError(error: unknown): boolean {
  if (error instanceof AuthApiError) {
    return error.status === 404 || error.message.toLowerCase().includes("not found")
  }
  return false
}

function isInvalidInputError(error: unknown): boolean {
  if (error instanceof AuthApiError) {
    return error.status === 400 || error.status === 403
  }
  return false
}

function isProviderUnavailableError(error: unknown): boolean {
  if (error instanceof AuthRetryableFetchError) {
    return true
  }
  if (error instanceof TypeError) {
    return true
  }
  return false
}

type NormalizedError = {
  error: AuthAdminError | null
  data: unknown
}

function normalizeError(context: string, error: unknown): NormalizedError {
  if (error instanceof AuthAdminErrorClass) {
    return { error, data: null }
  }
  if (isDuplicateIdentityError(error)) {
    return {
      error: new AuthAdminErrorClass(
        "duplicate-identity",
        `${context}: identity already exists.`,
        error
      ),
      data: null,
    }
  }
  if (isNotFoundError(error)) {
    return {
      error: new AuthAdminErrorClass(
        "identity-not-found",
        `${context}: identity not found.`,
        error
      ),
      data: null,
    }
  }
  if (isInvalidInputError(error)) {
    return {
      error: new AuthAdminErrorClass(
        "invalid-input",
        `${context}: invalid input.`,
        error
      ),
      data: null,
    }
  }
  if (isProviderUnavailableError(error)) {
    return {
      error: new AuthAdminErrorClass(
        "provider-unavailable",
        `${context}: provider unavailable.`,
        error
      ),
      data: null,
    }
  }
  return {
    error: new AuthAdminErrorClass(
      "unknown",
      `${context}: unhandled provider error.`,
      error
    ),
    data: null,
  }
}

function throwIfNormalized(result: NormalizedError): void {
  if (result.error) throw result.error
}

function mapUser(user: User): AuthAdminIdentity {
  const appMetadata = (user.app_metadata ?? {}) as Record<string, unknown>
  const userMetadata = (user.user_metadata ?? {}) as Record<string, unknown>

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
    email: user.email ?? null,
    phone: user.phone ?? null,
    emailConfirmed: user.email_confirmed_at != null,
    phoneConfirmed: user.phone_confirmed_at != null,
    roles: [...new Set(roles)],
    role,
    metadata: { ...appMetadata, ...userMetadata },
    appMetadata,
    bannedUntil: user.banned_until ?? null,
    createdAt: user.created_at,
    updatedAt: user.updated_at ?? user.created_at,
    lastSignInAt: user.last_sign_in_at ?? null,
  }
}

function matchesIdentity(user: User, query: AuthAdminIdentityQuery): boolean {
  if ("email" in query && query.email) {
    return (user.email ?? "").toLowerCase() === query.email.toLowerCase()
  }
  if ("userId" in query && query.userId) {
    return user.id === query.userId
  }
  return false
}

export function createSupabaseAuthAdminProvider(
  options: SupabaseAuthAdminProviderOptions = {}
): AuthAdminProvider {
  const url = requireEnvVar(
    "NEXT_PUBLIC_SUPABASE_URL",
    options.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  )
  const serviceRoleKey = requireEnvVar(
    "SUPABASE_SERVICE_ROLE_KEY",
    options.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const supabase: SupabaseServiceRoleClient = createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  })

  return {
    async createUser(input: AuthAdminCreateInput): Promise<AuthAdminIdentity> {
      const { data, error } = await supabase.auth.admin.createUser({
        email: input.email,
        phone: input.phone,
        password: input.password,
        email_confirm: input.emailConfirmed ?? false,
        user_metadata: input.metadata,
      })
      if (error) {
        const normalized = normalizeError("AuthAdmin createUser", error)
        throwIfNormalized(normalized)
      }
      if (!data?.user) {
        throw new AuthAdminErrorClass(
          "unknown",
          "AuthAdmin createUser: provider returned no user."
        )
      }
      return mapUser(data.user)
    },

    async updatePassword(userId: string, password: string): Promise<AuthAdminIdentity> {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        password,
      })
      if (error) {
        const normalized = normalizeError("AuthAdmin updatePassword", error)
        throwIfNormalized(normalized)
      }
      if (!data?.user) {
        throw new AuthAdminErrorClass(
          "unknown",
          "AuthAdmin updatePassword: provider returned no user."
        )
      }
      return mapUser(data.user)
    },

    async updateEmail(
      userId: string,
      email: string,
      options?: { emailConfirmed?: boolean }
    ): Promise<AuthAdminIdentity> {
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        email,
        email_confirm: options?.emailConfirmed ?? false,
      })
      if (error) {
        const normalized = normalizeError("AuthAdmin updateEmail", error)
        throwIfNormalized(normalized)
      }
      if (!data?.user) {
        throw new AuthAdminErrorClass(
          "unknown",
          "AuthAdmin updateEmail: provider returned no user."
        )
      }
      return mapUser(data.user)
    },

    async setUserStatus(
      userId: string,
      input: AuthAdminSetStatusInput
    ): Promise<AuthAdminIdentity> {
      const banDuration = input.enabled ? "none" : "876000h"
      const { data, error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: banDuration,
      })
      if (error) {
        const normalized = normalizeError("AuthAdmin setUserStatus", error)
        throwIfNormalized(normalized)
      }
      if (!data?.user) {
        throw new AuthAdminErrorClass(
          "unknown",
          "AuthAdmin setUserStatus: provider returned no user."
        )
      }
      return mapUser(data.user)
    },

    async deleteUser(
      userId: string,
      options?: { shouldSoftDelete?: boolean }
    ): Promise<void> {
      const { error } = await supabase.auth.admin.deleteUser(
        userId,
        options?.shouldSoftDelete ?? false
      )
      if (error) {
        const normalized = normalizeError("AuthAdmin deleteUser", error)
        throwIfNormalized(normalized)
      }
    },

    async sendPasswordReset(
      email: string,
      options?: { redirectTo?: string }
    ): Promise<void> {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: options?.redirectTo,
      })
      if (error) {
        const normalized = normalizeError("AuthAdmin sendPasswordReset", error)
        throwIfNormalized(normalized)
      }
    },

    async inviteUserByEmail(
      email: string,
      options?: AuthAdminInviteOptions
    ): Promise<AuthAdminIdentity> {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: options?.redirectTo,
        data: options?.metadata,
      })
      if (error) {
        const normalized = normalizeError("AuthAdmin inviteUserByEmail", error)
        throwIfNormalized(normalized)
      }
      if (!data?.user) {
        throw new AuthAdminErrorClass(
          "unknown",
          "AuthAdmin inviteUserByEmail: provider returned no user."
        )
      }
      return mapUser(data.user)
    },

    async findUserByIdentity(
      query: AuthAdminIdentityQuery
    ): Promise<AuthAdminIdentity | null> {
      if ("userId" in query) {
        const { data, error } = await supabase.auth.admin.getUserById(query.userId)
        if (error) throwIfNormalized(normalizeError("AuthAdmin findUserByIdentity", error))
        return data?.user ? mapUser(data.user) : null
      }

      let page = 1
      for (;;) {
        const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 })
        if (error) throwIfNormalized(normalizeError("AuthAdmin findUserByIdentity", error))

        for (const user of data?.users ?? []) {
          if (matchesIdentity(user, query)) {
            return mapUser(user)
          }
        }

        const pagination = data && "lastPage" in data ? data : null
        const lastPage = pagination?.lastPage ?? 1
        if (page >= lastPage) return null
        page += 1
      }
    },

    async signOutUser(
      userId: string,
      options?: { accessToken?: string }
    ): Promise<void> {
      if (!options?.accessToken) {
        throw new AuthAdminErrorClass(
          "invalid-input",
          "AuthAdmin signOutUser: a user access token is required for the supabase provider."
        )
      }
      const { error } = await supabase.auth.admin.signOut(options.accessToken, "global")
      if (error) throwIfNormalized(normalizeError("AuthAdmin signOutUser", error))
      void userId
    },
  }
}

export type { SupabaseAuthAdminProviderOptions as SupabaseAuthAdminProviderOptionsAlias }
