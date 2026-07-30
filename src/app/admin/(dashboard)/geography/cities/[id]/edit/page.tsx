"use client"

import { useState, useEffect, use } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getCity, updateCity } from "@/actions/city"
import { getAllActiveCountries } from "@/actions/country"
import { getRegionsByCountry } from "@/actions/region"

export default function EditCityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = useState<Awaited<ReturnType<typeof getAllActiveCountries>>>([])
  const [regions, setRegions] = useState<Awaited<ReturnType<typeof getRegionsByCountry>>>([])
  const [form, setForm] = useState({ name: "", countryId: "", regionId: "", timezone: "", latitude: "", longitude: "", sortOrder: 0 })

  useEffect(() => {
    getAllActiveCountries().then(setCountries)
    getCity(id).then((city) => {
      if (city) {
        setForm({
          name: city.name,
          countryId: city.countryId,
          regionId: city.regionId ?? "",
          timezone: city.timezone,
          latitude: city.latitude?.toString() ?? "",
          longitude: city.longitude?.toString() ?? "",
          sortOrder: city.sortOrder,
        })
        if (city.countryId) getRegionsByCountry(city.countryId).then(setRegions)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (form.countryId) getRegionsByCountry(form.countryId).then(setRegions)
    else setRegions([])
  }, [form.countryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateCity(id, {
        name: form.name,
        countryId: form.countryId,
        regionId: form.regionId || null,
        timezone: form.timezone || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        sortOrder: form.sortOrder,
      })
      toast.success("City updated")
      router.push("/admin/geography/cities")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="text-center py-12 text-[#9CA3AF]">Loading...</div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/geography/cities" className="flex size-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit City</h1>
          <p className="text-sm text-[#9CA3AF]">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Country *</label>
            <select value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value, regionId: "" })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
              <option value="">Select country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Region</label>
            <select value={form.regionId} onChange={(e) => setForm({ ...form, regionId: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
              <option value="">No region</option>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Timezone</label>
            <input value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Latitude</label>
            <input type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Longitude</label>
            <input type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/geography/cities" className="rounded-xl border border-[#E5E7EB] px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
