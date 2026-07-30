import { z } from "zod"

export const createAirlineSchema = z.object({
  name: z.string().min(1, "Nama maskapai wajib diisi").max(200),
  iataCode: z.string().length(2, "Kode IATA harus 2 karakter").toUpperCase().optional().nullable(),
  icaoCode: z.string().length(3, "Kode ICAO harus 3 karakter").toUpperCase().optional().nullable(),
  countryId: z.string().optional().nullable(),
  logoMediaId: z.string().optional().nullable(),
  website: z.string().optional().default(""),
  callCenter: z.string().optional().default(""),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updateAirlineSchema = createAirlineSchema.partial()

export const airlineQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateAirlineInput = z.infer<typeof createAirlineSchema>
export type UpdateAirlineInput = z.infer<typeof updateAirlineSchema>
