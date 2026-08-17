export interface Article {
  slug: string
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  category: string
  image?: string
}

import { getPublishedArticles } from "@/modules/public/articles"

export async function getArticles(): Promise<Article[]> {
  const items = await getPublishedArticles()
  return items.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    content: a.content,
    date: a.publishDate.toISOString(),
    author: a.author,
    category: a.category,
    image: a.featuredImage || undefined,
  }))
}
