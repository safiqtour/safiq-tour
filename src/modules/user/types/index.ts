export interface UserRoleSummary {
  id: string
  name: string
  slug: string
  level: number
}

export interface UserListItem {
  id: string
  name: string | null
  email: string
  role: UserRoleSummary | null
  image: string | null
  isActive: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export type UserDetail = UserListItem

export interface RoleOption {
  id: string
  name: string
  slug: string
  level: number
}