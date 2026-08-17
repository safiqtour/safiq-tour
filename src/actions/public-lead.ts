"use server"

import { customerService } from "@/modules/customer/services/customer.service"
import { createCustomerSchema } from "@/modules/customer/validations/customer.schema"
import { getPublicPackageBySlug } from "@/modules/public/packages"
import { normalizeWhatsAppNumber } from "@/lib/whatsapp"
import { publicLeadSchema } from "@/validations/public-lead.schema"

export type PublicLeadResult = { success: true } | { success: false; error: string }

/**
 * Public package registration (lead). Creates a Customer record (the prospect /
 * jamaah entity) tagged with `[LEAD]` notes so the CS team can follow up. The
 * admin Booking flow is intentionally NOT touched — its model requires a
 * customer + schedule + seat reservation, which do not apply to an anonymous
 * public enquiry.
 */
export async function submitPublicLead(formData: FormData): Promise<PublicLeadResult> {
  const raw = {
    slug: formData.get("slug"),
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    email: (formData.get("email") as string | null)?.trim() || undefined,
    jumlahJamaah: formData.get("jumlahJamaah") ?? "1",
    catatan: (formData.get("catatan") as string | null)?.trim() || undefined,
  }

  const parsed = publicLeadSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? "Data pendaftaran tidak valid" }
  }

  const pub = await getPublicPackageBySlug(parsed.data.slug)
  if (!pub) {
    return { success: false, error: "Paket tidak ditemukan atau belum tersedia." }
  }

  const title = pub.card.title
  const notes = [
    `[LEAD] Paket: ${title} (${parsed.data.slug})`,
    `Jumlah Jamaah: ${parsed.data.jumlahJamaah}`,
    parsed.data.catatan ? `Catatan: ${parsed.data.catatan}` : null,
  ]
    .filter((l): l is string => Boolean(l))
    .join("\n")

  try {
    // Reuse the existing customer module (validation + code generation + audit)
    // instead of duplicating it. createCustomerSchema fills the sensible defaults.
    const customerData = createCustomerSchema.parse({
      name: parsed.data.name,
      phone: normalizeWhatsAppNumber(parsed.data.whatsapp),
      email: parsed.data.email ?? null,
      notes,
    })
    await customerService.create(customerData)
  } catch (error) {
    console.error("[submitPublicLead] gagal membuat lead:", error)
    return { success: false, error: "Maaf, pendaftaran gagal. Silakan coba lagi atau hubungi kami via WhatsApp." }
  }

  return { success: true }
}
