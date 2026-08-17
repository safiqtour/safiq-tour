"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Save, ImageIcon, X, Star, Lock, Unlock } from "lucide-react"
import { createArticle, updateArticle } from "@/actions/articles"
import { MediaPicker } from "@/components/admin/media/media-picker"
import { TipTapEditor } from "@/components/admin/packages/tiptap-editor"
import { BLOG_CATEGORIES } from "@/lib/blog/types"
import { generateArticleSlug } from "@/lib/blog/slug"

export type ArticleFormInitial = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  featuredImage: string
  publishDate: string
  readTime: number
  tags: string[]
  keywords: string[]
  featured: boolean
  metaTitle: string
  metaDescription: string
  status: string
}

const INPUT_CLASS =
  "mt-1 w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#C89B3C] focus:ring-2 focus:ring-[#C89B3C]/20 transition-all"
const LABEL_CLASS = "text-xs font-medium text-gray-500"

function slugifyLocal(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function ArticleForm({ initial }: { initial?: ArticleFormInitial }) {
  const router = useRouter()
  const isEdit = !!initial?.id
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [pickerOpen, setPickerOpen] = useState(false)
  const [slugLocked, setSlugLocked] = useState(true)
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    category: initial?.category ?? "Edukasi Umroh",
    author: initial?.author ?? "",
    featuredImage: initial?.featuredImage ?? "",
    publishDate: initial?.publishDate ?? new Date().toISOString().slice(0, 10),
    readTime: String(initial?.readTime ?? 5),
    tags: (initial?.tags ?? []).join(", "),
    keywords: (initial?.keywords ?? []).join(", "),
    featured: initial?.featured ?? false,
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    status: initial?.status ?? "DRAFT",
  })

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      // A locked slug never follows the title on edit (stable URL). On create the
      // locked slug acts as a live SEO suggestion derived from the title.
      slug: slugLocked && !isEdit ? generateArticleSlug(value) : prev.slug,
    }))
  }

  const toggleSlugLock = () => {
    const next = !slugLocked
    setSlugLocked(next)
    // When unlocking on create with no slug yet, seed it with the SEO suggestion
    // so the admin has a starting point to edit.
    if (next && !form.slug.trim()) {
      set("slug", generateArticleSlug(form.title))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) {
      setError("Judul artikel wajib diisi")
      return
    }
    setSaving(true)
    setError("")

    const payload = {
      title: form.title.trim(),
      // Locked slugs are server-owned: create derives the SEO slug from the title,
      // edit preserves the existing slug. Only an unlocked manual value is sent.
      slug: slugLocked ? undefined : (form.slug.trim() || undefined),
      excerpt: form.excerpt.trim(),
      content: form.content,
      category: form.category,
      author: form.author.trim(),
      featuredImage: form.featuredImage,
      publishDate: form.publishDate || undefined,
      readTime: Number(form.readTime) || 0,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      keywords: form.keywords.split(",").map((t) => t.trim()).filter(Boolean),
      featured: form.featured,
      metaTitle: form.metaTitle.trim(),
      metaDescription: form.metaDescription.trim(),
      status: form.status,
    }

    try {
      if (isEdit) {
        await updateArticle(initial.id, payload)
      } else {
        await createArticle(payload)
      }
      router.push("/admin/articles")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan artikel")
    } finally {
      setSaving(false)
    }
  }


  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div>
        <h1 className="font-heading text-xl font-bold text-[#0B3C6D]">
          {isEdit ? "Edit Artikel" : "Artikel Baru"}
        </h1>
        <p className="text-sm text-[#9CA3AF]">
          {isEdit ? "Perbarui konten artikel" : "Tulis artikel blog baru"}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <label className={LABEL_CLASS}>Judul *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className={INPUT_CLASS}
                placeholder="Judul artikel"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Slug</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={form.slug}
                  readOnly={slugLocked}
                  onChange={(e) => set("slug", slugifyLocal(e.target.value))}
                  className={`${INPUT_CLASS} ${slugLocked ? "bg-gray-50 text-gray-500" : ""}`}
                  placeholder="otomatis dari judul"
                />
                <button
                  type="button"
                  onClick={toggleSlugLock}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-gray-200 px-3 text-xs font-medium text-gray-600 hover:bg-gray-50"
                  title={slugLocked ? "Unlock slug untuk edit manual" : "Kunci slug"}
                >
                  {slugLocked ? <Lock className="size-3.5" /> : <Unlock className="size-3.5" />}
                  {slugLocked ? "Unlock" : "Lock"}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                {slugLocked
                  ? "🔒 Slug terkunci — tidak berubah saat judul diubah."
                  : "🔓 Slug terbuka — dapat diedit manual."}
              </p>
              <p className="mt-1 text-xs text-gray-400">URL: /blog/{form.slug || "..."}</p>
            </div>
            <div>
              <label className={LABEL_CLASS}>Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                className={`${INPUT_CLASS} min-h-[80px]`}
                placeholder="Ringkasan singkat artikel"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Konten</label>
              <div className="mt-1">
                <TipTapEditor
                  value={form.content}
                  onChange={(v) => set("content", v)}
                  placeholder="Tulis konten artikel..."
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <h2 className="text-sm font-semibold text-[#0B3C6D]">SEO</h2>
            <div>
              <label className={LABEL_CLASS}>Meta Title</label>
              <input
                type="text"
                value={form.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Meta Description</label>
              <textarea
                value={form.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                className={`${INPUT_CLASS} min-h-[70px]`}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Keywords (pisahkan dengan koma)</label>
              <input
                type="text"
                value={form.keywords}
                onChange={(e) => set("keywords", e.target.value)}
                className={INPUT_CLASS}
                placeholder="umroh, travel, safiq"
              />
            </div>
          </div>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <label className={LABEL_CLASS}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
                className={INPUT_CLASS}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>Tanggal Publish</label>
              <input
                type="date"
                value={form.publishDate}
                onChange={(e) => set("publishDate", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="size-4 rounded border-gray-300 text-[#C89B3C] focus:ring-[#C89B3C]/20"
              />
              <Star className="size-4 text-[#C89B3C]" /> Featured article
            </label>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
            <div>
              <label className={LABEL_CLASS}>Kategori</label>
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={INPUT_CLASS}
              >
                {BLOG_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={LABEL_CLASS}>Penulis</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => set("author", e.target.value)}
                className={INPUT_CLASS}
                placeholder="Admin Safiq Tour"
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Waktu Baca (menit)</label>
              <input
                type="number"
                min={0}
                value={form.readTime}
                onChange={(e) => set("readTime", e.target.value)}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className={LABEL_CLASS}>Tags (pisahkan dengan koma)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                className={INPUT_CLASS}
                placeholder="umroh, tips, haji"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-3">
            <label className={LABEL_CLASS}>Featured Image</label>
            {form.featuredImage ? (
              <div className="relative overflow-hidden rounded-xl border border-gray-200">
                {/* Admin preview only — URL may point to any storage provider */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.featuredImage} alt="Featured" className="h-36 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => set("featuredImage", "")}
                  className="absolute right-2 top-2 rounded-lg bg-black/60 p-1.5 text-white hover:bg-black/80"
                  title="Hapus gambar"
                >
                  <X className="size-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex h-36 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-400 transition-all hover:border-[#C89B3C] hover:text-[#C89B3C]"
              >
                <ImageIcon className="size-6" />
                Pilih dari Media Library
              </button>
            )}
            {form.featuredImage && (
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="text-xs font-medium text-[#0B3C6D] hover:underline"
              >
                Ganti gambar
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0B3C6D] px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#0B3C6D]/20 hover:bg-[#0B2D52] disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : <><Save className="size-4" /> {isEdit ? "Update" : "Simpan"}</>}
            </button>
          </div>
        </div>
      </form>

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(media) => set("featuredImage", media.url)}
      />
    </motion.div>
  )
}
