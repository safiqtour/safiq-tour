export interface BlogArticle {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: BlogCategory
  author: string
  publishDate: string
  readTime: number
  tags: string[]
  featured: boolean
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
}

export type BlogCategory =
  | "Edukasi Umroh"
  | "Tips Perjalanan"
  | "Sejarah Islam"
  | "Dokumentasi Jamaah"
  | "Informasi Safiq Tour"

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Edukasi Umroh",
  "Tips Perjalanan",
  "Sejarah Islam",
  "Dokumentasi Jamaah",
  "Informasi Safiq Tour",
]

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  "Edukasi Umroh": "bg-blue-100 text-blue-800",
  "Tips Perjalanan": "bg-amber-100 text-amber-800",
  "Sejarah Islam": "bg-emerald-100 text-emerald-800",
  "Dokumentasi Jamaah": "bg-purple-100 text-purple-800",
  "Informasi Safiq Tour": "bg-rose-100 text-rose-800",
}
