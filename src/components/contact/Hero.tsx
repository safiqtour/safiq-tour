"use client"

import { ArrowRight, MessageCircle } from "lucide-react"
import { PageHero } from "@/components/shared/PageHero"

export function Hero() {
  return (
    <PageHero
      image="/images/Hero-Nabawi-paket-Safiq-Tour-01.webp"
      alt="Hubungi Safiq Tour"
      minHeightClass="min-h-[80vh]"
      badge="Kontak Kami"
      title={
        <>
          Hubungi <span className="text-[#D4AF37]">Safiq Tour</span>
        </>
      }
      description="Kami siap membantu perjalanan ibadah Anda menuju Baitullah. Silakan hubungi kami untuk konsultasi paket umroh, informasi keberangkatan, maupun pertanyaan lainnya."
      actions={[
        {
          href: "https://wa.me/6282211624747",
          label: "Konsultasi WhatsApp",
          icon: <MessageCircle className="size-4" />,
          iconPosition: "left",
          external: true,
        },
        {
          href: "/packages",
          label: "Lihat Paket Umroh",
          icon: <ArrowRight className="size-4" />,
          variant: "outline",
        },
      ]}
    />
  )
}