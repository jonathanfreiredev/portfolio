import type { MetadataRoute } from "next"

import { getAllPosts } from "@/lib/posts"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
const LOCALE = "en"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ]

  try {
    const posts = await getAllPosts(LOCALE)

    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "weekly",
      priority: 0.7,
    }))

    return [...staticRoutes, ...postRoutes]
  } catch {
    return staticRoutes
  }
}
