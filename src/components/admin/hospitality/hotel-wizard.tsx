"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, ChevronLeft, ChevronRight, Save, ImageIcon, Plus, X } from "lucide-react"
import { getAllActiveCountries } from "@/actions/country"
import { getCitiesByCountry } from "@/actions/city"
import { getAllHotelAmenities, createHotel, updateHotel, getHotel } from "@/actions/hotel"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { cn } from "@/lib/utils"
import type { CountryBrief, CityBrief, HotelAmenityItem, HotelDetail } from "@/types/hospitality"

const STEPS = ["Basic", "Location", "Amenities", "Room Types", "Gallery", "Policy", "Review"]

const ROOM_TYPE_PRESETS = ["Standard", "Quad", "Triple", "Double", "Suite", "Family"]

const POLICY_TYPES = ["CHECK_IN", "CHECK_OUT", "CANCELLATION", "SMOKING", "CHILDREN", "PETS"]

const POLICY_LABELS: Record<string, string> = {
  CHECK_IN: "Check In Policy", CHECK_OUT: "Check Out Policy",
  CANCELLATION: "Cancellation Policy", SMOKING: "Smoking Policy",
  CHILDREN: "Children Policy", PETS: "Pets Policy",
}

type RoomTypeEntry = { name: string; description: string; price: number; capacity: number; sortOrder: number }
type PolicyEntry = { type: string; content: string; sortOrder: number }
type GalleryEntry = { mediaId: string; sortOrder: number }

interface HotelFormState {
  name: string; starRating: number; distanceToHaram: string; distanceToNabawi: string
  latitude: string; longitude: string; address: string; mapsUrl: string
  phone: string; email: string; website: string; checkIn: string; checkOut: string
  shortDescription: string; description: string; status: string; sortOrder: number
  countryId: string; regionId: string; cityId: string; destinationId: string
  featuredMediaId: string | null
  amenityIds: string[]
  galleryMediaIds: GalleryEntry[]
  roomTypes: RoomTypeEntry[]
  policies: PolicyEntry[]
}

