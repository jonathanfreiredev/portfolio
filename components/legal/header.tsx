"use client";

import { Reveal } from "@/components/motion/reveal";

type LegalHeaderProps = {
  title: string;
  description: string;
};

export function LegalHeader({ title, description }: LegalHeaderProps) {
  return (
    <Reveal
      as="header"
      trigger="mount"
      delay={0.2}
      y={60}
      className="mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-5 pt-32 pb-10 md:flex-row md:items-end md:justify-between md:gap-6 md:px-12 md:pt-32 md:pb-12 lg:px-20"
    >
      <h1 className="text-display-l text-foreground uppercase">{title}</h1>
      <p className="w-full max-w-[280px] text-body-m text-foreground md:self-end">
        {description}
      </p>
    </Reveal>
  );
}
