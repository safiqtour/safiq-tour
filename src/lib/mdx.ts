import type { BlogArticle, BlogCategory } from "./blog/types"
import {
  getArticleBySlug,
  getAllArticleSlugs,
  getPublishedArticles,
  type DbArticle,
} from "@/modules/public/articles"

/**
 * DB-backed blog pipeline.
 *
 * Replaces the former filesystem `content/blog/*.mdx` + gray-matter reads. The
 * public contract (BlogPost / BlogFrontmatter) is preserved so all consumers
 * (blog pages, sitemap, feed, homepage) map to the exact same shape, while the
 * content itself is now CMS-managed in the `articles` table.
 */

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

function toPost(article: DbArticle): BlogPost {
  return {
    slug: article.slug,
    frontmatter: {
      title: article.title,
      description: article.excerpt,
      date: article.publishDate.toISOString(),
      author: article.author,
      category: article.category as BlogCategory,
      featured: article.featured,
      featuredImage: article.featuredImage,
      readTime: article.readTime,
      tags: article.tags,
      keywords: article.keywords,
    },
    content: article.content,
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const articles = await getPublishedArticles()
  return articles.map(toPost)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const article = await getArticleBySlug(slug)
  return article ? toPost(article) : null
}

export async function getAllSlugs(): Promise<string[]> {
  return getAllArticleSlugs()
}

export async function getRelatedPosts(current: BlogPost, limit = 3): Promise<BlogPost[]> {
  const all = await getAllPosts()
  return all
    .filter(
      (p) =>
        p.slug !== current.slug &&
        (p.frontmatter.category === current.frontmatter.category ||
          p.frontmatter.tags.some((t) => current.frontmatter.tags.includes(t))),
    )
    .slice(0, limit)
}

export async function getFeaturedPost(): Promise<BlogPost | null> {
  const all = await getAllPosts()
  return all.find((p) => p.frontmatter.featured) ?? null
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

