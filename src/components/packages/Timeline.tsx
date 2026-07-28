"use client"

import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import type { DayItinerary } from "@/data/packages-detail"

type TimelineProps = {
  days: DayItinerary[]
  durationLabel: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function Timeline({ days, durationLabel }: TimelineProps) {
  return (
    <section className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Itinerary
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Rencana Perjalanan
          </h2>
          <p className="mt-3 text-center text-base text-[#1E293B]/60 md:text-lg">
            Perjalanan ibadah {durationLabel.toLowerCase()} yang penuh keberkahan
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative mx-auto max-w-3xl"
        >
          <div className="absolute left-[23px] top-0 h-full w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/50 to-transparent" />

          {days.map((item) => (
            <motion.div
              key={item.day}
              variants={itemVariants}
              className="group relative mb-8 pl-14 last:mb-0"
            >
              <div className="absolute left-[14px] top-1 flex size-5 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-white transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:shadow-md group-hover:shadow-[#D4AF37]/30">
                <div className="size-1.5 rounded-full bg-[#D4AF37] transition-all duration-300 group-hover:bg-white" />
              </div>

              <div className="rounded-2xl border border-[#0B2D5C]/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/20 hover:shadow-md md:p-6">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center rounded-lg bg-[#D4AF37]/10 px-2.5 py-0.5 text-xs font-bold text-[#D4AF37]">
                    Hari {item.day}
                  </span>
                  <MapPin className="size-3.5 text-[#D4AF37]/60" />
                </div>
                <h3 className="text-base font-bold text-[#0B2D5C] md:text-lg">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#1E293B]/60">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
