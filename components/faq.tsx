"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

const QUESTION_COUNT = 6;

function InfoCard() {
  const t = useTranslations("home.faq.infoCard");

  return (
    <div className="flex w-full flex-col gap-4 max-w-100 bg-card p-4 md:p-6">
      <h3 className="text-h4 text-foreground uppercase">{t("title")}</h3>
      <p className="text-body-m text-foreground">{t("text")}</p>
      <div>
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

function FaqItem({ index }: { index: number }) {
  const t = useTranslations(`home.faq.questions.${index}`);

  return (
    <AccordionItem value={`item-${index}`} className={cn("border-border")}>
      <AccordionTrigger
        icon="plus"
        className="text-left text-foreground uppercase hover:no-underline hover:opacity-50 hover:cursor-pointer"
      >
        <h6 className="text-lead px-3 py-5">{t("question")}</h6>
      </AccordionTrigger>
      <AccordionContent className="text-base pl-3 pr-7 pb-8">
        <p>{t("answer")}</p>
      </AccordionContent>
    </AccordionItem>
  );
}

interface FaqProps {
  withInfoCard?: Boolean;
}

export function Faq({ withInfoCard = true }: FaqProps) {
  const t = useTranslations("home.faq");

  return (
    <Reveal y={30} as="section" id="faq" className="w-full">
      <div className="grid w-full grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 md:gap-y-24">
        <div className="flex w-full flex-col gap-24">
          <div className="flex flex-col gap-6">
            <span className="text-tag-bold text-foreground/70 uppercase">
              {t("badge")}
            </span>
            <h2 className="text-display-s text-foreground uppercase">
              {t("title")}
            </h2>
          </div>
          {withInfoCard && (
            <div className="hidden md:flex">
              <InfoCard />
            </div>
          )}
        </div>

        <Accordion type="multiple" defaultValue={["item-0"]} className="w-full">
          {Array.from({ length: QUESTION_COUNT }).map((_, i) => (
            <FaqItem key={i} index={i} />
          ))}
        </Accordion>

        {withInfoCard && (
          <div className="md:hidden">
            <InfoCard />
          </div>
        )}
      </div>
    </Reveal>
  );
}
