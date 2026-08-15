import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { ArticleCard } from "@/components/shared/article-card"
import { getArticles } from "@/data/articles"

export async function BlogSection() {
  const latestArticles = (await getArticles()).slice(0, 3)

  return (
    <Section variant="muted">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader className="mb-0">
            <SectionTitle className="text-2xl sm:text-3xl md:text-4xl">Blog & Artikel</SectionTitle>
            <SectionDescription>
              Dapatkan informasi terbaru seputar ibadah umroh, tips perjalanan, dan berita terbaru dari Safiq Tour.
            </SectionDescription>
          </SectionHeader>
          <Link
            href="/blog"
            className="hidden shrink-0 items-center gap-2 self-start rounded-full bg-[#0F2D5C] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#0F2D5C]/20 transition-all duration-300 hover:bg-[#0F2D5C]/90 hover:shadow-lg md:inline-flex"
          >
            Lihat Semua Artikel
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="mt-10 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-[#0F2D5C] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0F2D5C]/90"
          >
            Lihat Semua Artikel
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </Container>
    </Section>
  )
}
