"use server"

import { getSession } from "@/services/auth.integration.service"
import { destinationService } from "@/services/destination.service"
import { can } from "@/services/authorization.service"
import { createDestinationSchema, updateDestinationSchema, destinationQuerySchema } from "@/validations/destination.schema"

export async function getDestinations(params: unknown) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = can(session.user.role, "master.destination:view")
  if (!canView) throw new Error("Forbidden")

  const query = destinationQuerySchema.parse(params)
  return destinationService.findAll(query)
}

export async function getDestination(id: string) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = can(session.user.role, "master.destination:view")
  if (!canView) throw new Error("Forbidden")

  return destinationService.findById(id)
}

export async function createDestination(data: unknown) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canCreate = can(session.user.role, "master.destination:create")
  if (!canCreate) throw new Error("Forbidden")

  const parsed = createDestinationSchema.parse(data)
  return destinationService.create(parsed)
}

export async function updateDestination(id: string, data: unknown) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "master.destination:update")
  if (!canUpdate) throw new Error("Forbidden")

  const parsed = updateDestinationSchema.parse(data)
  return destinationService.update(id, parsed)
}

export async function deleteDestination(id: string) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = can(session.user.role, "master.destination:delete")
  if (!canDelete) throw new Error("Forbidden")

  await destinationService.softDelete(id)
}

export async function restoreDestination(id: string) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "master.destination:update")
  if (!canUpdate) throw new Error("Forbidden")

  await destinationService.restore(id)
}

export async function toggleDestinationStatus(id: string, isActive: boolean) {
  const session = await getSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "master.destination:update")
  if (!canUpdate) throw new Error("Forbidden")

  return destinationService.toggleStatus(id, isActive)
}
