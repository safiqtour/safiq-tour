"use client"

import Image from "next/image"
import { Section } from "@/components/ui/section"
import { Container } from "@/components/ui/container"
import { ArticleCard } from "@/components/shared/article-card"
import { articles } from "@/data/articles"
import { HeroFloatingCard } from "@/components/home/HeroFloatingCard"

function BlogPage() {
  return (
    <>
      <section className="relative h-[60vh] min-h-[400px] -mt-20 flex items-center overflow-hidden">
        <Image
          src="/images/Hero-Blog-Safiq-Tour.png"
          alt="Blog Safiq Tour"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,23,53,0.55)] to-[rgba(6,23,53,0.15)] md:from-[rgba(6,23,53,0.5)] md:to-[rgba(6,23,53,0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,23,53,0.4)] via-transparent to-transparent" />
        <div className="absolute inset-0" style={{ boxShadow: "inset 0 0 150px rgba(0,0,0,0.4)" }} />
        <div className="relative z-10 mx-auto w-full max-w-(--container-max) px-3 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
                Blog Safiq Tour
              </h1>
              <p className="text-lg text-white/80 md:text-xl">
                Artikel dan Informasi Seputar Ibadah Haji & Umrah
              </p>
            </div>
            <div className="hidden justify-self-end md:flex">
              <HeroFloatingCard simple />
            </div>
          </div>
        </div>
      </section>

      <Section>
        <Container>
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
    </>
  )
}

export default BlogPage
