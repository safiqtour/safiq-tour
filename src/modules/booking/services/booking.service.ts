import { db } from "@/lib/prisma/db"
import type { Prisma, Booking } from "@prisma/client"
import { BaseService } from "@/modules/business/services/base.service"
import { audit } from "@/modules/business/lib/audit"
import { bookingRepository } from "../repositories/booking.repository"
import type {
  CreateBookingInput,
  UpdateBookingInput,
  UpdateBookingStatusInput,
} from "../validations/booking.schema"

type Tx = Prisma.TransactionClient

const CANCELLED = "CANCELLED"

export class BookingService extends BaseService<Booking, CreateBookingInput, UpdateBookingInput> {
  constructor() {
    super(bookingRepository, "booking")
  }

  async create(data: CreateBookingInput, createdById?: string) {
    // Retry on bookingNumber collision (P2002) — the number is a per-day
    // sequence and concurrent inserts could race.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const booking = await this.createAttempt(data, createdById)
        await audit({
          action: "CREATE",
          resource: "booking",
          resourceId: booking.id,
          metadata: { bookingNumber: booking.bookingNumber },
        })
        return booking
      } catch (error) {
        if (this.isUniqueError(error)) continue
        throw error
      }
    }
    throw new Error("Gagal mengalokasikan nomor booking yang unik")
  }

  private async createAttempt(data: CreateBookingInput, createdById?: string) {
    return db.$transaction(async (tx: Tx) => {
      const bookingNumber = await this.generateBookingNumber(tx)
      return tx.booking.create({
        data: {
          bookingNumber,
          customerId: data.customerId,
          packageId: data.packageId,
          scheduleId: data.scheduleId,
          status: data.status ?? "DRAFT",
          totalPrice: data.totalPrice,
          downPayment: data.downPayment ?? 0,
          notes: data.notes ?? "",
          createdById: createdById ?? null,
        },
      })
    })
  }

  async update(id: string, data: UpdateBookingInput) {
    const booking = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.booking.findUnique({ where: { id } })
      if (!existing) throw new Error("Booking not found")
      if (existing.status === CANCELLED) throw new Error("Booking yang dibatalkan tidak dapat diubah")

      return tx.booking.update({
        where: { id },
        data: {
          ...(data.customerId !== undefined ? { customerId: data.customerId } : {}),
          ...(data.packageId !== undefined ? { packageId: data.packageId } : {}),
          ...(data.scheduleId !== undefined ? { scheduleId: data.scheduleId } : {}),
          ...(data.totalPrice !== undefined ? { totalPrice: data.totalPrice } : {}),
          ...(data.downPayment !== undefined ? { downPayment: data.downPayment } : {}),
          ...(data.notes !== undefined ? { notes: data.notes } : {}),
        },
      })
    })

    await audit({
      action: "UPDATE",
      resource: "booking",
      resourceId: id,
      metadata: { bookingNumber: booking.bookingNumber },
    })
    return booking
  }

  async updateStatus(id: string, status: UpdateBookingStatusInput["status"]) {
    const booking = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.booking.findUnique({ where: { id } })
      if (!existing) throw new Error("Booking not found")
      if (existing.status === status) return existing
      this.assertValidTransition(existing.status, status)
      return tx.booking.update({ where: { id }, data: { status } })
    })

    await audit({
      action: "UPDATE",
      resource: "booking",
      resourceId: id,
      metadata: { status, bookingNumber: booking.bookingNumber },
    })
    return booking
  }

  cancel(id: string) {
    return this.updateStatus(id, CANCELLED)
  }

  async getDetail(id: string) {
    return bookingRepository.findByIdWithRelations(id)
  }

  private assertValidTransition(from: string, to: string) {
    // CANCELLED is terminal for the MVP lifecycle (DRAFT / CONFIRMED only).
    if (from === CANCELLED && to !== CANCELLED) {
      throw new Error("Booking yang dibatalkan tidak dapat diaktifkan kembali")
    }
  }

  /**
   * Format: BKG-YYYYMMDD-xxxxx (per-day sequence). The 5-digit suffix makes
   * the number human-friendly and resets daily.
   */
  private async generateBookingNumber(tx: Tx): Promise<string> {
    const yyyymmdd = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const count = await tx.booking.count({
      where: { bookingNumber: { startsWith: `BKG-${yyyymmdd}-` } },
    })
    return `BKG-${yyyymmdd}-${String(count + 1).padStart(5, "0")}`
  }

  private isUniqueError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      (error as { code?: string }).code === "P2002"
    )
  }
}

export const bookingService = new BookingService()
