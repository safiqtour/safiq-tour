"use server"

import { getWritableSession } from "@/services/auth.integration.service"
import { mediaService } from "@/services/media.service"
import { can } from "@/services/authorization.service"
import { createFolderSchema, renameFolderSchema } from "@/validations/media.schema"

export async function createMediaFolder(data: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canCreate = can(session.user.role, "media:create")
  if (!canCreate) throw new Error("Forbidden")

  const parsed = createFolderSchema.parse(data)
  return mediaService.createFolder(parsed.name, parsed.parentId ?? undefined)
}

export async function renameMediaFolder(id: string, data: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canUpdate = can(session.user.role, "media:update")
  if (!canUpdate) throw new Error("Forbidden")

  const parsed = renameFolderSchema.parse(data)
  return mediaService.renameFolder(id, parsed.name)
}

export async function deleteMediaFolder(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")

  const canDelete = can(session.user.role, "media:delete")
  if (!canDelete) throw new Error("Forbidden")

  await mediaService.deleteFolder(id)
}
