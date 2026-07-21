"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/home/section-header";
import { cn } from "@/lib/utils";

type PricingCardProps = {
  index: number;
};

function PricingCard({ index }: PricingCardProps) {
  const t = useTranslations(`home.pricing.items.${index}`);
  const isPopular = t("isPopular") === "true";

  return (
    <div
      className={cn(
        "flex flex-col gap-14 border p-6 md:p-8",
        isPopular ? "border-border-strong" : "border-border",
        "bg-card",
      )}
    >
      {isPopular ? (
        <span className="self-start bg-foreground px-3 py-1.5 text-tag text-background uppercase">
          Popular
        </span>
      ) : null}

      <div className="flex flex-col gap-4">
        <h3 className="text-h3 text-foreground uppercase">{t("title")}</h3>
        <p className="text-body-m text-foreground">{t("text")}</p>
      </div>

      <div className="flex flex-col gap-10">
        <div className="flex items-end gap-1">
          <span className="text-display-s text-foreground tabular-nums">€{t("price")}</span>
          <span className="pb-1.5 text-tag text-muted-foreground uppercase">{t("priceSuffix")}</span>
        </div>

        <ul className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <li key={i} className="flex items-center gap-3 text-body-m text-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-foreground" />
              {t(`listItem${i}`)}
            </li>
          ))}
        </ul>
      </div>

      <Button asChild>
        <Link href="/contact">{t("button")}</Link>
      </Button>
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
