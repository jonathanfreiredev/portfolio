import { getTranslations } from "next-intl/server";

import { Reveal } from "@/components/motion/reveal";
import type { Project } from "@/lib/projects";

type ProjectMetaStripProps = {
  project: Project;
  locale: string;
};

export async function ProjectMetaStrip({
  project,
  locale,
}: ProjectMetaStripProps) {
  const t = await getTranslations({ locale, namespace: "projects.meta" });

  const items = [
    { label: t("role"), value: project.role },
    { label: t("timeline"), value: project.timeline },
    { label: t("for"), value: project.context },
    { label: t("status"), value: project.statusLabel },
  ].filter((item) => item.value);

  if (!items.length) return null;

  return (
    <Reveal as="section" className="w-full">
      <dl className="grid grid-cols-2 gap-px border border-primary/10 bg-primary/10 md:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 bg-background p-5"
          >
            <dt className="text-eyebrow uppercase text-muted-foreground">
              {item.label}
            </dt>
            <dd className="text-body-s text-foreground">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Reveal>
  );
}
