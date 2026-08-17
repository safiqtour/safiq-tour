"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { getArticle } from "@/actions/articles"
import { ArticleForm, type ArticleFormInitial } from "@/components/admin/articles/article-form"

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((v) => String(v))
  return []
}

export default function EditArticlePage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [initial, setInitial] = useState<ArticleFormInitial | undefined>(undefined)

  useEffect(() => {
    getArticle(params.id as string)
      .then((res) => {
        const article = res as unknown as (Record<string, unknown> & { id: string }) | null
        if (!article) {
          setNotFound(true)
          return
        }
        setInitial({
          id: article.id,
          title: String(article.title ?? ""),
          slug: String(article.slug ?? ""),
          excerpt: String(article.excerpt ?? ""),
          content: String(article.content ?? ""),
          category: String(article.category ?? "Edukasi Umroh"),
          author: String(article.author ?? ""),
          featuredImage: String(article.featuredImage ?? ""),
          publishDate: article.publishDate
            ? new Date(article.publishDate as string).toISOString().slice(0, 10)
            : "",
          readTime: Number(article.readTime ?? 0),
          tags: asStringArray(article.tags),
          keywords: asStringArray(article.keywords),
          featured: Boolean(article.featured),
          metaTitle: String(article.metaTitle ?? ""),
          metaDescription: String(article.metaDescription ?? ""),
          status: String(article.status ?? "DRAFT"),
        })
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0B3C6D]" />
      </div>
    )
  }

  if (notFound || !initial) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        Artikel tidak ditemukan.
      </div>
    )
  }

  return <ArticleForm initial={initial} />
}
