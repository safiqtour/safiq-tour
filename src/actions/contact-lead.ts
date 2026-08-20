"use server"

import { customerService } from "@/modules/customer/services/customer.service"
import { createCustomerSchema } from "@/modules/customer/validations/customer.schema"
import { normalizeWhatsAppNumber } from "@/lib/whatsapp"
import { contactLeadSchema } from "@/validations/contact-lead.schema"

export type ContactLeadResult = { success: true } | { success: false; error: string }

/**
 * Public contact form (lead). Persists the message as a Customer record tagged
 * with `[CONTACT]` in `notes` so the CS team can follow up in the existing
 * Customers admin. Reuses the customer module (validation + code generation +
 * audit) instead of creating a new model.
 */
export async function submitContactLead(formData: FormData): Promise<ContactLeadResult> {
  const raw = {
    name: formData.get("name"),
    whatsapp: formData.get("whatsapp"),
    email: (formData.get("email") as string | null)?.trim() || undefined,
    subject: (formData.get("subject") as string | null)?.trim() || undefined,
    message: (formData.get("message") as string | null)?.trim() || undefined,
  }

  const parsed = contactLeadSchema.safeParse(raw)
  if (!parsed.success) {
    const first = parsed.error.issues[0]
    return { success: false, error: first?.message ?? "Data pesan tidak valid" }
  }

  const subject =
    parsed.data.subject && parsed.data.subject.trim().length > 0
      ? parsed.data.subject.trim()
      : "Tanpa Subjek"

  const notes = [
    "[CONTACT]",
    `Subjek: ${subject}`,
    `Pesan: ${parsed.data.message}`,
  ].join("\n")

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
    console.error("[submitContactLead] gagal menyimpan pesan:", error)
    return {
      success: false,
      error: "Pesan belum berhasil dikirim. Silakan coba lagi atau hubungi kami melalui WhatsApp.",
    }
  }

  return { success: true }
}