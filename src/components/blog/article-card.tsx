"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/blog/utils"

type ArticleCardProps = {
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
  index?: number
}

export function ArticleCard({ article, index = 0 }: ArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block h-full"
      >
        <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C89B3C]/5">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute left-3 top-3">
              <Badge variant="outline" className="border-0 bg-white/90 text-xs font-semibold text-[#0B3C6D] shadow-sm backdrop-blur-sm">
                {article.category}
              </Badge>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-5">
            <div className="flex items-center gap-3 text-xs text-[#6B7280]">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(article.publishDate)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="size-3" />
                {article.readTime} min
              </span>
            </div>
            <h3 className="mt-3 font-heading text-base font-bold leading-snug text-[#0B3C6D] transition-colors duration-300 group-hover:text-[#C89B3C]">
              {article.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#6B7280] line-clamp-2">
              {article.excerpt}
            </p>
            <div className="mt-auto flex items-center justify-between pt-4">
              <span className="inline-flex items-center gap-1 text-xs text-[#9CA3AF]">
                <User className="size-3" />
                {article.author}
              </span>
              <span className="text-xs font-semibold text-[#C89B3C] transition-all duration-300 group-hover:translate-x-1">
                Baca Artikel →
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  )
}
