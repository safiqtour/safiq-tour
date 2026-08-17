export interface PackageCategoryListItem {
  id: string
  code: string
  slug: string
  name: string
  shortName: string
  description: string
  displayOrder: number
  icon: string
  color: string
  isFeatured: boolean
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
