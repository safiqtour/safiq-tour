"use server"

import { requirePermission } from "@/modules/business/lib/permission"
import { db } from "@/lib/prisma/db"
import { userService } from "../services/user.service"
import {
  createUserSchema,
  updateUserSchema,
  userQuerySchema,
} from "../validations/user.schema"
import type {
  CreateUserInput,
  UpdateUserInput,
  UserQueryInput,
} from "../validations/user.schema"
import type { RoleOption, UserListItem } from "../types"

export async function getUsers(params: unknown) {
  await requirePermission("user:read")

  const query = userQuerySchema.parse(params) as UserQueryInput

  const result = await userService.findAll({
    page: query.page,
    limit: query.limit,
    search: query.search,
    sort: query.sort,
    order: query.order,
  })

  return {
    data: result.data.map(toListItem),
    pagination: result.pagination,
  }
}

export async function getUser(id: string) {
  await requirePermission("user:read")

  const detail = await userService.getDetail(id)
  return detail ? toListItem(detail) : null
}

export async function getUserRoles(): Promise<RoleOption[]> {
  await requirePermission("user:read")

  const roles = await db.role.findMany({
    where: { isActive: true },
    select: { id: true, name: true, slug: true, level: true },
    orderBy: { level: "desc" },
  })

  return roles
}

export async function createUser(data: unknown) {
  await requirePermission("user:create")

  const parsed = createUserSchema.parse(data) as CreateUserInput
  const created = await userService.create(parsed)

  return { id: created.id }
}

export async function updateUser(id: string, data: unknown) {
  await requirePermission("user:update")

  const parsed = updateUserSchema.parse(data) as UpdateUserInput
  const updated = await userService.update(id, parsed)

  return { id: updated.id }
}

export async function deleteUser(id: string) {
  await requirePermission("user:delete")
  await userService.softDelete(id)
}

export async function restoreUser(id: string) {
  await requirePermission("user:update")
  await userService.restore(id)
}

/* ------------------------------------------------------------------ */
/* Serialization helpers (Date -> ISO string) for strong-typed clients */
/* ------------------------------------------------------------------ */

function toListItem(row: Record<string, unknown>): UserListItem {
  const role = row.role as Record<string, unknown> | null
  return {
    id: row.id as string,
    name: row.name as string | null,
    email: row.email as string,
    role: role
      ? {
          id: role.id as string,
          name: role.name as string,
          slug: role.slug as string,
          level: role.level as number,
        }
      : null,
    image: row.image as string | null,
    isActive: row.isActive as boolean,
    lastLogin: row.lastLogin ? new Date(row.lastLogin as string).toISOString() : null,
    createdAt: new Date(row.createdAt as string).toISOString(),
    updatedAt: new Date(row.updatedAt as string).toISOString(),
  }
}