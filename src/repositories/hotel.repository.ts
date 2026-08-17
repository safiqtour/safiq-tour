import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export type HotelFindAllParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  countryId?: string
  cityId?: string
  destinationId?: string
  starRating?: number
  status?: string
  includeDeleted?: boolean
}

const hotelInclude = {
  country: { select: { id: true, name: true } },
  region: { select: { id: true, name: true } },
  city: { select: { id: true, name: true } },
  destination: { select: { id: true, name: true } },
  featuredMedia: { select: { id: true, url: true, thumbnailUrl: true, alt: true } },
  _count: { select: { media: true, roomTypes: true, policies: true } },
} as const

export const hotelRepository = {
  async findAll(params: HotelFindAllParams = {}) {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", countryId, cityId, destinationId, starRating, status, includeDeleted } = params
    const skip = (page - 1) * limit

    const where: Prisma.HotelWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (countryId) where.countryId = countryId
    if (cityId) where.cityId = cityId
    if (destinationId) where.destinationId = destinationId
    if (starRating) where.starRating = starRating
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { address: { contains: search } },
        { shortDescription: { contains: search } },
      ]
    }

    const [data, total] = await Promise.all([
      db.hotel.findMany({ where, skip, take: limit, orderBy: { [sort]: order }, include: hotelInclude }),
      db.hotel.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.hotel.findUnique({
      where: { id },
      include: {
        ...hotelInclude,
        region: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        destination: { select: { id: true, name: true } },
        hotelAmenities: { include: { amenity: { select: { id: true, name: true, icon: true } } } },
        media: { include: { media: { select: { id: true, url: true, thumbnailUrl: true, alt: true } } }, orderBy: { sortOrder: "asc" } },
        roomTypes: { orderBy: { sortOrder: "asc" } },
        contacts: { orderBy: { sortOrder: "asc" } },
        policies: { orderBy: { sortOrder: "asc" } },
      },
    })
  },

  async create(data: Prisma.HotelCreateInput) {
    return db.hotel.create({ data, include: hotelInclude })
  },

  async update(id: string, data: Prisma.HotelUpdateInput) {
    return db.hotel.update({ where: { id }, data, include: hotelInclude })
  },

  async softDelete(id: string) {
    return db.hotel.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.hotel.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.hotel.delete({ where: { id } })
  },

  async getActiveHotels() {
    return db.hotel.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, starRating: true, city: { select: { name: true } } },
    })
  },

  async getAllAmenities() {
    return db.hotelAmenity.findMany({ orderBy: { sortOrder: "asc" } })
  },

  async syncAmenities(hotelId: string, amenityIds: string[]) {
    await db.hotelAmenityOnHotel.deleteMany({ where: { hotelId } })
    if (amenityIds.length > 0) {
      await db.hotelAmenityOnHotel.createMany({
        data: amenityIds.map((amenityId) => ({ hotelId, amenityId })),
      })
    }
  },

  async syncMedia(hotelId: string, featuredMediaId: string | null, galleryMediaIds: { mediaId: string; sortOrder: number }[]) {
    await db.hotelMedia.deleteMany({ where: { hotelId } })
    if (featuredMediaId) {
      await db.hotelMedia.create({ data: { hotelId, mediaId: featuredMediaId, type: "FEATURED", sortOrder: 0 } })
    }
    if (galleryMediaIds.length > 0) {
      await db.hotelMedia.createMany({
        data: galleryMediaIds.map((g) => ({ hotelId, mediaId: g.mediaId, type: "GALLERY", sortOrder: g.sortOrder })),
      })
    }
  },

  async syncRoomTypes(hotelId: string, roomTypes: { name: string; description?: string; price?: number; capacity?: number; sortOrder?: number }[]) {
    await db.hotelRoomType.deleteMany({ where: { hotelId } })
    if (roomTypes.length > 0) {
      await db.hotelRoomType.createMany({
        data: roomTypes.map((r, i) => ({ hotelId, name: r.name, description: r.description ?? "", price: r.price ?? 0, capacity: r.capacity ?? 2, sortOrder: r.sortOrder ?? i })),
      })
    }
  },

  async syncPolicies(hotelId: string, policies: { type: string; content: string; sortOrder?: number }[]) {
    await db.hotelPolicy.deleteMany({ where: { hotelId } })
    if (policies.length > 0) {
      await db.hotelPolicy.createMany({
        data: policies.map((p, i) => ({ hotelId, type: p.type, content: p.content, sortOrder: p.sortOrder ?? i })),
      })
    }
  },
}
