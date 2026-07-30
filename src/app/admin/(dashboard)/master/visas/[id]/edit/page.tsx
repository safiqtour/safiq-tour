"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { getVisa, updateVisa } from "@/modules/business/visa/actions/visa"
import { VISA_TYPES, ENTRY_TYPES } from "@/modules/business/visa/types"
import { getAllActiveCountries } from "@/actions/country"
import type { CountryBrief } from "@/types/hospitality"
import type { VisaListItem } from "@/modules/business/visa/types"

export default function EditVisaPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
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
    getVisa(params.id as string).then((res) => {
      const v = res as unknown as VisaListItem | null
      if (v) {
        setForm({
          name: v.name ?? "",
          countryId: v.countryId ?? "",
          visaType: v.visaType || "UMRAH",
          entryType: v.entryType || "SINGLE",
          processingDays: String(v.processingDays ?? 0),
          validityDays: String(v.validityDays ?? 0),
          stayDurationDays: String(v.stayDurationDays ?? 0),
          requirement: v.requirement ?? "",
          notes: v.notes ?? "",
          isElectronic: v.isElectronic ?? false,
          sortOrder: String(v.sortOrder ?? 0),
          status: v.status ?? "ACTIVE",
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    if (!form.countryId) { setError("Country is required"); return }
    setSaving(true); setError("")
    try {
      await updateVisa(params.id as string, {
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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Visa</h1>
        <p className="text-sm text-[#9CA3AF]">Update visa information</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Visa Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
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
          <textarea value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Notes</label>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]" />
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Update Visa</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
