import { db } from "@/lib/prisma/db"
import type { Prisma, Pilgrim } from "@prisma/client"
import { BaseService } from "@/modules/business/services/base.service"
import { generateCode } from "@/modules/business/utils/code"
import { audit } from "@/modules/business/lib/audit"
import { pilgrimRepository } from "../repositories/pilgrim.repository"
import type { CreatePilgrimInput, PilgrimDocumentInput, UpdatePilgrimInput } from "../validations/pilgrim.schema"

type Tx = Prisma.TransactionClient
type PilgrimDoc = Prisma.PilgrimDocumentGetPayload<{}>

function toDocFields(doc: PilgrimDocumentInput): Pick<PilgrimDoc, "type" | "status" | "mediaId" | "notes"> {
  return {
    type: doc.type,
    status: doc.status,
    mediaId: doc.mediaId ?? null,
    notes: doc.notes,
  }
}

function areDocsEqual(existing: PilgrimDoc, next: PilgrimDocumentInput): boolean {
  return (
    existing.type === next.type &&
    existing.status === next.status &&
    existing.mediaId === (next.mediaId ?? null) &&
    existing.notes === next.notes
  )
}

export class PilgrimService extends BaseService<Pilgrim, CreatePilgrimInput, UpdatePilgrimInput> {
  constructor() {
    super(pilgrimRepository, "pilgrim")
  }

  async create(data: CreatePilgrimInput) {
    const { documents, ...fields } = data

    const pilgrim = await db.$transaction(async (tx: Tx) => {
      const created = await tx.pilgrim.create({
        data: {
          code: generateCode("PLG"),
          name: fields.name,
          nickName: fields.nickName ?? "",
          email: fields.email ?? null,
          phone: fields.phone ?? null,
          gender: fields.gender,
          birthPlace: fields.birthPlace ?? "",
          birthDate: fields.birthDate ?? null,
          address: fields.address ?? "",
          nationality: fields.nationality ?? "",
          nik: fields.nik ?? "",
          passportNumber: fields.passportNumber ?? null,
          passportExpiry: fields.passportExpiry ?? null,
          photoMediaId: fields.photoMediaId ?? null,
          status: fields.status,
          notes: fields.notes ?? "",
        },
      })

      if (documents.length > 0) {
        // Multi-write inside the same transaction.
        await tx.pilgrimDocument.createMany({
          data: documents.map((doc) => ({
            pilgrimId: created.id,
            ...toDocFields(doc),
          })),
        })
      }

      return created
    })

    await audit({
      action: "CREATE",
      resource: "pilgrim",
      resourceId: pilgrim.id,
      metadata: { name: pilgrim.name },
    })

    return pilgrim
  }

  async update(id: string, data: UpdatePilgrimInput) {
    const { documents, ...fields } = data

    const pilgrim = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.pilgrim.findUnique({ where: { id }, include: { documents: true } })
      if (!existing) throw new Error("Pilgrim not found")

      const updated = await tx.pilgrim.update({
        where: { id },
        data: {
          ...(fields.name !== undefined ? { name: fields.name } : {}),
          ...(fields.nickName !== undefined ? { nickName: fields.nickName } : {}),
          ...(fields.email !== undefined ? { email: fields.email } : {}),
          ...(fields.phone !== undefined ? { phone: fields.phone } : {}),
          ...(fields.gender !== undefined ? { gender: fields.gender } : {}),
          ...(fields.birthPlace !== undefined ? { birthPlace: fields.birthPlace } : {}),
          ...(fields.birthDate !== undefined ? { birthDate: fields.birthDate } : {}),
          ...(fields.address !== undefined ? { address: fields.address } : {}),
          ...(fields.nationality !== undefined ? { nationality: fields.nationality } : {}),
          ...(fields.nik !== undefined ? { nik: fields.nik } : {}),
          ...(fields.passportNumber !== undefined ? { passportNumber: fields.passportNumber } : {}),
          ...(fields.passportExpiry !== undefined ? { passportExpiry: fields.passportExpiry } : {}),
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
      resource: "pilgrim",
      resourceId: id,
      metadata: { name: pilgrim.name },
    })

    return pilgrim
  }

  async getDetail(id: string) {
    return pilgrimRepository.findByIdWithRelations(id)
  }

  async verifyDocument(documentId: string, userId: string) {
    const doc = await db.pilgrimDocument.findUnique({ where: { id: documentId } })
    if (!doc) throw new Error("Document not found")

    const updated = await db.pilgrimDocument.update({
      where: { id: documentId },
      data: { status: "VERIFIED", verifiedById: userId, verifiedAt: new Date() },
    })

    await audit({
      action: "APPROVE",
      resource: "pilgrimDocument",
      resourceId: documentId,
      metadata: { pilgrimId: updated.pilgrimId, type: updated.type },
    })

    return updated
  }

  async rejectDocument(documentId: string, userId: string) {
    const doc = await db.pilgrimDocument.findUnique({ where: { id: documentId } })
    if (!doc) throw new Error("Document not found")

    const updated = await db.pilgrimDocument.update({
      where: { id: documentId },
      data: { status: "REJECTED", verifiedById: userId, verifiedAt: new Date() },
    })

    await audit({
      action: "REJECT",
      resource: "pilgrimDocument",
      resourceId: documentId,
      metadata: { pilgrimId: updated.pilgrimId, type: updated.type },
    })

    return updated
  }

  /**
   * Diff-based document synchronisation inside a transaction.
   *
   * Deliberately avoids the `deleteMany` + `createMany` reset strategy: existing
   * rows are updated in place (upsert-style), new rows are created, and only rows
   * actually removed from the payload are deleted.
   */
  private async syncDocuments(tx: Tx, pilgrimId: string, existing: PilgrimDoc[], incoming: PilgrimDocumentInput[]) {
    const incomingWithId = new Map(
      incoming.filter((doc) => doc.id).map((doc) => [doc.id as string, doc]),
    )

    for (const existingDoc of existing) {
      const next = incomingWithId.get(existingDoc.id)

      if (!next) {
        await tx.pilgrimDocument.delete({ where: { id: existingDoc.id } })
        continue
      }

      if (areDocsEqual(existingDoc, next)) continue

      await tx.pilgrimDocument.update({
        where: { id: existingDoc.id },
        data: toDocFields(next),
      })
    }

    for (const doc of incoming) {
      if (doc.id) continue // already handled by update/delete branch above
      await tx.pilgrimDocument.create({
        data: {
          pilgrimId,
          ...toDocFields(doc),
        },
      })
    }
  }
}

export const pilgrimService = new PilgrimService()
