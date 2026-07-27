import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import { getPostBySlug, getPostSlugs } from "@/lib/posts"
import { getLegalBySlug, getLegalSlugs } from "@/lib/legal"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

const STATIC_ROUTES = ["/", "/blog"] as const

function pathFor(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  return `${siteUrl}${prefix}${path}`
}

function postPathFor(locale: string, slug: string): string {
  return pathFor(locale, `/blog/${slug}`)
}

function legalPathFor(locale: string, slug: string): string {
  return pathFor(locale, `/legal/${slug}`)
}

function allLocalesAlternates(urlFn: (locale: string) => string): Record<string, string> {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    languages[locale] = urlFn(locale)
  }
  languages["x-default"] = urlFn(routing.defaultLocale)
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = []

  for (const path of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      staticRoutes.push({
        url: pathFor(locale, path),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: allLocalesAlternates((l) => pathFor(l, path)),
        },
      })
    }
  }

  const allPostSlugs = new Set<string>()
  for (const locale of routing.locales) {
    const slugs = await getPostSlugs(locale)
    for (const slug of slugs) allPostSlugs.add(slug)
  }

  const postRoutes: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    for (const slug of allPostSlugs) {
      const post = await getPostBySlug(slug, locale)
      if (!post) continue
      postRoutes.push({
        url: postPathFor(locale, slug),
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: allLocalesAlternates((l) => postPathFor(l, slug)),
        },
      })
    }
  }

  const allLegalSlugs = new Set<string>()
  for (const locale of routing.locales) {
    const slugs = await getLegalSlugs(locale)
    for (const slug of slugs) allLegalSlugs.add(slug)
  }

  const legalRoutes: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    for (const slug of allLegalSlugs) {
      const doc = await getLegalBySlug(slug, locale)
      if (!doc) continue
      legalRoutes.push({
        url: legalPathFor(locale, slug),
        lastModified: new Date(doc.updatedAt || new Date().toISOString()),
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: {
          languages: allLocalesAlternates((l) => legalPathFor(l, slug)),
        },
      })
    }
  }

  return [...staticRoutes, ...postRoutes, ...legalRoutes]
}
