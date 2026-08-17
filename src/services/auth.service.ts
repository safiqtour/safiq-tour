import { db } from "@/lib/prisma/db"
import bcrypt from "bcryptjs"
import { ROLE_PERMISSIONS } from "@/constants/permissions"
import type { RoleSlug } from "@/constants/permissions"

export type AuthUser = {
  id: string
  name: string | null
  email: string
  role: {
    id: string
    name: string
    slug: string
    level: number
  }
  image: string | null
}

export async function findUserByEmail(email: string) {
  return db.user.findUnique({
    where: { email },
    include: { role: true },
  })
}

export async function findUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    include: { role: true },
  })
}

export async function verifyPassword(plainPassword: string, hashedPassword: string) {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12)
}

export async function updateLastLogin(userId: string) {
  return db.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  })
}

export function hasPermission(
  userRole: { slug: string; level: number } | null,
  requiredPermission: string
): boolean {
  if (!userRole) return false

  const roleSlug = userRole.slug as RoleSlug
  const permissions = ROLE_PERMISSIONS[roleSlug] ?? []

  const [resource, action] = requiredPermission.split(":") as [string, string]

  return permissions.some((p: string) => {
    const [r, a] = p.split(":") as [string, string]
    if (r === resource && (a === "all" || a === action)) return true
    return false
  })
}

export function can(userRole: { slug: string; level: number } | null, permission: string): boolean {
  return hasPermission(userRole, permission)
}

export async function getAllUsers() {
  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      isActive: true,
      lastLogin: true,
      createdAt: true,
      role: {
        select: {
          id: true,
          name: true,
          slug: true,
          level: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function updateUserProfile(userId: string, data: { name?: string; image?: string }) {
  return db.user.update({
    where: { id: userId },
    data,
  })
}

export async function changePassword(userId: string, newPassword: string) {
  const hashed = await hashPassword(newPassword)
  return db.user.update({
    where: { id: userId },
    data: { password: hashed },
  })
}
