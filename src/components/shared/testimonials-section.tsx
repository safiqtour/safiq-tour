"use client"

import { useEffect, useRef, useState } from "react"
import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section"
import { Container } from "@/components/ui/container"

const testimonials = [
  {
    name: "H. Ahmad Fauzi",
    location: "Jakarta",
    quote: "Alhamdulillah, perjalanan Umrah bersama Safiq Tour sangat berkesan. Pelayanannya luar biasa, pembimbingnya sabar dan profesional. Semua fasilitas sesuai dengan yang dijanjikan.",
    rating: 5,
  },
  {
    name: "Hj. Siti Nurhaliza",
    location: "Bandung",
    quote: "Safiq Tour benar-benar memudahkan perjalanan ibadah kami. Dari pengurusan visa sampai akomodasi semuanya terurus dengan baik. Tour leader-nya sangat membantu dan ramah.",
    rating: 5,
  },
  {
    name: "H. Bambang Supriyadi",
    location: "Surabaya",
    quote: "Sudah dua kali Umrah dengan Safiq Tour dan selalu puas. Pelayanan konsisten, hotel strategis, dan bimbingan ibadahnya sangat detail. InsyaAllah akan kembali lagi tahun depan.",
    rating: 5,
  },
  {
    name: "Hj. Dewi Sartika",
    location: "Medan",
    quote: "Pengalaman pertama Umrah bersama Safiq Tour benar-benar tak terlupakan. Tim dokumentasi sangat profesional, sehingga kami memiliki banyak kenangan indah selama di Tanah Suci.",
    rating: 5,
  },
  {
    name: "H. Rahmat Hidayat",
    location: "Makassar",
    quote: "Pelayanan Safiq Tour sangat memuaskan. Semua kebutuhan jemaah diperhatikan dengan baik. Pembimbing ibadahnya sangat berpengetahuan luas dan penyampaiannya mudah dipahami.",
    rating: 5,
  },
  {
    name: "Hj. Fitriani Yusuf",
    location: "Yogyakarta",
    quote: "Mulai dari keberangkatan hingga kepulangan semuanya berjalan lancar. Safiq Tour benar-benar amanah dalam mengurus perjalanan ibadah. Terima kasih sudah menjadi sahabat perjalanan ibadah kami.",
    rating: 5,
  },
]

function TestimonialCard({ item }: { item: typeof testimonials[number] }) {
  return (
    <div className="w-[calc(100vw-40px)] max-w-full flex-shrink-0 rounded-xl border border-border/50 bg-white px-5 py-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-md hover:shadow-[#D4AF37]/5 md:w-[calc(50vw-2rem)] md:max-w-md md:rounded-2xl lg:w-[calc(33.333vw-2.5rem)]">
      <div className="mb-4 flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`size-4 ${i < item.rating ? "text-[#D4AF37]" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="mb-4 text-sm leading-relaxed text-muted-foreground italic">
        &ldquo;{item.quote}&rdquo;
      </p>

      <div className="flex items-center gap-3 border-t border-border/40 pt-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-[#D4AF37]/10 text-sm font-semibold text-[#D4AF37]">
          {item.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F2D5C]">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.location}</p>
        </div>
      </div>
    </div>
  )
}

function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  // Track viewport so mobile renders its own continuous CSS marquee while
  // desktop keeps the existing auto-scrolling marquee untouched.
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)")
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  useEffect(() => {
    // This rAF marquee only runs on desktop; mobile uses its own pure-CSS
    // marquee (.testimonial-track), so no JS animation is needed there.
    if (isMobile) return

    let x = 0

    function animate() {
      const el = trackRef.current
      if (!el) return
      if (!pausedRef.current) {
        const speed = 0.3
        x -= speed
        const trackWidth = el.scrollWidth / 2
        if (Math.abs(x) >= trackWidth) {
          x += trackWidth
        }
        el.style.transform = `translateX(${x}px)`
      }
      requestAnimationFrame(animate)
    }

    const frame = requestAnimationFrame(animate)

    const el = trackRef.current
    if (!el) return

    const onEnter = () => { pausedRef.current = true }
    const onLeave = () => { pausedRef.current = false }
    el.addEventListener("mouseenter", onEnter)
    el.addEventListener("mouseleave", onLeave)
    el.addEventListener("touchstart", onEnter, { passive: true })
    el.addEventListener("touchend", onLeave, { passive: true })

    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("mouseenter", onEnter)
      el.removeEventListener("mouseleave", onLeave)
      el.removeEventListener("touchstart", onEnter)
      el.removeEventListener("touchend", onLeave)
    }
  }, [isMobile])

  return (
    <Section variant="muted" className="overflow-x-hidden">
      <Container>
        <SectionHeader>
          <SectionTitle className="text-[#0F2D5C]">Testimoni Jemaah</SectionTitle>
          <SectionDescription>
            Pengalaman Nyata dari Para Jemaah Safiq Tour
          </SectionDescription>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Kepercayaan dan kepuasan jemaah adalah kebanggaan terbesar kami. Berikut adalah sebagian kesan dari
            jemaah yang telah mempercayakan perjalanan ibadahnya kepada Safiq Tour.
          </p>
        </SectionHeader>
      </Container>

      {isMobile ? (
        // Mobile: continuous right-to-left infinite marquee. The track holds
        // two identical halves, so the CSS animation (translateX 0% → -50%)
        // loops seamlessly — no pause, no jump, no stacking, no horizontal
        // scroll. Cards keep a fixed width of calc(100vw - 40px).
        <div className="overflow-hidden">
          <div className="testimonial-track animate-testimonial-scroll flex w-max will-change-transform">
            <div className="flex shrink-0 gap-4 px-2">
              {testimonials.map((item) => (
                <TestimonialCard key={item.name} item={item} />
              ))}
            </div>
            <div className="flex shrink-0 gap-4 px-2" aria-hidden="true">
              {testimonials.map((item) => (
                <TestimonialCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        // Desktop: existing auto-scrolling marquee (unchanged).
        <div className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex will-change-transform"
          >
            <div className="flex shrink-0 gap-6 px-4">
              {testimonials.map((item) => (
                <TestimonialCard key={item.name} item={item} />
              ))}
            </div>
            <div className="flex shrink-0 gap-6 px-4" aria-hidden="true">
              {testimonials.map((item) => (
                <TestimonialCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  )
}

export { TestimonialsSection }
