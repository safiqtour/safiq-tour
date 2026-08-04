export const BOOKING_STATUSES = ["DRAFT", "CONFIRMED", "CANCELLED"] as const
export type BookingStatus = (typeof BOOKING_STATUSES)[number]

/**
 * remainingBalance is always derived on the fly from totalPrice - downPayment.
 * Returned by the serialization helpers (actions) so the UI never re-computes it.
 */
export function remainingBalance(totalPrice: number, downPayment: number): number {
  return totalPrice - downPayment
}

/**
 * Serialized view of a Booking row used by the UI. Dates are ISO strings so
 * client components can render them directly.
 */
export interface BookingListItem {
  id: string
  bookingNumber: string
  customerId: string
  packageId: string
  scheduleId: string
  status: string
  totalPrice: number
  downPayment: number
  remainingBalance: number
  notes: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export interface BookingCustomerView {
  id: string
  code: string
  name: string
  email: string | null
  phone: string | null
  passportNumber: string | null
}

export interface BookingPackageView {
  id: string
  title: string
  price: number
  currency: string
}

export interface BookingScheduleView {
  id: string
  departureDate: string | null
  returnDate: string | null
  meetingPoint: string
}

export interface BookingDetail extends BookingListItem {
  customer: BookingCustomerView
  package: BookingPackageView
  schedule: BookingScheduleView
}
