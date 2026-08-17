"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Plus, Pencil, Star, FileText } from "lucide-react"
import { DataTable, type Column } from "@/components/admin/data-table"
import { getArticles, deleteArticle, restoreArticle } from "@/actions/articles"
import { canUser } from "@/actions/permissions"
import { BLOG_CATEGORIES } from "@/lib/blog/types"

type ArticleListItem = {
  id: string
  title: string
  slug: string
  category: string
  author: string
  status: string
  featured: boolean
  featuredImage: string
  publishDate: string | Date
  deletedAt: string | Date | null
}

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-green-50 text-green-700",
  DRAFT: "bg-amber-50 text-amber-700",
  ARCHIVED: "bg-gray-100 text-gray-600",
}

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "-"
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

export default function ArticlesPage() {
  const [data, setData] = useState<ArticleListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("publishDate")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [showDeleted, setShowDeleted] = useState(false)
  const [statusFilter, setStatusFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [canCreate, setCanCreate] = useState(false)
  const [canUpdate, setCanUpdate] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getArticles({
        page,
        limit: 10,
        search,
        sort,
        order,
        includeDeleted: showDeleted || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
      })
      setData((result.data ?? []) as unknown as ArticleListItem[])
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }, [page, search, sort, order, showDeleted, statusFilter, categoryFilter])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { setPage(1) }, [search, showDeleted, statusFilter, categoryFilter])
  useEffect(() => {
    canUser("cms:create").then(setCanCreate)
    canUser("cms:update").then(setCanUpdate)
  }, [])

  const handleSort = (key: string) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(key); setOrder("asc") }
  }

  const columns: Column<ArticleListItem>[] = [
    {
      key: "title",
      header: "Artikel",
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          {item.featuredImage ? (
            // Admin thumbnail — URL may point to any storage provider
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.featuredImage}
              alt={item.title}
              className="size-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#0B3C6D]/5 text-[#0B3C6D]">
              <FileText className="size-4" />
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate font-medium text-[#0B3C6D]">{item.title}</p>
            <p className="truncate text-xs text-[#9CA3AF]">/blog/{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Kategori",
      hideOnMobile: true,
      render: (item) => (
        <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          {item.category}
        </span>
      ),
    },
    { key: "author", header: "Penulis", hideOnMobile: true },
    {
      key: "status",
      header: "Status",
      sortable: true,
      render: (item) => (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[item.status] ?? "bg-gray-100 text-gray-600"}`}>
          {item.status}
        </span>
      ),
    },
    {
      key: "featured",
      header: "Featured",
      hideOnMobile: true,
      render: (item) =>
        item.featured ? <Star className="size-4 fill-[#C89B3C] text-[#C89B3C]" /> : <span className="text-xs text-[#9CA3AF]">—</span>,
    },
    {
      key: "publishDate",
      header: "Publish",
      sortable: true,
      hideOnMobile: true,
      render: (item) => <span className="text-xs text-[#6B7280]">{formatDate(item.publishDate)}</span>,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">Artikel</h1>
          <p className="text-sm text-[#9CA3AF]">Kelola konten blog & artikel</p>
        </div>
        {canCreate && (
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 transition-all hover:bg-[#0B2D52]"
          >
            <Plus className="size-4" /> Tambah Artikel
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
          <option value="">Semua Status</option>
          <option value="PUBLISHED">Published</option>
          <option value="DRAFT">Draft</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#0B3C6D] outline-none focus:border-[#C89B3C]"
        >
          <option value="">Semua Kategori</option>
          {BLOG_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        totalPages={totalPages}
        total={total}
        onPageChange={setPage}
        sort={sort}
        order={order}
        onSort={handleSort}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Cari judul, excerpt, atau penulis..."
        showDeleted={showDeleted}
        onToggleShowDeleted={setShowDeleted}
        onDelete={(id) => deleteArticle(id).then(fetchData)}
        onRestore={(id) => restoreArticle(id).then(fetchData)}
        getId={(item) => item.id}
        getIsDeleted={(item) => !!item.deletedAt}
        actions={(item) => canUpdate ? (
          <Link
            href={`/admin/articles/${item.id}/edit`}
            className="rounded-lg p-1.5 text-[#6B7280] hover:bg-blue-50 hover:text-blue-600 transition-colors"
            title="Edit"
          >
            <Pencil className="size-4" />
          </Link>
        ) : null}
      />
    </motion.div>
  )
}
