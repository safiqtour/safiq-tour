import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    absolute: "Tentang Safiq Tour | Travel Umroh Resmi di Bandung Barat",
  },
  description:
    "Mengenal PT. Safiq Oto Mandiri (Safiq Tour), travel umroh resmi PPIU Kemenag RI yang sejak 2019 melayani jamaah dari Bandung, Bandung Barat, dan sekitarnya.",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
