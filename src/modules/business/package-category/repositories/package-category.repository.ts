import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { PackageCategoryListItem } from "../types"

export class PackageCategoryRepository extends BaseRepository<
  PackageCategoryListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.packageCategory as never, { searchFields: ["name", "code", "shortName"] })
  }
}

export const packageCategoryRepository = new PackageCategoryRepository()
