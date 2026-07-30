"use server"

import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/services/auth.service"
import { requirePermission } from "../../lib/permission"
import { tagService } from "../services/tag.service"
import {
  createTagSchema,
  updateTagSchema,
  tagQuerySchema,
} from "../validations/tag.schema"

export async function getTags(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.tag:read")) throw new Error("Forbidden")

  const query = tagQuerySchema.parse(params)
  return tagService.findAll(query as never)
}

export async function getTag(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.tag:read")) throw new Error("Forbidden")

  return tagService.findById(id)
}

export async function createTag(data: unknown) {
  await requirePermission("master.tag:create")

  const parsed = createTagSchema.parse(data)
  return tagService.create(parsed as unknown as Record<string, unknown>)
}

export async function updateTag(id: string, data: unknown) {
  await requirePermission("master.tag:update")

  const parsed = updateTagSchema.parse(data)
  return tagService.update(id, parsed as unknown as Record<string, unknown>)
}

export async function deleteTag(id: string) {
  await requirePermission("master.tag:delete")

  await tagService.softDelete(id)
}

export async function restoreTag(id: string) {
  await requirePermission("master.tag:update")

  await tagService.restore(id)
}
