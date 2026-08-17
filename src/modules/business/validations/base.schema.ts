import { z } from "zod"

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

export const searchSchema = z.object({
  search: z.string().optional(),
})

export const sortSchema = z.object({
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

export const statusFilterSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export const querySchema = paginationSchema
  .merge(searchSchema)
  .merge(sortSchema)
  .merge(statusFilterSchema)

export type PaginationInput = z.infer<typeof paginationSchema>
export type SearchInput = z.infer<typeof searchSchema>
export type SortInput = z.infer<typeof sortSchema>
export type StatusFilterInput = z.infer<typeof statusFilterSchema>
export type QueryInput = z.infer<typeof querySchema>
