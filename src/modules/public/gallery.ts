import { db } from "@/lib/prisma/db"

/**
 * Public (front-end) read access to CMS-managed photo/video gallery content.
 * Seeded from the former hardcoded arrays in the gallery components; items are
 * stored as simple URL strings (per the Sprint 3C decision) pointing at the
 * existing public image/video paths, mirroring the original array shapes so the
 * UI components stay unchanged.
 */

export interface GalleryPhoto {
  src: string
  alt: string
  category: string
  location: string
  date: string
}

export interface GalleryVideo {
  id: string
  title: string
  location: string
  duration: string
}

const GALLERY_SLUG = "jamaah-dokumentasi"

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const gallery = await db.gallery.findUnique({
    where: { slug: GALLERY_SLUG },
    include: {
      items: {
        where: { type: "PHOTO", isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  return (gallery?.items ?? []).map((item) => ({
    src: item.url,
    alt: item.alt,
    category: item.category,
    location: item.location,
    date: item.dateLabel,
  }))
}

export async function getGalleryVideos(): Promise<GalleryVideo[]> {
  const gallery = await db.gallery.findUnique({
    where: { slug: GALLERY_SLUG },
    include: {
      items: {
        where: { type: "VIDEO", isActive: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  })

  return (gallery?.items ?? []).map((item) => ({
    id: item.url,
    title: item.alt,
    location: item.location,
    duration: item.durationLabel,
  }))
}

export async function getGalleryCategories(): Promise<string[]> {
  const gallery = await db.gallery.findUnique({
    where: { slug: GALLERY_SLUG },
    include: {
      items: {
        where: { type: "PHOTO", isActive: true },
        select: { category: true },
      },
    },
  })

  const seen = new Set<string>()
  for (const item of gallery?.items ?? []) {
    if (item.category) seen.add(item.category)
  }
  return [...seen]
}
