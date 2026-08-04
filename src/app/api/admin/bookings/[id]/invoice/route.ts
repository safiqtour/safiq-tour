import { NextRequest, NextResponse } from "next/server"
import { requirePermission } from "@/modules/business/lib/permission"
import { bookingRepository } from "@/modules/booking/repositories/booking.repository"
import { generateBookingInvoicePdf } from "@/modules/booking/pdf/invoice-generator"

/**
 * On-demand invoice PDF for a booking.
 * GET /api/admin/bookings/[id]/invoice
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await requirePermission("invoice:read")

  const { id } = await params
  const booking = await bookingRepository.findByIdWithRelations(id)
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  const pdf = await generateBookingInvoicePdf(booking)

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${booking.bookingNumber}-invoice.pdf"`,
    },
  })
}
