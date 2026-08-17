"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { getFacility, updateFacility } from "@/modules/business/facility/actions/facility"
import { FACILITY_CATEGORIES } from "@/modules/business/facility/types"
import type { FacilityListItem } from "@/modules/business/facility/types"

const ICON_OPTIONS = [
  "Hotel", "Bus", "Plane", "Shield", "Heart", "UtensilsCrossed", "Wifi", "Briefcase",
  "Map", "Package", "FileCheck", "Smartphone", "Stethoscope", "Coffee", "CupSoda",
  "BookOpen", "UserCheck", "Luggage", "Shirt", "ConciergeBell", "Droplets", "Car",
  "Train", "Zap", "Sofa", "FileText", "Accessibility", "MapPin", "ShoppingBag",
]

export default function EditFacilityPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", icon: "Hotel", category: "Accommodation",
    description: "", sortOrder: "0", status: "ACTIVE",
  })

  useEffect(() => {
    getFacility(params.id as string).then((res) => {
      const f = res as unknown as FacilityListItem | null
      if (f) {
        setForm({
          name: f.name ?? "",
          icon: f.icon || "Hotel",
          category: f.category || "Accommodation",
          description: f.description ?? "",
          sortOrder: String(f.sortOrder ?? 0),
          status: f.status ?? "ACTIVE",
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    setSaving(true); setError("")
    try {
      await updateFacility(params.id as string, { ...form, sortOrder: Number(form.sortOrder) })
      router.push("/admin/master/facilities")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Facility</h1>
        <p className="text-sm text-[#9CA3AF]">Update facility information</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500">Facility Name *</label>
          <input
            type="text" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <label className="text-xs font-medium text-gray-500">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              {FACILITY_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Sort Order</label>
            <input
              type="number" value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px]"
          />
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
            {saving ? "Saving..." : <><Save className="size-4" /> Update Facility</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
