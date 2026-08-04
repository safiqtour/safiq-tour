import { db } from "@/lib/prisma/db"
import type { Prisma, Booking } from "@prisma/client"
import { BaseRepository } from "@/modules/business/repositories/base.repository"
import type { CreateBookingInput, UpdateBookingInput } from "../validations/booking.schema"

export const bookingInclude = {
  customer: true,
  package: true,
  schedule: true,
} satisfies Prisma.BookingInclude

export type BookingWithRelations = Prisma.BookingGetPayload<{ include: typeof bookingInclude }>

export class BookingRepository extends BaseRepository<
  Booking,
  CreateBookingInput,
  UpdateBookingInput,
  Prisma.BookingDelegate
> {
  constructor() {
    super(db.booking, { searchFields: ["bookingNumber"] })
  }

  findByIdWithRelations(id: string): Promise<BookingWithRelations | null> {
    return this.delegate.findUnique({
      where: { id },
      include: bookingInclude,
    }) as Promise<BookingWithRelations | null>
  }

  findByIdTrashed(id: string): Promise<Booking | null> {
    return this.delegate.findUnique({ where: { id } })
  }
}

export const bookingRepository = new BookingRepository()
