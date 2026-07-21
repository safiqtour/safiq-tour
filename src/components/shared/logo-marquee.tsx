"use client"

import { useEffect, useRef } from "react"
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
]

function splitIntoRows<T>(items: T[], cols: number): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += cols) {
    rows.push(items.slice(i, i + cols))
  }
  return rows
}

function MarqueeRow({ logos: row, reverse }: { logos: typeof logos; reverse: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    let x = 0
    let initialized = false

    function animate() {
      const el = trackRef.current
      if (!el) return
      if (!pausedRef.current) {
        const speed = window.innerWidth < 768 ? 0.5 : 0.4
        const trackWidth = el.scrollWidth / 2

        if (!initialized) {
          if (reverse) x = -trackWidth
          initialized = true
        }

        x += reverse ? speed : -speed
        if (reverse ? x >= 0 : Math.abs(x) >= trackWidth) {
          x += reverse ? -trackWidth : trackWidth
        }
        el.style.transform = `translateX(${x}px)`
      }
      requestAnimationFrame(animate)
    }

    const frame = requestAnimationFrame(animate)

    const el = trackRef.current
    if (!el) return

    const onEnter = () => { pausedRef.current = true }
    const onLeave = () => { pausedRef.current = false }
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    el.addEventListener("touchstart", onEnter, { passive: true })
    el.addEventListener("touchend", onLeave, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      el.removeEventListener("touchstart", onEnter)
      el.removeEventListener("touchend", onLeave)
    }
  }, [reverse])

  return (
    <div className="relative flex overflow-x-hidden">
      <div
        ref={trackRef}
        className="flex will-change-transform"
      >
        <div className="flex shrink-0 items-center px-2 sm:px-4">
          {row.map((logo, idx) => (
            <div key={idx} className="flex shrink-0 items-center justify-center px-3 sm:px-4">
              <LogoItem src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
        <div className="flex shrink-0 items-center px-2 sm:px-4">
          {row.map((logo, idx) => (
            <div key={`dup-${idx}`} className="flex shrink-0 items-center justify-center px-3 sm:px-4">
              <LogoItem src={logo.src} alt={logo.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LogoMarquee() {
  const rows = splitIntoRows(logos, Math.ceil(logos.length / 2))

  return (
    <div className="space-y-8 overflow-hidden">
      {rows.map((row, i) => (
        <MarqueeRow key={i} logos={row} reverse={i % 2 !== 0} />
      ))}
    </div>
  )
}
