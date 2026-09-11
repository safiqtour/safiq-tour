export const CUSTOMER_GENDERS = ["MALE", "FEMALE"] as const
export type CustomerGender = (typeof CUSTOMER_GENDERS)[number]

export const CUSTOMER_STATUSES = ["ACTIVE", "INACTIVE", "BLOCKED"] as const
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number]

export const CUSTOMER_DOCUMENT_TYPES = ["PASSPORT", "VISA", "VACCINE", "PHOTO", "KK", "NIKAH"] as const
export type CustomerDocumentType = (typeof CUSTOMER_DOCUMENT_TYPES)[number]

export const CUSTOMER_DOCUMENT_STATUSES = ["PENDING", "COLLECTED", "VERIFIED", "REJECTED", "SUBMITTED"] as const
export type CustomerDocumentStatus = (typeof CUSTOMER_DOCUMENT_STATUSES)[number]

/**
 * Serialized view of a Customer row used by the UI list. Sensitive fields
 * (nik, passportExpiry) are excluded and passportNumber is masked.
 */
export interface CustomerListItem {
  id: string
  code: string
  name: string
  nickName: string
  email: string | null
  phone: string | null
  gender: string
  birthPlace: string
  birthDate: string | null
  address: string
  nationality: string
  passportNumber: string | null
  photoMediaId: string | null
  status: string
  notes: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
