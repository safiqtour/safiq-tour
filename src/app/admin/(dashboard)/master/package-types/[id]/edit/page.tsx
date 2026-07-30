"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { getPackageType, updatePackageType } from "@/modules/business/package-type/actions/package-type"
import type { PackageTypeListItem } from "@/modules/business/package-type/types"

const ICON_OPTIONS = [
  "Plane", "Map", "Building", "Hotel", "Passport", "Globe",
  "Users", "BookOpen", "Award", "Crown", "Gem", "Briefcase",
]

const COLOR_OPTIONS = [
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "amber", label: "Amber", class: "bg-amber-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "rose", label: "Rose", class: "bg-rose-500" },
  { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
]

interface SelectOption { id: string; name: string }

export default function EditPackageTypePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [visas, setVisas] = useState<SelectOption[]>([])
  const [categories, setCategories] = useState<SelectOption[]>([])
  const [form, setForm] = useState({
    name: "", shortName: "", description: "", defaultDurationDays: "0",
    defaultVisaId: "", defaultCategoryId: "",
    icon: "Plane", color: "blue", displayOrder: "0",
    isFeatured: false, status: "ACTIVE",
  })

  useEffect(() => {
    Promise.all([
      import("@/modules/business/visa/actions/visa").then(m => m.getVisas({ limit: 100, status: "ACTIVE" })),
      import("@/modules/business/package-category/actions/package-category").then(m => m.getPackageCategories({ limit: 100, status: "ACTIVE" })),
      getPackageType(params.id as string),
    ]).then(([v, c, res]) => {
      setVisas((v.data ?? []).map((x: { id: string; name: string }) => ({ id: x.id, name: x.name })))
      setCategories((c.data ?? []).map((x: { id: string; name: string }) => ({ id: x.id, name: x.name })))
      const f = res as unknown as PackageTypeListItem | null
      if (f) {
        setForm({
          name: f.name ?? "",
          shortName: f.shortName ?? "",
          description: f.description ?? "",
          defaultDurationDays: String(f.defaultDurationDays ?? 0),
          defaultVisaId: f.defaultVisaId ?? "",
          defaultCategoryId: f.defaultCategoryId ?? "",
          icon: f.icon || "Plane",
          color: f.color || "blue",
          displayOrder: String(f.displayOrder ?? 0),
          isFeatured: f.isFeatured ?? false,
          status: f.status ?? "ACTIVE",
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    if (!form.shortName.trim()) { setError("Short name is required"); return }
    setSaving(true); setError("")
    try {
      await updatePackageType(params.id as string, {
        ...form,
        defaultDurationDays: Number(form.defaultDurationDays),
        displayOrder: Number(form.displayOrder),
        defaultVisaId: form.defaultVisaId || null,
        defaultCategoryId: form.defaultCategoryId || null,
      })
      router.push("/admin/master/package-types")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Package Type</h1>
        <p className="text-sm text-[#9CA3AF]">Update package type information</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Short Name *</label>
            <input type="text" value={form.shortName} onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" maxLength={20} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Default Duration (Days)</label>
            <input type="number" value={form.defaultDurationDays} onChange={(e) => setForm({ ...form, defaultDurationDays: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" min={0} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Default Visa</label>
            <select value={form.defaultVisaId} onChange={(e) => setForm({ ...form, defaultVisaId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="">None</option>
              {visas.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Default Category</label>
            <select value={form.defaultCategoryId} onChange={(e) => setForm({ ...form, defaultCategoryId: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="">None</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Icon</label>
            <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Color</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button key={c.value} type="button" onClick={() => setForm({ ...form, color: c.value })}
                  className={`size-8 rounded-full ${c.class} ${form.color === c.value ? "ring-2 ring-offset-2 ring-gray-400" : ""}`} title={c.label} />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Display Order</label>
            <input type="number" value={form.displayOrder} onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" min={0} />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="size-4 rounded border-gray-300 text-[#0B3C6D] focus:ring-[#0B3C6D]" />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value, isFeatured: e.target.value === "INACTIVE" ? false : form.isFeatured })}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Update Type</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
