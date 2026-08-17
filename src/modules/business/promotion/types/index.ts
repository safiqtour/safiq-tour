export const PROMOTION_TYPES = [
  "EARLY_BIRD",
  "FLASH_SALE",
  "SEASONAL",
  "RAMADHAN",
  "NEW_CUSTOMER",
  "LOYALTY",
  "REFERRAL",
  "CUSTOM",
] as const

export type PromotionType = (typeof PROMOTION_TYPES)[number]

export const DISCOUNT_TYPES = ["PERCENTAGE", "FIXED_AMOUNT"] as const
export type DiscountType = (typeof DISCOUNT_TYPES)[number]

export interface PromotionListItem {
  id: string
  code: string
  slug: string
  name: string
  description: string
  promotionType: string
  discountType: string
  discountValue: number
  minimumPurchaseAmount: number
  maximumDiscountAmount: number
  startDate: Date | string
  endDate: Date | string
  usageLimit: number
  usedCount: number
  isPublic: boolean
  isAutoApply: boolean
  priority: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
