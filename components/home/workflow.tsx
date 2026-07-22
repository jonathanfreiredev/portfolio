"use client";

import { Fragment } from "react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeader } from "@/components/home/section-header";
import { ImagePlaceholder } from "@/components/home/image-placeholder";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";

const STEP_COUNT = 4;

const STEP_TOP_PADDING = ["pt-5", "md:pt-28", "md:pt-50", "md:pt-72"] as const;

function StepMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-tag text-muted-foreground uppercase">{label}</span>
      <span className="text-tag-bold text-foreground uppercase">{value}</span>
    </div>
  );
}

function StepCard({ index }: { index: number }) {
  const t = useTranslations(`home.workflow.steps.${index}`);
  const percent = (index + 1) * 25;

  return (
    <Reveal
      y={30}
      className={cn(
        "flex w-full flex-1 flex-col items-start gap-2.5 px-4 pb-6",
        STEP_TOP_PADDING[index],
      )}
    >
      <ImagePlaceholder
        // TODO: reemplazar imagen
        label={t("title")}
        className="aspect-square w-full max-w-40"
      />
      <div className="flex w-full flex-col gap-4">
        <h3 className="text-h4 text-foreground uppercase">{t("title")}</h3>
        <p className="text-body-m text-foreground">{t("text")}</p>
        <Progress value={percent} />
      </div>
    </Reveal>
  );
}

function StepDivider({ className }: React.ComponentProps<"div">) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "h-px w-full my-10 bg-border md:h-auto md:w-px md:self-stretch md:my-0",
        className,
      )}
    />
  );
}

export function Workflow() {
  const t = useTranslations("home.workflow");

  return (
    <section id="workflow" className="flex w-full flex-col gap-12 md:gap-24">
      <SectionHeader title={t("title")} text={t("text")} />

      <Reveal y={30} className="flex w-full flex-wrap items-center gap-2.5">
        <StepMeta label={t("processLabel")} value={t("processValue")} />
        <span
          aria-hidden="true"
          className="hidden h-3 w-px bg-border md:block"
        />
        <StepMeta label={t("durationLabel")} value={t("durationValue")} />
      </Reveal>

      <div className="flex flex-col md:flex-row md:items-stretch">
        <StepDivider className="hidden md:flex" />

        {Array.from({ length: STEP_COUNT }).map((_, i) => (
          <Fragment key={i}>
            <StepCard index={i} />
            {i < STEP_COUNT - 1 && <StepDivider />}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
