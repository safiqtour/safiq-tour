"use client"

import { useEffect, useState } from "react"
import { HeroBackground } from "@/components/home/HeroBackground"
import { HeroDesktop } from "@/components/home/HeroDesktop"
import { HeroMobile } from "@/components/home/HeroMobile"

export function Hero() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check, { passive: true })
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <section className="relative min-h-screen -mt-20">
      <HeroBackground />
      {isMobile ? <HeroMobile /> : <HeroDesktop />}
    </section>
  )
}
