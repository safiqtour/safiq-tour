"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Save, ImageIcon, Plus, X } from "lucide-react"
import { getAllActiveCountries } from "@/actions/country"
import { getCitiesByCountry } from "@/actions/city"
import { createHotel, updateHotel, getHotel } from "@/actions/hotel"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { cn } from "@/lib/utils"
import type { CountryBrief, CityBrief, HotelDetail } from "@/types/hospitality"

const STEPS = ["Informasi Hotel", "Gallery", "Review"]

type GalleryEntry = { mediaId: string; sortOrder: number }

interface HotelFormState {
  name: string
  starRating: number
  address: string
  mapsUrl: string
  phone: string
  email: string
  website: string
  countryId: string
  regionId: string
  cityId: string
  destinationId: string
  distanceToHaram: string
  distanceToNabawi: string
  shortDescription: string
  description: string
  status: string
  sortOrder: number
  featuredMediaId: string | null
  galleryMediaIds: GalleryEntry[]
}

interface HotelWizardProps {
  hotelId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

const emptyForm = (): HotelFormState => ({
  name: "",
  starRating: 3,
  address: "",
  mapsUrl: "",
  phone: "",
  email: "",
  website: "",
  countryId: "",
  regionId: "",
  cityId: "",
  destinationId: "",
  distanceToHaram: "",
  distanceToNabawi: "",
  shortDescription: "",
  description: "",
  status: "ACTIVE",
  sortOrder: 0,
  featuredMediaId: null,
  galleryMediaIds: [],
})

export function HotelWizard({ hotelId, onSuccess, onCancel }: HotelWizardProps) {
  const [step, setStep] = useState(0)
  const [dataLoading, setDataLoading] = useState(!!hotelId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [countries, setCountries] = useState<CountryBrief[]>([])
  const [cities, setCities] = useState<CityBrief[]>([])

  const [form, setForm] = useState<HotelFormState>(emptyForm)

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<"featured" | "gallery">("gallery")

  const fetchCountries = useCallback(async () => {
    const res = await getAllActiveCountries()
    setCountries((res ?? []) as unknown as CountryBrief[])
  }, [])

  useEffect(() => { fetchCountries() }, [fetchCountries])

  useEffect(() => {
    if (form.countryId) {
      getCitiesByCountry(form.countryId).then((res) => setCities((res ?? []) as unknown as CityBrief[])).catch(() => setCities([]))
    } else { setCities([]) }
  }, [form.countryId])

  useEffect(() => {
    if (hotelId) {
      setDataLoading(true)
      getHotel(hotelId).then((res) => {
        const h = res as unknown as HotelDetail | null
        if (h) {
          setForm({
            name: h.name ?? "",
            starRating: h.starRating ?? 3,
            address: h.address ?? "",
            mapsUrl: h.mapsUrl ?? "",
            phone: h.phone ?? "",
            email: h.email ?? "",
            website: h.website ?? "",
            countryId: h.countryId ?? "",
            regionId: h.regionId ?? "",
            cityId: h.cityId ?? "",
            destinationId: h.destinationId ?? "",
            distanceToHaram: h.distanceToHaram ?? "",
            distanceToNabawi: h.distanceToNabawi ?? "",
            shortDescription: h.shortDescription ?? "",
            description: h.description ?? "",
            status: h.status ?? "ACTIVE",
            sortOrder: h.sortOrder ?? 0,
            featuredMediaId: h.featuredMediaId ?? null,
            galleryMediaIds: (h.media ?? []).filter((m) => m.type === "GALLERY").map((m) => ({ mediaId: m.mediaId, sortOrder: m.sortOrder })),
          })
        }
        setDataLoading(false)
      }).catch(() => setDataLoading(false))
    }
  }, [hotelId])

  const updateField = <K extends keyof HotelFormState>(field: K, value: HotelFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleMediaSelect = (media: { id: string; url: string; thumbnailUrl?: string | null; alt?: string | null }) => {
    if (pickerMode === "featured") {
      updateField("featuredMediaId", media.id)
    } else {
      updateField("galleryMediaIds", [...form.galleryMediaIds, { mediaId: media.id, sortOrder: form.galleryMediaIds.length }])
    }
  }

  const removeGalleryImage = (mediaId: string) => {
    updateField("galleryMediaIds", form.galleryMediaIds.filter((g) => g.mediaId !== mediaId))
  }

  // Dynamic distance based on selected city (Makkah -> Masjidil Haram, Madinah -> Masjid Nabawi)
  const selectedCity = cities.find((c) => c.id === form.cityId)
  const cityName = (selectedCity?.name ?? "").toUpperCase()
  const isMakkah = cityName.includes("MAKKAH") || cityName === "MAKKA"
  const isMadinah = cityName.includes("MADIN")

  const validateStep = (): boolean => {
    setError("")
    if (step === 0) {
      if (!form.name.trim()) { setError("Nama hotel wajib diisi"); return false }
      if (!form.countryId) { setError("Negara wajib diisi"); return false }
    }
    return true
  }

  const nextStep = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEPS.length - 1)) }
  const prevStep = () => setStep((s) => Math.max(s - 1, 0))

  const handleSave = async () => {
    setSaving(true); setError("")
    try {
      if (hotelId) { await updateHotel(hotelId, form) }
      else { await createHotel(form) }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save hotel")
    } finally { setSaving(false) }
  }

