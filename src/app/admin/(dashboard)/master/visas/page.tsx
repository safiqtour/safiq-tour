"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Globe } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getVisas, deleteVisa, restoreVisa } from "@/modules/business/visa/actions/visa"
import { VISA_TYPES, ENTRY_TYPES } from "@/modules/business/visa/types"
import type { VisaListItem } from "@/modules/business/visa/types"
import { canUser } from "@/actions/permissions"

export default function VisasPage() {
  const [data, setData] = useState<VisaListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [countryFilter, setCountryFilter] = useState("")
  const [visaTypeFilter, setVisaTypeFilter] = useState("")
  const [entryTypeFilter, setEntryTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getVisas({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        countryId: countryFilter || undefined,
        visaType: visaTypeFilter || undefined,
        entryType: entryTypeFilter || undefined,
        status: statusFilter || undefined,
      })
      setData((result.data ?? []) as unknown as VisaListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, showDeleted, countryFilter, visaTypeFilter, entryTypeFilter, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, countryFilter, visaTypeFilter, entryTypeFilter, statusFilter])
  useEffect(() => { canUser("master.visa:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<VisaListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0B3C6D]">
          <Globe className="size-4" />
        </div>
        <div>
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-xs text-[#9CA3AF]">{item.code}</span>
        </div>
      </div>
    )},
    { key: "country", header: "Country", sortable: true, render: (item) => <span className="text-sm">{item.country?.name ?? "—"}</span> },
    { key: "visaType", header: "Visa Type", sortable: true, render: (item) => (
      <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">{item.visaType}</span>
    )},
    { key: "entryType", header: "Entry", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">{item.entryType}</span>
    )},
    { key: "processingDays", header: "Days", sortable: true, hideOnMobile: true, render: (item) => `${item.processingDays}d` },
    { key: "isElectronic", header: "E-Visa", hideOnMobile: true, render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.isElectronic ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
        {item.isElectronic ? "Yes" : "No"}
      </span>
    )},
    { key: "status", header: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Visas</h1>
          <p className="text-sm text-[#9CA3AF]">Manage visa master data</p>
        </div>
        {canCreate && (
          <Link href="/admin/master/visas/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
            <Plus className="size-4" /> Add Visa
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]">
          <option value="">All Countries</option>
        </select>
        <select value={visaTypeFilter} onChange={(e) => setVisaTypeFilter(e.target.value)} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]">
          <option value="">All Visa Types</option>
          {VISA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={entryTypeFilter} onChange={(e) => setEntryTypeFilter(e.target.value)} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]">
          <option value="">All Entry Types</option>
          {ENTRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]">
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
        searchPlaceholder="Search by name or code..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteVisa(id).then(fetchData)}
        onRestore={(id) => restoreVisa(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <Link href={`/admin/master/visas/${item.id}/edit`} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors">
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
