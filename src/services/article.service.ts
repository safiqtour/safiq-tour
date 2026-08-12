import slugify from "slugify"

import { articleRepository } from "@/repositories/article.repository"
import { logActivity } from "@/services/audit.service"
import type { CreateArticleInput, UpdateArticleInput } from "@/validations/article.schema"

export const articleService = {
  async findAll(params: Parameters<typeof articleRepository.findAll>[0]) {
    return articleRepository.findAll(params)
  },

  async findById(id: string) {
    return articleRepository.findById(id)
  },

  async create(data: CreateArticleInput) {
    const slug = data.slug?.trim() || slugify(data.title, { lower: true, strict: true })

    const existing = await articleRepository.findBySlug(slug)
    if (existing) throw new Error(`Artikel dengan slug "${slug}" sudah ada`)

    const article = await articleRepository.create({
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      category: data.category,
      author: data.author,
      featuredImage: data.featuredImage,
      publishDate: data.publishDate ?? new Date(),
      readTime: data.readTime,
      tags: data.tags,
      keywords: data.keywords,
      featured: data.featured,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      status: data.status,
      // Stamp the publish moment the first time an article goes live.
      publishedAt:
        data.status === "PUBLISHED"
          ? (data.publishedAt ?? new Date())
          : (data.publishedAt ?? null),
    })
    await logActivity({
      action: "CREATE",
      resource: "cms.article",
      resourceId: article.id,
      metadata: { title: article.title },
    })
    return article
  },

  async update(id: string, data: UpdateArticleInput) {
    const existing = await articleRepository.findById(id)
    if (!existing) throw new Error("Artikel tidak ditemukan")

    // Guard slug uniqueness when the client moves it to a different value.
    if (data.slug && data.slug !== existing.slug) {
      const taken = await articleRepository.findBySlug(data.slug)
      if (taken && taken.id !== id) {
        throw new Error(`Slug "${data.slug}" sudah digunakan artikel lain`)
      }
    }

    const updateData: Record<string, unknown> = { ...data }
    // Auto-stamp publishedAt on the first transition into PUBLISHED.
    if (
      data.status === "PUBLISHED" &&
      existing.status !== "PUBLISHED" &&
      !existing.publishedAt &&
      !data.publishedAt
    ) {
      updateData.publishedAt = new Date()
    }

    const article = await articleRepository.update(id, updateData as never)
    await logActivity({
      action: "UPDATE",
      resource: "cms.article",
      resourceId: id,
      metadata: { title: article.title },
    })
    return article
  },

  async softDelete(id: string) {
    const article = await articleRepository.findById(id)
    if (!article) throw new Error("Artikel tidak ditemukan")
    await articleRepository.softDelete(id)
    await logActivity({
      action: "DELETE",
      resource: "cms.article",
      resourceId: id,
      metadata: { title: article.title },
    })
  },

  async restore(id: string) {
    const article = await articleRepository.findById(id)
    if (!article) throw new Error("Artikel tidak ditemukan")
    await articleRepository.restore(id)
    await logActivity({
      action: "RESTORE",
      resource: "cms.article",
      resourceId: id,
      metadata: { title: article.title },
    })
  },
}
