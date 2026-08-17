"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Save } from "lucide-react"
import { getCurrency, updateCurrency } from "@/modules/business/currency/actions/currency"
import { SYMBOL_POSITIONS } from "@/modules/business/currency/types"
import { getAllActiveCountries } from "@/actions/country"
import type { CountryBrief } from "@/types/hospitality"
import type { CurrencyListItem } from "@/modules/business/currency/types"

export default function EditCurrencyPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [countries, setCountries] = useState<CountryBrief[]>([])
  const [form, setForm] = useState({
    name: "", isoCode: "", symbol: "", symbolPosition: "PREFIX",
    decimalDigits: "2", thousandSeparator: ",", decimalSeparator: ".",
    exchangeRate: "1.0", isBaseCurrency: false,
    countryId: "", sortOrder: "0", status: "ACTIVE",
  })

  useEffect(() => {
    getAllActiveCountries().then((res) => setCountries((res ?? []) as unknown as CountryBrief[])).catch(() => setCountries([]))
    getCurrency(params.id as string).then((res) => {
      const c = res as unknown as CurrencyListItem | null
      if (c) {
        setForm({
          name: c.name ?? "",
          isoCode: c.isoCode ?? "",
          symbol: c.symbol ?? "",
          symbolPosition: c.symbolPosition || "PREFIX",
          decimalDigits: String(c.decimalDigits ?? 2),
          thousandSeparator: c.thousandSeparator ?? ",",
          decimalSeparator: c.decimalSeparator ?? ".",
          exchangeRate: String(c.exchangeRate ?? 1),
          isBaseCurrency: c.isBaseCurrency ?? false,
          countryId: c.countryId ?? "",
          sortOrder: String(c.sortOrder ?? 0),
          status: c.status ?? "ACTIVE",
        })
      }
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Name is required"); return }
    if (!form.isoCode.trim() || form.isoCode.length !== 3) { setError("ISO Code must be 3 characters"); return }
    if (!form.symbol.trim()) { setError("Symbol is required"); return }
    setSaving(true); setError("")
    try {
      await updateCurrency(params.id as string, {
        ...form,
        decimalDigits: Number(form.decimalDigits),
        exchangeRate: Number(form.exchangeRate),
        sortOrder: Number(form.sortOrder),
        countryId: form.countryId || null,
      })
      router.push("/admin/master/currencies")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save")
    } finally { setSaving(false) }
  }

  if (loading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Edit Currency</h1>
        <p className="text-sm text-[#9CA3AF]">Update currency information</p>
      </div>
      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      <form onSubmit={handleSubmit} className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="text-xs font-medium text-gray-500">Currency Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">ISO Code *</label>
            <input type="text" value={form.isoCode} onChange={(e) => setForm({ ...form, isoCode: e.target.value.toUpperCase() })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" maxLength={3} />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Symbol *</label>
            <input type="text" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Symbol Position</label>
            <select value={form.symbolPosition} onChange={(e) => setForm({ ...form, symbolPosition: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              {SYMBOL_POSITIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Exchange Rate</label>
            <input type="number" step="0.000001" min="0" value={form.exchangeRate} onChange={(e) => setForm({ ...form, exchangeRate: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Decimal Digits</label>
            <input type="number" min="0" max="6" value={form.decimalDigits} onChange={(e) => setForm({ ...form, decimalDigits: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Thousand Separator</label>
            <input type="text" maxLength={1} value={form.thousandSeparator} onChange={(e) => setForm({ ...form, thousandSeparator: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Decimal Separator</label>
            <input type="text" maxLength={1} value={form.decimalSeparator} onChange={(e) => setForm({ ...form, decimalSeparator: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Country</label>
            <select value={form.countryId} onChange={(e) => setForm({ ...form, countryId: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="">No country</option>
              {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Sort Order</label>
            <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input type="checkbox" id="isBaseCurrency" checked={form.isBaseCurrency} onChange={(e) => setForm({ ...form, isBaseCurrency: e.target.checked })} className="size-4 rounded border-gray-300 text-[#0B3C6D]" />
            <label htmlFor="isBaseCurrency" className="text-sm text-gray-700">Set as Base Currency</label>
          </div>
        </div>
        <div className="flex gap-2 justify-end pt-2">
          <button type="button" onClick={() => router.back()} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> Update Currency</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}
