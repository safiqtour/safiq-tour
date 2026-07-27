"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

const images = [
  { src: "/images/Galery/Image-Galery-Safiq-Tour-01.webp", alt: "Jamaah Safiq Tour di Masjidil Haram" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-02.webp", alt: "Suasana ibadah di Masjid Nabawi" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-03.webp", alt: "Hotel Safiq Tour di Mekkah" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-04.webp", alt: "Pembimbing ibadah bersama jamaah" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-05.webp", alt: "City Tour di Madinah" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-06.webp", alt: "Jamaah berfoto di landmark Islam" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-07.webp", alt: "Suasana Masjid Nabawi" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-08.webp", alt: "Jamaah Safiq Tour saat thawaf" },
]

export function Gallery() {
  const [selected, setSelected] = useState<number | null>(null)

  const next = () => {
    if (selected === null) return
    setSelected((selected + 1) % images.length)
  }

  const prev = () => {
    if (selected === null) return
    setSelected((selected - 1 + images.length) % images.length)
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-(--container-wide) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Dokumentasi
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Galeri Perjalanan
          </h2>
          <p className="mt-3 text-base text-[#1E293B]/60 md:text-lg">
            Momen kebersamaan jamaah Safiq Tour
          </p>
        </motion.div>
      </div>

      <div className="overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex gap-3 overflow-x-auto px-3 pb-4 scrollbar-hide sm:px-6 lg:px-8"
        >
          {images.map((img, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              onClick={() => setSelected(i)}
              className="group relative aspect-[4/3] w-[280px] shrink-0 overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl sm:w-[320px]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 280px, 320px"
              />
              <div className="absolute inset-0 bg-[#0B2D5C]/0 transition-all duration-300 group-hover:bg-[#0B2D5C]/30" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                <div className="rounded-full bg-white/20 p-2 backdrop-blur-sm">
                  <svg className="size-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B2D5C]/95 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Tutup galeri"
            >
              <X className="size-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Sebelumnya"
            >
              <ChevronLeft className="size-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Selanjutnya"
            >
              <ChevronRight className="size-5" />
            </button>

            <motion.div
              key={selected}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selected].src}
                alt={images[selected].alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm text-white/70">
                {selected + 1} / {images.length}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
