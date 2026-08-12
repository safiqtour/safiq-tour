import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"

export type ArticleFindAllParams = {
  search?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
  status?: string
  category?: string
  featured?: boolean
  includeDeleted?: boolean
}

export const articleRepository = {
  async findAll(params: ArticleFindAllParams = {}) {
    const {
      search,
      page = 1,
      limit = 10,
      sort = "publishDate",
      order = "desc",
      status,
      category,
      featured,
      includeDeleted,
    } = params
    const skip = (page - 1) * limit

    const where: Prisma.ArticleWhereInput = {}
    if (!includeDeleted) where.deletedAt = null
    if (status) where.status = status
    if (category) where.category = category
    if (featured !== undefined) where.featured = featured
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { author: { contains: search } },
      ]
    }

    const [data, total] = await Promise.all([
      db.article.findMany({ where, skip, take: limit, orderBy: { [sort]: order } }),
      db.article.count({ where }),
    ])

    return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }
  },

  async findById(id: string) {
    return db.article.findUnique({ where: { id } })
  },

  async findBySlug(slug: string) {
    return db.article.findUnique({ where: { slug } })
  },

  async create(data: Prisma.ArticleCreateInput) {
    return db.article.create({ data })
  },

  async update(id: string, data: Prisma.ArticleUpdateInput) {
    return db.article.update({ where: { id }, data })
  },

  async softDelete(id: string) {
    return db.article.update({ where: { id }, data: { deletedAt: new Date() } })
  },

  async restore(id: string) {
    return db.article.update({ where: { id }, data: { deletedAt: null } })
  },
}
