import type { Prisma } from "@prisma/client"

/**
 * Structural view of a generated Prisma model delegate built from the model's
 * own types. Using `Prisma.Args` / `Prisma.Result` lets a native delegate
 * (e.g. `db.customer`) bind with full type-safety and without `as never` /
 * `as unknown` casts.
 */
type ModelDelegate<TDelegate> = {
  findMany: (args: Prisma.Args<TDelegate, "findMany">) => Promise<Prisma.Result<TDelegate, Prisma.Args<TDelegate, "findMany">, "findMany">>
  findUnique: (args: Prisma.Args<TDelegate, "findUnique">) => Promise<Prisma.Result<TDelegate, Prisma.Args<TDelegate, "findUnique">, "findUnique"> | null>
  findFirst: (args: Prisma.Args<TDelegate, "findFirst">) => Promise<Prisma.Result<TDelegate, Prisma.Args<TDelegate, "findFirst">, "findFirst"> | null>
  create: (args: Prisma.Args<TDelegate, "create">) => Promise<Prisma.Result<TDelegate, Prisma.Args<TDelegate, "create">, "create">>
  update: (args: Prisma.Args<TDelegate, "update">) => Promise<Prisma.Result<TDelegate, Prisma.Args<TDelegate, "update">, "update">>
  delete: (args: Prisma.Args<TDelegate, "delete">) => Promise<Prisma.Result<TDelegate, Prisma.Args<TDelegate, "delete">, "delete">>
  count: (args: Prisma.Args<TDelegate, "count">) => Promise<number>
}

export class BaseRepository<
  TRecord,
  TCreate = Record<string, unknown>,
  TUpdate = Record<string, unknown>,
  TDelegate = any,
> {
  constructor(
    protected delegate: ModelDelegate<TDelegate>,
    protected config?: {
      searchFields?: string[]
    },
  ) {}

  async findById(id: string, include?: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findUnique({
      where: { id },
      ...(include ? { include } : {}),
    } as Prisma.Args<TDelegate, "findUnique">) as Promise<TRecord | null>
  }

  async findBySlug(slug: string, include?: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findUnique({
      where: { slug },
      ...(include ? { include } : {}),
    } as Prisma.Args<TDelegate, "findUnique">) as Promise<TRecord | null>
  }

  async findByCode(code: string, include?: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findUnique({
      where: { code },
      ...(include ? { include } : {}),
    } as Prisma.Args<TDelegate, "findUnique">) as Promise<TRecord | null>
  }

  async findFirst(where: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findFirst({ where } as Prisma.Args<TDelegate, "findFirst">) as Promise<TRecord | null>
  }

  async create(data: TCreate, include?: Record<string, unknown>): Promise<TRecord> {
    return this.delegate.create({
      data: data as Record<string, unknown>,
      ...(include ? { include } : {}),
    } as Prisma.Args<TDelegate, "create">) as Promise<TRecord>
  }

  async update(id: string, data: TUpdate, include?: Record<string, unknown>): Promise<TRecord> {
    return this.delegate.update({
      where: { id },
      data: data as Record<string, unknown>,
      ...(include ? { include } : {}),
    } as Prisma.Args<TDelegate, "update">) as Promise<TRecord>
  }

  async softDelete(id: string): Promise<TRecord> {
    return this.delegate.update({
      where: { id },
      data: { deletedAt: new Date() },
    } as Prisma.Args<TDelegate, "update">) as Promise<TRecord>
  }

  async restore(id: string): Promise<TRecord> {
    return this.delegate.update({
      where: { id },
      data: { deletedAt: null },
    } as Prisma.Args<TDelegate, "update">) as Promise<TRecord>
  }

  async hardDelete(id: string): Promise<TRecord> {
    return this.delegate.delete({ where: { id } } as Prisma.Args<TDelegate, "delete">) as Promise<TRecord>
  }

  async findAll(params?: {
    where?: Record<string, unknown>
    search?: string
    page?: number
    limit?: number
    sort?: string
    order?: "asc" | "desc"
    includeDeleted?: boolean
    include?: Record<string, unknown>
    status?: string
  }): Promise<{
    data: TRecord[]
    pagination: { page: number; limit: number; total: number; totalPages: number }
  }> {
    const {
      search,
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      includeDeleted,
      include,
      status,
      where: extraWhere,
    } = params ?? {}

    const skip = (page - 1) * limit
    const where: Record<string, unknown> = { ...extraWhere }

    if (!includeDeleted) where.deletedAt = null
    if (status) where.status = status
    if (search && this.config?.searchFields?.length) {
      where.OR = this.config.searchFields.map((field) => ({
        [field]: { contains: search },
      }))
    }

    const [data, total] = await Promise.all([
      this.delegate.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sort]: order },
        ...(include ? { include } : {}),
      } as Prisma.Args<TDelegate, "findMany">) as Promise<TRecord[]>,
      this.delegate.count({ where } as Prisma.Args<TDelegate, "count">),
    ])

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }
}

