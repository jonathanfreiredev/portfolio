import { routing } from "@/i18n/routing";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jonathanfreire.com";

/**
 * True only on the production deployment. Used to keep preview/staging builds
 * out of the index (robots.txt + X-Robots-Tag + noindex metadata).
 */
export const isProduction = process.env.VERCEL_ENV
  ? process.env.VERCEL_ENV === "production"
  : process.env.NODE_ENV === "production";

export function buildAlternates(path: string, locale: string) {
  // The default locale has no prefix ("/" not "/en") and the home path must not
  // gain a trailing slash ("/es", not "/es/"), because "/es/" 308-redirects to
  // "/es". A canonical pointing at a redirect is a soft error for crawlers.
  const localize = (loc: string) =>
    loc === routing.defaultLocale ? path : `/${loc}${path === "/" ? "" : path}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = localize(loc);
  }
  languages["x-default"] = path;

  return {
    canonical: localize(locale),
    languages,
  };
}

type OpenGraphImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

type OpenGraphInput = {
  title: string;
  description: string;
  locale: string;
  path: string;
  type?: "website" | "article";
  images?: OpenGraphImage[];
};

/**
 * Shared Open Graph defaults. Pages spread the result into `openGraph` so
 * `og:site_name`, `og:locale`, `og:url` and image fallbacks are never lost.
 * If `images` is omitted, the file-based `opengraph-image` in the route
 * segment is used automatically.
 */
export function buildOpenGraph({
  title,
  description,
  locale,
  path,
  type = "website",
  images,
}: OpenGraphInput) {
  const { canonical } = buildAlternates(path, locale);
  return {
    title,
    description,
    type,
    url: canonical,
    siteName: "Jonathan Freire",
    locale: locale === "es" ? "es_ES" : "en_US",
    alternateLocale: locale === "es" ? ["en_US"] : ["es_ES"],
    ...(images ? { images } : {}),
  };
}

export function buildTwitter({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return {
    card: "summary_large_image" as const,
    title,
    description,
  };
}
