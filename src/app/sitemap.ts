import type { MetadataRoute } from "next"
import { getAllPosts } from "@/lib/mdx"
import { getPublicPackages } from "@/modules/public/packages"

export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://safiqtour.id"

  const [posts, packages] = await Promise.all([getAllPosts(), getPublicPackages()])

  const staticPages: MetadataRoute.Sitemap = [
    "/about",
    "/gallery",
    "/contact",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const packageEntries: MetadataRoute.Sitemap = packages.map((pkg) => ({
    url: `${baseUrl}/packages/${pkg.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/packages`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...staticPages,
    ...packageEntries,
    ...blogEntries,
  ]
}
