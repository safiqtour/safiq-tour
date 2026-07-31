import { ROLE_PERMISSIONS, type RoleSlug } from "@/constants/permissions"
import type { ResolvedRole } from "./role.resolver"

export function resolvePermissionsFromRoles(
  roles: readonly (ResolvedRole | string)[]
): string[] {
  const permissions = new Set<string>()
  for (const role of roles) {
    const slug = typeof role === "string" ? role : role.slug
    const granted = ROLE_PERMISSIONS[slug as RoleSlug] ?? []
    for (const permission of granted) permissions.add(permission)
  }
  return [...permissions]
}

export function matchesPermission(required: string, granted: readonly string[]): boolean {
  const [resource, action] = required.split(":") as [string, string]
  return granted.some((permission) => {
    const [r, a] = permission.split(":") as [string, string]
    if (r === resource && (a === "all" || a === action)) return true
    return false
  })
}

export function can(userRole: { slug: string } | null, permission: string): boolean {
  if (!userRole) return false
  return matchesPermission(permission, resolvePermissionsFromRoles([userRole.slug]))
}

export function hasRole(userRole: { slug: string } | null, roleSlug: string): boolean {
  return userRole?.slug === roleSlug
}
