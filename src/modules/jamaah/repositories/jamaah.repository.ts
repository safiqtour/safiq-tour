import { db } from "@/lib/prisma/db"
import type { Prisma, Jamaah } from "@prisma/client"
import { BaseRepository } from "@/modules/business/repositories/base.repository"
import type { CreateJamaahInput, UpdateJamaahInput } from "../validations/jamaah.schema"

export const jamaahInclude = {
  photoMedia: true,
  documents: {
    orderBy: { createdAt: "desc" as const },
  },
} satisfies Prisma.JamaahInclude

export type JamaahWithRelations = Prisma.JamaahGetPayload<{ include: typeof jamaahInclude }>

/**
 * Strongly-typed repository for the Jamaah entity.
 *
 * The delegate is bound with full type-safety: `db.jamaah` is a native
 * `Prisma.JamaahDelegate` and `BaseRepository` accepts it directly.
 */
export class JamaahRepository extends BaseRepository<
  Jamaah,
  CreateJamaahInput,
  UpdateJamaahInput,
  Prisma.JamaahDelegate
> {
  constructor() {
    super(db.jamaah, {
      searchFields: ["fullName", "passportName", "nik", "passportNumber", "phone", "whatsapp"],
    })
  }

  findByIdWithRelations(id: string): Promise<JamaahWithRelations | null> {
    return this.delegate.findUnique({
      where: { id },
      include: jamaahInclude,
    }) as Promise<JamaahWithRelations | null>
  }

  findByIdTrashed(id: string): Promise<Jamaah | null> {
    return this.delegate.findUnique({
      where: { id },
    })
  }
}

export const jamaahRepository = new JamaahRepository()
