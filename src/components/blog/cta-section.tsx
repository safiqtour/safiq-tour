"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Phone } from "lucide-react"

export function CtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl bg-[#0B3C6D] p-8 md:p-12 shadow-xl"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-heading text-2xl font-bold text-white md:text-3xl">
          Siap Berangkat Menuju Baitullah?
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/70 md:text-base">
          Percayakan perjalanan ibadah Anda bersama Safiq Tour dengan pelayanan terbaik dan pembimbing berpengalaman.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/packages"
            className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#C89B3C] px-8 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:bg-[#B88A2E] hover:shadow-xl"
          >
            Lihat Paket Umroh
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-[#C89B3C]/50 hover:bg-white/20"
          >
            <Phone className="size-4" />
            Hubungi Kami
          </Link>
        </div>
      </div>
    </motion.section>
  )
}
