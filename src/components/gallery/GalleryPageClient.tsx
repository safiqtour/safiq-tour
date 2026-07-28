"use client"

import { useState } from "react"
import { Hero } from "@/components/gallery/Hero"
import { CategoryFilter } from "@/components/gallery/CategoryFilter"
import { GalleryGrid } from "@/components/gallery/GalleryGrid"
import { VideoGallery } from "@/components/gallery/VideoGallery"
import { Timeline } from "@/components/gallery/Timeline"
import { Testimonials } from "@/components/gallery/Testimonials"
import { FloatingWhatsapp } from "@/components/gallery/FloatingWhatsapp"

export function GalleryPageClient() {
  const [filter, setFilter] = useState("all")

  return (
    <>
      <Hero />
      <CategoryFilter active={filter} onSelect={setFilter} />
      <GalleryGrid filter={filter} />
      <VideoGallery />
      <Timeline />
      <Testimonials />
      <FloatingWhatsapp />
    </>
  )
}
