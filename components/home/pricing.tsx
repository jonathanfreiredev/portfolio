"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { SectionHeader } from "@/components/home/section-header";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

type PricingCardProps = {
  index: number;
};

function PricingCard({ index }: PricingCardProps) {
  const t = useTranslations(`home.pricing.items.${index}`);

  return (
    <div className="flex flex-col p-6 md:p-8 bg-neutral-100">
      <div className="flex flex-col justify-between h-full gap-14 border p-6 md:p-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-h3 text-foreground uppercase">{t("title")}</h3>

          <p className="text-body-m text-foreground/80">{t("text")}</p>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex items-end gap-1">
            <span className="pb-1.5 text-tag text-muted-foreground">
              {t("pricePreffix")}
            </span>
            <span className="text-display-s text-foreground tabular-nums">
              {t("price")}€
            </span>
            <span className="pb-1.5 text-tag text-muted-foreground uppercase">
              {t("priceSuffix")}
            </span>
          </div>

          <ul className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="flex items-center gap-3 text-body-m text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-foreground"
                />
                {t(`listItem${i}`)}
              </li>
            ))}
          </ul>
        </div>

        <Button asChild>
          <Link href="/contact" className="inline-flex items-center gap-2">
            {t("button")}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const PLAN_COUNT = 2;

export function Pricing() {
  const t = useTranslations("home.pricing");

  return (
    <section id="pricing" className="flex w-full flex-col gap-12 md:gap-24">
      <SectionHeader title={t("title")} text={t("text")} />

      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {Array.from({ length: PLAN_COUNT }).map((_, i) => (
          <PricingCard key={i} index={i} />
        ))}
      </div>
    </section>
  );
}
