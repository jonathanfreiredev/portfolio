"use client";

import { useTranslations } from "next-intl";
import { Plus } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

const QUESTION_COUNT = 6;

function FaqItem({ index }: { index: number }) {
  const t = useTranslations(`contact.faq.questions.${index}`);

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
  const t = useTranslations("contact.faq");

  return (
    <Reveal y={30} as="section" className="w-full">
      <div className="grid w-full grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 md:gap-y-24">
        <div className="flex w-full flex-col gap-6">
          <span className="text-tag-bold text-foreground uppercase">
            {t("badge")}
          </span>
          <h2 className="text-h2 text-foreground uppercase">{t("title")}</h2>
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