interface HotelWizardProps {
  hotelId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function HotelWizard({ hotelId, onSuccess, onCancel }: HotelWizardProps) {
  const [step, setStep] = useState(0)
  const [dataLoading, setDataLoading] = useState(!!hotelId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [countries, setCountries] = useState<CountryBrief[]>([])
  const [cities, setCities] = useState<CityBrief[]>([])
  const [amenities, setAmenities] = useState<HotelAmenityItem[]>([])

  const [form, setForm] = useState<HotelFormState>({
    name: "", starRating: 3, distanceToHaram: "", distanceToNabawi: "", latitude: "", longitude: "",
    address: "", mapsUrl: "", phone: "", email: "", website: "", checkIn: "14:00", checkOut: "12:00",
    shortDescription: "", description: "", status: "ACTIVE", sortOrder: 0,
    countryId: "", regionId: "", cityId: "", destinationId: "", featuredMediaId: null,
    amenityIds: [], galleryMediaIds: [], roomTypes: [], policies: [],
  })

  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerMode, setPickerMode] = useState<"featured" | "gallery">("gallery")

  const fetchCountries = useCallback(async () => {
    const res = await getAllActiveCountries()
    setCountries((res ?? []) as unknown as CountryBrief[])
  }, [])

  const fetchAmenities = useCallback(async () => {
    try {
      const res = await getAllHotelAmenities()
      setAmenities((res ?? []) as unknown as HotelAmenityItem[])
    } catch { setAmenities([]) }
  }, [])

  useEffect(() => { fetchCountries(); fetchAmenities() }, [fetchCountries, fetchAmenities])

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
            name: h.name ?? "", starRating: h.starRating ?? 3, distanceToHaram: h.distanceToHaram ?? "",
            distanceToNabawi: h.distanceToNabawi ?? "", latitude: h.latitude ?? "", longitude: h.longitude ?? "",
            address: h.address ?? "", mapsUrl: h.mapsUrl ?? "", phone: h.phone ?? "", email: h.email ?? "",
            website: h.website ?? "", checkIn: h.checkIn ?? "14:00", checkOut: h.checkOut ?? "12:00",
            shortDescription: h.shortDescription ?? "", description: h.description ?? "",
            status: h.status ?? "ACTIVE", sortOrder: h.sortOrder ?? 0,
            countryId: h.countryId ?? "", regionId: h.regionId ?? "", cityId: h.cityId ?? "",
            destinationId: h.destinationId ?? "", featuredMediaId: h.featuredMediaId ?? null,
            amenityIds: (h.hotelAmenities ?? []).map((a) => a.amenity.id),
            galleryMediaIds: (h.media ?? []).filter((m) => m.type === "GALLERY").map((m) => ({ mediaId: m.mediaId, sortOrder: m.sortOrder })),
            roomTypes: (h.roomTypes ?? []).map((r) => ({ name: r.name, description: r.description ?? "", price: r.price ?? 0, capacity: r.capacity ?? 2, sortOrder: r.sortOrder })),
            policies: (h.policies ?? []).map((p) => ({ type: p.type, content: p.content, sortOrder: p.sortOrder })),
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

  const addRoomType = (name?: string) => {
    updateField("roomTypes", [...form.roomTypes, { name: name || ROOM_TYPE_PRESETS[0], description: "", price: 0, capacity: 2, sortOrder: form.roomTypes.length }])
  }

  const updateRoomType = (index: number, field: keyof RoomTypeEntry, value: unknown) => {
    const updated = [...form.roomTypes]
    updated[index] = { ...updated[index], [field]: value }
    updateField("roomTypes", updated)
  }

  const removeRoomType = (index: number) => {
    updateField("roomTypes", form.roomTypes.filter((_, i) => i !== index))
  }

  const updatePolicy = (type: string, content: string) => {
    const existing = form.policies.findIndex((p) => p.type === type)
    if (existing >= 0) {
      const updated = [...form.policies]
      updated[existing] = { ...updated[existing], content }
      updateField("policies", updated)
    } else {
      updateField("policies", [...form.policies, { type, content, sortOrder: form.policies.length }])
    }
  }

  const getPolicyContent = (type: string): string => {
    return form.policies.find((p) => p.type === type)?.content ?? ""
  }

  const toggleAmenity = (amenityId: string) => {
    const current = form.amenityIds
    if (current.includes(amenityId)) {
      updateField("amenityIds", current.filter((id) => id !== amenityId))
    } else {
      updateField("amenityIds", [...current, amenityId])
    }
  }

  const validateStep = (): boolean => {
    setError("")
    if (step === 0) { if (!form.name.trim()) { setError("Hotel name is required"); return false }; return true }
    if (step === 1) { if (!form.countryId) { setError("Country is required"); return false }; return true }
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
              <h3 className="text-sm font-bold text-gray-900">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Hotel Name *</label>
                  <input type="text" value={form.name} onChange={(e) => updateField("name", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" placeholder="e.g. Pullman Zamzam" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Star Rating</label>
                  <select value={form.starRating} onChange={(e) => updateField("starRating", Number(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>{s} Star{s > 1 ? "s" : ""}</option>)}
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
                  <label className="text-xs font-medium text-gray-500">Check In</label>
                  <input type="text" value={form.checkIn} onChange={(e) => updateField("checkIn", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Check Out</label>
                  <input type="text" value={form.checkOut} onChange={(e) => updateField("checkOut", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => updateField("shortDescription", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="Brief description" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Description</label>
                  <textarea rows={4} value={form.description} onChange={(e) => updateField("description", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="Full description" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Sort Order</label>
                  <input type="number" value={form.sortOrder} onChange={(e) => updateField("sortOrder", Number(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500">Country *</label>
                  <select value={form.countryId} onChange={(e) => { updateField("countryId", e.target.value); updateField("regionId", ""); updateField("cityId", ""); updateField("destinationId", "") }} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">City</label>
                  <select value={form.cityId} onChange={(e) => { updateField("cityId", e.target.value); updateField("destinationId", "") }} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400">
                    <option value="">Select city</option>
                    {cities.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Latitude</label>
                  <input type="text" value={form.latitude} onChange={(e) => updateField("latitude", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Longitude</label>
                  <input type="text" value={form.longitude} onChange={(e) => updateField("longitude", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-gray-500">Address</label>
                  <textarea rows={2} value={form.address} onChange={(e) => updateField("address", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Google Maps URL</label>
                  <input type="text" value={form.mapsUrl} onChange={(e) => updateField("mapsUrl", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Distance to Haram</label>
                  <input type="text" value={form.distanceToHaram} onChange={(e) => updateField("distanceToHaram", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="e.g. 350m" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500">Distance to Nabawi</label>
                  <input type="text" value={form.distanceToNabawi} onChange={(e) => updateField("distanceToNabawi", e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder="e.g. 200m" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Amenities</h3>
              <p className="text-xs text-gray-400">Select the amenities available at this hotel</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {amenities.map((a) => {
                  const selected = form.amenityIds.includes(a.id)
                  return (
                    <button key={a.id} onClick={() => toggleAmenity(a.id)} className={cn("flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all text-left", selected ? "border-blue-300 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300")}>
                      <div className={cn("size-4 rounded border flex items-center justify-center", selected ? "bg-blue-500 border-blue-500" : "border-gray-300")}>
                        {selected && <Check className="size-3 text-white" />}
                      </div>
                      {a.name}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Room Types</h3>
                <select onChange={(e) => { if (e.target.value) { addRoomType(e.target.value); e.target.value = "" } }} className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs outline-none">
                  <option value="">Add room type...</option>
                  {ROOM_TYPE_PRESETS.filter((p) => !form.roomTypes.some((r) => r.name === p)).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {form.roomTypes.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No room types added yet.</p>}
              <div className="space-y-3">
                {form.roomTypes.map((rt, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-gray-200 p-3">
                    <div className="flex items-center gap-2 flex-1 flex-wrap">
                      <select value={rt.name} onChange={(e) => updateRoomType(i, "name", e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none">
                        {ROOM_TYPE_PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <input type="number" value={rt.price} onChange={(e) => updateRoomType(i, "price", Number(e.target.value))} className="w-24 rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none" placeholder="Price" />
                      <input type="number" value={rt.capacity} onChange={(e) => updateRoomType(i, "capacity", Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none" placeholder="Capacity" />
                      <input type="text" value={rt.description} onChange={(e) => updateRoomType(i, "description", e.target.value)} className="flex-1 min-w-[120px] rounded-lg border border-gray-200 px-2 py-1.5 text-sm outline-none" placeholder="Description" />
                    </div>
                    <button onClick={() => removeRoomType(i)} className="rounded-lg p-1.5 text-red-400 hover:bg-red-50"><X className="size-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900">Gallery</h3>
                <button onClick={() => { setPickerMode("gallery"); setPickerOpen(true) }} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-3 py-1.5 text-xs font-medium text-white">
                  <Plus className="size-3" /> Add Images
                </button>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-500">Featured Image</label>
                <div className="mt-1">
                  <button onClick={() => { setPickerMode("featured"); setPickerOpen(true) }} className="flex items-center gap-2 rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500 hover:border-gray-400">
                    {form.featuredMediaId ? <span className="text-green-600">Featured image selected</span> : <><ImageIcon className="size-4" /> Select featured image</>}
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

          {step === 5 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Policies</h3>
              <div className="space-y-3">
                {POLICY_TYPES.map((type) => (
                  <div key={type}>
                    <label className="text-xs font-medium text-gray-500">{POLICY_LABELS[type]}</label>
                    <textarea rows={2} value={getPolicyContent(type)} onChange={(e) => updatePolicy(type, e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-blue-400" placeholder={`Enter ${POLICY_LABELS[type].toLowerCase()}...`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Review</h3>
              <p className="text-xs text-gray-400">Review your hotel information before saving.</p>
              <div className="space-y-3 text-sm">
                <ReviewRow label="Name" value={form.name} />
                <ReviewRow label="Star Rating" value={`${form.starRating} Star${form.starRating > 1 ? "s" : ""}`} />
                <ReviewRow label="Status" value={form.status} />
                <ReviewRow label="Check In / Out" value={`${form.checkIn} / ${form.checkOut}`} />
                <ReviewRow label="Country" value={countries.find((c) => c.id === form.countryId)?.name ?? form.countryId} />
                <ReviewRow label="City" value={cities.find((c) => c.id === form.cityId)?.name ?? form.cityId} />
                <ReviewRow label="Amenities" value={`${form.amenityIds.length} selected`} />
                <ReviewRow label="Room Types" value={`${form.roomTypes.length} type(s)`} />
                <ReviewRow label="Gallery Images" value={`${form.galleryMediaIds.length} image(s)`} />
                <ReviewRow label="Policies" value={`${form.policies.length} policy/ies`} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <button onClick={onCancel || prevStep} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
          {hotelId ? "Cancel" : "Back"}
        </button>
        <div className="flex gap-2">
          {step > 0 && (
            <button onClick={prevStep} className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <ChevronLeft className="size-4" /> Previous
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button onClick={nextStep} className="flex items-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52]">
              Next <ChevronRight className="size-4" />
            </button>
          ) : (
            <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-green-600/20 hover:bg-green-700 disabled:opacity-50">
              {saving ? "Saving..." : <><Save className="size-4" /> Save Hotel</>}
            </button>
          )}
        </div>
      </div>

      <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} onSelect={handleMediaSelect} />
    </div>
  )
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between border-b border-gray-100 pb-2"><span className="text-gray-500">{label}</span><span className="font-medium text-gray-800">{value || "\u2014"}</span></div>
}
