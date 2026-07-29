import fs from "fs"
import path from "path"
import matter from "gray-matter"
import type { BlogArticle, BlogCategory } from "./blog/types"

export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  author: string
  category: BlogCategory
  featured: boolean
  featuredImage: string
  readTime: number
  tags: string[]
  keywords: string[]
}

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
}

const contentDir = path.join(process.cwd(), "content", "blog")

export function getAllPosts(): BlogPost[] {
  const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx"))
  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "")
    const raw = fs.readFileSync(path.join(contentDir, file), "utf-8")
    const { data, content } = matter(raw)
    return { slug, frontmatter: data as BlogFrontmatter, content }
  })
  return posts.sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const filePath = path.join(contentDir, `${slug}.mdx`)
    if (!fs.existsSync(filePath)) return null
    const raw = fs.readFileSync(filePath, "utf-8")
    const { data, content } = matter(raw)
    return { slug, frontmatter: data as BlogFrontmatter, content }
  } catch {
    return null
  }
}

export function getAllSlugs(): string[] {
  return fs.readdirSync(contentDir).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""))
}

export function getRelatedPosts(current: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter(
      (p) =>
        p.slug !== current.slug &&
        (p.frontmatter.category === current.frontmatter.category ||
          p.frontmatter.tags.some((t) => current.frontmatter.tags.includes(t))),
    )
    .slice(0, limit)
}

export function getFeaturedPost(): BlogPost | null {
  return getAllPosts().find((p) => p.frontmatter.featured) ?? null
}

export function postToArticle(post: BlogPost): BlogArticle {
  return {
    id: post.slug,
    slug: post.slug,
    title: post.frontmatter.title,
    excerpt: post.frontmatter.description,
    content: post.content,
    featuredImage: post.frontmatter.featuredImage,
    category: post.frontmatter.category,
    author: post.frontmatter.author,
    publishDate: post.frontmatter.date,
    readTime: post.frontmatter.readTime,
    tags: post.frontmatter.tags,
    featured: post.frontmatter.featured,
    seo: {
      metaTitle: post.frontmatter.title + " | Safiq Tour",
      metaDescription: post.frontmatter.description,
      keywords: post.frontmatter.keywords,
    },
  }
}

export function postsToArticles(posts: BlogPost[]): BlogArticle[] {
  return posts.map(postToArticle)
}
