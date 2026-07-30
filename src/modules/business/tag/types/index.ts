export interface TagListItem {
  id: string
  code: string
  slug: string
  name: string
  shortName: string
  description: string
  color: string
  icon: string
  displayOrder: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
