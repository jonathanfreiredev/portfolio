"use client";

import { useLocale, useTranslations } from "next-intl";

import { routing } from "@/i18n/routing";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <div
      role="group"
      aria-label={t("switchLanguage")}
      className="flex items-center"
    >
      {routing.locales.map((targetLocale, index) => {
        const isActive = locale === targetLocale;
        return (
          <span key={targetLocale} className="flex items-center">
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="text-body-s text-muted-foreground"
              >
                /
              </span>
            ) : null}
            <Link
              href={pathname}
              locale={targetLocale}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "px-2 py-2 text-body-s transition-colors",
                isActive
                  ? "text-muted-foreground"
                  : "text-foreground hover:text-muted-foreground",
              )}
            >
              {targetLocale.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
