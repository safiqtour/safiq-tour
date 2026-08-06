"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Plus, Eye } from "lucide-react"
import Link from "next/link"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getBookings } from "@/modules/booking/actions/booking"
import type { BookingListItem } from "@/modules/booking/types"
import { canUser } from "@/actions/permissions"
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge"

const STATUS_OPTIONS = ["DRAFT", "CONFIRMED", "PAID", "CANCELLED"]

function formatDate(iso: string | null): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

function formatCurrency(value: number): string {
  return `Rp ${(value ?? 0).toLocaleString("id-ID")}`
}

export default function BookingsPage() {
  const [data, setData] = useState<BookingListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [statusFilter, setStatusFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getBookings({
        page,
        limit: 10,
        search,
        sort,
        order,
        status: statusFilter || undefined,
      })
      setData(result.data)
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, statusFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, statusFilter])
  useEffect(() => { canUser("booking:create").then(setCanCreate) }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<BookingListItem>[] = [
    { key: "bookingNumber", header: "Booking Number", sortable: true, render: (item) => (
      <span className="font-medium text-[#0B3C6D]">{item.bookingNumber}</span>
    )},
    { key: "customerName", header: "Customer", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{item.customerName || "—"}</span>
    )},
    { key: "packageTitle", header: "Package", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{item.packageTitle || "—"}</span>
    )},
    { key: "departureDate", header: "Departure Date", sortable: true, hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{formatDate(item.departureDate)}</span>
    )},
    { key: "totalPrice", header: "Total Price", render: (item) => (
      <span className="text-sm text-[#0B3C6D]">{formatCurrency(item.totalPrice)}</span>
    )},
    { key: "downPayment", header: "Down Payment", hideOnMobile: true, render: (item) => (
      <span className="text-sm text-[#6B7280]">{formatCurrency(item.downPayment)}</span>
    )},
    { key: "remainingBalance", header: "Remaining Balance", hideOnMobile: true, render: (item) => (
      <span className="text-sm font-medium text-[#0B3C6D]">{formatCurrency(item.remainingBalance)}</span>
    )},
    { key: "status", header: "Status", sortable: true, render: (item) => (
      <BookingStatusBadge status={item.status} />
    )},
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Bookings</h1>
          <p className="text-sm text-[#9CA3AF]">Manage booking records and schedules</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/bookings/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Add Booking
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
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
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
        searchPlaceholder="Search by booking number..."
        getId={(item) => item.id}
        actions={(item) => (
          <Link
            href={`/admin/bookings/${item.id}`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <Eye className="size-4" />
          </Link>
        )}
      />
    </motion.div>
  )
}
