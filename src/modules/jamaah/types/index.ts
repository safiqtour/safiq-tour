export const JAMAHAH_GENDERS = ["MALE", "FEMALE"] as const
export type JamaahGender = (typeof JAMAHAH_GENDERS)[number]

export const JAMAHAH_STATUSES = ["ACTIVE", "INACTIVE"] as const
export type JamaahStatus = (typeof JAMAHAH_STATUSES)[number]

export const JAMAHAH_DOCUMENT_TYPES = ["PASSPORT", "KTP", "KK", "PHOTO"] as const
export type JamaahDocumentType = (typeof JAMAHAH_DOCUMENT_TYPES)[number]

export const JAMAHAH_DOCUMENT_STATUSES = ["PENDING", "COLLECTED", "VERIFIED", "REJECTED", "SUBMITTED"] as const
export type JamaahDocumentStatus = (typeof JAMAHAH_DOCUMENT_STATUSES)[number]

/**
 * Serialized view of a Jamaah row used by the UI. Date fields are kept as
 * `string | null` (ISO) so client components can render them directly.
 */
export interface JamaahListItem {
  id: string
  bookingId: string
  fullName: string
  passportName: string
  gender: string
  birthPlace: string
  birthDate: string | null
  nik: string
  passportNumber: string | null
  passportIssueDate: string | null
  passportExpiry: string | null
  province: string
  city: string
  district: string
  village: string
  address: string
  phone: string | null
  whatsapp: string | null
  photoMediaId: string | null
  status: string
  notes: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
