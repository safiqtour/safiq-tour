import { z } from "zod"
import {
  JAMAHAH_DOCUMENT_STATUSES,
  JAMAHAH_DOCUMENT_TYPES,
  JAMAHAH_GENDERS,
  JAMAHAH_STATUSES,
} from "../types"

export const jamaahDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(JAMAHAH_DOCUMENT_TYPES),
  status: z.enum(JAMAHAH_DOCUMENT_STATUSES).default("PENDING"),
  mediaId: z.string().nullable().optional(),
  notes: z.string().max(2000).optional().default(""),
})

export const jamaahFieldsSchema = z.object({
  bookingId: z.string().min(1, "Booking wajib diisi"),
  // Personal
  fullName: z.string().trim().min(1, "Nama lengkap wajib diisi").max(200),
  passportName: z.string().trim().max(200).optional().default(""),
  gender: z.enum(JAMAHAH_GENDERS).default("MALE"),
  birthPlace: z.string().trim().max(200).optional().default(""),
  birthDate: z.coerce.date().nullable().optional(),
  nik: z.string().trim().max(20).optional().default(""),
  // Passport
  passportNumber: z.string().trim().max(30).nullable().optional(),
  passportIssueDate: z.coerce.date().nullable().optional(),
  passportExpiry: z.coerce.date().nullable().optional(),
  // Address
  province: z.string().trim().max(200).optional().default(""),
  city: z.string().trim().max(200).optional().default(""),
  district: z.string().trim().max(200).optional().default(""),
  village: z.string().trim().max(200).optional().default(""),
  address: z.string().trim().max(500).optional().default(""),
  // Contact
  phone: z.string().trim().max(30).nullable().optional(),
  whatsapp: z.string().trim().max(30).nullable().optional(),
  photoMediaId: z.string().nullable().optional(),
  status: z.enum(JAMAHAH_STATUSES).default("ACTIVE"),
  notes: z.string().trim().max(2000).optional().default(""),
})

export const createJamaahSchema = jamaahFieldsSchema.extend({
  documents: z.array(jamaahDocumentSchema).optional().default([]),
})

export const updateJamaahSchema = jamaahFieldsSchema.partial().extend({
  documents: z.array(jamaahDocumentSchema).optional(),
})

export const jamaahQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.enum(JAMAHAH_STATUSES).optional(),
  gender: z.enum(JAMAHAH_GENDERS).optional(),
  bookingId: z.string().optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type JamaahDocumentInput = z.infer<typeof jamaahDocumentSchema>
export type CreateJamaahInput = z.infer<typeof createJamaahSchema>
export type UpdateJamaahInput = z.infer<typeof updateJamaahSchema>
export type JamaahQueryInput = z.infer<typeof jamaahQuerySchema>
