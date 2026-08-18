export type PackageCategory = "REGULAR" | "PLUS" | "EXECUTIVE" | "LUXURY" | "PRIVATE"

export type PackageStatus = "DRAFT" | "PUBLISHED" | "COMING_SOON" | "SOLD_OUT" | "FINISHED"

export type PackageBadge = "BEST_SELLER" | "NEW" | "PROMO"

export interface PackageData {
  id: string
  title: string
  slug: string
  excerpt: string
  description: string
  category: PackageCategory
  country: string
  city: string
  duration: number
  price: number
  promoPrice: number | null
  // Optional room-based pricing (null/undefined = not offered).
  quadPrice?: number | null
  triplePrice?: number | null
  doublePrice?: number | null
  discount: number
  currency: string
  airline: string
  airlineId?: string | null
  quota: number
  seatFilled: number
  status: PackageStatus
  featured: boolean
  badge: PackageBadge | null
  thumbnail: string
  heroImage: string
  metaTitle: string
  metaDescription: string
  keywords: string
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  packageCategoryId?: string | null
  packageTypeId?: string | null
  hotels: PackageHotelData[]
  schedules: PackageScheduleData[]
  facilities: PackageFacilityData[]
  itineraries: PackageItineraryData[]
  galleries: PackageGalleryData[]
  flights?: PackageFlightData[]
}

export interface PackageHotelData {
  id?: string
  hotelId?: string | null
  type: "MEKKAH" | "MADINAH"
  name: string
  stars: number
  distance: string
  mapsUrl: string
  image: string
}

export interface PackageScheduleData {
  id?: string
  departureDate: string
  returnDate: string | null
  meetingPoint: string
  seat: number
  seatFilled: number
}

export interface PackageFacilityData {
  id?: string
  // Optional link to the Facility master data (null for legacy/custom facilities).
  facilityId?: string | null
  name: string
  icon: string
}

export interface PackageItineraryData {
  id?: string
  day: number
  title: string
  description: string
  image: string
}

export interface PackageGalleryData {
  id?: string
  url: string
  alt: string
  sortOrder: number
}

/**
 * One flight segment (hop) of a package flight leg. Mirrors a single
 * PackageFlightSegment row. `aircraft` is UI-only — there is no corresponding
 * DB column, so it is never persisted (kept in local form state only).
 */
export interface PackageFlightSegmentData {
  id?: string
  airlineId?: string | null
  flightNumber?: string
  aircraft?: string
  departureCity: string
  departureAirport: string
  arrivalCity: string
  arrivalAirport: string
  departureDateTime?: string
  arrivalDateTime?: string
}

/**
 * One flight leg of a package ("Penerbangan" tab). Persisted as one
 * PackageFlight row (direction derived from `label`) with one or more
 * PackageFlightSegments. A direct leg has a single segment; a transit leg is
 * split into multiple segments (departure → transit… → arrival). Segment
 * datetimes are wall-clock strings ("yyyy-MM-ddTHH:mm") — see wallClockToDate.
 */
export interface PackageFlightData {
  id?: string
  label: string
  segments: PackageFlightSegmentData[]
}
