import { cache } from "react"
import { db } from "@/lib/prisma/db"
import { DEFAULT_WHATSAPP_NUMBER, normalizeWhatsAppNumber } from "@/lib/whatsapp"

/**
 * Read the configured WhatsApp number from BusinessSetting
 * (`whatsapp.default_number`). Server-only — import only from server components,
 * server actions, or route handlers so the Prisma client never reaches the
 * browser bundle. Memoized per-request with React cache() so multiple sections
 * of the same page share a single DB read.
 */
export const getWhatsAppNumber = cache(async (): Promise<string> => {
  try {
    const setting = await db.businessSetting.findFirst({
      where: { key: "whatsapp.default_number" },
      select: { value: true },
    })
    if (setting?.value) return normalizeWhatsAppNumber(setting.value)
  } catch (error) {
    console.error("[whatsapp] gagal membaca whatsapp.default_number:", error)
  }
  return DEFAULT_WHATSAPP_NUMBER
})
