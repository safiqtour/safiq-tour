"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, MessageCircle, Users, Clock, Plane, Hotel, Loader2 } from "lucide-react"
import Link from "next/link"
import { submitPublicLead } from "@/actions/public-lead"
import { buildWhatsAppUrl, buildPackageRegistrationMessage } from "@/lib/whatsapp"
import { formatPrice } from "@/data/packages"
import type { Package } from "@/data/packages"

const INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
const LABEL_CLASS = "text-xs font-medium text-gray-500"

type Props = {
  pkg: Package
  whatsappNumber: string
}

export function PublicRegistrationForm({ pkg, whatsappNumber }: Props) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState<{ name: string; jumlahJamaah: number } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus("submitting")
    setError("")

    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get("name") ?? "").trim()
    const jumlahJamaah = Number(fd.get("jumlahJamaah") ?? 1)

    const result = await submitPublicLead(fd)
    if (result.success) {
      setSubmitted({ name, jumlahJamaah })
      setStatus("success")
    } else {
      setError(result.error)
      setStatus("error")
    }
  }

  const followUpMessage = buildPackageRegistrationMessage(pkg.title, {
    name: submitted?.name,
    jumlahJamaah: submitted?.jumlahJamaah,
  })
  const followUpUrl = buildWhatsAppUrl(whatsappNumber, followUpMessage)

  return (
    <section className="relative -mt-20 min-h-screen bg-[#0B2D5C]">
      <div className="mx-auto max-w-(--container-max) px-4 pb-12 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-white/10 bg-white/95 p-8 text-center shadow-2xl"
            >
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-50">
                <CheckCircle2 className="size-9 text-green-600" />
              </div>
              <h1 className="mt-6 font-heading text-2xl font-bold text-[#0B2D5C]">Pendaftaran Diterima!</h1>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
                Terima kasih, permintaan pendaftaran paket{" "}
                <span className="font-semibold text-[#0B2D5C]">{pkg.title}</span> telah kami terima.
                Tim Safiq Tour akan segera menghubungi Anda untuk konfirmasi dan langkah selanjutnya.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <a
                  href={followUpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 text-sm font-semibold text-white transition-all duration-300 hover:brightness-110"
                >
                  <MessageCircle className="size-4" />
                  Hubungi Safiq Tour via WhatsApp
                </a>
                <Link
                  href="/packages"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-200 px-6 text-sm font-semibold text-[#0B2D5C] hover:bg-gray-50"
                >
                  Lihat Paket Lainnya
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[#C89B3C]">
                  Pendaftaran Paket
                </p>
                <h1 className="mt-2 font-heading text-2xl font-bold leading-tight text-[#0B2D5C] md:text-3xl">
                  {pkg.title}
                </h1>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <Clock className="size-5 shrink-0 text-[#C89B3C]" />
                    <div>
                      <p className="text-xs text-gray-500">Durasi</p>
                      <p className="text-sm font-semibold text-[#0B2D5C]">{pkg.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <Plane className="size-5 shrink-0 text-[#C89B3C]" />
                    <div>
                      <p className="text-xs text-gray-500">Maskapai</p>
                      <p className="text-sm font-semibold text-[#0B2D5C]">{pkg.maskapai}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <Hotel className="size-5 shrink-0 text-[#C89B3C]" />
                    <div>
                      <p className="text-xs text-gray-500">Hotel</p>
                      <p className="text-sm font-semibold text-[#0B2D5C]">
                        {pkg.hotelMekah} · {pkg.hotelMadinah}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <div className="flex size-5 shrink-0 items-center justify-center rounded bg-[#D4AF37]/20">
                      <span className="text-xs font-bold text-[#C89B3C]">Rp</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Harga / orang</p>
                      <p className="text-sm font-semibold text-[#0B2D5C]">
                        {pkg.price > 0 ? formatPrice(pkg.price) : "Hubungi kami"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-3xl border border-white/10 bg-white/95 p-6 shadow-2xl sm:p-8"
              >
                <h2 className="font-heading text-lg font-bold text-[#0B2D5C]">Formulir Pendaftaran</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Isi data di bawah ini, tim kami akan menghubungi Anda melalui WhatsApp.
                </p>

                <input type="hidden" name="slug" value={pkg.slug} />

                {error && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>Nama Lengkap *</label>
                    <input name="name" type="text" required minLength={2} className={INPUT_CLASS} placeholder="Nama lengkap Anda" />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Nomor WhatsApp *</label>
                    <input name="whatsapp" type="tel" required className={INPUT_CLASS} placeholder="08xxxxxxxxxx" />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Email (opsional)</label>
                    <input name="email" type="email" className={INPUT_CLASS} placeholder="email@contoh.com" />
                  </div>
                  <div>
                    <label className={LABEL_CLASS}>Jumlah Jamaah *</label>
                    <input name="jumlahJamaah" type="number" min={1} max={100} defaultValue={1} required className={INPUT_CLASS} />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={LABEL_CLASS}>Catatan (opsional)</label>
                    <textarea name="catatan" rows={3} className={`${INPUT_CLASS} min-h-[80px]`} placeholder="Catatan tambahan (opsional)" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-sm font-semibold text-[#0B2D5C] transition-all duration-300 hover:bg-[#C49A2E] hover:shadow-lg hover:shadow-[#D4AF37]/25 disabled:opacity-60"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Users className="size-4" />
                      Daftar Sekarang
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </motion.form>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
