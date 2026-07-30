import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { FacilityListItem } from "../types"

export class FacilityRepository extends BaseRepository<
  FacilityListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.facility as never, { searchFields: ["name", "code", "category"] })
  }
}

export const facilityRepository = new FacilityRepository()
