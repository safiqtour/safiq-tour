"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, RotateCcw, Ban, Loader2, Plus } from "lucide-react"
import {
  getBooking,
  updateBookingStatus,
  cancelBooking,
  restoreBooking,
} from "@/modules/booking/actions/booking"
import { BOOKING_STATUSES } from "@/modules/booking/types"
import type { BookingDetail } from "@/modules/booking/types"
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge"
import { getJamaahList } from "@/modules/jamaah/actions/jamaah"
import type { JamaahListItem } from "@/modules/jamaah/types"
import { canUser } from "@/actions/permissions"

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

function formatCurrency(value: number): string {
  return `Rp ${(value ?? 0).toLocaleString("id-ID")}`
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">{label}</p>
      <p className="mt-1 text-sm font-medium text-[#0B3C6D]">{value}</p>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
      <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  )
}

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [actionError, setActionError] = useState("")
  const [jamaah, setJamaah] = useState<JamaahListItem[]>([])
  const [canReadJamaah, setCanReadJamaah] = useState(false)
  const [canCreateJamaah, setCanCreateJamaah] = useState(false)

  useEffect(() => { canUser("jamaah:read").then(setCanReadJamaah) }, [])
  useEffect(() => { canUser("jamaah:create").then(setCanCreateJamaah) }, [])

  const fetchDetail = useCallback(async () => {
    try {
      const res = await getBooking(id)
      if (!res) { setError("Booking tidak ditemukan"); return }
      setBooking(res)
    } catch {
      setError("Gagal memuat data booking")
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { fetchDetail() }, [fetchDetail])

  // Fetch Jamaah separately (not part of bookingInclude).
  useEffect(() => {
    if (!canReadJamaah) return
    getJamaahList({ bookingId: id, page: 1, limit: 100 })
      .then((res) => setJamaah(res.data))
      .catch(() => setJamaah([]))
  }, [canReadJamaah, id])

  const runAction = async (fn: () => Promise<unknown>) => {
    setBusy(true)
    setActionError("")
    try {
      await fn()
      await fetchDetail()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Aksi gagal")
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
      </div>
    )
  }

  if (error) return <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>

  if (!booking) return null

  const isDeleted = !!booking.deletedAt

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/admin/bookings")}
          className="flex size-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D] transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="flex-1">
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">{booking.bookingNumber}</h1>
          <div className="mt-1 flex items-center gap-2">
            <BookingStatusBadge status={booking.status} />
            {isDeleted && (
              <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">DELETED</span>
            )}
          </div>
        </div>
      </div>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{actionError}</div>
      )}

      <Section title="Informasi Booking">
        <Field label="Booking Number" value={booking.bookingNumber} />
        <Field label="Status" value={<BookingStatusBadge status={booking.status} />} />
        <Field label="Tanggal Dibuat" value={formatDateTime(booking.createdAt)} />
      </Section>

      <Section title="Customer">
        <Field label="Nama" value={booking.customer?.name ?? "—"} />
        <Field label="Telepon" value={booking.customer?.phone ?? "—"} />
        <Field label="Email" value={booking.customer?.email ?? "—"} />
      </Section>

      {canReadJamaah && (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-[#0B3C6D]">Jamaah</h2>
            {canCreateJamaah && (
              <button
                type="button"
                onClick={() => router.push(`/admin/bookings/${id}/jamaah/new`)}
                className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0B2D52] transition-colors"
              >
                <Plus className="size-4" /> Tambah Jamaah
              </button>
            )}
          </div>

          {jamaah.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#9CA3AF]">No jamaah registered yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#E5E7EB] text-xs uppercase tracking-wide text-[#9CA3AF]">
                    <th className="px-3 py-2 font-medium">No</th>
                    <th className="px-3 py-2 font-medium">Nama Jamaah</th>
                    <th className="px-3 py-2 font-medium">Passport Name</th>
                    <th className="px-3 py-2 font-medium">Gender</th>
                    <th className="px-3 py-2 font-medium">Passport Number</th>
                    <th className="px-3 py-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {jamaah.map((j, index) => (
                    <tr key={j.id} className="border-b border-[#F3F4F6] last:border-0">
                      <td className="px-3 py-3 text-[#9CA3AF]">{index + 1}</td>
                      <td className="px-3 py-3 font-medium text-[#0B3C6D]">{j.fullName}</td>
                      <td className="px-3 py-3 text-[#6B7280]">{j.passportName || "—"}</td>
                      <td className="px-3 py-3 text-[#6B7280]">{j.gender === "FEMALE" ? "Female" : "Male"}</td>
                      <td className="px-3 py-3 text-[#6B7280]">{j.passportNumber || "—"}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          j.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-700"
                        }`}>{j.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <Section title="Paket">
        <Field label="Nama Paket" value={booking.package?.title ?? "—"} />
        <Field label="Tanggal Berangkat" value={formatDate(booking.schedule?.departureDate)} />
        <Field label="Tanggal Pulang" value={formatDate(booking.schedule?.returnDate)} />
        <Field label="Meeting Point" value={booking.schedule?.meetingPoint || "—"} />
      </Section>

      <Section title="Keuangan">
        <Field label="Total Harga" value={formatCurrency(booking.totalPrice)} />
        <Field label="Uang Muka" value={formatCurrency(booking.downPayment)} />
        <Field label="Sisa Tagihan" value={formatCurrency(booking.remainingBalance)} />
      </Section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Aksi</h2>
        <div className="flex flex-wrap items-center gap-3">
          {isDeleted ? (
            <button
              onClick={() => runAction(() => restoreBooking(id))}
              disabled={busy}
              className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />} Restore Booking
            </button>
          ) : (
            <>
              <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                Status
                <select
                  value={booking.status}
                  disabled={busy || booking.status === "CANCELLED"}
                  onChange={(e) => runAction(() => updateBookingStatus(id, { status: e.target.value }))}
                  className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
                >
                  {BOOKING_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              {booking.status !== "CANCELLED" && (
                <button
                  onClick={() => runAction(() => cancelBooking(id))}
                  disabled={busy}
                  className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 disabled:opacity-50"
                >
                  <Ban className="size-4" /> Cancel Booking
                </button>
              )}
            </>
          )}
        </div>
      </section>
    </motion.div>
  )
}

