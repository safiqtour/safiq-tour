"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    q: "Apa saja yang termasuk dalam paket Zamzam Express?",
    a: "Paket Zamzam Express meliputi tiket pesawat PP, visa umroh, hotel bintang 4 di Mekkah dan Madinah, makan 3x sehari, air zamzam, transportasi bus AC, perlengkapan ibadah, pembimbing ibadah, asuransi perjalanan, dan handling bandara.",
  },
  {
    q: "Berapa lama durasi paket Zamzam Express?",
    a: "Paket Zamzam Express memiliki durasi 9 hari perjalanan, dengan itinerary yang sudah dirancang untuk kenyamanan ibadah.",
  },
  {
    q: "Maskapai apa yang digunakan?",
    a: "Kami menggunakan maskapai Qatar Airways dan Emirates yang telah terpercaya memberikan layanan penerbangan terbaik.",
  },
  {
    q: "Apakah pembimbing ibadah bersertifikasi?",
    a: "Ya, seluruh pembimbing ibadah Safiq Tour memiliki sertifikasi resmi dan pengalaman panjang dalam mendampingi jamaah umroh.",
  },
  {
    q: "Bagaimana cara pendaftaran paket ini?",
    a: "Pendaftaran dapat dilakukan melalui website, WhatsApp, atau datang langsung ke kantor Safiq Tour. Tim kami akan membantu proses pendaftaran hingga keberangkatan.",
  },
  {
    q: "Apada jadwal keberangkatan tersedia?",
    a: "Kami memiliki jadwal keberangkatan setiap bulan. Silakan hubungi tim kami untuk informasi jadwal terbaru dan ketersediaan kursi.",
  },
  {
    q: "Apakah ada sesi manasik sebelum keberangkatan?",
    a: "Ya, kami menyediakan sesi manasik umroh sebelum keberangkatan untuk mempersiapkan jamaah dalam menjalankan ibadah dengan baik dan sesuai sunnah.",
  },
  {
    q: "Bagaimana jika ada pembatalan?",
    a: "Kebijakan pembatalan mengikuti ketentuan yang berlaku. Silakan hubungi tim kami untuk informasi detail mengenai syarat dan ketentuan pembatalan.",
  },
  {
    q: "Apa kelebihan paket ini dibanding paket lain?",
    a: "Zamzam Express menawarkan keseimbangan terbaik antara harga dan fasilitas. Dengan harga kompetitif, Anda mendapatkan hotel bintang 4 dekat Masjidil Haram, maskapai premium, dan pembimbing ibadah berpengalaman.",
  },
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i)
  }

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Tanya Jawab
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Pertanyaan Umum
          </h2>
          <p className="mt-3 text-center text-base text-[#1E293B]/60 md:text-lg">
            Informasi lengkap seputar paket Zamzam Express
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto max-w-3xl space-y-3"
        >
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border bg-white shadow-sm transition-all duration-300 ${
                openIndex === i
                  ? "border-[#D4AF37]/30 shadow-md"
                  : "border-[#0B2D5C]/8"
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
                aria-expanded={openIndex === i}
              >
                <span className="text-sm font-semibold text-[#0B2D5C] md:text-base">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`size-4 shrink-0 text-[#D4AF37] transition-transform duration-300 ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#0B2D5C]/8 px-5 pb-5 pt-4 md:px-6 md:pb-6">
                      <p className="text-sm leading-relaxed text-[#1E293B]/70 md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
