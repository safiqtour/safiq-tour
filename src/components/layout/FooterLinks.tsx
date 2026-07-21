"use client"

import { motion, type Variants } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Globe, ExternalLink, MessageCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const QUICK_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/about" },
  { label: "Paket Umroh", href: "/packages" },
  { label: "Galeri", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Kontak", href: "/contact" },
] as const

const PACKAGE_LINKS = [
  { label: "Zamzam Express", href: "/packages?category=zamzam" },
  { label: "Thaibah Deluxe", href: "/packages?category=thaibah" },
  { label: "Rawdah VIP", href: "/packages?category=rawdah" },
  { label: "Firdaus Plus", href: "/packages?category=firdaus" },
  { label: "Ramadhan Special", href: "/packages?category=ramadhan" },
] as const

const SOCIAL_LINKS = [
  { label: "Instagram", href: "#", icon: Globe },
  { label: "Facebook", href: "#", icon: ExternalLink },
  { label: "Youtube", href: "#", icon: MessageCircle },
] as const

const CONTACT_INFO = [
  { icon: MapPin, text: "Perumahan Cimareme Indah Blok A5 No.01, Desa Cimareme, Kecamatan Ngamprah, Kabupaten Bandung Barat, Jawa Barat, 40552, Indonesia" },
  { icon: Phone, text: "0822 1162 4747" },
  { icon: Mail, text: "info@safiqtour.com" },
  { icon: Clock, text: "Sen - Sab, 08:00 - 17:00 WIB" },
] as const

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

function FooterLinks() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={itemVariants} className="space-y-5">
        <Link href="/" className="inline-flex items-center gap-3">
          <Image
            src="/images/logo-safiq.png"
            alt="Safiq Tour"
            width={140}
            height={36}
            className="h-9 w-auto brightness-0 invert"
          />
        </Link>
        <p className="text-sm leading-relaxed text-gray-400">
          PT. Safiq Oto Mandiri (Safiq Tour) adalah biro perjalanan Umroh resmi terdaftar di Kementerian Agama RI,
          berkomitmen memberikan pelayanan ibadah terbaik, amanah, dan profesional.
        </p>
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => {
            const Icon = social.icon
            return (
              <Link
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37]"
              >
                <Icon className="size-4" />
              </Link>
            )
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
          Quick Links
        </h3>
        <ul className="space-y-3">
          {QUICK_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-all duration-300 hover:text-[#D4AF37]"
              >
                <span className="h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-3" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
          Paket Umroh
        </h3>
        <ul className="space-y-3">
          {PACKAGE_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group inline-flex items-center gap-1.5 text-sm text-gray-400 transition-all duration-300 hover:text-[#D4AF37]"
              >
                <span className="h-px w-0 bg-[#D4AF37] transition-all duration-300 group-hover:w-3" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="font-heading text-sm font-semibold tracking-wider text-white uppercase">
          Kontak
        </h3>
        <ul className="space-y-3">
          {CONTACT_INFO.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.text} className="flex items-start gap-3 text-sm text-gray-400">
                <Icon className="mt-0.5 size-4 shrink-0 text-[#D4AF37]" />
                <span>{item.text}</span>
              </li>
            )
          })}
        </ul>
      </motion.div>
    </motion.div>
  )
}

export { FooterLinks }
