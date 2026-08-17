import { z } from "zod"
import { PROMOTION_TYPES, DISCOUNT_TYPES } from "../types"

export const createPromotionSchema = z.object({
  name: z.string().min(1, "Nama promosi wajib diisi").max(200),
  description: z.string().optional().default(""),
  promotionType: z.enum(PROMOTION_TYPES).default("CUSTOM"),
  discountType: z.enum(DISCOUNT_TYPES).default("PERCENTAGE"),
  discountValue: z.coerce.number().min(0).default(0),
  minimumPurchaseAmount: z.coerce.number().min(0).default(0),
  maximumDiscountAmount: z.coerce.number().min(0).default(0),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  usageLimit: z.coerce.number().int().min(0).default(0),
  isPublic: z.coerce.boolean().optional().default(true),
  isAutoApply: z.coerce.boolean().optional().default(false),
  priority: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updatePromotionSchema = createPromotionSchema.partial()

export const promotionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  promotionType: z.string().optional(),
  status: z.string().optional(),
  isAutoApply: z.coerce.boolean().optional(),
  isPublic: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>
export type PromotionQueryInput = z.infer<typeof promotionQuerySchema>
