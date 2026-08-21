"use client"

import { motion } from "framer-motion"
import { MapPinned, PhoneCall, Clock3, Globe, ExternalLink } from "lucide-react"
import Link from "next/link"

const cards = [
  {
    icon: MapPinned,
    title: "Alamat Kantor",
    content: [
      "Perumahan Cimareme Indah Blok A5 No.01",
      "Desa Cimareme",
      "Kecamatan Ngamprah",
      "Kabupaten Bandung Barat",
      "Jawa Barat 40552",
      "Indonesia",
    ],
    action: {
      label: "Lihat di Google Maps",
      href: "https://maps.google.com/?q=Perumahan+Cimareme+Indah+Blok+A5+No.01+Bandung+Barat",
      external: true,
    },
  },
  {
    icon: PhoneCall,
    title: "WhatsApp",
    content: ["0822 1162 4747"],
    description: "Konsultasi Gratis",
    action: {
      label: "Chat Sekarang",
      href: "https://wa.me/6282211624747",
      external: true,
    },
  },
  {
    icon: Clock3,
    title: "Jam Operasional",
    content: [
      "Senin – Jumat",
      "08.00 – 17.00 WIB",
      "",
      "Sabtu",
      "08.00 – 17.00 WIB",
      "",
      "Minggu",
      "By Appointment",
    ],
  },
  {
    icon: Globe,
    title: "Website",
    content: ["safiqtour.id"],
    action: {
      label: "Kunjungi Website",
      href: "https://safiqtour.id",
      external: true,
    },
  },
]

function CardContent({ icon: Icon, title, content, description, action }: typeof cards[number]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="group flex flex-col rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#D4AF37]/5"
    >
      <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37] transition-colors duration-300 group-hover:bg-[#D4AF37] group-hover:text-white">
        <Icon className="size-5" />
      </div>

      <h3 className="font-heading text-lg font-bold text-[#0F2343]">{title}</h3>

      <div className="mt-3 space-y-0.5">
        {content.map((line, i) => {
          if (line === "") {
            return <div key={i} className="h-1" />
          }
          if (i === content.length - 1 && content[content.length - 1] === line && line.includes(".")) {
            return (
              <p key={i} className="text-sm text-[#1F2937]/70">{line}</p>
            )
          }
          return (
            <p key={i} className="text-sm text-[#1F2937]/70">{line}</p>
          )
        })}
      </div>

      {description && (
        <p className="mt-1 text-xs font-medium text-[#D4AF37]">{description}</p>
      )}

      {action && (
        <div className="mt-5 pt-4 border-t border-[#E5E7EB]">
          <Link
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4AF37] transition-colors duration-300 hover:text-[#C49A2E]"
          >
            {action.label}
            <ExternalLink className="size-3.5" />
          </Link>
        </div>
      )}
    </motion.div>
  )
}

export function ContactCards() {
  return (
    <section className="py-16 md:py-20 bg-[#F8F6F2]">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <CardContent key={card.title} {...card} />
          ))}
        </div>
      </div>
    </section>
  )
}
