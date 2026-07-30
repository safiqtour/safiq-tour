import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { PromotionListItem } from "../types"

export class PromotionRepository extends BaseRepository<
  PromotionListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.promotion as never, { searchFields: ["name", "code", "promotionType"] })
  }
}

export const promotionRepository = new PromotionRepository()
