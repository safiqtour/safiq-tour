"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { getBusinessSetting, updateBusinessSetting } from "@/modules/business/business-setting/actions/business-setting"
import { BUSINESS_SETTING_GROUPS, BUSINESS_SETTING_VALUE_TYPES } from "@/modules/business/business-setting/types"
import type { BusinessSettingListItem } from "@/modules/business/business-setting/types"

export default function EditBusinessSettingPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    key: "", label: "", group: "GENERAL", value: "",
    valueType: "STRING", description: "",
    isPublic: false, isReadonly: false,
    sortOrder: "0", status: "ACTIVE",
  })
  const [originalReadonly, setOriginalReadonly] = useState(false)

  useEffect(() => {
    getBusinessSetting(params.id as string).then((res) => {
      const f = res as unknown as BusinessSettingListItem | null
      if (f) {
        setForm({
          key: f.key ?? "",
          label: f.label ?? "",
          group: f.group ?? "GENERAL",
          value: f.value ?? "",
          valueType: f.valueType ?? "STRING",
          description: f.description ?? "",
          isPublic: f.isPublic ?? false,
          isReadonly: f.isReadonly ?? false,
          sortOrder: String(f.sortOrder ?? 0),
          status: f.status ?? "ACTIVE",
        })
        setOriginalReadonly(f.isReadonly ?? false)
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.key.trim()) { setError("Key is required"); return }
    if (!form.label.trim()) { setError("Label is required"); return }
    setSaving(true); setError("")
    try {
      await updateBusinessSetting(params.id as string, { ...form, sortOrder: Number(form.sortOrder) })
      router.push("/admin/master/business-settings")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Business Setting</h1>
        <p className="text-sm text-[#9CA3AF]">Update system configuration</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      {originalReadonly && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-700">
          This setting is readonly and cannot be modified.
        </div>
      )}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Setting Key *</label>
            <input type="text" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })}
              disabled={originalReadonly}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Label *</label>
            <input type="text" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
              disabled={originalReadonly}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-gray-500">Group</label>
            <select value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })}
              disabled={originalReadonly}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400">
              {BUSINESS_SETTING_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Value Type</label>
            <select value={form.valueType} onChange={(e) => setForm({ ...form, valueType: e.target.value })}
              disabled={originalReadonly}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400">
              {BUSINESS_SETTING_VALUE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              disabled={originalReadonly}
              className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400" min={0} />
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Value</label>
          <textarea value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })}
            disabled={originalReadonly}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[80px] disabled:bg-gray-50 disabled:text-gray-400" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            disabled={originalReadonly}
            className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 disabled:bg-gray-50 disabled:text-gray-400" />
        </div>
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })}
              disabled={originalReadonly}
              className="size-4 rounded border-gray-300 text-[#0B3C6D] focus:ring-[#0B3C6D] disabled:opacity-50" />
            <span className="text-sm text-gray-700">Public</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.isReadonly} onChange={(e) => setForm({ ...form, isReadonly: e.target.checked })}
              className="size-4 rounded border-gray-300 text-[#0B3C6D] focus:ring-[#0B3C6D]" />
            <span className="text-sm text-gray-700">Readonly</span>
          </label>
          <label className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500">Status</span>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </label>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving || originalReadonly}
            className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Update Setting</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
