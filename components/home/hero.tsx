"use client";

import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { CldImage } from "next-cloudinary";
import { Separator } from "../ui/separator";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-tag text-muted-foreground uppercase">{label}</span>
      <span className="text-tag-bold text-foreground uppercase">{value}</span>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("home.hero");

  return (
    <Reveal
      as="section"
      trigger="mount"
      delay={0.4}
      y={100}
      className="flex w-full pt-32 pb-10 md:pt-32 md:pb-12 lg:pb-12"
    >
      <div className="flex w-full flex-col items-center gap-14 md:gap-14 lg:gap-14">
        <div className="flex flex-col gap-6 w-full max-w-380 px-5 md:px-6 lg:px-8">
          <h1 className="text-display-l text-foreground">{t("title")}</h1>
        </div>

        <div className="flex flex-col gap-8 w-full max-w-380 md:flex-row md:items-start md:justify-between md:gap-6 px-5 md:px-6 lg:px-8">
          <div className="flex w-full flex-col gap-10 md:w-3/4 md:gap-10">
            <div className="flex w-full flex-col gap-2 md:max-w-[85%]">
              <p className="text-lead text-foreground">{t("subTagline")}</p>
              <p className="max-w-[320px] text-body-m text-foreground">
                {t("tagline")}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Button asChild>
                <Link href="/contact">{t("ctaPrimary")}</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link
                  href="/#services"
                  className="inline-flex items-center gap-2"
                >
                  {t("ctaSecondary")}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:w-1/4 md:max-w-[274px] md:self-end">
            <InfoRow
              label={t("responseTimeLabel")}
              value={t("responseTimeValue")}
            />
            <Separator />
            <InfoRow label={t("locationLabel")} value={t("locationValue")} />
            <Separator />
          </div>
        </div>

        <div className="relative w-full aspect-16/10 md:aspect-16/7">
          <CldImage
            src="portfolio/hero-blurred"
            alt={t("title")}
            fill={true}
            sizes="100vw"
            loading="eager"
            className="object-cover"
          />
        </div>
      </div>
    </Reveal>
  );
}
