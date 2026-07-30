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
}

type FindAllResult = {
  data: Prisma.CountryGetPayload<{ include: { _count: { select: { regions: true; cities: true } } } }>[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

export const countryRepository = {
  async findAll(params: FindAllParams = {}): Promise<FindAllResult> {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", isActive, includeDeleted } = params
    const skip = (page - 1) * limit

    const where: Prisma.CountryWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (isActive !== undefined) where.isActive = isActive
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
      ]
    }

    const [data, total] = await Promise.all([
      db.country.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: { _count: { select: { regions: true, cities: true } } },
      }),
      db.country.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.country.findUnique({
      where: { id },
      include: { _count: { select: { regions: true, cities: true } } },
    })
  },

  async findBySlug(slug: string) {
    return db.country.findUnique({ where: { slug } })
  },

  async findByCode(code: string) {
    return db.country.findUnique({ where: { code } })
  },

  async create(data: Prisma.CountryCreateInput) {
    return db.country.create({ data })
  },

  async update(id: string, data: Prisma.CountryUpdateInput) {
    return db.country.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return db.country.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.country.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.country.delete({ where: { id } })
  },

  async toggleStatus(id: string, isActive: boolean) {
    return db.country.update({ where: { id }, data: { isActive } })
  },

  async getAllActive() {
    return db.country.findMany({
      where: { isActive: true, deletedAt: null },
      orderBy: { sortOrder: "asc" },
    })
  },
}
