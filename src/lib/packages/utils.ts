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
