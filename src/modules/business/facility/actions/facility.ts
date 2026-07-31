"use server"

import { getSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { requirePermission } from "../../lib/permission"
import { facilityService } from "../services/facility.service"
import {
  createFacilitySchema,
  updateFacilitySchema,
  facilityQuerySchema,
} from "../validations/facility.schema"

export async function getFacilities(params: unknown) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.facility:read")) throw new Error("Forbidden")

  const query = facilityQuerySchema.parse(params)
  return facilityService.findAll(query as never)
}

export async function getFacility(id: string) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.facility:read")) throw new Error("Forbidden")

  return facilityService.findById(id)
}

export async function createFacility(data: unknown) {
  await requirePermission("master.facility:create")

  const parsed = createFacilitySchema.parse(data)
  return facilityService.create(parsed as never)
}

export async function updateFacility(id: string, data: unknown) {
  await requirePermission("master.facility:update")

  const parsed = updateFacilitySchema.parse(data)
  return facilityService.update(id, parsed as never)
}

export async function deleteFacility(id: string) {
  await requirePermission("master.facility:delete")

  await facilityService.softDelete(id)
}

export async function restoreFacility(id: string) {
  await requirePermission("master.facility:update")

  await facilityService.restore(id)
}
