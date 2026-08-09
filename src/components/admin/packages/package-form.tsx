"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Image from "next/image"
import {
  Info,
  DollarSign,
  Building2,
  Calendar,
  ListChecks,
  FileText,
  ImageIcon,
  Search,
  Send,
  Eye,
  Copy,
  Save,
  Loader2,
  Plus,
  Trash2,

} from "lucide-react"
import { packageFormSchema, type PackageFormValues } from "@/lib/packages/schema"
import { slugify } from "@/lib/packages/utils"
import { TipTapEditor } from "./tiptap-editor"
import { ImageUpload } from "./image-upload"
import type { PackageData, PackageCategory } from "@/lib/packages/types"
import { getHotels } from "@/actions/hotel"
import type { HotelListItem } from "@/types/hospitality"
import { getPackageCategories } from "@/modules/business/package-category/actions/package-category"
import { getPackageTypes } from "@/modules/business/package-type/actions/package-type"
import type { PackageCategoryListItem } from "@/modules/business/package-category/types"
import type { PackageTypeListItem } from "@/modules/business/package-type/types"

const tabs = [
  { id: "general", label: "General", icon: Info },
  { id: "pricing", label: "Harga", icon: DollarSign },
  { id: "hotel", label: "Hotel", icon: Building2 },
  { id: "schedule", label: "Jadwal", icon: Calendar },
  { id: "facilities", label: "Fasilitas", icon: ListChecks },
  { id: "itinerary", label: "Itinerary", icon: FileText },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "seo", label: "SEO", icon: Search },
  { id: "publish", label: "Publish", icon: Send },
] as const

type TabId = (typeof tabs)[number]["id"]

interface HotelRow {
  type: "MEKKAH" | "MADINAH"
  hotelId?: string | null
  name: string
  stars: number
  distance: string
  mapsUrl: string
  image: string
  city?: string
}

const defaultFacilities = [
  "Visa", "Hotel", "Makan", "Transportasi", "Bus AC", "Zamzam",
  "Perlengkapan", "Handling", "Asuransi", "Tour Leader", "Muthowif",
  "City Tour", "Kereta Cepat", "Laundry", "SIM Card", "Air Mineral",
]

const LEGACY_CATEGORIES: PackageCategory[] = ["REGULAR", "PLUS", "EXECUTIVE", "LUXURY", "PRIVATE"]

// `category` is a hidden legacy field (no UI control). Normalize legacy DB values to one
// of the Zod enum options, defaulting to REGULAR when the value is out-of-enum or empty.
function normalizeLegacyCategory(value: string | null | undefined): PackageCategory {
  const v = (value ?? "").trim().toUpperCase()
  return (LEGACY_CATEGORIES as string[]).includes(v) ? (v as PackageCategory) : "REGULAR"
}

interface PackageFormProps {
  initialData?: PackageData
  action: (formData: FormData) => Promise<void>
}

