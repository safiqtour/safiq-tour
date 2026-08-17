"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Plane } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getAirlines, deleteAirline, restoreAirline } from "@/actions/airline"
import type { AirlineListItem } from "@/types/hospitality"

export default function AirlinesPage() {
  const [data, setData] = useState<AirlineListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getAirlines({ page, limit: 10, search, sort, order, includeDeleted: showDeleted || undefined })
      setData((result.data ?? []) as unknown as AirlineListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, showDeleted])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<AirlineListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
          {item.logoMedia?.url ? <img src={item.logoMedia.url} alt="" className="size-full object-contain" /> : <Plane className="size-4 text-gray-400" />}
        </div>
        <span className="font-medium">{item.name}</span>
      </div>
    )},
    { key: "iataCode", header: "IATA", sortable: true, hideOnMobile: true, render: (item) => item.iataCode ?? "—" },
    { key: "country", header: "Country", hideOnMobile: true, render: (item) => item.country?.name ?? "—" },
    { key: "website", header: "Website", hideOnMobile: true, render: (item) => item.website ? <a href={item.website} target="_blank" className="text-blue-600 hover:underline text-xs">{item.website.replace(/^https?:\/\//, "").slice(0, 20)}</a> : "—" },
    { key: "status", header: "Status", render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Airlines</h1>
          <p className="text-sm text-[#9CA3AF]">Manage airline master data</p>
        </div>
        <Link href="/admin/hospitality/airlines/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
          <Plus className="size-4" /> Add Airline
        </Link>
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
        searchPlaceholder="Search airlines..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteAirline(id).then(fetchData)}
        onRestore={(id) => restoreAirline(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => (
          <Link href={`/admin/hospitality/airlines/${item.id}/edit`} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Pencil className="size-4" />
          </Link>
        )}
      />
    </motion.div>
  )
}
