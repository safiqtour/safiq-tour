"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Pencil } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getCountries, deleteCountry, restoreCountry } from "@/actions/country"

type Country = NonNullable<Awaited<ReturnType<typeof getCountries>>["data"][number]>

export default function CountriesPage() {
  const [data, setData] = useState<Country[]>([])
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
      const result = await getCountries({ page, limit: 10, search, sort, order, includeDeleted: showDeleted || undefined })
      setData(result.data as Country[])
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

  const columns: Column<Country>[] = [
    { key: "name", header: "Name", sortable: true },
    { key: "code", header: "Code", sortable: true },
    { key: "phoneCode", header: "Phone", hideOnMobile: true },
    { key: "flag", header: "Flag", hideOnMobile: true, render: (item) => item.flag || "—" },
    { key: "sortOrder", header: "Sort", sortable: true, hideOnMobile: true },
    { key: "_count", header: "Regions", render: (item) => String(item._count.regions), hideOnMobile: true },
    { key: "isActive", header: "Status", render: (item) => <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{item.isActive ? "Active" : "Inactive"}</span> },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Countries</h1>
          <p className="text-sm text-[#9CA3AF]">Manage countries</p>
        </div>
        <Link
          href="/admin/geography/countries/new"
          className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
        >
          <Plus className="size-4" />
          Add Country
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
        searchPlaceholder="Search countries..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteCountry(id).then(fetchData)}
        onRestore={(id) => restoreCountry(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => (
          <Link
            href={`/admin/geography/countries/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Pencil className="size-4" />
          </Link>
        )}
      />
    </motion.div>
  )
}
