export const FACILITY_CATEGORIES = [
  "Accommodation",
  "Transportation",
  "Meals",
  "Administration",
  "Worship",
  "Equipment",
  "Guide",
  "Insurance",
  "Documents",
  "Health",
  "Communication",
  "Other",
] as const

export type FacilityCategory = (typeof FACILITY_CATEGORIES)[number]

export interface FacilityListItem {
  id: string
  code: string
  slug: string
  name: string
  icon: string
  category: string
  description: string
  sortOrder: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
