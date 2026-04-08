import type { MetadataRoute } from "next"

import { client } from "@/sanity/lib/client"
import { postsQuery } from "@/sanity/lib/queries"

type PostSlugItem = {
  slug?: { current?: string }
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
  ]

  try {
    const posts = await client.fetch<PostSlugItem[]>(postsQuery, {}, { next: { revalidate: 3600 } })

    const postRoutes: MetadataRoute.Sitemap = posts
      .map((post) => post.slug?.current)
      .filter((slug): slug is string => Boolean(slug))
      .map((slug) => ({
        url: `${siteUrl}/blog/${slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
      }))

    return [...staticRoutes, ...postRoutes]
  } catch {
    return staticRoutes
  }
}
