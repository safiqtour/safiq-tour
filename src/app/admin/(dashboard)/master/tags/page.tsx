"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Tag as TagIcon } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import {
  getTags,
  deleteTag,
  restoreTag,
} from "@/modules/business/tag/actions/tag"
import type { TagListItem } from "@/modules/business/tag/types"
import { canUser } from "@/actions/permissions"

const COLOR_CLASSES: Record<string, string> = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-700",
  amber: "bg-amber-100 text-amber-700",
  purple: "bg-purple-100 text-purple-700",
  rose: "bg-rose-100 text-rose-700",
  emerald: "bg-emerald-100 text-emerald-700",
  cyan: "bg-cyan-100 text-cyan-700",
  orange: "bg-orange-100 text-orange-700",
  red: "bg-red-100 text-red-700",
  indigo: "bg-indigo-100 text-indigo-700",
}

export default function TagsPage() {
  const [data, setData] = useState<TagListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("displayOrder")
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getTags({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        status: statusFilter || undefined,
      })
      setData((result.data ?? []) as unknown as TagListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, showDeleted, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, statusFilter])
  useEffect(() => { canUser("master.tag:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<TagListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className={`flex size-8 items-center justify-center rounded-lg ${COLOR_CLASSES[item.color] ?? "bg-gray-100 text-gray-700"}`}>
          <TagIcon className="size-4" />
        </div>
        <div>
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-xs text-[#9CA3AF]">{item.code} · {item.shortName}</span>
        </div>
      </div>
    )},
    { key: "displayOrder", header: "Order", sortable: true, hideOnMobile: true },
    { key: "status", header: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
      }`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Tags</h1>
          <p className="text-sm text-[#9CA3AF]">Manage universal tag taxonomy</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/master/tags/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Add Tag
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
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
        searchPlaceholder="Search by name, code, or short name..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteTag(id).then(fetchData)}
        onRestore={(id) => restoreTag(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <Link
            href={`/admin/master/tags/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
