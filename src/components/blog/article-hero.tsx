import Image from "next/image"
import { Star } from "lucide-react"
import { normalizeImageUrl } from "@/lib/utils"
import { ARTICLE_IMAGE_FALLBACK } from "@/lib/blog/utils"

type ArticleHeroProps = {
  image: string
  title: string
  category: string
  excerpt?: string
  featured?: boolean
}

/**
 * Article hero — full-width, bleeds under the transparent fixed navbar exactly
 * like the Packages page hero (-mt-20 + pt-20). Background image fills the hero,
 * navy gradient overlays keep the left-aligned white copy readable while the
 * image stays visible on the right. Only the image source differs per article:
 * it uses the article's own featuredImage (fallback when empty).
 */
export function ArticleHero({ image, title, category, excerpt, featured }: ArticleHeroProps) {
  const src = normalizeImageUrl(image?.trim() ? image : ARTICLE_IMAGE_FALLBACK)

  return (
    <section className="relative z-10 -mt-20 flex min-h-[470px] items-center overflow-hidden bg-[#0B2D5C] pb-24 md:min-h-[500px] md:pb-28">
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover object-center"
        priority
        sizes="100vw"
      />
      {/* Identical overlay stack to the Packages hero: left-dark navy gradient,
          bottom fade, and a soft vignette so the left copy stays readable while
          the featured image remains visible on the right. */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B2D5C]/90 via-[#0B2D5C]/60 to-[#0B2D5C]/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B2D5C]/60 via-transparent to-transparent" />
      <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(11,45,92,0.6)" }} />

      {/* Foreground content, left-aligned like Packages. pt-20 clears the fixed
          navbar so badges/title never collide with it. */}
      <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-5 pt-20 sm:px-6 md:-translate-y-4 lg:px-8">
        <div className="flex max-w-2xl flex-col gap-4 md:gap-5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex w-fit rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#D4AF37] md:text-xs">
              {category}
            </span>
            {featured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#C89B3C] px-3 py-1 text-[10px] font-bold text-white shadow-lg md:text-xs">
                <Star className="size-2.5 fill-white" />
                Featured
              </span>
            )}
          </div>
          <h1 className="line-clamp-3 break-words font-heading text-2xl font-bold leading-tight text-white drop-shadow-lg sm:text-3xl md:text-4xl lg:text-5xl">
            {title}
          </h1>
          {excerpt && (
            <p className="line-clamp-3 max-w-xl text-sm leading-relaxed text-white/80 md:text-base">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
