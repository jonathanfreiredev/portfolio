"use client";

import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";

export function Header() {
  const t = useTranslations("contact.header");

  return (
    <Reveal
      as="section"
      trigger="mount"
      delay={0.4}
      y={100}
      className="pt-32 pb-10 md:pt-32 md:pb-12 lg:pb-12"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 md:px-12 md:gap-6 lg:gap-6 lg:px-20">
        <div className="flex flex-col items-start gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
          <h1 className="text-display-l text-foreground">{t("title")}</h1>
          <p className="max-w-[320px] text-body-m text-foreground md:self-end">
            {t("subtitle")}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
