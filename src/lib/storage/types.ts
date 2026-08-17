export type UploadResult = {
  url: string
  thumbnailUrl?: string
  storagePath: string
  width?: number
  height?: number
  dominantColor?: string
  blurHash?: string
}

export type StorageProvider = {
  upload(file: File, path: string): Promise<UploadResult>
  delete(storagePath: string): Promise<void>
  getUrl(storagePath: string): string
}
