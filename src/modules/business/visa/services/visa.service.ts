import slugify from "slugify"
import { BaseService } from "../../services/base.service"
import { visaRepository } from "../repositories/visa.repository"
import { audit } from "../../lib/audit"
import type { VisaListItem } from "../types"

const VISA_CODE_PREFIX = "VIS"

export class VisaService extends BaseService<
  VisaListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(visaRepository, "master.visa")
  }

  async findAll(params?: Record<string, unknown>) {
    return visaRepository.findAllWithCountry(params)
  }

  async findById(id: string) {
    return visaRepository.findByIdWithCountry(id)
  }

  /**
   * Generates a unique `code` (e.g. VIS-001, VIS-002, ...) guaranteed not to
   * collide with existing rows — including soft-deleted ones, which still hold
   * their unique `code` after delete.
   */
  private async generateUniqueCode(): Promise<string> {
    let n = 1
    while (true) {
      const code = `${VISA_CODE_PREFIX}-${String(n).padStart(3, "0")}`
      const existing = await visaRepository.findByCode(code)
      if (!existing) return code
      n += 1
    }
  }

  /**
   * Generates a unique slug derived from the name (e.g. visa-name,
   * visa-name-2, visa-name-3, ...), optionally excluding the record currently
   * being edited so a same-slug rename stays idempotent.
   */
  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = slugify(name, { lower: true, strict: true })
    let candidate = base
    let n = 2
    while (true) {
      const existing = await visaRepository.findBySlug(candidate)
      if (!existing || existing.id === excludeId) return candidate
      candidate = `${base}-${n}`
      n += 1
    }
  }

  /**
   * Generate `code` (VIS-001, ...) and a unique `slug` from the name since
   * neither is sent by the UI and both are required unique columns on Visa.
   */
  async create(data: Record<string, unknown>) {
    const name = data.name as string
    const code = await this.generateUniqueCode()
    const slug = await this.generateUniqueSlug(name)

    return super.create({ ...data, code, slug } as Record<string, unknown>)
  }

  /**
   * Keep the existing `code` stable; re-derive a unique `slug` only when the
   * name changes (excluding this record). The `countryId` relation is preserved
   * as a valid scalar in `data`.
   */
  async update(id: string, data: Record<string, unknown>) {
    const existing = await visaRepository.findById(id)
    if (!existing) throw new Error(`${this.resource} not found`)
    const old = existing as unknown as VisaListItem

    const name = (data.name as string | undefined)?.trim()

    const updateData: Record<string, unknown> = { ...data }
    updateData.slug = name && name !== old.name
      ? await this.generateUniqueSlug(name, id)
      : old.slug

    const record = await visaRepository.update(id, updateData)
    await audit({
      action: "UPDATE",
      resource: this.resource,
      resourceId: id,
      metadata: { name: record.name },
    })
    return record
  }
}

export const visaService = new VisaService()
