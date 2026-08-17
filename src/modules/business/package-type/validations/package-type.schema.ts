import { z } from "zod"

export const createPackageTypeSchema = z.object({
  name: z.string().min(1, "Nama tipe paket wajib diisi").max(200),
  shortName: z.string().min(1, "Nama pendek wajib diisi").max(20),
  description: z.string().optional().default(""),
  defaultDurationDays: z.coerce.number().int().min(0, "Durasi minimal 0").default(0),
  defaultVisaId: z.string().optional().nullable().default(null),
  defaultCategoryId: z.string().optional().nullable().default(null),
  icon: z.string().optional().default("Plane"),
  color: z.string().optional().default("blue"),
  displayOrder: z.coerce.number().int().min(0, "Urutan tampil minimal 0").default(0),
  isFeatured: z.coerce.boolean().optional().default(false),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updatePackageTypeSchema = createPackageTypeSchema.partial()

export const packageTypeQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreatePackageTypeInput = z.infer<typeof createPackageTypeSchema>
export type UpdatePackageTypeInput = z.infer<typeof updatePackageTypeSchema>
export type PackageTypeQueryInput = z.infer<typeof packageTypeQuerySchema>
