import { BaseService } from "../../services/base.service"
import { businessSettingRepository } from "../repositories/business-setting.repository"
import type { BusinessSettingListItem } from "../types"
import type { BusinessModuleConfig } from "../../types/base.types"

const config: BusinessModuleConfig = {
  module: "business-setting",
  codePrefix: "CFG",
  permission: "master.business-setting",
  auditEntity: "BusinessSetting",
}

const SYSTEM_GROUPS = ["SYSTEM"]

export class BusinessSettingService extends BaseService<
  BusinessSettingListItem,
  Record<string, unknown>,
  Record<string, unknown>
> {
  constructor() {
    super(businessSettingRepository, config.permission)
  }

  async create(data: Record<string, unknown>) {
    const key = data.key as string

    const existing = await businessSettingRepository.findFirst({ key } as Record<string, unknown>)
    if (existing) throw new Error("Setting key already exists")

    const value = data.value as string
    const valueType = data.valueType as string
    this.validateJsonValue(value, valueType)

    return super.create(data)
  }

  async update(id: string, data: Record<string, unknown>) {
    const existing = await businessSettingRepository.findById(id)
    if (!existing) throw new Error("BusinessSetting not found")

    const current = existing as unknown as Record<string, unknown>

    if (current.isReadonly) {
      throw new Error("Readonly settings cannot be modified")
    }

    const status = data.status as string | undefined
    if (status === "INACTIVE" && SYSTEM_GROUPS.includes(current.group as string)) {
      throw new Error("System settings cannot be disabled")
    }

    const value = data.value as string | undefined
    const valueType = (data.valueType as string) ?? (current.valueType as string)
    if (value !== undefined) {
      this.validateJsonValue(value, valueType)
    }

    return super.update(id, data)
  }

  async softDelete(id: string) {
    const existing = await businessSettingRepository.findById(id)
    if (!existing) throw new Error("BusinessSetting not found")

    const current = existing as unknown as Record<string, unknown>
    if (current.isReadonly) {
      throw new Error("Readonly settings cannot be deleted")
    }

    return super.softDelete(id)
  }

  async restore(id: string) {
    return super.restore(id)
  }

  private validateJsonValue(value: string, valueType: string) {
    if (valueType === "JSON" && value) {
      try {
        JSON.parse(value)
      } catch {
        throw new Error("Invalid JSON value")
      }
    }
  }
}

export const businessSettingService = new BusinessSettingService()
