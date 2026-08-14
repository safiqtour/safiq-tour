/**
 * WhatsApp helpers for public CTAs.
 *
 * The WhatsApp business number lives in the BusinessSetting row
 * `whatsapp.default_number` (seeded as "+6281234567890"). Public components
 * must NOT hardcode a number, so this module centralises number normalization
 * and wa.me deep-link construction. Everything here is pure (no server-only
 * imports) so it is safe to use from client components.
 */

/** Fallback used only when the BusinessSetting row is missing/unreadable. */
export const DEFAULT_WHATSAPP_NUMBER = "6281234567890"

/**
 * Normalize any common Indonesian phone format into an international wa.me
 * number (digits only, no "+", leading "0" rewritten as "62").
 *
 *   +6281234567890 -> 6281234567890
 *   6281234567890  -> 6281234567890
 *   081234567890   -> 6281234567890
 */
export function normalizeWhatsAppNumber(input: string): string {
  let digits = (input ?? "").replace(/\D/g, "")
  if (!digits) return DEFAULT_WHATSAPP_NUMBER
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`
  else if (!digits.startsWith("62")) digits = `62${digits}`
  return digits
}

/** Build a wa.me deep link with a URL-encoded message. */
export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${normalizeWhatsAppNumber(number)}?text=${encodeURIComponent(message)}`
}

/** Pre-filled consultation message for a specific package. */
export function buildPackageConsultationMessage(title: string): string {
  return `Assalamu'alaikum Safiq Tour, saya ingin konsultasi mengenai paket ${title}. Mohon informasi lebih lanjut mengenai jadwal keberangkatan, fasilitas, dan pendaftarannya.`
}

/** Pre-filled registration/follow-up message for a specific package. */
export function buildPackageRegistrationMessage(
  title: string,
  opts: { name?: string; jumlahJamaah?: number; catatan?: string } = {},
): string {
  const lines = [
    `Assalamu'alaikum Safiq Tour, saya ingin mendaftar paket ${title}.`,
    opts.name ? `Nama: ${opts.name}` : null,
    opts.jumlahJamaah ? `Jumlah Jamaah: ${opts.jumlahJamaah}` : null,
    opts.catatan ? `Catatan: ${opts.catatan}` : null,
  ].filter((l): l is string => Boolean(l))
  return lines.join("\n")
}
