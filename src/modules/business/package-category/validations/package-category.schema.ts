import { z } from "zod"

export const createPackageCategorySchema = z.object({
  name: z.string().min(1, "Nama kategori wajib diisi").max(200),
  shortName: z.string().min(1, "Nama pendek wajib diisi").max(20),
  description: z.string().optional().default(""),
  displayOrder: z.coerce.number().int().min(0, "Urutan tampil minimal 0").default(0),
  icon: z.string().optional().default("LayoutGrid"),
  color: z.string().optional().default("blue"),
  isFeatured: z.coerce.boolean().optional().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updatePackageCategorySchema = createPackageCategorySchema.partial()

export const packageCategoryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreatePackageCategoryInput = z.infer<typeof createPackageCategorySchema>
export type UpdatePackageCategoryInput = z.infer<typeof updatePackageCategorySchema>
export type PackageCategoryQueryInput = z.infer<typeof packageCategoryQuerySchema>
