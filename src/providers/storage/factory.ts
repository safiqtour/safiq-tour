import type { StorageProvider } from "./types"
import { createLocalStorageProvider } from "./local.provider"
import { createSupabaseStorageProvider } from "./supabase.provider"

export type StorageFactoryOptions = {
  provider?: string
}

export function createStorageProvider(
  options: StorageFactoryOptions = {}
): StorageProvider {
  const name = (options.provider ?? process.env.STORAGE_PROVIDER ?? "local").toLowerCase()

  switch (name) {
    case "local":
      return createLocalStorageProvider()
    case "supabase":
      return createSupabaseStorageProvider()
    default:
      throw new Error(
        `Unknown storage provider "${name}". Supported providers: local, supabase.`
      )
  }
}
