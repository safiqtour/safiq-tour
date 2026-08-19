"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Copy,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
} from "lucide-react"
import { formatPrice, formatDepartureLabel } from "@/lib/packages/utils"
import { normalizeImageUrl } from "@/lib/utils"
import type { PackageStatus } from "@/lib/packages/types"

interface PackageListItem {
  id: string
  title: string
  slug: string
  category: string
  price: number
  promoPrice: number | null
  status: string
  featured: boolean
  badge: string | null
  thumbnail: string
  quota: number
  seatFilled: number
  createdAt: string
  schedules: { departureLabel: string | null; departureDate: string | Date | null }[]
}

interface DataTableProps {
  data: PackageListItem[]
  total: number
  page: number
  totalPages: number
  search: string
  category: string
  status: string
  onSearchChange: (v: string) => void
  onCategoryChange: (v: string) => void
  onStatusChange: (v: string) => void
  onPageChange: (v: number) => void
  onDelete: (id: string) => Promise<void>
  onDuplicate: (id: string) => Promise<void>
  onToggleFeatured: (id: string, featured: boolean) => Promise<void>
  onStatusUpdate: (id: string, status: PackageStatus) => Promise<void>
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-600",
  PUBLISHED: "bg-emerald-100 text-emerald-600",
  COMING_SOON: "bg-blue-100 text-blue-600",
  SOLD_OUT: "bg-red-100 text-red-600",
  FINISHED: "bg-purple-100 text-purple-600",
}

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  COMING_SOON: "Coming Soon",
  SOLD_OUT: "Sold Out",
  FINISHED: "Finished",
}

const categories = ["", "REGULAR", "PLUS", "EXECUTIVE", "LUXURY", "PRIVATE"]

export function DataTable({
  data, total, page, totalPages, search, category, status,
  onSearchChange, onCategoryChange, onStatusChange, onPageChange,
  onDelete, onDuplicate, onToggleFeatured, onStatusUpdate,
}: DataTableProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (id: string, action: string, fn: () => Promise<void>) => {
    // Re-entry guard: ignore repeat invocations while any action is in flight
    // (double click would fire the server action twice -> P2025 on the second).
    if (loading) return
    setLoading(`${action}-${id}`)
    try {
      await fn()
      toast.success("Berhasil!")
    } catch (error) {
      // Log the real cause; the server action throws Error with a clear message.
      console.error(`[DataTable] ${action} failed for id=${id}:`, error)
      toast.error(error instanceof Error && error.message ? error.message : "Gagal!")
    } finally {
      setLoading(null)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Paket Umroh</h1>
          <p className="text-sm text-[#9CA3AF]">{total} paket tersedia</p>
        </div>
        <Link
          href="/admin/packages/new"
          className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
        >
          <Plus className="size-4" />
          Tambah Paket
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama, negara, maskapai, hotel..."
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
          />
        </div>
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
        >
          <option value="">Semua Kategori</option>
          {categories.filter(Boolean).map((c) => (
            <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
        >
          <option value="">Semua Status</option>
          {Object.entries(statusLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase w-12">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Nama Paket</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Kategori</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Harga</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Keberangkatan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Seat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-[#9CA3AF] uppercase">Status</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-[#9CA3AF] uppercase">Featured</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-[#9CA3AF] uppercase">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {data.map((pkg, i) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="relative size-10 rounded-xl overflow-hidden border border-[#E5E7EB]">
                        {pkg.thumbnail ? (
                          <Image src={normalizeImageUrl(pkg.thumbnail)} alt="" fill className="object-cover" sizes="40px" />
                        ) : (
                          <div className="flex size-full items-center justify-center bg-[#F8FAFC] text-xs text-[#9CA3AF]">No</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-[#0B3C6D]">{pkg.title}</p>
                        <p className="text-xs text-[#9CA3AF]">{pkg.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-lg bg-[#F8FAFC] px-2.5 py-1 text-xs font-medium text-[#6B7280] border border-[#E5E7EB]">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0B3C6D]">{formatPrice(pkg.price)}</p>
                        {/* Explicit > 0 check: a bare `promoPrice &&` would render the number 0 */}
                        {pkg.promoPrice != null && pkg.promoPrice > 0 && (
                          <p className="text-xs text-[#C89B3C]">{formatPrice(pkg.promoPrice)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#6B7280]">
                      {formatDepartureLabel(
                        pkg.schedules[0]?.departureLabel ?? pkg.schedules[0]?.departureDate
                      ) ?? "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 rounded-full bg-[#E5E7EB] overflow-hidden max-w-[60px]">
                          <div
                            className="h-full rounded-full bg-[#C89B3C]"
                            style={{ width: `${Math.min(100, (pkg.seatFilled / Math.max(1, pkg.quota)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-[#6B7280]">{pkg.seatFilled}/{pkg.quota}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${statusColors[pkg.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {pkg.status === "PUBLISHED" ? <CheckCircle className="size-3" /> : <XCircle className="size-3" />}
                        {statusLabels[pkg.status] ?? pkg.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleAction(pkg.id, "featured", () => onToggleFeatured(pkg.id, !pkg.featured))}
                        className={`transition-colors ${pkg.featured ? "text-[#C89B3C]" : "text-[#D1D5DB] hover:text-[#C89B3C]"}`}
                      >
                        {loading === `featured-${pkg.id}` ? <Loader2 className="size-4 animate-spin" /> : <Star className="size-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/packages/${pkg.slug}`} target="_blank" className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors">
                          <Eye className="size-4" />
                        </Link>
                        <Link href={`/admin/packages/${pkg.id}/edit`} className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-blue-600 transition-colors">
                          <Pencil className="size-4" />
                        </Link>
                        <button onClick={() => handleAction(pkg.id, "duplicate", () => onDuplicate(pkg.id))} className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-[#F8FAFC] hover:text-[#C89B3C] transition-colors">
                          {loading === `duplicate-${pkg.id}` ? <Loader2 className="size-4 animate-spin" /> : <Copy className="size-4" />}
                        </button>
                        <button
                          onClick={() => handleAction(pkg.id, "delete", () => onDelete(pkg.id))}
                          disabled={loading === `delete-${pkg.id}`}
                          className="flex size-8 items-center justify-center rounded-lg text-[#9CA3AF] hover:bg-red-50 hover:text-red-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {loading === `delete-${pkg.id}` ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                        </button>
                        <select
                          value={pkg.status}
                          onChange={(e) => handleAction(pkg.id, "status", () => onStatusUpdate(pkg.id, e.target.value as PackageStatus))}
                          className="ml-1 rounded-lg border border-[#E5E7EB] px-2 py-1 text-xs text-[#6B7280] outline-none hover:border-[#C89B3C] transition-colors"
                        >
                          {Object.entries(statusLabels).map(([k, v]) => (
                            <option key={k} value={k}>{v}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
              {data.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                    Tidak ada paket ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-[#E5E7EB] px-4 py-3">
            <p className="text-sm text-[#9CA3AF]">
              {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} dari {total}
            </p>
            <div className="flex gap-1">
              <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F8FAFC] disabled:opacity-30 transition-colors">
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className={`flex size-8 items-center justify-center rounded-lg text-sm transition-colors ${
                    page === i + 1 ? "bg-[#0B3C6D] text-white" : "text-[#6B7280] hover:bg-[#F8FAFC]"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="flex size-8 items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F8FAFC] disabled:opacity-30 transition-colors">
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
