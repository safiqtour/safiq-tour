import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export const mediaFolderRepository = {
  async findAll() {
    return db.mediaFolder.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { media: true, children: true } } },
    })
  },

  async findById(id: string) {
    return db.mediaFolder.findUnique({
      where: { id },
      include: {
        _count: { select: { media: true, children: true } },
        children: { orderBy: { sortOrder: "asc" } },
      },
    })
  },

  async findBySlug(slug: string, parentId?: string | null) {
    return db.mediaFolder.findFirst({
      where: parentId ? { slug, parentId } : { slug, parentId: null },
    })
  },

  async create(data: Prisma.MediaFolderCreateInput) {
    return db.mediaFolder.create({ data })
  },

  async update(id: string, data: Prisma.MediaFolderUpdateInput) {
    return db.mediaFolder.update({ where: { id }, data })
  },

  async delete(id: string) {
    return db.mediaFolder.delete({ where: { id } })
  },

  async getTree() {
    const folders = await db.mediaFolder.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { media: true, children: true } },
        children: {
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { media: true } } },
        },
      },
    })
    return folders.filter((f) => f.parentId === null)
  },
}
