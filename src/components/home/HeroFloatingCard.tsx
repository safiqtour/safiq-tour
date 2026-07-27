"use client"

import { motion } from "framer-motion"
import { Star, Users } from "lucide-react"

type HeroFloatingCardProps = {
  simple?: boolean
}

export function HeroFloatingCard({ simple }: HeroFloatingCardProps) {
  if (simple) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
      className="relative z-10 w-full max-w-xs"
    >
      <div className="rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#C79A3B]/10">
        <>
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="size-4 fill-[#E8C874] text-[#E8C874]"
              />
            ))}
          </div>

          <p className="text-3xl font-bold text-white">
            4.9<span className="text-lg text-[#D6D6D6]">/5</span>
          </p>

          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex size-8 items-center justify-center rounded-full border-2 border-white/20 bg-[#C79A3B]/30 text-xs font-semibold text-white"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-xs text-[#D6D6D6]">
              <Users className="mr-1 inline size-3" />
              Dipercaya 1000+ Jamaah
            </div>
          </div>
        </>
      </div>
    </motion.div>
  )
}
