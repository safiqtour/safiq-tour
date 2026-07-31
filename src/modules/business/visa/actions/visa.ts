"use server"

import { getSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { requirePermission } from "../../lib/permission"
import { visaService } from "../services/visa.service"
import {
  createVisaSchema,
  updateVisaSchema,
  visaQuerySchema,
} from "../validations/visa.schema"

export async function getVisas(params: unknown) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.visa:read")) throw new Error("Forbidden")

  const query = visaQuerySchema.parse(params)
  return visaService.findAll(query as never)
}

export async function getVisa(id: string) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.visa:read")) throw new Error("Forbidden")

  return visaService.findById(id)
}

export async function createVisa(data: unknown) {
  await requirePermission("master.visa:create")

  const parsed = createVisaSchema.parse(data)
  return visaService.create(parsed as never)
}

export async function updateVisa(id: string, data: unknown) {
  await requirePermission("master.visa:update")

  const parsed = updateVisaSchema.parse(data)
  return visaService.update(id, parsed as never)
}

export async function deleteVisa(id: string) {
  await requirePermission("master.visa:delete")

  await visaService.softDelete(id)
}

export async function restoreVisa(id: string) {
  await requirePermission("master.visa:update")

  await visaService.restore(id)
}
