import { db } from "@/lib/prisma/db"
import { BaseService } from "../../services/base.service"
import { currencyRepository } from "../repositories/currency.repository"
import { audit } from "../../lib/audit"
import type { CurrencyListItem } from "../types"

export class CurrencyService extends BaseService<
  CurrencyListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(currencyRepository, "master.currency")
  }

  async findAll(params?: Record<string, unknown>) {
    return currencyRepository.findAllWithCountry(params)
  }

  async findById(id: string) {
    return currencyRepository.findByIdWithCountry(id)
  }

  async create(data: Record<string, unknown>) {
    const isBaseCurrency = data.isBaseCurrency === true

    return db.$transaction(async () => {
      if (isBaseCurrency) {
        await currencyRepository.unsetBaseCurrency()
      }

      const record = await super.create(data)
      return record
    })
  }

  async update(id: string, data: Record<string, unknown>) {
    const isBaseCurrency = data.isBaseCurrency === true

    return db.$transaction(async () => {
      if (isBaseCurrency) {
        await currencyRepository.unsetBaseCurrency()
      }

      const record = await super.update(id, data)
      return record
    })
  }

  async setBaseCurrency(id: string) {
    return db.$transaction(async () => {
      await currencyRepository.unsetBaseCurrency()
      const record = await currencyRepository.update(id, { isBaseCurrency: true } as never)
      await audit({
        action: "UPDATE",
        resource: "master.currency",
        resourceId: id,
        metadata: { isBaseCurrency: true, name: (record as unknown as Record<string, unknown>).name },
      })
      return record
    })
  }
}

export const currencyService = new CurrencyService()
