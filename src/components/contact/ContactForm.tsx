"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, CheckCircle } from "lucide-react"

type FormData = {
  name: string
  whatsapp: string
  email: string
  subject: string
  message: string
}

type FormErrors = Partial<Record<keyof FormData, string>>

export function ContactForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    whatsapp: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = "Nama lengkap wajib diisi"
    if (!form.whatsapp.trim()) newErrors.whatsapp = "Nomor WhatsApp wajib diisi"
    if (!form.message.trim()) newErrors.message = "Pesan wajib diisi"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleChange(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[field]
        return next
      })
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitted(true)
  }

  const inputClass = (field: keyof FormData) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#1F2937] outline-none transition-all duration-300 placeholder:text-[#1F2937]/40 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 ${errors[field] ? "border-red-400" : "border-[#E5E7EB]"}`

  if (submitted) {
    return (
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-2xl border border-[#E5E7EB] bg-white p-12 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="size-8 text-green-600" />
            </div>
            <h3 className="font-heading text-xl font-bold text-[#0F2343]">Pesan Terkirim!</h3>
            <p className="mt-2 text-sm text-[#1F2937]/60">
              Terima kasih telah menghubungi Safiq Tour. Tim kami akan merespons pesan Anda segera.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-10 text-center"
          >
            <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
              Konsultasi
            </span>
            <h2 className="mt-4 font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">
              Kirim Pesan
            </h2>
            <p className="mt-3 text-center text-base text-[#1F2937]/60 md:text-lg">
              Isi form di bawah ini dan tim kami akan menghubungi Anda.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm md:p-10"
          >
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F2937]">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama Anda"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className={inputClass("name")}
                  aria-label="Nama Lengkap"
                />
                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F2937]">
                  Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 08123456789"
                  value={form.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  className={inputClass("whatsapp")}
                  aria-label="Nomor WhatsApp"
                />
                {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F2937]">Email</label>
                <input
                  type="email"
                  placeholder="contoh@email.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass("email")}
                  aria-label="Email"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#1F2937]">Subjek</label>
                <input
                  type="text"
                  placeholder="Contoh: Informasi Paket Zamzam"
                  value={form.subject}
                  onChange={(e) => handleChange("subject", e.target.value)}
                  className={inputClass("subject")}
                  aria-label="Subjek"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-[#1F2937]">
                  Pesan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  placeholder="Tulis pesan Anda di sini..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className={`${inputClass("message")} resize-y min-h-[120px]`}
                  aria-label="Pesan"
                />
                {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#D4AF37] px-8 text-sm font-semibold text-[#0F2343] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25"
              >
                <Send className="size-4" />
                Kirim Pesan
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
