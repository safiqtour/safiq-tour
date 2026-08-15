import Link from "next/link"
import Image from "next/image"
import { Calendar, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type Article } from "@/data/articles"

type ArticleCardProps = {
  article: Article
  className?: string
}

function ArticleCard({ article, className }: ArticleCardProps) {
  const hasImage = Boolean(article.image)

  return (
    <Link href={`/blog/${article.slug}`} className={cn("group block h-full", className)}>
      <Card
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10",
          hasImage && "pt-0"
        )}
      >
        {hasImage && (
          <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden">
            <Image
              src={article.image as string}
              alt={article.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        <CardHeader className="gap-2">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3" />
              {new Date(article.date).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="size-3" />
              {article.author}
            </span>
          </div>
          <CardTitle className="font-heading text-lg font-bold leading-snug text-[#0F2D5C] transition-colors group-hover:text-[#D4AF37] sm:text-xl">
            {article.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="grow">
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export { ArticleCard }
