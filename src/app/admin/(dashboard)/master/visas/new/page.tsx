"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { createVisa } from "@/modules/business/visa/actions/visa"
import { VISA_TYPES, ENTRY_TYPES } from "@/modules/business/visa/types"
import { getAllActiveCountries } from "@/actions/country"
import type { CountryBrief } from "@/types/hospitality"

export default function NewVisaPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [countries, setCountries] = useState<CountryBrief[]>([])
  const [form, setForm] = useState({
    name: "", countryId: "", visaType: "UMRAH", entryType: "SINGLE",
    processingDays: "0", validityDays: "0", stayDurationDays: "0",
    requirement: "", notes: "", isElectronic: false,
    sortOrder: "0", status: "ACTIVE",
  })

  useEffect(() => {
    getAllActiveCountries().then((res) => setCountries((res ?? []) as unknown as CountryBrief[])).catch(() => setCountries([]))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    if (!form.countryId) { setError("Country is required"); return }
    setSaving(true); setError("")
    try {
      await createVisa({
        ...form,
        processingDays: Number(form.processingDays),
        validityDays: Number(form.validityDays),
        stayDurationDays: Number(form.stayDurationDays),
        sortOrder: Number(form.sortOrder),
      })
      router.push("/admin/master/visas")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">New Visa</h1>
        <p className="text-sm text-[#9CA3AF]">Add a new visa</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Visa Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="e.g. Umrah Visa" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Country *</label>
            <select value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="">Select country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Visa Type</label>
            <select value={form.visaType} onChange={(e) => setForm({ ...form, visaType: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {VISA_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Entry Type</label>
            <select value={form.entryType} onChange={(e) => setForm({ ...form, entryType: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {ENTRY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
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
            <label className="text-xs font-medium text-gray-500">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Processing Days</label>
            <input type="number" min={0} value={form.processingDays} onChange={(e) => setForm({ ...form, processingDays: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Validity Days</label>
            <input type="number" min={0} value={form.validityDays} onChange={(e) => setForm({ ...form, validityDays: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Stay Duration Days</label>
            <input type="number" min={0} value={form.stayDurationDays} onChange={(e) => setForm({ ...form, stayDurationDays: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="isElectronic" checked={form.isElectronic} onChange={(e) => setForm({ ...form, isElectronic: e.target.checked })} className="size-4 rounded border-gray-300 text-[#0B3C6D]" />
            <label htmlFor="isElectronic" className="text-sm text-gray-700">Electronic Visa (E-Visa)</label>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Requirements</label>
          <textarea value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]" placeholder="List visa requirements..." />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]" placeholder="Additional notes..." />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Save Visa</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
