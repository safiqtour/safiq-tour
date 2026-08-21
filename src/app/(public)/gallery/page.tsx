import type { Metadata } from "next"
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient"
import {
  getGalleryPhotos,
  getGalleryVideos,
  getGalleryCategories,
} from "@/modules/public/gallery"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Galeri Safiq Tour | Dokumentasi Perjalanan Umroh",
  description:
    "Lihat dokumentasi perjalanan umroh jamaah Safiq Tour mulai dari keberangkatan, ibadah di Masjidil Haram dan Masjid Nabawi hingga kepulangan.",
  openGraph: {
    title: "Galeri Safiq Tour | Dokumentasi Perjalanan Umroh",
    description:
      "Lihat dokumentasi perjalanan umroh jamaah Safiq Tour mulai dari keberangkatan, ibadah di Masjidil Haram dan Masjid Nabawi hingga kepulangan.",
    url: "https://safiqtour.id/gallery",
    siteName: "Safiq Tour",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galeri Safiq Tour | Dokumentasi Perjalanan Umroh",
    description:
      "Lihat dokumentasi perjalanan umroh jamaah Safiq Tour mulai dari keberangkatan, ibadah di Masjidil Haram dan Masjid Nabawi hingga kepulangan.",
  },
  alternates: {
    canonical: "https://safiqtour.id/gallery",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Galeri Safiq Tour",
      description: "Dokumentasi perjalanan umroh jamaah Safiq Tour",
      url: "https://safiqtour.id/gallery",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: "https://safiqtour.id" },
          { "@type": "ListItem", position: 2, name: "Galeri", item: "https://safiqtour.id/gallery" },
        ],
      },
    }),
  },
}

export default async function GalleryPage() {
  const [photos, videos, categories] = await Promise.all([
    getGalleryPhotos(),
    getGalleryVideos(),
    getGalleryCategories(),
  ])

  return <GalleryPageClient photos={photos} videos={videos} categories={categories} />
}
