"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import type { HighlightItem } from "@/data/packages-detail"

type HighlightsProps = {
  items: HighlightItem[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function Highlights({ items }: HighlightsProps) {
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
            Keunggulan Paket
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Kenapa Memilih Paket Ini?
          </h2>
          <p className="mt-3 text-center text-base text-[#1E293B]/60 md:text-lg">
            Nikmati pengalaman ibadah yang nyaman dengan fasilitas lengkap dan pelayanan terbaik
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.title}
              variants={itemVariants}
              className="group rounded-2xl border border-[#0B2D5C]/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/20 hover:shadow-md hover:shadow-[#D4AF37]/5"
            >
              <div className="mb-3 flex items-center gap-3">
                <CheckCircle2 className="size-5 text-[#D4AF37] transition-all duration-300 group-hover:scale-110" />
                <h3 className="text-sm font-bold text-[#0B2D5C] md:text-base">{item.title}</h3>
              </div>
              <p className="text-xs leading-relaxed text-[#1E293B]/50 md:text-sm">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
