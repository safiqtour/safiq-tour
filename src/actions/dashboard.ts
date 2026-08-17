"use server"

import { db } from "@/lib/prisma/db"
import { requirePermission } from "@/modules/business/lib/permission"
import { getRecentActivityLogs } from "@/services/audit.service"

export async function getDashboardStats() {
  await requirePermission("dashboard:read")

  const [
    totalPackages,
    draftPackages,
    publishedPackages,
    totalUsers,
    totalMedia,
    recentActivities,
  ] = await Promise.all([
    db.package.count(),
    db.package.count({ where: { status: "DRAFT" } }),
    db.package.count({ where: { status: "PUBLISHED" } }),
    db.user.count(),
    db.media.count(),
    getRecentActivityLogs(5),
  ])

  return {
    totalPackages,
    draftPackages,
    publishedPackages,
    totalUsers,
    totalMedia,
    recentActivities: recentActivities.map((log) => ({
      id: log.id,
      action: log.action,
      resource: log.resource,
      user: log.user?.name ?? "System",
      time: log.createdAt.toISOString(),
    })),
  }
}

export type DashboardStats = Awaited<ReturnType<typeof getDashboardStats>>
