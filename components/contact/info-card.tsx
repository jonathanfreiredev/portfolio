"use client";

import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";

export function InfoCard() {
  const t = useTranslations("contact.info");

  return (
    <Reveal
      y={30}
      className="flex h-full w-full flex-col gap-6 border border-border bg-card p-6 md:p-8"
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
        {/* TODO: reemplazar con embed real de Google Maps (Berlin, Germany) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.85),rgba(0,0,0,0.95))]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-background">
            <span className="text-tag-bold uppercase">
              {t("locationValue")}
            </span>
            <span className="text-caption text-background/60">
              {t("mapAlt")}
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
