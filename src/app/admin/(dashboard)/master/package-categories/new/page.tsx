"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { createPackageCategory } from "@/modules/business/package-category/actions/package-category"

const ICON_OPTIONS = [
  "Briefcase", "Crown", "Star", "Users", "Heart", "Building", "Gem", "Plane", "Map", "Award",
  "LayoutGrid", "Zap", "Globe", "Compass", "Flag",
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

export default function NewPackageCategoryPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", shortName: "", description: "",
    displayOrder: "0", icon: "LayoutGrid", color: "blue",
    isFeatured: false, status: "ACTIVE",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    if (!form.shortName.trim()) { setError("Short name is required"); return }
    setSaving(true); setError("")
    try {
      await createPackageCategory({ ...form, displayOrder: Number(form.displayOrder) })
      router.push("/admin/master/package-categories")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">New Package Category</h1>
        <p className="text-sm text-[#9CA3AF]">Add a new package category</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Category Name *</label>
            <input
              type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              placeholder="e.g. Executive"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Short Name *</label>
            <input
              type="text" value={form.shortName}
              onChange={(e) => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              placeholder="e.g. EXE"
              maxLength={20}
            />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]"
            placeholder="Optional description"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Icon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              {ICON_OPTIONS.map((icon) => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Color</label>
            <div className="mt-1 flex flex-wrap gap-2">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setForm({ ...form, color: c.value })}
                  className={`size-8 rounded-full ${c.class} ${
                    form.color === c.value ? "ring-2 ring-offset-2 ring-gray-400" : ""
                  }`}
                  title={c.label}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Display Order</label>
            <input
              type="number" value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
              min={0}
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox" checked={form.isFeatured}
              onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
              className="size-4 rounded border-gray-300 text-[#0B3C6D] focus:ring-[#0B3C6D]"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value, isFeatured: e.target.value === "INACTIVE" ? false : form.isFeatured })}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button
            type="button" onClick={() => router.back()}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit" disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50"
          >
            {saving ? "Saving..." : <><Save className="size-4" /> Save Category</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
