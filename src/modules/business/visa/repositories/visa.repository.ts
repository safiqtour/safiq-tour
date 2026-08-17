import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { VisaListItem } from "../types"

const visaInclude = {
  country: { select: { id: true, name: true } },
} as const

export class VisaRepository extends BaseRepository<
  VisaListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.visa as never, { searchFields: ["name", "code"] })
  }

  async findAllWithCountry(params?: Record<string, unknown>) {
    const result = await this.findAll({ ...params, include: visaInclude })
    return result
  }

  async findByIdWithCountry(id: string) {
    return this.findById(id, visaInclude)
  }
}

export const visaRepository = new VisaRepository()
