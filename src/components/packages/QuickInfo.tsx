"use client"

import { motion } from "framer-motion"
import { Clock, Plane, Building2, Users, MapPin } from "lucide-react"
import type { HotelInfo } from "@/data/packages-detail"

type QuickInfoItem = {
  icon: typeof Clock
  label: string
  value: string
  desc: string
}

type QuickInfoProps = {
  duration: string
  maskapai: string
  hotels: HotelInfo[]
}

/** Display name for a hotel city ("Mekkah" → "Makkah", others kept as-is). */
function cityDisplayName(city: string): string {
  const c = city.toLowerCase()
  if (c.includes("mekkah") || c.includes("makkah")) return "Makkah"
  if (c.includes("madin")) return "Madinah"
  return city
}

export function QuickInfo({ duration, maskapai, hotels }: QuickInfoProps) {
  const items: QuickInfoItem[] = [
    { icon: Clock, label: "Durasi", value: duration, desc: "Perjalanan ibadah optimal" },
    { icon: Plane, label: "Maskapai", value: maskapai, desc: "Penerbangan Premium" },
    { icon: Users, label: "Pembimbing", value: "Berpengalaman", desc: "Ijazah & Sertifikasi" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  }

  return (
    <section className="relative z-10 -mt-16 pb-12">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="group rounded-3xl border border-[#0B2D5C]/10 bg-white p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5"
            >
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#0B2D5C]/5 text-[#0B2D5C] transition-colors duration-300 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37]">
                <item.icon className="size-5" />
              </div>
              <p className="text-xs font-medium tracking-wider text-[#0B2D5C]/50 uppercase">
                {item.label}
              </p>
              <p className="mt-0.5 line-clamp-2 font-playfair text-lg font-bold break-words text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                {item.value}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs break-words text-[#0B2D5C]/60">{item.desc}</p>
            </motion.div>
          ))}

          {/* Hotel card — daftar hotel dari data aktual */}
          <motion.div
            variants={itemVariants}
            className="group rounded-3xl border border-[#0B2D5C]/10 bg-white p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5"
          >
            <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#0B2D5C]/5 text-[#0B2D5C] transition-colors duration-300 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37]">
              <Building2 className="size-5" />
            </div>
            <p className="text-xs font-medium tracking-wider text-[#0B2D5C]/50 uppercase">
              Hotel
            </p>

            {hotels.length > 0 ? (
              <div className="mt-2 space-y-2">
                {hotels.map((hotel, i) => (
                  <div key={i}>
                    {i > 0 && <div className="my-1.5 border-t border-[#0B2D5C]/8" />}
                    <div className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-3.5 shrink-0 text-[#D4AF37]" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-semibold tracking-wider text-[#0B2D5C]/60 uppercase">
                          {cityDisplayName(hotel.city)}
                        </p>
                        <p className={`mt-px line-clamp-2 break-words text-[#0B2D5C] ${hotels.length > 2 ? "text-xs font-semibold" : "text-sm font-bold"}`}>
                          {hotel.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="mt-0.5 font-playfair text-lg font-bold text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                  Info Hotel
                </p>
                <p className="mt-0.5 text-xs text-[#0B2D5C]/60">Akomodasi tersedia</p>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
