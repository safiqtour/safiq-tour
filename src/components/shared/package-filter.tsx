"use client"

import { cn } from "@/lib/utils"

const FILTERS = [
  { value: "all", label: "Semua" },
  { value: "zamzam", label: "Zamzam" },
  { value: "thaibah", label: "Thaibah" },
  { value: "rawdah", label: "Rawdah" },
  { value: "firdaus", label: "Firdaus" },
  { value: "ramadhan", label: "Ramadhan" },
] as const

type PackageFilterProps = {
  active: string
  onSelect: (value: string) => void
  className?: string
  allowedCategories?: string[]
}

function PackageFilter({ active, onSelect, className, allowedCategories }: PackageFilterProps) {
  const filters = allowedCategories
    ? FILTERS.filter((f) => f.value === "all" || allowedCategories.includes(f.value))
    : FILTERS
  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        className
      )}
    >
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onSelect(f.value)}
          className={cn(
            "cursor-pointer rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300",
            active === f.value
              ? "bg-[#0F2D5C] text-white shadow-md"
              : "bg-white/80 text-muted-foreground hover:bg-[#D4AF37]/10 hover:text-[#0F2D5C] border border-border"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  )
}

export { PackageFilter }
