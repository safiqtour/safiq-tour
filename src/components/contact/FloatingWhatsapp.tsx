"use client"

import { motion } from "framer-motion"
import { MessageCircle } from "lucide-react"
import Link from "next/link"

export function FloatingWhatsapp() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-6 right-6 z-50"
    >
      <Link
        href="https://wa.me/6282211624747"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/30"
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="size-6" />
        <motion.span
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-40"
        />
      </Link>
    </motion.div>
  )
}
