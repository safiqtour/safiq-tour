import { z } from "zod"
import {
  CUSTOMER_DOCUMENT_STATUSES,
  CUSTOMER_DOCUMENT_TYPES,
  CUSTOMER_GENDERS,
  CUSTOMER_STATUSES,
} from "../types"

export const customerDocumentSchema = z.object({
  id: z.string().optional(),
  type: z.enum(CUSTOMER_DOCUMENT_TYPES),
  status: z.enum(CUSTOMER_DOCUMENT_STATUSES).default("PENDING"),
  mediaId: z.string().nullable().optional(),
  notes: z.string().max(2000).optional().default(""),
})

export const customerFieldsSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi").max(200),
  nickName: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email("Email tidak valid").max(200).nullable().optional(),
  phone: z.string().trim().max(30).nullable().optional(),
  gender: z.enum(CUSTOMER_GENDERS).default("MALE"),
  birthPlace: z.string().trim().max(200).optional().default(""),
  birthDate: z.coerce.date().nullable().optional(),
  address: z.string().trim().max(500).optional().default(""),
  nationality: z.string().trim().max(100).optional().default(""),
  nik: z.string().trim().max(20).optional().default(""),
  passportNumber: z.string().trim().max(30).nullable().optional(),
  passportExpiry: z.coerce.date().nullable().optional(),
  photoMediaId: z.string().nullable().optional(),
  status: z.enum(CUSTOMER_STATUSES).default("ACTIVE"),
  notes: z.string().trim().max(2000).optional().default(""),
})

export const createCustomerSchema = customerFieldsSchema.extend({
  documents: z.array(customerDocumentSchema).optional().default([]),
})

export const updateCustomerSchema = customerFieldsSchema.partial().extend({
  documents: z.array(customerDocumentSchema).optional(),
})

export const customerQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.enum(CUSTOMER_STATUSES).optional(),
  gender: z.enum(CUSTOMER_GENDERS).optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type CustomerDocumentInput = z.infer<typeof customerDocumentSchema>
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>
export type CustomerQueryInput = z.infer<typeof customerQuerySchema>
