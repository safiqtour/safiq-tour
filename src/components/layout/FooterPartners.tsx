"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const PARTNERS = [
  { src: "/images/Saudi-Airlines.png", alt: "Saudi Airlines" },
  { src: "/images/Garuda-Indonesia.png", alt: "Garuda Indonesia" },
  { src: "/images/Lion-Air.png", alt: "Lion Air" },
  { src: "/images/Emirates.png", alt: "Emirates" },
  { src: "/images/Qatar-Airways.png", alt: "Qatar Airways" },
]

function FooterPartners() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className="border-t border-white/5 py-10"
    >
      <p className="mb-6 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">
        Mitra Resmi
      </p>
      <div className="flex flex-wrap items-center justify-center gap-8 px-4">
        {PARTNERS.map((partner) => (
          <div
            key={partner.alt}
            className="group grayscale transition-all duration-500 hover:grayscale-0"
          >
            <Image
              src={partner.src}
              alt={partner.alt}
              width={100}
              height={40}
              className="h-8 w-auto object-contain opacity-40 transition-all duration-500 group-hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export { FooterPartners }
