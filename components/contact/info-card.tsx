"use client";

import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

export function InfoCard() {
  const t = useTranslations("contact.info");

  return (
    <Reveal
      y={30}
      className="flex h-full w-full flex-col gap-6 bg-neutral-100 dark:bg-neutral-900 p-6 md:p-8"
    >
      <div className="flex w-full flex-col gap-6">
        <div className="flex w-full items-center justify-between gap-1 overflow-clip">
          <span className="text-tag text-muted-foreground uppercase">
            {t("emailLabel")}
          </span>
          <a
            href={`mailto:${t("emailValue")}`}
            target="_blank"
            rel="noreferrer"
            className="text-body-s text-foreground underline-offset-4 hover:opacity-70 hover:underline"
          >
            {t("emailValue")}
          </a>
        </div>

        <hr
          className="w-full border-0 border-t border-border"
          aria-hidden="true"
        />

        <div className="flex w-full items-center justify-between gap-1">
          <span className="text-tag text-muted-foreground uppercase">
            {t("locationLabel")}
          </span>
          <span className="text-tag-bold text-foreground uppercase">
            {t("locationValue")}
          </span>
        </div>
      </div>

      <div
        className="relative w-full flex-1 overflow-hidden border border-border bg-muted"
        style={{ minHeight: "260px" }}
      >
        <Map />
      </div>
    </Reveal>
  );
}
