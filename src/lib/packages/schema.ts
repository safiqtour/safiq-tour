import { z } from "zod"

export const packageHotelSchema = z.object({
  type: z.enum(["MEKKAH", "MADINAH"]),
  hotelId: z.string().optional().nullable(),
  name: z.string().min(1, "Nama hotel wajib diisi"),
  stars: z.coerce.number().min(0).max(5),
  // Distance is no longer user-editable; it is auto-filled from Hotel Master Data
  // and may be empty for some hotels, so it is optional (backward compatible).
  distance: z.string().optional().default(""),
  mapsUrl: z.string().optional().default(""),
  image: z.string().optional().default(""),
})

export const packageScheduleSchema = z.object({
  departureDate: z.string().min(1, "Tanggal keberangkatan wajib diisi"),
  returnDate: z.string().optional().nullable(),
  meetingPoint: z.string().optional().default(""),
  seat: z.coerce.number().min(0),
  seatFilled: z.coerce.number().min(0).optional().default(0),
})

export const packageFacilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi"),
  icon: z.string().optional().default(""),
})

/**
 * Normalize itinerary description HTML on save: list items become paragraphs,
 * empty markup is dropped, and <ol>/<ul>/<li> wrappers are removed. Paragraph
 * breaks (<p>) are preserved.
 */
function cleanItineraryHtml(html: string): string {
  return html
    .replace(/<\s*li\b[^>]*>/gi, "<p>")
    .replace(/<\s*\/\s*li\s*>/gi, "</p>")
    .replace(/<\s*\/?\s*(?:ul|ol)\b[^>]*>/gi, "")
    .replace(/<p>\s*(?:<br\s*\/?\s*>\s*)*<\/p>/gi, "")
    .trim()
}

export const packageItinerarySchema = z.object({
  day: z.coerce.number().min(1),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional().default("").transform(cleanItineraryHtml),
  image: z.string().optional().default(""),
})

export const packageGallerySchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
})

// Flight legs are supplementary itinerary info — everything is optional except
// the leg label (which always comes from a select in the UI). Each leg carries
// one or more segments (a direct leg has one; a transit leg has several).
// `aircraft` is accepted here for future-proofing but is never persisted (no DB
// column) — the server stores only the PackageFlightSegment fields.
export const packageFlightSegmentSchema = z.object({
  airlineId: z.preprocess((v) => (v === "" ? null : v), z.string().uuid().optional().nullable()),
  flightNumber: z.string().optional().default(""),
  aircraft: z.string().optional().default(""),
  departureCity: z.string().optional().default(""),
  departureAirport: z.string().optional().default(""),
  arrivalCity: z.string().optional().default(""),
  arrivalAirport: z.string().optional().default(""),
  departureDateTime: z.string().optional().nullable(),
  arrivalDateTime: z.string().optional().nullable(),
})

export const packageFlightSchema = z.object({
  label: z.string().optional().default("Keberangkatan"),
  segments: z.array(packageFlightSegmentSchema).optional().default([]),
})

/**
 * Optional room price: "" / null / undefined → null (never stored as 0);
 * non-numeric values (NaN) and negatives are rejected by z.number().min(0).
 */
const optionalRoomPrice = z.preprocess(
  (v) => {
    if (v === "" || v === null || v === undefined) return null
    const n = typeof v === "number" ? v : Number(String(v).trim())
    // Non-numeric strings fall through unchanged so z.number() rejects them.
    return Number.isFinite(n) ? n : v
  },
  z.number().min(0).nullable().optional()
)

export const packageFormSchema = z.object({
  title: z.string().min(1, "Nama paket wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  excerpt: z.string().min(1, "Deskripsi singkat wajib diisi"),
  description: z.string().optional().default(""),
  // Legacy DB rows may store lowercase category slugs ("ramadhan", "zamzam",
  // ...) — normalize out-of-enum/empty values to REGULAR so old records save.
  category: z.preprocess(
    (v) => {
      const s = (v ?? "").toString().trim().toUpperCase()
      return ["REGULAR", "PLUS", "EXECUTIVE", "LUXURY", "PRIVATE"].includes(s) ? s : "REGULAR"
    },
    z.enum(["REGULAR", "PLUS", "EXECUTIVE", "LUXURY", "PRIVATE"])
  ),
  // Optional nullable relation ids: "" from form selects normalizes to null so
  // the FK column is never written as an empty string.
  packageCategoryId: z.preprocess((v) => (v === "" ? null : v), z.string().uuid().optional().nullable()),
  packageTypeId: z.preprocess((v) => (v === "" ? null : v), z.string().uuid().optional().nullable()),
  // Legacy rows may have empty country/city (DB column default is ""); keep old
  // records editable by allowing empty strings.
  country: z.string().optional().default(""),
  city: z.string().optional().default(""),
  duration: z.coerce.number().min(1, "Durasi wajib diisi"),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  promoPrice: z.coerce.number().optional().nullable(),
  discount: z.coerce.number().optional().default(0),
  // Optional room-based pricing (per orang): empty input → null, never 0.
  quadPrice: optionalRoomPrice,
  triplePrice: optionalRoomPrice,
  doublePrice: optionalRoomPrice,
  currency: z.string().optional().default("IDR"),
  airline: z.string().min(1, "Maskapai wajib diisi"),
  airlineId: z.preprocess((v) => (v === "" ? null : v), z.string().uuid().optional().nullable()),
  quota: z.coerce.number().min(0),
  seatFilled: z.coerce.number().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "COMING_SOON", "SOLD_OUT", "FINISHED"]),
  featured: z.boolean().optional().default(false),
  // Badge is optional. Legacy DB rows may store display labels ("Best Seller"),
  // empty strings, or other out-of-enum values — normalize empty/unmappable
  // values to null ("No Badge") so legacy packages remain editable/savable.
  badge: z.preprocess(
    (v) => {
      const s = (v ?? "").toString().trim().toUpperCase().replace(/[\s-]+/g, "_")
      return ["BEST_SELLER", "NEW", "PROMO"].includes(s) ? s : null
    },
    z.enum(["BEST_SELLER", "NEW", "PROMO"]).optional().nullable()
  ),
  thumbnail: z.string().optional().default(""),
  heroImage: z.string().optional().default(""),
  metaTitle: z.string().optional().default(""),
  metaDescription: z.string().optional().default(""),
  keywords: z.string().optional().default(""),
  hotels: z.array(packageHotelSchema).optional().default([]),
  schedules: z.array(packageScheduleSchema).optional().default([]),
  facilities: z.array(packageFacilitySchema).optional().default([]),
  itineraries: z.array(packageItinerarySchema).optional().default([]),
  galleries: z.array(packageGallerySchema).optional().default([]),
  flights: z.array(packageFlightSchema).optional().default([]),
})

export type PackageFormValues = z.infer<typeof packageFormSchema>
