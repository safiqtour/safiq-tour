"use server"

import { auth } from "@/lib/auth/auth"
import { hasPermission } from "@/services/auth.service"
import { requirePermission } from "../../lib/permission"
import { packageTypeService } from "../services/package-type.service"
import {
  createPackageTypeSchema,
  updatePackageTypeSchema,
  packageTypeQuerySchema,
} from "../validations/package-type.schema"

export async function getPackageTypes(params: unknown) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.package-type:read")) throw new Error("Forbidden")

  const query = packageTypeQuerySchema.parse(params)
  return packageTypeService.findAll(query as never)
}

export async function getPackageType(id: string) {
  const session = await auth()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!hasPermission(session.user.role, "master.package-type:read")) throw new Error("Forbidden")

  return packageTypeService.findById(id)
}

export async function createPackageType(data: unknown) {
  await requirePermission("master.package-type:create")

  const parsed = createPackageTypeSchema.parse(data)
  return packageTypeService.create(parsed as unknown as Record<string, unknown>)
}

export async function updatePackageType(id: string, data: unknown) {
  await requirePermission("master.package-type:update")

  const parsed = updatePackageTypeSchema.parse(data)
  return packageTypeService.update(id, parsed as unknown as Record<string, unknown>)
}

export async function deletePackageType(id: string) {
  await requirePermission("master.package-type:delete")

  await packageTypeService.softDelete(id)
}

export async function restorePackageType(id: string) {
  await requirePermission("master.package-type:update")

  await packageTypeService.restore(id)
}

export async function toggleFeaturedPackageType(id: string) {
  await requirePermission("master.package-type:update")

  await packageTypeService.toggleFeatured(id)
}
