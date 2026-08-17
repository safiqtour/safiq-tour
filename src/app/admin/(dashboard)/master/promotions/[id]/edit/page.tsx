"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { getPromotion, updatePromotion } from "@/modules/business/promotion/actions/promotion"
import { PROMOTION_TYPES, DISCOUNT_TYPES } from "@/modules/business/promotion/types"
import type { PromotionListItem } from "@/modules/business/promotion/types"

export default function EditPromotionPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "", description: "", promotionType: "SEASONAL",
    discountType: "PERCENTAGE", discountValue: "0",
    minimumPurchaseAmount: "0", maximumDiscountAmount: "0",
    startDate: "", endDate: "",
    usageLimit: "0", isPublic: true, isAutoApply: false,
    priority: "0", status: "ACTIVE",
  })

  useEffect(() => {
    getPromotion(params.id as string).then((res) => {
      const p = res as unknown as PromotionListItem | null
      if (p) {
        const toDateInput = (d: Date | string) => {
          const date = new Date(d)
          return date.toISOString().slice(0, 10)
        }
        setForm({
          name: p.name ?? "",
          description: p.description ?? "",
          promotionType: p.promotionType || "SEASONAL",
          discountType: p.discountType || "PERCENTAGE",
          discountValue: String(p.discountValue ?? 0),
          minimumPurchaseAmount: String(p.minimumPurchaseAmount ?? 0),
          maximumDiscountAmount: String(p.maximumDiscountAmount ?? 0),
          startDate: toDateInput(p.startDate),
          endDate: toDateInput(p.endDate),
          usageLimit: String(p.usageLimit ?? 0),
          isPublic: p.isPublic ?? true,
          isAutoApply: p.isAutoApply ?? false,
          priority: String(p.priority ?? 0),
          status: p.status ?? "ACTIVE",
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    if (!form.startDate || !form.endDate) { setError("Start and end dates are required"); return }
    if (new Date(form.startDate) >= new Date(form.endDate)) { setError("Start date must be before end date"); return }
    setSaving(true); setError("")
    try {
      await updatePromotion(params.id as string, {
        ...form,
        discountValue: Number(form.discountValue),
        minimumPurchaseAmount: Number(form.minimumPurchaseAmount),
        maximumDiscountAmount: Number(form.maximumDiscountAmount),
        usageLimit: Number(form.usageLimit),
        priority: Number(form.priority),
        startDate: new Date(form.startDate),
        endDate: new Date(form.endDate),
      })
      router.push("/admin/master/promotions")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Promotion</h1>
        <p className="text-sm text-[#9CA3AF]">Update promotion information</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Promotion Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[60px]" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Promotion Type</label>
            <select value={form.promotionType} onChange={(e) => setForm({ ...form, promotionType: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {PROMOTION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Discount Type</label>
            <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {DISCOUNT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Discount Value</label>
            <input type="number" min="0" step="0.01" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Min Purchase Amount</label>
            <input type="number" min="0" value={form.minimumPurchaseAmount} onChange={(e) => setForm({ ...form, minimumPurchaseAmount: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Max Discount Amount</label>
            <input type="number" min="0" value={form.maximumDiscountAmount} onChange={(e) => setForm({ ...form, maximumDiscountAmount: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Usage Limit</label>
            <input type="number" min="0" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Start Date *</label>
            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">End Date *</label>
            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Priority</label>
            <input type="number" min="0" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="isPublic" checked={form.isPublic} onChange={(e) => setForm({ ...form, isPublic: e.target.checked })} className="size-4 rounded border-gray-300 text-[#0B3C6D]" />
            <label htmlFor="isPublic" className="text-sm text-gray-700">Public Promotion</label>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="isAutoApply" checked={form.isAutoApply} onChange={(e) => setForm({ ...form, isAutoApply: e.target.checked })} className="size-4 rounded border-gray-300 text-[#0B3C6D]" />
            <label htmlFor="isAutoApply" className="text-sm text-gray-700">Auto Apply</label>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Update Promotion</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
