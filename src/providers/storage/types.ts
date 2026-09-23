export type StorageFileInput = File | Blob | Buffer | Uint8Array

export type StorageUploadResult = {
  path: string
  url: string
  size: number
}

export type StorageListEntry = {
  path: string
  name: string
  size: number
  updatedAt: Date
  isFolder: boolean
}

/**
 * Explicit upload purpose — server-controlled allowlist.
 * Determines which storage bucket the file is written to.
 * Client-provided values are validated against this list.
 */
export const UPLOAD_PURPOSES = [
  "public",
  "customer_photo",
  "customer_document",
  "jamaah_photo",
  "jamaah_document",
] as const

export type UploadPurpose = (typeof UPLOAD_PURPOSES)[number]

export const PRIVATE_PURPOSES: readonly UploadPurpose[] = [
  "customer_photo",
  "customer_document",
  "jamaah_photo",
  "jamaah_document",
]

export function isPrivatePurpose(purpose: UploadPurpose): boolean {
  return (PRIVATE_PURPOSES as readonly UploadPurpose[]).includes(purpose)
}

export type StorageProvider = {
  upload(file: StorageFileInput, path: string, bucket?: string): Promise<StorageUploadResult>
  delete(path: string): Promise<void>
  exists(path: string): Promise<boolean>
  copy(from: string, to: string): Promise<void>
  move(from: string, to: string): Promise<void>
  getPublicUrl(path: string): string
  createSignedUrl(path: string, expiresIn: number, bucket?: string): Promise<string>
  list(prefix: string): Promise<StorageListEntry[]>
  createFolder(path: string): Promise<void>
  deleteFolder(path: string): Promise<void>
}

export type StorageProviderName = "local" | "supabase"
