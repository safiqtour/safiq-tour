export const VISA_TYPES = [
  "UMRAH",
  "HAJJ",
  "TOURIST",
  "BUSINESS",
  "TRANSIT",
  "WORK",
  "STUDENT",
  "OTHER",
] as const

export type VisaType = (typeof VISA_TYPES)[number]

export const ENTRY_TYPES = ["SINGLE", "DOUBLE", "MULTIPLE"] as const
export type EntryType = (typeof ENTRY_TYPES)[number]

export interface VisaListItem {
  id: string
  code: string
  slug: string
  name: string
  countryId: string
  country?: { id: string; name: string } | null
  visaType: string
  entryType: string
  processingDays: number
  validityDays: number
  stayDurationDays: number
  requirement: string
  notes: string
  isElectronic: boolean
  sortOrder: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
