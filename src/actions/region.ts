"use server"

import { auth } from "@/lib/auth/auth"
import { regionService } from "@/services/region.service"
import { hasPermission } from "@/services/auth.service"
import { createRegionSchema, updateRegionSchema, regionQuerySchema } from "@/validations/region.schema"

export async function getRegions(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "master.region:view")
  if (!canView) throw new Error("Forbidden")

  const query = regionQuerySchema.parse(params)
  return regionService.findAll(query)
}

export async function getRegion(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "master.region:view")
  if (!canView) throw new Error("Forbidden")

  return regionService.findById(id)
}

export async function getRegionsByCountry(countryId: string) {
  return regionService.getByCountry(countryId)
}

export async function createRegion(data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canCreate = hasPermission(session.user.role, "master.region:create")
  if (!canCreate) throw new Error("Forbidden")

  const parsed = createRegionSchema.parse(data)
  return regionService.create(parsed)
}

export async function updateRegion(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "master.region:update")
  if (!canUpdate) throw new Error("Forbidden")

  const parsed = updateRegionSchema.parse(data)
  return regionService.update(id, parsed)
}

export async function deleteRegion(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = hasPermission(session.user.role, "master.region:delete")
  if (!canDelete) throw new Error("Forbidden")

  await regionService.softDelete(id)
}

export async function restoreRegion(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "master.region:update")
  if (!canUpdate) throw new Error("Forbidden")

  await regionService.restore(id)
}

export async function toggleRegionStatus(id: string, isActive: boolean) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "master.region:update")
  if (!canUpdate) throw new Error("Forbidden")

  return regionService.toggleStatus(id, isActive)
}
