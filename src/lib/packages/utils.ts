export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Human-friendly departure label:
 * - "2026-11-15" (full date) -> "15 November 2026"
 * - "2026-11" (month + year) -> "November 2026"
 * - "2026" (year only)       -> "2026"
 * - empty / invalid          -> null (section hidden)
 * Also accepts a full Date (used by admin tables that receive Prisma rows).
 */
export function formatDepartureLabel(value?: string | Date | null): string | null {
  if (!value) return null
  const s = value instanceof Date ? value.toISOString().slice(0, 10) : String(value).trim()
  if (!s) return null

  const y = s.match(/^(\d{4})$/)
  if (y) return y[1]

  const ym = s.match(/^(\d{4})-(\d{1,2})$/)
  if (ym) {
    const d = new Date(Date.UTC(Number(ym[1]), Number(ym[2]) - 1, 1))
    if (Number.isNaN(d.getTime())) return null
    return d.toLocaleDateString("id-ID", { month: "long", year: "numeric", timeZone: "UTC" })
  }

  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

/**
 * datetime-local inputs produce wall-clock strings ("yyyy-MM-ddTHH:mm") with no
 * timezone. To make the save/load roundtrip lossless regardless of server and
 * browser timezones, the wall clock is stored AS UTC: write appends "Z", read
 * slices the ISO string. The displayed value always equals the entered value.
 */
export function wallClockToDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const base = value.replace(/Z$/, "")
  const withSeconds = base.length === 16 ? `${base}:00` : base
  const d = new Date(`${withSeconds}Z`)
  return isNaN(d.getTime()) ? null : d
}

/** Inverse of wallClockToDate — formats a Date as "yyyy-MM-ddTHH:mm" (UTC slice). */
export function dateToWallClock(date: Date | string | null | undefined): string {
  if (!date) return ""
  const d = date instanceof Date ? date : new Date(date)
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 16)
}
