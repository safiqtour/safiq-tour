"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { createUser, updateUser } from "@/modules/user/actions/user"

export interface RoleOption {
  id: string
  name: string
  slug: string
  level: number
}

export interface UserFormData {
  id?: string
  name: string
  email: string
  roleId: string
  image: string
  isActive: boolean
}

interface UserFormProps {
  mode: "create" | "edit"
  initial?: UserFormData | null
  roles: RoleOption[]
}

export function UserForm({ mode, initial, roles }: UserFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState<UserFormData>({
    id: initial?.id,
    name: initial?.name ?? "",
    email: initial?.email ?? "",
    roleId: initial?.roleId ?? "",
    image: initial?.image ?? "",
    isActive: initial?.isActive ?? true,
  })
  const [password, setPassword] = useState("")

  const set = <K extends keyof UserFormData>(key: K, value: UserFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError("Nama wajib diisi"); return }
    if (!form.email.trim()) { setError("Email wajib diisi"); return }
    if (mode === "create" && !password) { setError("Password wajib diisi untuk user baru"); return }
    setSaving(true)
    setError("")
    try {
      const payload = {
        name: form.name,
        email: form.email,
        roleId: form.roleId || null,
        image: form.image || null,
        isActive: form.isActive,
        ...(password ? { password } : {}),
      }
      if (mode === "create") await createUser(payload)
      else await updateUser(initial?.id ?? "", payload)
      router.push("/admin/users")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan data")
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">
          {mode === "create" ? "Tambah User" : "Edit User"}
        </h1>
        <p className="text-sm text-[#9CA3AF]">Kelola akun pengguna CMS Safiq Tour</p>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-[#0B3C6D]">Informasi Akun</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-500">Nama *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Role</label>
              <select
                value={form.roleId}
                onChange={(e) => set("roleId", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
              >
                <option value="">— Pilih Role —</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500">Foto URL (Avatar)</label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500">
                {mode === "create" ? "Password *" : "Password Baru (kosongkan jika tidak diubah)"}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => set("isActive", e.target.checked)}
                  className="size-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Akun aktif</span>
              </label>
            </div>
          </div>
        </section>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Menyimpan..." : mode === "create" ? "Simpan User" : "Update User"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}