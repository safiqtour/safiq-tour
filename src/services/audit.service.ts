import { db } from "@/lib/prisma/db"
import { getUser } from "@/services/auth.integration.service"

export type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "RESTORE" | "LOGIN" | "LOGOUT" | "VERIFY" | "REJECT" | "APPROVE" | "CANCEL" | "FEATURE" | "UNFEATURE"

export async function logActivity(params: {
  action: AuditAction
  resource: string
  resourceId?: string
  metadata?: Record<string, unknown>
}) {
  const user = await getUser()
  const userId = user?.id

  const metadataStr = params.metadata ? JSON.stringify(params.metadata) : null

  try {
    await db.activityLog.create({
      data: {
        userId: userId ?? null,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId,
        metadata: metadataStr,
        ipAddress: null,
        userAgent: null,
      },
    })
  } catch {
    console.error("Failed to log activity")
  }
}

export async function getRecentActivityLogs(limit = 10) {
  return db.activityLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })
}

export async function getActivityLogs(params: {
  page?: number
  limit?: number
  resource?: string
  action?: string
  userId?: string
}) {
  const page = params.page ?? 1
  const limit = params.limit ?? 20
  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}
  if (params.resource) where.resource = params.resource
  if (params.action) where.action = params.action
  if (params.userId) where.userId = params.userId

  const [data, total] = await Promise.all([
    db.activityLog.findMany({
      where,
      take: limit,
      skip,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    }),
    db.activityLog.count({ where }),
  ])

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  }
}
