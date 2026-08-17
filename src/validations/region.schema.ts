import { z } from "zod"

export const createRegionSchema = z.object({
  name: z.string().min(1, "Nama region wajib diisi").max(100),
  countryId: z.string().uuid("Country wajib dipilih"),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

export const updateRegionSchema = createRegionSchema.partial()

export const regionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
  countryId: z.string().optional(),
})

export type CreateRegionInput = z.infer<typeof createRegionSchema>
export type UpdateRegionInput = z.infer<typeof updateRegionSchema>
