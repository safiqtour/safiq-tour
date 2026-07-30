"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, LayoutGrid, Star } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import {
  getPackageCategories,
  deletePackageCategory,
  restorePackageCategory,
  toggleFeaturedCategory,
} from "@/modules/business/package-category/actions/package-category"
import type { PackageCategoryListItem } from "@/modules/business/package-category/types"
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
}

export default function PackageCategoriesPage() {
  const [data, setData] = useState<PackageCategoryListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("displayOrder")
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [featuredFilter, setFeaturedFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPackageCategories({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        status: statusFilter || undefined,
        isFeatured: featuredFilter || undefined,
      })
      setData((result.data ?? []) as unknown as PackageCategoryListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, showDeleted, statusFilter, featuredFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, statusFilter, featuredFilter])
  useEffect(() => { canUser("master.package-category:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<PackageCategoryListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className={`flex size-8 items-center justify-center rounded-lg ${COLOR_CLASSES[item.color] ?? "bg-gray-100 text-gray-700"}`}>
          <LayoutGrid className="size-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{item.name}</span>
            {item.isFeatured && <Star className="size-3.5 fill-amber-400 text-amber-400" />}
          </div>
          <span className="text-xs text-[#9CA3AF]">{item.code} · {item.shortName}</span>
        </div>
      </div>
    )},
    { key: "displayOrder", header: "Order", sortable: true, hideOnMobile: true },
    { key: "isFeatured", header: "Featured", sortable: true, render: (item) => (
      <button
        onClick={() => toggleFeaturedCategory(item.id).then(fetchData)}
        className={`rounded-lg p-1.5 transition-colors ${
          item.isFeatured ? "text-amber-400 hover:bg-amber-50" : "text-gray-300 hover:bg-gray-50"
        }`}
        title={item.isFeatured ? "Unfeature" : "Feature"}
      >
        <Star className={`size-4 ${item.isFeatured ? "fill-amber-400" : ""}`} />
      </button>
    )},
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
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Package Categories</h1>
          <p className="text-sm text-[#9CA3AF]">Manage package category master data</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/master/package-categories/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Add Category
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
        <select
          value={featuredFilter}
          onChange={(e) => setFeaturedFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
          <option value="">All Featured</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
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
        onDelete={(id) => deletePackageCategory(id).then(fetchData)}
        onRestore={(id) => restorePackageCategory(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <Link
            href={`/admin/master/package-categories/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
