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

/**
 * Allowed status transitions (booking state machine).
 * CANCELLED is terminal: no outgoing transitions.
 */
const BOOKING_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
  DRAFT: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PAID", "CANCELLED"],
  PAID: ["CANCELLED"],
  CANCELLED: [],
}

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
      // Validate departure-seat availability and atomically reserve a seat before inserting.
      await this.reserveSeat(tx, data.scheduleId)
      return tx.booking.create({
        data: {
          bookingNumber,
          customerId: data.customerId,
          packageId: data.packageId,
          scheduleId: data.scheduleId,
          status: "DRAFT",
          totalPrice: data.totalPrice,
          downPayment: data.downPayment ?? 0,
          notes: data.notes ?? "",
          createdById: createdById ?? null,
        },
      })
    })
  }

  /**
   * Atomically reserve one seat on the schedule inside the booking transaction.
   * - seat > 0  : seatFilled must be < seat. The increment is a conditional update,
   *               so two concurrent bookings cannot both take the last seat.
   * - seat === 0: unlimited — no seat reserved, no blocking.
   */
  private async reserveSeat(tx: Tx, scheduleId: string) {
    const schedule = await tx.packageSchedule.findUnique({ where: { id: scheduleId } })
    if (!schedule) throw new Error("Jadwal keberangkatan tidak ditemukan")

    if (schedule.seat > 0) {
      const reserved = await tx.packageSchedule.updateMany({
        where: {
          id: scheduleId,
          seatFilled: { lt: tx.packageSchedule.fields.seat },
        },
        data: { seatFilled: { increment: 1 } },
      })
      if (reserved.count === 0) throw new Error("Departure seat is full")
    }
  }

  /** Release one reserved seat on cancellation. Skips unlimited (seat === 0) schedules; never below 0. */
  private async releaseSeat(tx: Tx, scheduleId: string) {
    const schedule = await tx.packageSchedule.findUnique({ where: { id: scheduleId } })
    if (!schedule || schedule.seat <= 0) return

    await tx.packageSchedule.updateMany({
      where: { id: scheduleId, seatFilled: { gt: 0 } },
      data: { seatFilled: { decrement: 1 } },
    })
  }

  async update(id: string, data: UpdateBookingInput) {
    const booking = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.booking.findUnique({ where: { id } })
      if (!existing) throw new Error("Booking not found")
      if (existing.status === CANCELLED) throw new Error("Booking yang dibatalkan tidak dapat diubah")

      // Rebalance the seat when the departure schedule changes: release the old
      // schedule's seat, then reserve the new one. All inside the same transaction,
      // so a failed reserve rolls the release back (full rollback safety).
      if (data.scheduleId !== undefined && data.scheduleId !== existing.scheduleId) {
        await this.releaseSeat(tx, existing.scheduleId)
        await this.reserveSeat(tx, data.scheduleId)
      }

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
    let previousStatus: string | undefined
    const booking = await db.$transaction(async (tx: Tx) => {
      const existing = await tx.booking.findUnique({ where: { id } })
      if (!existing) throw new Error("Booking not found")
      if (existing.status === status) return existing
      this.assertValidTransition(existing.status, status)
      previousStatus = existing.status
      // Release the reserved seat when a booking is cancelled, inside the same transaction.
      // releaseSeat skips unlimited schedules and never lets seatFilled drop below 0.
      if (status === CANCELLED) await this.releaseSeat(tx, existing.scheduleId)
      return tx.booking.update({ where: { id }, data: { status } })
    })

    await audit({
      action: "UPDATE",
      resource: "booking",
      resourceId: id,
      // Metadata clearly captures the cancellation / status change even though the
      // audit action stays the existing "UPDATE" convention.
      metadata: { previousStatus, newStatus: status, bookingNumber: booking.bookingNumber },
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
    // Enforce the whitelisted state machine. CANCELLED has no outgoing transitions.
    const allowed = BOOKING_STATUS_TRANSITIONS[from] ?? []
    if (!allowed.includes(to)) {
      throw new Error(`Transisi status tidak diizinkan: ${from} -> ${to}`)
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
