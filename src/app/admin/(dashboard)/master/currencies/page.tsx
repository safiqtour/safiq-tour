"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil, Star, StarOff } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getCurrencies, deleteCurrency, restoreCurrency, setBaseCurrency } from "@/modules/business/currency/actions/currency"
import type { CurrencyListItem } from "@/modules/business/currency/types"
import { canUser } from "@/actions/permissions"

export default function CurrenciesPage() {
  const [data, setData] = useState<CurrencyListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("sortOrder")
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getCurrencies({
        page, limit: 10, search, sort, order,
        includeDeleted: showDeleted || undefined,
        status: statusFilter || undefined,
      })
      setData((result.data ?? []) as unknown as CurrencyListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch { setData([]) }
    finally { setLoading(false) }
  }, [page, search, sort, order, showDeleted, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, statusFilter])
  useEffect(() => { canUser("master.currency:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const handleSetBase = async (id: string) => {
    await setBaseCurrency(id)
    fetchData()
  }

  const formatRate = (rate: number) => {
    if (rate >= 1) return rate.toFixed(4)
    return rate.toFixed(6)
  }

  const columns: Column<CurrencyListItem>[] = [
    { key: "name", header: "Currency", sortable: true, render: (item) => (
      <div className="flex items-center gap-2">
        <div className="flex size-8 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#0B3C6D] font-bold text-sm">
          {item.symbol}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{item.name}</span>
            {item.isBaseCurrency && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                <Star className="size-3" /> BASE
              </span>
            )}
          </div>
          <span className="text-xs text-[#9CA3AF]">{item.isoCode} · {item.code}</span>
        </div>
      </div>
    )},
    { key: "isoCode", header: "ISO", sortable: true, hideOnMobile: true },
    { key: "exchangeRate", header: "Rate", sortable: true, hideOnMobile: true, render: (item) => formatRate(item.exchangeRate) },
    { key: "country", header: "Country", hideOnMobile: true, render: (item) => item.country?.name ?? "—" },
    { key: "sortOrder", header: "Order", sortable: true, hideOnMobile: true },
    { key: "status", header: "Status", sortable: true, render: (item) => (
      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.status}</span>
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Currencies</h1>
          <p className="text-sm text-[#9CA3AF]">Manage currency master data</p>
        </div>
        {canCreate && (
          <Link href="/admin/master/currencies/new" className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]">
            <Plus className="size-4" /> Add Currency
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
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
        searchPlaceholder="Search by name, ISO code, or symbol..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteCurrency(id).then(fetchData)}
        onRestore={(id) => restoreCurrency(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canCreate ? (
          <div className="flex items-center gap-1">
            {!item.isBaseCurrency && !item.deletedAt && (
              <button
                onClick={() => handleSetBase(item.id)}
                className="rounded-lg p-1.5 text-[#6B7280] hover:bg-amber-50 hover:text-amber-600 transition-colors"
                title="Set as Base Currency"
              >
                <StarOff className="size-4" />
              </button>
            )}
            <Link
              href={`/admin/master/currencies/${item.id}/edit`}
              className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Pencil className="size-4" />
            </Link>
          </div>
        ) : null}
      />
    </motion.div>
  )
}
