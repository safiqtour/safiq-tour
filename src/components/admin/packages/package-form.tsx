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
  Plane,
  Trash2,
  ArrowDown,
  ArrowUp,
  Clock,
} from "lucide-react"
import { packageFormSchema, type PackageFormValues } from "@/lib/packages/schema"
import { slugify } from "@/lib/packages/utils"
import { TipTapEditor } from "./tiptap-editor"
import { ImageUpload } from "./image-upload"
import type { PackageData, PackageCategory, PackageBadge, PackageFlightData, PackageFlightSegmentData } from "@/lib/packages/types"
import { getHotels } from "@/actions/hotel"
import type { HotelListItem } from "@/types/hospitality"
import { getAirlines } from "@/actions/airline"
import type { AirlineListItem } from "@/types/hospitality"
import { getPackageCategories } from "@/modules/business/package-category/actions/package-category"
import { getPackageTypes } from "@/modules/business/package-type/actions/package-type"
import type { PackageCategoryListItem } from "@/modules/business/package-category/types"
import type { PackageTypeListItem } from "@/modules/business/package-type/types"

const tabs = [
  { id: "general", label: "General", icon: Info },
  { id: "pricing", label: "Harga", icon: DollarSign },
  { id: "hotel", label: "Hotel", icon: Building2 },
  { id: "schedule", label: "Jadwal", icon: Calendar },
  { id: "penerbangan", label: "Penerbangan", icon: Plane },
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

const BADGE_OPTIONS: PackageBadge[] = ["BEST_SELLER", "NEW", "PROMO"]

// The badge select expects an enum value or null ("No Badge"). Normalize legacy
// DB values (display labels like "Best Seller", empty strings, or other
// out-of-enum values) so old packages load and save cleanly.
function normalizeLegacyBadge(value: string | null | undefined): PackageBadge | null {
  const v = (value ?? "").trim().toUpperCase().replace(/[\s-]+/g, "_")
  return (BADGE_OPTIONS as string[]).includes(v) ? (v as PackageBadge) : null
}

/**
 * redirect() inside a Server Action throws a special error whose digest starts
 * with NEXT_REDIRECT — that is how Next.js triggers client navigation, so it
 * must not be treated as a save failure.
 */
function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest?: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  )
}

/**
 * Flight itinerary item for the "Penerbangan" tab.
 * Persisted as one PackageFlight row (direction derived from the label) with
 * one or more PackageFlightSegments (one per hop).
 */
interface FlightSegmentItem extends PackageFlightSegmentData {
  id: string
}

interface FlightItem extends PackageFlightData {
  id: string
  segments: FlightSegmentItem[]
}

interface FlightCardProps {
  flight: FlightItem
  airlines: AirlineListItem[]
  onChange: (patch: Partial<FlightItem>) => void
  onRemove: () => void
  canRemove: boolean
  onMoveUp?: () => void
  onMoveDown?: () => void
  canMoveUp?: boolean
  canMoveDown?: boolean
}

/** Combine a city and its IATA code into the display form "<city> (<IATA>)". */
function formatRoute(city: string, iata: string): string {
  const c = city.trim()
  const i = iata.trim()
  if (!c && !i) return ""
  if (!c) return `(${i})`
  if (!i) return c
  return `${c} (${i})`
}

/** Parse a combined "<city> (<IATA>)" string back into its parts. */
function parseRoute(value: string): { city: string; iata: string } {
  const match = value.match(/^(.*?)\s*\(([^()]*)\)\s*$/)
  if (match) {
    return {
      city: match[1].trim(),
      iata: match[2].trim().toUpperCase(),
    }
  }
  return { city: value.trim(), iata: "" }
}

/**
 * Compute a human-readable duration between two datetime-local strings
 * ("yyyy-MM-ddTHH:mm"). Supports crossing midnight / different dates.
 * Returns "" when either value is missing or end is not after start.
 */
function calculateDuration(start: string, end: string): string {
  if (!start || !end) return ""
  const s = new Date(start)
  const e = new Date(end)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return ""
  const totalMinutes = Math.round((e.getTime() - s.getTime()) / 60000)
  if (totalMinutes <= 0) return ""
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  if (h === 0) return `${m} menit`
  if (m === 0) return `${h} jam`
  return `${h} jam ${m} menit`
}

