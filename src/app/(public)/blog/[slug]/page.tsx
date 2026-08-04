import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar, User, Clock, ChevronLeft } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { Badge } from "@/components/ui/badge"
import { getPostBySlug, getAllSlugs, getRelatedPosts } from "@/lib/mdx"
import { Breadcrumb } from "@/components/blog/breadcrumb"
import { ArticleContent } from "@/components/blog/article-content"
import { TableOfContents } from "@/components/blog/table-of-contents"
import { SocialShare } from "@/components/blog/social-share"
import { RelatedPostCard } from "@/components/blog/related-posts"
import { CtaSection } from "@/components/blog/cta-section"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return (await getAllSlugs()).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.frontmatter.title + " | Safiq Tour",
    description: post.frontmatter.description,
    keywords: post.frontmatter.keywords.join(", "),
    openGraph: {
      title: post.frontmatter.title + " | Safiq Tour",
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      authors: [post.frontmatter.author],
      images: [{ url: post.frontmatter.featuredImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.frontmatter.title + " | Safiq Tour",
      description: post.frontmatter.description,
      images: [post.frontmatter.featuredImage],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  }
}

async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const related = await getRelatedPosts(post)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: post.frontmatter.featuredImage,
    datePublished: post.frontmatter.date,
    author: { "@type": "Person", name: post.frontmatter.author },
    publisher: {
      "@type": "Organization",
      name: "Safiq Tour",
      logo: { "@type": "ImageObject", url: "https://safiq-tour.com/logo.png" },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://safiq-tour.com/blog/${post.slug}`,
    },
    keywords: post.frontmatter.keywords.join(", "),
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Beranda", item: "https://safiq-tour.com/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://safiq-tour.com/blog" },
      {
        "@type": "ListItem",
        position: 3,
        name: post.frontmatter.title,
        item: `https://safiq-tour.com/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="relative h-[50vh] min-h-[350px] -mt-20 overflow-hidden">
        <Image
          src={post.frontmatter.featuredImage}
          alt={post.frontmatter.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(11,45,92,0.8)] to-[rgba(11,45,92,0.2)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(11,45,92,0.6)] via-transparent to-transparent" />
      </div>

      <Section className="-mt-32 relative z-10">
        <Container size="md">
          <div className="rounded-2xl bg-white p-6 shadow-xl md:p-10">
            <Breadcrumb
              items={[
                { label: "Blog", href: "/blog" },
                { label: post.frontmatter.title },
              ]}
            />
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Badge className="bg-[#C89B3C] text-white text-xs font-semibold">
                {post.frontmatter.category}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                <Calendar className="size-3.5" />
                {new Date(post.frontmatter.date).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                <User className="size-3.5" />
                {post.frontmatter.author}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[#6B7280]">
                <Clock className="size-3.5" />
                {post.frontmatter.readTime} menit baca
              </span>
            </div>
            <h1 className="mt-4 font-heading text-2xl font-bold leading-tight text-[#0B3C6D] md:text-3xl lg:text-4xl">
              {post.frontmatter.title}
            </h1>
            <div className="mt-6">
              <SocialShare slug={post.slug} title={post.frontmatter.title} />
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
            <div>
              <div className="mx-auto max-w-[800px] rounded-2xl border border-[#E5E7EB] bg-white p-6 shadow-lg md:p-10">
                <ArticleContent content={post.content} />
              </div>
              <div className="mx-auto mt-8 max-w-[800px]">
                <SocialShare slug={post.slug} title={post.frontmatter.title} />
              </div>
              {related.length > 0 && (
                <div className="mx-auto mt-12 max-w-[800px]">
                  <h3 className="font-heading text-xl font-bold text-[#0B3C6D]">Artikel Terkait</h3>
                  <div className="mt-6 grid gap-6 md:grid-cols-3">
                    {related.map((r, i) => (
                      <RelatedPostCard key={r.slug} article={{
                        slug: r.slug,
                        title: r.frontmatter.title,
                        featuredImage: r.frontmatter.featuredImage,
                        category: r.frontmatter.category,
                        publishDate: r.frontmatter.date,
                        readTime: r.frontmatter.readTime,
                      }} index={i} />
                    ))}
                  </div>
                </div>
              )}
              <div className="mx-auto mt-12 max-w-[800px]">
                <CtaSection />
              </div>
              <div className="mx-auto mt-6 max-w-[800px]">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#0B3C6D] transition-all duration-300 hover:text-[#C89B3C]"
                >
                  <ChevronLeft className="size-4" />
                  Kembali ke Blog
                </Link>
              </div>
            </div>
            <aside className="mt-10 lg:mt-0">
              <div className="lg:sticky lg:top-24 space-y-8">
                <TableOfContents content={post.content} />
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ArticlePage
