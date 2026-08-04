export interface Package {
  id: string
  slug: string
  title: string
  category: "zamzam" | "thaibah" | "rawdah" | "firdaus" | "ramadhan"
  duration: string
  price: number
  priceLabel?: string
  badge: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link"
  featured?: boolean
  image?: string
  features: string[]
  hotelMekah: string
  hotelMadinah: string
  maskapai: string
}

export const categories = [
  { value: "all", label: "Semua" },
  { value: "zamzam", label: "Zamzam" },
  { value: "thaibah", label: "Thaibah" },
  { value: "rawdah", label: "Rawdah" },
  { value: "firdaus", label: "Firdaus" },
  { value: "ramadhan", label: "Ramadhan" },
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
