"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function Navbar() {
  const isProduction = process.env.NODE_ENV === "production";
  const pathname = usePathname();

  if (pathname.includes("/studio")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <div className="mx-auto flex h-12 w-full max-w-[1440px] items-center justify-between">
        <Link href="/" className="text-wordmark text-foreground">
          JONATHAN FREIRE
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          <Link
            href="/blog"
            className={cn(
              "px-3 py-2 text-body-s transition-colors",
              isActive("/blog")
                ? "text-muted-foreground"
                : "text-foreground hover:text-muted-foreground",
            )}
          >
            Blog
          </Link>
          {!isProduction && (
            <Link
              href="/studio"
              className={cn(
                "px-3 py-2 text-body-s transition-colors",
                isActive("/studio")
                  ? "text-muted-foreground"
                  : "text-foreground hover:text-muted-foreground",
              )}
            >
              Studio
            </Link>
          )}
        </nav>
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary" size="icon-lg" aria-label="Open menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[82%] max-w-sm">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="flex flex-col">
                <SheetClose asChild>
                  <Link
                    href="/"
                    className="border-b border-border px-4 py-4 text-base text-foreground"
                  >
                    Home
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/blog"
                    className="border-b border-border px-4 py-4 text-base text-foreground"
                  >
                    Blog
                  </Link>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
