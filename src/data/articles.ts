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

import { getAllPosts, postToArticle } from "@/lib/mdx"

const allPosts = getAllPosts()

export const articles: Article[] = allPosts.map((p) => ({
  slug: p.slug,
  title: p.frontmatter.title,
  excerpt: p.frontmatter.description,
  content: p.content,
  date: p.frontmatter.date,
  author: p.frontmatter.author,
  category: p.frontmatter.category,
  image: p.frontmatter.featuredImage,
}))

export const blogArticles = allPosts.map(postToArticle)
