"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "H. Ahmad Fauzi", city: "Jakarta",
    review: "Alhamdulillah, pelayanan Safiq Tour luar biasa. Dokumentasi perjalanannya sangat profesional.",
    rating: 5,
  },
  {
    name: "Hj. Siti Nurhaliza", city: "Bandung",
    review: "Setiap momen ibadah terdokumentasi dengan indah. Terima kasih Safiq Tour!",
    rating: 5,
  },
  {
    name: "H. Bambang Supriyadi", city: "Surabaya",
    review: "Foto-foto perjalanannya berkualitas tinggi. Kenangan indah selama di Tanah Suci.",
    rating: 5,
  },
  {
    name: "Hj. Dewi Sartika", city: "Medan",
    review: "Tim dokumentasi sangat profesional. Hasil fotonya seperti majalah travel!",
    rating: 5,
  },
  {
    name: "H. Rahmat Hidayat", city: "Makassar",
    review: "Abadi setiap momen ibadah dengan foto premium. Sangat direkomendasikan!",
    rating: 5,
  },
  {
    name: "Hj. Fitriani Yusuf", city: "Yogyakarta",
    review: "Kualitas dokumentasi membuat kami bisa bernostalgia kapan saja. Mantap!",
    rating: 5,
  },
]

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    let x = 0
    function animate() {
      const el = trackRef.current
      if (!el) return
      if (!pausedRef.current) {
        const speed = window.innerWidth < 768 ? 1.5 : 0.3
        x -= speed
        const trackWidth = el.scrollWidth / 2
        if (Math.abs(x) >= trackWidth) x += trackWidth
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
  }, [])

  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10"
        >
          <h2 className="font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">Cerita Jamaah</h2>
          <p className="mt-2 text-base text-[#1F2937]/60">Mereka telah mempercayakan perjalanannya kepada Safiq Tour.</p>
        </motion.div>
      </div>

      <div className="overflow-hidden">
        <div ref={trackRef} className="flex will-change-transform">
          <div className="flex shrink-0 gap-4 px-4">
            {testimonials.map((item) => (
              <div key={item.name} className="w-[300px] shrink-0 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#D4AF37]/10 text-sm font-semibold text-[#D4AF37]">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2343]">{item.name}</p>
                    <p className="text-xs text-[#1F2937]/50">{item.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < item.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#1F2937]/70 italic">&ldquo;{item.review}&rdquo;</p>
              </div>
            ))}
          </div>
          <div className="flex shrink-0 gap-4 px-4">
            {testimonials.map((item) => (
              <div key={`dup-${item.name}`} className="w-[300px] shrink-0 rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#D4AF37]/10 text-sm font-semibold text-[#D4AF37]">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F2343]">{item.name}</p>
                    <p className="text-xs text-[#1F2937]/50">{item.city}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`size-3.5 ${i < item.rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-gray-200"}`} />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-[#1F2937]/70 italic">&ldquo;{item.review}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
