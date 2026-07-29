"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/blog/utils"

type RelatedPostCardProps = {
  article: {
    slug: string
    title: string
    featuredImage: string
    category: string
    publishDate: string
    readTime: number
  }
  index?: number
}

export function RelatedPostCard({ article, index = 0 }: RelatedPostCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        href={`/blog/${article.slug}`}
        className="group block overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute left-3 top-3">
            <Badge variant="outline" className="border-0 bg-white/90 text-xs font-semibold text-[#0B3C6D] shadow-sm">
              {article.category}
            </Badge>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="inline-flex items-center gap-1"><Calendar className="size-3" />{formatDate(article.publishDate)}</span>
            <span className="inline-flex items-center gap-1"><Clock className="size-3" />{article.readTime} min</span>
          </div>
          <h4 className="mt-2 text-sm font-bold leading-snug text-[#0B3C6D] transition-colors duration-300 group-hover:text-[#C89B3C] line-clamp-2">
            {article.title}
          </h4>
        </div>
      </Link>
    </motion.div>
  )
}
