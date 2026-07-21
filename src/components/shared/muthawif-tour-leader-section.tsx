"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

type Profile = {
  name: string
  role: string
  desc?: string
  image: string
}

const allProfiles: Profile[] = [
  {
    name: "Ustd. Akhamad Tohir Irawan",
    role: "Muthawif",
    image: "/images/Muthawif-Ustd-Akhamad-Tohir-Irawan.jpg",
  },
  {
    name: "Ustd. Lukman",
    role: "Muthawif",
    image: "/images/Muthawif-Ustd-Lukman.jpg",
  },
  {
    name: "Arie Chandra Permana",
    role: "Tour Leader",
    image: "/images/Tour-Leader-Safiq-Tour-Ustd-Arie-Chandra-P.jpg",
  },
  {
    name: "H. Dedek Ismiyadi",
    role: "Tour Leader",
    image: "/images/Tour-Leader-Safiq-Tour-H-Dedek-Ismiyadi.jpg",
  },
  {
    name: "Ustd. M. Ihsan",
    role: "Tour Leader",
    image: "/images/Tour-Leader-Safiq-Tour-Ustd-M-Ihsan.jpg",
  },
  {
    name: "Ustd. Sandi Djaya P",
    role: "Tour Leader",
    image: "/images/Tour-Leader-Safiq-Tour-Ustd-Sandi-Djaya-P.jpg",
  },
]

function MuthawifTourLeaderSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const updateActiveIndex = useCallback(() => {
    if (!scrollRef.current) return
    const scrollLeft = scrollRef.current.scrollLeft
    const cardWidth = scrollRef.current.children[0]?.getBoundingClientRect().width ?? 1
    const gap = 24
    const index = Math.round(scrollLeft / (cardWidth + gap))
    setActiveIndex(Math.min(index, allProfiles.length - 1))
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

  function Card({ profile }: { profile: Profile }) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-border/50 bg-card p-4 shadow-sm">
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
    )
  }

  return (
    <Section variant="muted">
      <Container>
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0F2D5C] md:text-4xl">
            Muthawif / Tour Leader
          </h2>
          <p className="text-base text-muted-foreground md:text-lg">
            Didampingi oleh Muthawif dan Tour Leader yang berkompeten dan berpengalaman
          </p>
        </div>

        <div className="mt-8 hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProfiles.map((p) => <Card key={p.name} profile={p} />)}
        </div>

        <div className="mt-8 sm:hidden">
          <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-hide">
            {allProfiles.map((p) => (
              <div key={p.name} className="flex-shrink-0 snap-start w-[80vw] max-w-xs">
                <Card profile={p} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            {allProfiles.map((_, i) => (
              <button key={i} onClick={() => scrollToIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-[#D4AF37]" : "w-2 bg-[#D4AF37]/30 hover:bg-[#D4AF37]/50"}`}
                aria-label={`Slide ${i + 1}`} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export { MuthawifTourLeaderSection }
