import { z } from "zod"

export const mediaQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  folderId: z.string().optional(),
  mimeType: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export const updateMediaSchema = z.object({
  alt: z.string().max(255).optional(),
  caption: z.string().max(500).optional(),
  description: z.string().max(2000).optional(),
  folderId: z.string().nullable().optional(),
})

export const createFolderSchema = z.object({
  name: z.string().min(1, "Nama folder wajib diisi").max(100),
  parentId: z.string().nullable().optional(),
})

export const renameFolderSchema = z.object({
  name: z.string().min(1, "Nama folder wajib diisi").max(100),
})

export type MediaQueryInput = z.infer<typeof mediaQuerySchema>
export type UpdateMediaInput = z.infer<typeof updateMediaSchema>
export type CreateFolderInput = z.infer<typeof createFolderSchema>
