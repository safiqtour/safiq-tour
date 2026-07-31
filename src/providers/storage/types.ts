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

export type StorageProvider = {
  upload(file: StorageFileInput, path: string): Promise<StorageUploadResult>
  delete(path: string): Promise<void>
  exists(path: string): Promise<boolean>
  copy(from: string, to: string): Promise<void>
  move(from: string, to: string): Promise<void>
  getPublicUrl(path: string): string
  createSignedUrl(path: string, expiresIn: number): Promise<string>
  list(prefix: string): Promise<StorageListEntry[]>
  createFolder(path: string): Promise<void>
  deleteFolder(path: string): Promise<void>
}

export type StorageProviderName = "local" | "supabase"
