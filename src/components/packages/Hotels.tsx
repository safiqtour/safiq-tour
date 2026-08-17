"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, MapPin, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import type { HotelInfo } from "@/data/packages-detail"

type HotelsProps = {
  hotels: HotelInfo[]
}

/** Mosque name based on the hotel city. */
function mosqueName(city: string): string {
  return city.toLowerCase().includes("madin") ? "Masjid Nabawi" : "Masjidil Haram"
}

/** Display name for the hotel-city eyebrow heading ("Mekkah" → "Makkah"). */
function cityDisplayName(city: string): string {
  const c = city.toLowerCase()
  if (c.includes("mekkah") || c.includes("makkah")) return "Makkah"
  if (c.includes("madin")) return "Madinah"
  return city
}

/** Kaaba / mosque emoji for the hotel-city label. */
function cityEmoji(city: string): string {
  return city.toLowerCase().includes("madin") ? "🕌" : "🕋"
}

/** Display order: Makkah hotel first, Madinah second, anything else last. */
function cityRank(city: string): number {
  const c = city.toLowerCase()
  if (c.includes("mekkah") || c.includes("makkah")) return 0
  if (c.includes("madin")) return 1
  return 2
}

/** Normalize master-data distances: "50m" → "50 Meter", "1.2km" → "1.2 Km". */
function formatDistance(distance: string): string {
  const v = distance.trim()
  const meters = v.match(/^(\d+(?:[.,]\d+)?)\s*m$/i)
  if (meters) return `${meters[1]} Meter`
  const km = v.match(/^(\d+(?:[.,]\d+)?)\s*km$/i)
  if (km) return `${km[1]} Km`
  return v
}

function HotelCarousel({ hotel }: { hotel: HotelInfo }) {
  const [current, setCurrent] = useState(0)

  if (hotel.images.length === 1) {
    return (
      <div className="relative aspect-[16/9] overflow-hidden">
        <Image
          src={hotel.images[0]}
          alt={`Hotel ${hotel.name} di ${hotel.city}`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5C]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-4 left-4 z-10">
          <span className="rounded-lg bg-[#D4AF37]/90 px-3 py-1 text-xs font-bold text-[#0B2D5C]">
            {hotel.city}
          </span>
        </div>
      </div>
    )
  }

  const prev = () => setCurrent((c) => (c === 0 ? hotel.images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === hotel.images.length - 1 ? 0 : c + 1))

  return (
    <div className="relative aspect-[16/9] overflow-hidden">
      {hotel.images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-500 ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={src}
            alt={`Hotel ${hotel.name} di ${hotel.city} - ${i + 1}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5C]/60 via-transparent to-transparent pointer-events-none" />
      <button
        onClick={(e) => { e.preventDefault(); prev() }}
        className="absolute left-2 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Gambar sebelumnya"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={(e) => { e.preventDefault(); next() }}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 flex size-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition-all hover:bg-white/30"
        aria-label="Gambar berikutnya"
      >
        <ChevronRight className="size-4" />
      </button>
      <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {hotel.images.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.preventDefault(); setCurrent(i) }}
            className={`size-1.5 rounded-full transition-all ${i === current ? "w-4 bg-[#D4AF37]" : "bg-white/50"}`}
            aria-label={`Gambar ${i + 1}`}
          />
        ))}
      </div>
      <div className="absolute bottom-4 left-4 z-10">
        <span className="rounded-lg bg-[#D4AF37]/90 px-3 py-1 text-xs font-bold text-[#0B2D5C]">
          {hotel.city}
        </span>
      </div>
    </div>
  )
}

export function Hotels({ hotels }: HotelsProps) {
  // Makkah first, Madinah second (display-only ordering; data untouched).
  const sortedHotels = [...hotels].sort((a, b) => cityRank(a.city) - cityRank(b.city))
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Akomodasi
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Hotel Pilihan
          </h2>
          <p className="mt-3 text-center text-base text-[#1E293B]/60 md:text-lg">
            Hotel nyaman dengan lokasi strategis untuk jamaah Safiq Tour
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {sortedHotels.map((hotel, i) => (
            <motion.div
              key={hotel.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="group overflow-hidden rounded-2xl border border-[#0B2D5C]/8 bg-white shadow-md transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/5"
            >
              <HotelCarousel hotel={hotel} />

              <div className="p-5 md:p-6">
                <p className="mb-1 text-[11px] font-bold tracking-wider text-[#D4AF37]">
                  {cityEmoji(hotel.city)} Hotel {cityDisplayName(hotel.city)}
                </p>

                <h3 className="font-playfair text-lg font-bold text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                  {hotel.name}
                </h3>

                <div className="mt-1.5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < hotel.stars ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#0B2D5C]/20"}`}
                    />
                  ))}
                </div>

                {hotel.distance && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl bg-[#F8FAFC] px-3.5 py-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-[#D4AF37]" />
                    <div>
                      <p className="text-sm font-semibold text-[#0B2D5C]">{formatDistance(hotel.distance)}</p>
                      <p className="text-xs text-[#1E293B]/50">{mosqueName(hotel.city)}</p>
                    </div>
                  </div>
                )}

                {hotel.desc && (
                  <p className="mt-2 text-sm leading-relaxed text-[#1E293B]/60">{hotel.desc}</p>
                )}

                {hotel.mapsUrl && (
                  <div className="mt-4">
                    <a
                      href={hotel.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3.5 py-2 text-xs font-semibold text-[#8a6d1f] transition-colors hover:bg-[#D4AF37]/20"
                    >
                      <MapPin className="size-3.5" />
                      Lihat di Google Maps
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
