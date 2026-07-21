"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { ImagePlaceholder } from "@/components/home/image-placeholder";
import { Divider } from "@/components/home/divider";

function StatItem({ title, amount, suffix }: { title: string; amount: string; suffix: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-stat text-foreground tabular-nums">
        {amount}
        <span className="text-display-m text-foreground">{suffix}</span>
      </span>
      <span className="text-tag text-muted-foreground uppercase">{title}</span>
    </div>
  );
}

export function TheStudio() {
  const t = useTranslations("home.theStudio");

  return (
    <Reveal as="section" id="studio" y={30} className="w-full">
      <div className="flex w-full flex-col gap-12 md:gap-24">
        <div className="flex w-full flex-col gap-10">
          <span className="text-tag text-muted-foreground uppercase">{t("badge")}</span>
          <p className="max-w-[820px] text-lead text-foreground">{t("text")}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Button asChild>
              <Link href="/#studio">{t("button1")}</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/#projects" className="inline-flex items-center gap-2">
                {t("button2")}
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
          <div className="hidden md:block md:h-25" aria-hidden="true" />

          <div className="flex w-full flex-col items-end gap-2">
            <div className="relative w-full">
              <ImagePlaceholder
                // TODO: reemplazar imagen
                label={t("videoTitle")}
                className="aspect-square w-full"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-foreground/45 px-3 py-1.5 text-tag-bold text-background uppercase">
                  {t("videoBadge")}
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3">
                <span className="text-tag-bold text-background uppercase">
                  {t("videoTitle")}
                </span>
              </div>
            </div>

            <div className="flex w-full flex-col gap-6 px-8 py-12 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:gap-8">
                <StatItem
                  title={t("stats.projectsDelivered")}
                  amount={t("stats.projectsDeliveredAmount")}
                  suffix={t("stats.projectsDeliveredSuffix")}
                />
                <Divider className="hidden md:block md:w-px md:self-stretch md:border-l md:border-t-0" />
                <StatItem
                  title={t("stats.clientsWorldwide")}
                  amount={t("stats.clientsWorldwideAmount")}
                  suffix={t("stats.clientsWorldwideSuffix")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
