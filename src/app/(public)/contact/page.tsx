import type { Metadata } from "next"
import { Hero } from "@/components/contact/Hero"
import { ContactCards } from "@/components/contact/ContactCards"
import { ContactForm } from "@/components/contact/ContactForm"
import { GoogleMap } from "@/components/contact/GoogleMap"
import { SocialLinks } from "@/components/contact/SocialLinks"
import { FloatingWhatsapp } from "@/components/shared/FloatingWhatsapp"

export const metadata: Metadata = {
  title: "Kontak Safiq Tour | Konsultasi Umroh",
  description:
    "Hubungi Safiq Tour untuk konsultasi paket umroh, jadwal keberangkatan, dan informasi perjalanan ibadah menuju Baitullah.",
  openGraph: {
    title: "Kontak Safiq Tour | Konsultasi Umroh",
    description:
      "Hubungi Safiq Tour untuk konsultasi paket umroh, jadwal keberangkatan, dan informasi perjalanan ibadah menuju Baitullah.",
    url: "https://www.safiqtour.com/contact",
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
    canonical: "https://www.safiqtour.com/contact",
  },
  other: {
    "application/ld+json": JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Safiq Tour",
      url: "https://www.safiqtour.com",
      logo: "https://www.safiqtour.com/images/logo-safiq.png",
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+62-822-1162-4747",
        contactType: "customer service",
        availableLanguage: ["Indonesian", "English"],
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: "Perumahan Cimareme Indah Blok A5 No.01",
        addressLocality: "Bandung Barat",
        addressRegion: "Jawa Barat",
        postalCode: "40552",
        addressCountry: "ID",
      },
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
