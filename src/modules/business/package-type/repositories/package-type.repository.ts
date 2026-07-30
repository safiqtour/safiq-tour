import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { PackageTypeListItem } from "../types"

const packageTypeInclude = {
  defaultVisa: { select: { id: true, name: true } },
  defaultCategory: { select: { id: true, name: true } },
} as const

export class PackageTypeRepository extends BaseRepository<
  PackageTypeListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.packageType as never, { searchFields: ["name", "code", "shortName"] })
  }

  async findAllWithRelations(params?: Record<string, unknown>) {
    return this.findAll({ ...params, include: packageTypeInclude })
  }

  async findByIdWithRelations(id: string) {
    return this.findById(id, packageTypeInclude)
  }
}

export const packageTypeRepository = new PackageTypeRepository()
