"use server"

import { getSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { requirePermission } from "../../lib/permission"
import { businessSettingService } from "../services/business-setting.service"
import {
  createBusinessSettingSchema,
  updateBusinessSettingSchema,
  businessSettingQuerySchema,
} from "../validations/business-setting.schema"

export async function getBusinessSettings(params: unknown) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.business-setting:read")) throw new Error("Forbidden")

  const query = businessSettingQuerySchema.parse(params)
  return businessSettingService.findAll(query as never)
}

export async function getBusinessSetting(id: string) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.business-setting:read")) throw new Error("Forbidden")

  return businessSettingService.findById(id)
}

export async function createBusinessSetting(data: unknown) {
  await requirePermission("master.business-setting:create")

  const parsed = createBusinessSettingSchema.parse(data)
  return businessSettingService.create(parsed as unknown as Record<string, unknown>)
}

export async function updateBusinessSetting(id: string, data: unknown) {
  await requirePermission("master.business-setting:update")

  const parsed = updateBusinessSettingSchema.parse(data)
  return businessSettingService.update(id, parsed as unknown as Record<string, unknown>)
}

export async function deleteBusinessSetting(id: string) {
  await requirePermission("master.business-setting:delete")

  await businessSettingService.softDelete(id)
}

export async function restoreBusinessSetting(id: string) {
  await requirePermission("master.business-setting:update")

  await businessSettingService.restore(id)
}
