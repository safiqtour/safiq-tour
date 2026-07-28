"use client"

import { motion } from "framer-motion"
import {
  LayoutGrid,
  Building2,
  MapPin,
  Church,
  Users,
  Plane,
  Home,
  Camera,
  Video,
} from "lucide-react"

const categories = [
  { id: "all", label: "All", icon: LayoutGrid },
  { id: "makkah", label: "Makkah", icon: Building2 },
  { id: "madinah", label: "Madinah", icon: MapPin },
  { id: "masjidil-haram", label: "Masjidil Haram", icon: Church },
  { id: "masjid-nabawi", label: "Masjid Nabawi", icon: Church },
  { id: "manasik", label: "Manasik", icon: Users },
  { id: "keberangkatan", label: "Keberangkatan", icon: Plane },
  { id: "kepulangan", label: "Kepulangan", icon: Home },
  { id: "jamaah", label: "Jamaah", icon: Camera },
  { id: "video", label: "Video", icon: Video },
]

type CategoryFilterProps = {
  active: string
  onSelect: (id: string) => void
}

export function CategoryFilter({ active, onSelect }: CategoryFilterProps) {
  return (
    <div className="sticky top-20 z-40 bg-[#F8F6F2]/90 backdrop-blur-md border-b border-[#E5E7EB]">
      <div className="mx-auto max-w-(--container-max) px-3 sm:px-6 lg:px-8">
        <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = active === cat.id
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSelect(cat.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-[#D4AF37] text-white shadow-md shadow-[#D4AF37]/20"
                    : "bg-white text-[#1F2937]/70 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] border border-[#E5E7EB]"
                }`}
                aria-label={`Filter by ${cat.label}`}
              >
                <Icon className="size-4" />
                {cat.label}
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
