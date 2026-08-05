"use server"

import { getWritableSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { requirePermission } from "../../lib/permission"
import { promotionService } from "../services/promotion.service"
import {
  createPromotionSchema,
  updatePromotionSchema,
  promotionQuerySchema,
} from "../validations/promotion.schema"

export async function getPromotions(params: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.promotion:read")) throw new Error("Forbidden")

  const query = promotionQuerySchema.parse(params)
  return promotionService.findAll(query as never)
}

export async function getPromotion(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.promotion:read")) throw new Error("Forbidden")

  return promotionService.findById(id)
}

export async function createPromotion(data: unknown) {
  await requirePermission("master.promotion:create")

  const parsed = createPromotionSchema.parse(data)
  return promotionService.create(parsed as never)
}

export async function updatePromotion(id: string, data: unknown) {
  await requirePermission("master.promotion:update")

  const parsed = updatePromotionSchema.parse(data)
  return promotionService.update(id, parsed as never)
}

export async function deletePromotion(id: string) {
  await requirePermission("master.promotion:delete")

  await promotionService.softDelete(id)
}

export async function restorePromotion(id: string) {
  await requirePermission("master.promotion:update")

  await promotionService.restore(id)
}

export async function togglePromotionStatus(id: string) {
  await requirePermission("master.promotion:update")

  return promotionService.toggleStatus(id)
}
