"use client"

import { motion } from "framer-motion"
import { Camera, MessageSquare, Music2, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

const socials = [
  {
    icon: Camera,
    title: "Instagram",
    username: "@safiqtour",
    href: "https://instagram.com/safiqtour",
    color: "hover:shadow-pink-500/20 hover:border-pink-400/30",
    iconColor: "text-pink-500",
  },
  {
    icon: MessageSquare,
    title: "Facebook",
    username: "Safiq Tour and Travel",
    href: "https://facebook.com/safiqtour",
    color: "hover:shadow-blue-500/20 hover:border-blue-400/30",
    iconColor: "text-blue-600",
  },
  {
    icon: Music2,
    title: "TikTok",
    username: "Safiq Tour",
    href: "https://tiktok.com/@safiqtour",
    color: "hover:shadow-black/10 hover:border-gray-300",
    iconColor: "text-[#1F2937]",
  },
  {
    icon: Globe,
    title: "Website",
    username: "www.safiqtour.com",
    href: "https://www.safiqtour.com",
    color: "hover:shadow-[#D4AF37]/20 hover:border-[#D4AF37]/30",
    iconColor: "text-[#D4AF37]",
  },
]

export function SocialLinks() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-10 text-center"
        >
          <span className="inline-block rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-1 text-xs font-semibold tracking-wider text-[#D4AF37] uppercase">
            Social Media
          </span>
          <h2 className="mt-4 font-heading text-3xl font-bold text-[#0F2343] md:text-4xl">
            Ikuti Kami
          </h2>
          <p className="mt-3 text-center text-base text-[#1F2937]/60 md:text-lg">
            Dapatkan informasi terbaru seputar promo umroh dan kegiatan Safiq Tour.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {socials.map((social, index) => (
            <motion.div
              key={social.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white/80 px-6 py-4 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${social.color}`}
              >
                <div className={`flex size-10 items-center justify-center rounded-xl bg-white shadow-sm transition-colors duration-300 ${social.iconColor}`}>
                  <social.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[#1F2937]/50">{social.title}</p>
                  <p className="text-sm font-semibold text-[#0F2343]">{social.username}</p>
                </div>
                <ExternalLink className="size-4 text-[#1F2937]/30 transition-colors duration-300 group-hover:text-[#D4AF37]" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
