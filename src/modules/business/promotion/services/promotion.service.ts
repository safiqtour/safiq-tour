import { BaseService } from "../../services/base.service"
import { promotionRepository } from "../repositories/promotion.repository"
import { audit } from "../../lib/audit"
import type { PromotionListItem } from "../types"

export class PromotionService extends BaseService<
  PromotionListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(promotionRepository, "master.promotion")
  }

  async create(data: Record<string, unknown>) {
    this.validateDates(data)
    this.validateDiscount(data)
    this.validateUsageLimit(data)
    this.enforceAutoApplyRules(data)

    return super.create(data)
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error("master.promotion not found")

    const merged = { ...(existing as unknown as Record<string, unknown>), ...data }
    this.validateDates(merged)
    this.validateDiscount(merged)
    this.validateUsageLimit(merged)
    this.enforceAutoApplyRules(data, merged)

    return super.update(id, data)
  }

  private validateDates(data: Record<string, unknown>) {
    const startDate = data.startDate ? new Date(data.startDate as string) : null
    const endDate = data.endDate ? new Date(data.endDate as string) : null
    if (startDate && endDate && startDate >= endDate) {
      throw new Error("Start date must be before end date")
    }
  }

  private validateDiscount(data: Record<string, unknown>) {
    if ((data.discountValue as number) < 0) throw new Error("Discount value must be >= 0")
    if ((data.minimumPurchaseAmount as number) < 0) throw new Error("Minimum purchase amount must be >= 0")
    if ((data.maximumDiscountAmount as number) < 0) throw new Error("Maximum discount amount must be >= 0")
  }

  private validateUsageLimit(data: Record<string, unknown>) {
    const usageLimit = data.usageLimit as number
    const usedCount = data.usedCount as number
    if (usageLimit > 0 && usedCount > usageLimit) {
      throw new Error("Usage count cannot exceed usage limit")
    }
  }

  private enforceAutoApplyRules(data: Record<string, unknown>, merged?: Record<string, unknown>) {
    const target = merged ?? data
    const isAutoApply = data.isAutoApply as boolean | undefined
    if (isAutoApply === true) {
      const status = target.status as string
      if (status !== "ACTIVE") {
        data.isAutoApply = false
      }
      const endDate = target.endDate ? new Date(target.endDate as string) : null
      if (endDate && endDate < new Date()) {
        data.isAutoApply = false
      }
    }
  }

  async toggleStatus(id: string) {
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error("master.promotion not found")

    const currentStatus = (existing as unknown as Record<string, unknown>).status as string
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE"

    const updateData: Record<string, unknown> = { status: newStatus }
    if (newStatus !== "ACTIVE") {
      updateData.isAutoApply = false
    }

    const record = await this.repository.update(id, updateData)
    await audit({
      action: newStatus === "ACTIVE" ? "APPROVE" : "REJECT",
      resource: "master.promotion",
      resourceId: id,
      metadata: { status: newStatus, name: (record as unknown as Record<string, unknown>).name },
    })
    return record
  }
}

export const promotionService = new PromotionService()
