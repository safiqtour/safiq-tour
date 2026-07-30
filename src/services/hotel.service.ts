import { hotelRepository } from "@/repositories/hotel.repository"
import { logActivity } from "@/services/audit.service"
import slugify from "slugify"

export const hotelService = {
  async findAll(params: Parameters<typeof hotelRepository.findAll>[0]) {
    return hotelRepository.findAll(params)
  },

  async findById(id: string) {
    return hotelRepository.findById(id)
  },

  async getActiveHotels() {
    return hotelRepository.getActiveHotels()
  },

  async getAllAmenities() {
    return hotelRepository.getAllAmenities()
  },

  async create(data: Record<string, unknown>) {
    const slug = slugify(data.name as string, { lower: true, strict: true })
    const { amenityIds, galleryMediaIds, roomTypes, policies, ...hotelData } = data as Record<string, unknown>

    const hotel = await hotelRepository.create({
      ...hotelData,
      slug,
      country: (hotelData.countryId as string) ? { connect: { id: hotelData.countryId as string } } : undefined,
      region: (hotelData.regionId as string) ? { connect: { id: hotelData.regionId as string } } : undefined,
      city: (hotelData.cityId as string) ? { connect: { id: hotelData.cityId as string } } : undefined,
      destination: (hotelData.destinationId as string) ? { connect: { id: hotelData.destinationId as string } } : undefined,
      featuredMedia: (hotelData.featuredMediaId as string) ? { connect: { id: hotelData.featuredMediaId as string } } : undefined,
    } as never)

    if (amenityIds && Array.isArray(amenityIds)) {
      await hotelRepository.syncAmenities(hotel.id, amenityIds as string[])
    }
    if (galleryMediaIds && Array.isArray(galleryMediaIds)) {
      await hotelRepository.syncMedia(hotel.id, (hotelData.featuredMediaId as string) ?? null, galleryMediaIds as { mediaId: string; sortOrder: number }[])
    }
    if (roomTypes && Array.isArray(roomTypes)) {
      await hotelRepository.syncRoomTypes(hotel.id, roomTypes as { name: string; description?: string; price?: number; capacity?: number; sortOrder?: number }[])
    }
    if (policies && Array.isArray(policies)) {
      await hotelRepository.syncPolicies(hotel.id, policies as { type: string; content: string; sortOrder?: number }[])
    }

    await logActivity({ action: "CREATE", resource: "master.hotel", resourceId: hotel.id, metadata: { name: hotel.name } })
    return hotel
  },

  async update(id: string, data: Record<string, unknown>) {
    const existing = await hotelRepository.findById(id)
    if (!existing) throw new Error("Hotel not found")

    const { amenityIds, galleryMediaIds, roomTypes, policies, ...hotelData } = data as Record<string, unknown>

    const updateData: Record<string, unknown> = { ...hotelData }
    if (hotelData.name && hotelData.name !== existing.name) {
      updateData.slug = slugify(hotelData.name as string, { lower: true, strict: true })
    }

    const hotel = await hotelRepository.update(id, updateData as never)

    if (amenityIds !== undefined && Array.isArray(amenityIds)) {
      await hotelRepository.syncAmenities(id, amenityIds as string[])
    }
    if (galleryMediaIds !== undefined && Array.isArray(galleryMediaIds)) {
      await hotelRepository.syncMedia(id, (hotelData.featuredMediaId as string) ?? existing.featuredMediaId, galleryMediaIds as { mediaId: string; sortOrder: number }[])
    }
    if (roomTypes !== undefined && Array.isArray(roomTypes)) {
      await hotelRepository.syncRoomTypes(id, roomTypes as { name: string; description?: string; price?: number; capacity?: number; sortOrder?: number }[])
    }
    if (policies !== undefined && Array.isArray(policies)) {
      await hotelRepository.syncPolicies(id, policies as { type: string; content: string; sortOrder?: number }[])
    }

    await logActivity({ action: "UPDATE", resource: "master.hotel", resourceId: id, metadata: { name: hotel.name } })
    return hotel
  },

  async softDelete(id: string) {
    const hotel = await hotelRepository.findById(id)
    if (!hotel) throw new Error("Hotel not found")
    await hotelRepository.softDelete(id)
    await logActivity({ action: "DELETE", resource: "master.hotel", resourceId: id, metadata: { name: hotel.name } })
  },

  async restore(id: string) {
    const hotel = await hotelRepository.findById(id)
    if (!hotel) throw new Error("Hotel not found")
    await hotelRepository.restore(id)
    await logActivity({ action: "APPROVE", resource: "master.hotel", resourceId: id, metadata: { name: hotel.name } })
  },
}
