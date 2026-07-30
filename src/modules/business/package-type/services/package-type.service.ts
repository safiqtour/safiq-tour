import slugify from "slugify"
import { db } from "@/lib/prisma/db"
import { BaseService } from "../../services/base.service"
import { packageTypeRepository } from "../repositories/package-type.repository"
import { audit } from "../../lib/audit"
import { generateSequentialCode } from "../../utils/code"
import type { PackageTypeListItem } from "../types"
import type { BusinessModuleConfig } from "../../types/base.types"

const config: BusinessModuleConfig = {
  module: "package-type",
  codePrefix: "TYPE",
  permission: "master.package-type",
  auditEntity: "PackageType",
}

export class PackageTypeService extends BaseService<
  PackageTypeListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(packageTypeRepository, config.permission)
  }

  async findAll(params?: Record<string, unknown>) {
    return packageTypeRepository.findAllWithRelations(params)
  }

  async findById(id: string) {
    return packageTypeRepository.findByIdWithRelations(id)
  }

  async create(data: Record<string, unknown>) {
    const name = data.name as string
    const shortName = data.shortName as string

    const existingName = await packageTypeRepository.findFirst({ name } as Record<string, unknown>)
    if (existingName) throw new Error("Package type name already exists")

    const existingShort = await packageTypeRepository.findFirst({ shortName } as Record<string, unknown>)
    if (existingShort) throw new Error("Short name already exists")

    const count = await db.packageType.count({ where: { deletedAt: null } })
    const code = generateSequentialCode(config.codePrefix, count)
    const slug = slugify(name, { lower: true, strict: true })

    return super.create({ ...data, code, slug } as Record<string, unknown>)
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await packageTypeRepository.findById(id)
    if (!existing) throw new Error("PackageType not found")

    const name = data.name as string | undefined
    const shortName = data.shortName as string | undefined
    const status = data.status as string | undefined
    const isFeatured = data.isFeatured as boolean | undefined

    if (name && name !== (existing as unknown as Record<string, unknown>).name) {
      const dup = await packageTypeRepository.findFirst({ name } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Package type name already exists")
    }

    if (shortName && shortName !== (existing as unknown as Record<string, unknown>).shortName) {
      const dup = await packageTypeRepository.findFirst({ shortName } as Record<string, unknown>)
      if (dup && (dup as unknown as Record<string, unknown>).id !== id) throw new Error("Short name already exists")
    }

    if (isFeatured !== undefined && isFeatured && status === "INACTIVE") {
      throw new Error("Only ACTIVE package types can be featured")
    }

    if (status === "INACTIVE") {
      data.isFeatured = false
    }

    return super.update(id, data)
  }

  async toggleFeatured(id: string) {
    const existing = await packageTypeRepository.findById(id)
    if (!existing) throw new Error("PackageType not found")

    const current = existing as unknown as Record<string, unknown>
    const currentFeatured = current.isFeatured as boolean
    const currentStatus = current.status as string

    if (!currentFeatured && currentStatus !== "ACTIVE") {
      throw new Error("Only ACTIVE package types can be featured")
    }

    const newFeatured = !currentFeatured
    await packageTypeRepository.update(id, { isFeatured: newFeatured } as Record<string, unknown>)

    await audit({
      action: newFeatured ? "FEATURE" : "UNFEATURE",
      resource: config.permission,
      resourceId: id,
      metadata: { name: current.name, isFeatured: newFeatured },
    })
  }
}

export const packageTypeService = new PackageTypeService()
