import { z } from "zod"
import { BOOKING_STATUSES } from "../types"

export const bookingFieldsSchema = z.object({
  customerId: z.string().min(1, "Customer wajib diisi"),
  packageId: z.string().min(1, "Paket wajib diisi"),
  scheduleId: z.string().min(1, "Jadwal keberangkatan wajib diisi"),
  totalPrice: z.coerce.number().int().min(0, "Harga total tidak boleh negatif"),
})

export const createBookingSchema = bookingFieldsSchema.extend({
  downPayment: z.coerce.number().int().min(0, "Uang muka tidak boleh negatif").default(0),
  status: z.enum(BOOKING_STATUSES).optional(),
  notes: z.string().trim().max(2000).optional().default(""),
})

export const updateBookingSchema = bookingFieldsSchema.partial().extend({
  downPayment: z.coerce.number().int().min(0, "Uang muka tidak boleh negatif").optional(),
  status: z.enum(BOOKING_STATUSES).optional(),
  notes: z.string().trim().max(2000).optional(),
})

export const updateBookingStatusSchema = z.object({
  status: z.enum(BOOKING_STATUSES),
})

export const bookingQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).optional(),
  status: z.enum(BOOKING_STATUSES).optional(),
  includeDeleted: z.coerce.boolean().optional(),
})

export type BookingFieldsInput = z.infer<typeof bookingFieldsSchema>
export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>
export type UpdateBookingStatusInput = z.infer<typeof updateBookingStatusSchema>
export type BookingQueryInput = z.infer<typeof bookingQuerySchema>
