"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, Loader2 } from "lucide-react"
import { createJamaah } from "@/modules/jamaah/actions/jamaah"
import { JAMAHAH_GENDERS } from "@/modules/jamaah/types"

interface JamaahFormProps {
  bookingId: string
}

/**
 * Extract the first human-readable validation message from a server action
 * failure. The createJamaah action validates with Zod and throws a ZodError,
 * whose message is a JSON string — we surface the first issue message instead
 * of dumping raw JSON, matching the error pattern used across admin forms.
 */
function firstError(err: unknown): string {
  if (err && typeof err === "object") {
    const maybe = err as { issues?: Array<{ message?: string }> }
    if (Array.isArray(maybe.issues) && maybe.issues.length > 0 && maybe.issues[0]?.message) {
      return maybe.issues[0].message as string
    }
  }
  return err instanceof Error ? err.message : "Gagal menyimpan data jamaah"
}

export function JamaahForm({ bookingId }: JamaahFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  // Personal data
  const [fullName, setFullName] = useState("")
  const [passportName, setPassportName] = useState("")
  const [gender, setGender] = useState("MALE")
  const [birthPlace, setBirthPlace] = useState("")
  const [birthDate, setBirthDate] = useState("")

  // Passport
  const [passportNumber, setPassportNumber] = useState("")
  const [passportIssueDate, setPassportIssueDate] = useState("")
  const [passportExpiry, setPassportExpiry] = useState("")

  // Contact
  const [phone, setPhone] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // Address
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")
  const [district, setDistrict] = useState("")
  const [village, setVillage] = useState("")
  const [address, setAddress] = useState("")

  const inputCls = "w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
  const labelCls = "mb-1.5 block text-sm font-medium text-[#6B7280]"

  const toDateISO = (value: string): string | undefined => {
    if (!value) return undefined
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSaving(true)
    try {
      await createJamaah({
        bookingId,
        fullName: fullName.trim(),
        passportName: passportName.trim(),
        gender,
        birthPlace: birthPlace.trim(),
        birthDate: toDateISO(birthDate),
        passportNumber: passportNumber.trim() || null,
        passportIssueDate: toDateISO(passportIssueDate),
        passportExpiry: toDateISO(passportExpiry),
        phone: phone.trim() || null,
        whatsapp: whatsapp.trim() || null,
        province: province.trim(),
        city: city.trim(),
        district: district.trim(),
        village: village.trim(),
        address: address.trim(),
      })
      router.push(`/admin/bookings/${bookingId}`)
    } catch (err) {
      setError(firstError(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Section 1 — Personal Data */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Data Pribadi</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nama Lengkap <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className={inputCls}
                placeholder="Nama lengkap jamaah"
              />
            </div>
            <div>
              <label className={labelCls}>Nama di Paspor <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={passportName}
                onChange={(e) => setPassportName(e.target.value)}
                required
                className={inputCls}
                placeholder="Nama sesuai paspor"
              />
            </div>
            <div>
              <label className={labelCls}>Jenis Kelamin</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputCls}>
                {JAMAHAH_GENDERS.map((g) => <option key={g} value={g}>{g === "MALE" ? "Laki-laki" : "Perempuan"}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Tempat Lahir</label>
              <input
                type="text"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
                className={inputCls}
                placeholder="Tempat lahir"
              />
            </div>
            <div>
              <label className={labelCls}>Tanggal Lahir</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </section>

        {/* Section 2 — Passport */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Paspor</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nomor Paspor</label>
              <input
                type="text"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value)}
                className={inputCls}
                placeholder="Nomor paspor"
              />
            </div>
            <div>
              <label className={labelCls}>Tanggal Terbit Paspor</label>
              <input
                type="date"
                value={passportIssueDate}
                onChange={(e) => setPassportIssueDate(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Tanggal Kedaluwarsa Paspor</label>
              <input
                type="date"
                value={passportExpiry}
                onChange={(e) => setPassportExpiry(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </section>


        {/* Section 3 — Contact */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Kontak</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Nomor Telepon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="Nomor telepon"
              />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={inputCls}
                placeholder="Nomor WhatsApp"
              />
            </div>
          </div>
        </section>

        {/* Section 4 — Address */}
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
          <h2 className="mb-4 font-heading text-sm font-semibold text-[#0B3C6D]">Alamat</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Provinsi</label>
              <input
                type="text"
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={inputCls}
                placeholder="Provinsi"
              />
            </div>
            <div>
              <label className={labelCls}>Kota / Kabupaten</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
                placeholder="Kota / Kabupaten"
              />
            </div>
            <div>
              <label className={labelCls}>Kecamatan</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className={inputCls}
                placeholder="Kecamatan"
              />
            </div>
            <div>
              <label className={labelCls}>Kelurahan / Desa</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className={inputCls}
                placeholder="Kelurahan / Desa"
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Alamat Lengkap</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={inputCls}
                placeholder="Alamat lengkap"
                rows={3}
              />
            </div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#C89B3C] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#b8892f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Menyimpan..." : "Simpan Jamaah"}
          </button>
        </div>
      </form>
    </motion.div>
  )
}

