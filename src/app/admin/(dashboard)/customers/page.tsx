"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Users } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import {
  getPilgrims,
  deletePilgrim,
  restorePilgrim,
} from "@/modules/pilgrim/actions/pilgrim"
import type { PilgrimListItem } from "@/modules/pilgrim/types"
import { canUser } from "@/actions/permissions"

export default function CustomersPage() {
  const [data, setData] = useState<PilgrimListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [genderFilter, setGenderFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getPilgrims({
        page,
        limit: 10,
        search,
        sort,
        order,
        includeDeleted: showDeleted || undefined,
        status: statusFilter || undefined,
        gender: genderFilter || undefined,
      })
      setData(result.data)
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, showDeleted, statusFilter, genderFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, statusFilter, genderFilter])
  useEffect(() => { canUser("pilgrim:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<PilgrimListItem>[] = [
    { key: "name", header: "Name", sortable: true, render: (item) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0B3C6D]/10 text-[#0B3C6D]">
          <Users className="size-4" />
        </div>
        <div>
          <span className="font-medium">{item.name}</span>
          <span className="ml-2 text-xs text-[#9CA3AF]">{item.code}</span>
        </div>
      </div>
    )},
    { key: "gender", header: "Gender", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{item.gender === "MALE" ? "Male" : "Female"}</span>
    )},
    { key: "phone", header: "Contact", hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{item.phone ?? item.email ?? "—"}</span>
    )},
    { key: "passportNumber", header: "Passport", hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{item.passportNumber ?? "—"}</span>
    )},
    { key: "status", header: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
        item.status === "ACTIVE"
          ? "bg-green-50 text-green-700"
          : item.status === "INACTIVE"
            ? "bg-amber-50 text-amber-700"
            : "bg-red-50 text-red-700"
      }`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Customers (Jamaah)</h1>
          <p className="text-sm text-[#9CA3AF]">Manage pilgrim / customer records with documents</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/customers/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Add Customer
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
          <option value="BLOCKED">Blocked</option>
        </select>
        <select
          value={genderFilter}
          onChange={(e) => setGenderFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
          <option value="">All Genders</option>
          <option value="MALE">Male</option>
          <option value="FEMALE">Female</option>
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
        searchPlaceholder="Search by name, code, passport, phone, or email..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deletePilgrim(id).then(fetchData)}
        onRestore={(id) => restorePilgrim(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <Link
            href={`/admin/customers/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
