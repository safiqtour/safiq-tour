"use client"

import { cn } from "@/lib/utils"
import { type Package } from "@/data/packages"
import { PackageCard } from "./package-card"

type PackageGridProps = {
  packages: Package[]
  maxItems?: number
  className?: string
}

function PackageGrid({ packages, maxItems, className }: PackageGridProps) {
  const displayed = maxItems ? packages.slice(0, maxItems) : packages
  if (packages.length === 0) {
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
    <div
      className={cn(
        "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {displayed.map((pkg, index) => (
        <div
          key={pkg.id}
          className="animate-[fade-up_0.6s_ease-out_forwards] opacity-0"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <PackageCard pkg={pkg} />
        </div>
      ))}
    </div>
  )
}

export { PackageGrid }
