import { createAuthProvider } from "./factory"
import type { AuthProvider } from "./types"

export * from "./types"
export { createAuthProvider } from "./factory"
export { createSupabaseAuthProvider } from "./supabase.provider"
export { runAuthHealthCheck } from "./health"

export const auth: AuthProvider = createAuthProvider()
