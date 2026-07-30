export const SYMBOL_POSITIONS = ["PREFIX", "SUFFIX"] as const
export type SymbolPosition = (typeof SYMBOL_POSITIONS)[number]

export interface CurrencyListItem {
  id: string
  code: string
  slug: string
  name: string
  isoCode: string
  symbol: string
  symbolPosition: string
  decimalDigits: number
  thousandSeparator: string
  decimalSeparator: string
  exchangeRate: number
  isBaseCurrency: boolean
  countryId: string | null
  country?: { id: string; name: string } | null
  sortOrder: number
  status: string
  createdAt: Date | string
  updatedAt: Date | string
  deletedAt: Date | string | null
}
