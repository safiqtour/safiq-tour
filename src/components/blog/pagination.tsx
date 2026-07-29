"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | "...")[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...")
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mt-12 flex items-center justify-center gap-2"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex size-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] transition-all duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((page, i) =>
        page === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-[#6B7280]">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex size-10 items-center justify-center rounded-xl text-sm font-semibold transition-all duration-300 ${
              page === currentPage
                ? "bg-[#C89B3C] text-white shadow-md"
                : "border border-[#E5E7EB] bg-white text-[#6B7280] hover:border-[#C89B3C] hover:text-[#C89B3C]"
            }`}
          >
            {page}
          </button>
        ),
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex size-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#6B7280] transition-all duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRight className="size-4" />
      </button>
    </motion.div>
  )
}
