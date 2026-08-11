import type { Package } from "@/data/packages"
import type {
  PackageDetail,
  HotelInfo,
  AirlineInfo,
  HighlightItem,
  DayItinerary,
} from "@/data/packages-detail"

/**
 * Builds the public marketing payload (`{ card, detail }`) that is stored in the
 * package row's `publicContent` JSON column. The public UI (`@/modules/public/packages`)
 * reads only PUBLISHED packages that carry this payload, so every create/update of a
 * package must persist it here — generated from the CMS form fields below.
 *
 * The shape intentionally mirrors the legacy hardcoded `Package` (card) and
 * `PackageDetail` (detail) types so the public query contract stays unchanged.
 */

export interface PublicContentHotel {
  type?: string
  name?: string
  stars?: number
  distance?: string
  image?: string
  mapsUrl?: string
}

export interface PublicContentItinerary {
  day?: number
  title?: string
  description?: string
  image?: string
}

export interface PublicContentGallery {
  url?: string
}

export interface BuildPublicContentInput {
  id: string
  title: string
  slug: string
  category: string
  packageCategoryName?: string | null
  duration: number
  price: number
  quadPrice?: number | null
  triplePrice?: number | null
  doublePrice?: number | null
  description?: string
  excerpt?: string
  airline?: string
  featured?: boolean
  badge?: string | null
  thumbnail?: string
  heroImage?: string
  keywords?: string
  facilities?: { name?: string }[]
  hotels?: PublicContentHotel[]
  schedules?: { departureDate?: string | Date | null }[]
  itineraries?: PublicContentItinerary[]
  galleries?: PublicContentGallery[]
}

const FALLBACK_IMAGE = "/images/Hero-Nabawi-paket-Safiq-Tour-01.webp"
const FALLBACK_LOGO = "/images/Saudi-Airlines.png"

/** Name → public category mapping, matched against the master PackageCategory name. */
const PUBLIC_CATEGORY_BY_NAME: Record<string, Package["category"]> = {
  zamzam: "zamzam",
  thaibah: "thaibah",
  rawdah: "rawdah",
  firdaus: "firdaus",
  ramadhan: "ramadhan",
  arbain: "arbain",
  private: "private",
}

/**
 * Resolve the public card category. Priority:
 *  1. Master `packageCategoryName` (explicit mapping by name).
 *  2. Legacy regex over title/slug/category (kept for packages without a master category).
 *  3. Fallback: "zamzam".
 */
