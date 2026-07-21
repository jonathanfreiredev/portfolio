"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { SectionHeader } from "@/components/home/section-header";
import { ImagePlaceholder } from "@/components/home/image-placeholder";

const PROJECT_SLUGS = ["lumen-void", "primary-form", "luma-wood", "silence-studio"] as const;

function ProjectCard({ index }: { index: number }) {
  const t = useTranslations(`home.projects.items.${index}`);

  return (
    <Link
      href={`/projects/${PROJECT_SLUGS[index]}`}
      className="group flex w-full flex-col gap-3 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="relative w-full">
        <ImagePlaceholder
          // TODO: reemplazar imagen
          label={t("title")}
          className="aspect-square w-full"
        />
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <span className="bg-foreground/45 px-3 py-1.5 text-tag text-background uppercase">
            {t("duration")}
          </span>
          <span className="bg-foreground/45 px-3 py-1.5 text-tag text-background uppercase">
            {t("tag")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <h3 className="text-h4 text-foreground uppercase">{t("title")}</h3>
      </div>
    </Link>
  );
}

export function Projects() {
  const t = useTranslations("home.projects");

  return (
    <section id="projects" className="flex w-full flex-col gap-12 md:gap-24">
      <SectionHeader title={t("title")} text={t("text")} />

      <div className="grid grid-cols-1 gap-x-2 gap-y-12 md:grid-cols-2 md:gap-x-2 md:gap-y-24">
        {PROJECT_SLUGS.map((_, i) => (
          <ProjectCard key={i} index={i} />
        ))}
      </div>
    </section>
  );
}
