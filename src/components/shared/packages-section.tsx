"use client"

import { useState, useMemo } from "react"
import Link from "next/link"

import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { PackageFilter } from "./package-filter"
import { PackageSearch } from "./package-search"
import { PackageGrid } from "./package-grid"
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

  return (
    <Section variant="muted">
      <Container>
        {!hideTitle && (
          <SectionHeader>
            <SectionTitle className="text-[#0F2D5C]">
              Pilih Paket Umroh Terbaik
            </SectionTitle>
            <SectionDescription>
              Temukan berbagai pilihan paket Umroh yang dirancang sesuai kebutuhan Anda
              dengan fasilitas terbaik, jadwal keberangkatan pasti, serta pendampingan ibadah profesional.
            </SectionDescription>
          </SectionHeader>
        )}

        {!hideFilter && (
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <PackageFilter active={filter} onSelect={setFilter} allowedCategories={allowedCategories} />
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

        <PackageGrid packages={filtered} maxItems={maxItems} />

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
