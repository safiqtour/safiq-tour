"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { type Package } from "@/data/packages"
import { PackageBadge } from "./package-badge"
import { PackagePrice } from "./package-price"
import { PackageFeatures } from "./package-features"
import { PackageCTA } from "./package-cta"

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
        <div className="relative h-48 w-full shrink-0 overflow-hidden">
          <Image
            src={pkg.image}
            alt={pkg.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      )}

      {pkg.featured && (
        <div className="absolute right-6 top-6 z-10">
          <PackageBadge label={pkg.badge} />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-[#0F2D5C]">{pkg.title}</h3>
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
          {!pkg.featured && <PackageBadge label={pkg.badge} />}
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

        <PackagePrice price={pkg.price} label={pkg.priceLabel} />

        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />

        <PackageFeatures features={pkg.features} />

        <div className="mt-auto pt-2">
          <PackageCTA />
        </div>
      </div>
    </div>
  )
}

export { PackageCard }
