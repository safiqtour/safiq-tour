"use server"

import { checkPermission } from "@/modules/business/lib/permission"

export async function canUser(permission: string): Promise<boolean> {
  return checkPermission(permission)
}
