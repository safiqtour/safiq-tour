import { Section, SectionHeader, SectionTitle, SectionDescription } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { ArticleCard } from "@/components/shared/article-card"
import { articles } from "@/data/articles"

function BlogPage() {
  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle className="text-[#0F2D5C]">Blog Safiq Tour</SectionTitle>
          <SectionDescription>
            Artikel dan Informasi Seputar Ibadah Haji & Umrah
          </SectionDescription>
        </SectionHeader>

        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Belum ada artikel. Nantikan artikel-artikel menarik seputar panduan ibadah, tips perjalanan, dan berita terbaru dari Safiq Tour.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

export default BlogPage
