import { z } from "zod"

export const ARTICLE_STATUSES = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

/**
 * Mirrors the Prisma `Article` model. Defaults intentionally match the model
 * defaults so a parsed payload can be written almost as-is.
 */
export const createArticleSchema = z.object({
  title: z.string().min(1, "Judul artikel wajib diisi").max(200),
  slug: z
    .string()
    .regex(SLUG_REGEX, "Slug hanya boleh huruf kecil, angka, dan tanda hubung")
    .max(200)
    .optional(),
  excerpt: z.string().max(500).optional().default(""),
  content: z.string().optional().default(""),
  category: z.string().max(100).optional().default("Edukasi Umroh"),
  author: z.string().max(100).optional().default(""),
  featuredImage: z.string().optional().default(""),
  publishDate: z.coerce.date().optional(),
  readTime: z.coerce.number().int().min(0).optional().default(0),
  tags: z.array(z.string()).optional().default([]),
  keywords: z.array(z.string()).optional().default([]),
  featured: z.coerce.boolean().optional().default(false),
  metaTitle: z.string().max(200).optional().default(""),
  metaDescription: z.string().max(300).optional().default(""),
  status: z.enum(ARTICLE_STATUSES).optional().default("PUBLISHED"),
  publishedAt: z.coerce.date().optional().nullable(),
})

export const updateArticleSchema = createArticleSchema.partial()

export const articleQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateArticleInput = z.infer<typeof createArticleSchema>
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>
export type ArticleQueryInput = z.infer<typeof articleQuerySchema>
