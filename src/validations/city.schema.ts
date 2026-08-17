import { z } from "zod"

export const createCitySchema = z.object({
  name: z.string().min(1, "Nama kota wajib diisi").max(100),
  countryId: z.string().uuid("Country wajib dipilih"),
  regionId: z.string().uuid().optional().or(z.literal("")),
  timezone: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

export const updateCitySchema = createCitySchema.partial()

export const cityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
  countryId: z.string().optional(),
  regionId: z.string().optional(),
})

export type CreateCityInput = z.infer<typeof createCitySchema>
export type UpdateCityInput = z.infer<typeof updateCitySchema>
