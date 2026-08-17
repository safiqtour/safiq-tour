"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"

// Swiper v14 modular styles (core + pagination bullets).
import "swiper/css"
import "swiper/css/pagination"

import { type Package } from "@/data/packages"
import { PackageCard } from "./package-card"

type PackageCarouselProps = {
  packages: Package[]
  maxItems?: number
  className?: string
}

/**
 * Swiper-based package carousel.
 *
 * - Desktop (>=1024px): 3 equal-height cards.
 * - Tablet (640–1023px): 2 cards.
 * - Mobile (<640px): 1 full-width card, swipe via touch.
 * - No prev/next arrows — pagination dots only.
 *
 * Layout contract (matches the current PackageCard design):
 * - `.swiper-wrapper` uses `align-items: stretch` so every slide shares the
 *   same height.
 * - `.swiper-slide` is `display: flex`.
 * - Each card is `h-full` and lays out in a `flex-col`, keeping the price and
 *   CTA pinned to the bottom so rows stay aligned.
 */
function PackageCarousel({ packages, maxItems, className }: PackageCarouselProps) {
  const displayed = maxItems ? packages.slice(0, maxItems) : packages

  if (displayed.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-4 size-12 text-muted-foreground/40"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <p className="text-lg font-medium text-muted-foreground">Paket tidak ditemukan</p>
        <p className="text-sm text-muted-foreground/60">Coba ubah kata kunci atau filter</p>
      </div>
    )
  }

  return (
    <div className={`package-carousel ${className ?? ""}`.trim()}>
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        spaceBetween={0}
        grabCursor
        watchOverflow
        loop
        speed={800}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false, // keep auto-advancing after swipe/click
          pauseOnMouseEnter: true, // premium touch: pause while hovering
        }}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 24 },
        }}
      >
        {displayed.map((pkg) => (
          <SwiperSlide key={pkg.id} className="!h-auto">
            <PackageCard pkg={pkg} className="h-full w-full" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export { PackageCarousel }