import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/services/auth.service"

export async function requirePermission(permission: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, permission)) throw new Error("Forbidden")
  return session
}

export async function checkPermission(permission: string) {
  const session = await auth()
  if (!session?.user?.role) return false
  return hasPermission(session.user.role, permission)
}
