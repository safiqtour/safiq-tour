"use client"

import { motion } from "framer-motion"
import Link from "next/link"

const BOTTOM_LINKS = [
  { label: "Kebijakan Privasi", href: "/privacy" },
  { label: "Syarat & Ketentuan", href: "/terms" },
  { label: "Sitemap", href: "/sitemap" },
] as const

function FooterBottom() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="border-t border-white/5 py-6"
    >
      <div className="flex flex-col items-center justify-between gap-4 text-xs text-gray-500 md:flex-row">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <Link href="/" className="transition-colors hover:text-[#D4AF37]">
            Safiq Tour
          </Link>
          . All rights reserved.
        </p>

        <nav aria-label="Footer legal links" className="flex items-center gap-4">
          {BOTTOM_LINKS.map((link, i) => (
            <span key={link.href} className="flex items-center gap-4">
              <Link
                href={link.href}
                className="transition-colors hover:text-[#D4AF37]"
              >
                {link.label}
              </Link>
              {i < BOTTOM_LINKS.length - 1 && (
                <span className="text-white/10" aria-hidden="true">
                  |
                </span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}

export { FooterBottom }
