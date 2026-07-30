import slugify from "slugify"
import { db } from "@/lib/prisma/db"
import { BaseService } from "../../services/base.service"
import { packageCategoryRepository } from "../repositories/package-category.repository"
import { audit } from "../../lib/audit"
import { generateSequentialCode } from "../../utils/code"
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

    const count = await db.packageCategory.count({ where: { deletedAt: null } })
    const code = generateSequentialCode(config.codePrefix, count)
    const slug = slugify(name, { lower: true, strict: true })

    return super.create({ ...data, code, slug } as Record<string, unknown>)
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await packageCategoryRepository.findById(id)
    if (!existing) throw new Error("PackageCategory not found")

    const name = data.name as string | undefined
    const shortName = data.shortName as string | undefined
    const status = data.status as string | undefined
    const isFeatured = data.isFeatured as boolean | undefined

    if (name && name !== (existing as unknown as Record<string, unknown>).name) {
      const dup = await packageCategoryRepository.findFirst({ name } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Category name already exists")
    }

    if (shortName && shortName !== (existing as unknown as Record<string, unknown>).shortName) {
      const dup = await packageCategoryRepository.findFirst({ shortName } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Short name already exists")
    }

    if (isFeatured !== undefined && isFeatured && status === "INACTIVE") {
      throw new Error("Only ACTIVE categories can be featured")
    }

    if (status === "INACTIVE") {
      data.isFeatured = false
    }

    return super.update(id, data)
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
