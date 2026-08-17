import { mediaRepository } from "@/repositories/media.repository"
import { mediaFolderRepository } from "@/repositories/media-folder.repository"
import { mediaTagRepository } from "@/repositories/media-tag.repository"
import { logActivity } from "@/services/audit.service"
import { storageService } from "@/services/storage.service"
import slugify from "slugify"

export const mediaService = {
  async findAll(params: Parameters<typeof mediaRepository.findAll>[0]) {
    return mediaRepository.findAll(params)
  },

  async findById(id: string) {
    return mediaRepository.findById(id)
  },

  async upload(file: File, folderId?: string, caption?: string) {
    const ext = file.name.split(".").pop() ?? ""
    const baseName = file.name.replace(/\.[^.]+$/, "")
    const storagePath = `${folderId ?? "root"}/${Date.now()}_${slugify(baseName, { lower: true, strict: true })}`
    const result = await storageService.upload(file, storagePath)

    const media = await mediaRepository.create({
      filename: file.name,
      originalName: file.name,
      extension: ext,
      mimeType: file.type,
      size: file.size,
      width: result.width,
      height: result.height,
      url: result.url,
      thumbnailUrl: result.thumbnailUrl,
      storageProvider: process.env.STORAGE_PROVIDER ?? "local",
      storagePath: result.storagePath,
      caption: caption ?? "",
      folder: folderId ? { connect: { id: folderId } } : undefined,
    })

    await logActivity({
      action: "CREATE",
      resource: "media",
      resourceId: media.id,
      metadata: { filename: file.name, size: file.size, mimeType: file.type },
    })

    return media
  },

  async update(id: string, data: { alt?: string; caption?: string; description?: string; folderId?: string | null }) {
    const existing = await mediaRepository.findById(id)
    if (!existing) throw new Error("Media not found")

    const updateData: Record<string, unknown> = {}
    if (data.alt !== undefined) updateData.alt = data.alt
    if (data.caption !== undefined) updateData.caption = data.caption
    if (data.description !== undefined) updateData.description = data.description
    if (data.folderId !== undefined) {
      updateData.folder = data.folderId ? { connect: { id: data.folderId } } : { disconnect: true }
    }

    const media = await mediaRepository.update(id, updateData)

    await logActivity({
      action: "UPDATE",
      resource: "media",
      resourceId: id,
      metadata: { filename: media.filename },
    })

    return media
  },

  async softDelete(id: string) {
    const media = await mediaRepository.findById(id)
    if (!media) throw new Error("Media not found")
    await mediaRepository.softDelete(id)
    await logActivity({
      action: "DELETE",
      resource: "media",
      resourceId: id,
      metadata: { filename: media.filename },
    })
  },

  async restore(id: string) {
    const media = await mediaRepository.findById(id)
    if (!media) throw new Error("Media not found")
    await mediaRepository.restore(id)
    await logActivity({
      action: "APPROVE",
      resource: "media",
      resourceId: id,
      metadata: { filename: media.filename },
    })
  },

  async hardDelete(id: string) {
    const media = await mediaRepository.findById(id)
    if (!media) throw new Error("Media not found")
    await storageService.delete(media.storagePath)
    await mediaRepository.hardDelete(id)
  },

  async addTag(mediaId: string, tagName: string) {
    const slug = slugify(tagName, { lower: true, strict: true })
    let tag = await mediaTagRepository.findBySlug(slug)
    if (!tag) {
      tag = await mediaTagRepository.create({ name: tagName, slug })
    }
    await mediaTagRepository.addTagToMedia(mediaId, tag.id)
  },

  async removeTag(mediaId: string, tagId: string) {
    await mediaTagRepository.removeTagFromMedia(mediaId, tagId)
  },

  async getAllFolders() {
    return mediaFolderRepository.findAll()
  },

  async getFolderTree() {
    return mediaFolderRepository.getTree()
  },

  async createFolder(name: string, parentId?: string) {
    const slug = slugify(name, { lower: true, strict: true })
    const existing = await mediaFolderRepository.findBySlug(slug, parentId)
    if (existing) throw new Error("Folder already exists in this location")
    const folder = await mediaFolderRepository.create({
      name,
      slug,
      parent: parentId ? { connect: { id: parentId } } : undefined,
    })
    await logActivity({
      action: "CREATE",
      resource: "media",
      resourceId: folder.id,
      metadata: { name, type: "folder" },
    })
    return folder
  },

  async renameFolder(id: string, name: string) {
    const slug = slugify(name, { lower: true, strict: true })
    const folder = await mediaFolderRepository.update(id, { name, slug })
    return folder
  },

  async deleteFolder(id: string) {
    const folder = await mediaFolderRepository.findById(id)
    if (!folder) throw new Error("Folder not found")
    if ((folder._count?.media ?? 0) > 0) {
      throw new Error("Folder is not empty. Move or delete files first.")
    }
    await mediaFolderRepository.delete(id)
  },
}
