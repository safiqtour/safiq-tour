"use client"

import { motion } from "framer-motion"
import { HeroContent } from "@/components/home/HeroContent"
import { HeroStats } from "@/components/home/HeroStats"
import { HeroFloatingCard } from "@/components/home/HeroFloatingCard"

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
        <span className="text-[10px] text-white/40">Scroll</span>
      </motion.div>
    </motion.div>
  )
}

export function HeroDesktop() {
  return (
    <>
      <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-10 pt-20 md:pt-28">
            <HeroContent />
            <HeroStats />
          </div>

          <div className="hidden justify-self-end md:flex">
            <HeroFloatingCard />
          </div>
        </div>
      </div>

      <ScrollIndicator />
    </>
  )
}
