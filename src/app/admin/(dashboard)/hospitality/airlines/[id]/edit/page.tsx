"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ImageIcon } from "lucide-react"
import { getAirline, updateAirline } from "@/actions/airline"
import { getAllActiveCountries } from "@/actions/country"
import { MediaPicker } from "@/components/admin/media/media-picker"
import type { CountryBrief, AirlineListItem } from "@/types/hospitality"

export default function EditAirlinePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [countries, setCountries] = useState<CountryBrief[]>([])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [form, setForm] = useState({ name: "", iataCode: "", icaoCode: "", countryId: "", logoMediaId: "", website: "", callCenter: "", status: "ACTIVE" })

  useEffect(() => {
    getAllActiveCountries().then((res) => setCountries((res ?? []) as unknown as CountryBrief[])).catch(() => setCountries([]))
    getAirline(params.id as string).then((res) => {
      const a = res as unknown as AirlineListItem | null
      if (a) {
        setForm({ name: a.name ?? "", iataCode: a.iataCode ?? "", icaoCode: a.icaoCode ?? "", countryId: a.countryId ?? "", logoMediaId: a.logoMediaId ?? "", website: a.website ?? "", callCenter: a.callCenter ?? "", status: a.status ?? "ACTIVE" })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    setSaving(true); setError("")
    try {
      await updateAirline(params.id as string, form)
      router.push("/admin/hospitality/airlines")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Airline</h1>
        <p className="text-sm text-[#9CA3AF]">Update airline information</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Airline Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">IATA Code</label>
            <input type="text" value={form.iataCode} onChange={(e) => setForm({ ...form, iataCode: e.target.value.toUpperCase() })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" maxLength={2} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">ICAO Code</label>
            <input type="text" value={form.icaoCode} onChange={(e) => setForm({ ...form, icaoCode: e.target.value.toUpperCase() })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" maxLength={3} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Country</label>
            <select value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="">Select country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Website</label>
            <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Call Center</label>
            <input type="text" value={form.callCenter} onChange={(e) => setForm({ ...form, callCenter: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Logo</label>
            <div className="mt-1">
              <button type="button" onClick={() => setPickerOpen(true)} className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-gray-400">
                {form.logoMediaId ? <span className="text-green-600">Logo selected</span> : <><ImageIcon className="size-4" /> Select logo from Media Library</>}
              </button>
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Update Airline</>}
          </button>
        </div>
      </form>
      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={(media) => setForm({ ...form, logoMediaId: media.id })} />
    </motion.div>
  )
}
