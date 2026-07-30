import type { StorageProvider } from "./types"
import { localStorageProvider } from "./providers/local"
import { cloudinaryStorageProvider } from "./providers/cloudinary"

const provider = (process.env.STORAGE_PROVIDER ?? "local") as "local" | "cloudinary"

const providers: Record<string, StorageProvider> = {
  local: localStorageProvider,
  cloudinary: cloudinaryStorageProvider,
}

export const storage: StorageProvider = providers[provider] ?? localStorageProvider
