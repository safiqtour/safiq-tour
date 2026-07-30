import fs from "node:fs/promises"
import path from "node:path"
import type { StorageProvider, UploadResult } from "../types"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

function ensureDir(dir: string) {
  return fs.mkdir(dir, { recursive: true })
}

function getExtension(mimeType: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
    "application/pdf": ".pdf",
  }
  return map[mimeType] ?? ".bin"
}

export const localStorageProvider: StorageProvider = {
  async upload(file: File, storagePath: string): Promise<UploadResult> {
    const ext = getExtension(file.type) || path.extname(file.name)
    const filename = `${storagePath}${ext}`
    const fullPath = path.join(UPLOAD_DIR, filename)
    await ensureDir(path.dirname(fullPath))
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(fullPath, buffer)
    const url = `/uploads/${filename.replace(/\\/g, "/")}`

    let width: number | undefined
    let height: number | undefined
    if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
      try {
        const sharp = (await import("sharp")).default
        const meta = await sharp(buffer).metadata()
        width = meta.width
        height = meta.height
      } catch {
        // skip metadata extraction
      }
    }

    return { url, storagePath: filename, width, height }
  },

  async delete(storagePath: string): Promise<void> {
    const fullPath = path.join(UPLOAD_DIR, storagePath)
    await fs.unlink(fullPath).catch(() => {})
  },

  getUrl(storagePath: string): string {
    return `/uploads/${storagePath.replace(/\\/g, "/")}`
  },
}
