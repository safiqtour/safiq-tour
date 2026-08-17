"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, X, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import type { GalleryVideo } from "@/modules/public/gallery"

type VideoGalleryProps = {
  videos: GalleryVideo[]
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10"
        >
          <h2 className="font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">Video Perjalanan</h2>
          <p className="mt-2 text-base text-[#1F2937]/60">Saksikan momen-momen istimewa dalam video perjalanan umroh Safiq Tour.</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2">
          {videos.map((video, i) => (
            <motion.button
              key={video.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              onClick={() => setActiveVideo(video.id)}
              className="group relative aspect-video w-full overflow-hidden rounded-2xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
              aria-label={`Putar video: ${video.title}`}
            >
              <Image
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                fill
                className="object-cover transition-all duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, 50vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-[#0F2343]/30 transition-all duration-500 group-hover:bg-[#0F2343]/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex size-16 items-center justify-center rounded-full bg-[#D4AF37]/90 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:bg-[#D4AF37] group-hover:shadow-xl group-hover:shadow-[#D4AF37]/30">
                  <Play className="size-6 ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0F2343]/90 via-[#0F2343]/40 to-transparent p-5">
                <p className="text-sm font-semibold text-white">{video.title}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
                  <span className="inline-flex items-center gap-1"><MapPin className="size-3" />{video.location}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="size-3" />{video.duration}</span>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F2343]/95 p-4 backdrop-blur-sm"
            onClick={() => setActiveVideo(null)}
          >
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20"
              aria-label="Tutup video"
            >
              <X className="size-5" />
            </button>
            <motion.div
              key={activeVideo}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1&rel=0`}
                title="Video Safiq Tour"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
