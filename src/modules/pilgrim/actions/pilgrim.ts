"use server"

import { requirePermission } from "@/modules/business/lib/permission"
import { pilgrimService } from "../services/pilgrim.service"
import {
  createPilgrimSchema,
  pilgrimQuerySchema,
  updatePilgrimSchema,
} from "../validations/pilgrim.schema"
import type {
  CreatePilgrimInput,
  PilgrimQueryInput,
  UpdatePilgrimInput,
} from "../validations/pilgrim.schema"
import type { PilgrimListItem } from "../types"

export async function getPilgrims(params: unknown) {
  await requirePermission("pilgrim:read")

  const query = pilgrimQuerySchema.parse(params) as PilgrimQueryInput

  const result = await pilgrimService.findAll({
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

export async function getPilgrim(id: string) {
  await requirePermission("pilgrim:read")
  const detail = await pilgrimService.getDetail(id)
  return detail ? toDetail(detail) : null
}

export async function createPilgrim(data: unknown) {
  await requirePermission("pilgrim:create")

  const parsed = createPilgrimSchema.parse(data) as CreatePilgrimInput
  const created = await pilgrimService.create(parsed)

  return { id: created.id }
}

export async function updatePilgrim(id: string, data: unknown) {
  await requirePermission("pilgrim:update")

  const parsed = updatePilgrimSchema.parse(data) as UpdatePilgrimInput
  const updated = await pilgrimService.update(id, parsed)

  return { id: updated.id }
}

export async function deletePilgrim(id: string) {
  await requirePermission("pilgrim:delete")
  await pilgrimService.softDelete(id)
}

export async function restorePilgrim(id: string) {
  await requirePermission("pilgrim:update")
  await pilgrimService.restore(id)
}

export async function verifyPilgrimDocument(documentId: string) {
  const user = await requirePermission("document:update")
  await pilgrimService.verifyDocument(documentId, user.id)
}

export async function rejectPilgrimDocument(documentId: string) {
  const user = await requirePermission("document:update")
  await pilgrimService.rejectDocument(documentId, user.id)
}

/* ------------------------------------------------------------------ */
/* Serialization helpers (Date -> ISO string) for strong-typed clients */
/* ------------------------------------------------------------------ */

interface PilgrimDocumentListItem {
  id: string
  type: string
  status: string
  mediaId: string | null
  notes: string
  createdAt: string
}

interface PilgrimDetail extends PilgrimListItem {
  email: string | null
  phone: string | null
  documents: PilgrimDocumentListItem[]
}

function toListItem(row: Record<string, unknown>): PilgrimListItem {
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

function toDetail(row: Record<string, unknown>): PilgrimDetail {
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
