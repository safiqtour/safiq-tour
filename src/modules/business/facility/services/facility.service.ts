import { BaseService } from "../../services/base.service"
import { facilityRepository } from "../repositories/facility.repository"
import { audit } from "../../lib/audit"
import type { FacilityListItem } from "../types"
import slugify from "slugify"

export class FacilityService extends BaseService<
  FacilityListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(facilityRepository, "master.facility")
  }

  /**
   * Lowercase slash-friendly code/slug derived from a facility name.
   * Example: "Makan Saur" => "makan-saur"
   */
  private toSlug(value: string): string {
    return slugify(value, { lower: true, strict: true })
  }

  /**
   * Returns a slug/code that is free in BOTH the `slug` and `code` unique
   * columns, appending a numeric suffix for duplicates.
   */
  private async freeSlugAndCode(base: string): Promise<{ slug: string; code: string }> {
    let candidate = base || "facility"
    let n = 2
    while (true) {
      const bySlug = await this.repository.findBySlug(candidate)
      const byCode = await this.repository.findByCode(candidate)
      if (!bySlug && !byCode) break
      candidate = `${base}-${n}`
      n += 1
    }
    return { slug: candidate, code: candidate }
  }

  /**
   * Generate `code` (and `slug`) from the name since neither is provided by
   * the UI and both are required unique columns on the Facility model.
   */
  async create(data: Record<string, unknown>) {
    const name = ((data.name as string) ?? "").trim()
    const { slug, code } = await this.freeSlugAndCode(this.toSlug(name))
    return super.create({ ...data, slug, code })
  }

  /**
   * Regenerate `code` (and keep `slug` in sync) only when the name changes and
   * no explicit code was supplied. Otherwise preserve the existing code/slug.
   */
  async update(id: string, data: Record<string, unknown>) {
    const existing = await this.repository.findById(id)
    if (!existing) throw new Error("master.facility not found")

    const old = existing as unknown as FacilityListItem
    const name = ((data.name as string) ?? "").trim()
    const incomingCode = (data.code as string)?.trim()

    const updateData: Record<string, unknown> = { ...data }

    if (name && name !== old.name) {
      const { slug, code } = await this.freeSlugAndCode(this.toSlug(name))
      updateData.slug = slug
      updateData.code = incomingCode || code
    } else {
      // Preserve existing slug/code; only backfill a missing code from the name.
      updateData.slug = old.slug
      updateData.code = incomingCode || old.code || (name ? this.toSlug(name) : old.code)
    }

    const record = await this.repository.update(id, updateData)
    await audit({
      action: "UPDATE",
      resource: this.resource,
      resourceId: id,
      metadata: { name: record.name },
    })
    return record
  }
}

export const facilityService = new FacilityService()
