export interface PackageTypeListItem {
  id: string
  code: string
  slug: string
  name: string
  shortName: string
  description: string
  defaultDurationDays: number
  defaultVisaId: string | null
  defaultCategoryId: string | null
  defaultVisa?: { id: string; name: string } | null
  defaultCategory?: { id: string; name: string } | null
  icon: string
  color: string
  displayOrder: number
  isFeatured: boolean
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
