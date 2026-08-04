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
        <SectionHeader>
          <SectionTitle>Blog & Artikel</SectionTitle>
          <SectionDescription>
            Dapatkan informasi terbaru seputar ibadah umroh, tips perjalanan, dan berita terbaru dari Safiq Tour.
          </SectionDescription>
        </SectionHeader>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestArticles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
        <div className="mt-10 text-center">
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
