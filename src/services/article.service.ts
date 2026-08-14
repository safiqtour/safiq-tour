import { generateArticleSlug } from "@/lib/blog/slug"

import { articleRepository } from "@/repositories/article.repository"
import { logActivity } from "@/services/audit.service"
import type { CreateArticleInput, UpdateArticleInput } from "@/validations/article.schema"

/**
 * Resolve a slug that is unique across articles (including soft-deleted rows,
 * which still hold their unique slug). When `excludeId` is given, that record
 * is ignored so a no-op save stays idempotent; a real collision auto-suffixes
 * the slug (e.g. panduan-persiapan-umroh -> panduan-persiapan-umroh-2).
 */
async function resolveUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let candidate = base
  let n = 2
  while (true) {
    const existing = await articleRepository.findBySlug(candidate)
    if (!existing || (excludeId && existing.id === excludeId)) return candidate
    candidate = `${base}-${n}`
    n += 1
  }
}

export const articleService = {
  async findAll(params: Parameters<typeof articleRepository.findAll>[0]) {
    return articleRepository.findAll(params)
  },

  async findById(id: string) {
    return articleRepository.findById(id)
  },

  async create(data: CreateArticleInput) {
    // Derive a short, SEO-friendly slug from the title, then guarantee uniqueness
    // by auto-suffixing (-2, -3, ...) when another article already holds it.
    const baseSlug = data.slug?.trim() || generateArticleSlug(data.title)
    const slug = await resolveUniqueSlug(baseSlug)

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

    const updateData: Record<string, unknown> = { ...data }

    // Only touch the slug when the client explicitly sent a different value.
    // A locked (absent) slug leaves the existing slug untouched so renaming the
    // title never breaks the published URL. A collision with another article is
    // resolved by auto-suffixing instead of throwing.
    if (data.slug && data.slug !== existing.slug) {
      updateData.slug = await resolveUniqueSlug(data.slug, id)
    }
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
