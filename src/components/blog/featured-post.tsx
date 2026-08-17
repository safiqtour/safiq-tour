"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/blog/utils"

type FeaturedPostProps = {
  article: {
    slug: string
    title: string
    excerpt: string
    featuredImage: string
    category: string
    author: string
    publishDate: string
    readTime: number
  }
}

export function FeaturedPost({ article }: FeaturedPostProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-[#C89B3C]/5"
      >
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[400px] overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#C89B3C] px-3 py-1 text-xs font-bold text-white shadow-lg">
                <Star className="size-3 fill-white" />
                Featured
              </span>
              <Badge variant="outline" className="border-0 bg-white/90 text-xs font-semibold text-[#0B3C6D] shadow-sm backdrop-blur-sm">
                {article.category}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col justify-center p-6 md:p-10">
            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3.5" />
                {formatDate(article.publishDate)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3.5" />
                {article.readTime} menit baca
              </span>
            </div>
            <h2 className="mt-3 font-heading text-xl font-bold leading-tight text-[#0B3C6D] transition-colors duration-300 group-hover:text-[#C89B3C] md:text-2xl">
              {article.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#6B7280] md:text-base">
              {article.excerpt}
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#C89B3C] transition-all duration-300 group-hover:gap-3">
              Baca Selengkapnya
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
