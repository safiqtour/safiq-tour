"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Star, MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HotelInfo } from "@/data/packages-detail"

type HotelsProps = {
  hotels: HotelInfo[]
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
            Kenyamanan ibadah dengan hotel terbaik dan lokasi strategis
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {hotels.map((hotel, i) => (
            <motion.div
              key={hotel.city}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="group overflow-hidden rounded-2xl border border-[#0B2D5C]/8 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/20 hover:shadow-xl hover:shadow-[#D4AF37]/5"
            >
              <HotelCarousel hotel={hotel} />

              <div className="p-5 md:p-6">
                <div className="mb-2 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-3.5 ${i < hotel.stars ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#0B2D5C]/20"}`}
                    />
                  ))}
                </div>

                <h3 className="font-playfair text-lg font-bold text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                  {hotel.name}
                </h3>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-[#1E293B]/50">
                  <MapPin className="size-3.5 text-[#D4AF37]" />
                  <span>{hotel.distance} dari Masjid</span>
                </div>

                <p className="mt-2 text-sm leading-relaxed text-[#1E293B]/60">{hotel.desc}</p>

                <div className="mt-4">
                  <Link
                    href="#"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4AF37] transition-colors hover:text-[#C49A2E]"
                  >
                    Lihat Detail
                    <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
