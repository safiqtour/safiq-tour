"use client"

import { Search } from "lucide-react"

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
      <input
        type="text"
        placeholder="Cari artikel..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3.5 pl-11 pr-4 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20"
      />
    </div>
  )
}
