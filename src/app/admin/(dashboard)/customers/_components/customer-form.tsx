"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Plus, Trash2, UploadCloud, Image as ImageIcon } from "lucide-react"
import { createCustomer, updateCustomer } from "@/modules/customer/actions/customer"
import {
  CUSTOMER_DOCUMENT_TYPES,
  CUSTOMER_DOCUMENT_STATUSES,
  CUSTOMER_GENDERS,
  CUSTOMER_STATUSES,
} from "@/modules/customer/types"

export interface CustomerDocumentDraft {
  id?: string
  type: string
  status: string
  mediaId: string | null
  notes: string
}

export interface CustomerFormData {
  id?: string
  name: string
  nickName: string
  email: string | null
  phone: string | null
  gender: string
  birthPlace: string
  birthDate: string | null
  address: string
  nationality: string
  nik: string
  passportNumber: string | null
  passportExpiry: string | null
  photoMediaId: string | null
  status: string
  notes: string
  documents: CustomerDocumentDraft[]
}

interface CustomerFormProps {
  mode: "create" | "edit"
  initial?: CustomerFormData | null
}

function toDateInput(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  return d.toISOString().slice(0, 10)
}

export function CustomerForm({ mode, initial }: CustomerFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")

  const [form, setForm] = useState<CustomerFormData>({
    id: initial?.id,
    name: initial?.name ?? "",
    nickName: initial?.nickName ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone ?? "",
    gender: initial?.gender ?? "MALE",
    birthPlace: initial?.birthPlace ?? "",
    birthDate: initial?.birthDate ?? null,
    address: initial?.address ?? "",
    nationality: initial?.nationality ?? "",
    nik: initial?.nik ?? "",
    passportNumber: initial?.passportNumber ?? "",
    passportExpiry: initial?.passportExpiry ?? null,
    photoMediaId: initial?.photoMediaId ?? null,
    status: initial?.status ?? "ACTIVE",
    notes: initial?.notes ?? "",
    documents: initial?.documents ?? [],
  })

  const [docs, setDocs] = useState<CustomerDocumentDraft[]>(form.documents)

  const set = <K extends keyof CustomerFormData>(key: K, value: CustomerFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return
    setUploading(true)
    setError("")
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!json.success || !json.data?.id) throw new Error(json.error ?? "Upload gagal")
      set("photoMediaId", json.data.id)
      setPhotoUrl(json.data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah foto")
    } finally {
      setUploading(false)
    }
  }

  const addDocument = () =>
    setDocs((prev) => [...prev, { type: "PASSPORT", status: "PENDING", mediaId: null, notes: "" }])

  const updateDocument = (index: number, patch: Partial<CustomerDocumentDraft>) =>
    setDocs((prev) => prev.map((d, i) => (i === index ? { ...d, ...patch } : d)))

  const removeDocument = (index: number) =>
    setDocs((prev) => prev.filter((_, i) => i !== index))

  const uploadDocumentMedia = async (index: number, file: File) => {
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd })
      const json = await res.json()
      if (!json.success || !json.data?.id) throw new Error(json.error ?? "Upload gagal")
      updateDocument(index, { mediaId: json.data.id })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengunggah dokumen")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Nama wajib diisi"); return }
    setSaving(true)
    setError("")
    try {
      const payload = {
        name: form.name,
        nickName: form.nickName,
        email: form.email || null,
        phone: form.phone || null,
        gender: form.gender,
        birthPlace: form.birthPlace,
        birthDate: form.birthDate || null,
        address: form.address,
        nationality: form.nationality,
        nik: form.nik,
        passportNumber: form.passportNumber || null,
        passportExpiry: form.passportExpiry || null,
        photoMediaId: form.photoMediaId,
        status: form.status,
        notes: form.notes,
        documents: docs,
      }
      if (mode === "create") await createCustomer(payload)
      else await updateCustomer(initial?.id ?? "", payload)
      router.push("/admin/customers")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data")
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">
          {mode === "create" ? "New Customer" : "Edit Customer"}
        </h1>
        <p className="text-sm text-[#9CA3AF]">Customer / Jamaah profile with photo and documents</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0B3C6D]">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <div className="flex size-20 items-center justify-center overflow-hidden rounded-full bg-[#0B3C6D]/10 text-[#0B3C6D]">
              {photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoUrl} alt="Profile" className="size-full object-cover" />
              ) : (
                <ImageIcon className="size-8" />
              )}
            </div>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <UploadCloud className="size-4" /> {uploading ? "Uploading..." : "Upload photo"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
            </label>
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0B3C6D]">Personal Details</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-500">Full Name *</label>
              <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Nickname</label>
              <input type="text" value={form.nickName} onChange={(e) => set("nickName", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Gender</label>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                {CUSTOMER_GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                {CUSTOMER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Email</label>
              <input type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value || null)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Phone</label>
              <input type="text" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value || null)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Birth Place</label>
              <input type="text" value={form.birthPlace} onChange={(e) => set("birthPlace", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Birth Date</label>
              <input type="date" value={toDateInput(form.birthDate)} onChange={(e) => set("birthDate", e.target.value || null)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Nationality</label>
              <input type="text" value={form.nationality} onChange={(e) => set("nationality", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">NIK</label>
              <input type="text" value={form.nik} onChange={(e) => set("nik", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Passport Number</label>
              <input type="text" value={form.passportNumber ?? ""} onChange={(e) => set("passportNumber", e.target.value || null)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Passport Expiry</label>
              <input type="date" value={toDateInput(form.passportExpiry)} onChange={(e) => set("passportExpiry", e.target.value || null)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500">Address</label>
              <textarea value={form.address} onChange={(e) => set("address", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[60px]" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500">Notes</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 min-h-[60px]" />
            </div>
          </div>
        </section>
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#0B3C6D]">Documents</h2>
            <button type="button" onClick={addDocument}
              className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-[#0B3C6D] hover:bg-gray-50">
              <Plus className="size-3.5" /> Add Document
            </button>
          </div>

          <div className="space-y-3">
            {docs.length === 0 && (
              <p className="text-sm text-[#9CA3AF]">No documents yet.</p>
            )}
            {docs.map((doc, index) => (
              <div key={index} className="rounded-lg border border-gray-100 bg-[#F8FAFC] p-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500">Type</label>
                    <select value={doc.type} onChange={(e) => updateDocument(index, { type: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm outline-none focus:border-blue-400">
                      {CUSTOMER_DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500">Status</label>
                    <select value={doc.status} onChange={(e) => updateDocument(index, { status: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm outline-none focus:border-blue-400">
                      {CUSTOMER_DOCUMENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-gray-500">Notes</label>
                    <input type="text" value={doc.notes} onChange={(e) => updateDocument(index, { notes: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2 py-2 text-sm outline-none focus:border-blue-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-[#0B3C6D] hover:underline">
                    <UploadCloud className="size-3.5" />
                    {doc.mediaId ? "Replace file" : "Upload file"}
                    <input type="file" accept="image/*,application/pdf" className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadDocumentMedia(index, e.target.files[0])} />
                  </label>
                  <button type="button" onClick={() => removeDocument(index)}
                    className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
                    <Trash2 className="size-3.5" /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.back()}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50">
            {saving ? "Saving..." : <><Save className="size-4" /> {mode === "create" ? "Save Customer" : "Update Customer"}</>}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

