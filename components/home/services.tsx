"use client";

import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { ImagePlaceholder } from "@/components/home/image-placeholder";
import { Divider } from "@/components/home/divider";

const SERVICE_COUNT = 5;

function padIndex(n: number) {
  return String(n + 1).padStart(2, "0");
}

function ServiceRow({ index }: { index: number }) {
  const t = useTranslations(`home.services.items.${index}`);

  return (
    <div className="flex w-full flex-col gap-14 py-6 md:py-6">
      <div className="flex w-full flex-col items-start justify-between gap-2 md:flex-row md:items-center md:gap-2">
        <div className="flex items-center gap-2">
          <span className="text-tag-bold text-foreground uppercase">{padIndex(index)}</span>
          <span className="text-tag text-foreground uppercase">·</span>
          <h3 className="text-h3 text-foreground uppercase">{t("title")}</h3>
        </div>
        <span aria-hidden="true" className="text-tag text-foreground uppercase md:self-end">
          ↗
        </span>
      </div>

      <div className="flex w-full flex-col gap-12 md:flex-row md:gap-8">
        <ul className="flex w-full flex-col gap-2 md:w-1/2">
          <li className="text-body-m text-foreground">{t("listItem1")}</li>
          <li className="text-body-m text-foreground">{t("listItem2")}</li>
          <li className="text-body-m text-foreground">{t("listItem3")}</li>
        </ul>
        <p className="w-full text-body-m text-foreground md:w-3/4">{t("text")}</p>
      </div>
    </div>
  );
}

export function Services() {
  const t = useTranslations("home.services");

  return (
    <section id="services" className="flex w-full flex-col gap-12 md:gap-24">
      <Reveal className="w-full">
        <ImagePlaceholder
          // TODO: reemplazar imagen
          label="Services visual placeholder"
          className="h-32 w-full md:h-64 lg:h-77"
        />
      </Reveal>

      <SectionHeader title={t("title")} text={t("text")} />

      <div className="flex w-full flex-col">
        {Array.from({ length: SERVICE_COUNT }).map((_, i) => (
          <div key={i} className="flex flex-col">
            {i > 0 ? <Divider /> : null}
            <ServiceRow index={i} />
          </div>
        ))}
        <Divider />
      </div>

      <Reveal y={30} className="w-full">
        <div className="flex w-full flex-col items-stretch gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex w-full flex-col gap-2 md:w-3/4">
            <p className="text-body-l text-foreground">{t("infoCard.text")}</p>
          </div>
          <Button asChild>
            <Link href="/contact" className="inline-flex items-center gap-2">
              {t("infoCard.button")}
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
