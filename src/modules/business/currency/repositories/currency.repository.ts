import { db } from "@/lib/prisma/db"
import { BaseRepository } from "../../repositories/base.repository"
import type { CurrencyListItem } from "../types"

const currencyInclude = {
  country: { select: { id: true, name: true } },
} as const

export class CurrencyRepository extends BaseRepository<
  CurrencyListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(db.currency as never, { searchFields: ["name", "isoCode", "code", "symbol"] })
  }

  async findAllWithCountry(params?: Record<string, unknown>) {
    return this.findAll({ ...params, include: currencyInclude })
  }

  async findByIdWithCountry(id: string) {
    return this.findById(id, currencyInclude)
  }

  async unsetBaseCurrency() {
    return db.currency.updateMany({
      where: { isBaseCurrency: true },
      data: { isBaseCurrency: false },
    })
  }

  async getBaseCurrency() {
    return db.currency.findFirst({ where: { isBaseCurrency: true, deletedAt: null } })
  }
}

export const currencyRepository = new CurrencyRepository()
