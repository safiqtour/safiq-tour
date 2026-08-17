"use client"

import { useState } from "react"
import { Hero } from "@/components/gallery/Hero"
import { CategoryFilter } from "@/components/gallery/CategoryFilter"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"
import { VideoGallery } from "@/components/gallery/VideoGallery"
import { Timeline } from "@/components/gallery/Timeline"
import { Testimonials } from "@/components/gallery/Testimonials"
import { FloatingWhatsapp } from "@/components/shared/FloatingWhatsapp"
import type { GalleryPhoto, GalleryVideo } from "@/modules/public/gallery"

type GalleryPageClientProps = {
  photos: GalleryPhoto[]
  videos: GalleryVideo[]
  categories: string[]
}

export function GalleryPageClient({ photos, videos, categories }: GalleryPageClientProps) {
  const [filter, setFilter] = useState("all")

  return (
    <>
      <Hero />
      <CategoryFilter active={filter} onSelect={setFilter} categories={categories} />
      <GalleryGrid items={photos} filter={filter} />
      <VideoGallery videos={videos} />
      <Timeline />
      <Testimonials />
      <FloatingWhatsapp />
    </>
  )
}
