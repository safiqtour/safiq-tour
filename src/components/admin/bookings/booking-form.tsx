"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Search, ChevronDown, Loader2, CalendarDays } from "lucide-react"
import { createBooking } from "@/modules/booking/actions/booking"
import { getCustomers } from "@/modules/customer/actions/customer"
import type { CustomerListItem } from "@/modules/customer/types"
import { getPackages, getPackageSchedules } from "@/actions/packages"

interface PackageOption {
  id: string
  title: string
}

interface ScheduleOption {
  id: string
  departureDate: string
  returnDate: string | null
  meetingPoint: string
  seat: number
  seatFilled: number
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

function formatMoney(value: number): string {
  return (value || 0).toLocaleString("id-ID")
}

export function BookingForm() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Customer (searchable select)
  const [customerSearch, setCustomerSearch] = useState("")
  const [customerResults, setCustomerResults] = useState<CustomerListItem[]>([])
  const [customerOpen, setCustomerOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null)
  const [loadingCustomers, setLoadingCustomers] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Package
  const [packages, setPackages] = useState<PackageOption[]>([])
  const [packageId, setPackageId] = useState("")

  // Schedule
  const [schedules, setSchedules] = useState<ScheduleOption[]>([])
  const [scheduleId, setScheduleId] = useState("")
  const [loadingSchedules, setLoadingSchedules] = useState(false)

  // Financial & notes
  const [totalPrice, setTotalPrice] = useState("")
  const [downPayment, setDownPayment] = useState("")
  const [notes, setNotes] = useState("")

  // Load packages once (published only, so users can only book available packages)
  useEffect(() => {
    getPackages({ page: 1, pageSize: 100, status: "PUBLISHED" })
      .then((res) => setPackages(res.data.map((p) => ({ id: p.id, title: p.title }))))
      .catch(() => setPackages([]))
  }, [])

