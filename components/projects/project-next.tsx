import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { CloudinaryImage } from "@/components/projects/cloudinary-image";
import { Link } from "@/i18n/navigation";
import type { ProjectSummary } from "@/lib/projects";
import { cn } from "@/lib/utils";

type ProjectNextProps = {
  project: ProjectSummary;
  locale: string;
};

export async function ProjectNext({ project, locale }: ProjectNextProps) {
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <section className="w-full border-t border-primary/10 pt-12">
      <Link
        href={`/projects/${project.meta.slug}`}
        className="group grid gap-6 md:grid-cols-[220px_1fr] md:items-center"
      >
        <div className="relative aspect-square overflow-hidden border border-primary/10">
          <CloudinaryImage
            src={project.meta.cover}
            alt={project.title}
            fill
            sizes="220px"
            className="object-cover transition-transform duration-300 ease-out motion-safe:group-hover:scale-[1.02]"
          />
          <div className="absolute left-1/2 top-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] backdrop-blur-lg lg:size-20">
            {project.meta.slug === "modern-nextjs-stack" ? (
              <div className="w-full p-3 text-center text-[0.7rem] leading-tight text-white/90">
                <p>Modern</p>
                <p className="font-bold">Next.js</p>
                <p>Stack</p>
              </div>
            ) : (
              <CloudinaryImage
                src={project.meta.logo}
                alt=""
                fill
                sizes="80px"
                className={cn(
                  "object-contain p-3",
                  (project.meta.slug === "wandace" ||
                    project.meta.slug === "foodie") &&
                    "p-4",
                )}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <span className="text-eyebrow uppercase text-muted-foreground">
            {t("nextProject")}
          </span>
          <span className="text-display-s text-foreground">{project.title}</span>
          <p className="max-w-[60ch] text-body-l text-foreground/70">
            {project.tagline}
          </p>
          <span className="inline-flex items-center gap-2 text-tag uppercase text-foreground">
            {t("viewCase")}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </section>
  );
}
