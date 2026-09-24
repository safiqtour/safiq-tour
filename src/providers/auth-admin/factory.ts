import type { AuthAdminProvider } from "./types"
import { createSupabaseAuthAdminProvider } from "./supabase.provider"

export type AuthAdminFactoryOptions = {
  provider?: string
}

export function createAuthAdminProvider(
  options: AuthAdminFactoryOptions = {}
): AuthAdminProvider {
  const name = (
    options.provider ?? process.env.AUTH_ADMIN_PROVIDER ?? "supabase"
  ).toLowerCase()

  switch (name) {
    case "supabase":
      return createSupabaseAuthAdminProvider()
    case "keycloak":
    case "aws-cognito":
    case "auth0":
    case "firebase":
      throw new Error(
        `AuthAdminProvider "${name}" is not implemented yet. Only "supabase" is currently available.`
      )
    default:
      throw new Error(
        `Unknown auth admin provider "${name}". Supported providers: supabase (keycloak, aws-cognito, auth0, firebase planned).`
      )
  }
}
