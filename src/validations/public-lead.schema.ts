import { z } from "zod"

/**
 * Public package registration (lead) form payload. Deliberately minimal —
 * visitors do not authenticate and do not select a schedule; the customer
 * service team follows up via WhatsApp.
 */
export const publicLeadSchema = z.object({
  slug: z.string().min(1, "Paket tidak valid"),
  name: z.string().trim().min(2, "Nama lengkap wajib diisi").max(200, "Nama terlalu panjang"),
  whatsapp: z
    .string()
    .trim()
    .min(8, "Nomor WhatsApp wajib diisi")
    .max(30, "Nomor WhatsApp terlalu panjang"),
  email: z.string().trim().email("Email tidak valid").max(200).optional(),
  jumlahJamaah: z.coerce
    .number()
    .int("Jumlah jamaah harus angka")
    .min(1, "Jumlah jamaah minimal 1")
    .max(100, "Jumlah jamaah maksimal 100"),
  catatan: z.string().trim().max(2000, "Catatan terlalu panjang").optional(),
})

export type PublicLeadInput = z.infer<typeof publicLeadSchema>