function mapCategory(
  title: string,
  slug: string,
  category: string,
  packageCategoryName?: string | null
): Package["category"] {
  // Normalize so variants like "Zam Zam", "Zamzam", "zam zam", "zamzam" all map
  // to the same key (strip spaces and non-alphanumerics).
  const master = (packageCategoryName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
  if (master && master in PUBLIC_CATEGORY_BY_NAME) {
    return PUBLIC_CATEGORY_BY_NAME[master]
  }

  const hay = `${title} ${slug} ${category}`.toLowerCase()
  if (/ramadh/.test(hay)) return "ramadhan"
  if (/rawdah|raudhah/.test(hay)) return "rawdah"
  if (/thaibah|thoybah|toybah/.test(hay)) return "thaibah"
  if (/firdaus|firdous/.test(hay)) return "firdaus"
  if (/arba'?in|arbain/.test(hay)) return "arbain"
  if (/private/.test(hay)) return "private"
  return "zamzam"
}

const BADGE_LABEL: Record<string, string> = {
  BEST_SELLER: "Best Seller",
  NEW: "Baru",
  PROMO: "Promo",
}

const DEFAULT_HIGHLIGHTS: HighlightItem[] = [
  { title: "Tiket PP", desc: "Penerbangan pulang pergi" },
  { title: "Visa Umroh", desc: "Pengurusan visa lengkap" },
  { title: "Hotel Pilihan", desc: "Lokasi strategis dekat Masjidil Haram" },
  { title: "Pembimbing", desc: "Ibadah sesuai sunnah" },
  { title: "Transportasi", desc: "Bus full AC" },
  { title: "Asuransi", desc: "Perjalanan internasional" },
]

const COMMON_EXCLUDED = [
  "Biaya Vaksin Meningitis",
  "Pembuatan Paspor",
  "Biaya Pengiriman Perlengkapan",
  "Biaya Pribadi Selama Umroh",
  "Biaya Bagasi Ekstra",
]

function makeItinerary(days: number): DayItinerary[] {
  const n = Math.max(1, Math.round(days) || 1)
  const out: DayItinerary[] = []
  for (let day = 1; day <= n; day++) {
    const isLast = day === n
    out.push({
      day,
      title: isLast ? "Indonesia" : `${day % 2 === 0 ? "Madinah" : "Mekkah"} — Ibadah & Ziarah`,
      desc: isLast
        ? "Penerbangan kembali ke Tanah Air."
        : "Ibadah Umroh dan ziarah di Tanah Suci dengan pembimbing berpengalaman.",
    })
  }
  return out
}

function toHotels(hotels: PublicContentHotel[] | undefined): HotelInfo[] {
  const seeded = (hotels ?? []).filter((h) => (h.name ?? "").trim())
  return seeded.map((h) => ({
    city: h.type === "MEKKAH" ? "Mekkah" : h.type === "MADINAH" ? "Madinah" : "Arab Saudi",
    name: h.name as string,
    stars: h.stars ?? 0,
    distance: h.distance ?? "",
    desc: "",
    // HotelCarousel requires at least one image, so always provide a fallback.
    images: h.image ? [h.image] : [FALLBACK_IMAGE],
    mapsUrl: h.mapsUrl ?? "",
  }))
}

export function buildPublicContent(input: BuildPublicContentInput): {
  card: Package
  detail: PackageDetail
} {
  const hotels = input.hotels ?? []
  const mekkahHotel = hotels.find((h) => h.type === "MEKKAH")
  const madinahHotel = hotels.find((h) => h.type === "MADINAH")

  const facilities = (input.facilities ?? [])
    .map((f) => (f.name ?? "").trim())
    .filter(Boolean)

  const heroImage = input.heroImage || input.thumbnail || input.galleries?.[0]?.url || FALLBACK_IMAGE

  const airline = (input.airline ?? "").trim()
  const hotelsInfo = toHotels(hotels)

  const card: Package = {
    id: input.id,
    slug: input.slug,
    title: input.title,
    category: mapCategory(input.title, input.slug, input.category, input.packageCategoryName),
    duration: input.duration > 0 ? `${input.duration} Hari` : "Flexibel",
    price: input.price,
    // Only carry positive room prices; null/0/undefined stay hidden publicly.
    quadPrice: input.quadPrice && input.quadPrice > 0 ? input.quadPrice : null,
    triplePrice: input.triplePrice && input.triplePrice > 0 ? input.triplePrice : null,
    doublePrice: input.doublePrice && input.doublePrice > 0 ? input.doublePrice : null,
    badge: (input.badge && BADGE_LABEL[input.badge]) || "",
    featured: Boolean(input.featured),
    image: input.thumbnail || input.heroImage || undefined,
    features: facilities,
    hotelMekah: mekkahHotel?.name ?? "Hotel Mekkah",
    hotelMadinah: madinahHotel?.name ?? "Hotel Madinah",
    maskapai: airline || "Maskapai Mitra",
  }

  const detail: PackageDetail = {
    heroImage,
    description: input.description || input.excerpt || "",
    highlights:
      facilities.length > 0
        ? facilities.map((name) => ({ title: name, desc: "" }) as HighlightItem)
        : DEFAULT_HIGHLIGHTS,
    itinerary:
      (input.itineraries ?? []).length > 0
        ? (input.itineraries ?? []).map((it) => ({
            day: it.day ?? 0,
            title: it.title ?? `Hari ${it.day ?? 0}`,
            desc: it.description ?? "",
            image: it.image ?? "",
          }))
        : makeItinerary(input.duration),
    hotels: hotelsInfo,
    airlines: airline
      ? [
          {
            name: airline,
            logo: FALLBACK_LOGO,
            baggage: "",
            transit: "",
            estimasi: "",
            pesawat: "",
          } as AirlineInfo,
        ]
      : [],
    included: facilities,
    excluded: COMMON_EXCLUDED,
  }

  return { card, detail }
}
