import type { MetadataRoute } from "next"

import { routing } from "@/i18n/routing"
import { getPostBySlug, getPostSlugs } from "@/lib/posts"
import { getLegalBySlug, getLegalSlugs } from "@/lib/legal"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"

const STATIC_ROUTES = ["/", "/blog"] as const
const LEGAL_SLUGS = ["terms", "privacy"] as const

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

async function localeAlternatesForPost(slug: string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    const post = await getPostBySlug(slug, locale)
    if (post) {
      languages[locale] = postPathFor(locale, slug)
    }
  }
  return languages
}

async function localeAlternatesForLegal(slug: string) {
  const languages: Record<string, string> = {}
  for (const locale of routing.locales) {
    const doc = await getLegalBySlug(slug, locale)
    if (doc) {
      languages[locale] = legalPathFor(locale, slug)
    }
  }
  return languages
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = []

  for (const path of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      const languages: Record<string, string> = {}
      for (const other of routing.locales) {
        languages[other] = pathFor(other, path)
      }
      staticRoutes.push({
        url: pathFor(locale, path),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.8,
        alternates: { languages },
      })
    }
  }

  const postRoutes: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    const slugs = await getPostSlugs(locale)
    for (const slug of slugs) {
      const post = await getPostBySlug(slug, locale)
      if (!post) continue
      const languages = await localeAlternatesForPost(slug)
      postRoutes.push({
        url: postPathFor(locale, slug),
        lastModified: new Date(post.date),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: { languages },
      })
    }
  }

  const legalRoutes: MetadataRoute.Sitemap = []
  for (const locale of routing.locales) {
    const availableSlugs = await getLegalSlugs(locale)
    const slugs = availableSlugs.length ? availableSlugs : (LEGAL_SLUGS as readonly string[])
    for (const slug of slugs) {
      const doc = await getLegalBySlug(slug, locale)
      if (!doc) continue
      const languages = await localeAlternatesForLegal(slug)
      legalRoutes.push({
        url: legalPathFor(locale, slug),
        lastModified: new Date(doc.updatedAt || new Date().toISOString()),
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: { languages },
      })
    }
  }

  return [...staticRoutes, ...postRoutes, ...legalRoutes]
}
