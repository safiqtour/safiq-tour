export type ResolvedRole = {
  id: string
  name: string
  slug: string
  level: number
}

export type ResolvedUser = {
  id: string
  name: string | null
  email: string
  image: string | null
  role: ResolvedRole | null
  permissions: string[]
}

export function resolveRolesFromUser(user: ResolvedUser): ResolvedRole[] {
  return user.role ? [user.role] : []
}
