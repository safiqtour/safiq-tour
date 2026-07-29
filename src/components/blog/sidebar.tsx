"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Calendar, ArrowRight } from "lucide-react"
import { type BlogArticle, type BlogCategory } from "@/lib/blog/types"
import { formatDate } from "@/lib/blog/utils"

type SidebarProps = {
  currentSlug?: string
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (category: string) => void
  articles: BlogArticle[]
}

export function Sidebar({ currentSlug, searchQuery, onSearchChange, selectedCategory, onCategoryChange, articles }: SidebarProps) {
  const recentArticles = articles
    .filter((a) => a.slug !== currentSlug)
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
    .slice(0, 5)

  const allTags = [...new Set(articles.flatMap((a) => a.tags))].slice(0, 15)

  const categories: { label: string; value: string; count: number }[] = [
    { label: "Semua Artikel", value: "", count: articles.length },
    ...(["Edukasi Umroh", "Tips Perjalanan", "Sejarah Islam", "Dokumentasi Jamaah", "Informasi Safiq Tour"] as BlogCategory[]).map((cat) => ({
      label: cat,
      value: cat,
      count: articles.filter((a) => a.category === cat).length,
    })),
  ]

  return (
    <aside className="space-y-8">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#9CA3AF]" />
        <input
          type="text"
          placeholder="Cari artikel..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-2xl border border-[#E5E7EB] bg-white py-3.5 pl-11 pr-4 text-sm text-[#0B3C6D] placeholder:text-[#9CA3AF] outline-none transition-all duration-300 focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20"
        />
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
        <h3 className="font-heading text-sm font-bold text-[#0B3C6D]">Kategori</h3>
        <div className="mt-4 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => onCategoryChange(cat.value)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-all duration-300 ${
                selectedCategory === cat.value
                  ? "bg-[#C89B3C]/10 font-semibold text-[#C89B3C]"
                  : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#0B3C6D]"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${
                selectedCategory === cat.value ? "bg-[#C89B3C] text-white" : "bg-[#F8FAFC] text-[#9CA3AF]"
              }`}>{cat.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
        <h3 className="font-heading text-sm font-bold text-[#0B3C6D]">Artikel Terbaru</h3>
        <div className="mt-4 space-y-4">
          {recentArticles.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Link
                href={`/blog/${article.slug}`}
                className="group flex gap-3"
              >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={article.featuredImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold leading-snug text-[#0B3C6D] transition-colors duration-300 group-hover:text-[#C89B3C] line-clamp-2">
                    {article.title}
                  </h4>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-[#9CA3AF]">
                    <Calendar className="size-3" />
                    {formatDate(article.publishDate)}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg">
        <h3 className="font-heading text-sm font-bold text-[#0B3C6D]">Tags</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className="rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-3 py-1.5 text-xs text-[#6B7280] transition-all duration-300 hover:border-[#C89B3C] hover:text-[#C89B3C]"
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[#C89B3C]/20 bg-gradient-to-br from-[#C89B3C]/5 to-[#0B3C6D]/5 p-6 shadow-lg">
        <h3 className="font-heading text-sm font-bold text-[#0B3C6D]">Hubungi Kami</h3>
        <p className="mt-2 text-xs leading-relaxed text-[#6B7280]">
          Konsultasikan perjalanan umroh Anda dengan tim Safiq Tour. Kami siap membantu.
        </p>
        <Link
          href="/contact"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#C89B3C] transition-all duration-300 hover:gap-3"
        >
          Hubungi Kami <ArrowRight className="size-4" />
        </Link>
      </div>
    </aside>
  )
}
