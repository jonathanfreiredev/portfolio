"use client";

import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { NavbarMobile } from "@/components/navbar-mobile";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tFooter = useTranslations("home.footer");

  const isActive = (href: string) => {
    const [path] = href.split("#");
    if (path === "" || path === "/") {
      if (href.includes("#")) return false;
      return pathname === "/";
    }
    return pathname.startsWith(path);
  };

  const labels = {
    home: t("home"),
    projects: t("projects"),
    blog: t("blog"),
    contact: t("contact"),
    services: tFooter("services"),
    workflow: tFooter("workflow"),
    terms: tFooter("terms"),
    privacy: tFooter("privacy"),
    imprint: tFooter("imprint"),
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="mx-auto flex h-12 w-full max-w-380 items-center justify-between px-5 md:px-6 lg:px-8">
        <Link href="/" className="text-wordmark text-foreground">
          JONATHAN FREIRE
        </Link>
        <div className="flex items-center gap-1">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-body-s transition-colors",
                  isActive(link.href)
                    ? "text-muted-foreground"
                    : "text-foreground hover:text-muted-foreground",
                )}
              >
                {labels[link.key]}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher />
          <NavbarMobile
            openMenuLabel={t("openMenu")}
            labels={labels as Record<string, string>}
          />
        </div>
      </div>
    </header>
  );
}