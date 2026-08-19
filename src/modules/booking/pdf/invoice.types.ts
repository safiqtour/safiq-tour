/** View-model passed to the React PDF <InvoiceDocument/>. Date values are Date objects. */
export interface InvoiceViewData {
  invoiceNumber: string
  issuedAt: Date
  company: {
    name: string
    appUrl: string
    supportPhone: string
    adminEmail: string
  }
  booking: {
    bookingNumber: string
    status: string
    createdAt: Date
  }
  customer: {
    name: string
    email: string | null
    phone: string | null
    address: string
    passportNumber: string | null
  }
  packageInfo: {
    title: string
    price: number
    currency: string
  }
  schedule: {
    departureDate: Date | null
    returnDate: Date | null
    meetingPoint: string
  }
  totalPrice: number
  downPayment: number
  remainingBalance: number
}
