type PrismaDelegate = {
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>
  findFirst: (args: Record<string, unknown>) => Promise<unknown | null>
  create: (args: Record<string, unknown>) => Promise<unknown>
  update: (args: Record<string, unknown>) => Promise<unknown>
  delete: (args: Record<string, unknown>) => Promise<unknown>
  count: (args: Record<string, unknown>) => Promise<number>
}

export class BaseRepository<TRecord, TCreate = Record<string, unknown>, TUpdate = Record<string, unknown>> {
  constructor(
    protected delegate: PrismaDelegate,
    protected config?: {
      searchFields?: string[]
    },
  ) {}

  async findById(id: string, include?: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findUnique({ where: { id }, include }) as Promise<TRecord | null>
  }

  async findBySlug(slug: string, include?: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findUnique({ where: { slug }, include }) as Promise<TRecord | null>
  }

  async findByCode(code: string, include?: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findUnique({ where: { code }, include }) as Promise<TRecord | null>
  }

  async findFirst(where: Record<string, unknown>): Promise<TRecord | null> {
    return this.delegate.findFirst({ where }) as Promise<TRecord | null>
  }

  async create(data: TCreate, include?: Record<string, unknown>): Promise<TRecord> {
    return this.delegate.create({ data: data as Record<string, unknown>, include }) as Promise<TRecord>
  }

  async update(id: string, data: TUpdate, include?: Record<string, unknown>): Promise<TRecord> {
    return this.delegate.update({
      where: { id },
      data: data as Record<string, unknown>,
      include,
    }) as Promise<TRecord>
  }

  async softDelete(id: string): Promise<TRecord> {
    return this.delegate.update({
      where: { id },
      data: { deletedAt: new Date() },
    }) as Promise<TRecord>
  }

  async restore(id: string): Promise<TRecord> {
    return this.delegate.update({
      where: { id },
      data: { deletedAt: null },
    }) as Promise<TRecord>
  }

  async hardDelete(id: string): Promise<TRecord> {
    return this.delegate.delete({ where: { id } }) as Promise<TRecord>
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
        include,
      }) as Promise<TRecord[]>,
      this.delegate.count({ where }),
    ])

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }
}
