"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Users, Plane, Heart, Award } from "lucide-react"

const stats = [
  { icon: Users, value: 5000, suffix: "+", label: "Jamaah Berangkat" },
  { icon: Plane, value: 250, suffix: "+", label: "Keberangkatan" },
  { icon: Heart, value: 100, prefix: "", suffix: "%", label: "Pendampingan" },
  { icon: Award, value: 15, suffix: "+", label: "Tahun Pengalaman" },
]

function CountUp({ target, suffix, prefix = "" }: { target: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!inView) return
    let frame = 0
    const totalSteps = 60
    const tick = () => {
      frame++
      const progress = Math.min(frame / totalSteps, 1)
      setCount(Math.round(progress * target))
      if (frame < totalSteps) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <span ref={ref} className="font-heading text-4xl font-bold text-white md:text-5xl">
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}

export function Statistics() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0F2343] to-[#0A1A33] py-16 md:py-20">
      <div className="absolute inset-0 bg-[url('/images/pattern-islamic.svg')] bg-repeat opacity-[0.03]" />
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                className="text-center"
              >
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Icon className="size-6 text-[#D4AF37]" />
                </div>
                <CountUp target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ""} />
                <p className="mt-2 text-sm text-white/60">{stat.label}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
