import { z } from "zod"

/**
 * Public contact form payload. Deliberately minimal — visitors do not
 * authenticate; the message is persisted as a Customer record tagged
 * `[CONTACT]` in `notes` so the customer service team can follow up.
 */
export const contactLeadSchema = z.object({
  name: z.string().trim().min(2, "Nama lengkap wajib diisi").max(200, "Nama terlalu panjang"),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp wajib diisi")
    .max(30, "Nomor WhatsApp terlalu panjang"),
  email: z.string().trim().email("Email tidak valid").max(200).optional(),
  subject: z.string().trim().max(200, "Subjek terlalu panjang").optional(),
  message: z.string().trim().min(1, "Pesan wajib diisi").max(2000, "Pesan terlalu panjang"),
})

export type ContactLeadInput = z.infer<typeof contactLeadSchema>