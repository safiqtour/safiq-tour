"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Tag, Power, PowerOff } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getPromotions, deletePromotion, restorePromotion, togglePromotionStatus } from "@/modules/business/promotion/actions/promotion"
import { PROMOTION_TYPES } from "@/modules/business/promotion/types"
import type { PromotionListItem } from "@/modules/business/promotion/types"
import { canUser } from "@/actions/permissions"

export default function PromotionsPage() {
  const [data, setData] = useState<PromotionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("priority")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPromotions({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        promotionType: typeFilter || undefined,
        status: statusFilter || undefined,
      })
      setData((result.data ?? []) as unknown as PromotionListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, showDeleted, typeFilter, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, typeFilter, statusFilter])
  useEffect(() => { canUser("master.promotion:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const formatDate = (d: Date | string) => new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })

  const columns: Column<PromotionListItem>[] = [
    { key: "name", header: "Promotion", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0B3C6D]">
          <Tag className="size-4" />
        </div>
        <div>
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-xs text-[#9CA3AF]">{item.code}</span>
          <div className="flex items-center gap-1 mt-0.5">
            {item.isAutoApply && <span className="inline-flex rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">Auto</span>}
            {item.isPublic ? <span className="inline-flex rounded-full bg-green-50 px-1.5 py-0.5 text-[10px] font-medium text-green-700">Public</span> : <span className="inline-flex rounded-full bg-gray-50 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">Private</span>}
          </div>
        </div>
      </div>
    )},
    { key: "promotionType", header: "Type", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="inline-flex rounded-full bg-purple-50 px-2 py-0.5 text-xs font-medium text-purple-700">{item.promotionType}</span>
    )},
    { key: "discountType", header: "Discount", hideOnMobile: true, render: (item) => (
      <span>{item.discountType === "PERCENTAGE" ? `${item.discountValue}%` : `Rp${item.discountValue.toLocaleString("id-ID")}`}</span>
    )},
    { key: "startDate", header: "Period", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="text-xs">{formatDate(item.startDate)} — {formatDate(item.endDate)}</span>
    )},
    { key: "priority", header: "Priority", sortable: true, hideOnMobile: true },
    { key: "status", header: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Promotions</h1>
          <p className="text-sm text-[#9CA3AF]">Manage promotion master data</p>
        </div>
        {canCreate && (
          <Link href="/admin/master/promotions/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
            <Plus className="size-4" /> Add Promotion
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]">
          <option value="">All Types</option>
          {PROMOTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
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
        searchPlaceholder="Search by name, code, or type..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deletePromotion(id).then(fetchData)}
        onRestore={(id) => restorePromotion(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <div className="flex items-center gap-1">
            {!item.deletedAt && (
              <button
                onClick={() => togglePromotionStatus(item.id).then(fetchData)}
                className={`rounded-lg p-1.5 transition-colors ${item.status === "ACTIVE" ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"}`}
                title={item.status === "ACTIVE" ? "Deactivate" : "Activate"}
              >
                {item.status === "ACTIVE" ? <Power className="size-4" /> : <PowerOff className="size-4" />}
              </button>
            )}
            <Link href={`/admin/master/promotions/${item.id}/edit`} className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors">
              <Pencil className="size-4" />
            </Link>
          </div>
        ) : null}
      />
    </motion.div>
  )
}
