import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"
import { storageService } from "@/services/storage.service"
import { mediaRepository } from "@/repositories/media.repository"

/**
 * Backfill legacy base64 images stored directly in Package columns.
 *
 * Finds every package whose `thumbnail` or `heroImage` is a base64 data URL
 * (old ImageUpload persisted the raw file via FileReader.readAsDataURL) and:
 *   1. Uploads each unique base64 blob through the storage provider,
 *      creating a Media record (same as /api/admin/media/upload).
 *   2. Replaces thumbnail / heroImage with the new URL.
 *   3. Rewrites publicContent.card.image and publicContent.detail.heroImage
 *      whenever they reference the same base64 blob.
 *
 * The legacy string is only ever replaced; nothing else in publicContent
 * is touched. Safe to re-run (base64 sources disappear after the first run).
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
  const baseName = `package-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
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
  console.log("=== Backfill Base64 Package Images ===\n")

  const packages = await db.package.findMany({
    where: {
      OR: [
        { thumbnail: { startsWith: "data:image/" } },
        { heroImage: { startsWith: "data:image/" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      thumbnail: true,
      heroImage: true,
      publicContent: true,
    },
  })
  console.log(`Paket dengan gambar base64: ${packages.length}\n`)

  let uploadedCount = 0
  let updatedCount = 0

  for (const pkg of packages) {
    const thumbB64 = isBase64Image(pkg.thumbnail) ? pkg.thumbnail : null
    const heroB64 = isBase64Image(pkg.heroImage) ? pkg.heroImage : null

    const pc = (pkg.publicContent ?? {}) as {
      card?: Record<string, unknown>
      detail?: Record<string, unknown>
    }
    const cardImage = isBase64Image(pc.card?.image) ? pc.card.image : null
    const detailHero = isBase64Image(pc.detail?.heroImage) ? pc.detail.heroImage : null

    const uniqueB64 = [
      ...new Set(
        [thumbB64, heroB64, cardImage, detailHero].filter(
          (v): v is string => v !== null
        )
      ),
    ]

    const urlMap = new Map<string, string>()
    for (const b64 of uniqueB64) {
      const media = await uploadDataUrl(b64, `Package image — ${pkg.title}`)
      urlMap.set(b64, media.url)
      uploadedCount++
      console.log(`  ↑ uploaded ${media.filename} → ${media.url} (${media.size} bytes)`)
    }

    const data: Prisma.PackageUpdateInput = {}
    if (thumbB64 && urlMap.has(thumbB64)) data.thumbnail = urlMap.get(thumbB64)!
    if (heroB64 && urlMap.has(heroB64)) data.heroImage = urlMap.get(heroB64)!

    const newPc: { card: Record<string, unknown>; detail: Record<string, unknown> } = {
      card: { ...(pc.card ?? {}) },
      detail: { ...(pc.detail ?? {}) },
    }
    if (cardImage && urlMap.has(cardImage)) newPc.card.image = urlMap.get(cardImage)!
    if (detailHero && urlMap.has(detailHero)) newPc.detail.heroImage = urlMap.get(detailHero)!
    data.publicContent = JSON.parse(JSON.stringify(newPc)) as Prisma.InputJsonValue

    await db.package.update({ where: { id: pkg.id }, data })
    updatedCount++
    console.log(`  ✓ updated [${pkg.slug}] ${pkg.title}`)
  }

  console.log(`\n=== Ringkasan ===`)
  console.log(`Uploaded media baru: ${uploadedCount}`)
  console.log(`Paket diupdate: ${updatedCount}`)

  await db.$disconnect()
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})