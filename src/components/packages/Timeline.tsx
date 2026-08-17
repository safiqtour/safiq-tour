"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Plane, ChevronDown } from "lucide-react"
import Image from "next/image"
import { normalizeImageUrl } from "@/lib/utils"
import type { DayItinerary } from "@/data/packages-detail"

type TimelineProps = {
  days: DayItinerary[]
  durationLabel: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
}

/** Kaaba icon (not in lucide) — lucide-style stroke SVG: cube body, kiswah band, door. */
function KaabaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="4" y="6" width="16" height="14" rx="1" />
      <path d="M4 10h16" />
      <path d="M10 20v-4h4v4" />
    </svg>
  )
}

/** Mosque icon (not in lucide) — dome, prayer hall, two minarets. */
function MosqueIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3c-2.8 1.8-4.5 3.8-4.5 6h9c0-2.2-1.7-4.2-4.5-6Z" />
      <path d="M12 3V1.5" />
      <path d="M5 21v-8h14v8" />
      <path d="M2 21h20" />
      <path d="M10 21v-2.5a2 2 0 0 1 4 0V21" />
      <path d="M2.5 21v-9l1.1-1.6L4.7 12v9" />
      <path d="M19.3 21v-9l1.1-1.6 1.1 1.6v9" />
    </svg>
  )
}

/** Pick an icon from itinerary title keywords (Kaaba / Mosque / Plane / MapPin default). */
function dayIcon(title: string) {
  const t = title.toLowerCase()
  if (/umroh|umrah|makkah|mekkah|ka'?bah|kaaba|haram/.test(t)) return KaabaIcon
  if (/madinah|madina|nabawi|medina/.test(t)) return MosqueIcon
  if (/flight|bandara|terbang|penerbangan|airport|tiba|berangkat|pulang|indonesia|jakarta/.test(t)) return Plane
  return MapPin
}

/** Decode common HTML entities (named + numeric) for plain-text display. */
function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&apos;": "'", "&nbsp;": " ",
  }
  return text
    .replace(/&(?:amp|lt|gt|quot|apos|nbsp);/g, (m) => named[m] ?? m)
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
}

/**
 * Convert TipTap HTML to clean plain text: paragraph/block boundaries become
 * line breaks, every other tag is stripped, and entities are decoded. Rendered
 * as plain text (React escapes output), so this is XSS-safe. Display-only —
 * the stored HTML is never modified.
 */
function htmlToText(html: string): string {
  return decodeEntities(
    html
      .replace(/<\s*br\s*\/?\s*>/gi, "\n")
      .replace(/<\s*\/\s*(p|div|li|ul|ol|h[1-6]|blockquote|tr)\s*>/gi, "\n")
      .replace(/<[^>]*>/g, "")
  )
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

/** One timeline item: day node on the gold rail + premium card with keyword icon and expandable detail. */
function DayCard({ item }: { item: DayItinerary }) {
  const [expanded, setExpanded] = useState(false)
  const desc = htmlToText(item.desc ?? "")
  const isLong = desc.length > 120
  const Icon = dayIcon(item.title)

  return (
    <div className="relative flex gap-4 md:gap-5">
      {/* Day node (sits on the gold rail) */}
      <span className="z-10 flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[#D4AF37] bg-[#0B2D5C] text-sm font-bold text-white shadow-lg shadow-[#D4AF37]/20 md:size-12 md:text-base">
        {item.day}
      </span>

      {/* Card */}
      <div className="min-w-0 flex-1 rounded-2xl border border-[#0B2D5C]/8 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D4AF37]/20 hover:shadow-md md:p-6">
        <div className="flex items-start gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <Icon className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">Hari {item.day}</p>
            <h3 className="mt-0.5 text-base font-bold text-[#0B2D5C] md:text-lg">{item.title}</h3>
          </div>
        </div>

        {/* Day photo — only rendered when an image exists (never an empty box) */}
        {item.image && (
          <div className="relative mt-3 aspect-video max-h-[250px] w-full overflow-hidden rounded-xl">
            <Image
              src={normalizeImageUrl(item.image)}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 640px"
            />
          </div>
        )}

        {desc && (
          <div className="mt-3">
            <p className={`whitespace-pre-line text-sm leading-relaxed text-[#1E293B]/60 ${expanded ? "hidden" : "line-clamp-2"}`}>
              {desc}
            </p>
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <p className="whitespace-pre-line text-sm leading-relaxed text-[#1E293B]/60">{desc}</p>
            </motion.div>
            {isLong && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#D4AF37] transition-colors hover:text-[#C49A2E]"
              >
                {expanded ? "Tutup Detail" : "Lihat Detail"}
                <ChevronDown className={`size-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function Timeline({ days, durationLabel }: TimelineProps) {
  // Hide the entire section (badge, title, timeline, rail) when the package has
  // no itinerary data.
  if (!days || days.length === 0) return null
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
            Itinerary
          </span>
          <h2
            className="mt-4 font-playfair text-3xl font-bold leading-tight text-[#0B2D5C] md:text-4xl"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Rencana Perjalanan
          </h2>
          <p className="mt-3 text-center text-base text-[#1E293B]/60 md:text-lg">
            Perjalanan ibadah {durationLabel.toLowerCase()} yang penuh keberkahan
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="relative mx-auto max-w-3xl"
        >
          {/* Gold vertical rail behind the day nodes */}
          <div className="absolute bottom-2 left-[19px] top-2 w-px bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/40 to-transparent md:left-[23px]" />

          <div className="flex flex-col gap-6 md:gap-8">
            {days.map((item) => (
              <motion.div key={item.day} variants={itemVariants}>
                <DayCard item={item} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="mb-2 mt-10 text-center text-xs italic text-[#9CA3AF] md:text-sm">
          *Program dapat berubah sesuai kondisi di lapangan*
        </p>
      </div>
    </section>
  )
}
