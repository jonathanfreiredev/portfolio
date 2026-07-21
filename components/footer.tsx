import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

const SECTION_LINKS = [
  { href: "/#services", key: "services" },
  { href: "/#workflow", key: "workflow" },
  { href: "/#pricing", key: "pricing" },
] as const;

const PAGE_LINKS = [
  { href: "/blog", key: "blog" },
  { href: "/legal/terms", key: "terms" },
  { href: "/legal/privacy", key: "privacy" },
] as const;

export async function Footer() {
  const t = await getTranslations("home.footer");

  return (
    <footer className="bg-background text-foreground">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-5 py-14 md:gap-24 md:px-12 md:py-14 lg:px-20">
        <p className="text-display-m text-foreground">Jonathan F.</p>

        <div className="flex w-full flex-col gap-10 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex flex-col gap-2 md:max-w-[280px]">
            <span className="text-tag text-secondary uppercase">
              {t("basedIn")}
            </span>
            <span className="text-body-m text-foreground">{t("city")}</span>
          </div>

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-2 md:flex md:w-auto md:gap-x-16">
            <nav
              aria-label="Footer sections"
              className="flex flex-col gap-2"
            >
              {SECTION_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-s text-foreground underline-offset-4 hover:opacity-70 hover:underline"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>

            <nav
              aria-label="Footer pages"
              className="flex flex-col gap-2"
            >
              {PAGE_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-body-s text-foreground underline-offset-4 hover:opacity-70 hover:underline"
                >
                  {t(link.key)}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <span className="text-caption">© 2026 Jonathan Freire</span>
          <span className="text-caption">{t("city")}</span>
        </div>
      </div>
    </footer>
  );
}
