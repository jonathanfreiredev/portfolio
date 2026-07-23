import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { Separator } from "./ui/separator";
import { LinkedInIcon } from "./linkedin-icon";

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
    <footer className="bg-background text-foreground w-full flex justify-center">
      <div className="flex w-full max-w-380 flex-col pb-14 gap-10 md:gap-15 px-5 md:px-6 lg:px-8">
        <p className="text-[clamp(1rem,15vw,16rem)] font-bold text-center leading-none tracking-tight text-foreground text-nowrap overflow-hidden">
          Jonathan F.
        </p>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-between sm:gap-20">
          <div></div>

          <nav
            aria-label="Footer sections"
            className="flex flex-col gap-3 w-fit"
          >
            {SECTION_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-tag hover:opacity-60 hover:no-underline"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>

          <nav aria-label="Footer pages" className="flex flex-col gap-3 w-fit">
            {PAGE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-tag hover:opacity-60 hover:no-underline"
              >
                {t(link.key)}
              </Link>
            ))}
          </nav>
        </div>

        <Separator className="mt-5" />

        <div className="flex w-full flex-col items-center md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex flex-col gap-3 items-center md:items-start">
            <span className="text-body-s uppercase">
              © 2026 Jonathan Freire
            </span>

            <span className="text-body-s uppercase">{t("city")}</span>
          </div>
          {/* LOGO */}
          <div className="flex justify-center md:justify-end">
            <LinkedInIcon />
          </div>
        </div>
      </div>
    </footer>
  );
}
