import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export const mediaTagRepository = {
  async findAll() {
    return db.mediaTag.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { media: true } } },
    })
  },

  async findById(id: string) {
    return db.mediaTag.findUnique({ where: { id } })
  },

  async findBySlug(slug: string) {
    return db.mediaTag.findUnique({ where: { slug } })
  },

  async create(data: Prisma.MediaTagCreateInput) {
    return db.mediaTag.create({ data })
  },

  async delete(id: string) {
    return db.mediaTag.delete({ where: { id } })
  },

  async addTagToMedia(mediaId: string, tagId: string) {
    return db.mediaTagOnMedia.create({ data: { mediaId, tagId } })
  },

  async removeTagFromMedia(mediaId: string, tagId: string) {
    return db.mediaTagOnMedia.deleteMany({ where: { mediaId, tagId } })
  },
}
