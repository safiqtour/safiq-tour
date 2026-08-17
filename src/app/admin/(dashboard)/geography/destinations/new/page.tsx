"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createDestination } from "@/actions/destination"
import { getAllActiveCountries } from "@/actions/country"
import { getRegionsByCountry } from "@/actions/region"
import { getCitiesByCountry } from "@/actions/city"

const DESTINATION_TYPES = [
  { value: "", label: "Default" },
  { value: "City", label: "City" },
  { value: "Mosque", label: "Mosque" },
  { value: "Historical", label: "Historical" },
  { value: "Museum", label: "Museum" },
  { value: "Shopping", label: "Shopping" },
  { value: "Airport", label: "Airport" },
  { value: "Hotel Area", label: "Hotel Area" },
  { value: "Restaurant", label: "Restaurant" },
  { value: "Mountain", label: "Mountain" },
  { value: "Landmark", label: "Landmark" },
]

export default function NewDestinationPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [countries, setCountries] = useState<Awaited<ReturnType<typeof getAllActiveCountries>>>([])
  const [regions, setRegions] = useState<Awaited<ReturnType<typeof getRegionsByCountry>>>([])
  const [cities, setCities] = useState<Awaited<ReturnType<typeof getCitiesByCountry>>>([])
  const [form, setForm] = useState({
    name: "", description: "", seoTitle: "", seoDescription: "",
    featuredImage: "", sortOrder: 0, destinationType: "",
    countryId: "", regionId: "", cityId: "",
  })

  useEffect(() => { getAllActiveCountries().then(setCountries) }, [])

  useEffect(() => {
    if (form.countryId) {
      getRegionsByCountry(form.countryId).then(setRegions)
      getCitiesByCountry(form.countryId).then(setCities)
    } else { setRegions([]); setCities([]) }
  }, [form.countryId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createDestination({
        name: form.name,
        description: form.description,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        featuredImage: form.featuredImage,
        sortOrder: form.sortOrder,
        destinationTypeId: form.destinationType || undefined,
        countryId: form.countryId,
        regionId: form.regionId || undefined,
        cityId: form.cityId,
      })
      toast.success("Destination created")
      router.push("/admin/geography/destinations")
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create")
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/geography/destinations" className="flex size-9 items-center justify-center rounded-xl border border-[#E5E7EB] text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Add Destination</h1>
          <p className="text-sm text-[#9CA3AF]">Create a new destination</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Name *</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Country *</label>
            <select value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value, regionId: "", cityId: "" })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
              <option value="">Select country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.flag} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Region</label>
            <select value={form.regionId} onChange={(e) => setForm({ ...form, regionId: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
              <option value="">No region</option>
              {regions.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">City *</label>
            <select value={form.cityId} onChange={(e) => setForm({ ...form, cityId: e.target.value })} required className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
              <option value="">Select city</option>
              {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Destination Type</label>
            <select value={form.destinationType} onChange={(e) => setForm({ ...form, destinationType: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all">
              {DESTINATION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all resize-none" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">SEO Title</label>
            <input value={form.seoTitle} onChange={(e) => setForm({ ...form, seoTitle: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">SEO Description</label>
            <input value={form.seoDescription} onChange={(e) => setForm({ ...form, seoDescription: e.target.value })} className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Featured Image URL</label>
            <input value={form.featuredImage} onChange={(e) => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://..." className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Link href="/admin/geography/destinations" className="rounded-xl border border-[#E5E7EB] px-6 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors">Cancel</Link>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:cursor-not-allowed disabled:opacity-70">
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
