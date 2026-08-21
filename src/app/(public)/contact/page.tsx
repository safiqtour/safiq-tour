import type { Metadata } from "next"
import { Hero } from "@/components/contact/Hero"
import { ContactCards } from "@/components/contact/ContactCards"
import { ContactForm } from "@/components/contact/ContactForm"
import { GoogleMap } from "@/components/contact/GoogleMap"
import { SocialLinks } from "@/components/contact/SocialLinks"
import { FloatingWhatsapp } from "@/components/contact/FloatingWhatsapp"

export const metadata: Metadata = {
  title: "Kontak Safiq Tour | Konsultasi Umroh",
  description:
    "Hubungi Safiq Tour untuk konsultasi paket umroh, jadwal keberangkatan, dan informasi perjalanan ibadah menuju Baitullah.",
  openGraph: {
    title: "Kontak Safiq Tour | Konsultasi Umroh",
    description:
      "Hubungi Safiq Tour untuk konsultasi paket umroh, jadwal keberangkatan, dan informasi perjalanan ibadah menuju Baitullah.",
    url: "https://safiqtour.id/contact",
    siteName: "Safiq Tour",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kontak Safiq Tour | Konsultasi Umroh",
    description:
      "Hubungi Safiq Tour untuk konsultasi paket umroh, jadwal keberangkatan, dan informasi perjalanan ibadah menuju Baitullah.",
  },
  alternates: {
    canonical: "https://safiqtour.id/contact",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      name: "Kontak Safiq Tour | Konsultasi Umroh",
      url: "https://safiqtour.id/contact",
      about: { "@id": "https://safiqtour.id/#organization" },
    }),
  },
}

export default function ContactPage() {
  return (
    <>
      <Hero />
      <ContactCards />
      <ContactForm />
      <GoogleMap />
      <SocialLinks />
      <FloatingWhatsapp />
    </>
  )
}
