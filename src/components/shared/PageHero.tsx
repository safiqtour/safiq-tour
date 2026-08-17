"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

type PageHeroAction = {
  href: string
  label: string
  icon?: ReactNode
  iconPosition?: "left" | "right"
  variant?: "primary" | "outline"
  external?: boolean
}

type PageHeroProps = {
  image: string
  alt: string
  badge?: ReactNode
  title: ReactNode
  description?: string
  actions?: PageHeroAction[]
  minHeightClass?: string
  showScrollIndicator?: boolean
}

function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="flex flex-col items-center gap-2"
      >
        <div className="h-8 w-5 rounded-full border-2 border-white/30">
          <motion.div
            animate={{ y: [2, 12, 2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="mx-auto mt-1.5 h-2 w-1 rounded-full bg-white/60"
          />
        </div>
        <span className="text-[10px] text-white/40 tracking-wider uppercase">Scroll</span>
      </motion.div>
    </motion.div>
  )
}

export function PageHero({
  image,
  alt,
  badge,
  title,
  description,
  actions = [],
  minHeightClass = "min-h-[75vh]",
  showScrollIndicator = false,
}: PageHeroProps) {
  return (
    <section className={`relative -mt-20 flex ${minHeightClass} items-center overflow-hidden`}>
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F2343]/90 via-[#0F2343]/60 to-[#0F2343]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2343]/60 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(15,35,67,0.6)" }} />

      <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex max-w-3xl flex-col gap-6"
        >
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex w-fit rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase"
            >
              {badge}
            </motion.span>
          )}

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-heading text-4xl font-bold leading-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-xl text-left text-base leading-relaxed text-white/80 md:text-lg"
            >
              {description}
            </motion.p>
          )}

          {actions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col items-start gap-4 sm:flex-row"
            >
              {actions.map((action) => {
                const isPrimary = (action.variant ?? "primary") === "primary"
                const icon = action.icon ?? null
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    {...(action.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={
                      isPrimary
                        ? "group inline-flex h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-8 text-sm font-semibold text-[#0F2343] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25"
                        : "group inline-flex h-12 items-center gap-2 rounded-xl border border-white/20 px-8 text-sm font-semibold text-white transition-all duration-300 hover:border-[#D4AF37]/50 hover:bg-white/5"
                    }
                  >
                    {action.iconPosition === "left" && icon}
                    {action.label}
                    {action.iconPosition !== "left" && icon && (
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        {icon}
                      </span>
                    )}
                  </Link>
                )
              })}
            </motion.div>
          )}
        </motion.div>
      </div>

      {showScrollIndicator && <ScrollIndicator />}
    </section>
  )
}