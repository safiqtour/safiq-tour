import type { StorageProvider, UploadResult } from "../types"

export const cloudinaryStorageProvider: StorageProvider = {
  async upload(_file: File, _storagePath: string): Promise<UploadResult> {
    throw new Error("Cloudinary provider not implemented. Set STORAGE_PROVIDER=local for development.")
  },
  async delete(_storagePath: string): Promise<void> {
    throw new Error("Cloudinary provider not implemented.")
  },
  getUrl(_storagePath: string): string {
    throw new Error("Cloudinary provider not implemented.")
  },
}
