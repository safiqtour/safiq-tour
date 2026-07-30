import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export type TransportationFindAllParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  type?: string
  status?: string
  includeDeleted?: boolean
}

const transportationInclude = {
  media: { select: { id: true, url: true, thumbnailUrl: true } },
} as const

export const transportationRepository = {
  async findAll(params: TransportationFindAllParams = {}) {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", type, status, includeDeleted } = params
    const skip = (page - 1) * limit

    const where: Prisma.TransportationWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (type) where.type = type
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    const [data, total] = await Promise.all([
      db.transportation.findMany({ where, skip, take: limit, orderBy: { [sort]: order }, include: transportationInclude }),
      db.transportation.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.transportation.findUnique({ where: { id }, include: transportationInclude })
  },

  async create(data: Prisma.TransportationCreateInput) {
    return db.transportation.create({ data, include: transportationInclude })
  },

  async update(id: string, data: Prisma.TransportationUpdateInput) {
    return db.transportation.update({ where: { id }, data, include: transportationInclude })
  },

  async softDelete(id: string) {
    return db.transportation.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.transportation.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.transportation.delete({ where: { id } })
  },

  async getActiveByType() {
    return db.transportation.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { type: "asc" },
    })
  },
}
