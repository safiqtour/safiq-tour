import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { TagListItem } from "../types"

export class TagRepository extends BaseRepository<
  TagListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.tag as never, { searchFields: ["name", "code", "shortName"] })
  }
}

export const tagRepository = new TagRepository()
