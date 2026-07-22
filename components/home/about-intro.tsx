"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

interface AboutIntroProps {
  translations: string;
}

export function AboutIntro({ translations }: AboutIntroProps) {
  const t = useTranslations(translations);

  const isIntro = translations === "home.aboutIntro";

  return (
    <Reveal
      as="section"
      id={isIntro ? "about" : "more-about-me"}
      className="w-full my-5"
    >
      <div className="flex w-full flex-col gap-10 xl:flex-row">
        <div className="flex flex-1 gap-2">
          <span className="text-tag text-muted-foreground uppercase">
            {t("badge")}
          </span>
        </div>

        <div className="flex flex-col gap-15">
          <p className="max-w-[820px] text-2xl text-foreground flex-2">
            {t("text")}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <Button asChild>
              <Link href={isIntro ? "/#projects" : "/#about"}>
                {t("button1")}
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                href={isIntro ? "/#services" : "/#projects"}
                className="inline-flex items-center gap-2"
              >
                {t("button2")}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="flex-1"></div>
      </div>
    </Reveal>
  );
}
