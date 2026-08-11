"use client"

import { motion } from "framer-motion"
import { ShieldCheck, DollarSign, Plane, FileText, ListChecks, CreditCard } from "lucide-react"

/**
 * "Syarat & Ketentuan" — static terms section shown below the flight itinerary
 * on the public package detail page. Content is intentionally hardcoded for
 * now (no database field yet).
 */
const TERMS = [
  {
    icon: DollarSign,
    text: "Harga dapat berubah mengikuti kebijakan maskapai, hotel, dan kondisi operasional.",
  },
  {
    icon: Plane,
    text: "Jadwal penerbangan dapat berubah sesuai kebijakan maskapai.",
  },
  {
    icon: FileText,
    text: "Peserta wajib melengkapi dokumen perjalanan sesuai ketentuan yang berlaku.",
  },
  {
    icon: ListChecks,
    text: "Itinerary dapat disesuaikan dengan kondisi lapangan.",
  },
  {
    icon: CreditCard,
    text: "Pembayaran mengikuti ketentuan Safiq Tour.",
  },
]

export function TermsConditions() {
  return (
    <section className="bg-[#F8FAFC] py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-4 py-1 text-xs font-semibold tracking-wider text-[#8a6d1f] uppercase">
            <ShieldCheck className="size-3.5" /> Syarat & Ketentuan
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Syarat & Ketentuan
          </h2>
          <p className="mt-3 text-center text-base text-[#0B2D5C]/60 md:text-lg">
            Ketentuan umum yang berlaku untuk setiap keberangkatan bersama Safiq Tour
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-3xl rounded-2xl border border-[#0B2D5C]/8 bg-white p-6 shadow-lg shadow-black/5 md:p-10"
        >
          <ul className="flex flex-col gap-3 md:gap-4">
            {TERMS.map((term) => (
              <li
                key={term.text}
                className="flex items-start gap-4 rounded-xl border border-[#0B2D5C]/5 bg-[#F8FAFC] p-4 transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-md hover:shadow-[#D4AF37]/5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
                  <term.icon className="size-5" />
                </span>
                <p className="pt-2 text-sm leading-relaxed text-[#0B2D5C]/80 md:text-base">
                  {term.text}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-[#0B2D5C]/8 pt-5 text-center text-xs leading-relaxed text-[#0B2D5C]/45 md:text-sm">
            Dengan melakukan pendaftaran, jamaah dianggap telah membaca, memahami,
            dan menyetujui seluruh Syarat & Ketentuan di atas.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
