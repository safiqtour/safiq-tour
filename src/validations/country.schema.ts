import { z } from "zod"

export const createCountrySchema = z.object({
  name: z.string().min(1, "Nama negara wajib diisi").max(100),
  code: z.string().length(2, "Kode negara harus 2 karakter").toUpperCase(),
  phoneCode: z.string().optional(),
  flag: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
})

export const updateCountrySchema = createCountrySchema.partial()

export const countryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateCountryInput = z.infer<typeof createCountrySchema>
export type UpdateCountryInput = z.infer<typeof updateCountrySchema>
