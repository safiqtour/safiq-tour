import { z } from "zod"

export const createHotelSchema = z.object({
  name: z.string().min(1, "Nama hotel wajib diisi").max(200),
  countryId: z.string().min(1),
  regionId: z.string().optional().nullable(),
  cityId: z.string().optional().nullable(),
  destinationId: z.string().optional().nullable(),
  starRating: z.coerce.number().int().min(1).max(5).default(3),
  distanceToHaram: z.string().optional().default(""),
  distanceToNabawi: z.string().optional().default(""),
  address: z.string().optional().default(""),
  mapsUrl: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  email: z.string().optional().default(""),
  website: z.string().optional().default(""),
  shortDescription: z.string().optional().default(""),
  description: z.string().optional().default(""),
  featuredMediaId: z.string().optional().nullable(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  sortOrder: z.coerce.number().int().default(0),
  galleryMediaIds: z.array(z.object({ mediaId: z.string(), sortOrder: z.number().int() })).optional().default([]),
})

export const updateHotelSchema = createHotelSchema.partial()

export const hotelQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  countryId: z.string().optional(),
  cityId: z.string().optional(),
  destinationId: z.string().optional(),
  starRating: z.coerce.number().int().optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateHotelInput = z.infer<typeof createHotelSchema>
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>
