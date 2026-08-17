"use server"

import { db } from "@/lib/prisma/db"
import { getWritableSession } from "@/services/auth.integration.service"
import { requirePermission } from "@/modules/business/lib/permission"
import { normalizeWhatsAppNumber } from "@/lib/whatsapp"

const WHATSAPP_KEY = "whatsapp.default_number"

/**
 * Read the persisted WhatsApp number from BusinessSetting for the admin Settings
 * page. The value is a public setting, so only an authenticated session is
 * required to read it.
 */
export async function getWhatsAppSetting(): Promise<string> {
  const session = await getWritableSession()
  if (!session?.user?.id) throw new Error("Unauthorized")

  const setting = await db.businessSetting.findFirst({
    where: { key: WHATSAPP_KEY },
    select: { value: true },
  })
  return setting?.value ?? ""
}

/**
 * Persist the WhatsApp number. The value is normalized to international digits
 * (e.g. "+6282211624747" / "082211624747" -> "6282211624747") so storage and the
 * public wa.me link stay consistent.
 */
export async function saveWhatsAppSetting(value: string): Promise<{ value: string }> {
  await requirePermission("master.business-setting:update")

  const trimmed = (value ?? "").trim()
  if (!trimmed) throw new Error("Nomor WhatsApp wajib diisi")

  const normalized = normalizeWhatsAppNumber(trimmed)

  await db.businessSetting.upsert({
    where: { key: WHATSAPP_KEY },
    update: { value: normalized },
    create: {
      key: WHATSAPP_KEY,
      group: "WHATSAPP",
      value: normalized,
      valueType: "STRING",
      label: "Default Phone Number",
      description: "Default WhatsApp business number",
      isPublic: true,
    },
  })

  return { value: normalized }
}
