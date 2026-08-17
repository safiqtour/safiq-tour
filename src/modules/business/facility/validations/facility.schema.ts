import { z } from "zod"
import { FACILITY_CATEGORIES } from "../types"

export const createFacilitySchema = z.object({
  name: z.string().min(1, "Nama fasilitas wajib diisi").max(200),
  icon: z.string().optional().default(""),
  category: z.enum(FACILITY_CATEGORIES).default("Other"),
  description: z.string().optional().default(""),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updateFacilitySchema = createFacilitySchema.partial()

export const facilityQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  category: z.string().optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateFacilityInput = z.infer<typeof createFacilitySchema>
export type UpdateFacilityInput = z.infer<typeof updateFacilitySchema>
export type FacilityQueryInput = z.infer<typeof facilityQuerySchema>
