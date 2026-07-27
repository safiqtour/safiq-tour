"use client"

import { motion } from "framer-motion"
import { Clock, Plane, Building2, Users } from "lucide-react"

type QuickInfoProps = {
  duration: string
  maskapai: string
  hotelLabel: string
}

export function QuickInfo({ duration, maskapai, hotelLabel }: QuickInfoProps) {
  const items = [
    { icon: Clock, label: "Durasi", value: duration, desc: "Perjalanan ibadah optimal" },
    { icon: Plane, label: "Maskapai", value: maskapai, desc: "Penerbangan Premium" },
    { icon: Building2, label: "Hotel", value: hotelLabel, desc: "Dekat Masjidil Haram" },
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
    <section className="relative z-20 -mt-16 pb-12">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {items.map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="group rounded-2xl border border-[#0B2D5C]/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-lg hover:shadow-[#D4AF37]/5"
            >
              <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-[#0B2D5C]/5 text-[#0B2D5C] transition-colors duration-300 group-hover:bg-[#D4AF37]/10 group-hover:text-[#D4AF37]">
                <item.icon className="size-5" />
              </div>
              <p className="text-xs font-medium tracking-wider text-[#0B2D5C]/50 uppercase">
                {item.label}
              </p>
              <p className="mt-0.5 font-playfair text-lg font-bold text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                {item.value}
              </p>
              <p className="mt-0.5 text-xs text-[#0B2D5C]/60">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
