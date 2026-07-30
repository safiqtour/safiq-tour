import { BaseRepository } from "@/modules/business/repositories/base.repository"
import { audit } from "@/modules/business/lib/audit"
import slugify from "slugify"

export class BaseService<TRecord, TCreate, TUpdate> {
  constructor(
    protected repository: BaseRepository<TRecord, TCreate, TUpdate>,
    protected resource: string,
  ) {}

  async findAll(params?: Record<string, unknown>) {
    return this.repository.findAll(params)
  }

  async findById(id: string, include?: Record<string, unknown>) {
    return this.repository.findById(id, include)
  }

  async create(data: TCreate) {
    const record = await this.repository.create(data)
    await audit({
      action: "CREATE",
      resource: this.resource,
      resourceId: (record as Record<string, unknown>).id as string,
      metadata: { name: (data as Record<string, unknown>).name },
    })
    return record
  }

  async update(id: string, data: TUpdate) {
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error(`${this.resource} not found`)

    const updateData = { ...data } as Record<string, unknown>
    const name = (data as Record<string, unknown>).name as string | undefined
    if (name && name !== (existing as Record<string, unknown>).name) {
      updateData.slug = slugify(name, { lower: true, strict: true })
    }

    const record = await this.repository.update(id, updateData as TUpdate)
    await audit({
      action: "UPDATE",
      resource: this.resource,
      resourceId: id,
      metadata: { name: (record as Record<string, unknown>).name },
    })
    return record
  }

  async softDelete(id: string) {
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error(`${this.resource} not found`)
    await this.repository.softDelete(id)
    await audit({
      action: "DELETE",
      resource: this.resource,
      resourceId: id,
      metadata: { name: (existing as Record<string, unknown>).name },
    })
  }

  async restore(id: string) {
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error(`${this.resource} not found`)
    await this.repository.restore(id)
    await audit({
      action: "RESTORE",
      resource: this.resource,
      resourceId: id,
      metadata: { name: (existing as Record<string, unknown>).name },
    })
  }
}
