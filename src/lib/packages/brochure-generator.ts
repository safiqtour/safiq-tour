import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { formatPrice } from "@/data/packages"
import type { PublicPackage } from "@/modules/public/packages"
import { BrochureDocument } from "./brochure-document"

export interface BrochureViewData {
  title: string
  duration: string
  priceLabel: string
  airline: string
  hotelMekah: string
  hotelMadinah: string
  highlights: string[]
  included: string[]
  contact: { whatsappDisplay: string }
}

/** "6281234567890" -> "+62 812 3456 7890" for a readable PDF footer. */
function displayNumber(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "")
  if (!digits.startsWith("62")) return `+${digits}`
  const rest = digits.slice(2)
  const parts = rest.match(/.{1,4}/g) ?? [rest]
  return `+62 ${parts.join(" ")}`
}

/**
 * Generate an on-demand package brochure PDF from the public payload. Nothing is
 * persisted — the document is rendered fresh on every request from the package's
 * existing public content (title, duration, price, airline, hotels, highlights,
 * included facilities) plus the configured WhatsApp contact.
 */
export async function generatePackageBrochurePdf(
  pub: PublicPackage,
  whatsapp: string,
): Promise<Buffer> {
  const { card, detail } = pub
  const view: BrochureViewData = {
    title: card.title,
    duration: card.duration,
    priceLabel: card.price > 0 ? `${formatPrice(card.price)} / orang` : "Hubungi kami",
    airline: card.maskapai || "Maskapai Mitra",
    hotelMekah: card.hotelMekah || "-",
    hotelMadinah: card.hotelMadinah || "-",
    highlights: (detail?.highlights ?? []).map((h) => h.title).filter(Boolean),
    included: detail?.included ?? [],
    contact: { whatsappDisplay: displayNumber(whatsapp) },
  }

  const element = React.createElement(BrochureDocument, { data: view }) as unknown as Parameters<
    typeof renderToBuffer
  >[0]
  return renderToBuffer(element)
}
