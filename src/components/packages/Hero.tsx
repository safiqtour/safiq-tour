"use client"

import { motion } from "framer-motion"
import { Star, Download, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/data/packages"
import type { Package } from "@/data/packages"
import { normalizeImageUrl } from "@/lib/utils"
import { buildWhatsAppUrl, buildPackageConsultationMessage } from "@/lib/whatsapp"

// Formatting tags allowed in TipTap-produced HTML descriptions. Every other
// tag — and ALL attributes — is stripped, following the project's hand-rolled
// sanitization pattern (see blog/article-content.tsx); no sanitization
// library is installed in this project.
const ALLOWED_DESCRIPTION_TAGS = new Set(["p", "strong", "b", "em", "i", "u", "ul", "ol", "li", "br"])

/** Whitelist-sanitize rich-text HTML: keep formatting tags only, strip the rest. */
function sanitizeDescriptionHtml(html: string): string {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\s*\1\s*>/gi, "")
    .replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (_match, closing: string, tag: string) => {
      const t = tag.toLowerCase()
      if (!ALLOWED_DESCRIPTION_TAGS.has(t)) return ""
      return t === "br" ? "<br />" : `<${closing ? "/" : ""}${t}>`
    })
}

type HeroProps = {
  pkg: Package
  heroImage: string
  description: string
  hotelStars: number
  whatsappNumber: string
}

export function Hero({ pkg, heroImage, description, hotelStars, whatsappNumber }: HeroProps) {
  // TipTap saves the description as HTML; plain-text (legacy) descriptions
  // keep the original <p> rendering below.
  const descriptionHasHtml = /<[a-z][\s\S]*?>/i.test(description)
  // Optional room-based pricing — only non-empty (> 0) values are displayed;
  // null/undefined/0 are hidden entirely.
  const roomPrices = [
    { label: "Quad", desc: "4 orang", value: pkg.quadPrice },
    { label: "Triple", desc: "3 orang", value: pkg.triplePrice },
    { label: "Double", desc: "2 orang", value: pkg.doublePrice },
  ].filter((r): r is { label: string; desc: string; value: number } => typeof r.value === "number" && r.value > 0)
  const hasRoomPrices = roomPrices.length > 0
  const consultationUrl = buildWhatsAppUrl(whatsappNumber, buildPackageConsultationMessage(pkg.title))
  const brochureUrl = `/api/packages/${pkg.slug}/brochure`
  const registerUrl = `/daftar/${pkg.slug}`
  return (
    <section className="relative z-10 -mt-20 flex min-h-0 md:min-h-[650px] items-start md:items-center overflow-hidden pb-24 md:pb-24 bg-[#0B2D5C]">
      <Image
        src={normalizeImageUrl(heroImage)}
        alt={`Paket Umroh ${pkg.title}`}
        fill
        className="object-contain object-top md:object-cover md:object-center"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2D5C]/90 via-[#0B2D5C]/60 to-[#0B2D5C]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5C]/60 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(11,45,92,0.6)" }} />

      <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8 pt-20">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase w-fit"
            >
              <Shield className="size-3.5" />
              PAKET UMROH
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="line-clamp-2 break-words font-heading text-2xl font-bold leading-tight text-white drop-shadow-lg md:text-3xl lg:text-4xl"
            >
              {pkg.title.replace(/ \d+ Hari$/, "")}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm w-fit"
            >
              <div className="flex items-center gap-1.5 text-sm text-white/90">
                <span className="flex size-2 rounded-full bg-[#D4AF37]" />
                {pkg.duration} Perjalanan Ibadah
              </div>
            </motion.div>

            {descriptionHasHtml ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg [&_p]:mb-3 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_strong]:text-white [&_b]:font-semibold [&_b]:text-white [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5"
                dangerouslySetInnerHTML={{ __html: sanitizeDescriptionHtml(description) }}
              />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
              >
                {description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative z-20 mt-8 mb-12 md:mb-0 flex flex-col md:flex-row items-center gap-4"
            >
              <a
                href={consultationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full md:flex-1 min-h-14 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-xs font-semibold text-[#0B2D5C] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25 sm:px-7 sm:text-sm"
              >
                Konsultasi Sekarang
                <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>

              <a
                href={brochureUrl}
                className="group inline-flex w-full md:flex-1 min-h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/10 sm:px-7 sm:text-sm"
              >
                <Download className="size-4 text-[#D4AF37]" />
                Download Brosur
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex justify-self-center md:justify-self-end mx-1 md:mx-0"
          >
            <div className="w-full md:max-w-sm lg:max-w-md rounded-[28px] md:rounded-3xl border border-white/15 bg-white/8 p-6 backdrop-blur-md shadow-2xl shadow-black/15 transition-all duration-500 md:hover:-translate-y-2 md:hover:shadow-2xl md:hover:shadow-[#D4AF37]/10">
              <div className="flex flex-col">
                <div className="mb-4 lg:mb-6">
                  <p className="text-[11px] font-medium tracking-wider text-white/50 uppercase">
                    {hasRoomPrices ? "Harga Mulai Dari" : "Harga Spesial"}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
                    <p className="font-playfair text-4xl font-bold leading-none text-[#D4AF37]" style={{ fontFamily: "var(--font-playfair)" }}>
                      {formatPrice(pkg.price)}
                    </p>
                    <span className="text-xs text-white/40">/ per orang</span>
                  </div>
                </div>

                {hasRoomPrices && (
                  <div className="mb-4 lg:mb-6">
                    <p className="mb-2.5 text-[11px] font-medium tracking-wider text-white/50 uppercase lg:mb-3">
                      Pilihan Kamar
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:gap-3">
                      {roomPrices.map((r) => (
                        <div
                          key={r.label}
                          className="flex h-full flex-col items-center justify-center rounded-xl border border-[#D4AF37]/30 bg-gradient-to-b from-white/10 to-white/5 px-2 py-3 text-center backdrop-blur-sm transition-colors duration-300 hover:border-[#D4AF37]/60 lg:px-3 lg:py-4"
                        >
                          <p className="text-[11px] font-bold tracking-widest text-[#D4AF37] uppercase lg:text-xs">
                            {r.label}
                          </p>
                          <p className="mt-0.5 text-[10px] text-white/50 lg:text-[11px]">{r.desc}</p>
                          <p className="mt-1.5 text-base font-bold leading-snug text-white md:text-[13px] lg:text-sm">
                            {formatPrice(r.value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="h-px bg-white/10" />

                <div className="flex flex-col gap-3 py-3 lg:py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Durasi</span>
                    <span className="text-sm font-semibold text-white">{pkg.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Maskapai</span>
                    <span className="text-sm font-semibold text-white">{pkg.maskapai}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Hotel</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < hotelStars ? "fill-[#D4AF37] text-[#D4AF37]" : "text-white/20"}`} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Pembimbing</span>
                    <span className="text-sm font-semibold text-white">Berpengalaman</span>
                  </div>
                </div>

                <Link
                  href={registerUrl}
                  className="mt-4 flex h-12 md:h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#0B2D5C] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25"
                >
                  Daftar Umroh
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
