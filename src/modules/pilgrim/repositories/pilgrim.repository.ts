import { db } from "@/lib/prisma/db"
import type { Prisma, Pilgrim } from "@prisma/client"
import { BaseRepository } from "@/modules/business/repositories/base.repository"
import type { CreatePilgrimInput, UpdatePilgrimInput } from "../validations/pilgrim.schema"

export const pilgrimInclude = {
  photoMedia: true,
  documents: {
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.PilgrimInclude

export type PilgrimWithRelations = Prisma.PilgrimGetPayload<{ include: typeof pilgrimInclude }>

/**
 * Strongly-typed repository for the Pilgrim (Jamaah / Customer) entity.
 *
 * The delegate is bound with full type-safety: `db.pilgrim` is a native
 * `Prisma.PilgrimDelegate` and `BaseRepository` accepts it directly (no
 * `as never` / `as unknown`).
 */
export class PilgrimRepository extends BaseRepository<
  Pilgrim,
  CreatePilgrimInput,
  UpdatePilgrimInput,
  Prisma.PilgrimDelegate
> {
  constructor() {
    super(db.pilgrim, {
      searchFields: ["name", "nickName", "email", "phone", "passportNumber", "code"],
    })
  }

  findByIdWithRelations(id: string): Promise<PilgrimWithRelations | null> {
    return this.delegate.findUnique({
      where: { id },
      include: pilgrimInclude,
    }) as Promise<PilgrimWithRelations | null>
  }

  findByIdTrashed(id: string): Promise<Pilgrim | null> {
    return this.delegate.findUnique({
      where: { id },
    })
  }
}

export const pilgrimRepository = new PilgrimRepository()
