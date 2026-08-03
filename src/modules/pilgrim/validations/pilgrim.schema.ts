import { z } from "zod"
import {
  PILGRIM_DOCUMENT_STATUSES,
  PILGRIM_DOCUMENT_TYPES,
  PILGRIM_GENDERS,
  PILGRIM_STATUSES,
} from "../types"

export const pilgrimDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(PILGRIM_DOCUMENT_TYPES),
  status: z.enum(PILGRIM_DOCUMENT_STATUSES).default("PENDING"),
  mediaId: z.string().nullable().optional(),
  notes: z.string().max(2000).optional().default(""),
})

export const pilgrimFieldsSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(200),
  nickName: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email("Email tidak valid").max(200).nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  gender: z.enum(PILGRIM_GENDERS).default("MALE"),
  birthPlace: z.string().trim().max(200).optional().default(""),
  birthDate: z.coerce.date().nullable().optional(),
  address: z.string().trim().max(500).optional().default(""),
  nationality: z.string().trim().max(100).optional().default(""),
  nik: z.string().trim().max(20).optional().default(""),
  passportNumber: z.string().trim().max(30).nullable().optional(),
  passportExpiry: z.coerce.date().nullable().optional(),
  photoMediaId: z.string().nullable().optional(),
  status: z.enum(PILGRIM_STATUSES).default("ACTIVE"),
  notes: z.string().trim().max(2000).optional().default(""),
})

export const createPilgrimSchema = pilgrimFieldsSchema.extend({
  documents: z.array(pilgrimDocumentSchema).optional().default([]),
})

export const updatePilgrimSchema = pilgrimFieldsSchema.partial().extend({
  documents: z.array(pilgrimDocumentSchema).optional(),
})

export const pilgrimQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.enum(PILGRIM_STATUSES).optional(),
  gender: z.enum(PILGRIM_GENDERS).optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type PilgrimDocumentInput = z.infer<typeof pilgrimDocumentSchema>
export type CreatePilgrimInput = z.infer<typeof createPilgrimSchema>
export type UpdatePilgrimInput = z.infer<typeof updatePilgrimSchema>
export type PilgrimQueryInput = z.infer<typeof pilgrimQuerySchema>
