"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, MessageCircle, Users, Calendar, Award, Star } from "lucide-react"
import Link from "next/link"

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const stats = [
  { icon: Users, value: 1000, suffix: "+", label: "Jamaah Diberangkatkan" },
  { icon: Calendar, value: 10, suffix: "+", label: "Tahun Pengalaman" },
  { icon: Award, value: 10, suffix: "", label: "Pembimbing Bersertifikat" },
]

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
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
  }, [target])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

function MobileRatingCard() {
  return (
    <motion.div
      variants={fadeUp}
      className="w-full rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="size-3.5 fill-[#E8C874] text-[#E8C874]" />
            ))}
          </div>
          <span className="font-heading text-lg font-bold text-white">4.9</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#D6D6D6]">
          <Users className="size-3.5" />
          <span>1000+ Jamaah</span>
        </div>
      </div>
    </motion.div>
  )
}

export function HeroMobile() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden block md:hidden">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-1 flex-col justify-end px-6 pb-[60px] pt-[100px]"
      >
        <motion.div
          variants={fadeUp}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C79A3B]/30 bg-[#C79A3B]/10 px-3 py-1 text-[11px] text-[#E8C874] backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-[#E8C874]" />
            PPIU Resmi Kementerian Agama RI
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="font-heading text-[42px] font-bold leading-[1.1] text-white"
        >
          Wujudkan Perjalanan Suci{" "}
          <span className="text-[#E8C874]">Menuju Baitullah</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="mt-4 w-[90%] text-base leading-relaxed text-[#D6D6D6]"
        >
          Bersama Safiq Tour, nikmati perjalanan ibadah yang nyaman, aman, dan
          sesuai sunnah dengan pembimbing ibadah berpengalaman.
        </motion.p>

        <motion.div
          variants={fadeUp}
          className="mt-8 flex flex-col gap-4"
        >
          <Link
            href="/packages"
            aria-label="Lihat Paket Umroh"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#C79A3B] px-8 text-sm font-semibold text-white transition-all duration-300 active:scale-[0.98]"
          >
            Lihat Paket Umroh
            <ArrowRight className="size-4" />
          </Link>

          <Link
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Konsultasi via WhatsApp"
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl border border-white/30 px-8 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 active:scale-[0.98]"
          >
            <MessageCircle className="size-4" />
            Konsultasi WhatsApp
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-6"
        >
          <MobileRatingCard />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className="mt-8 grid grid-cols-3 gap-2"
        >
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur-md"
              >
                <Icon className="mx-auto mb-2 size-5 text-[#E8C874]" />
                <p className="font-heading text-xl font-bold text-white">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-[11px] text-[#D6D6D6]">
                  {stat.label}
                </p>
              </div>
            )
          })}
        </motion.div>
      </motion.div>
    </div>
  )
}
