import slugify from "slugify"
import { BaseService } from "../../services/base.service"
import { packageCategoryRepository } from "../repositories/package-category.repository"
import { audit } from "../../lib/audit"
import type { PackageCategoryListItem } from "../types"
import type { BusinessModuleConfig } from "../../types/base.types"

const config: BusinessModuleConfig = {
  module: "package-category",
  codePrefix: "CAT",
  permission: "master.package-category",
  auditEntity: "PackageCategory",
}

export class PackageCategoryService extends BaseService<
  PackageCategoryListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(packageCategoryRepository, config.permission)
  }

  async create(data: Record<string, unknown>) {
    const name = data.name as string
    const shortName = data.shortName as string

    const existingName = await packageCategoryRepository.findFirst({ name } as Record<string, unknown>)
    if (existingName) throw new Error("Category name already exists")

    const existingShort = await packageCategoryRepository.findFirst({ shortName } as Record<string, unknown>)
    if (existingShort) throw new Error("Short name already exists")

    const code = await this.generateUniqueCode()
    const slug = await this.generateUniqueSlug(name)

    return super.create({ ...data, code, slug } as Record<string, unknown>)
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await packageCategoryRepository.findById(id)
    if (!existing) throw new Error("PackageCategory not found")
    const old = existing as unknown as PackageCategoryListItem

    const name = data.name as string | undefined
    const shortName = data.shortName as string | undefined
    const status = data.status as string | undefined
    const isFeatured = data.isFeatured as boolean | undefined

    if (name && name !== old.name) {
      const dup = await packageCategoryRepository.findFirst({ name } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Category name already exists")
    }

    if (shortName && shortName !== old.shortName) {
      const dup = await packageCategoryRepository.findFirst({ shortName } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Short name already exists")
    }

    if (isFeatured !== undefined && isFeatured && status === "INACTIVE") {
      throw new Error("Only ACTIVE categories can be featured")
    }

    if (status === "INACTIVE") {
      data.isFeatured = false
    }

    const updateData: Record<string, unknown> = { ...data }
    // The Prisma `code` is intentionally stable across renames; only the slug is
    // re-derived (uniquely) when the name changes.
    updateData.slug = name && name !== old.name
      ? await this.generateUniqueSlug(name, id)
      : old.slug

    const record = await packageCategoryRepository.update(id, updateData)
    await audit({
      action: "UPDATE",
      resource: config.permission,
      resourceId: id,
      metadata: { name: record.name },
    })
    return record
  }

  /**
   * Generates a unique `code` (e.g. CAT-001, CAT-002, ...) guaranteed not to
   * collide with existing rows — including soft-deleted ones, which still hold
   * their unique `code` after delete.
   */
  private async generateUniqueCode(): Promise<string> {
    let n = 1
    while (true) {
      const code = `${config.codePrefix}-${String(n).padStart(3, "0")}`
      const existing = await packageCategoryRepository.findByCode(code)
      if (!existing) return code
      n += 1
    }
  }

  /**
   * Generates a unique slug derived from the name (e.g. umroh-plus,
   * umroh-plus-2, umroh-plus-3, ...), optionally excluding the record currently
   * being edited so a same-slug rename stays idempotent.
   */
  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = slugify(name, { lower: true, strict: true })
    let candidate = base
    let n = 2
    while (true) {
      const existing = await packageCategoryRepository.findBySlug(candidate)
      if (!existing || existing.id === excludeId) return candidate
      candidate = `${base}-${n}`
      n += 1
    }
  }

  async toggleFeatured(id: string) {
    const existing = await packageCategoryRepository.findById(id)
    if (!existing) throw new Error("PackageCategory not found")

    const current = existing as unknown as Record<string, unknown>
    const currentFeatured = current.isFeatured as boolean
    const currentStatus = current.status as string

    if (!currentFeatured && currentStatus !== "ACTIVE") {
      throw new Error("Only ACTIVE categories can be featured")
    }

    const newFeatured = !currentFeatured
    await packageCategoryRepository.update(id, { isFeatured: newFeatured } as Record<string, unknown>)

    await audit({
      action: newFeatured ? "FEATURE" : "UNFEATURE",
      resource: config.permission,
      resourceId: id,
      metadata: { name: current.name, isFeatured: newFeatured },
    })
  }
}

export const packageCategoryService = new PackageCategoryService()
