"use server"

import { auth } from "@/lib/auth/auth"
import { airlineService } from "@/services/airline.service"
import { hasPermission } from "@/services/auth.service"
import { createAirlineSchema, updateAirlineSchema, airlineQuerySchema } from "@/validations/airline.schema"

export async function getAirlines(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.airline:read")) throw new Error("Forbidden")
  const query = airlineQuerySchema.parse(params)
  return airlineService.findAll(query)
}

export async function getAirline(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.airline:read")) throw new Error("Forbidden")
  return airlineService.findById(id)
}

export async function getActiveAirlines() {
  return airlineService.getActiveAirlines()
}

export async function createAirline(data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.airline:create")) throw new Error("Forbidden")
  const parsed = createAirlineSchema.parse(data)
  return airlineService.create(parsed)
}

export async function updateAirline(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.airline:update")) throw new Error("Forbidden")
  const parsed = updateAirlineSchema.parse(data)
  return airlineService.update(id, parsed as never)
}

export async function deleteAirline(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.airline:delete")) throw new Error("Forbidden")
  await airlineService.softDelete(id)
}

export async function restoreAirline(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.airline:update")) throw new Error("Forbidden")
  await airlineService.restore(id)
}
