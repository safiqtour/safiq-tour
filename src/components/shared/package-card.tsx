"use client"

import { Fragment } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"
import { cn, normalizeImageUrl } from "@/lib/utils"
import { formatDepartureLabel } from "@/lib/packages/utils"
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
  const scheduleLabel = formatDepartureLabel(pkg.departureDate)
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
        {/* 2. HEADER — name */}
        <div className="space-y-2">
          <h3
            className="line-clamp-2 break-words font-heading text-xl font-bold leading-tight text-[#0F2D5C]"
            title={pkg.title}
          >
            {pkg.title}
          </h3>
        </div>

        {/* 3. DURASI + TRANSPORT — one row: duration | transport logos */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-baseline gap-1.5 text-[#0F2D5C]">
            {durNum ? (
              <>
                <span className="text-3xl font-bold leading-none">{durNum}</span>
                <span className="text-sm font-semibold uppercase tracking-[0.15em]">Hari</span>
              </>
            ) : (
              <span className="text-sm font-semibold">{pkg.duration}</span>
            )}
          </div>

          {transportLogos.map((src, i) => (
            <Fragment key={`${src}-${i}`}>
              <span aria-hidden="true" className="h-9 w-px shrink-0 bg-black/20 sm:h-10" />
              <Image
                src={src}
                alt={src === HARAMAIN_LOGO ? "Haramain Express" : pkg.maskapai}
                width={72}
                height={28}
                className="h-9 w-auto object-contain sm:h-11"
              />
            </Fragment>
          ))}
        </div>

        {/* 4. JADWAL KEBERANGKATAN — only when a schedule exists */}
        {scheduleLabel && (
          <div className="space-y-1 border-t border-black/10 pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Jadwal Keberangkatan
            </p>
            <p className="flex items-center gap-2 text-sm font-semibold text-[#0F2D5C]">
              <Calendar className="size-4 shrink-0 text-[#D4AF37]" />
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
            <span className="sr-only">: {pkg.title}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export { PackageCard }