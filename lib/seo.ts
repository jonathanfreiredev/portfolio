import { routing } from "@/i18n/routing";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://jonathanfreire.com";

export function buildAlternates(path: string, locale: string) {
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    if (loc === routing.defaultLocale) {
      languages[loc] = path;
    } else {
      languages[loc] = `/${loc}${path}`;
    }
  }
  languages["x-default"] = path;

  const canonical =
    locale === routing.defaultLocale ? path : `/${locale}${path}`;

  return {
    canonical,
    languages,
  };
}
