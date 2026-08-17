"use server"

import { getWritableSession } from "@/services/auth.integration.service"
import { cityService } from "@/services/city.service"
import { can } from "@/services/authorization.service"
import { createCitySchema, updateCitySchema, cityQuerySchema } from "@/validations/city.schema"

export async function getCities(params: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = can(session.user.role, "master.city:view")
  if (!canView) throw new Error("Forbidden")

  const query = cityQuerySchema.parse(params)
  return cityService.findAll(query)
}

export async function getCity(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = can(session.user.role, "master.city:view")
  if (!canView) throw new Error("Forbidden")

  return cityService.findById(id)
}

export async function getCitiesByCountry(countryId: string) {
  return cityService.getByCountry(countryId)
}

export async function getCitiesByRegion(regionId: string) {
  return cityService.getByRegion(regionId)
}

export async function createCity(data: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canCreate = can(session.user.role, "master.city:create")
  if (!canCreate) throw new Error("Forbidden")

  const parsed = createCitySchema.parse(data)
  return cityService.create(parsed)
}

export async function updateCity(id: string, data: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "master.city:update")
  if (!canUpdate) throw new Error("Forbidden")

  const parsed = updateCitySchema.parse(data)
  return cityService.update(id, parsed)
}

export async function deleteCity(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = can(session.user.role, "master.city:delete")
  if (!canDelete) throw new Error("Forbidden")

  await cityService.softDelete(id)
}

export async function restoreCity(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "master.city:update")
  if (!canUpdate) throw new Error("Forbidden")

  await cityService.restore(id)
}

export async function toggleCityStatus(id: string, isActive: boolean) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "master.city:update")
  if (!canUpdate) throw new Error("Forbidden")

  return cityService.toggleStatus(id, isActive)
}
