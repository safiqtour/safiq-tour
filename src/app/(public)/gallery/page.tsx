import type { Metadata } from "next"
import { GalleryPageClient } from "@/components/gallery/GalleryPageClient"

export const metadata: Metadata = {
  title: "Galeri Safiq Tour | Dokumentasi Perjalanan Umroh",
  description:
    "Lihat dokumentasi perjalanan umroh jamaah Safiq Tour mulai dari keberangkatan, ibadah di Masjidil Haram dan Masjid Nabawi hingga kepulangan.",
  openGraph: {
    title: "Galeri Safiq Tour | Dokumentasi Perjalanan Umroh",
    description:
      "Lihat dokumentasi perjalanan umroh jamaah Safiq Tour mulai dari keberangkatan, ibadah di Masjidil Haram dan Masjid Nabawi hingga kepulangan.",
    url: "https://www.safiqtour.com/gallery",
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
    canonical: "https://www.safiqtour.com/gallery",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Galeri Safiq Tour",
      description: "Dokumentasi perjalanan umroh jamaah Safiq Tour",
      url: "https://www.safiqtour.com/gallery",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Beranda", item: "https://www.safiqtour.com" },
          { "@type": "ListItem", position: 2, name: "Galeri", item: "https://www.safiqtour.com/gallery" },
        ],
      },
    }),
  },
}

export default function GalleryPage() {
  return <GalleryPageClient />
}
