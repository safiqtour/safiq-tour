"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/admin/packages/data-table"
import { deletePackage, duplicatePackage, toggleFeatured, updatePackageStatus } from "@/actions/packages"

export default function PackagesPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")
  const [status, setStatus] = useState("")
  const [page, setPage] = useState(1)
  const [data, setData] = useState<{
    data: never[]
    total: number
    page: number
    totalPages: number
  }>({ data: [], total: 0, page: 1, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams({ search, category, status, page: String(page), pageSize: "10" })
    fetch(`/api/packages?${params}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [search, category, status, page, refreshKey])

  // Refresh the list only after a successful delete (deletePackage throws on failure).
  const handleDelete = async (id: string) => {
    await deletePackage(id)
    setRefreshKey((k) => k + 1)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 rounded-xl bg-[#E5E7EB] animate-pulse" />
        <div className="h-12 rounded-xl bg-[#E5E7EB] animate-pulse" />
        <div className="h-96 rounded-2xl bg-[#E5E7EB] animate-pulse" />
      </div>
    )
  }

  return (
    <DataTable
      data={data.data as never[]}
      total={data.total}
      page={data.page}
      totalPages={data.totalPages}
      search={search}
      category={category}
      status={status}
      onSearchChange={(v) => { setSearch(v); setPage(1) }}
      onCategoryChange={(v) => { setCategory(v); setPage(1) }}
      onStatusChange={(v) => { setStatus(v); setPage(1) }}
      onPageChange={setPage}
      onDelete={handleDelete}
      onDuplicate={duplicatePackage}
      onToggleFeatured={toggleFeatured}
      onStatusUpdate={updatePackageStatus}
    />
  )
}
