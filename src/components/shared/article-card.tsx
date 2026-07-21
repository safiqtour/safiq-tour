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
  return (
    <Link href={`/blog/${article.slug}`} className={cn("group block", className)}>
      <Card className="h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {article.image && (
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader>
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
          <CardTitle className="text-base leading-snug group-hover:text-[#D4AF37]">
            {article.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {article.excerpt}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}

export { ArticleCard }
