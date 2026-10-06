import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { getLegalBySlug, getLegalSlugs } from "@/lib/legal";
import { getPostBySlug, getPostSlugs } from "@/lib/posts";
import { getAllProjectMeta, getProjectBySlug } from "@/lib/projects";
import { siteUrl } from "@/lib/seo";

const STATIC_ROUTES = ["/", "/projects", "/blog", "/contact"] as const;

function pathFor(locale: string, path: string): string {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  if (path === "/") {
    // Root keeps its trailing slash, but a localized home must not: "/es/"
    // 308-redirects to "/es", and a sitemap should only list final URLs.
    return prefix ? `${siteUrl}${prefix}` : `${siteUrl}/`;
  }
  return `${siteUrl}${prefix}${path}`;
}

function postPathFor(locale: string, slug: string): string {
  return pathFor(locale, `/blog/${slug}`);
}

function legalPathFor(locale: string, slug: string): string {
  return pathFor(locale, `/legal/${slug}`);
}

function projectPathFor(locale: string, slug: string): string {
  return pathFor(locale, `/projects/${slug}`);
}

function allLocalesAlternates(
  urlFn: (locale: string) => string,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = urlFn(locale);
  }
  languages["x-default"] = urlFn(routing.defaultLocale);
  return languages;
}

/**
 * Build hreflang alternates using only the locales that actually have a
 * native translation of the document, so a fallback (English) page is never
 * declared as the Spanish version.
 */
function nativeAlternates(
  slug: string,
  slugsByLocale: Map<string, string[]>,
  urlFn: (locale: string, slug: string) => string,
): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    if (slugsByLocale.get(locale)?.includes(slug)) {
      languages[locale] = urlFn(locale, slug);
    }
  }
  if (languages[routing.defaultLocale]) {
    languages["x-default"] = urlFn(routing.defaultLocale, slug);
  }
  return languages;
}

async function collectSlugs(
  getSlugs: (locale: string) => Promise<string[]>,
): Promise<Map<string, string[]>> {
  const map = new Map<string, string[]>();
  for (const locale of routing.locales) {
    map.set(locale, await getSlugs(locale));
  }
  return map;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const path of STATIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: pathFor(locale, path),
        changeFrequency: "weekly",
        priority: path === "/" ? 1 : 0.8,
        alternates: {
          languages: allLocalesAlternates((l) => pathFor(l, path)),
        },
      });
    }
  }

  const postSlugsByLocale = await collectSlugs(getPostSlugs);
  for (const locale of routing.locales) {
    for (const slug of postSlugsByLocale.get(locale) ?? []) {
      const post = await getPostBySlug(slug, locale);
      if (!post) continue;
      entries.push({
        url: postPathFor(locale, slug),
        ...(post.date ? { lastModified: new Date(post.date) } : {}),
        changeFrequency: "weekly",
        priority: 0.7,
        alternates: {
          languages: nativeAlternates(slug, postSlugsByLocale, postPathFor),
        },
      });
    }
  }

  const legalSlugsByLocale = await collectSlugs(getLegalSlugs);
  for (const locale of routing.locales) {
    for (const slug of legalSlugsByLocale.get(locale) ?? []) {
      const doc = await getLegalBySlug(slug, locale);
      if (!doc) continue;
      entries.push({
        url: legalPathFor(locale, slug),
        ...(doc.updatedAt ? { lastModified: new Date(doc.updatedAt) } : {}),
        changeFrequency: "yearly",
        priority: 0.3,
        alternates: {
          languages: nativeAlternates(slug, legalSlugsByLocale, legalPathFor),
        },
      });
    }
  }

  for (const meta of getAllProjectMeta()) {
    for (const locale of routing.locales) {
      const project = await getProjectBySlug(meta.slug, locale);
      if (!project) continue;
      entries.push({
        url: projectPathFor(locale, meta.slug),
        ...(project.updatedAt
          ? { lastModified: new Date(project.updatedAt) }
          : {}),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: allLocalesAlternates((l) =>
            projectPathFor(l, meta.slug),
          ),
        },
      });
    }
  }

  return entries;
}
