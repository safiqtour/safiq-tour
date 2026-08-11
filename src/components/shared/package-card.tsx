"use client"

import Image from "next/image"
import Link from "next/link"
import { cn, normalizeImageUrl } from "@/lib/utils"
import { type Package, formatPrice } from "@/data/packages"

type PackageCardProps = {
  pkg: Package
  className?: string
}

function PackageCard({ pkg, className }: PackageCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-1 flex-col overflow-hidden rounded-[32px] border border-white/20 bg-white/70 shadow-lg shadow-black/5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10",
        pkg.featured && "ring-2 ring-[#D4AF37] ring-offset-2",
        className
      )}
    >
      {pkg.image && (
        <div className="relative h-auto w-full shrink-0">
          <Image
            src={normalizeImageUrl(pkg.image)}
            alt={pkg.title}
            width={800}
            height={450}
            className="h-auto w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="space-y-1">
          <h3 className="line-clamp-2 break-words text-xl font-bold text-[#0F2D5C]" title={pkg.title}>{pkg.title}</h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 text-[#D4AF37]"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {pkg.duration}
          </p>
        </div>

        <div className="space-y-0.5">
          {pkg.priceLabel && (
            <p className="text-xs text-muted-foreground">{pkg.priceLabel}</p>
          )}
          <p className="text-2xl font-bold tracking-tight text-[#0F2D5C]">
            {formatPrice(pkg.price)}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#D4AF37]">
              <path d="M2 22V12l9-7 9 7v10" />
              <path d="M2 22h20" />
              <path d="M7 22V2h10v20" />
            </svg>
            <span className="text-muted-foreground">Hotel Mekah:</span>
            <span className="font-medium text-[#0F2D5C]">{pkg.hotelMekah}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#D4AF37]">
              <path d="M2 22V12l9-7 9 7v10" />
              <path d="M2 22h20" />
              <path d="M7 22V2h10v20" />
            </svg>
            <span className="text-muted-foreground">Hotel Madinah:</span>
            <span className="font-medium text-[#0F2D5C]">{pkg.hotelMadinah}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 shrink-0 text-[#D4AF37]">
              <path d="M22 12h-8v-4l6-2v8" />
              <path d="M2 12h8V8L4 6v8" />
              <path d="M12 22V2" />
            </svg>
            <span className="text-muted-foreground">Maskapai:</span>
            <span className="font-medium text-[#0F2D5C]">{pkg.maskapai}</span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={`/packages/${pkg.slug}`}
            className="flex w-full cursor-pointer items-center justify-center rounded-xl bg-[#0F2D5C] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#1a3d7a] hover:shadow-lg hover:shadow-[#0F2D5C]/20 active:scale-[0.98]"
          >
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  )
}

export { PackageCard }
