import { db } from "@/lib/prisma/db"
import type { Prisma, Customer } from "@prisma/client"
import { BaseService } from "@/modules/business/services/base.service"
import { generateCode } from "@/modules/business/utils/code"
import { audit } from "@/modules/business/lib/audit"
import { customerRepository } from "../repositories/customer.repository"
import type { CreateCustomerInput, CustomerDocumentInput, UpdateCustomerInput } from "../validations/customer.schema"

type Tx = Prisma.TransactionClient
type CustomerDoc = Prisma.CustomerDocumentGetPayload<Record<string, never>>
function toDocFields(doc: CustomerDocumentInput): Pick<CustomerDoc, "type" | "status" | "mediaId" | "notes"> {
  return {
    type: doc.type,
    status: doc.status,
    mediaId: doc.mediaId ?? null,
    notes: doc.notes,
  }
}

function areDocsEqual(existing: CustomerDoc, next: CustomerDocumentInput): boolean {
  return (
    existing.type === next.type &&
    existing.status === next.status &&
    existing.mediaId === (next.mediaId ?? null) &&
    existing.notes === next.notes
  )
}

export class CustomerService extends BaseService<Customer, CreateCustomerInput, UpdateCustomerInput> {
  constructor() {
    super(customerRepository, "customer")
  }

  async create(data: CreateCustomerInput) {
    const { documents, ...fields } = data

    const customer = await db.$transaction(async (tx: Tx) => {
      const created = await tx.customer.create({
        data: {
          code: generateCode("CUS"),
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
        await tx.customerDocument.createMany({
          data: documents.map((doc) => ({
            customerId: created.id,
            ...toDocFields(doc),
          })),
        })
      }

      return created
    })

    await audit({
      action: "CREATE",
      resource: "customer",
      resourceId: customer.id,
      metadata: { name: customer.name },
    })

    return customer
  }

  async update(id: string, data: UpdateCustomerInput) {
    const { documents, ...fields } = data

    const customer = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.customer.findUnique({ where: { id }, include: { documents: true } })
      if (!existing) throw new Error("Customer not found")

      const updated = await tx.customer.update({
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
      resource: "customer",
      resourceId: id,
      metadata: { name: customer.name },
    })

    return customer
  }

  async getDetail(id: string) {
    return customerRepository.findByIdWithRelations(id)
  }

  async verifyDocument(documentId: string, userId: string) {
    const doc = await db.customerDocument.findUnique({ where: { id: documentId } })
    if (!doc) throw new Error("Document not found")

    const updated = await db.customerDocument.update({
      where: { id: documentId },
      data: { status: "VERIFIED", verifiedById: userId, verifiedAt: new Date() },
    })

    await audit({
      action: "APPROVE",
      resource: "customerDocument",
      resourceId: documentId,
      metadata: { customerId: updated.customerId, type: updated.type },
    })

    return updated
  }

  async rejectDocument(documentId: string, userId: string) {
    const doc = await db.customerDocument.findUnique({ where: { id: documentId } })
    if (!doc) throw new Error("Document not found")

    const updated = await db.customerDocument.update({
      where: { id: documentId },
      data: { status: "REJECTED", verifiedById: userId, verifiedAt: new Date() },
    })

    await audit({
      action: "REJECT",
      resource: "customerDocument",
      resourceId: documentId,
      metadata: { customerId: updated.customerId, type: updated.type },
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
  private async syncDocuments(tx: Tx, customerId: string, existing: CustomerDoc[], incoming: CustomerDocumentInput[]) {
    const incomingWithId = new Map(
      incoming.filter((doc) => doc.id).map((doc) => [doc.id as string, doc]),
    )

    for (const existingDoc of existing) {
      const next = incomingWithId.get(existingDoc.id)

      if (!next) {
        await tx.customerDocument.delete({ where: { id: existingDoc.id } })
        continue
      }

      if (areDocsEqual(existingDoc, next)) continue

      await tx.customerDocument.update({
        where: { id: existingDoc.id },
        data: toDocFields(next),
      })
    }

    for (const doc of incoming) {
      if (doc.id) continue // already handled by update/delete branch above
      await tx.customerDocument.create({
        data: {
          customerId,
          ...toDocFields(doc),
        },
      })
    }
  }
}

export const customerService = new CustomerService()
