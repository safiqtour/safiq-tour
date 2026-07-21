"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Users, Calendar, Award } from "lucide-react"

const stats = [
  { icon: Users, value: 1000, suffix: "+", label: "Jamaah Diberangkatkan" },
  { icon: Calendar, value: 10, suffix: "+", label: "Tahun Pengalaman" },
  { icon: Award, value: 10, suffix: "", label: "Pembimbing Bersertifikat" },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let cancelled = false
    const totalSteps = 60
    let frame = 0

    const tick = () => {
      if (cancelled) return
      frame++
      const progress = Math.min(frame / totalSteps, 1)
      setCount(Math.round(progress * target))
      if (frame < totalSteps) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
    return () => { cancelled = true }
  }, [isInView, target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function HeroStats() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1 }}
      className="relative z-10 grid grid-cols-3 gap-3 md:gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.label}
            className="group rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md transition-all duration-300 hover:border-[#C79A3B]/30 hover:bg-white/10 hover:shadow-lg hover:shadow-[#C79A3B]/5 md:p-6"
          >
            <Icon className="mx-auto mb-2 size-5 text-[#E8C874] md:size-6" />
            <p className="font-heading text-xl font-bold text-white md:text-2xl">
              <CountUp target={stat.value} suffix={stat.suffix} />
            </p>
            <p className="mt-1 text-[10px] text-[#D6D6D6] md:text-xs">
              {stat.label}
            </p>
          </div>
        )
      })}
    </motion.div>
  )
}
