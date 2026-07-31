import { storage, type StorageProvider } from "@/providers/storage"

export type StorageUploadResult = {
  url: string
  storagePath: string
  thumbnailUrl?: string
  width?: number
  height?: number
  size: number
}

export type StorageService = {
  upload(file: File, basePath: string): Promise<StorageUploadResult>
  delete(path: string): Promise<void>
  getPublicUrl(path: string): string
  createSignedUrl(path: string, expiresIn: number): Promise<string>
  exists(path: string): Promise<boolean>
}

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "application/pdf": ".pdf",
}

const RASTER_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
])

const THUMBNAIL_WIDTH = 400
const THUMBNAIL_QUALITY = 80

function extensionFor(file: File): string {
  return EXTENSION_MAP[file.type] ?? file.name.match(/\.[^.]+$/)?.[0] ?? ".bin"
}

function thumbnailPathFor(storagePath: string): string {
  return `thumbnails/${storagePath}.webp`
}

async function getSharp() {
  try {
    return (await import("sharp")).default
  } catch {
    return null
  }
}

export function createStorageService(
  provider: StorageProvider = storage
): StorageService {
  return {
    async upload(file: File, basePath: string): Promise<StorageUploadResult> {
      const storagePath = `${basePath}${extensionFor(file)}`
      const result = await provider.upload(file, storagePath)
      const url = provider.getPublicUrl(storagePath)

      let width: number | undefined
      let height: number | undefined
      let thumbnailUrl: string | undefined

      if (RASTER_IMAGE_TYPES.has(file.type)) {
        try {
          const sharp = await getSharp()
          const buffer = Buffer.from(await file.arrayBuffer())
          if (!sharp) {
            throw new Error("sharp is not available")
          }
          const metadata = await sharp(buffer).metadata()
          width = metadata.width
          height = metadata.height

          const thumbnail = await sharp(buffer)
            .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
            .webp({ quality: THUMBNAIL_QUALITY })
            .toBuffer()

          const thumbnailArrayBuffer = thumbnail.buffer.slice(
            thumbnail.byteOffset,
            thumbnail.byteOffset + thumbnail.byteLength
          ) as ArrayBuffer

          const thumbPath = thumbnailPathFor(storagePath)
          await provider.upload(
            new Blob([new Uint8Array(thumbnailArrayBuffer)], { type: "image/webp" }),
            thumbPath
          )
          thumbnailUrl = provider.getPublicUrl(thumbPath)
        } catch {
          // metadata and thumbnail generation are best-effort
        }
      }

      return { url, storagePath, thumbnailUrl, width, height, size: result.size }
    },

    async delete(path: string): Promise<void> {
      await provider.delete(path)
      try {
        await provider.delete(thumbnailPathFor(path))
      } catch {
        // thumbnail cleanup is best-effort
      }
    },

    getPublicUrl(path: string): string {
      return provider.getPublicUrl(path)
    },

    async createSignedUrl(path: string, expiresIn: number): Promise<string> {
      return provider.createSignedUrl(path, expiresIn)
    },

    async exists(path: string): Promise<boolean> {
      return provider.exists(path)
    },
  }
}

export const storageService = createStorageService()
