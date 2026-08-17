"use server"

import { requirePermission } from "@/modules/business/lib/permission"
import { jamaahService } from "../services/jamaah.service"
import {
  createJamaahSchema,
  jamaahQuerySchema,
  updateJamaahSchema,
} from "../validations/jamaah.schema"
import type {
  CreateJamaahInput,
  JamaahQueryInput,
  UpdateJamaahInput,
} from "../validations/jamaah.schema"
import type { JamaahListItem } from "../types"

export async function getJamaahList(params: unknown) {
  await requirePermission("jamaah:read")

  const query = jamaahQuerySchema.parse(params) as JamaahQueryInput

  const where: Record<string, unknown> = {}
  if (query.bookingId) where.bookingId = query.bookingId
  if (query.gender) where.gender = query.gender

  const result = await jamaahService.findAll({
    page: query.page,
    limit: query.limit,
    search: query.search,
    sort: query.sort,
    order: query.order,
    status: query.status,
    where,
    includeDeleted: query.includeDeleted,
  })

  return {
    data: result.data.map(toListItem),
    pagination: result.pagination,
  }
}

export async function getJamaah(id: string) {
  await requirePermission("jamaah:read")
  const detail = await jamaahService.getDetail(id)
  return detail ? toDetail(detail) : null
}

export async function createJamaah(data: unknown) {
  await requirePermission("jamaah:create")

  const parsed = createJamaahSchema.parse(data) as CreateJamaahInput
  const created = await jamaahService.create(parsed)

  return { id: created.id }
}

export async function updateJamaah(id: string, data: unknown) {
  await requirePermission("jamaah:update")

  const parsed = updateJamaahSchema.parse(data) as UpdateJamaahInput
  const updated = await jamaahService.update(id, parsed)

  return { id: updated.id }
}

export async function deleteJamaah(id: string) {
  await requirePermission("jamaah:delete")
  await jamaahService.softDelete(id)
}

export async function restoreJamaah(id: string) {
  await requirePermission("jamaah:update")
  await jamaahService.restore(id)
}

/* ------------------------------------------------------------------ */
/* Serialization helpers (Date -> ISO string) for strong-typed clients */
/* ------------------------------------------------------------------ */

interface JamaahDocumentListItem {
  id: string
  type: string
  status: string
  mediaId: string | null
  notes: string
  createdAt: string
}

interface JamaahDetail extends JamaahListItem {
  documents: JamaahDocumentListItem[]
}

function toListItem(row: Record<string, unknown>): JamaahListItem {
  return {
    id: row.id as string,
    bookingId: row.bookingId as string,
    fullName: row.fullName as string,
    passportName: row.passportName as string,
    gender: row.gender as string,
    birthPlace: row.birthPlace as string,
    birthDate: row.birthDate ? new Date(row.birthDate as string).toISOString() : null,
    nik: row.nik as string,
    passportNumber: row.passportNumber as string | null,
    passportIssueDate: row.passportIssueDate ? new Date(row.passportIssueDate as string).toISOString() : null,
    passportExpiry: row.passportExpiry ? new Date(row.passportExpiry as string).toISOString() : null,
    province: row.province as string,
    city: row.city as string,
    district: row.district as string,
    village: row.village as string,
    address: row.address as string,
    phone: row.phone as string | null,
    whatsapp: row.whatsapp as string | null,
    photoMediaId: row.photoMediaId as string | null,
    status: row.status as string,
    notes: row.notes as string,
    createdAt: new Date(row.createdAt as string).toISOString(),
    updatedAt: new Date(row.updatedAt as string).toISOString(),
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  }
}

function toDetail(row: Record<string, unknown>): JamaahDetail {
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
