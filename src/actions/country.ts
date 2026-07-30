"use server"

import { auth } from "@/lib/auth/auth"
import { countryService } from "@/services/country.service"
import { hasPermission } from "@/services/auth.service"
import { createCountrySchema, updateCountrySchema, countryQuerySchema } from "@/validations/country.schema"

export async function getCountries(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "master.country:view")
  if (!canView) throw new Error("Forbidden")

  const query = countryQuerySchema.parse(params)
  return countryService.findAll(query)
}

export async function getCountry(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "master.country:view")
  if (!canView) throw new Error("Forbidden")

  return countryService.findById(id)
}

export async function getAllActiveCountries() {
  return countryService.getAllActive()
}

export async function createCountry(data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canCreate = hasPermission(session.user.role, "master.country:create")
  if (!canCreate) throw new Error("Forbidden")

  const parsed = createCountrySchema.parse(data)
  return countryService.create(parsed)
}

export async function updateCountry(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "master.country:update")
  if (!canUpdate) throw new Error("Forbidden")

  const parsed = updateCountrySchema.parse(data)
  return countryService.update(id, parsed)
}

export async function deleteCountry(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = hasPermission(session.user.role, "master.country:delete")
  if (!canDelete) throw new Error("Forbidden")

  await countryService.softDelete(id)
}

export async function restoreCountry(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "master.country:update")
  if (!canUpdate) throw new Error("Forbidden")

  await countryService.restore(id)
}

export async function toggleCountryStatus(id: string, isActive: boolean) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "master.country:update")
  if (!canUpdate) throw new Error("Forbidden")

  return countryService.toggleStatus(id, isActive)
}
