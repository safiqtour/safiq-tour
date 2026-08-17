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
}

type FindAllResult = {
  data: Prisma.CityGetPayload<{
    include: { country: { select: { id: true; name: true; code: true } }; region: { select: { id: true; name: true } } }
  }>[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const cityRepository = {
  async findAll(params: FindAllParams = {}): Promise<FindAllResult> {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", isActive, includeDeleted, countryId, regionId } = params
    const skip = (page - 1) * limit

    const where: Prisma.CityWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (isActive !== undefined) where.isActive = isActive
    if (countryId) where.countryId = countryId
    if (regionId) where.regionId = regionId
    if (search) {
      where.OR = [{ name: { contains: search } }]
    }

    const [data, total] = await Promise.all([
      db.city.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          country: { select: { id: true, name: true, code: true } },
          region: { select: { id: true, name: true } },
        },
      }),
      db.city.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.city.findUnique({
      where: { id },
      include: {
        country: { select: { id: true, name: true, code: true } },
        region: { select: { id: true, name: true } },
      },
    })
  },

  async create(data: Prisma.CityCreateInput) {
    return db.city.create({ data })
  },

  async update(id: string, data: Prisma.CityUpdateInput) {
    return db.city.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return db.city.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.city.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.city.delete({ where: { id } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    return db.city.update({ where: { id }, data: { isActive } })
  },

  async getByCountry(countryId: string) {
    return db.city.findMany({
      where: { countryId, isActive: true, deletedAt: null },
      orderBy: { sortOrder: "asc" },
    })
  },

  async getByRegion(regionId: string) {
    return db.city.findMany({
      where: { regionId, isActive: true, deletedAt: null },
      orderBy: { sortOrder: "asc" },
    })
  },
}
