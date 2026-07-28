"use client"

import { useState } from "react"
import Image from "next/image"
import { PackagesSection } from "@/components/shared/packages-section"
import { PackageFilter } from "@/components/shared/package-filter"
import { PackageSearch } from "@/components/shared/package-search"
import { HeroFloatingCard } from "@/components/home/HeroFloatingCard"

export default function PackagesPage() {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")

  return (
    <>
      <section className="relative min-h-[420px] md:min-h-[520px] -mt-20 flex items-center overflow-hidden">
        <Image
          src="/images/Hero-Nabawi-paket-Safiq-Tour-01.webp"
          alt="Paket Umroh Safiq Tour"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,23,53,0.7)] to-[rgba(6,23,53,0.25)] md:from-[rgba(6,23,53,0.5)] md:to-[rgba(6,23,53,0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,23,53,0.5)] via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 120px rgba(0,0,0,0.45)" }} />
        <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col gap-4 md:gap-6">
              <h1 className="text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
                Pilih Paket Umroh Terbaik
              </h1>
              <p className="text-base text-white/80 md:text-xl">
                Temukan paket perjalanan umroh sesuai kebutuhan Anda
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <PackageFilter active={filter} onSelect={setFilter} />
                <PackageSearch value={search} onChange={setSearch} className="w-full sm:w-64 lg:w-72" />
              </div>
            </div>
            <div className="hidden justify-self-end md:flex">
              <HeroFloatingCard simple />
            </div>
          </div>
        </div>
      </section>

      <PackagesSection
        showAllPackagesButton={false}
        hideTitle
        hideFilter
        filter={filter}
        search={search}
        onFilterChange={setFilter}
        onSearchChange={setSearch}
      />
    </>
  )
}