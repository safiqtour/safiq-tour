"use client"

import { motion, type Variants } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1], } },
}

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1], } },
}

export function HeroContent() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative z-10 flex flex-col items-start gap-6 md:max-w-2xl"
    >
      <motion.div
        variants={badgeVariants}
        className="inline-flex items-center gap-2 rounded-full border border-[#C79A3B]/30 bg-[#C79A3B]/10 px-4 py-1.5 text-sm text-[#E8C874] backdrop-blur-sm"
      >
        <span className="size-1.5 rounded-full bg-[#E8C874]" />
        PPIU Resmi Kementerian Agama RI
      </motion.div>

      <motion.h1
        variants={itemVariants}
        className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
      >
        Wujudkan Perjalanan Suci{" "}
        <span className="text-[#E8C874]">Menuju Baitullah</span>
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className="max-w-lg text-base leading-relaxed text-[#D6D6D6] md:text-lg"
      >
        Bersama Safiq Tour, nikmati perjalanan ibadah yang nyaman, aman, dan
        sesuai sunnah dengan pembimbing ibadah berpengalaman serta jadwal
        keberangkatan yang pasti.
      </motion.p>

      <motion.div
        variants={itemVariants}
        className="flex flex-col gap-3 pt-2 sm:flex-row"
      >
        <Link
          href="/packages"
          aria-label="Lihat Paket Umroh"
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[#C79A3B] px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#B8892E] hover:shadow-lg hover:shadow-[#C79A3B]/30 sm:text-base"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          Lihat Paket Umroh
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <Link
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Konsultasi via WhatsApp"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10 hover:shadow-lg sm:text-base"
        >
          <MessageCircle className="size-4" />
          Konsultasi WhatsApp
        </Link>
      </motion.div>
    </motion.div>
  )
}
