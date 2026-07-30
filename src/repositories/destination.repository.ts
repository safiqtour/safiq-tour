import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

type FindAllParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  isActive?: boolean
  includeDeleted?: boolean
  countryId?: string
  regionId?: string
  cityId?: string
  destinationTypeId?: string
}

type FindAllResult = {
  data: Prisma.DestinationGetPayload<{
    include: {
      country: { select: { id: true; name: true; code: true } }
      region: { select: { id: true; name: true } }
      city: { select: { id: true; name: true } }
      destinationType: { select: { id: true; name: true } }
      media: { include: { media: { select: { id: true; url: true; thumbnailUrl: true; alt: true } } } }
    }
  }>[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const destinationRepository = {
  async findAll(params: FindAllParams = {}): Promise<FindAllResult> {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", isActive, includeDeleted, countryId, regionId, cityId, destinationTypeId } = params
    const skip = (page - 1) * limit

    const where: Prisma.DestinationWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (isActive !== undefined) where.isActive = isActive
    if (countryId) where.countryId = countryId
    if (regionId) where.regionId = regionId
    if (cityId) where.cityId = cityId
    if (destinationTypeId) where.destinationTypeId = destinationTypeId
    if (search) {
      where.OR = [{ name: { contains: search } }]
    }

    const [data, total] = await Promise.all([
      db.destination.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          country: { select: { id: true, name: true, code: true } },
          region: { select: { id: true, name: true } },
          city: { select: { id: true, name: true } },
          destinationType: { select: { id: true, name: true } },
          media: { include: { media: { select: { id: true, url: true, thumbnailUrl: true, alt: true } } }, orderBy: { sortOrder: "asc" } },
        },
      }),
      db.destination.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.destination.findUnique({
      where: { id },
      include: {
        country: { select: { id: true, name: true, code: true } },
        region: { select: { id: true, name: true } },
        city: { select: { id: true, name: true } },
        destinationType: { select: { id: true, name: true } },
        media: { include: { media: { select: { id: true, url: true, thumbnailUrl: true, alt: true } } }, orderBy: { sortOrder: "asc" } },
      },
    })
  },

  async create(data: Prisma.DestinationCreateInput) {
    return db.destination.create({ data })
  },

  async update(id: string, data: Prisma.DestinationUpdateInput) {
    return db.destination.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return db.destination.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.destination.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.destination.delete({ where: { id } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    return db.destination.update({ where: { id }, data: { isActive } })
  },
}
