"use client"

import { motion } from "framer-motion"
import { ArrowRight, MessageCircle } from "lucide-react"
import Link from "next/link"

export function CTA({ id }: { id?: string }) {
  return (
    <section id={id} className="relative overflow-hidden bg-gradient-to-br from-[#0B2D5C] via-[#0B2D5C] to-[#D4AF37]/20">
      <div className="absolute inset-0 bg-[url('/images/pattern-islamic.svg')] bg-repeat opacity-[0.03]" />
      <div className="absolute top-0 right-0 size-96 translate-x-1/3 -translate-y-1/3 rounded-full bg-[#D4AF37]/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 size-96 -translate-x-1/3 translate-y-1/3 rounded-full bg-[#D4AF37]/5 blur-3xl" />

      <div className="relative mx-auto max-w-(--container-max) px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1 text-xs font-medium tracking-wider text-[#D4AF37] uppercase"
          >
            #SafiqTour
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Siap Menjadi{" "}
            <span className="text-[#D4AF37]">Tamu Allah</span>?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 text-base leading-relaxed text-white/60 md:text-lg"
          >
            Daftarkan diri Anda sekarang dan wujudkan perjalanan ibadah yang nyaman, aman, dan penuh keberkahan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="#"
              className="group inline-flex h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-8 text-sm font-semibold text-[#0B2D5C] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25"
            >
              Daftar Sekarang
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="https://wa.me/6282211624747"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-8 text-sm font-semibold text-white transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/5"
            >
              <MessageCircle className="size-4 text-[#D4AF37]" />
              Konsultasi WhatsApp
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