export function PackageForm({ initialData, action }: PackageFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>("general")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [itineraries, setItineraries] = useState(
    initialData?.itineraries ?? [{ day: 1, title: "", description: "", image: "" }]
  )
  const [facilities, setFacilities] = useState<string[]>(
    initialData?.facilities?.map((f) => f.name) ?? []
  )
  const [galleries, setGalleries] = useState(
    initialData?.galleries ?? []
  )
  const [hotels, setHotels] = useState<HotelRow[]>(
    initialData?.hotels?.map((h) => ({
      type: h.type === "MADINAH" ? "MADINAH" : "MEKKAH",
      hotelId: h.hotelId ?? null,
      name: h.name,
      stars: h.stars,
      distance: h.distance,
      mapsUrl: h.mapsUrl,
      image: h.image,
      city: h.type === "MADINAH" ? "Madinah" : "Mekkah",
    })) ?? []
  )
  function toDateInputValue(value: unknown): string {
    if (!value) return ""
    const d = value instanceof Date ? value : new Date(value as string)
    if (isNaN(d.getTime())) return ""
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  // Schedules from Prisma arrive as Date objects (or ISO strings with time). Normalize
  // them ONCE to a single yyyy-MM-dd string shared by both the rendered inputs and the
  // RHF defaultValues (which zodResolver validates). This prevents the resolver from
  // failing on raw Date objects for legacy packages that have schedules.
  const normalizedSchedules = (initialData?.schedules ?? []).map((s) => ({
    ...s,
    departureDate: toDateInputValue(s.departureDate),
    returnDate: toDateInputValue(s.returnDate),
  }))

  const [schedules, setSchedules] = useState(
    initialData?.schedules
      ? normalizedSchedules
      : [{ departureDate: "", returnDate: "", meetingPoint: "", seat: 0, seatFilled: 0 }]
  )
  const [customFacility, setCustomFacility] = useState("")
  const [masterHotels, setMasterHotels] = useState<HotelListItem[]>([])
  const [masterCategories, setMasterCategories] = useState<PackageCategoryListItem[]>([])
  const [masterTypes, setMasterTypes] = useState<PackageTypeListItem[]>([])

  useEffect(() => {
    getHotels({ page: 1, limit: 100, status: "ACTIVE" })
      .then((res) => setMasterHotels((res.data ?? []) as unknown as HotelListItem[]))
      .catch(() => setMasterHotels([]))
  }, [])

  useEffect(() => {
    getPackageCategories({ page: 1, limit: 100, status: "ACTIVE" })
      .then((res) => setMasterCategories((res.data ?? []) as unknown as PackageCategoryListItem[]))
      .catch(() => setMasterCategories([]))
  }, [])

  useEffect(() => {
    getPackageTypes({ page: 1, limit: 100, status: "ACTIVE" })
      .then((res) => setMasterTypes((res.data ?? []) as unknown as PackageTypeListItem[]))
      .catch(() => setMasterTypes([]))
  }, [])

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    getValues,
    formState: { errors },
  } = useForm<PackageFormValues>({
    resolver: zodResolver(packageFormSchema as never),
    defaultValues: initialData
      ? {
          ...initialData,
          // Legacy enum field (no UI control): normalize out-of-enum/empty DB values.
          category: normalizeLegacyCategory(initialData.category),
          hotels: initialData.hotels ?? [],
          // Normalize to yyyy-MM-dd and drop empty placeholder rows so the zod
          // resolver doesn't reject legacy packages (raw Date objects / empty rows).
          schedules: normalizedSchedules.filter((s) => (s.departureDate ?? "").trim()),
          facilities: initialData.facilities ?? [],
          itineraries: initialData.itineraries ?? [],
          galleries: initialData.galleries ?? [],
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          description: "",
          category: "REGULAR",
          country: "",
          city: "",
          duration: 0,
          price: 0,
          promoPrice: null,
          discount: 0,
          currency: "IDR",
          airline: "",
          quota: 0,
          seatFilled: 0,
          status: "DRAFT",
          featured: false,
          badge: null,
          thumbnail: "",
          heroImage: "",
          metaTitle: "",
          metaDescription: "",
          keywords: "",
          packageCategoryId: null,
          packageTypeId: null,
          hotels: [],
          schedules: [],
          facilities: [],
          itineraries: [],
          galleries: [],
        },
  })

  const selectedTypeId = watch("packageTypeId")

  useEffect(() => {
    if (!selectedTypeId) return
    const selectedType = masterTypes.find((t) => t.id === selectedTypeId)
    if (!selectedType) return

    const currentDuration = getValues("duration")
    const currentCategoryId = getValues("packageCategoryId")

    if (
      (currentDuration === 0 || currentDuration === null || currentDuration === undefined) &&
      selectedType.defaultDurationDays > 0
    ) {
      setValue("duration", selectedType.defaultDurationDays)
    }

    // Never overwrite a user-selected category: only auto-fill when it is empty.
    if (
      (currentCategoryId === null || currentCategoryId === undefined || currentCategoryId === "") &&
      selectedType.defaultCategoryId
    ) {
      setValue("packageCategoryId", selectedType.defaultCategoryId)
    }
  }, [selectedTypeId, masterTypes])

  const title = watch("title")

  async function onSubmit(data: PackageFormValues) {
    setIsSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(data).forEach(([key, val]) => {
        if (key === "hotels" || key === "schedules" || key === "facilities" || key === "itineraries" || key === "galleries") {
          if (key === "facilities") {
            fd.append(key, JSON.stringify(facilities.map((f) => ({ name: f, icon: "" }))))
          } else if (key === "itineraries") {
            // Only submit rows with a title; skip empty placeholder rows so Zod
            // doesn't reject the payload (title is required in the schema).
            fd.append(key, JSON.stringify(itineraries.filter((it) => (it.title ?? "").trim())))
          } else if (key === "galleries") {
            fd.append(key, JSON.stringify(galleries))
          } else if (key === "hotels") {
            // Only submit rows with the required fields filled (name, distance);
            // skip empty placeholder rows so Zod doesn't reject the payload.
            fd.append(key, JSON.stringify(hotels
              .filter((h) => (h.name ?? "").trim() && (h.distance ?? "").trim())
              .map((h) => ({
                type: h.type,
                hotelId: h.hotelId ?? null,
                name: h.name,
                stars: h.stars,
                distance: h.distance,
                mapsUrl: h.mapsUrl,
                image: h.image,
              }))))
          } else if (key === "schedules") {
            // seatFilled is system-controlled (managed by booking seat lifecycle);
            // never send it from the UI. Only seat (capacity) is editable.
            // Skip empty placeholder rows so Zod (departureDate is required)
            // doesn't reject the payload on save.
            fd.append(key, JSON.stringify(schedules
              .filter((s) => (s.departureDate ?? "").trim())
              .map((s) => ({
                departureDate: s.departureDate,
                returnDate: s.returnDate,
                meetingPoint: s.meetingPoint,
                seat: s.seat,
              }))))
          }
        } else if (val !== null && val !== undefined) {
          const normalized =
            key === "packageCategoryId" || key === "packageTypeId"
              ? val === "" || val === "null"
                ? null
                : val
              : val
          if (normalized !== null) {
  fd.append(key, String(normalized))
}
        }
      })
      await action(fd)
    } catch {
      toast.error("Gagal menyimpan paket")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addItinerary = () => {
    setItineraries([...itineraries, { day: itineraries.length + 1, title: "", description: "", image: "" }])
  }

  const removeItinerary = (idx: number) => {
    setItineraries(itineraries.filter((_, i) => i !== idx).map((it, i) => ({ ...it, day: i + 1 })))
  }

  const addSchedule = () => {
    setSchedules([...schedules, { departureDate: "", returnDate: "", meetingPoint: "", seat: 0, seatFilled: 0 }])
  }

  const addHotel = () => {
    setHotels([...hotels, { type: "MEKKAH", hotelId: null, name: "", stars: 5, distance: "", mapsUrl: "", image: "", city: "Mekkah" }])
  }

  const removeHotel = (idx: number) => {
    setHotels(hotels.filter((_, i) => i !== idx))
  }

  const updateHotel = (idx: number, patch: Partial<HotelRow>) => {
    setHotels(hotels.map((h, i) => (i === idx ? { ...h, ...patch } : h)))
  }

  const applyMasterHotel = (idx: number, hotel: HotelListItem) => {
    const cityName = (hotel.city?.name ?? "").toLowerCase()
    const type: "MEKKAH" | "MADINAH" = cityName.includes("madin") ? "MADINAH" : "MEKKAH"
    updateHotel(idx, {
      hotelId: hotel.id,
      name: hotel.name,
      stars: hotel.starRating,
      type,
      city: (hotel.city?.name ?? "") || (type === "MADINAH" ? "Madinah" : "Mekkah"),
      image: hotel.featuredMedia?.url || "",
    })
  }

  const toggleFacility = (fac: string) => {
    setFacilities((prev) => prev.includes(fac) ? prev.filter((f) => f !== fac) : [...prev, fac])
  }

  const addCustomFacility = () => {
    if (customFacility && !facilities.includes(customFacility)) {
      setFacilities([...facilities, customFacility])
      setCustomFacility("")
    }
  }

  const renderTab = (tabId: TabId) => {
    switch (tabId) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Nama Paket</label>
                <input
                  {...register("title")}
                  onChange={(e) => {
                    setValue("title", e.target.value)
                    if (!initialData) setValue("slug", slugify(e.target.value))
                  }}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Slug</label>
                <input
                  {...register("slug")}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
                />
                {errors.slug && <p className="mt-1 text-xs text-red-500">{errors.slug.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Kategori Paket</label>
                <Controller
                  name="packageCategoryId"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                    >
                      <option value="">Pilih kategori paket</option>
                      {masterCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name} {cat.shortName ? `(${cat.shortName})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Tipe Paket</label>
                <Controller
                  name="packageTypeId"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                    >
                      <option value="">Pilih tipe paket</option>
                      {masterTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name} {type.shortName ? `(${type.shortName})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Negara</label>
                <input {...register("country")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Kota</label>
                <input {...register("city")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Durasi (hari)</label>
                <input type="number" {...register("duration")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Kuota</label>
                <input type="number" {...register("quota")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Maskapai</label>
                <input {...register("airline")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Deskripsi Singkat</label>
                <textarea {...register("excerpt")} rows={3} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all resize-none" />
                {errors.excerpt && <p className="mt-1 text-xs text-red-500">{errors.excerpt.message}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Deskripsi</label>
                <TipTapEditor
                  value={watch("description") ?? ""}
                  onChange={(val) => setValue("description", val)}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <ImageUpload
                label="Thumbnail"
                value={watch("thumbnail") ?? ""}
                onChange={(url) => setValue("thumbnail", url)}
              />
              <ImageUpload
                label="Hero Image"
                value={watch("heroImage") ?? ""}
                onChange={(url) => setValue("heroImage", url)}
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-2 text-sm text-[#6B7280]">
                <input type="checkbox" {...register("featured")} className="rounded border-[#E5E7EB] text-[#C89B3C] focus:ring-[#C89B3C]/20" />
                Featured
              </label>
              <Controller
                name="badge"
                control={control}
                render={({ field }) => (
                  <select
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value === "" ? null : e.target.value)}
                    className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-[#0B3C6D] outline-none"
                  >
                    <option value="">No Badge</option>
                    <option value="BEST_SELLER">Best Seller</option>
                    <option value="NEW">New</option>
                    <option value="PROMO">Promo</option>
                  </select>
                )}
              />
            </div>
          </div>
        )

      case "pricing":
        return (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Harga Normal (Rp)</label>
                <input type="number" {...register("price")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Harga Promo (Rp)</label>
                <input type="number" {...register("promoPrice")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Diskon (%)</label>
                <input type="number" {...register("discount")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Mata Uang</label>
                <select {...register("currency")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all">
                  <option value="IDR">IDR</option>
                  <option value="USD">USD</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>
            </div>
            <div className="rounded-xl bg-[#F8FAFC] p-4">
              <p className="text-sm text-[#6B7280]">
                Harga Normal: <span className="font-semibold text-[#0B3C6D]">Rp {Number(watch("price")).toLocaleString("id-ID")}</span>
              </p>
              {watch("promoPrice") && (
                <p className="text-sm text-[#6B7280]">
                  Harga Promo: <span className="font-semibold text-[#C89B3C]">Rp {Number(watch("promoPrice")).toLocaleString("id-ID")}</span>
                </p>
              )}
            </div>
          </div>
        )

      case "hotel":
        return (
          <div className="space-y-4">
            {hotels.map((h, i) => {
              const sel = masterHotels.find((m) => m.id === h.hotelId)
              return (
                <div key={i} className="rounded-2xl border border-[#E5E7EB] p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-heading text-sm font-bold text-[#0B3C6D]">Hotel {i + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeHotel(i)}
                      className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="size-4" /> Hapus
                    </button>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Pilih Hotel (Master Data)</label>
                      <select
                        value={h.hotelId ?? ""}
                        onChange={(e) => {
                          const m = masterHotels.find((mm) => mm.id === e.target.value)
                          if (m) applyMasterHotel(i, m)
                        }}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                      >
                        <option value="">— Pilih hotel dari master data —</option>
                        {masterHotels.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                            {m.city?.name ? ` (${m.city.name})` : ""} • {m.starRating}★
                          </option>
                        ))}
                      </select>
                      {sel && <p className="mt-1 text-xs text-[#9CA3AF]">Disalin dari master data: {sel.name}</p>}
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Kota</label>
                      <input
                        value={h.city ?? ""}
                        onChange={(e) => updateHotel(i, { city: e.target.value })}
                        placeholder="Mekkah / Madinah"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Nama Hotel <span className="text-red-500">*</span></label>
                      <input
                        value={h.name}
                        onChange={(e) => updateHotel(i, { name: e.target.value })}
                        placeholder="Nama hotel"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Bintang</label>
                      <select
                        value={h.stars}
                        onChange={(e) => updateHotel(i, { stars: Number(e.target.value) })}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                      >
                        {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s} Bintang</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Jarak (dari Masjid) <span className="text-red-500">*</span></label>
                      <input
                        value={h.distance}
                        onChange={(e) => updateHotel(i, { distance: e.target.value })}
                        placeholder="250m"
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Google Maps URL</label>
                      <input
                        value={h.mapsUrl}
                        onChange={(e) => updateHotel(i, { mapsUrl: e.target.value })}
                        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUpload
                        value={h.image}
                        onChange={(url) => updateHotel(i, { image: url })}
                        label="Foto Hotel"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            <button
              type="button"
              onClick={addHotel}
              className="flex items-center gap-2 text-sm text-[#C89B3C] hover:text-[#B88A2E] transition-colors"
            >
              <Plus className="size-4" /> Tambah Hotel
            </button>
          </div>
        )

      case "schedule":
        return (
          <div className="space-y-4">
            {schedules.map((s, i) => (
              <div key={i} className="rounded-2xl border border-[#E5E7EB] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-[#0B3C6D]">Jadwal {i + 1}</h4>
                  {schedules.length > 1 && (
                    <button type="button" onClick={() => setSchedules(schedules.filter((_, j) => j !== i))} className="text-red-500 hover:text-red-700 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Tanggal Berangkat</label>
                    <input type="date" value={s.departureDate} onChange={(e) => {
                      const updated = [...schedules]; updated[i] = { ...updated[i], departureDate: e.target.value }; setSchedules(updated)
                    }} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Tanggal Pulang</label>
                    <input type="date" value={s.returnDate ?? ""} onChange={(e) => {
                      const updated = [...schedules]; updated[i] = { ...updated[i], returnDate: e.target.value }; setSchedules(updated)
                    }} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Meeting Point</label>
                    <input value={s.meetingPoint} onChange={(e) => {
                      const updated = [...schedules]; updated[i] = { ...updated[i], meetingPoint: e.target.value }; setSchedules(updated)
                    }} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Seat (Kapasitas)</label>
                    <input type="number" value={s.seat} onChange={(e) => {
                      const updated = [...schedules]; updated[i] = { ...updated[i], seat: Number(e.target.value) }; setSchedules(updated)
                    }} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addSchedule} className="flex items-center gap-2 text-sm text-[#C89B3C] hover:text-[#B88A2E] transition-colors">
              <Plus className="size-4" /> Tambah Jadwal
            </button>
          </div>
        )

      case "facilities":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {defaultFacilities.map((fac) => (
                <button
                  key={fac}
                  type="button"
                  onClick={() => toggleFacility(fac)}
                  className={`rounded-xl border px-3 py-2 text-sm transition-all ${
                    facilities.includes(fac)
                      ? "border-[#C89B3C] bg-[#C89B3C]/10 text-[#C89B3C] font-medium"
                      : "border-[#E5E7EB] text-[#6B7280] hover:border-[#C89B3C]/30 hover:bg-[#F8FAFC]"
                  }`}
                >
                  {fac}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={customFacility}
                onChange={(e) => setCustomFacility(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomFacility())}
                placeholder="Tambah fasilitas custom..."
                className="flex-1 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all"
              />
              <button type="button" onClick={addCustomFacility} className="rounded-xl bg-[#C89B3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#B88A2E] transition-colors">
                <Plus className="size-4" />
              </button>
            </div>
            {facilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {facilities.map((fac) => (
                  <span key={fac} className="inline-flex items-center gap-1 rounded-lg bg-[#F8FAFC] px-3 py-1.5 text-xs font-medium text-[#0B3C6D] border border-[#E5E7EB]">
                    {fac}
                    <button type="button" onClick={() => setFacilities(facilities.filter((f) => f !== fac))} className="text-[#9CA3AF] hover:text-red-500">
                      <Trash2 className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )

      case "itinerary":
        return (
          <div className="space-y-4">
            <AnimatePresence>
              {itineraries.map((it, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="rounded-2xl border border-[#E5E7EB] p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex size-7 items-center justify-center rounded-lg bg-[#0B3C6D] text-xs font-bold text-white">H{i + 1}</span>
                      <h4 className="text-sm font-semibold text-[#0B3C6D]">Hari {i + 1}</h4>
                    </div>
                    {itineraries.length > 1 && (
                      <button type="button" onClick={() => removeItinerary(i)} className="text-red-500 hover:text-red-700 transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </div>
                  <div className="space-y-3">
                    <input
                      value={it.title}
                      onChange={(e) => {
                        const updated = [...itineraries]; updated[i] = { ...updated[i], title: e.target.value }; setItineraries(updated)
                      }}
                      placeholder="Judul hari ini..."
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all"
                    />
                    <TipTapEditor
                      value={it.description}
                      onChange={(val) => {
                        const updated = [...itineraries]; updated[i] = { ...updated[i], description: val }; setItineraries(updated)
                      }}
                      placeholder="Deskripsi kegiatan hari ini..."
                    />
                    <ImageUpload
                      value={it.image}
                      onChange={(url) => {
                        const updated = [...itineraries]; updated[i] = { ...updated[i], image: url }; setItineraries(updated)
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <button type="button" onClick={addItinerary} className="flex items-center gap-2 text-sm text-[#C89B3C] hover:text-[#B88A2E] transition-colors">
              <Plus className="size-4" /> Tambah Hari {itineraries.length + 1}
            </button>
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <AnimatePresence>
                {galleries.map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#E5E7EB] group"
                  >
                    <Image src={g.url} alt={g.alt} fill className="object-cover" sizes="200px" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <button type="button" onClick={() => {
                        const updated = galleries.filter((_, j) => j !== i)
                        setGalleries(updated)
                      }} className="flex size-8 items-center justify-center rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <label className="flex cursor-pointer flex-col items-center justify-center aspect-square rounded-xl border-2 border-dashed border-[#E5E7EB] bg-[#F8FAFC] hover:border-[#C89B3C] hover:bg-[#C89B3C]/5 transition-all">
                <Plus className="size-6 text-[#9CA3AF]" />
                <p className="mt-1 text-xs text-[#9CA3AF]">Tambah</p>
                <input type="file" accept="image/*" className="hidden" multiple onChange={(e) => {
                  const files = Array.from(e.target.files ?? [])
                  files.forEach((file) => {
                    const reader = new FileReader()
                    reader.onload = (ev) => {
                      setGalleries((prev) => [...prev, { url: ev.target?.result as string, alt: "", sortOrder: prev.length }])
                    }
                    reader.readAsDataURL(file)
                  })
                }} />
              </label>
            </div>
          </div>
        )

      case "seo":
        return (
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Meta Title</label>
              <input {...register("metaTitle")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Meta Description</label>
              <textarea {...register("metaDescription")} rows={3} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all resize-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Keywords (pisahkan dengan koma)</label>
              <input {...register("keywords")} placeholder="umroh, haji, safiq tour" className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all" />
            </div>
          </div>
        )

      case "publish":
        return (
          <div className="space-y-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Status</label>
              <select {...register("status")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all">
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="COMING_SOON">Coming Soon</option>
                <option value="SOLD_OUT">Sold Out</option>
                <option value="FINISHED">Finished</option>
              </select>
            </div>
            {initialData && (
              <div className="rounded-xl bg-[#F8FAFC] p-4 space-y-2">
                <p className="text-xs text-[#9CA3AF]">Dibuat: {new Date(initialData.createdAt).toLocaleString("id-ID")}</p>
                <p className="text-xs text-[#9CA3AF]">Diupdate: {new Date(initialData.updatedAt).toLocaleString("id-ID")}</p>
                {initialData.publishedAt && <p className="text-xs text-[#9CA3AF]">Dipublikasi: {new Date(initialData.publishedAt).toLocaleString("id-ID")}</p>}
              </div>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  const slug = watch("slug")
                  if (slug) window.open(`/packages/${slug}`, "_blank")
                }}
                className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
              >
                <Eye className="size-4" /> Preview
              </button>
              {initialData && (
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/packages/${watch("slug")}`)
                    toast.success("Link copied!")
                  }}
                  className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
                >
                  <Copy className="size-4" /> Copy Link
                </button>
              )}
            </div>
          </div>
        )
    }
  }

  return (
    <form
 onSubmit={handleSubmit(
   onSubmit,
   (errors)=>{
     console.log("FORM ERRORS", errors)
   }
 )}
>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">
            {initialData ? "Edit Paket" : "Tambah Paket"} {title && <span className="text-[#9CA3AF]">— {title}</span>}
          </h1>
          <p className="text-sm text-[#9CA3AF]">
            {initialData ? "Edit detail paket umroh" : "Buat paket umroh baru"}
          </p>
        </div>
        <div className="flex gap-2">
          {initialData && (
            <button
              type="button"
              onClick={() => {
                const slug = watch("slug")
                if (slug) window.open(`/packages/${slug}`, "_blank")
              }}
              className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#6B7280] hover:bg-[#F8FAFC] transition-colors"
            >
              <Eye className="size-4" /> Preview
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {isSubmitting ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#0B3C6D] text-white shadow-lg"
                  : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D]"
              }`}
            >
              <Icon className="size-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab(activeTab)}
          </motion.div>
        </AnimatePresence>
      </div>
    </form>
  )
}
