import { logActivity } from "@/services/audit.service"
import type { BusinessModuleAction } from "@/modules/business/types/base.types"

export async function audit(params: {
  action: BusinessModuleAction
  resource: string
  resourceId?: string
  metadata?: Record<string, unknown>
}) {
  return logActivity(params)
}
