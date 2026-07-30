import { BaseService } from "../../services/base.service"
import { visaRepository } from "../repositories/visa.repository"
import type { VisaListItem } from "../types"

export class VisaService extends BaseService<
  VisaListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(visaRepository, "master.visa")
  }

  async findAll(params?: Record<string, unknown>) {
    return visaRepository.findAllWithCountry(params)
  }

  async findById(id: string) {
    return visaRepository.findByIdWithCountry(id)
  }
}

export const visaService = new VisaService()
