"use server"

import { getWritableSession } from "@/services/auth.integration.service"
import { can } from "@/services/authorization.service"
import { requirePermission } from "../../lib/permission"
import { packageCategoryService } from "../services/package-category.service"
import {
  createPackageCategorySchema,
  updatePackageCategorySchema,
  packageCategoryQuerySchema,
} from "../validations/package-category.schema"

export async function getPackageCategories(params: unknown) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.package-category:read")) throw new Error("Forbidden")

  const query = packageCategoryQuerySchema.parse(params)
  return packageCategoryService.findAll(query as never)
}

export async function getPackageCategory(id: string) {
  const session = await getWritableSession()
  if (!session?.user?.role) throw new Error("Unauthorized")
  if (!can(session.user.role, "master.package-category:read")) throw new Error("Forbidden")

  return packageCategoryService.findById(id)
}

export async function createPackageCategory(data: unknown) {
  await requirePermission("master.package-category:create")

  const parsed = createPackageCategorySchema.parse(data)
  return packageCategoryService.create(parsed as unknown as Record<string, unknown>)
}

export async function updatePackageCategory(id: string, data: unknown) {
  await requirePermission("master.package-category:update")

  const parsed = updatePackageCategorySchema.parse(data)
  return packageCategoryService.update(id, parsed as unknown as Record<string, unknown>)
}

export async function deletePackageCategory(id: string) {
  await requirePermission("master.package-category:delete")

  await packageCategoryService.softDelete(id)
}

export async function restorePackageCategory(id: string) {
  await requirePermission("master.package-category:update")

  await packageCategoryService.restore(id)
}

export async function toggleFeaturedCategory(id: string) {
  await requirePermission("master.package-category:update")

  await packageCategoryService.toggleFeatured(id)
}
