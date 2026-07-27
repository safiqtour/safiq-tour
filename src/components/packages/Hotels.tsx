"use client"

import { motion } from "framer-motion"
import { Star, MapPin, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { HotelInfo } from "@/data/packages-detail"

type HotelsProps = {
  hotels: HotelInfo[]
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
          <p className="mt-3 text-base text-[#1E293B]/60 md:text-lg">
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
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={hotel.image}
                  alt={`Hotel ${hotel.name} di ${hotel.city}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5C]/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="rounded-lg bg-[#D4AF37]/90 px-3 py-1 text-xs font-bold text-[#0B2D5C]">
                    {hotel.city}
                  </span>
                </div>
              </div>

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
