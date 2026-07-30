import { BaseService } from "../../services/base.service"
import { facilityRepository } from "../repositories/facility.repository"
import type { FacilityListItem } from "../types"

export class FacilityService extends BaseService<
  FacilityListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(facilityRepository, "master.facility")
  }
}

export const facilityService = new FacilityService()
