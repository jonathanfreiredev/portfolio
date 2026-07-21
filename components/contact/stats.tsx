"use client";

import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";

function StatItem({
  amount,
  label,
}: {
  amount: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-end gap-2 text-right">
      <span className="text-stat text-foreground">{amount}</span>
      <span className="text-tag text-muted-foreground uppercase">{label}</span>
    </div>
  );
}

export function Stats() {
  const t = useTranslations("contact.stats");

  return (
    <Reveal
      y={30}
      className="w-full border border-border bg-card p-6 md:p-8"
    >
      <div className="flex w-full flex-col items-stretch justify-end gap-12 md:flex-row md:items-end md:gap-12">
        <StatItem
          amount={t("projectsDeliveredAmount")}
          label={t("projectsDelivered")}
        />
        <StatItem
          amount={t("clientsWorldwideAmount")}
          label={t("clientsWorldwide")}
        />
      </div>
    </Reveal>
  );
}
