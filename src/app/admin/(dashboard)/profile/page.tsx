"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Save, Loader2, Eye, EyeOff } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(1, "Nama tidak boleh kosong"),
  image: z.string().optional(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Password minimal 6 karakter"),
  newPassword: z.string().min(6, "Password minimal 6 karakter"),
  confirmPassword: z.string().min(6, "Password minimal 6 karakter"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"],
})

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [saving, setSaving] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name ?? "",
      image: session?.user?.image ?? "",
    },
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  })

  async function onProfileSubmit(data: ProfileForm) {
    setSaving(true)
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Gagal menyimpan")
      await update()
      toast.success("Profil berhasil diperbarui")
    } catch {
      toast.error("Gagal menyimpan profil")
    } finally {
      setSaving(false)
    }
  }

  async function onPasswordSubmit(data: PasswordForm) {
    setChangingPassword(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? "Gagal mengubah password")
      }
      toast.success("Password berhasil diubah")
      passwordForm.reset()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Gagal mengubah password")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Profile</h1>
        <p className="text-sm text-[#9CA3AF]">Kelola informasi akun Anda</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center">
            <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0B3C6D] to-[#C89B3C] text-2xl font-bold text-white">
              {session?.user?.name?.charAt(0)?.toUpperCase() ?? "A"}
            </div>
            <h2 className="font-heading text-lg font-bold text-[#0B3C6D]">{session?.user?.name}</h2>
            <p className="text-sm text-[#9CA3AF]">{session?.user?.email}</p>
            <div className="mt-3 inline-flex rounded-full bg-[#0B3C6D]/10 px-3 py-1 text-xs font-medium text-[#0B3C6D]">
              {session?.user?.role?.name ?? "Admin"}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Informasi Profil</h3>
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Nama</label>
                <input
                  {...profileForm.register("name")}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
                {profileForm.formState.errors.name && (
                  <p className="mt-1 text-xs text-red-500">{profileForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Email</label>
                <input
                  value={session?.user?.email ?? ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-[#E5E7EB] bg-gray-50 px-4 py-2.5 text-sm text-[#9CA3AF] outline-none"
                />
                <p className="mt-1 text-xs text-[#9CA3AF]">Email tidak dapat diubah</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Foto URL (Avatar)</label>
                <input
                  {...profileForm.register("image")}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Ubah Password</h3>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Password Saat Ini</label>
                <div className="relative">
                  <input
                    {...passwordForm.register("currentPassword")}
                    type={showCurrent ? "text" : "password"}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 pr-11 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.currentPassword && (
                  <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Password Baru</label>
                <div className="relative">
                  <input
                    {...passwordForm.register("newPassword")}
                    type={showNew ? "text" : "password"}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 pr-11 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.newPassword && (
                  <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Konfirmasi Password Baru</label>
                <div className="relative">
                  <input
                    {...passwordForm.register("confirmPassword")}
                    type={showConfirm ? "text" : "password"}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 pr-11 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                    {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="flex items-center gap-2 rounded-xl bg-[#C89B3C] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#C89B3C]/20 transition-all hover:bg-[#B88A2E] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {changingPassword ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
                  {changingPassword ? "Mengubah..." : "Ubah Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
