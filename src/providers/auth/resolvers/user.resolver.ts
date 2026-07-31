import type { AuthUser as ProviderUser } from "@/providers/auth/types"
import { resolvePermissionsFromRoles } from "./permission.resolver"
import type { ResolvedRole, ResolvedUser } from "./role.resolver"

export async function resolveUserFromIdentity(identity: ProviderUser): Promise<ResolvedUser> {
  const { findUserByEmail } = await import("@/services/auth.service")

  const appUser = identity.email ? await findUserByEmail(identity.email) : null

  if (!appUser || !appUser.isActive) {
    return {
      id: identity.id,
      name: identity.name,
      email: identity.email,
      image: identity.image,
      role: null,
      permissions: [],
    }
  }

  const role: ResolvedRole | null = appUser.role
    ? {
        id: appUser.role.id,
        name: appUser.role.name,
        slug: appUser.role.slug,
        level: appUser.role.level,
      }
    : null

  const permissions = role ? resolvePermissionsFromRoles([role]) : []

  return {
    id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    image: appUser.image,
    role,
    permissions,
  }
}
