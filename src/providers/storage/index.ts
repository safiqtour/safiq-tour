import { createStorageProvider } from "./factory"
import type { StorageProvider } from "./types"

export * from "./types"
export { createStorageProvider } from "./factory"
export { createLocalStorageProvider } from "./local.provider"
export { createSupabaseStorageProvider } from "./supabase.provider"
export { runStorageHealthCheck } from "./health"

export const storage: StorageProvider = createStorageProvider()
