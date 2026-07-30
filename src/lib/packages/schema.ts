import { z } from "zod"

export const packageHotelSchema = z.object({
  type: z.enum(["MEKKAH", "MADINAH"]),
  name: z.string().min(1, "Nama hotel wajib diisi"),
  stars: z.coerce.number().min(0).max(5),
  distance: z.string().min(1, "Jarak wajib diisi"),
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

export const packageItinerarySchema = z.object({
  day: z.coerce.number().min(1),
  title: z.string().min(1, "Judul wajib diisi"),
  description: z.string().optional().default(""),
  image: z.string().optional().default(""),
})

export const packageGallerySchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional().default(""),
  sortOrder: z.coerce.number().optional().default(0),
})

export const packageFormSchema = z.object({
  title: z.string().min(1, "Nama paket wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  excerpt: z.string().min(1, "Deskripsi singkat wajib diisi"),
  description: z.string().optional().default(""),
  category: z.enum(["REGULAR", "PLUS", "EXECUTIVE", "LUXURY", "PRIVATE"]),
  country: z.string().min(1, "Negara wajib diisi"),
  city: z.string().min(1, "Kota wajib diisi"),
  duration: z.coerce.number().min(1, "Durasi wajib diisi"),
  price: z.coerce.number().min(1, "Harga wajib diisi"),
  promoPrice: z.coerce.number().optional().nullable(),
  discount: z.coerce.number().optional().default(0),
  currency: z.string().optional().default("IDR"),
  airline: z.string().min(1, "Maskapai wajib diisi"),
  quota: z.coerce.number().min(0),
  seatFilled: z.coerce.number().optional().default(0),
  status: z.enum(["DRAFT", "PUBLISHED", "COMING_SOON", "SOLD_OUT", "FINISHED"]),
  featured: z.boolean().optional().default(false),
  badge: z.enum(["BEST_SELLER", "NEW", "PROMO"]).optional().nullable(),
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
})

export type PackageFormValues = z.infer<typeof packageFormSchema>
