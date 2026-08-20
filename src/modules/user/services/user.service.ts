import { db } from "@/lib/prisma/db"
import type { Prisma, User } from "@prisma/client"
import { BaseService } from "@/modules/business/services/base.service"
import { audit } from "@/modules/business/lib/audit"
import { hashPassword } from "@/services/auth.service"
import { userRepository } from "../repositories/user.repository"
import type { CreateUserInput, UpdateUserInput } from "../validations/user.schema"

export class UserService extends BaseService<User, CreateUserInput, UpdateUserInput> {
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
        include: { role: true },
      }),
      db.user.count({ where }),
    ])

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    }
  }

  async create(data: CreateUserInput) {
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
      include: { role: true },
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
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) throw new Error("User not found")

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
      include: { role: true },
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
    const existing = await db.user.findUnique({ where: { id } })
    if (!existing) throw new Error("User not found")
    await db.user.update({ where: { id }, data: { isActive: false } })
    await audit({
      action: "DELETE",
      resource: "user",
      resourceId: id,
      metadata: { name: existing.name, email: existing.email },
    })
  }

  async restore(id: string) {
    const existing = await db.user.findUnique({ where: { id } })
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