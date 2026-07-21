"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

const profiles = [
  {
    name: "H. Cucu Zaenal Alim",
    role: "Pembimbing Umroh",
    desc: "Sesepuh Pesantren Al Hidayah Gempol Sari",
    image: "/images/Pembimbing-H-Cucu-Zaenal-Alim.jpg",
  },
  {
    name: "H. Azim Saripudin",
    role: "Pembimbing Umroh",
    desc: "Sesepuh Pesantren Daarul Karomah Wal Barokah",
    image: "/images/Pembimbing-H-Azim-Saripudin.jpg",
  },
  {
    name: "K.H. Asep Solihin",
    role: "Pembimbing Umroh",
    desc: "Pimpinan Pondok Pesantren At Taslim Ula Citiwu & Ketua MUI Kecamatan Ciwidey",
    image: "/images/Pembimbing-K-H-Asep-Solihin.jpg",
  },
  {
    name: "H. Haris Abdul Aziz",
    role: "Pembimbing Umroh",
    image: "/images/Pembimbing-H-Haris-Abdul-Aziz.jpg",
  },
  {
    name: "H. Ridwan Mustofa Kamil",
    role: "Pembimbing Umroh",
    desc: "Pimpinan Pondok Pesantren Al Bidayah",
    image: "/images/Pembimbing-H-Ridwan-Mustofa-Kamil.jpg",
  },
  {
    name: "H. Saefudin Zuhri",
    role: "Pembimbing Umroh",
    image: "/images/Pembimbing-H-Saefudin-Zuhri.jpg",
  },
]

function PembimbingSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = scrollRef.current.children[0]?.getBoundingClientRect().width ?? 1
    const gap = 24
    const index = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(index, profiles.length - 1))
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateActiveIndex, { passive: true })
    return () => el.removeEventListener("scroll", updateActiveIndex)
  }, [updateActiveIndex])

  function scrollToIndex(index: number) {
    if (!scrollRef.current) return
    const cardWidth = scrollRef.current.children[0]?.getBoundingClientRect().width ?? 0
    const gap = 24
    scrollRef.current.scrollTo({
      left: index * (cardWidth + gap),
      behavior: "smooth",
    })
  }

  return (
    <Section>
      <Container>
        <div className="space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-[#0F2D5C] md:text-4xl">
              Tim Pembimbing Ibadah
            </h2>
            <p className="text-base text-muted-foreground md:text-lg">
              Didampingi oleh para ahli ibadah yang berkompeten dan berpengalaman
            </p>
          </div>

          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.name}
                className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-md hover:shadow-[#D4AF37]/5"
              >
                <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl">
                  <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-[#0F2D5C]">{profile.name}</h3>
                  {profile.desc && (
                    <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{profile.desc}</p>
                  )}
                  <span className="mt-1 inline-flex items-center rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-600 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-white">
                    {profile.role}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="sm:hidden">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide"
            >
              {profiles.map((profile) => (
                <div
                  key={profile.name}
                  className="flex-shrink-0 snap-start w-[80vw] max-w-xs flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm"
                >
                  <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-xl">
                    <Image src={profile.image} alt={profile.name} fill className="object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[#0F2D5C]">{profile.name}</h3>
                    {profile.desc && (
                      <p className="mt-0.5 text-[11px] leading-tight text-muted-foreground">{profile.desc}</p>
                    )}
                    <span className="mt-1 inline-flex items-center rounded-full bg-gradient-to-r from-[#D4AF37] to-amber-600 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase text-white">
                      {profile.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
              {profiles.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 bg-[#D4AF37]"
                      : "w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export { PembimbingSection }
