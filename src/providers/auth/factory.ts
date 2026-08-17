import type { AuthProvider } from "./types"
import { createSupabaseAuthProvider } from "./supabase.provider"

export type AuthFactoryOptions = {
  provider?: string
}

export function createAuthProvider(options: AuthFactoryOptions = {}): AuthProvider {
  const name = (options.provider ?? process.env.AUTH_PROVIDER ?? "supabase").toLowerCase()

  switch (name) {
    case "supabase":
      return createSupabaseAuthProvider()
    case "authjs":
    case "clerk":
    case "keycloak":
      throw new Error(
        `AuthProvider "${name}" is not implemented yet. Only "supabase" is currently available.`
      )
    default:
      throw new Error(
        `Unknown auth provider "${name}". Supported providers: supabase (authjs, clerk, keycloak planned).`
      )
  }
}
