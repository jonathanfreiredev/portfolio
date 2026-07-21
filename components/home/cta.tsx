"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";

export function Cta() {
  const t = useTranslations("home.cta");

  return (
    <section id="cta" className="flex w-full flex-col items-center gap-10 py-24 md:py-24">
      <div className="flex w-full max-w-[600px] flex-col items-center gap-10">
        <div className="flex w-full flex-col items-center gap-6">
          <span className="text-tag text-foreground uppercase">{t("badge")}</span>
          <h2 className="text-center text-display-m text-foreground uppercase">{t("title")}</h2>
          <p className="text-center text-body-m text-foreground">{t("text")}</p>
        </div>

        <Button asChild>
          <Link href="/contact" className="inline-flex items-center gap-2">
            {t("button")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
