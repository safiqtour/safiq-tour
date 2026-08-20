import { db } from "@/lib/prisma/db"
import type { Prisma, User } from "@prisma/client"
import { BaseRepository } from "@/modules/business/repositories/base.repository"
import type { CreateUserInput, UpdateUserInput } from "../validations/user.schema"

export const userInclude = {
  role: true,
} satisfies Prisma.UserInclude

export type UserWithRelations = Prisma.UserGetPayload<{ include: typeof userInclude }>

/**
 * Strongly-typed repository for the User entity.
 *
 * The delegate is bound with full type-safety: `db.user` is a native
 * `Prisma.UserDelegate` and `BaseRepository` accepts it directly.
 *
 * Note: the User model has no `deletedAt` column, so soft-delete is expressed
 * with the existing `isActive` flag instead. Callers that need the legacy
 * BaseRepository findAll shape must use the service-level override.
 */
export class UserRepository extends BaseRepository<
  User,
  CreateUserInput,
  UpdateUserInput,
  Prisma.UserDelegate
> {
  constructor() {
    super(db.user, {
      searchFields: ["name", "email"],
    })
  }

  findByIdWithRelations(id: string): Promise<UserWithRelations | null> {
    return this.delegate.findUnique({
      where: { id },
      include: userInclude,
    }) as Promise<UserWithRelations | null>
  }
}

export const userRepository = new UserRepository()