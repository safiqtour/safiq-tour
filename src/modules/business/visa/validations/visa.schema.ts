import { z } from "zod"
import { VISA_TYPES, ENTRY_TYPES } from "../types"

export const createVisaSchema = z.object({
  name: z.string().min(1, "Nama visa wajib diisi").max(200),
  countryId: z.string().min(1, "Country wajib dipilih"),
  visaType: z.enum(VISA_TYPES).default("UMRAH"),
  entryType: z.enum(ENTRY_TYPES).default("SINGLE"),
  processingDays: z.coerce.number().int().min(0).default(0),
  validityDays: z.coerce.number().int().min(0).default(0),
  stayDurationDays: z.coerce.number().int().min(0).default(0),
  requirement: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  isElectronic: z.coerce.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updateVisaSchema = createVisaSchema.partial()

export const visaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  countryId: z.string().optional(),
  visaType: z.string().optional(),
  entryType: z.string().optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateVisaInput = z.infer<typeof createVisaSchema>
export type UpdateVisaInput = z.infer<typeof updateVisaSchema>
export type VisaQueryInput = z.infer<typeof visaQuerySchema>
