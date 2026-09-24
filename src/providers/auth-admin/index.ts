import { createAuthAdminProvider } from "./factory"
import type { AuthAdminProvider } from "./types"

export * from "./types"
export { createAuthAdminProvider } from "./factory"
export { createSupabaseAuthAdminProvider } from "./supabase.provider"
export {
  AuthAdminError as AuthAdminErrorClass,
  isAuthAdminError,
} from "./types"

export const authAdmin: AuthAdminProvider = createAuthAdminProvider()
