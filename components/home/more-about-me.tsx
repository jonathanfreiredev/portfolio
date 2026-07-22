"use client";

import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { AboutIntro } from "./about-intro";
import { Stats } from "../stats";

export function MoreAboutMe() {
  const t = useTranslations("home.moreAboutMe");

  return (
    <Reveal as="section" id="studio" y={30} className="w-full">
      <div className="flex w-full flex-col">
        <AboutIntro translations="home.moreAboutMe" />

        <div className="grid grid-cols-1 gap-x-2 md:grid-cols-2">
          <div className="hidden md:block md:h-25" aria-hidden="true" />

          <Stats />
        </div>
      </div>
    </Reveal>
  );
}
