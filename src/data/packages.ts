export interface Package {
  id: string
  slug: string
  title: string
  category: "zamzam" | "thaibah" | "rawdah" | "firdaus" | "ramadhan" | "arbain" | "private"
  duration: string
  price: number
  priceLabel?: string
  // Optional room-based pricing (null/undefined/0 = not offered, hidden in UI).
  quadPrice?: number | null
  triplePrice?: number | null
  doublePrice?: number | null
  badge: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  featured?: boolean
  image?: string
  features: string[]
  hotelMekah: string
  hotelMadinah: string
  maskapai: string
  /** Optional first departure date (ISO "YYYY-MM-DD" or "YYYY-MM"). Card-only, display-only. */
  departureDate?: string | null
}

export const categories = [
  { value: "all", label: "Semua" },
  { value: "zamzam", label: "Zamzam" },
  { value: "thaibah", label: "Thaibah" },
  { value: "rawdah", label: "Rawdah" },
  { value: "firdaus", label: "Firdaus" },
  { value: "ramadhan", label: "Ramadhan" },
  { value: "arbain", label: "Arbain" },
  { value: "private", label: "Private" },
] as const

export const sortOptions = [
  { value: "popular", label: "Paling Populer" },
  { value: "price-asc", label: "Harga Terendah" },
  { value: "price-desc", label: "Harga Tertinggi" },
  { value: "duration", label: "Durasi" },
] as const

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}
