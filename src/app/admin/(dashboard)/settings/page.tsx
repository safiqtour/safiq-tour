"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Save } from "lucide-react"
import { getWhatsAppSetting, saveWhatsAppSetting } from "@/actions/settings"

export default function SettingsPage() {
  const [form, setForm] = useState({
    siteName: "Safiq Tour",
    logo: "/images/logo-safiq.png",
    whatsapp: "",
    email: "info@safiq-tour.com",
    address: "Jl. Contoh No. 123, Jakarta",
    facebook: "https://facebook.com/safiq.tour",
    instagram: "https://instagram.com/safiq.tour",
    tiktok: "https://tiktok.com/@safiq.tour",
    youtube: "https://youtube.com/@safiq.tour",
  })
  const [saving, setSaving] = useState(false)

  // Load the persisted WhatsApp number from BusinessSetting on mount so the
  // field reflects the saved value after refresh/navigation.
  useEffect(() => {
    getWhatsAppSetting()
      .then((value) => setForm((prev) => ({ ...prev, whatsapp: value })))
      .catch(() => {
        /* leave empty on failure */
      })
  }, [])

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      await saveWhatsAppSetting(form.whatsapp)
      toast.success("Pengaturan berhasil disimpan")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Gagal menyimpan pengaturan")
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Settings</h1>
        <p className="text-sm text-[#9CA3AF]">Pengaturan website Safiq Tour</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Informasi Website</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Nama Website</label>
                <input
                  value={form.siteName}
                  onChange={(e) => handleChange("siteName", e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Logo URL</label>
                <input
                  value={form.logo}
                  onChange={(e) => handleChange("logo", e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Alamat</label>
                <textarea
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Kontak</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">WhatsApp</label>
                <input
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Email</label>
                <input
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Social Media</h3>
            <div className="space-y-4">
              {[
                { label: "Facebook", field: "facebook" as const },
                { label: "Instagram", field: "instagram" as const },
                { label: "TikTok", field: "tiktok" as const },
                { label: "YouTube", field: "youtube" as const },
              ].map((social) => (
                <div key={social.field}>
                  <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">{social.label}</label>
                  <input
                    value={form[social.field]}
                    onChange={(e) => handleChange(social.field, e.target.value)}
                    className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
            <h3 className="mb-4 font-heading text-sm font-bold text-[#0B3C6D]">Google Maps</h3>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Embed URL</label>
              <input
                value="https://maps.google.com/?q=Safiq+Tour"
                readOnly
                className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#9CA3AF] outline-none transition-all cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:opacity-60"
        >
          <Save className="size-4" />
          {saving ? "Menyimpan..." : "Simpan Pengaturan"}
        </button>
      </div>
    </motion.div>
  )
}
