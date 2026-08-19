import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"
import { storageService } from "@/services/storage.service"
import { mediaRepository } from "@/repositories/media.repository"

/**
 * Backfill legacy base64 itinerary images.
 *
 * The old ImageUpload persisted itinerary images as base64 data URLs, which
 * leaked into both the PackageItinerary.image column and
 * publicContent.detail.itinerary[].image. Each unique base64 blob is uploaded
 * through the storage provider (creating a Media record, same as
 * /api/admin/media/upload) and rewritten to its URL in both places.
 *
 * Safe to re-run (base64 sources disappear after the first run).
 */

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
}

function isBase64Image(v: unknown): v is string {
  return typeof v === "string" && v.startsWith("data:image/")
}

async function uploadDataUrl(dataUrl: string, caption: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error("Bukan data URL base64 yang valid")
  const mimeType = match[1]
  const buffer = Buffer.from(match[2], "base64")
  const ext = EXTENSION_MAP[mimeType] ?? "bin"
  const baseName = `itinerary-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const filename = `${baseName}.${ext}`
  const file = new File([buffer], filename, { type: mimeType })
  const storagePath = `root/${Date.now()}_${baseName}`

  const result = await storageService.upload(file, storagePath)

  return mediaRepository.create({
    filename,
    originalName: filename,
    extension: ext,
    mimeType,
    size: file.size,
    width: result.width,
    height: result.height,
    url: result.url,
    thumbnailUrl: result.thumbnailUrl,
    storageProvider: process.env.STORAGE_PROVIDER ?? "local",
    storagePath: result.storagePath,
    caption,
  })
}

async function main() {
  console.log("=== Backfill Base64 Itinerary Images ===\n")

  // 1. Rows in the PackageItinerary table.
  const rows = await db.packageItinerary.findMany({
    where: { image: { startsWith: "data:image/" } },
    select: { id: true, packageId: true, image: true },
  })
  console.log(`PackageItinerary rows dengan base64: ${rows.length}`)

  // 2. Base64 in publicContent.detail.itinerary[].image.
  const packages = await db.package.findMany({
    select: { id: true, slug: true, title: true, publicContent: true },
  })
  const pcAffected: Array<{ pkg: (typeof packages)[number]; images: string[] }> = []
  for (const pkg of packages) {
    const pc = pkg.publicContent as
      | { detail?: { itinerary?: Array<Record<string, unknown>> } }
      | null
      | undefined
    const itinerary = pc?.detail?.itinerary
    if (!Array.isArray(itinerary)) continue
    const images = itinerary
      .filter((it) => isBase64Image(it?.image))
      .map((it) => it.image as string)
    if (images.length > 0) pcAffected.push({ pkg, images })
  }
  console.log(`Paket dengan base64 di publicContent.detail.itinerary: ${pcAffected.length}`)

  // 3. Upload each unique base64 value once.
  const unique = [
    ...new Set([
      ...rows.map((r) => r.image),
      ...pcAffected.flatMap((x) => x.images),
    ]),
  ]
  const urlMap = new Map<string, string>()
  let uploadedCount = 0
  for (const b64 of unique) {
    const media = await uploadDataUrl(b64, "Itinerary image")
    urlMap.set(b64, media.url)
    uploadedCount++
    console.log(`  ↑ uploaded ${media.filename} → ${media.url} (${media.size} bytes)`)
  }

  // 4. Rewrite PackageItinerary.image.
  let rowUpdated = 0
  for (const r of rows) {
    const url = urlMap.get(r.image)
    if (!url) continue
    await db.packageItinerary.update({ where: { id: r.id }, data: { image: url } })
    rowUpdated++
  }
  console.log(`PackageItinerary diupdate: ${rowUpdated}`)

  // 5. Rewrite publicContent.detail.itinerary[].image.
  let pcUpdated = 0
  for (const { pkg } of pcAffected) {
    const pc = pkg.publicContent as {
      detail?: { itinerary?: Array<Record<string, unknown>> }
    }
    const itinerary = pc.detail?.itinerary ?? []
    let changed = false
    const newItinerary = itinerary.map((it) => {
      if (isBase64Image(it.image)) {
        const url = urlMap.get(it.image)
        if (url) {
          changed = true
          return { ...it, image: url }
        }
      }
      return it
    })
    if (!changed) continue
    const newPc = {
      ...pc,
      detail: { ...(pc.detail ?? {}), itinerary: newItinerary },
    }
    await db.package.update({
      where: { id: pkg.id },
      data: { publicContent: JSON.parse(JSON.stringify(newPc)) as Prisma.InputJsonValue },
    })
    pcUpdated++
    console.log(`  ✓ publicContent [${pkg.slug}] ${pkg.title}`)
  }

  console.log(`\n=== Ringkasan ===`)
  console.log(`Uploaded media baru: ${uploadedCount}`)
  console.log(`PackageItinerary diupdate: ${rowUpdated}`)
  console.log(`publicContent diupdate: ${pcUpdated}`)

  await db.$disconnect()
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})