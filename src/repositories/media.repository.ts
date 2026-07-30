import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export type MediaFindAllParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  folderId?: string
  mimeType?: string
  includeDeleted?: boolean
}

export type MediaFindAllResult = {
  data: Prisma.MediaGetPayload<{
    include: {
      folder: { select: { id: true; name: true } }
      uploadedBy: { select: { id: true; name: true } }
      tags: { include: { tag: { select: { id: true; name: true } } } }
    }
  }>[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

const listInclude = {
  folder: { select: { id: true, name: true } },
  uploadedBy: { select: { id: true, name: true } },
  tags: { include: { tag: { select: { id: true, name: true } } } },
} as const

export const mediaRepository = {
  async findAll(params: MediaFindAllParams = {}): Promise<MediaFindAllResult> {
    const { search, page = 1, limit = 20, sort = "createdAt", order = "desc", folderId, mimeType, includeDeleted } = params
    const skip = (page - 1) * limit

    const where: Prisma.MediaWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (folderId !== undefined) where.folderId = folderId
    if (mimeType) where.mimeType = { startsWith: mimeType }
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { alt: { contains: search } },
        { caption: { contains: search } },
      ]
    }

    const [data, total] = await Promise.all([
      db.media.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        include: listInclude,
      }),
      db.media.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.media.findUnique({
      where: { id },
      include: {
        ...listInclude,
        folder: { select: { id: true, name: true } },
        usage: true,
        _count: { select: { usage: true } },
      },
    })
  },

  async create(data: Prisma.MediaCreateInput) {
    return db.media.create({ data, include: listInclude })
  },

  async update(id: string, data: Prisma.MediaUpdateInput) {
    return db.media.update({ where: { id }, data, include: listInclude })
  },

  async softDelete(id: string) {
    return db.media.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.media.update({ where: { id }, data: { deletedAt: null } })
  },

  async hardDelete(id: string) {
    return db.media.delete({ where: { id } })
  },

  async countByFolder(folderId: string | null) {
    return db.media.count({ where: { folderId: folderId ?? null, deletedAt: null } })
  },
}
