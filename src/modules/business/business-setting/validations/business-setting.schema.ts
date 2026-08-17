import { z } from "zod"
import { BUSINESS_SETTING_GROUPS, BUSINESS_SETTING_VALUE_TYPES } from "../types"

export const createBusinessSettingSchema = z.object({
  key: z.string().min(1, "Key wajib diisi").max(200),
  label: z.string().min(1, "Label wajib diisi").max(200),
  group: z.enum(BUSINESS_SETTING_GROUPS).default("GENERAL"),
  value: z.string().optional().default(""),
  valueType: z.enum(BUSINESS_SETTING_VALUE_TYPES).default("STRING"),
  description: z.string().optional().default(""),
  isPublic: z.coerce.boolean().optional().default(false),
  isReadonly: z.coerce.boolean().optional().default(false),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updateBusinessSettingSchema = createBusinessSettingSchema.partial()

export const businessSettingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  group: z.string().optional(),
  status: z.string().optional(),
  isReadonly: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateBusinessSettingInput = z.infer<typeof createBusinessSettingSchema>
export type UpdateBusinessSettingInput = z.infer<typeof updateBusinessSettingSchema>
export type BusinessSettingQueryInput = z.infer<typeof businessSettingQuerySchema>
