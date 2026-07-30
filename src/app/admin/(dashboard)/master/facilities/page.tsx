"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Hotel, Bus, Plane, Shield, Heart, UtensilsCrossed, Wifi, Briefcase, Map, Package, FileCheck, Smartphone, Stethoscope, Coffee, CupSoda, BookOpen, UserCheck, Luggage, Shirt, ConciergeBell, Droplets, Car, Train, Zap, Sofa, FileText, Accessibility, MapPin, ShoppingBag, type LucideIcon } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getFacilities, deleteFacility, restoreFacility } from "@/modules/business/facility/actions/facility"
import { FACILITY_CATEGORIES } from "@/modules/business/facility/types"
import type { FacilityListItem } from "@/modules/business/facility/types"
import { canUser } from "@/actions/permissions"

const iconMap: Record<string, LucideIcon> = {
  Hotel, Bus, Plane, Shield, Heart, UtensilsCrossed, Wifi, Briefcase, Map, Package,
  FileCheck, Smartphone, Stethoscope, Coffee, CupSoda, BookOpen, UserCheck, Luggage,
  Shirt, ConciergeBell, Droplets, Car, Train, Zap, Sofa, FileText, Accessibility,
  MapPin, ShoppingBag,
}

export default function FacilitiesPage() {
  const [data, setData] = useState<FacilityListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [canCreate, setCanCreate] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getFacilities({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      })
      setData((result.data ?? []) as unknown as FacilityListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, showDeleted, categoryFilter, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, categoryFilter, statusFilter])
  useEffect(() => { canUser("master.facility:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const renderIcon = (iconName: string) => {
    const Icon = iconMap[iconName]
    if (!Icon) return null
    return <Icon className="size-4" />
  }

  const columns: Column<FacilityListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0B3C6D]">
          {renderIcon(item.icon)}
        </div>
        <div>
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-xs text-[#9CA3AF]">{item.code}</span>
        </div>
      </div>
    )},
    { key: "category", header: "Category", sortable: true, render: (item) => (
      <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{item.category}</span>
    )},
    { key: "sortOrder", header: "Order", sortable: true, hideOnMobile: true },
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
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Facilities</h1>
          <p className="text-sm text-[#9CA3AF]">Manage facility master data</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/master/facilities/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Add Facility
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
          <option value="">All Categories</option>
          {FACILITY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
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
        searchPlaceholder="Search by name, code, or category..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteFacility(id).then(fetchData)}
        onRestore={(id) => restoreFacility(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <Link
            href={`/admin/master/facilities/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
