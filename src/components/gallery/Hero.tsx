"use client"

import { ArrowRight, Image as ImageIcon } from "lucide-react"
import { PageHero } from "@/components/shared/PageHero"

export function Hero() {
  return (
    <PageHero
      image="/images/Hero-Nabawi-paket-Safiq-Tour-01.webp"
      alt="Galeri Safiq Tour"
      badge={
        <>
          <ImageIcon className="size-3.5 mr-1.5" />
          Galeri
        </>
      }
      title={
        <>
          Galeri Perjalanan Umroh{" "}
          <span className="text-[#D4AF37]">Safiq Tour</span>
        </>
      }
      description="Abadikan setiap momen perjalanan ibadah menuju Baitullah bersama jamaah Safiq Tour. Dari keberangkatan hingga kepulangan, setiap langkah penuh makna dan keberkahan."
      actions={[
        {
          href: "#gallery",
          label: "Lihat Dokumentasi",
          icon: <ArrowRight className="size-4" />,
        },
        {
          href: "/contact",
          label: "Hubungi Kami",
          variant: "outline",
        },
      ]}
      showScrollIndicator
    />
  )
}