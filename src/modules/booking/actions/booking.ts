"use server"

import { requirePermission } from "@/modules/business/lib/permission"
import { bookingService } from "../services/booking.service"
import { bookingInclude } from "../repositories/booking.repository"
import {
  bookingQuerySchema,
  createBookingSchema,
  updateBookingSchema,
  updateBookingStatusSchema,
} from "../validations/booking.schema"
import type {
  BookingQueryInput,
  CreateBookingInput,
  UpdateBookingInput,
  UpdateBookingStatusInput,
} from "../validations/booking.schema"
import {
  remainingBalance,
  type BookingDetail,
  type BookingListItem,
} from "../types"

export async function getBookings(params: unknown) {
  await requirePermission("booking:read")

  const query = bookingQuerySchema.parse(params) as BookingQueryInput

  const result = await bookingService.findAll({
    page: query.page,
    limit: query.limit,
    search: query.search,
    sort: query.sort,
    order: query.order,
    status: query.status,
    includeDeleted: query.includeDeleted,
    include: bookingInclude,
  })

  return {
    data: result.data.map(toListItem),
    pagination: result.pagination,
  }
}

export async function getBooking(id: string) {
  await requirePermission("booking:read")
  const detail = await bookingService.getDetail(id)
  return detail ? toDetail(detail) : null
}

export async function createBooking(data: unknown) {
  const user = await requirePermission("booking:create")

  const parsed = createBookingSchema.parse(data) as CreateBookingInput
  const created = await bookingService.create(parsed, user.id)

  return { id: created.id, bookingNumber: created.bookingNumber }
}

export async function updateBooking(id: string, data: unknown) {
  await requirePermission("booking:update")

  const parsed = updateBookingSchema.parse(data) as UpdateBookingInput
  const updated = await bookingService.update(id, parsed)

  return { id: updated.id }
}

export async function updateBookingStatus(id: string, data: unknown) {
  await requirePermission("booking:update")

  const parsed = updateBookingStatusSchema.parse(data) as UpdateBookingStatusInput
  const updated = await bookingService.updateStatus(id, parsed.status)

  return { id: updated.id, status: updated.status }
}

export async function cancelBooking(id: string) {
  await requirePermission("booking:update")
  const updated = await bookingService.cancel(id)
  return { id: updated.id, status: updated.status }
}

export async function deleteBooking(id: string) {
  await requirePermission("booking:delete")
  if (!id || !id.trim()) throw new Error("Booking id wajib diisi")
  await bookingService.softDelete(id)
  return { id }
}

export async function restoreBooking(id: string) {
  await requirePermission("booking:delete")
  if (!id || !id.trim()) throw new Error("Booking id wajib diisi")
  await bookingService.restore(id)
  return { id }
}

/* ------------------------------------------------------------------ */
/* Serialization helpers (Date -> ISO string) for strong-typed clients */
/* ------------------------------------------------------------------ */

function toListItem(row: Record<string, unknown>): BookingListItem {
  const totalPrice = row.totalPrice as number
  const downPayment = (row.downPayment as number) ?? 0
  const customer = row.customer as Record<string, unknown> | undefined
  const pkg = row.package as Record<string, unknown> | undefined
  const schedule = row.schedule as Record<string, unknown> | undefined
  const departureDate = schedule?.departureDate
    ? new Date(schedule.departureDate as string).toISOString()
    : null
  return {
    id: row.id as string,
    bookingNumber: row.bookingNumber as string,
    customerId: row.customerId as string,
    packageId: row.packageId as string,
    scheduleId: row.scheduleId as string,
    customerName: (customer?.name as string) ?? "",
    packageTitle: (pkg?.title as string) ?? "",
    departureDate,
    status: row.status as string,
    totalPrice,
    downPayment,
    remainingBalance: remainingBalance(totalPrice, downPayment),
    notes: row.notes as string,
    createdAt: new Date(row.createdAt as string).toISOString(),
    updatedAt: new Date(row.updatedAt as string).toISOString(),
    deletedAt: row.deletedAt ? new Date(row.deletedAt as string).toISOString() : null,
  }
}

function toDetail(row: Record<string, unknown>): BookingDetail {
  const base = toListItem(row)
  const customer = row.customer as Record<string, unknown>
  const pkg = row.package as Record<string, unknown>
  const schedule = row.schedule as Record<string, unknown>

  return {
    ...base,
    customer: {
      id: customer.id as string,
      code: customer.code as string,
      name: customer.name as string,
      email: (customer.email as string | null) ?? null,
      phone: (customer.phone as string | null) ?? null,
      passportNumber: (customer.passportNumber as string | null) ?? null,
    },
    package: {
      id: pkg.id as string,
      title: pkg.title as string,
      price: pkg.price as number,
      currency: pkg.currency as string,
    },
    schedule: {
      id: schedule.id as string,
      departureDate: schedule.departureDate ? new Date(schedule.departureDate as string).toISOString() : null,
      returnDate: schedule.returnDate ? new Date(schedule.returnDate as string).toISOString() : null,
      meetingPoint: schedule.meetingPoint as string,
    },
  }
}
