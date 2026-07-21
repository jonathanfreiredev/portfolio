"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const QUESTION_COUNT = 6;

function InfoCard() {
  const t = useTranslations("home.faq.infoCard");

  return (
    <div className="flex w-full flex-col gap-4 border border-border bg-card p-6 md:p-8">
      <h3 className="text-h4 text-foreground uppercase">{t("title")}</h3>
      <p className="text-body-m text-foreground">{t("text")}</p>
      <div>
        <Button asChild>
          <Link href="/contact">{t("button")}</Link>
        </Button>
      </div>
    </div>
  );
}

function FaqItem({ index }: { index: number }) {
  const t = useTranslations(`home.faq.questions.${index}`);

  return (
    <AccordionItem
      value={`item-${index}`}
      className={cn("border-border")}
    >
      <AccordionTrigger className="text-left text-h4 text-foreground uppercase hover:no-underline">
        {t("question")}
        <Plus
          aria-hidden="true"
          className="pointer-events-none size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45"
        />
      </AccordionTrigger>
      <AccordionContent className="text-body-m text-foreground">
        {t("answer")}
      </AccordionContent>
    </AccordionItem>
  );
}

export function Faq() {
  const t = useTranslations("home.faq");

  return (
    <Reveal y={30} as="section" id="faq" className="w-full">
      <div className="grid w-full grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 md:gap-y-24">
        <div className="flex w-full flex-col gap-24">
          <div className="flex flex-col gap-6">
            <span className="text-tag-bold text-foreground uppercase">{t("badge")}</span>
            <h2 className="text-h2 text-foreground uppercase">{t("title")}</h2>
          </div>
          <InfoCard />
        </div>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-0"
          className="w-full"
        >
          {Array.from({ length: QUESTION_COUNT }).map((_, i) => (
            <FaqItem key={i} index={i} />
          ))}
        </Accordion>
      </div>
    </Reveal>
  );
}