/** Single flight-leg card for the "Penerbangan" tab. Each hop is a segment. */
function FlightCard({ flight, airlines, onChange, onRemove, canRemove, onMoveUp, onMoveDown, canMoveUp, canMoveDown }: FlightCardProps) {
  const segments = flight.segments ?? []

  // Full route shown in the preview, built from every segment boundary with
  // consecutive duplicates (segment N arrival == segment N+1 departure) collapsed
  // so the route reads as a clean A → B → C chain.
  const routePoints: { city: string; iata: string }[] = []
  segments.forEach((s) => {
    const dep = { city: s.departureCity, iata: s.departureAirport }
    const arr = { city: s.arrivalCity, iata: s.arrivalAirport }
    const last = routePoints[routePoints.length - 1]
    if (!last || last.city !== dep.city || last.iata !== dep.iata) routePoints.push(dep)
    routePoints.push(arr)
  })

  const updateSegment = (id: string, patch: Partial<Omit<FlightSegmentItem, "id">>) => {
    onChange({ segments: segments.map((s) => (s.id === id ? { ...s, ...patch } : s)) })
  }

  const addSegment = () => {
    onChange({
      segments: [
        ...segments,
        {
          id: crypto.randomUUID(),
          airlineId: null,
          flightNumber: "",
          aircraft: "",
          departureCity: "",
          departureAirport: "",
          arrivalCity: "",
          arrivalAirport: "",
          departureDateTime: "",
          arrivalDateTime: "",
        },
      ],
    })
  }

  const removeSegment = (id: string) => {
    if (segments.length <= 1) return
    onChange({ segments: segments.filter((s) => s.id !== id) })
  }

  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-6">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-heading text-sm font-bold text-[#0B3C6D]">
          Penerbangan {flight.label}
        </h4>
        <div className="flex items-center gap-2">
          {canMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              title="Pindah ke atas"
              className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#0B3C6D] transition-colors"
            >
              <ArrowUp className="size-4" />
            </button>
          )}
          {canMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              title="Pindah ke bawah"
              className="flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#0B3C6D] transition-colors"
            >
              <ArrowDown className="size-4" />
            </button>
          )}
          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="size-4" /> Hapus Penerbangan
            </button>
          )}
        </div>
      </div>

      {/* Route preview (horizontal) */}
      <div className="mb-4 rounded-xl bg-[#F8FAFC] p-3">
        <p className="mb-2 text-xs font-medium text-[#9CA3AF]">Rute</p>
        <div className="flex flex-wrap items-center gap-1.5 text-sm">
          {routePoints.map((p, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <span className="font-medium text-[#0B3C6D]">
                {formatRoute(p.city, p.iata) || "—"}
              </span>
              {idx < routePoints.length - 1 && (
                <ArrowDown className="size-3.5 rotate-[-90deg] text-[#C89B3C]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Label selector */}
      <div className="mb-4">
        <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Label Penerbangan</label>
        <select
          value={flight.label}
          onChange={(e) => onChange({ label: e.target.value })}
          className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
        >
          <option value="Keberangkatan">Keberangkatan</option>
          <option value="Transit">Transit</option>
          <option value="Menuju Kota Tambahan">Menuju Kota Tambahan</option>
          <option value="Kembali ke Saudi">Kembali ke Saudi</option>
          <option value="Kepulangan">Kepulangan</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div className="space-y-3">
        {segments.map((seg, idx) => {
          // Auto transit duration between this segment's arrival and the next
          // segment's departure (prev arrival → next departure).
          const next = segments[idx + 1]
          const transitDuration = next
            ? calculateDuration(seg.arrivalDateTime ?? "", next.departureDateTime ?? "")
            : ""
          // Transit location = this segment's arrival point, shown as "City (IATA)".
          const transitLocation = next ? formatRoute(seg.arrivalCity, seg.arrivalAirport) : ""
          return (
            <div key={seg.id}>
              <div className="rounded-xl border border-[#E5E7EB] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-[#0B3C6D]">
                    <Plane className="size-3.5 text-[#C89B3C]" /> Penerbangan {idx + 1}
                  </p>
              {segments.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Hapus penerbangan ini?")) removeSegment(seg.id)
                  }}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Hapus
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Maskapai</label>
                <select
                  value={seg.airlineId ?? ""}
                  onChange={(e) => updateSegment(seg.id, { airlineId: e.target.value === "" ? null : e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                >
                  <option value="">— Pilih maskapai —</option>
                  {airlines.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} {a.iataCode ? `(${a.iataCode})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Nomor Penerbangan</label>
                <input
                  type="text"
                  placeholder="Mis. QR-955"
                  value={seg.flightNumber ?? ""}
                  onChange={(e) => updateSegment(seg.id, { flightNumber: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all"
                />
              </div>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Keberangkatan</label>
                <input
                  type="text"
                  placeholder="Mis. Jakarta (CGK)"
                  value={formatRoute(seg.departureCity, seg.departureAirport)}
                  onChange={(e) => {
                    const { city, iata } = parseRoute(e.target.value)
                    updateSegment(seg.id, { departureCity: city, departureAirport: iata })
                  }}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Kedatangan</label>
                <input
                  type="text"
                  placeholder="Mis. Madinah (MED)"
                  value={formatRoute(seg.arrivalCity, seg.arrivalAirport)}
                  onChange={(e) => {
                    const { city, iata } = parseRoute(e.target.value)
                    updateSegment(seg.id, { arrivalCity: city, arrivalAirport: iata })
                  }}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none focus:border-[#C89B3C] transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Waktu Keberangkatan</label>
                <input
                  type="datetime-local"
                  value={seg.departureDateTime ?? ""}
                  onChange={(e) => updateSegment(seg.id, { departureDateTime: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Waktu Kedatangan</label>
                <input
                  type="datetime-local"
                  value={seg.arrivalDateTime ?? ""}
                  onChange={(e) => updateSegment(seg.id, { arrivalDateTime: e.target.value })}
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                />
              </div>
            </div>
          </div>

              {transitDuration && next && (
                <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3">
                  <Clock className="size-4 text-[#C89B3C]" />
                  <span className="text-xs font-medium text-[#6B7280]">
                    Transit{transitLocation ? ` ${transitLocation}` : ""}
                  </span>
                  <span className="text-sm font-semibold text-[#0B3C6D]">
                    Durasi Transit: {transitDuration}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <button
        type="button"
        onClick={addSegment}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#C89B3C] px-4 py-2 text-sm font-medium text-[#C89B3C] hover:bg-[#C89B3C]/10 transition-colors"
      >
        <Plus className="size-4" /> Tambah Penerbangan
      </button>
    </div>
  )
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
  const [masterAirlines, setMasterAirlines] = useState<AirlineListItem[]>([])

  useEffect(() => {
    getAirlines({ page: 1, limit: 100, status: "ACTIVE" })
      .then((res) => setMasterAirlines((res.data ?? []) as unknown as AirlineListItem[]))
      .catch(() => setMasterAirlines([]))
  }, [])

  // Flight itinerary state. Legacy packages without flight rows fall back to
  // sensible Umroh defaults (Jakarta → Madinah outbound, Jeddah → Jakarta return).
  const [flights, setFlights] = useState<FlightItem[]>(
    initialData?.flights?.length
      ? initialData.flights.map((f) => ({
          ...f,
          id: f.id ?? crypto.randomUUID(),
          segments: (f.segments ?? []).map((s) => ({ ...s, id: s.id ?? crypto.randomUUID() })),
        }))
      : [
      {
        id: crypto.randomUUID(),
        label: "Keberangkatan",
        segments: [{
          id: crypto.randomUUID(),
          airlineId: null,
          flightNumber: "",
          aircraft: "",
          departureCity: "Jakarta",
          departureAirport: "CGK",
          arrivalCity: "Madinah",
          arrivalAirport: "MED",
          departureDateTime: "",
          arrivalDateTime: "",
        }],
      },
      {
        id: crypto.randomUUID(),
        label: "Kepulangan",
        segments: [{
          id: crypto.randomUUID(),
          airlineId: null,
          flightNumber: "",
          aircraft: "",
          departureCity: "Jeddah",
          departureAirport: "JED",
          arrivalCity: "Jakarta",
          arrivalAirport: "CGK",
          departureDateTime: "",
          arrivalDateTime: "",
        }],
      },
        ]
  )

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
          // Normalize out-of-enum/legacy DB badge values to null ("No Badge") so
          // the select binds correctly and the resolver accepts old packages.
          badge: normalizeLegacyBadge(initialData.badge),
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
          quadPrice: null,
          triplePrice: null,
          doublePrice: null,
          discount: 0,
          currency: "IDR",
          airline: "",
          airlineId: null,
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
          flights: [],
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
        if (key === "hotels" || key === "schedules" || key === "facilities" || key === "itineraries" || key === "galleries" || key === "flights") {
          if (key === "facilities") {
            fd.append(key, JSON.stringify(facilities.map((f) => ({ name: f, icon: "" }))))
          } else if (key === "itineraries") {
            // Only submit rows with a title; skip empty placeholder rows so Zod
            // doesn't reject the payload (title is required in the schema).
            fd.append(key, JSON.stringify(itineraries.filter((it) => (it.title ?? "").trim())))
          } else if (key === "galleries") {
            fd.append(key, JSON.stringify(galleries))
          } else if (key === "flights") {
            // Flight legs live in local state (not RHF-registered inputs); always
            // submit the current local list. `id` (flight + segment) is client-only
            // and stripped here; `aircraft` is UI-only and not persisted.
            fd.append(key, JSON.stringify(flights.map((f) => ({
              label: f.label,
              segments: (f.segments ?? []).map((s) => ({
                airlineId: s.airlineId ?? null,
                flightNumber: s.flightNumber ?? "",
                departureCity: s.departureCity ?? "",
                departureAirport: s.departureAirport ?? "",
                arrivalCity: s.arrivalCity ?? "",
                arrivalAirport: s.arrivalAirport ?? "",
                departureDateTime: s.departureDateTime || null,
                arrivalDateTime: s.arrivalDateTime || null,
              })),
            }))))
          } else if (key === "hotels") {
            // Only submit rows with a master-data hotel selected (name is auto-filled
            // on selection); skip empty placeholder rows so Zod doesn't reject the
            // payload. Distance is optional per packageHotelSchema.
            fd.append(key, JSON.stringify(hotels
              .filter((h) => (h.name ?? "").trim())
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
    } catch (err) {
      // A successful save ends with redirect() in the server action, which throws
      // NEXT_REDIRECT — navigation is already in progress, so this is success.
      if (isNextRedirect(err)) return
      // Surface the real server error (validation field paths / DB errors)
      // instead of silently swallowing it behind a generic toast.
      console.error("PACKAGE SAVE FAILED", err)
      toast.error(err instanceof Error && err.message ? err.message : "Gagal menyimpan paket")
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
      // All hotel details come from Hotel Master Data (no manual inputs).
      distance:
        (type === "MADINAH" ? hotel.distanceToNabawi : hotel.distanceToHaram) ||
        hotel.distanceToHaram ||
        hotel.distanceToNabawi ||
        "",
      mapsUrl: hotel.mapsUrl || "",
      image: hotel.featuredMedia?.url || "",
    })
  }

  const addFlight = () => {
    setFlights([...flights, {
      id: crypto.randomUUID(),
      label: "Keberangkatan",
      segments: [{
        id: crypto.randomUUID(),
        airlineId: null,
        flightNumber: "",
        aircraft: "",
        departureCity: "",
        departureAirport: "",
        arrivalCity: "",
        arrivalAirport: "",
        departureDateTime: "",
        arrivalDateTime: "",
      }],
    }])
  }

  const removeFlight = (id: string) => {
    setFlights(flights.filter((f) => f.id !== id))
  }

  const updateFlight = (id: string, patch: Partial<FlightItem>) => {
    setFlights(flights.map((f) => (f.id === id ? { ...f, ...patch } : f)))
  }

  const moveFlight = (id: string, direction: -1 | 1) => {
    const idx = flights.findIndex((f) => f.id === id)
    if (idx < 0) return
    const target = idx + direction
    if (target < 0 || target >= flights.length) return
    const next = [...flights]
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setFlights(next)
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
                <Controller
                  name="airlineId"
                  control={control}
                  render={({ field }) => (
                    <select
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const id = e.target.value || null
                        field.onChange(id)
                        // Keep the legacy free-text `airline` column in sync as a
                        // display-name snapshot of the selected master airline.
                        const m = masterAirlines.find((a) => a.id === id)
                        if (m) setValue("airline", m.name)
                      }}
                      className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all"
                    >
                      <option value="">— Pilih maskapai dari master data —</option>
                      {masterAirlines.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} {a.iataCode ? `(${a.iataCode})` : ""}
                        </option>
                      ))}
                    </select>
                  )}
                />
                {errors.airline && <p className="mt-1 text-xs text-red-500">{errors.airline.message}</p>}
                {/* Legacy free-text value is preserved until a master airline is chosen */}
                {!watch("airlineId") && watch("airline") && (
                  <p className="mt-1 text-xs text-[#9CA3AF]">Nilai lama: {watch("airline")}</p>
                )}
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
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Harga Quad (4 orang) <span className="text-xs font-normal text-[#9CA3AF]">— opsional</span></label>
                <input type="number" min="0" placeholder="Kosongkan jika tidak tersedia" {...register("quadPrice")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Harga Triple (3 orang) <span className="text-xs font-normal text-[#9CA3AF]">— opsional</span></label>
                <input type="number" min="0" placeholder="Kosongkan jika tidak tersedia" {...register("triplePrice")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#6B7280]">Harga Double (2 orang) <span className="text-xs font-normal text-[#9CA3AF]">— opsional</span></label>
                <input type="number" min="0" placeholder="Kosongkan jika tidak tersedia" {...register("doublePrice")} className="w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] transition-all" />
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
              {Number(watch("promoPrice")) > 0 && (
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
                    <div className="sm:col-span-2">
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
                    </div>
                    {sel && (
                      <div className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 sm:col-span-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-[#0B3C6D]">{sel.name}</p>
                          <span className="rounded-full bg-[#0B3C6D]/5 px-2.5 py-0.5 text-[10px] font-semibold tracking-wider text-[#0B3C6D] uppercase">
                            {h.type === "MADINAH" ? "Madinah" : "Makkah"}
                          </span>
                          <span className="rounded-full bg-[#C89B3C]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#C89B3C]">
                            {sel.starRating}★
                          </span>
                          {sel.city?.name && (
                            <span className="text-xs text-[#6B7280]">{sel.city.name}</span>
                          )}
                          {h.distance && (
                            <span className="text-xs text-[#6B7280]">• Jarak: {h.distance}</span>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-[#9CA3AF]">
                          Detail hotel (nama, bintang, kota, jarak, foto) otomatis mengikuti Master Data Hotel.
                        </p>
                      </div>
                    )}
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

      case "penerbangan":
        return (
          <div className="space-y-4">
            <p className="text-sm text-[#6B7280]">
              Susun rute penerbangan jamaah — keberangkatan, transit (bila ada), hingga kepulangan.
            </p>
            {flights.map((f, index) => (
              <FlightCard
                key={f.id}
                flight={f}
                airlines={masterAirlines}
                onChange={(patch) => updateFlight(f.id, patch)}
                onRemove={() => removeFlight(f.id)}
                canRemove={flights.length > 1}
                onMoveUp={() => moveFlight(f.id, -1)}
                onMoveDown={() => moveFlight(f.id, 1)}
                canMoveUp={index > 0}
                canMoveDown={index < flights.length - 1}
              />
            ))}
            <button type="button" onClick={addFlight} className="flex items-center gap-2 text-sm text-[#C89B3C] hover:text-[#B88A2E] transition-colors">
              <Plus className="size-4" /> Tambah Penerbangan
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
                      allowLists={false}
                    />
                    <ImageUpload
                      value={it.image}
                      compact
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
        (errors) => {
          // Log the complete validation error paths before submit so legacy-data
          // issues are visible, and tell the admin which fields failed.
          console.error("FORM ERRORS", JSON.stringify(errors, null, 2))
          toast.error(`Periksa kembali isian form: ${Object.keys(errors).join(", ")}`)
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
