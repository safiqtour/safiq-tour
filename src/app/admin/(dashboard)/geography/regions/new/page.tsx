"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createRegion } from "@/actions/region"
import { getAllActiveCountries } from "@/actions/country"

export default function NewRegionPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = useState<Awaited<ReturnType<typeof getAllActiveCountries>>>([])
  const [form, setForm] = useState({ name: "", countryId: "", sortOrder: 0 })

  useEffect(() => { getAllActiveCountries().then(setCountries) }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createRegion(form)
      toast.success("Region created")
      router.push("/admin/geography/regions")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create")
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/geography/regions" className="flex size-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Add Region</h1>
          <p className="text-sm text-[#9CA3AF]">Create a new region / province</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Country *</label>
          <select value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
            <option value="">Select country</option>
            {countries.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Name *</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Sort Order</label>
          <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/geography/regions" className="rounded-xl border border-[#E5E7EB] px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
