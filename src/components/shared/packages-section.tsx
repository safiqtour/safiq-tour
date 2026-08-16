"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { PackageFilter } from "./package-filter"
import { PackageSearch } from "./package-search"
import { PackageCarousel } from "./package-carousel"
import type { Package } from "@/data/packages"

type SortKey = "popular" | "price-asc" | "price-desc" | "duration"

type PackagesSectionProps = {
  packages?: Package[]
  maxItems?: number
  showAllPackagesButton?: boolean
  showConsultationButton?: boolean
  allowedCategories?: string[]
  hideTitle?: boolean
  filter?: string
  search?: string
  sort?: SortKey
  onFilterChange?: (value: string) => void
  onSearchChange?: (value: string) => void
  onSortChange?: (value: SortKey) => void
  hideFilter?: boolean
}

/** Human-friendly label for a category value (e.g. "zamzam" -> "Zamzam"). Pure, no hardcoded category list. */
export function categoryLabel(value: string): string {
  if (value === "all") return "Semua"
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/[-_]/g, " ")
}

function PackagesSection({
  packages: packagesProp,
  maxItems,
  showAllPackagesButton = true,
  showConsultationButton = true,
  allowedCategories,
  hideTitle = false,
  filter: externalFilter,
  search: externalSearch,
  sort: externalSort,
  onFilterChange,
  onSearchChange,
  onSortChange,
  hideFilter = false,
}: PackagesSectionProps) {
  const [internalFilter, setInternalFilter] = useState("all")
  const [internalSearch, setInternalSearch] = useState("")
  const [internalSort, setInternalSort] = useState<SortKey>("popular")

  const filter = externalFilter ?? internalFilter
  const search = externalSearch ?? internalSearch
  const sort = externalSort ?? internalSort
  const setFilter = onFilterChange ?? setInternalFilter
  const setSearch = onSearchChange ?? setInternalSearch
  const setSort = onSortChange ?? setInternalSort

  const packages = packagesProp ?? []

  const filtered = useMemo(() => {
    let result: Package[] = [...packages]

    if (allowedCategories && filter === "all") {
      result = result.filter((p) => allowedCategories.includes(p.category))
    }

    if (filter !== "all") {
      result = result.filter((p) => p.category === filter)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.features.some((f) => f.toLowerCase().includes(q))
      )
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "duration":
        result.sort((a, b) => {
          const da = parseInt(a.duration)
          const db = parseInt(b.duration)
          return da - db
        })
        break
      default:
        result.sort((a) => (a.featured ? -1 : 1))
        break
    }

    return result
  }, [filter, search, sort, allowedCategories, packages])

  // Derive category tabs dynamically from the published packages actually present.
  // Falls back to allowedCategories when provided (backward compat).
  const categoryFilters = useMemo(() => {
    const allowed = allowedCategories ? new Set(allowedCategories) : null
    const list: { value: string; label: string }[] = [{ value: "all", label: "Semua" }]
    const seen = new Set<string>(["all"])
    for (const p of packages) {
      if (seen.has(p.category)) continue
      if (allowed && !allowed.has(p.category)) continue
      seen.add(p.category)
      list.push({ value: p.category, label: categoryLabel(p.category) })
    }
    return list
  }, [packages, allowedCategories])

  return (
    <Section variant="muted">
      <Container>
        {!hideTitle && (
          <SectionHeader>
            <SectionTitle className="text-[#0F2D5C] sm:text-3xl md:text-4xl">
              Pilih Paket Umroh Terbaik
            </SectionTitle>
            <SectionDescription>
              Temukan berbagai pilihan paket Umroh yang dirancang sesuai kebutuhan Anda
              dengan fasilitas terbaik, jadwal keberangkatan pasti, serta pendampingan ibadah profesional.
            </SectionDescription>
          </SectionHeader>
        )}

        {/* Mobile: category tabs (horizontal scroll) */}
        <div className="mb-4 md:hidden overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-2 whitespace-nowrap pb-1 min-w-0">
            {categoryFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={cn(
                  "shrink-0 cursor-pointer rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
                  filter === f.value
                    ? "bg-[#D4AF37] text-white shadow-sm"
                    : "bg-white/80 text-muted-foreground border border-border hover:bg-[#D4AF37]/10 hover:text-[#0F2D5C]"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {!hideFilter && (
          <div className="mb-8 hidden md:flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PackageFilter active={filter} onSelect={setFilter} filters={categoryFilters} />
            <div className="flex items-center gap-3">
              <PackageSearch value={search} onChange={setSearch} className="w-64" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="h-10 cursor-pointer rounded-full border border-border bg-white/80 px-4 text-sm text-foreground outline-none transition-all focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20"
              >
                <option value="popular">Paling Populer</option>
                <option value="price-asc">Harga Terendah</option>
                <option value="price-desc">Harga Tertinggi</option>
                <option value="duration">Durasi</option>
              </select>
            </div>
          </div>
        )}

        <PackageCarousel packages={filtered} maxItems={maxItems} />

        {(showAllPackagesButton || showConsultationButton) && (
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {showAllPackagesButton && (
              <Link
                href="/packages"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0F2D5C] px-8 text-sm font-semibold text-white shadow-lg shadow-[#0F2D5C]/20 transition-all duration-300 hover:bg-[#1a3d7a] hover:shadow-xl hover:shadow-[#0F2D5C]/30"
              >
                Lihat Semua Paket Umroh
              </Link>
            )}
            {showConsultationButton && (
              <a
                href="https://wa.me/6282211624747"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-xl border-2 border-[#D4AF37] bg-transparent px-8 text-sm font-semibold text-[#D4AF37] transition-all duration-300 hover:bg-[#D4AF37] hover:text-white"
              >
                Konsultasi Gratis
              </a>
            )}
          </div>
        )}
      </Container>
    </Section>
  )
}

export { PackagesSection }
