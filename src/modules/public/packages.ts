import { db } from "@/lib/prisma/db"
import type { Package } from "@/data/packages"
import type { PackageDetail } from "@/data/packages-detail"

/**
 * Public (front-end) read access to CMS-managed Package content.
 *
 * The public marketing payload (card + detail) is stored on the Package row in
 * the `publicContent` JSON column, seeded from the former hardcoded data. Only
 * PUBLISHED packages with a public payload are exposed. This keeps the public
 * UI contract identical while the content becomes database-managed.
 */

export interface PublicPackage {
  card: Package
  detail: PackageDetail | null
}

const PUBLISHED = "PUBLISHED"

function parseContent(raw: unknown): PublicPackage | null {
  if (!raw) return null
  const content = raw as { card?: Package; detail?: PackageDetail }
  if (!content.card) return null
  return { card: content.card, detail: content.detail ?? null }
}

export async function getPublicPackages(params?: {
  category?: string
  featuredOnly?: boolean
}): Promise<Package[]> {
  const rows = await db.package.findMany({
    where: { status: PUBLISHED },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
    take: 100,
  })

  const packages = rows
    .map((row) => parseContent(row.publicContent)?.card)
    .filter((p): p is Package => Boolean(p))

  if (params?.category && params.category !== "all") {
    return packages.filter((p) => p.category === params.category)
  }
  if (params?.featuredOnly) {
    return packages.filter((p) => p.featured)
  }
  return packages
}

export async function getPublicPackageBySlug(slug: string): Promise<PublicPackage | null> {
  const row = await db.package.findUnique({ where: { slug } })
  if (!row || row.status !== PUBLISHED) return null
  return parseContent(row.publicContent)
}

export async function getAllPackageSlugs(): Promise<string[]> {
  const rows = await db.package.findMany({
    where: { status: PUBLISHED },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
}
