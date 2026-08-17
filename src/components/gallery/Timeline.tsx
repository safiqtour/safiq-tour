"use client"

import { motion } from "framer-motion"
import { Image as ImageIcon, Video, ChevronRight } from "lucide-react"
import Link from "next/link"

const months = [
  { month: "Januari", photos: 45, videos: 3, year: "2026" },
  { month: "Februari", photos: 38, videos: 2, year: "2026" },
  { month: "Maret", photos: 52, videos: 4, year: "2026" },
  { month: "April", photos: 30, videos: 1, year: "2026" },
]

export function Timeline() {
  return (
    <section className="py-16 md:py-20 bg-[#F8F6F2]">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10"
        >
          <h2 className="font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">Timeline Perjalanan</h2>
          <p className="mt-2 text-base text-[#1F2937]/60">Jelajahi momen perjalanan umroh berdasarkan bulan keberangkatan.</p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/30 to-transparent hidden md:block" />

          <div className="space-y-6">
            {months.map((item, i) => (
              <motion.div
                key={item.month}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="relative pl-0 md:pl-16"
              >
                <div className="absolute left-4 top-8 hidden md:flex size-4 items-center justify-center">
                  <div className="size-4 rounded-full border-2 border-[#D4AF37] bg-white" />
                </div>

                <div className="group rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">{item.year}</span>
                      <h3 className="mt-0.5 font-heading text-xl font-bold text-[#0F2343]">{item.month}</h3>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-[#1F2937]/60">
                      <span className="inline-flex items-center gap-1"><ImageIcon className="size-4" />{item.photos}</span>
                      <span className="inline-flex items-center gap-1"><Video className="size-4" />{item.videos}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
                    <Link
                      href="#gallery"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF37] transition-colors hover:text-[#C49A2E]"
                    >
                      View Album
                      <ChevronRight className="size-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
