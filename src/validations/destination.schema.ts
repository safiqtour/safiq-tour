import { z } from "zod"

export const createDestinationSchema = z.object({
  name: z.string().min(1, "Nama destinasi wajib diisi").max(100),
  description: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  featuredImage: z.string().optional(),
  sortOrder: z.coerce.number().int().min(0).optional(),
  destinationTypeId: z.string().uuid().optional().or(z.literal("")),
  countryId: z.string().uuid("Country wajib dipilih"),
  regionId: z.string().uuid().optional().or(z.literal("")),
  cityId: z.string().uuid("City wajib dipilih"),
})

export const updateDestinationSchema = createDestinationSchema.partial()

export const destinationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  isActive: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
  countryId: z.string().optional(),
  regionId: z.string().optional(),
  cityId: z.string().optional(),
  destinationTypeId: z.string().optional(),
})

export type CreateDestinationInput = z.infer<typeof createDestinationSchema>
export type UpdateDestinationInput = z.infer<typeof updateDestinationSchema>
