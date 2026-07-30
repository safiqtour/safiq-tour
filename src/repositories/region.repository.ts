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
}

type FindAllResult = {
  data: Prisma.RegionGetPayload<{ include: { country: { select: { id: true; name: true; code: true } }; _count: { select: { cities: true } } } }>[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const regionRepository = {
  async findAll(params: FindAllParams = {}): Promise<FindAllResult> {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", isActive, includeDeleted, countryId } = params
    const skip = (page - 1) * limit

    const where: Prisma.RegionWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (isActive !== undefined) where.isActive = isActive
    if (countryId) where.countryId = countryId
    if (search) {
      where.OR = [{ name: { contains: search } }]
    }

    const [data, total] = await Promise.all([
      db.region.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          country: { select: { id: true, name: true, code: true } },
          _count: { select: { cities: true } },
        },
      }),
      db.region.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.region.findUnique({
      where: { id },
      include: {
        country: { select: { id: true, name: true, code: true } },
        _count: { select: { cities: true } },
      },
    })
  },

  async create(data: Prisma.RegionCreateInput) {
    return db.region.create({ data })
  },

  async update(id: string, data: Prisma.RegionUpdateInput) {
    return db.region.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return db.region.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.region.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.region.delete({ where: { id } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    return db.region.update({ where: { id }, data: { isActive } })
  },

  async getByCountry(countryId: string) {
    return db.region.findMany({
      where: { countryId, isActive: true, deletedAt: null },
      orderBy: { sortOrder: "asc" },
    })
  },
}
