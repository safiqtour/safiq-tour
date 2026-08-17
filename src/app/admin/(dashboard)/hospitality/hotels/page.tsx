"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Building2 } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getHotels, deleteHotel, restoreHotel } from "@/actions/hotel"
import { getAllActiveCountries } from "@/actions/country"
import type { HotelListItem, CountryBrief } from "@/types/hospitality"

export default function HotelsPage() {
  const [data, setData] = useState<HotelListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [countryId, setCountryId] = useState("")
  const [starRating, setStarRating] = useState("")
  const [status, setStatus] = useState("")
  const [countries, setCountries] = useState<CountryBrief[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getHotels({ page, limit: 10, search, sort, order, countryId: countryId || undefined, starRating: starRating ? Number(starRating) : undefined, status: status || undefined, includeDeleted: showDeleted || undefined })
      setData((result.data ?? []) as unknown as HotelListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, countryId, starRating, status, showDeleted])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, countryId, starRating, status, showDeleted])

  useEffect(() => {
    getAllActiveCountries().then((res) => setCountries((res ?? []) as unknown as CountryBrief[])).catch(() => setCountries([]))
  }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<HotelListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          <Building2 className="size-4 text-gray-400" />
        </div>
        <span className="font-medium">{item.name}</span>
      </div>
    )},
    { key: "starRating", header: "Stars", sortable: true, hideOnMobile: true, render: (item) => "★".repeat(item.starRating) },
    { key: "country", header: "Country", hideOnMobile: true, render: (item) => item.country?.name ?? "—" },
    { key: "city", header: "City", hideOnMobile: true, render: (item) => item.city?.name ?? "—" },
    { key: "status", header: "Status", render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Hotels</h1>
          <p className="text-sm text-[#9CA3AF]">Manage hotel master data</p>
        </div>
        <Link href="/admin/hospitality/hotels/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
          <Plus className="size-4" /> Add Hotel
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select value={countryId} onChange={(e) => setCountryId(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none">
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={starRating} onChange={(e) => setStarRating(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none">
          <option value="">All Stars</option>
          {[1,2,3,4,5].map((s) => <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        sort={sort}
        order={order}
        onSort={handleSort}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search hotels..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteHotel(id).then(fetchData)}
        onRestore={(id) => restoreHotel(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => (
          <Link href={`/admin/hospitality/hotels/${item.id}/edit`} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Pencil className="size-4" />
          </Link>
        )}
      />
    </motion.div>
  )
}
