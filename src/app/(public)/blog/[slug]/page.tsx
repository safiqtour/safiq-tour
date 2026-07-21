import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronLeft, Calendar, User } from "lucide-react"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { articles } from "@/data/articles"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }))
}

async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = articles.find((a) => a.slug === slug)

  if (!article) {
    notFound()
  }

  return (
    <Section>
      <Container size="md">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Kembali ke Blog
        </Link>

        <article className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Calendar className="size-4" />
                {new Date(article.date).toLocaleDateString("id-ID", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="size-4" />
                {article.author}
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium">
                {article.category}
              </span>
            </div>
          </div>

          {article.image && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="prose prose-gray max-w-none leading-relaxed text-foreground/80">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-base md:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </Container>
    </Section>
  )
}

export default ArticlePage
