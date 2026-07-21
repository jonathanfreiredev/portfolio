"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export function AboutIntro() {
  const t = useTranslations("home.aboutIntro");

  return (
    <Reveal as="section" id="about" className="w-full">
      <div className="flex w-full flex-col gap-10">
        <div className="flex items-center gap-2">
          <span className="text-tag text-muted-foreground uppercase">{t("badge")}</span>
        </div>

        <p className="max-w-[820px] text-lead text-foreground">{t("text")}</p>

        <div className="flex flex-wrap items-center gap-6">
          <Button asChild>
            <Link href="/#projects">{t("button1")}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/#services" className="inline-flex items-center gap-2">
              {t("button2")}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
