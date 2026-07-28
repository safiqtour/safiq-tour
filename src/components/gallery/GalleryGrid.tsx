"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react"
import Image from "next/image"

const galleryImages = [
  { src: "/images/Galery/Image-Galery-Safiq-Tour-01.webp", alt: "Jamaah Safiq Tour di Masjidil Haram", category: "masjidil-haram", location: "Masjidil Haram, Makkah", date: "Januari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-02.webp", alt: "Suasana ibadah di Masjid Nabawi", category: "masjid-nabawi", location: "Masjid Nabawi, Madinah", date: "Februari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-03.webp", alt: "Hotel Safiq Tour di Mekkah", category: "makkah", location: "Mekkah", date: "Januari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-04.webp", alt: "Pembimbing ibadah bersama jamaah", category: "jamaah", location: "Madinah", date: "Maret 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-05.webp", alt: "City Tour di Madinah", category: "madinah", location: "Madinah", date: "Februari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-06.webp", alt: "Jamaah berfoto di landmark Islam", category: "jamaah", location: "Mekkah", date: "Maret 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-07.webp", alt: "Suasana Masjid Nabawi", category: "masjid-nabawi", location: "Masjid Nabawi, Madinah", date: "Januari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-08.webp", alt: "Jamaah Safiq Tour saat thawaf", category: "masjidil-haram", location: "Masjidil Haram, Makkah", date: "Februari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-01.webp", alt: "Keberangkatan jamaah Safiq Tour", category: "keberangkatan", location: "Bandara Soekarno-Hatta", date: "Maret 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-02.webp", alt: "Kepulangan jamaah Safiq Tour", category: "kepulangan", location: "Bandara Soekarno-Hatta", date: "April 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-03.webp", alt: "Manasik Umroh Safiq Tour", category: "manasik", location: "Bandung", date: "Januari 2026" },
  { src: "/images/Galery/Image-Galery-Safiq-Tour-04.webp", alt: "Jamaah Safiq Tour berdoa", category: "masjidil-haram", location: "Masjidil Haram, Makkah", date: "Februari 2026" },
]

const masonryHeights = ["h-[320px] sm:h-[400px]", "h-[260px] sm:h-[320px]", "h-[380px] sm:h-[480px]", "h-[280px] sm:h-[360px]", "h-[220px] sm:h-[280px]", "h-[340px] sm:h-[420px]"]

type GalleryGridProps = {
  filter: string
}

export function GalleryGrid({ filter }: GalleryGridProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const filtered = filter === "all" ? galleryImages : galleryImages.filter((img) => img.category === filter)
  const displayed = filtered.length > 0 ? filtered : galleryImages

  const next = useCallback(() => {
    if (selected === null) return
    setSelected((selected + 1) % displayed.length)
  }, [selected, displayed.length])

  const prev = useCallback(() => {
    if (selected === null) return
    setSelected((selected - 1 + displayed.length) % displayed.length)
  }, [selected, displayed.length])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (selected === null) return
      if (e.key === "ArrowRight") next()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "Escape") setSelected(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [selected, next, prev])

  return (
    <section id="gallery" className="py-16 md:py-20 bg-[#F8F6F2]">
      <div className="mx-auto max-w-(--container-wide) px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 flex items-end justify-between"
          >
            <h2 className="font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">
              {filter === "all" ? "Semua Dokumentasi" : `Dokumentasi ${filter.charAt(0).toUpperCase() + filter.slice(1)}`}
            </h2>
            <p className="text-base text-[#1F2937]/60 shrink-0">
              {displayed.length} momen
            </p>
          </motion.div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {displayed.map((img, i) => {
            const heightClass = masonryHeights[i % masonryHeights.length]
            return (
              <motion.button
                key={`${img.src}-${i}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => setSelected(i)}
                className={`group relative w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${heightClass} break-inside-avoid`}
                onContextMenu={(e) => e.preventDefault()}
                aria-label={`Lihat ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-all duration-700 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2343]/80 via-transparent to-transparent opacity-0 transition-all duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-sm font-semibold text-white">{img.alt}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-white/70">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" />
                      {img.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="size-3" />
                      {img.date}
                    </span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2343]/95 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Tutup"
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
              onContextMenu={(e) => e.preventDefault()}
            >
              <Image
                src={displayed[selected].src}
                alt={displayed[selected].alt}
                fill
                className="object-contain"
                sizes="(max-width: 1280px) 100vw, 1200px"
                draggable={false}
              />
            </motion.div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
              <p className="text-sm text-white/70">
                {selected + 1} / {displayed.length}
              </p>
              <p className="text-xs text-white/50">{displayed[selected].location}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
