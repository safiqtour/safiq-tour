"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"

function Particles() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 6 + 8,
    delay: Math.random() * 5,
  }))

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function HeroBackground() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image
          src="/images/hero-bg-2.jpg"
          alt="Masjidil Haram"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,23,53,0.55)] to-[rgba(6,23,53,0.15)] md:from-[rgba(6,23,53,0.5)] md:to-[rgba(6,23,53,0.1)]" />

      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,23,53,0.4)] via-transparent to-transparent" />

      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 150px rgba(0,0,0,0.4)",
        }}
      />

      <div
        className="absolute -right-1/4 -top-1/4 h-1/2 w-1/2 opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(199,154,59,0.4) 0%, transparent 70%)",
        }}
      />

      <Particles />
    </div>
  )
}
