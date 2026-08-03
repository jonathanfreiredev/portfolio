"use client";

import { MenuIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

const SHEET_ITEMS = [
  { href: "/", key: "home" },

  { href: "/#services", key: "services" },
  { href: "/#workflow", key: "workflow" },
  { href: "/#pricing", key: "pricing" },

  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },

  { href: "/legal/terms", key: "terms" },
  { href: "/legal/privacy", key: "privacy" },
  { href: "/legal/imprint", key: "imprint" },
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

  const labelFor = (key: string) => {
    if (key === "home") return t("home");
    if (key === "blog") return t("blog");
    if (key === "contact") return t("contact");
    if (key === "services") return tFooter("services");
    if (key === "workflow") return tFooter("workflow");
    if (key === "pricing") return tFooter("pricing");
    if (key === "terms") return tFooter("terms");
    if (key === "privacy") return tFooter("privacy");
    return key;
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
                {labelFor(link.key)}
              </Link>
            ))}
          </nav>
          <LocaleSwitcher />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon-lg"
                  aria-label={t("openMenu")}
                >
                  <MenuIcon />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[82%] max-w-sm dark:bg-neutral-900"
              >
                <SheetHeader>
                  <SheetTitle className="sr-only">{t("openMenu")}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col">
                  {SHEET_ITEMS.map((item) => (
                    <SheetClose asChild key={item.key}>
                      <Link
                        href={item.href}
                        className="border-b border-border px-4 py-4 text-base text-foreground hover:bg-muted"
                      >
                        {labelFor(item.key)}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
