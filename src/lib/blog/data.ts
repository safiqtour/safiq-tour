import { getAllPosts, postToArticle } from "@/lib/mdx"
import type { BlogArticle, BlogCategory, BLOG_CATEGORIES, CATEGORY_COLORS } from "./types"

const allPosts = getAllPosts()

export const blogArticles: BlogArticle[] = allPosts.map(postToArticle)

export { type BlogArticle, type BlogCategory, BLOG_CATEGORIES, CATEGORY_COLORS }
