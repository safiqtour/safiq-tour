import { db } from "@/lib/prisma/db"
import type { Prisma } from "@prisma/client"
import { BaseService } from "@/modules/business/services/base.service"
import { audit } from "@/modules/business/lib/audit"
import { hashPassword } from "@/services/auth.service"
import { ROLE_SLUGS } from "@/constants/permissions"
import { userRepository } from "../repositories/user.repository"
import type { CreateUserInput, UpdateUserInput } from "../validations/user.schema"

const ADMIN_ROLE_SLUGS = [ROLE_SLUGS.SUPER_ADMIN, ROLE_SLUGS.ADMIN]

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  image: true,
  isActive: true,
  lastLogin: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

export type UserSafe = Prisma.UserGetPayload<{ select: typeof userSafeSelect }>

export class UserService extends BaseService<UserSafe, CreateUserInput, UpdateUserInput> {
  constructor() {
    super(userRepository, "user")
  }

  async findAll(params?: Record<string, unknown>) {
    const page = (params?.page as number) ?? 1
    const limit = (params?.limit as number) ?? 10
    const search = params?.search as string | undefined
    const sort = (params?.sort as string) ?? "createdAt"
    const order = (params?.order as "asc" | "desc") ?? "desc"

    const where: Prisma.UserWhereInput = {}
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order } as Prisma.UserOrderByWithRelationInput,
        select: { ...userSafeSelect, role: true },
      }),
      db.user.count({ where }),
    ])

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  async create(data: CreateUserInput) {
    if (data.roleId) {
      const role = await db.role.findUnique({ where: { id: data.roleId } })
      if (!role) throw new Error("Role tidak ditemukan")
    }

    const hashed = await hashPassword(data.password)

    const user = await db.user.create({
      data: {
        name: data.name ?? null,
        email: data.email,
        password: hashed,
        roleId: data.roleId ?? null,
        image: data.image ?? null,
        isActive: data.isActive ?? true,
      },
      select: { ...userSafeSelect, role: true },
    })

    await audit({
      action: "CREATE",
      resource: "user",
      resourceId: user.id,
      metadata: { name: user.name, email: user.email },
    })

    return user
  }

  async update(id: string, data: UpdateUserInput) {
    const existing = await db.user.findUnique({
      where: { id },
      select: { ...userSafeSelect, role: true },
    })
    if (!existing) throw new Error("User not found")

    if (data.roleId !== undefined && data.roleId !== null && data.roleId !== existing.roleId) {
      const role = await db.role.findUnique({ where: { id: data.roleId } })
      if (!role) throw new Error("Role tidak ditemukan")
    }

    if (data.isActive === false && existing.isActive) {
      if (existing.role?.slug === ROLE_SLUGS.SUPER_ADMIN) {
        throw new Error("Super admin tidak dapat dinonaktifkan")
      }

      const activeAdminCount = await db.user.count({
        where: {
          isActive: true,
          role: { slug: { in: ADMIN_ROLE_SLUGS } },
        },
      })

      const targetIsAdmin = existing.role && ADMIN_ROLE_SLUGS.includes(existing.role.slug as typeof ADMIN_ROLE_SLUGS[number])
      if (targetIsAdmin && activeAdminCount <= 1) {
        throw new Error("Tidak dapat menonaktifkan admin terakhir")
      }
    }

    const { password, ...fields } = data

    const updateData: Prisma.UserUncheckedUpdateInput = {}
    if (fields.name !== undefined) updateData.name = fields.name
    if (fields.email !== undefined) updateData.email = fields.email
    if (fields.roleId !== undefined) updateData.roleId = fields.roleId ?? null
    if (fields.image !== undefined) updateData.image = fields.image ?? null
    if (fields.isActive !== undefined) updateData.isActive = fields.isActive
    if (password && password.length > 0) {
      updateData.password = await hashPassword(password)
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: { ...userSafeSelect, role: true },
    })

    await audit({
      action: "UPDATE",
      resource: "user",
      resourceId: id,
      metadata: { name: user.name, email: user.email },
    })

    return user
  }

  async getDetail(id: string) {
    return userRepository.findByIdWithRelations(id)
  }

  async softDelete(id: string) {
    const existing = await db.user.findUnique({
      where: { id },
      select: { ...userSafeSelect, role: true },
    })
    if (!existing) throw new Error("User not found")

    if (existing.role?.slug === ROLE_SLUGS.SUPER_ADMIN) {
      throw new Error("Super admin tidak dapat dinonaktifkan")
    }

    const activeAdminCount = await db.user.count({
      where: {
        isActive: true,
        role: { slug: { in: ADMIN_ROLE_SLUGS } },
      },
    })

    const targetIsAdmin = existing.role && ADMIN_ROLE_SLUGS.includes(existing.role.slug as typeof ADMIN_ROLE_SLUGS[number])
    if (targetIsAdmin && activeAdminCount <= 1) {
      throw new Error("Tidak dapat menonaktifkan admin terakhir")
    }

    await db.user.update({ where: { id }, data: { isActive: false } })
    await audit({
      action: "DELETE",
      resource: "user",
      resourceId: id,
      metadata: { name: existing.name, email: existing.email },
    })
  }

  async restore(id: string) {
    const existing = await db.user.findUnique({
      where: { id },
      select: { ...userSafeSelect },
    })
    if (!existing) throw new Error("User not found")
    await db.user.update({ where: { id }, data: { isActive: true } })
    await audit({
      action: "RESTORE",
      resource: "user",
      resourceId: id,
      metadata: { name: existing.name, email: existing.email },
    })
  }
}

export const userService = new UserService()