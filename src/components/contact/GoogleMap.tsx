"use client"

import { motion } from "framer-motion"

export function GoogleMap() {
  return (
    <section className="py-16 md:py-20 bg-[#F8F6F2]">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-8 text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Lokasi
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">
            Lokasi Kantor Safiq Tour
          </h2>
          <p className="mt-3 text-center text-base text-[#1F2937]/60 md:text-lg">
            Kunjungi kantor kami untuk konsultasi langsung.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="overflow-hidden rounded-2xl shadow-lg"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.5!2d107.5020676!3d-6.86139!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e58f26e31daf%3A0x79410892dcfff9d!2sSAFIQ%20TOUR!5e0!3m2!1sid!2sid!4v1"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Kantor Safiq Tour"
            aria-label="Peta lokasi kantor Safiq Tour"
          />
        </motion.div>
      </div>
    </section>
  )
}
