"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Settings as SettingsIcon } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import {
  getBusinessSettings,
  deleteBusinessSetting,
  restoreBusinessSetting,
} from "@/modules/business/business-setting/actions/business-setting"
import { BUSINESS_SETTING_GROUPS } from "@/modules/business/business-setting/types"
import type { BusinessSettingListItem } from "@/modules/business/business-setting/types"
import { canUser } from "@/actions/permissions"

export default function BusinessSettingsPage() {
  const [data, setData] = useState<BusinessSettingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("sortOrder")
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [groupFilter, setGroupFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getBusinessSettings({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        group: groupFilter || undefined,
        status: statusFilter || undefined,
      })
      setData((result.data ?? []) as unknown as BusinessSettingListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, showDeleted, groupFilter, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, groupFilter, statusFilter])
  useEffect(() => { canUser("master.business-setting:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<BusinessSettingListItem>[] = [
    { key: "key", header: "Key", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0B3C6D]">
          <SettingsIcon className="size-4" />
        </div>
        <div>
          <span className="font-medium">{item.label}</span>
          <span className="ml-2 text-xs text-[#9CA3AF]">{item.key}</span>
        </div>
      </div>
    )},
    { key: "group", header: "Group", sortable: true, render: (item) => (
      <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{item.group}</span>
    )},
    { key: "valueType", header: "Type", sortable: true, render: (item) => (
      <span className="text-xs text-[#6B7280]">{item.valueType}</span>
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
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Business Settings</h1>
          <p className="text-sm text-[#9CA3AF]">Manage system configuration</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/master/business-settings/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Add Setting
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={groupFilter}
          onChange={(e) => setGroupFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
          <option value="">All Groups</option>
          {BUSINESS_SETTING_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
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
        searchPlaceholder="Search by key, label, or group..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteBusinessSetting(id).then(fetchData)}
        onRestore={(id) => restoreBusinessSetting(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <Link
            href={`/admin/master/business-settings/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
