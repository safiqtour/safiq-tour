"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    name: "H. Ahmad Fauzi",
    city: "Jakarta",
    rating: 5,
    quote: "Alhamdulillah, perjalanan umroh bersama Safiq Tour sangat nyaman. Pembimbingnya sabar dan informatif. Hotel dekat Masjidil Haram, tidak perlu naik bus. Sangat recommended!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "Hj. Siti Nurhaliza",
    city: "Bandung",
    rating: 5,
    quote: "Pelayanan Safiq Tour luar biasa. Dari keberangkatan sampai pulang semua diurus dengan baik. Makanan enak, hotel bersih, dan pembimbingnya sangat profesional.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop",
  },
  {
    name: "H. Rudi Hartono",
    city: "Surabaya",
    rating: 5,
    quote: "Paket Zamzam Express ini sangat worth it. Harga terjangkau tapi fasilitas lengkap. Maskapai Qatar Airways nyaman, hotel strategis, dan manasiknya jelas.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop",
  },
]

export function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = () => {
    setDirection(1)
    setCurrent((current + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrent((current - 1 + testimonials.length) % testimonials.length)
  }

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
  }

  return (
    <section className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Testimoni
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Kata Mereka
          </h2>
          <p className="mt-3 text-center text-base text-[#1E293B]/60 md:text-lg">
            Pengalaman jamaah setelah bergabung bersama Safiq Tour
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="rounded-2xl border border-[#0B2D5C]/8 bg-white p-6 shadow-sm md:p-8"
              >
                <Quote className="size-8 text-[#D4AF37]/20" />

                <div className="mt-4 mb-5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < testimonials[current].rating ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#0B2D5C]/20"}`}
                    />
                  ))}
                </div>

                <p className="text-base leading-relaxed text-[#1E293B]/80 md:text-lg">
                  &ldquo;{testimonials[current].quote}&rdquo;
                </p>

                <div className="mt-6 flex items-center gap-4 border-t border-[#0B2D5C]/8 pt-5">
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-full ring-2 ring-[#D4AF37]/20">
                    <Image
                      src={testimonials[current].image}
                      alt={testimonials[current].name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B2D5C]">{testimonials[current].name}</p>
                    <p className="text-xs text-[#1E293B]/50">{testimonials[current].city}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={prev}
              className="flex size-10 items-center justify-center rounded-xl border border-[#0B2D5C]/10 bg-white text-[#0B2D5C] shadow-sm transition-all hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
              aria-label="Testimoni sebelumnya"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i) }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? "w-6 bg-[#D4AF37]"
                      : "w-1.5 bg-[#0B2D5C]/20 hover:bg-[#D4AF37]/50"
                  }`}
                  aria-label={`Testimoni ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex size-10 items-center justify-center rounded-xl border border-[#0B2D5C]/10 bg-white text-[#0B2D5C] shadow-sm transition-all hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
              aria-label="Testimoni selanjutnya"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
