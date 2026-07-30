"use server"

import { auth } from "@/lib/auth/auth"
import { hotelService } from "@/services/hotel.service"
import { hasPermission } from "@/services/auth.service"
import { createHotelSchema, updateHotelSchema, hotelQuerySchema } from "@/validations/hotel.schema"

export async function getHotels(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.hotel:read")) throw new Error("Forbidden")
  const query = hotelQuerySchema.parse(params)
  return hotelService.findAll(query)
}

export async function getHotel(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.hotel:read")) throw new Error("Forbidden")
  return hotelService.findById(id)
}

export async function getActiveHotels() {
  return hotelService.getActiveHotels()
}

export async function getAllHotelAmenities() {
  return hotelService.getAllAmenities()
}

export async function createHotel(data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.hotel:create")) throw new Error("Forbidden")
  const parsed = createHotelSchema.parse(data)
  return hotelService.create(parsed as never)
}

export async function updateHotel(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.hotel:update")) throw new Error("Forbidden")
  const parsed = updateHotelSchema.parse(data)
  return hotelService.update(id, parsed as never)
}

export async function deleteHotel(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.hotel:delete")) throw new Error("Forbidden")
  await hotelService.softDelete(id)
}

export async function restoreHotel(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.hotel:update")) throw new Error("Forbidden")
  await hotelService.restore(id)
}
