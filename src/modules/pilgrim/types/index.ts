export const PILGRIM_GENDERS = ["MALE", "FEMALE"] as const
export type PilgrimGender = (typeof PILGRIM_GENDERS)[number]

export const PILGRIM_STATUSES = ["ACTIVE", "INACTIVE", "BLOCKED"] as const
export type PilgrimStatus = (typeof PILGRIM_STATUSES)[number]

export const PILGRIM_DOCUMENT_TYPES = ["PASSPORT", "VISA", "VACCINE", "PHOTO", "KK", "NIKAH"] as const
export type PilgrimDocumentType = (typeof PILGRIM_DOCUMENT_TYPES)[number]

export const PILGRIM_DOCUMENT_STATUSES = ["PENDING", "COLLECTED", "VERIFIED", "REJECTED", "SUBMITTED"] as const
export type PilgrimDocumentStatus = (typeof PILGRIM_DOCUMENT_STATUSES)[number]

/**
 * Serialized view of a Pilgrim row used by the UI. `birthDate`/`passportExpiry`
 * are kept as `string | null` so client components can render them directly.
 */
export interface PilgrimListItem {
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
  nik: string
  passportNumber: string | null
  passportExpiry: string | null
  photoMediaId: string | null
  status: string
  notes: string
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}
