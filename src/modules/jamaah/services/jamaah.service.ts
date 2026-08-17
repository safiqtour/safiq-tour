import { db } from "@/lib/prisma/db"
import type { Prisma, Jamaah } from "@prisma/client"
import { BaseService } from "@/modules/business/services/base.service"
import { audit } from "@/modules/business/lib/audit"
import { jamaahRepository } from "../repositories/jamaah.repository"
import type {
  CreateJamaahInput,
  JamaahDocumentInput,
  UpdateJamaahInput,
} from "../validations/jamaah.schema"

type Tx = Prisma.TransactionClient
type JamaahDoc = Prisma.JamaahDocumentGetPayload<Record<string, never>>

function toDocFields(doc: JamaahDocumentInput): Pick<JamaahDoc, "type" | "status" | "mediaId" | "notes"> {
  return {
    type: doc.type,
    status: doc.status,
    mediaId: doc.mediaId ?? null,
    notes: doc.notes,
  }
}

function areDocsEqual(existing: JamaahDoc, next: JamaahDocumentInput): boolean {
  return (
    existing.type === next.type &&
    existing.status === next.status &&
    existing.mediaId === (next.mediaId ?? null) &&
    existing.notes === next.notes
  )
}

export class JamaahService extends BaseService<Jamaah, CreateJamaahInput, UpdateJamaahInput> {
  constructor() {
    super(jamaahRepository, "jamaah")
  }

  async create(data: CreateJamaahInput) {
    const { documents, ...fields } = data

    const jamaah = await db.$transaction(async (tx: Tx) => {
      const created = await tx.jamaah.create({
        data: {
          bookingId: fields.bookingId,
          fullName: fields.fullName,
          passportName: fields.passportName ?? "",
          gender: fields.gender,
          birthPlace: fields.birthPlace ?? "",
          birthDate: fields.birthDate ?? null,
          nik: fields.nik ?? "",
          passportNumber: fields.passportNumber ?? null,
          passportIssueDate: fields.passportIssueDate ?? null,
          passportExpiry: fields.passportExpiry ?? null,
          province: fields.province ?? "",
          city: fields.city ?? "",
          district: fields.district ?? "",
          village: fields.village ?? "",
          address: fields.address ?? "",
          phone: fields.phone ?? null,
          whatsapp: fields.whatsapp ?? null,
          photoMediaId: fields.photoMediaId ?? null,
          status: fields.status,
          notes: fields.notes ?? "",
        },
      })

      if (documents.length > 0) {
        await tx.jamaahDocument.createMany({
          data: documents.map((doc) => ({
            jamaahId: created.id,
            ...toDocFields(doc),
          })),
        })
      }

      return created
    })

    await audit({
      action: "CREATE",
      resource: "jamaah",
      resourceId: jamaah.id,
      metadata: { fullName: jamaah.fullName, bookingId: jamaah.bookingId },
    })

    return jamaah
  }

  async update(id: string, data: UpdateJamaahInput) {
    const { documents, ...fields } = data

    const jamaah = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.jamaah.findUnique({ where: { id }, include: { documents: true } })
      if (!existing) throw new Error("Jamaah not found")

      const updated = await tx.jamaah.update({
        where: { id },
        data: {
          ...(fields.bookingId !== undefined ? { bookingId: fields.bookingId } : {}),
          ...(fields.fullName !== undefined ? { fullName: fields.fullName } : {}),
          ...(fields.passportName !== undefined ? { passportName: fields.passportName } : {}),
          ...(fields.gender !== undefined ? { gender: fields.gender } : {}),
          ...(fields.birthPlace !== undefined ? { birthPlace: fields.birthPlace } : {}),
          ...(fields.birthDate !== undefined ? { birthDate: fields.birthDate } : {}),
          ...(fields.nik !== undefined ? { nik: fields.nik } : {}),
          ...(fields.passportNumber !== undefined ? { passportNumber: fields.passportNumber } : {}),
          ...(fields.passportIssueDate !== undefined ? { passportIssueDate: fields.passportIssueDate } : {}),
          ...(fields.passportExpiry !== undefined ? { passportExpiry: fields.passportExpiry } : {}),
          ...(fields.province !== undefined ? { province: fields.province } : {}),
          ...(fields.city !== undefined ? { city: fields.city } : {}),
          ...(fields.district !== undefined ? { district: fields.district } : {}),
          ...(fields.village !== undefined ? { village: fields.village } : {}),
          ...(fields.address !== undefined ? { address: fields.address } : {}),
          ...(fields.phone !== undefined ? { phone: fields.phone } : {}),
          ...(fields.whatsapp !== undefined ? { whatsapp: fields.whatsapp } : {}),
          ...(fields.photoMediaId !== undefined ? { photoMediaId: fields.photoMediaId } : {}),
          ...(fields.status !== undefined ? { status: fields.status } : {}),
          ...(fields.notes !== undefined ? { notes: fields.notes } : {}),
        },
      })

      if (documents) {
        await this.syncDocuments(tx, existing.id, existing.documents, documents)
      }

      return updated
    })

    await audit({
      action: "UPDATE",
      resource: "jamaah",
      resourceId: id,
      metadata: { fullName: jamaah.fullName, bookingId: jamaah.bookingId },
    })

    return jamaah
  }

  async getDetail(id: string) {
    return jamaahRepository.findByIdWithRelations(id)
  }

  async softDelete(id: string) {
    const existing = await jamaahRepository.findById(id)
    if (!existing) throw new Error("jamaah not found")
    await jamaahRepository.softDelete(id)
    await audit({
      action: "DELETE",
      resource: "jamaah",
      resourceId: id,
      metadata: { fullName: existing.fullName, bookingId: existing.bookingId },
    })
  }

  async restore(id: string) {
    const existing = await jamaahRepository.findById(id)
    if (!existing) throw new Error("jamaah not found")
    await jamaahRepository.restore(id)
    await audit({
      action: "RESTORE",
      resource: "jamaah",
      resourceId: id,
      metadata: { fullName: existing.fullName },
    })
  }

  /**
   * Diff-based document synchronisation inside a transaction. Existing rows are
   * updated in place, new rows are created, and rows removed from the payload
   * are deleted.
   */
  private async syncDocuments(tx: Tx, jamaahId: string, existing: JamaahDoc[], incoming: JamaahDocumentInput[]) {
    const incomingWithId = new Map(
      incoming.filter((doc) => doc.id).map((doc) => [doc.id as string, doc]),
    )

    for (const existingDoc of existing) {
      const next = incomingWithId.get(existingDoc.id)

      if (!next) {
        await tx.jamaahDocument.delete({ where: { id: existingDoc.id } })
        continue
      }

      if (areDocsEqual(existingDoc, next)) continue

      await tx.jamaahDocument.update({
        where: { id: existingDoc.id },
        data: toDocFields(next),
      })
    }

    for (const doc of incoming) {
      if (doc.id) continue // already handled by update/delete branch above
      await tx.jamaahDocument.create({
        data: {
          jamaahId,
          ...toDocFields(doc),
        },
      })
    }
  }
}

export const jamaahService = new JamaahService()

