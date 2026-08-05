import { getAllPosts, getFeaturedPost } from "@/lib/mdx"
import BlogClient from "./client"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Artikel & Inspirasi Umroh | Safiq Tour",
  description:
    "Temukan berbagai informasi, tips perjalanan, edukasi ibadah, dan kisah inspiratif untuk menemani perjalanan menuju Baitullah.",
  openGraph: {
    title: "Artikel & Inspirasi Umroh | Safiq Tour",
    description:
      "Temukan berbagai informasi, tips perjalanan, edukasi ibadah, dan kisah inspiratif untuk menemani perjalanan menuju Baitullah.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2070&auto=format&fit=crop",
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default async function BlogPage() {
  const posts = await getAllPosts()
  const featured = (await getFeaturedPost()) ?? null

  return <BlogClient posts={posts} featured={featured} />
}
