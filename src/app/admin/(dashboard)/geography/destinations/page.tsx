"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getDestinations, deleteDestination, restoreDestination } from "@/actions/destination"
import { getAllActiveCountries } from "@/actions/country"

type Destination = NonNullable<Awaited<ReturnType<typeof getDestinations>>["data"][number]>

export default function DestinationsPage() {
  const [data, setData] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [countryFilter, setCountryFilter] = useState("")
  const [countries, setCountries] = useState<Awaited<ReturnType<typeof getAllActiveCountries>>>([])

  useEffect(() => { getAllActiveCountries().then(setCountries) }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getDestinations({ page, limit: 10, search, sort, order, includeDeleted: showDeleted || undefined, countryId: countryFilter || undefined })
      setData(result.data as Destination[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, showDeleted, countryFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, countryFilter])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<Destination>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "destinationType", header: "Type", render: (item) => item.destinationType?.name ?? "—" },
    { key: "country", header: "Country", render: (item) => item.country?.name ?? "—", hideOnMobile: true },
    { key: "city", header: "City", render: (item) => item.city?.name ?? "—" },
    { key: "sortOrder", header: "Sort", sortable: true, hideOnMobile: true },
    { key: "isActive", header: "Status", render: (item) => <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.isActive ? "Active" : "Inactive"}</span> },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Destinations</h1>
          <p className="text-sm text-[#9CA3AF]">Manage tour destinations</p>
        </div>
        <Link href="/admin/geography/destinations/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
          <Plus className="size-4" /> Add Destination
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
          <option value="">All Countries</option>
          {countries.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
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
        searchPlaceholder="Search destinations..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteDestination(id).then(fetchData)}
        onRestore={(id) => restoreDestination(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => (
          <Link href={`/admin/geography/destinations/${item.id}/edit`} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Pencil className="size-4" />
          </Link>
        )}
      />
    </motion.div>
  )
}
