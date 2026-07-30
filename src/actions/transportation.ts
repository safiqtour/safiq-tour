"use server"

import { auth } from "@/lib/auth/auth"
import { transportationService } from "@/services/transportation.service"
import { hasPermission } from "@/services/auth.service"
import { createTransportationSchema, updateTransportationSchema, transportationQuerySchema } from "@/validations/transportation.schema"

export async function getTransportations(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.transportation:read")) throw new Error("Forbidden")
  const query = transportationQuerySchema.parse(params)
  return transportationService.findAll(query)
}

export async function getTransportation(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.transportation:read")) throw new Error("Forbidden")
  return transportationService.findById(id)
}

export async function createTransportation(data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.transportation:create")) throw new Error("Forbidden")
  const parsed = createTransportationSchema.parse(data)
  return transportationService.create(parsed)
}

export async function updateTransportation(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.transportation:update")) throw new Error("Forbidden")
  const parsed = updateTransportationSchema.parse(data)
  return transportationService.update(id, parsed as never)
}

export async function deleteTransportation(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.transportation:delete")) throw new Error("Forbidden")
  await transportationService.softDelete(id)
}

export async function restoreTransportation(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.transportation:update")) throw new Error("Forbidden")
  await transportationService.restore(id)
}
