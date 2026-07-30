import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export type AirlineFindAllParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  status?: string
  includeDeleted?: boolean
}

const airlineInclude = {
  country: { select: { id: true, name: true } },
  logoMedia: { select: { id: true, url: true, thumbnailUrl: true } },
} as const

export const airlineRepository = {
  async findAll(params: AirlineFindAllParams = {}) {
    const { search, page = 1, limit = 10, sort = "createdAt", order = "desc", status, includeDeleted } = params
    const skip = (page - 1) * limit

    const where: Prisma.AirlineWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { iataCode: { contains: search } },
        { icaoCode: { contains: search } },
      ]
    }

    const [data, total] = await Promise.all([
      db.airline.findMany({ where, skip, take: limit, orderBy: { [sort]: order }, include: airlineInclude }),
      db.airline.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.airline.findUnique({ where: { id }, include: airlineInclude })
  },

  async findByIata(iataCode: string) {
    return db.airline.findUnique({ where: { iataCode } })
  },

  async create(data: Prisma.AirlineCreateInput) {
    return db.airline.create({ data, include: airlineInclude })
  },

  async update(id: string, data: Prisma.AirlineUpdateInput) {
    return db.airline.update({ where: { id }, data, include: airlineInclude })
  },

  async softDelete(id: string) {
    return db.airline.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.airline.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.airline.delete({ where: { id } })
  },

  async getActiveAirlines() {
    return db.airline.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, iataCode: true },
    })
  },
}
