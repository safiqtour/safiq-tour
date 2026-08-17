import { z } from "zod"
import { SYMBOL_POSITIONS } from "../types"

export const createCurrencySchema = z.object({
  name: z.string().min(1, "Nama mata uang wajib diisi").max(100),
  isoCode: z.string().length(3, "ISO Code harus 3 karakter").toUpperCase(),
  symbol: z.string().min(1, "Simbol wajib diisi").max(10),
  symbolPosition: z.enum(SYMBOL_POSITIONS).default("PREFIX"),
  decimalDigits: z.coerce.number().int().min(0).max(6).default(2),
  thousandSeparator: z.string().max(1).optional().default(","),
  decimalSeparator: z.string().max(1).optional().default("."),
  exchangeRate: z.coerce.number().min(0).default(1),
  isBaseCurrency: z.coerce.boolean().optional().default(false),
  countryId: z.string().optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).optional().default(0),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
})

export const updateCurrencySchema = createCurrencySchema.partial()

export const currencyQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.string().optional(),
  isBaseCurrency: z.coerce.boolean().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CreateCurrencyInput = z.infer<typeof createCurrencySchema>
export type UpdateCurrencyInput = z.infer<typeof updateCurrencySchema>
export type CurrencyQueryInput = z.infer<typeof currencyQuerySchema>
