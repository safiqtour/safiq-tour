"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { ArticleCard } from "@/components/blog/article-card"
import { FeaturedPost } from "@/components/blog/featured-post"
import { SearchBar } from "@/components/blog/search-bar"
import { CategoryFilter } from "@/components/blog/category-filter"
import { Pagination } from "@/components/blog/pagination"
import { Sidebar } from "@/components/blog/sidebar"
import type { BlogPost } from "@/lib/mdx"
import type { BlogArticle } from "@/lib/blog/types"

const ARTICLES_PER_PAGE = 9

type BlogClientProps = {
  posts: BlogPost[]
  featured: BlogPost | null
}

export default function BlogClient({ posts, featured }: BlogClientProps) {
  const articles: BlogArticle[] = posts.map((p) => ({
    id: p.slug,
    slug: p.slug,
    title: p.frontmatter.title,
    excerpt: p.frontmatter.description,
    content: p.content,
    featuredImage: p.frontmatter.featuredImage,
    category: p.frontmatter.category,
    author: p.frontmatter.author,
    publishDate: p.frontmatter.date,
    readTime: p.frontmatter.readTime,
    tags: p.frontmatter.tags,
    featured: p.frontmatter.featured,
    seo: {
      metaTitle: `${p.frontmatter.title} | Safiq Tour`,
      metaDescription: p.frontmatter.description,
      keywords: p.frontmatter.keywords,
    },
  }))
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const filtered = useMemo(() => {
    return posts.filter((a) => {
      const f = a.frontmatter
      const matchesSearch =
        !searchQuery ||
        f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = !selectedCategory || f.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, selectedCategory])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ARTICLES_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const paginated = filtered.slice((safePage - 1) * ARTICLES_PER_PAGE, safePage * ARTICLES_PER_PAGE)

  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] -mt-20 flex items-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop"
          alt="Artikel & Inspirasi Umroh"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,45,92,0.85)] to-[rgba(11,45,92,0.3)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,45,92,0.5)] via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.4)" }} />
        <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <h1 className="font-heading text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
              Artikel & Inspirasi Umroh
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/80 md:text-lg">
              Temukan berbagai informasi, tips perjalanan, edukasi ibadah, dan kisah inspiratif untuk menemani perjalanan menuju Baitullah.
            </p>
          </motion.div>
        </div>
      </section>

      <Section>
        <Container>
          {featured && (
            <div className="mb-12">
              <FeaturedPost
                article={{
                  slug: featured.slug,
                  title: featured.frontmatter.title,
                  excerpt: featured.frontmatter.description,
                  featuredImage: featured.frontmatter.featuredImage,
                  category: featured.frontmatter.category,
                  author: featured.frontmatter.author,
                  publishDate: featured.frontmatter.date,
                  readTime: featured.frontmatter.readTime,
                }}
              />
            </div>
          )}

          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="w-full md:w-80">
              <SearchBar value={searchQuery} onChange={(v) => { setSearchQuery(v); setCurrentPage(1) }} />
            </div>
          </div>

          <CategoryFilter selected={selectedCategory} onSelect={(c) => { setSelectedCategory(c); setCurrentPage(1) }} />

          <div className="mt-8 lg:grid lg:grid-cols-[1fr_300px] lg:gap-10">
            <div>
              {paginated.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="rounded-full bg-[#F8FAFC] p-6">
                    <svg className="size-10 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-heading text-lg font-bold text-[#0B3C6D]">Artikel Tidak Ditemukan</h3>
                  <p className="mt-2 text-sm text-[#6B7280]">Tidak ada artikel yang sesuai dengan filter yang dipilih.</p>
                  <button
                    onClick={() => { setSearchQuery(""); setSelectedCategory("") }}
                    className="mt-4 rounded-xl bg-[#C89B3C] px-6 py-2 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#B88A2E]"
                  >
                    Reset Filter
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {paginated.map((post, i) => (
                      <ArticleCard
                        key={post.slug}
                        article={{
                          slug: post.slug,
                          title: post.frontmatter.title,
                          excerpt: post.frontmatter.description,
                          featuredImage: post.frontmatter.featuredImage,
                          category: post.frontmatter.category,
                          author: post.frontmatter.author,
                          publishDate: post.frontmatter.date,
                          readTime: post.frontmatter.readTime,
                        }}
                        index={i}
                      />
                    ))}
                  </div>
                  <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
              )}
            </div>

            <div className="mt-10 lg:mt-0">
              <div className="lg:sticky lg:top-24">
                <Sidebar
                  searchQuery={searchQuery}
                  onSearchChange={(v) => { setSearchQuery(v); setCurrentPage(1) }}
                  selectedCategory={selectedCategory}
                  onCategoryChange={(c) => { setSelectedCategory(c); setCurrentPage(1) }}
                  articles={articles}
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
