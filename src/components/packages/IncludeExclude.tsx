"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

type IncludeExcludeProps = {
  included: string[]
  excluded: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

export function IncludeExclude({ included, excluded }: IncludeExcludeProps) {
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
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Fasilitas
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Yang Didapat & Tidak Termasuk
          </h2>
          <p className="mt-3 text-base text-[#1E293B]/60 md:text-lg">
            Informasi lengkap fasilitas paket perjalanan
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50">
                <CheckCircle2 className="size-5 text-emerald-600" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                Termasuk
              </h3>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {included.map((item) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                  className="flex items-center gap-3 rounded-xl border border-[#0B2D5C]/8 bg-white p-3.5 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md"
                >
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-500" />
                  <span className="text-sm text-[#1E293B]/80 md:text-base">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-50">
                <XCircle className="size-5 text-red-500" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#0B2D5C]" style={{ fontFamily: "var(--font-playfair)" }}>
                Tidak Termasuk
              </h3>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {excluded.map((item) => (
                <motion.div
                  key={item}
                  variants={itemVariants}
                  className="flex items-center gap-3 rounded-xl border border-[#0B2D5C]/8 bg-white p-3.5 shadow-sm transition-all duration-300 hover:border-red-200 hover:shadow-md"
                >
                  <XCircle className="size-4 shrink-0 text-red-400" />
                  <span className="text-sm text-[#1E293B]/50 md:text-base">{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
