"use server"

import { revalidatePath } from "next/cache"

import { getWritableSession } from "@/services/auth.integration.service"
import { articleService } from "@/services/article.service"
import { can } from "@/services/authorization.service"
import {
  createArticleSchema,
  updateArticleSchema,
  articleQuerySchema,
} from "@/validations/article.schema"

export async function getArticles(params: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "cms:read")) throw new Error("Forbidden")
  const query = articleQuerySchema.parse(params ?? {})
  return articleService.findAll(query)
}

export async function getArticle(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "cms:read")) throw new Error("Forbidden")
  return articleService.findById(id)
}

export async function createArticle(data: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "cms:create")) throw new Error("Forbidden")
  const parsed = createArticleSchema.parse(data)
  const article = await articleService.create(parsed)
  revalidatePath("/admin/articles")
  revalidatePath("/blog")
  return article
}

export async function updateArticle(id: string, data: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "cms:update")) throw new Error("Forbidden")
  const parsed = updateArticleSchema.parse(data)
  const article = await articleService.update(id, parsed)
  revalidatePath("/admin/articles")
  revalidatePath("/blog")
  revalidatePath(`/blog/${article.slug}`)
  return article
}

export async function deleteArticle(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "cms:delete")) throw new Error("Forbidden")
  await articleService.softDelete(id)
  revalidatePath("/admin/articles")
  revalidatePath("/blog")
}

export async function restoreArticle(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "cms:update")) throw new Error("Forbidden")
  await articleService.restore(id)
  revalidatePath("/admin/articles")
  revalidatePath("/blog")
}
