"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative -mt-20 flex min-h-[80vh] items-center overflow-hidden">
      <Image
        src="/images/Hero-Nabawi-paket-Safiq-Tour-01.webp"
        alt="Hubungi Safiq Tour"
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F2343]/90 via-[#0F2343]/60 to-[#0F2343]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2343]/60 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(15,35,67,0.6)" }} />

      <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col gap-6 max-w-3xl"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex w-fit rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase"
          >
            Kontak Kami
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl"
          >
            Hubungi <span className="text-[#D4AF37]">Safiq Tour</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="max-w-xl text-left text-base leading-relaxed text-white/80 md:text-lg"
          >
            Kami siap membantu perjalanan ibadah Anda menuju Baitullah.
            Silakan hubungi kami untuk konsultasi paket umroh, informasi keberangkatan, maupun pertanyaan lainnya.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-col items-start gap-4 sm:flex-row"
          >
            <Link
              href="https://wa.me/6282211624747"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-8 text-sm font-semibold text-[#0F2343] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25"
            >
              <MessageCircle className="size-4" />
              Konsultasi WhatsApp
            </Link>

            <Link
              href="/packages"
              className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-8 text-sm font-semibold text-white transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/5"
            >
              Lihat Paket Umroh
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
