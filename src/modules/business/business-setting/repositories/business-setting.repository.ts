import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { BusinessSettingListItem } from "../types"

export class BusinessSettingRepository extends BaseRepository<
  BusinessSettingListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.businessSetting as never, { searchFields: ["key", "label", "group"] })
  }
}

export const businessSettingRepository = new BusinessSettingRepository()
