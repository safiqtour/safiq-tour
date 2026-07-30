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
  discount: number
  currency: string
  airline: string
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
  hotels: PackageHotelData[]
  schedules: PackageScheduleData[]
  facilities: PackageFacilityData[]
  itineraries: PackageItineraryData[]
  galleries: PackageGalleryData[]
}

export interface PackageHotelData {
  id?: string
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
