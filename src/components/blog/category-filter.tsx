"use client"

import { motion } from "framer-motion"
import { type BlogCategory } from "@/lib/blog/types"

const ALL_CATEGORIES: (BlogCategory | "Semua")[] = [
  "Semua",
  "Edukasi Umroh",
  "Tips Perjalanan",
  "Sejarah Islam",
  "Dokumentasi Jamaah",
  "Informasi Safiq Tour",
]

type CategoryFilterProps = {
  selected: string
  onSelect: (category: string) => void
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((cat, i) => (
        <motion.button
          key={cat}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          onClick={() => onSelect(cat === "Semua" ? "" : cat)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
            selected === (cat === "Semua" ? "" : cat)
              ? "border-[#C89B3C] bg-[#C89B3C] text-white shadow-md"
              : "border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#C89B3C]/50 hover:text-[#C89B3C]"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  )
}
