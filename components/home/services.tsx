"use client";

import dynamic from "next/dynamic";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionHeader } from "@/components/home/section-header";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const ShaderBackground = dynamic(
  () => import("../shader-background").then((mod) => mod.ShaderBackground),
  { ssr: false }
);

const SERVICE_COUNT = 5;

function padIndex(n: number) {
  return String(n + 1).padStart(2, "0");
}

function ServiceRow({ index }: { index: number }) {
  const t = useTranslations(`home.services.items.${index}`);

  return (
    <AccordionItem value={`item-${index}`} className={cn("border-border")}>
      <AccordionTrigger
        icon="plus"
        className="text-left text-foreground uppercase hover:no-underline hover:opacity-50 hover:cursor-pointer"
      >
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full px-3 py-6">
          <span className="text-tag-bold text-foreground uppercase">
            {padIndex(index)}
          </span>
          <h4 className="sm:col-span-2 text-3xl md:text-4xl text-foreground uppercase">
            {t("title")}
          </h4>
        </div>
      </AccordionTrigger>
      <AccordionContent className="text-base text-foreground pl-3 pr-7 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full">
          <ul className="flex w-full flex-col gap-2">
            <li className="text-foreground">{t("listItem1")}</li>
            <li className="text-foreground">{t("listItem2")}</li>
            <li className="text-foreground">{t("listItem3")}</li>
          </ul>
          <div className="sm:col-span-2 w-full">
            <p className="w-full text-foreground">{t("text")}</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

export function Services() {
  const t = useTranslations("home.services");

  return (
    <section id="services" className="flex w-full flex-col gap-12 md:gap-24">
      <Reveal className="w-full">
        <div className="w-full h-32 md:h-64 lg:h-77 relative">
          <ShaderBackground />
        </div>
      </Reveal>

      <SectionHeader title={t("title")} text={t("text")} />

      <Accordion type="multiple" defaultValue={["item-0"]} className="w-full">
        {Array.from({ length: SERVICE_COUNT }).map((_, i) => (
          <ServiceRow key={i} index={i} />
        ))}
      </Accordion>

      <Reveal y={30} className="w-[70%] md:w-full">
        <div className="flex w-full flex-col justify-between gap-6 md:flex-row md:gap-8">
          <div className="flex w-full flex-col gap-2 max-w-100">
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
