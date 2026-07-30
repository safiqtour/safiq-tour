"use server"

import { auth } from "@/lib/auth/auth"
import { mediaService } from "@/services/media.service"
import { hasPermission } from "@/services/auth.service"
import { mediaQuerySchema, updateMediaSchema } from "@/validations/media.schema"

export async function getMediaList(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "media:read")
  if (!canView) throw new Error("Forbidden")

  const query = mediaQuerySchema.parse(params)
  return mediaService.findAll(query)
}

export async function getMedia(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "media:read")
  if (!canView) throw new Error("Forbidden")

  return mediaService.findById(id)
}

export async function updateMedia(id: string, data: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "media:update")
  if (!canUpdate) throw new Error("Forbidden")

  const parsed = updateMediaSchema.parse(data)
  return mediaService.update(id, parsed)
}

export async function deleteMedia(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = hasPermission(session.user.role, "media:delete")
  if (!canDelete) throw new Error("Forbidden")

  await mediaService.softDelete(id)
}

export async function restoreMedia(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "media:update")
  if (!canUpdate) throw new Error("Forbidden")

  await mediaService.restore(id)
}

export async function hardDeleteMedia(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = hasPermission(session.user.role, "media:delete")
  if (!canDelete) throw new Error("Forbidden")

  await mediaService.hardDelete(id)
}

export async function addMediaTag(mediaId: string, tagName: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "media:update")
  if (!canUpdate) throw new Error("Forbidden")

  await mediaService.addTag(mediaId, tagName)
}

export async function removeMediaTag(mediaId: string, tagId: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = hasPermission(session.user.role, "media:update")
  if (!canUpdate) throw new Error("Forbidden")

  await mediaService.removeTag(mediaId, tagId)
}

export async function getFolderTree() {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "media:read")
  if (!canView) throw new Error("Forbidden")

  return mediaService.getFolderTree()
}

export async function getAllFolders() {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canView = hasPermission(session.user.role, "media:read")
  if (!canView) throw new Error("Forbidden")

  return mediaService.getAllFolders()
}
