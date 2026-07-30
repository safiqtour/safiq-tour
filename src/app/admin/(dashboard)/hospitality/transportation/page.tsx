"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Bus } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getTransportations, deleteTransportation, restoreTransportation } from "@/actions/transportation"
import type { TransportationListItem } from "@/types/hospitality"

const TYPE_LABELS: Record<string, string> = { BUS: "Bus", HIACE: "Hiace", COASTER: "Coaster", SUV: "SUV", SEDAN: "Sedan", TRAIN: "Train", SHIP: "Ship" }

export default function TransportationPage() {
  const [data, setData] = useState<TransportationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [typeFilter, setTypeFilter] = useState("")
  const [status, setStatus] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getTransportations({ page, limit: 10, search, sort, order, type: typeFilter || undefined, status: status || undefined, includeDeleted: showDeleted || undefined })
      setData((result.data ?? []) as unknown as TransportationListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, typeFilter, status, showDeleted])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, typeFilter, status, showDeleted])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<TransportationListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="size-8 rounded-lg bg-gray-100 flex items-center justify-center"><Bus className="size-4 text-gray-400" /></div>
        <span className="font-medium">{item.name}</span>
      </div>
    )},
    { key: "type", header: "Type", sortable: true, render: (item) => (
      <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{TYPE_LABELS[item.type] ?? item.type}</span>
    )},
    { key: "capacity", header: "Capacity", sortable: true, hideOnMobile: true },
    { key: "status", header: "Status", render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Transportation</h1>
          <p className="text-sm text-[#9CA3AF]">Manage transportation master data</p>
        </div>
        <Link href="/admin/hospitality/transportation/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
          <Plus className="size-4" /> Add Transportation
        </Link>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-xl border border-gray-200 px-3 py-2 text-xs outline-none">
          <option value="">All Types</option>
          {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
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
        searchPlaceholder="Search transportation..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteTransportation(id).then(fetchData)}
        onRestore={(id) => restoreTransportation(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => (
          <Link href={`/admin/hospitality/transportation/${item.id}/edit`} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Pencil className="size-4" />
          </Link>
        )}
      />
    </motion.div>
  )
}