  if (dataLoading) return <div className="flex items-center justify-center py-20"><div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <button onClick={() => i <= step ? setStep(i) : undefined} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap", i === step ? "bg-[#0B3C6D] text-white" : i < step ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400")}>
              {i < step ? <Check className="size-3" /> : <span>{i + 1}</span>}
              <span className="hidden sm:inline">{s}</span>
            </button>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      {error && <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">


          {step === 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Informasi Hotel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Nama Hotel *</label>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="e.g. Pullman Zamzam" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Bintang</label>
                  <select value={form.starRating} onChange={(e) => updateField("starRating", Number(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s} Bintang</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Status</label>
                  <select value={form.status} onChange={(e) => updateField("status", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Negara *</label>
                  <select value={form.countryId} onChange={(e) => { updateField("countryId", e.target.value); updateField("regionId", ""); updateField("cityId", ""); updateField("destinationId", "") }} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="">Pilih negara</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Kota</label>
                  <select value={form.cityId} onChange={(e) => { updateField("cityId", e.target.value); updateField("destinationId", "") }} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="">Pilih kota</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                {isMakkah && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Jarak ke Masjidil Haram</label>
                    <input type="text" value={form.distanceToHaram} onChange={(e) => updateField("distanceToHaram", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="e.g. 350m" />
                  </div>
                )}
                {isMadinah && (
                  <div>
                    <label className="text-xs font-medium text-gray-500">Jarak ke Masjid Nabawi</label>
                    <input type="text" value={form.distanceToNabawi} onChange={(e) => updateField("distanceToNabawi", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="e.g. 200m" />
                  </div>
                )}
                {!isMakkah && !isMadinah && (
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-400">Pilih kota Makkah atau Madinah untuk mengisi jarak ke masjid.</p>
                  </div>
                )}


                <div>
                  <label className="text-xs font-medium text-gray-500">Alamat</label>
                  <input type="text" value={form.address} onChange={(e) => updateField("address", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Google Maps URL</label>
                  <input type="text" value={form.mapsUrl} onChange={(e) => updateField("mapsUrl", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="https://maps.google.com/..." />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Telepon</label>
                  <input type="text" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Email</label>
                  <input type="text" value={form.email} onChange={(e) => updateField("email", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Website</label>
                  <input type="text" value={form.website} onChange={(e) => updateField("website", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Urutan (Sort Order)</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => updateField("sortOrder", Number(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Deskripsi Singkat</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="Deskripsi singkat" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Deskripsi</label>
                  <textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="Deskripsi lengkap (mencakup fasilitas hotel)" />
                </div>
              </div>
            </div>
          )}


          {step === 1 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Gallery</h3>
                <button onClick={() => { setPickerMode("gallery"); setPickerOpen(true) }} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-3 py-1.5 text-xs font-medium text-white">
                  <Plus className="size-3" /> Tambah Gambar
                </button>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500">Gambar Utama (Featured)</label>
                <div className="mt-1">
                  <button onClick={() => { setPickerMode("featured"); setPickerOpen(true) }} className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-gray-400">
                    {form.featuredMediaId ? <span className="text-green-600">Gambar utama dipilih</span> : <><ImageIcon className="size-4" /> Pilih gambar utama</>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {form.galleryMediaIds.map((g) => (
                  <div key={g.mediaId} className="relative aspect-square rounded-lg bg-gray-100 overflow-hidden group">
                    <div className="size-full flex items-center justify-center"><ImageIcon className="size-6 text-gray-300" /></div>
                    <button onClick={() => removeGalleryImage(g.mediaId)} className="absolute top-1 right-1 rounded-full bg-red-500 p-0.5 text-white opacity-0 group-hover:opacity-100"><X className="size-3" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}


          {step === 2 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Review</h3>
              <p className="text-xs text-gray-400">Tinjau kembali informasi hotel sebelum menyimpan.</p>
              <div className="space-y-3 text-sm">
                <ReviewRow label="Nama" value={form.name} />
                <ReviewRow label="Bintang" value={`${form.starRating} Bintang`} />
                <ReviewRow label="Status" value={form.status} />
                <ReviewRow label="Negara" value={countries.find((c) => c.id === form.countryId)?.name ?? form.countryId} />
                <ReviewRow label="Kota" value={cities.find((c) => c.id === form.cityId)?.name ?? form.cityId} />
                {isMakkah && <ReviewRow label="Jarak ke Masjidil Haram" value={form.distanceToHaram} />}
                {isMadinah && <ReviewRow label="Jarak ke Masjid Nabawi" value={form.distanceToNabawi} />}
                <ReviewRow label="Google Maps URL" value={form.mapsUrl} />
                <ReviewRow label="Gambar Gallery" value={`${form.galleryMediaIds.length} gambar`} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button onClick={onCancel || prevStep} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {hotelId ? "Batal" : "Kembali"}
        </button>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={prevStep} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ChevronLeft className="size-4" /> Sebelumnya
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52]">
              Berikutnya <ChevronRight className="size-4" />
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:opacity-50">
              {saving ? "Menyimpan..." : <><Save className="size-4" /> Simpan Hotel</>}
            </button>
          )}
        </div>
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleMediaSelect} />
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">{label}</span><span className="font-medium text-gray-800">{value || "—"}</span></div>
}