  // Search customers (debounced)
  const searchCustomers = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      if (!query.trim()) { setCustomerResults([]); return }
      setLoadingCustomers(true)
      try {
        const res = await getCustomers({ page: 1, limit: 10, search: query })
        setCustomerResults(res.data)
      } catch {
        setCustomerResults([])
      } finally {
        setLoadingCustomers(false)
      }
    }, 300)
  }, [])

  // Load schedules when package changes (dynamic schedule select)
  useEffect(() => {
    setScheduleId("")
    setSchedules([])
    if (!packageId) return
    setLoadingSchedules(true)
    getPackageSchedules(packageId)
      .then((res) => setSchedules(res as ScheduleOption[]))
      .catch(() => setSchedules([]))
      .finally(() => setLoadingSchedules(false))
  }, [packageId])

  const selectedSchedule = schedules.find((s) => s.id === scheduleId)

  const availableSeat = (s: ScheduleOption): number => {
    if (s.seat === 0) return Number.POSITIVE_INFINITY
    return s.seat - s.seatFilled
  }

  const isFull = (s: ScheduleOption): boolean => s.seat > 0 && s.seatFilled >= s.seat

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCustomer) { setError("Pilih customer terlebih dahulu"); return }
    if (!packageId) { setError("Pilih paket terlebih dahulu"); return }
    if (!scheduleId) { setError("Pilih jadwal keberangkatan"); return }

    setError("")
    setSaving(true)
    try {
      const created = await createBooking({
        customerId: selectedCustomer.id,
        packageId,
        scheduleId,
        totalPrice: Number(totalPrice) || 0,
        downPayment: Number(downPayment) || 0,
        notes: notes || "",
      })
      router.push(`/admin/bookings/${created.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat booking")
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
  const labelCls = "mb-1.5 block text-sm font-medium text-[#6B7280]"

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}


        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Pelanggan</h2>

          {/* Searchable customer select */}
          <div className="relative">
            <label className={labelCls}>Customer</label>
            {selectedCustomer ? (
              <div className="flex items-center justify-between rounded-xl border border-[#C89B3C]/40 bg-[#C89B3C]/5 px-4 py-2.5 text-sm text-[#0B3C6D]">
                <span>{selectedCustomer.name}</span>
                <button
                  type="button"
                  onClick={() => { setSelectedCustomer(null); setCustomerSearch("") }}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
                  <input
                    value={customerSearch}
                    onChange={(e) => { setCustomerSearch(e.target.value); setCustomerOpen(true); searchCustomers(e.target.value) }}
                    onFocus={() => setCustomerOpen(true)}
                    placeholder="Cari customer berdasarkan nama / kode..."
                    className={`${inputCls} pl-10`}
                  />
                  <ChevronDown className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
                </div>
                {customerOpen && (
                  <div className="absolute z-20 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                    {loadingCustomers && (
                      <div className="flex items-center gap-2 px-4 py-3 text-sm text-[#9CA3AF]">
                        <Loader2 className="size-4 animate-spin" /> Mencari...
                      </div>
                    )}
                    {!loadingCustomers && customerResults.length === 0 && (
                      <p className="px-4 py-3 text-sm text-[#9CA3AF]">Ketik untuk mencari customer</p>
                    )}
                    {customerResults.map((c) => (
                      <button
                        type="button"
                        key={c.id}
                        onClick={() => { setSelectedCustomer({ id: c.id, name: c.name }); setCustomerOpen(false) }}
                        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-[#0B3C6D] hover:bg-[#F8FAFC]"
                      >
                        <span>{c.name}</span>
                        {c.code && <span className="text-xs text-[#9CA3AF]">{c.code}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>


        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Paket & Jadwal</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Paket</label>
              <select
                value={packageId}
                onChange={(e) => setPackageId(e.target.value)}
                className={inputCls}
              >
                <option value="">Pilih paket...</option>
                {packages.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Jadwal Keberangkatan</label>
              <select
                value={scheduleId}
                onChange={(e) => setScheduleId(e.target.value)}
                disabled={!packageId || loadingSchedules}
                className={inputCls}
              >
                <option value="">
                  {!packageId ? "Pilih paket dulu" : loadingSchedules ? "Memuat jadwal..." : "Pilih jadwal..."}
                </option>
                {schedules.map((s) => {
                  const full = isFull(s)
                  const seats = availableSeat(s)
                  return (
                    <option key={s.id} value={s.id} disabled={full}>
                      {formatDate(s.departureDate)}
                      {s.returnDate ? ` — ${formatDate(s.returnDate)}` : ""}
                      {s.meetingPoint ? ` · ${s.meetingPoint}` : ""} ·{" "}
                      {full
                        ? "Penuh"
                        : seats === Number.POSITIVE_INFINITY
                          ? `${s.seatFilled} terisi (tanpa batas)`
                          : `Sisa ${seats} kursi`}
                    </option>
                  )
                })}
              </select>
            </div>
          </div>

          {selectedSchedule && (
            <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#F8FAFC] border border-[#E5E7EB] p-4 text-sm text-[#0B3C6D]">
              <CalendarDays className="mt-0.5 size-4 text-[#C89B3C]" />
              <div className="space-y-0.5">
                <p><span className="font-medium">Berangkat:</span> {formatDate(selectedSchedule.departureDate)}</p>
                <p><span className="font-medium">Pulang:</span> {selectedSchedule.returnDate ? formatDate(selectedSchedule.returnDate) : "—"}</p>
                <p><span className="font-medium">Meeting Point:</span> {selectedSchedule.meetingPoint || "—"}</p>
                <p>
                  <span className="font-medium">Kursi:</span>{" "}
                  {isFull(selectedSchedule)
                    ? "Penuh"
                    : availableSeat(selectedSchedule) === Number.POSITIVE_INFINITY
                      ? "Tanpa batas"
                      : `Sisa ${availableSeat(selectedSchedule)}`}
                </p>
              </div>
            </div>
          )}
        </section>


        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Keuangan</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Total Harga (Rp)</label>
              <input type="number" min={0} value={totalPrice} onChange={(e) => setTotalPrice(e.target.value)} className={inputCls} placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>Uang Muka (Rp)</label>
              <input type="number" min={0} value={downPayment} onChange={(e) => setDownPayment(e.target.value)} className={inputCls} placeholder="0" />
            </div>
          </div>
          {totalPrice && (
            <p className="mt-3 text-xs text-[#9CA3AF]">
              Sisa tagihan: <span className="font-medium text-[#0B3C6D]">Rp {formatMoney(Number(totalPrice) - (Number(downPayment) || 0))}</span>
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <label className={labelCls}>Catatan</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Catatan tambahan (opsional)"
            className={`${inputCls} resize-none`}
          />
        </section>

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Menyimpan..." : "Simpan Booking"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

