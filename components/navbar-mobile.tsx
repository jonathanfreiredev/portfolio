"use client";

import { MenuIcon } from "lucide-react";
import dynamic from "next/dynamic";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

const loadSheet = () => import("@/components/ui/sheet");
const Sheet = dynamic(() => loadSheet().then((m) => ({ default: m.Sheet })), { ssr: false });
const SheetTrigger = dynamic(() => loadSheet().then((m) => ({ default: m.SheetTrigger })), { ssr: false });
const SheetContent = dynamic(() => loadSheet().then((m) => ({ default: m.SheetContent })), { ssr: false });
const SheetHeader = dynamic(() => loadSheet().then((m) => ({ default: m.SheetHeader })), { ssr: false });
const SheetTitle = dynamic(() => loadSheet().then((m) => ({ default: m.SheetTitle })), { ssr: false });
const SheetClose = dynamic(() => loadSheet().then((m) => ({ default: m.SheetClose })), { ssr: false });

const SHEET_ITEMS = [
  { href: "/", key: "home" },
  { href: "/projects", key: "projects" },
  { href: "/#services", key: "services" },
  { href: "/#workflow", key: "workflow" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
  { href: "/legal/terms", key: "terms" },
  { href: "/legal/privacy", key: "privacy" },
  { href: "/legal/imprint", key: "imprint" },
] as const;

type NavbarMobileProps = {
  openMenuLabel: string;
  labels: Record<(typeof SHEET_ITEMS)[number]["key"], string>;
};

export function NavbarMobile({ openMenuLabel, labels }: NavbarMobileProps) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="secondary" size="icon-lg" aria-label={openMenuLabel}>
            <MenuIcon />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[82%] max-w-sm dark:bg-neutral-900">
          <SheetHeader>
            <SheetTitle className="sr-only">{openMenuLabel}</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col">
            {SHEET_ITEMS.map((item) => (
              <SheetClose asChild key={item.key}>
                <Link
                  href={item.href}
                  className="border-b border-border px-4 py-4 text-base text-foreground hover:bg-muted"
                >
                  {labels[item.key]}
                </Link>
              </SheetClose>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}