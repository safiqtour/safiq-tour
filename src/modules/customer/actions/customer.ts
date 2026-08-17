"use server"

import { requirePermission } from "@/modules/business/lib/permission"
import { customerService } from "../services/customer.service"
import {
  createCustomerSchema,
  customerQuerySchema,
  updateCustomerSchema,
} from "../validations/customer.schema"
import type {
  CreateCustomerInput,
  CustomerQueryInput,
  UpdateCustomerInput,
} from "../validations/customer.schema"
import type { CustomerListItem } from "../types"

export async function getCustomers(params: unknown) {
  await requirePermission("customer:read")

  const query = customerQuerySchema.parse(params) as CustomerQueryInput

  const result = await customerService.findAll({
    page: query.page,
    limit: query.limit,
    search: query.search,
    sort: query.sort,
    order: query.order,
    status: query.status,
    ...(query.gender ? { where: { gender: query.gender } } : {}),
    includeDeleted: query.includeDeleted,
  })

  return {
    data: result.data.map(toListItem),
    pagination: result.pagination,
  }
}

export async function getCustomer(id: string) {
  await requirePermission("customer:read")
  const detail = await customerService.getDetail(id)
  return detail ? toDetail(detail) : null
}

export async function createCustomer(data: unknown) {
  await requirePermission("customer:create")

  const parsed = createCustomerSchema.parse(data) as CreateCustomerInput
  const created = await customerService.create(parsed)

  return { id: created.id }
}

export async function updateCustomer(id: string, data: unknown) {
  await requirePermission("customer:update")

  const parsed = updateCustomerSchema.parse(data) as UpdateCustomerInput
  const updated = await customerService.update(id, parsed)

  return { id: updated.id }
}

export async function deleteCustomer(id: string) {
  await requirePermission("customer:delete")
  await customerService.softDelete(id)
}

export async function restoreCustomer(id: string) {
  await requirePermission("customer:update")
  await customerService.restore(id)
}

export async function verifyCustomerDocument(documentId: string) {
  const user = await requirePermission("document:update")
  await customerService.verifyDocument(documentId, user.id)
}

export async function rejectCustomerDocument(documentId: string) {
  const user = await requirePermission("document:update")
  await customerService.rejectDocument(documentId, user.id)
}

/* ------------------------------------------------------------------ */
/* Serialization helpers (Date -> ISO string) for strong-typed clients */
/* ------------------------------------------------------------------ */

interface CustomerDocumentListItem {
  id: string
  type: string
  status: string
  mediaId: string | null
  notes: string
  createdAt: string
}

interface CustomerDetail extends CustomerListItem {
  email: string | null
  phone: string | null
  documents: CustomerDocumentListItem[]
}

function toListItem(row: Record<string, unknown>): CustomerListItem {
  return {
    id: row.id as string,
    code: row.code as string,
    name: row.name as string,
    nickName: row.nickName as string,
    email: row.email as string | null,
    phone: row.phone as string | null,
    gender: row.gender as string,
    birthPlace: row.birthPlace as string,
    birthDate: row.birthDate ? new Date(row.birthDate as string).toISOString() : null,
    address: row.address as string,
    nationality: row.nationality as string,
    nik: row.nik as string,
    passportNumber: row.passportNumber as string | null,
    passportExpiry: row.passportExpiry ? new Date(row.passportExpiry as string).toISOString() : null,
    photoMediaId: row.photoMediaId as string | null,
    status: row.status as string,
    notes: row.notes as string,
    createdAt: new Date(row.createdAt as string).toISOString(),
    updatedAt: new Date(row.updatedAt as string).toISOString(),
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  }
}

function toDetail(row: Record<string, unknown>): CustomerDetail {
  const base = toListItem(row)
  const documents = (Array.isArray(row.documents) ? row.documents : []) as Record<string, unknown>[]
  return {
    ...base,
    documents: documents.map((doc) => ({
      id: doc.id as string,
      type: doc.type as string,
      status: doc.status as string,
      mediaId: doc.mediaId as string | null,
      notes: doc.notes as string,
      createdAt: new Date(doc.createdAt as string).toISOString(),
    })),
  }
}
