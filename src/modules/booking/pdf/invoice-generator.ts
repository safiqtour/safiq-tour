import React from "react"
import { renderToBuffer } from "@react-pdf/renderer"
import { db } from "@/lib/prisma/db"
import { InvoiceDocument } from "./invoice-document"
import type { InvoiceViewData } from "./invoice.types"
import type { BookingWithRelations } from "../repositories/booking.repository"

const SETTING_KEYS = [
  "general.app_name",
  "general.app_url",
  "general.support_phone",
  "general.admin_email",
] as const

/**
 * Format: INV-YYYYMMDD-xxxxx. The 5-digit suffix derives from the booking
 * number so a re-downloaded invoice keeps the same number (stable day-to-day).
 */
export function invoiceNumberFor(booking: { bookingNumber: string }, issuedAt: Date): string {
  const yyyymmdd = issuedAt.toISOString().slice(0, 10).replace(/-/g, "")
  return `INV-${yyyymmdd}-${booking.bookingNumber.slice(-5)}`
}

export async function buildInvoiceViewData(
  booking: BookingWithRelations,
  issuedAt: Date = new Date(),
): Promise<InvoiceViewData> {
  const settings = await db.businessSetting.findMany({ where: { key: { in: [...SETTING_KEYS] } } })
  const map = new Map(settings.map((s) => [s.key, s.value]))

  return {
    invoiceNumber: invoiceNumberFor(booking, issuedAt),
    issuedAt,
    company: {
      name: map.get("general.app_name") ?? "Safiq Tour",
      appUrl: map.get("general.app_url") ?? "",
      supportPhone: map.get("general.support_phone") ?? "",
      adminEmail: map.get("general.admin_email") ?? "",
    },
    booking: {
      bookingNumber: booking.bookingNumber,
      status: booking.status,
      createdAt: booking.createdAt,
    },
    customer: {
      name: booking.customer.name,
      email: booking.customer.email,
      phone: booking.customer.phone,
      address: booking.customer.address,
      passportNumber: booking.customer.passportNumber,
    },
    packageInfo: {
      title: booking.package.title,
      price: booking.package.price,
      currency: booking.package.currency,
    },
    schedule: {
      departureDate: booking.schedule.departureDate,
      returnDate: booking.schedule.returnDate,
      meetingPoint: booking.schedule.meetingPoint,
    },
    totalPrice: booking.totalPrice,
    downPayment: booking.downPayment,
    remainingBalance: booking.totalPrice - booking.downPayment,
  }
}

/** Generates the invoice PDF as a Buffer (on demand; nothing persisted). */
export async function generateBookingInvoicePdf(booking: BookingWithRelations): Promise<Buffer> {
  const view = await buildInvoiceViewData(booking)
  const element = React.createElement(InvoiceDocument, { data: view }) as unknown as Parameters<
    typeof renderToBuffer
  >[0]
  return renderToBuffer(element)
}
