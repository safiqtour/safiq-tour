"use client"

import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn, normalizeImageUrl } from "@/lib/utils"
import type { Package } from "@/data/packages"

type PackageCardProps = {
  pkg: Package
  className?: string
}

/* Map a maskapai token to its brand logo in /public/images (display-only).
   Tokens that aren't recognized fall back to the generic airline logo. */
const AIRLINE_LOGO: Record<string, string> = {
  qatar: "/images/Qatar-Airways.png",
  emirates: "/images/Emirates.png",
  saudia: "/images/Saudi-Airlines.png",
  saudi: "/images/Saudi-Airlines.png",
  garuda: "/images/Garuda-Indonesia.png",
  turkish: "/images/Turkish-Airlines.png",
  etihad: "/images/Etihad.png",
  lion: "/images/Lion-Air.png",
  airasia: "/images/Airasia.png",
  scoot: "/images/Scoot.png",
  indigo: "/images/Indigo.png",
  oman: "/images/Oman-Air.png",
  dba: "/images/Fly-DBA.png",
}

const FALLBACK_AIRLINE_LOGO = "/images/Saudi-Airlines.png"
const HARAMAIN_LOGO = "/images/Haramain-High-Speed.png"

/** Resolve up to 2 brand logos from a maskapai string like "Qatar, Emirates". */
function airlineLogos(maskapai: string): string[] {
  const tokens = maskapai.split(/[\s,/]+/).map((t) => t.toLowerCase()).filter(Boolean)
  const logos: string[] = []
  const seen = new Set<string>()
  for (const token of tokens) {
    const logo = AIRLINE_LOGO[token]
    if (logo && !seen.has(logo)) {
      seen.add(logo)
      logos.push(logo)
    }
    if (logos.length >= 2) break
  }
  return logos.length ? logos : [FALLBACK_AIRLINE_LOGO]
}

/** True when the package includes Haramain Express (high-speed train) transport. */
function hasHaramainExpress(pkg: Package): boolean {
  return pkg.features.some((f) => /kereta|haramain|train/i.test(f))
}

/** First number in a duration string: "14 Hari" -> "14". Null when none present. */
function durationNumber(value: string): string | null {
  const m = value.match(/\d+/)
  return m ? m[0] : null
}

/**
 * Human-friendly departure schedule.
 * - Full date "2026-11-15"  -> "15 November 2026"
 * - Year-month "2026-11"    -> "November 2026"
 * - Empty / invalid         -> null (section hidden)
 */
function formatScheduleLabel(value?: string | null): string | null {
  if (!value || !value.trim()) return null
  const s = value.trim()

  const ym = s.match(/^(\d{4})-(\d{1,2})$/)
  if (ym) {
    const d = new Date(Date.UTC(Number(ym[1]), Number(ym[2]) - 1, 1))
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "UTC" })
  }

  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

/** Compact premium price in "juta": 27900000 -> "Rp 27,9 Juta", 35000000 -> "Rp 35 Juta". */
function formatPriceJuta(price: number): string {
  const juta = price / 1_000_000
  const formatted = juta.toLocaleString("id-ID", {
    minimumFractionDigits: Number.isInteger(juta) ? 0 : 1,
    maximumFractionDigits: 1,
  })
  return `Rp ${formatted} Juta`
}

function PackageCard({ pkg, className }: PackageCardProps) {
  const logos = airlineLogos(pkg.maskapai)
  const hasHaramain = hasHaramainExpress(pkg)
  // Transport logos only: airlines first, then Haramain Express (if present).
  const transportLogos = hasHaramain ? [...logos, HARAMAIN_LOGO] : logos
  const scheduleLabel = formatScheduleLabel(pkg.departureDate)
  const durNum = durationNumber(pkg.duration)

  return (
    <div
      className={cn(
        "group relative flex flex-1 flex-col overflow-hidden rounded-[32px] border border-white/20 bg-white/70 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10",
        pkg.featured && "ring-2 ring-[#D4AF37] ring-offset-2",
        className
      )}
    >
      {/* 1. IMAGE PACKAGE — full width, object-cover, consistent aspect */}
      {pkg.image && (
        <div className="relative w-full shrink-0 overflow-hidden">
          <Image
            src={normalizeImageUrl(pkg.image)}
            alt={pkg.title}
            width={800}
            height={500}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        {/* 2. HEADER — name + duration */}
        <div className="space-y-2">
          <h3
            className="line-clamp-2 break-words font-heading text-xl font-bold leading-tight text-[#0F2D5C]"
            title={pkg.title}
          >
            {pkg.title}
          </h3>
          <p className="flex items-baseline gap-1.5 text-[#0F2D5C]">
            {durNum ? (
              <>
                <span className="text-2xl font-bold leading-none">{durNum}</span>
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">Hari</span>
              </>
            ) : (
              <span className="text-sm font-semibold">{pkg.duration}</span>
            )}
          </p>
        </div>

        {/* 3. TRANSPORTASI — transparent logos only, "|" separator */}
        {transportLogos.length > 0 && (
          <div className="flex items-center gap-2.5">
            {transportLogos.map((src, i) => (
              <Fragment key={`${src}-${i}`}>
                {i > 0 && <span aria-hidden="true" className="h-5 w-px shrink-0 bg-black/20" />}
                <Image
                  src={src}
                  alt={src === HARAMAIN_LOGO ? "Haramain Express" : pkg.maskapai}
                  width={72}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </Fragment>
            ))}
          </div>
        )}

        {/* 4. JADWAL KEBERANGKATAN — only when a schedule exists */}
        {scheduleLabel && (
          <div className="space-y-1 border-t border-black/10 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Jadwal Keberangkatan
            </p>
            <p className="flex items-center gap-2 text-sm font-semibold text-[#0F2D5C]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4 shrink-0 text-[#D4AF37]"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
              </svg>
              {scheduleLabel}
            </p>
          </div>
        )}

        {/* 5. HOTEL — vertical, simple */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Hotel</p>
          <div className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 size-4 shrink-0 text-[#D4AF37]"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
            </svg>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Hotel Mekkah</p>
              <p className="text-sm font-semibold text-[#0F2D5C]">{pkg.hotelMekah}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 size-4 shrink-0 text-[#D4AF37]"
            >
              <rect x="4" y="2" width="16" height="20" rx="2" />
              <path d="M9 22v-4h6v4" />
              <path d="M8 6h.01" />
              <path d="M16 6h.01" />
              <path d="M12 6h.01" />
            </svg>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground">Hotel Madinah</p>
              <p className="text-sm font-semibold text-[#0F2D5C]">{pkg.hotelMadinah}</p>
            </div>
          </div>
        </div>

        {/* 6. HARGA + BUTTON — one merged bottom area, height consistent via mt-auto */}
        <div className="mt-auto flex items-stretch justify-between gap-3 border-t border-black/10 pt-3">
          <div className="flex min-w-0 flex-col justify-center">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37]">
              {pkg.priceLabel || "Harga Mulai"}
            </p>
            <p className="text-xl font-bold tracking-tight text-[#0F2D5C]">{formatPriceJuta(pkg.price)}</p>
          </div>
          <Link
            href={`/packages/${pkg.slug}`}
            className="inline-flex h-[54px] shrink-0 items-center justify-center rounded-xl bg-[#0F2D5C] px-5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1a3d7a] active:scale-[0.98]"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  )
}

export { PackageCard }