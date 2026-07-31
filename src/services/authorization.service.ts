import { getSession } from "@/services/auth.integration.service"
import type { AuthCookieTransport } from "@/services/auth.integration.service"
import {
  resolveRolesFromUser,
  type ResolvedRole,
  type ResolvedUser,
} from "@/providers/auth/resolvers/role.resolver"
import {
  resolvePermissionsFromRoles,
  matchesPermission,
  can as canForRole,
  hasRole as hasRoleForRole,
} from "@/providers/auth/resolvers/permission.resolver"

export type { ResolvedRole, ResolvedUser } from "@/providers/auth/resolvers/role.resolver"

export async function resolveUser(
  transport?: AuthCookieTransport
): Promise<ResolvedUser | null> {
  const session = await getSession(transport)
  return session?.user ?? null
}

export function resolveRoles(user: ResolvedUser): ResolvedRole[] {
  return resolveRolesFromUser(user)
}

export function resolvePermissions(roles: readonly (ResolvedRole | string)[]): string[] {
  return resolvePermissionsFromRoles(roles)
}

export function can(userRole: { slug: string } | null, permission: string): boolean {
  return canForRole(userRole, permission)
}

export function hasRole(userRole: { slug: string } | null, roleSlug: string): boolean {
  return hasRoleForRole(userRole, roleSlug)
}

export async function hasPermission(permission: string, transport?: AuthCookieTransport): Promise<boolean> {
  const user = await resolveUser(transport)
  return canForRole(user?.role ?? null, permission)
}

export async function checkPermission(permission: string, transport?: AuthCookieTransport): Promise<boolean> {
  return hasPermission(permission, transport)
}

export async function requirePermission(permission: string, transport?: AuthCookieTransport): Promise<ResolvedUser> {
  const user = await resolveUser(transport)
  if (!user?.role) throw new Error("Unauthorized")
  if (!canForRole(user.role, permission)) throw new Error("Forbidden")
  return user
}

export { matchesPermission }
