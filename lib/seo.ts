import { routing } from "@/i18n/routing";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jonathanfreire.com";

export function buildAlternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    if (locale === routing.defaultLocale) {
      languages[locale] = path;
    } else {
      languages[locale] = `/${locale}${path}`;
    }
  }
  return {
    canonical: path,
    languages,
  };
}
