export const BUSINESS_SETTING_GROUPS = [
  "GENERAL", "COMPANY", "BOOKING", "PACKAGE", "FINANCE", "SYSTEM", "EMAIL", "WHATSAPP", "CMS",
] as const

export type BusinessSettingGroup = (typeof BUSINESS_SETTING_GROUPS)[number]

export const BUSINESS_SETTING_VALUE_TYPES = ["STRING", "NUMBER", "BOOLEAN", "JSON"] as const
export type BusinessSettingValueType = (typeof BUSINESS_SETTING_VALUE_TYPES)[number]

export interface BusinessSettingListItem {
  id: string
  key: string
  group: string
  value: string
  valueType: string
  label: string
  description: string
  isPublic: boolean
  isReadonly: boolean
  sortOrder: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  updatedBy: string
  deletedAt: Date | string | null
}
