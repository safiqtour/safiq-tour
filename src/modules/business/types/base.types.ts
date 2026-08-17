export interface BusinessEntity {
  id: string
  slug: string
  status: string
  sortOrder: number
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface SearchParams {
  search?: string
}

export interface SortParams {
  sort?: string
  order?: "asc" | "desc"
}

export interface QueryParams extends PaginationParams, SearchParams, SortParams {
  status?: string
  includeDeleted?: boolean
}

export interface PaginationResult {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface FindAllResult<T> {
  data: T[]
  pagination: PaginationResult
}

export type BusinessModuleAction = "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "APPROVE" | "REJECT" | "FEATURE" | "UNFEATURE"

export interface BusinessModuleConfig {
  module: string
  codePrefix: string
  permission: string
  auditEntity: string
}
