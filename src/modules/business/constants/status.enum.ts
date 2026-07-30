export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  ARCHIVED: "ARCHIVED",
} as const

export type Status = (typeof STATUS)[keyof typeof STATUS]

export const STATUS_LABEL: Record<Status, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  ARCHIVED: "Archived",
}
