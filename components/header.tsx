"use client";

import { Reveal } from "@/components/motion/reveal";

type HeaderProps = {
  title: string;
  description: string;
};

export function Header({ title, description }: HeaderProps) {
  return (
    <Reveal
      as="section"
      trigger="mount"
      delay={0.2}
      y={60}
      className="mx-auto flex w-full flex-col gap-6 px-5 pb-10 md:flex-row md:items-end md:justify-between md:gap-6 md:px-12 md:pb-12 lg:px-20"
    >
      <h1 className="text-display-l text-foreground uppercase">{title}</h1>
      <p className="w-full max-w-[280px] text-body-m text-foreground md:self-end">
        {description}
      </p>
    </Reveal>
  );
}
