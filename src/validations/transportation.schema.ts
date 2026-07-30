import { z } from "zod"

export const createTransportationSchema = z.object({
  name: z.string().min(1, "Nama transportasi wajib diisi").max(200),
  type: z.enum(["BUS", "HIACE", "COASTER", "SUV", "SEDAN", "TRAIN", "SHIP"]).default("BUS"),
  capacity: z.coerce.number().int().min(0).default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
  description: z.string().optional().default(""),
  mediaId: z.string().optional().nullable(),
})

export const updateTransportationSchema = createTransportationSchema.partial()

export const transportationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  type: z.string().optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateTransportationInput = z.infer<typeof createTransportationSchema>
export type UpdateTransportationInput = z.infer<typeof updateTransportationSchema>
