import { cn } from "@/lib/utils"
import { LogoItem } from "@/components/shared/logo-item"

const logos = [
  { src: "/images/Saudi-Airlines.png", alt: "Saudi Airlines" },
  { src: "/images/Garuda-Indonesia.png", alt: "Garuda Indonesia" },
  { src: "/images/Lion-Air.png", alt: "Lion Air" },
  { src: "/images/Airasia.png", alt: "Air Asia" },
  { src: "/images/Emirates.png", alt: "Emirates" },
  { src: "/images/Qatar-Airways.png", alt: "Qatar Airways" },
  { src: "/images/Indigo.png", alt: "Indigo" },
  { src: "/images/Scoot.png", alt: "Scoot" },
  { src: "/images/Oman-Air.png", alt: "Oman Air" },
  { src: "/images/Rawahel-Al-Mashaer-co.png", alt: "Rawahel Al Mashaer CO." },
  { src: "/images/Diar-Al-Manasik-International.png", alt: "Diar Al Manasik Internasional" },
  { src: "/images/Maysan.png", alt: "Maysan Al Maqom" },
  { src: "/images/Fly-DBA.png", alt: "Fly DBA" },
  { src: "/images/Ayuberga.png", alt: "AyuBerga" },
  { src: "/images/Haramain-High-Speed.png", alt: "Harmain High Speed Railway" },
  { src: "/images/Logo-Kemenhaj.png", alt: "Kemenhaj" },
  { src: "/images/Logo-Departemen-Agama.png", alt: "Departemen Agama" },
  { src: "/images/Logo-Nusuk.png", alt: "Nusuk" },
  { src: "/images/Logo-Siskopatuh.png", alt: "Siskopatuh" },
  { src: "/images/Logo-Sapuhi.png", alt: "Sapuhi" },
  { src: "/images/Logo-KAN.png", alt: "KAN" },
  { src: "/images/Logo-BSI.png", alt: "BSI" },
  { src: "/images/Logo-DKM-Al-Hidayah.png", alt: "DKM Al-Hidayah" },
  { src: "/images/Logo-Pesantren-Daarul-Karomah.png", alt: "Pesantren Daarul Karomah" },
  { src: "/images/Logo-At-Taslim-Ula.png", alt: "At-Taslim Ula" },
]

function splitIntoRows<T>(items: T[], cols: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols))
  }
  return rows
}

/**
 * Pure CSS marquee row — no JS, no requestAnimationFrame, no layout reads.
 * The track holds two identical halves; animating translateX from 0 to -50%
 * (or the reverse) loops seamlessly. Each half ends with `pr-*` equal to its
 * `gap-*`, so spacing stays uniform across the wrap point too.
 */
function MarqueeRow({ row, reverse }: { row: typeof logos; reverse: boolean }) {
  return (
    <div className="marquee-row relative overflow-x-hidden">
      <div
        className={cn(
          "marquee-track flex w-max items-center will-change-transform",
          reverse ? "logo-track-right" : "logo-track-left"
        )}
      >
        {[0, 1].map((half) => (
          <div
            key={half}
            aria-hidden={half === 1}
            className="flex shrink-0 items-center gap-4 pr-4 sm:gap-14 sm:pr-14 lg:gap-16 lg:pr-16"
          >
            {row.map((logo) => (
              <LogoItem key={logo.src} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function LogoMarquee() {
  const rows = splitIntoRows(logos, Math.ceil(logos.length / 2))

  return (
    <div className="space-y-6 overflow-x-hidden sm:space-y-8">
      {rows.map((row, i) => (
        <MarqueeRow key={i} row={row} reverse={i % 2 !== 0} />
      ))}
    </div>
  )
}
