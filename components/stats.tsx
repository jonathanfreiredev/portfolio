import { useTranslations } from "next-intl";
import { Separator } from "./ui/separator";

function StatItem({
  title,
  amount,
  suffix,
}: {
  title: string;
  amount: string;
  suffix: string;
}) {
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

export function Stats() {
  const t = useTranslations("home.moreAboutMe");

  return (
    <div className="flex w-full flex-col items-end gap-2">
      <div className="flex w-full flex-col gap-6 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-end gap-8 sm:flex-row sm:items-center sm:gap-8">
          <StatItem
            title={t("stats.projectsDelivered")}
            amount={t("stats.projectsDeliveredAmount")}
            suffix={t("stats.projectsDeliveredSuffix")}
          />

          <Separator orientation="vertical" />

          <StatItem
            title={t("stats.clientsWorldwide")}
            amount={t("stats.clientsWorldwideAmount")}
            suffix={t("stats.clientsWorldwideSuffix")}
          />
        </div>
      </div>
    </div>
  );
}
