import { db } from "@/lib/prisma/db"

/**
 * Public (front-end) read access to CMS-managed blog Articles. Seeded from the
 * former `content/blog/*.mdx` files; only PUBLISHED (and not soft-deleted)
 * articles are exposed. The shape mirrors the old MDX pipeline so upstream
 * consumers (blog pages, sitemap, feed) can map directly to `BlogPost`.
 */

export interface DbArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  featuredImage: string
  publishDate: Date
  readTime: number
  tags: string[]
  keywords: string[]
  featured: boolean
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v))
  return []
}

function toDbArticle(row: {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  featuredImage: string
  publishDate: Date
  readTime: number
  tags: unknown
  keywords: unknown
  featured: boolean
}): DbArticle {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: row.category,
    author: row.author,
    featuredImage: row.featuredImage,
    publishDate: row.publishDate,
    readTime: row.readTime,
    tags: asStringArray(row.tags),
    keywords: asStringArray(row.keywords),
    featured: row.featured,
  }
}

export async function getPublishedArticles(): Promise<DbArticle[]> {
  const rows = await db.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    orderBy: { publishDate: "desc" },
  })
  return rows.map(toDbArticle)
}

export async function getArticleBySlug(slug: string): Promise<DbArticle | null> {
  const row = await db.article.findUnique({
    where: { slug },
  })
  if (!row || row.status !== "PUBLISHED" || row.deletedAt) return null
  return toDbArticle(row)
}

export async function getAllArticleSlugs(): Promise<string[]> {
  const rows = await db.article.findMany({
    where: { status: "PUBLISHED", deletedAt: null },
    select: { slug: true },
  })
  return rows.map((r) => r.slug)
}
