"use client"

import { motion } from "framer-motion"
import { Plane, Luggage, Clock, ArmchairIcon } from "lucide-react"
import Image from "next/image"
import type { AirlineInfo } from "@/data/packages-detail"

type AirlinesProps = {
  airlines: AirlineInfo[]
}

const infoItems = [
  { icon: Luggage, label: "Bagasi", key: "baggage" as const },
  { icon: Clock, label: "Transit", key: "transit" as const },
  { icon: ArmchairIcon, label: "Estimasi", key: "estimasi" as const },
  { icon: Plane, label: "Pesawat", key: "pesawat" as const },
]

export function Airlines({ airlines }: AirlinesProps) {
  return (
    <section className="overflow-hidden bg-[#0B2D5C] py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Maskapai
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-white md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Penerbangan Premium
          </h2>
          <p className="mt-3 text-base text-white/60 md:text-lg">
            Maskapai terbaik untuk kenyamanan perjalanan ibadah Anda
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          {airlines.map((airline, i) => (
            <motion.div
              key={airline.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-[#D4AF37]/5"
            >
              <div className="mb-5 flex items-center gap-4">
                <div className="relative flex h-14 w-28 items-center justify-center rounded-xl bg-white/90 p-3 transition-transform duration-300 group-hover:scale-105">
                  <Image
                    src={airline.logo}
                    alt={`Logo ${airline.name}`}
                    width={100}
                    height={40}
                    className="h-auto w-auto object-contain"
                  />
                </div>
                <h3 className="font-playfair text-lg font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>
                  {airline.name}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {infoItems.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-xl border border-white/5 bg-white/[0.03] p-3 transition-all duration-300 group-hover:border-white/10 group-hover:bg-white/[0.06]"
                  >
                    <div className="mb-1 flex items-center gap-1.5">
                      <item.icon className="size-3.5 text-[#D4AF37]" />
                      <span className="text-[10px] font-medium tracking-wider text-white/40 uppercase">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white">{airline[item.key]}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
