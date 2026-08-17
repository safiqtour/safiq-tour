import { z } from "zod"

export const createTagSchema = z.object({
  name: z.string().min(1, "Nama tag wajib diisi").max(200),
  shortName: z.string().min(1, "Nama pendek wajib diisi").max(20),
  description: z.string().optional().default(""),
  color: z.string().optional().default("blue"),
  icon: z.string().optional().default("Tag"),
  displayOrder: z.coerce.number().int().min(0, "Urutan tampil minimal 0").default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updateTagSchema = createTagSchema.partial()

export const tagQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateTagInput = z.infer<typeof createTagSchema>
export type UpdateTagInput = z.infer<typeof updateTagSchema>
export type TagQueryInput = z.infer<typeof tagQuerySchema>
