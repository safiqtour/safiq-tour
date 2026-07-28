"use client"

import { motion } from "framer-motion"
import { Star, Download, ArrowRight, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/data/packages"
import type { Package } from "@/data/packages"

type HeroProps = {
  pkg: Package
  heroImage: string
  description: string
  hotelStars: number
}

export function Hero({ pkg, heroImage, description, hotelStars }: HeroProps) {
  return (
    <section className="relative z-10 -mt-20 flex min-h-0 md:min-h-[650px] items-start md:items-center overflow-hidden pb-24 md:pb-24">
      <Image
        src={heroImage}
        alt={`Paket Umroh ${pkg.title}`}
        fill
        className="object-cover"
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
              className="font-playfair text-5xl font-bold leading-tight text-white drop-shadow-lg md:text-6xl lg:text-7xl"
              style={{ fontFamily: "var(--font-playfair)" }}
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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="max-w-xl text-base leading-relaxed text-white/80 md:text-lg"
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="relative z-20 mt-8 mb-12 md:mb-0 flex flex-col md:flex-row items-center gap-4"
            >
              <Link
                href="#cta"
                className="group inline-flex w-full md:flex-1 min-h-14 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 text-xs font-semibold text-[#0B2D5C] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25 sm:px-7 sm:text-sm"
              >
                Daftar Sekarang
                <ArrowRight className="size-3.5 sm:size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="#"
                className="group inline-flex w-full md:flex-1 min-h-14 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/10 sm:px-7 sm:text-sm"
              >
                <Download className="size-4 text-[#D4AF37]" />
                Download Brosur
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden justify-self-end md:flex"
          >
            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#D4AF37]/10">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-medium tracking-wider text-white/50 uppercase">
                    Harga Spesial
                  </p>
                  <p className="mt-1 font-playfair text-3xl font-bold text-[#D4AF37]" style={{ fontFamily: "var(--font-playfair)" }}>
                    {formatPrice(pkg.price)}
                  </p>
                  <p className="text-xs text-white/40">/per orang</p>
                </div>

                <div className="h-px bg-white/10" />

                <div className="space-y-3">
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
                  href="#cta"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#0B2D5C] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25"
                >
                  Daftar Sekarang
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
