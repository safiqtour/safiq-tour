import {
  requirePermission as requireAccess,
  checkPermission as checkAccess,
} from "@/services/authorization.service"

export async function requirePermission(permission: string) {
  return requireAccess(permission)
}

export async function checkPermission(permission: string) {
  return checkAccess(permission)
}
